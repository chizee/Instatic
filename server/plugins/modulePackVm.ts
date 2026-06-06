/**
 * Plugin module pack sandbox — server-side.
 *
 * Plugins that declare `entrypoints.modules` ship a bundle whose default
 * export is an array of `PluginModuleDefinition` objects (or a function
 * returning one). Each definition has a `render(props, children) => { html, css }`
 * that the publisher invokes per canvas node during page generation.
 *
 * Before this module existed, the host loaded module packs via
 * `await import(dataUrl)` — running the bundle in-host with full Bun/Node
 * privileges. That was a complete RCE bypass: a malicious plugin could put
 * its payload in `entrypoints.modules` and skip the server-entrypoint
 * sandbox entirely. This file closes that hole by running the module pack
 * inside a QuickJS-WASM context exactly like server entrypoints.
 *
 * What runs inside the VM:
 *   - The pack's bundled JS (wrapped to attach to `globalThis.__module_pack`)
 *   - The pack's `render()` functions, invoked per node during publish
 *
 * What stays in the host:
 *   - Module metadata (id, name, schema, defaults, htmlTag, …) — copied out
 *     as JSON-serializable values at activation time
 *   - The host's `ModuleDefinition` wrapping (registry, error boundaries,
 *     React component factory for editor preview — already host-only)
 *
 * Performance note: render is called possibly hundreds of times per publish.
 * Each call is a sync QuickJS eval — sub-millisecond on typical hardware.
 * Publishes are background jobs; the cost is acceptable.
 */

import { getQuickJS, shouldInterruptAfterDeadline, type QuickJSContext, type QuickJSWASMModule } from 'quickjs-emscripten'
import { MODULE_PACK_BOOTSTRAP_SOURCE } from './quickjs/bootstrap/generated/modulePackBootstrap'

// ---------------------------------------------------------------------------
// Resource limits — defense against runaway module-pack code.
//
// Mirrors the limits applied to full plugin VMs in quickjsHost.ts. The eval
// deadline is shorter (2 s vs 5 s) because render() functions are simple
// synchronous transforms with no host I/O — 2 s is still generous.
// ---------------------------------------------------------------------------

/** 64 MB max heap per module-pack VM. */
const DEFAULT_MEMORY_LIMIT_BYTES = 64 * 1024 * 1024
/** 1 MB max stack — plenty for render(), fatal for runaway recursion. */
const DEFAULT_STACK_SIZE_BYTES = 1 * 1024 * 1024
/**
 * 2 second wall-clock deadline per eval call. Set BEFORE each evalCode /
 * evalString invocation and cleared in a finally block after it returns.
 */
const DEFAULT_EVAL_TIMEOUT_MS = 2_000

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * Render output — must match `PluginRenderOutput` in the SDK. We restate it
 * here so this file stays free of the SDK dependency graph; mismatches would
 * be caught by the type system at the call site.
 */
export interface ModulePackRenderOutput {
  html: string
  css?: string
}

/**
 * Module metadata as it exits the VM. Mirrors `PluginModuleDefinition` minus
 * the function fields (`render`, `preview`) — those live inside the VM and
 * are invoked through `vm.render(...)` / `vm.preview(...)`.
 *
 * `dependencies` and `editorRuntime` are both JSON-serializable shapes
 * declared by plugin modules (see `PluginModuleDependencies` /
 * `PluginEditorRuntime` in the SDK). They cross the VM boundary so the host
 * can write deps into the site's package.json and wire up the editor
 * iframe preview's import map.
 */
export interface SerializedModuleDefinition {
  id: string
  name: string
  description?: string
  category: string
  version: string
  defaults: Record<string, unknown>
  schema: Record<string, unknown>
  canHaveChildren?: boolean
  htmlTag?: string
  hasPreview: boolean
  dependencies?: Record<string, string | { version: string; dev?: boolean }>
  editorRuntime?: { sandbox?: { source: string; minHeight?: number } }
}

export interface ModulePackVm {
  readonly pluginId: string
  readonly modules: ReadonlyArray<SerializedModuleDefinition>
  render(moduleId: string, props: Record<string, unknown>, children: string[]): ModulePackRenderOutput
  preview(moduleId: string, props: Record<string, unknown>, children: string[]): ModulePackRenderOutput
  dispose(): void
}

// ---------------------------------------------------------------------------
// Singleton WASM module — shared with quickjsHost.ts's singleton via the
// quickjs-emscripten library's own module cache (`getQuickJS()` returns the
// shared instance). Each ModulePackVm gets its own context.
// ---------------------------------------------------------------------------

let wasmModulePromise: Promise<QuickJSWASMModule> | null = null

function getWasmModule(): Promise<QuickJSWASMModule> {
  if (!wasmModulePromise) wasmModulePromise = getQuickJS()
  return wasmModulePromise
}

// ---------------------------------------------------------------------------
// Source shim — convert raw ESM exports (any of the forms Bun's bundler
// emits) into a `globalThis.__module_pack = ...` assignment that the
// bootstrap can read. Matches the shim in `pluginWorker.ts`.
//
// Two forms cover everything the SDK build pipeline produces today:
//
//   1. `export default <expr>`              — direct default export
//   2. `export { <ident> as default[, …] }` — Bun bundles default RE-exports
//      this way when the facade does `import __default from …; export
//      default __default`. The named-export block is dropped wholesale —
//      QuickJS has no module loader, so no one imports those names.
// ---------------------------------------------------------------------------

function ensureModulePackIifeForm(source: string): string {
  if (source.includes('__module_pack')) return source

  let transformed = source.replace(
    /^([ \t]*)export\s+default\s+/gm,
    '$1globalThis.__module_pack = ',
  )

  transformed = transformed.replace(
    /^([ \t]*)export\s*\{[^}]*?([A-Za-z_$][\w$]*)\s+as\s+default[^}]*\}\s*;?/gm,
    '$1globalThis.__module_pack = $2;',
  )

  return `;(function () {\n${transformed}\n})();\n`
}

// ---------------------------------------------------------------------------
// Bootstrap source — initializes the pack and exposes invocation entries
// (__initPack, __renderModule, __previewModule + a silent console stub).
//
// Authored as real TypeScript in `quickjs/bootstrap/src/modulePackRuntime.ts`
// and bundled to the committed string `MODULE_PACK_BOOTSTRAP_SOURCE` by
// `scripts/sync-plugin-bootstrap.ts` (regenerate with `bun run bootstrap:sync`).
// The shared host⇄VM JSON marshaling (`bootstrap/src/boundary.ts`) is inlined
// into both this and the full-plugin bootstrap — one source-level definition.
//
// The leading `'use strict';` makes the whole evaluated program strict,
// matching the original inline bootstrap.
// ---------------------------------------------------------------------------

const BOOTSTRAP_SOURCE = `'use strict';\n` + MODULE_PACK_BOOTSTRAP_SOURCE

// ---------------------------------------------------------------------------
// VM construction
// ---------------------------------------------------------------------------

/**
 * Build a sandboxed module pack VM from the pack's bundled source.
 *
 * Throws if the pack's bootstrap or default-export resolution fails — the
 * caller (lifecycle handler) should mark the plugin's `lifecycleStatus` as
 * `error` and surface the message.
 */
export async function createModulePackVm(args: {
  pluginId: string
  packSource: string
}): Promise<ModulePackVm> {
  const wasm = await getWasmModule()
  const ctx = wasm.newContext()

  // Apply per-VM resource limits before any plugin code runs.
  // setMemoryLimit / setMaxStackSize bind to the runtime; each newContext()
  // creates its own runtime, so these limits are effectively per-VM.
  ctx.runtime.setMemoryLimit(DEFAULT_MEMORY_LIMIT_BYTES)
  ctx.runtime.setMaxStackSize(DEFAULT_STACK_SIZE_BYTES)

  try {
    // Evaluate the pack — IIFE wrap maps `export default ...` to a
    // `globalThis.__module_pack = ...` assignment.
    const wrappedSource = ensureModulePackIifeForm(args.packSource)
    withSyncDeadline(ctx, DEFAULT_EVAL_TIMEOUT_MS, () => {
      ctx.unwrapResult(ctx.evalCode(wrappedSource, `module-pack:${args.pluginId}`)).dispose()
    })

    // Then the bootstrap (defines __initPack, __renderModule, __previewModule).
    withSyncDeadline(ctx, DEFAULT_EVAL_TIMEOUT_MS, () => {
      ctx.unwrapResult(ctx.evalCode(BOOTSTRAP_SOURCE, 'modulepack-bootstrap.js')).dispose()
    })

    // Initialize the pack — pulls metadata out, builds the id-keyed lookup.
    const modulesJson = evalString(
      ctx,
      `JSON.stringify(__initPack(${JSON.stringify(args.pluginId)}))`,
    )
    const modules = JSON.parse(modulesJson) as SerializedModuleDefinition[]

    const pluginId = args.pluginId

    return {
      pluginId,
      modules,

      render(moduleId, props, children) {
        const propsJson = JSON.stringify(props)
        const childrenJson = JSON.stringify(children)
        const code = `__renderModule(${JSON.stringify(moduleId)}, ${JSON.stringify(propsJson)}, ${JSON.stringify(childrenJson)})`
        const result = evalString(ctx, code)
        return JSON.parse(result) as ModulePackRenderOutput
      },

      preview(moduleId, props, children) {
        const propsJson = JSON.stringify(props)
        const childrenJson = JSON.stringify(children)
        const code = `__previewModule(${JSON.stringify(moduleId)}, ${JSON.stringify(propsJson)}, ${JSON.stringify(childrenJson)})`
        const result = evalString(ctx, code)
        return JSON.parse(result) as ModulePackRenderOutput
      },

      dispose() {
        try { ctx.dispose() } catch {/* already disposed */}
      },
    }
  } catch (err) {
    try { ctx.dispose() } catch {/* ignore */}
    throw err
  }
}

// ---------------------------------------------------------------------------
// Deadline guard — installs a wall-clock interrupt handler on the runtime
// for the duration of one synchronous eval, then removes it. The QuickJS VM
// cooperatively polls the interrupt flag during execution; plugin code stuck
// in a tight loop is aborted within the deadline.
//
// Sync variant of quickjsHost.ts's `withDeadline` — no async pump needed
// because module-pack render() functions are fully synchronous.
// ---------------------------------------------------------------------------

function withSyncDeadline<T>(ctx: QuickJSContext, timeoutMs: number, body: () => T): T {
  const deadline = Date.now() + timeoutMs
  ctx.runtime.setInterruptHandler(shouldInterruptAfterDeadline(deadline))
  try {
    return body()
  } finally {
    try { ctx.runtime.removeInterruptHandler() } catch { /* runtime may already be disposed */ }
  }
}

// ---------------------------------------------------------------------------
// Sync eval helper — module pack code is fully synchronous (no host calls,
// no Promises). One-shot evalCode + getString is enough. Each call is wrapped
// in a wall-clock deadline so a runaway render() is aborted cleanly.
// ---------------------------------------------------------------------------

function evalString(ctx: QuickJSContext, code: string): string {
  return withSyncDeadline(ctx, DEFAULT_EVAL_TIMEOUT_MS, () => {
    const result = ctx.evalCode(code, 'modulepack-eval.js')
    const handle = ctx.unwrapResult(result)
    try {
      return ctx.getString(handle)
    } finally {
      handle.dispose()
    }
  })
}
