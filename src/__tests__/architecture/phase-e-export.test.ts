/**
 * Architecture Source-Scan — Phase E Export Safety Gates
 *
 * Pre-registered gate tests for the Phase E (Astro/React export) layer.
 * Uses the adaptive-skip pattern: tests skip with a clear log if target
 * directories don't exist yet, and activate automatically when Phase E
 * implementation begins.
 *
 * ENFORCED CONSTRAINTS:
 *
 * 1. No `tsc` or `ts-morph` invocations in publisher code.
 *    Type correctness is guaranteed by code-gen templates. Invoking `tsc`
 *    at export time adds 5–30s to the user-facing export flow, violating the
 *    < 2s ZIP export budget (Contribution #424 / Guideline #311).
 *
 * 2. No synchronous JSZip in publisher hot paths.
 *    JSZip's sync API blocks the main thread during ZIP generation.
 *    Phase E must use fflate (async) with Promise.all across pages
 *    (Contribution #424, Guideline #311, < 2s for 10-page project).
 *
 * 3. `toJsx()` must only be called inside a `module.trusted` guard.
 *    Already enforced in no-tojsx-untrusted.test.ts (Contribution #398).
 *    This file adds the performance-oriented gates only.
 *
 * 4. No `toJsxCache` — export is one-shot.
 *    A module-level cache for toJsx() output wastes memory for an operation
 *    that runs once per export click. Only the per-render LRU cache (Guideline #307)
 *    is permitted; the export path must NOT add a second long-lived cache.
 *
 * @see Contribution #424 — Phase E Performance Spec (Performance Engineer)
 * @see Guideline #311 — Phase E merge gate (Performance Engineer)
 * @see Contribution #398 / no-tojsx-untrusted.test.ts — CWE-94 trust gate
 * @see Constraints #288–#293 — Phase E security constraints
 * @see Constraints #303, #304 — ReactPublisher code-gen security (Architect #418)
 */

import { describe, it, expect } from 'bun:test'
import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const SRC_ROOT = join(import.meta.dir, '../../')
const ASTRO_PUBLISHER_DIR = join(SRC_ROOT, 'core/astro-publisher')
const REACT_PUBLISHER_DIR = join(SRC_ROOT, 'core/react-publisher')

const PHASE_E_IMPLEMENTED =
  existsSync(ASTRO_PUBLISHER_DIR) || existsSync(REACT_PUBLISHER_DIR)

// ---------------------------------------------------------------------------
// File walker — same helper pattern as no-tojsx-untrusted.test.ts
// ---------------------------------------------------------------------------

function collectTs(dir: string): string[] {
  const results: string[] = []
  if (!existsSync(dir)) return results
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...collectTs(full))
    } else if (['.ts', '.tsx'].includes(extname(entry))) {
      results.push(full)
    }
  }
  return results
}

function publisherFiles(): string[] {
  return [
    ...collectTs(ASTRO_PUBLISHER_DIR),
    ...collectTs(REACT_PUBLISHER_DIR),
  ]
}

// ---------------------------------------------------------------------------
// Gate 1: No tsc or ts-morph invocations in publisher code
//
// Context: Contribution #424 (Phase E Perf Spec), Guideline #311.
// Type correctness is guaranteed by code-gen templates (Constraint #303).
// Running `tsc` at export time adds 5–30s — far over the 2s budget.
// ts-morph also invokes the TypeScript compiler pipeline internally.
// ---------------------------------------------------------------------------

describe('Phase E — No tsc/ts-morph in publisher code (Guideline #311)', () => {
  it('[pre-registered] publisher files must not invoke tsc or ts-morph', () => {
    if (!PHASE_E_IMPLEMENTED) {
      console.log(
        '[PhaseE gate] astro-publisher/react-publisher not yet created — ' +
        'tsc/ts-morph prohibition gate pre-registered (Contribution #424 / Guideline #311)'
      )
      expect(true).toBe(true)
      return
    }

    // Patterns that indicate a tsc or ts-morph invocation
    // Matches: execSync('tsc'), spawnSync('tsc'), 'tsc ', require('ts-morph'), import('ts-morph')
    const TSC_PATTERNS = [
      /\btsc\b/,              // direct tsc reference
      /ts-morph/,             // ts-morph import/require
      /typescript['"]?\s*\)\.compile/, // typescript API compile()
    ]

    const violations: string[] = []

    for (const file of publisherFiles()) {
      let src: string
      try { src = readFileSync(file, 'utf8') } catch { continue }

      // Skip type-only references (import type { ... } from 'typescript')
      const lines = src.split('\n')
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmed = line.trim()
        // Skip comment lines and import-type lines
        if (/^\s*(\/\/|\*)/.test(line)) continue
        if (/^\s*import\s+type\b/.test(line)) continue

        if (TSC_PATTERNS.some((re) => re.test(trimmed))) {
          const rel = file.replace(SRC_ROOT, 'src/')
          violations.push(`${rel}:${i + 1} — tsc/ts-morph invocation detected`)
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        '[Phase E perf / Guideline #311] tsc or ts-morph found in publisher code.\n' +
        'Type correctness is guaranteed by code-gen templates (Constraint #303).\n' +
        'Invoking tsc at export time adds 5–30s and violates the < 2s ZIP export budget.\n' +
        'Remove all tsc/ts-morph calls from the export pipeline.\n' +
        'Violations:\n' +
        violations.map((v) => `  ${v}`).join('\n')
      )
    }

    expect(violations).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// Gate 2: No synchronous JSZip in publisher hot paths
//
// Context: Contribution #424 (Phase E Perf Spec), Guideline #311.
// JSZip's sync API (`generateSync`, `JSZip()`) blocks the main thread.
// Phase E must use fflate with Promise.all (async, < 2s for 10 pages).
// JSZip itself is banned; fflate's async API is the approved approach.
// ---------------------------------------------------------------------------

describe('Phase E — No synchronous JSZip in publisher (Guideline #311)', () => {
  it('[pre-registered] publisher files must not import or use jszip', () => {
    if (!PHASE_E_IMPLEMENTED) {
      console.log(
        '[PhaseE gate] astro-publisher/react-publisher not yet created — ' +
        'jszip prohibition gate pre-registered (Contribution #424 / Guideline #311)'
      )
      expect(true).toBe(true)
      return
    }

    // Detect any jszip import (sync or async — both are banned; use fflate)
    const JSZIP_RE = /['"`]jszip['"`]/i

    const violations: string[] = []
    for (const file of publisherFiles()) {
      let src: string
      try { src = readFileSync(file, 'utf8') } catch { continue }

      if (JSZIP_RE.test(src)) {
        const rel = file.replace(SRC_ROOT, 'src/')
        violations.push(`${rel} — imports jszip (use fflate + Promise.all instead)`)
      }
    }

    if (violations.length > 0) {
      throw new Error(
        '[Phase E perf / Guideline #311] jszip detected in publisher code.\n' +
        'jszip\'s sync API blocks the main thread; its async API is also slower than fflate.\n' +
        'Use fflate with Promise.all for < 2s ZIP export across 10 pages.\n' +
        'See Contribution #424 (Phase E Perf Spec).\n' +
        'Violations:\n' +
        violations.map((v) => `  ${v}`).join('\n')
      )
    }

    expect(violations).toHaveLength(0)
  })

  it('[pre-registered] publisher files must not call generateSync (JSZip sync API)', () => {
    if (!PHASE_E_IMPLEMENTED) {
      expect(true).toBe(true)
      return
    }

    const GENERATE_SYNC_RE = /\.generateSync\s*\(/

    const violations: string[] = []
    for (const file of publisherFiles()) {
      let src: string
      try { src = readFileSync(file, 'utf8') } catch { continue }

      if (GENERATE_SYNC_RE.test(src)) {
        const rel = file.replace(SRC_ROOT, 'src/')
        violations.push(`${rel} — calls .generateSync() (synchronous ZIP — blocks main thread)`)
      }
    }

    if (violations.length > 0) {
      throw new Error(
        '[Phase E perf] .generateSync() detected in publisher.\n' +
        'Synchronous ZIP generation blocks the main thread for 100ms–2s on a 10-page project.\n' +
        'Use fflate\'s async strToU8 + zip/zipSync only in a worker, or use fflate async API.\n' +
        'Violations:\n' +
        violations.map((v) => `  ${v}`).join('\n')
      )
    }

    expect(violations).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// Gate 3: No toJsxCache — export is one-shot
//
// Context: Contribution #424 (Phase E Perf Spec), Guideline #311.
// A module-level cache for toJsx() output wastes memory for a one-shot
// operation (one export per user click). Only the per-render LRU cache
// (Guideline #307, Phase 1) is permitted.
// ---------------------------------------------------------------------------

describe('Phase E — No toJsxCache (one-shot export, Guideline #311)', () => {
  it('[pre-registered] publisher files must not define a toJsxCache variable', () => {
    if (!PHASE_E_IMPLEMENTED) {
      console.log(
        '[PhaseE gate] astro-publisher/react-publisher not yet created — ' +
        'toJsxCache prohibition gate pre-registered (Contribution #424 / Guideline #311)'
      )
      expect(true).toBe(true)
      return
    }

    // Catches: toJsxCache, toJSXCache, toJsxCacheMap, etc.
    const TOJSX_CACHE_RE = /toJsx\s*[Cc]ache|toJSX\s*[Cc]ache/

    const violations: string[] = []
    for (const file of publisherFiles()) {
      let src: string
      try { src = readFileSync(file, 'utf8') } catch { continue }

      if (TOJSX_CACHE_RE.test(src)) {
        const rel = file.replace(SRC_ROOT, 'src/')
        violations.push(`${rel} — defines a toJsxCache (export is one-shot, caching wastes memory)`)
      }
    }

    if (violations.length > 0) {
      throw new Error(
        '[Phase E perf / Guideline #311] toJsxCache found in publisher code.\n' +
        'Export is one-shot (one click → one ZIP). A module-level toJsx cache\n' +
        'persists stale output across exports and wastes memory.\n' +
        'The approved cache (Phase 1, Guideline #307) is for editor render(), not export.\n' +
        'Violations:\n' +
        violations.map((v) => `  ${v}`).join('\n')
      )
    }

    expect(violations).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// Gate 4: Static Astro pages must not emit hydration directives unless
//         requiresHydration() returns true (0 KB JS budget)
//
// Context: Contribution #424, Guideline #311.
// Every unnecessary `client:*` directive ships ~5 KB of Astro runtime to
// the user's built page. The 0 KB JS budget is the default; hydration is
// opt-in per module via `requiresHydration()`.
// ---------------------------------------------------------------------------

describe('Phase E — client:* directives must use requiresHydration() gate (Guideline #311)', () => {
  it('[pre-registered] AstroPublisher must call requiresHydration() before emitting client: directives', () => {
    if (!PHASE_E_IMPLEMENTED) {
      console.log(
        '[PhaseE gate] astro-publisher not yet created — ' +
        'requiresHydration() gate pre-registered (Contribution #424 / Guideline #311)'
      )
      expect(true).toBe(true)
      return
    }

    const astroFiles = collectTs(ASTRO_PUBLISHER_DIR)

    // If any astro-publisher file emits a client: directive, the same file
    // (or a direct dependency in the same dir) must reference requiresHydration
    const CLIENT_DIRECTIVE_RE = /['"`]client:[a-z]+['"`]|client:load|client:idle|client:visible/
    const REQUIRES_HYDRATION_RE = /requiresHydration/

    const violatingFiles: string[] = []
    const allSrc = astroFiles.map((f) => {
      try { return { file: f, src: readFileSync(f, 'utf8') } } catch { return null }
    }).filter(Boolean) as Array<{ file: string; src: string }>

    const anyHasHydration = allSrc.some((f) => REQUIRES_HYDRATION_RE.test(f.src))

    for (const { file, src } of allSrc) {
      if (CLIENT_DIRECTIVE_RE.test(src) && !anyHasHydration) {
        violatingFiles.push(file.replace(SRC_ROOT, 'src/'))
      }
    }

    if (violatingFiles.length > 0) {
      throw new Error(
        '[Phase E perf / Guideline #311] client:* directive emitted without requiresHydration() check.\n' +
        'Every client:* directive ships Astro hydration runtime JS to the built page.\n' +
        'Default budget: 0 KB JS. Opt-in: requiresHydration() → true in module definition.\n' +
        'Pattern: if (module.requiresHydration?.()) { emit client:load } else { static }\n' +
        'Violating files:\n' +
        violatingFiles.map((v) => `  ${v}`).join('\n')
      )
    }

    expect(violatingFiles).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// Gate 5: scaffold.ts App.tsx template must use React.lazy + Suspense
//
// Context: Task #335 (Performance Engineer review of Contribution #459).
// Guideline #311 requires pages to be React.lazy-loaded so each page's JS
// only downloads when the user navigates to it. Static imports collapse all
// page code into a single bundle — for a 20-page project this is 3–5× the
// initial bundle weight compared to lazy loading.
//
// Detection: source-scan scaffold.ts for the React.lazy(() => import(...))
// pattern in the generated App.tsx template string. Since scaffold.ts emits
// a string, we verify the *template source* contains the lazy pattern.
//
// @see Task #335 — Phase E gate: generated App.tsx must use React.lazy
// @see Guideline #311 — Phase E Performance Patterns
// @see Contribution #459 — Phase E ReactPublisher implementation
// ---------------------------------------------------------------------------

const SCAFFOLD_PATH = join(SRC_ROOT, 'core/react-publisher/scaffold.ts')

describe('Phase E Gate 5 — scaffold.ts App.tsx template uses React.lazy (Task #335 / Guideline #311)', () => {
  it('[Task #335] scaffold.ts must generate React.lazy page imports (not static)', () => {
    if (!existsSync(SCAFFOLD_PATH)) {
      console.log(
        '[PhaseE gate] scaffold.ts not yet created — ' +
        'React.lazy page-splitting gate pre-registered (Task #335 / Guideline #311)'
      )
      expect(true).toBe(true)
      return
    }

    const src = readFileSync(SCAFFOLD_PATH, 'utf8')

    // The generated App.tsx template must use React.lazy for page components.
    // Static imports collapse all page code into one bundle regardless of navigation.
    expect(src).toMatch(/React\.lazy\s*\(/)

    // Static page imports are forbidden — they defeat lazy loading entirely.
    // Pattern: `import ComponentName from './pages/ComponentName'` must not appear
    // in the generated App.tsx template string.
    const staticImportInTemplate = /`[^`]*import\s+\w+\s+from\s+'\.\/pages\//s
    expect(src).not.toMatch(staticImportInTemplate)
  })

  it('[Task #335] scaffold.ts must wrap lazy page routes in Suspense', () => {
    if (!existsSync(SCAFFOLD_PATH)) {
      expect(true).toBe(true)
      return
    }

    const src = readFileSync(SCAFFOLD_PATH, 'utf8')

    // React.lazy() components must be wrapped in a Suspense boundary.
    // Without Suspense, React throws when the lazy component hasn't resolved yet.
    expect(src).toMatch(/Suspense/)
  })
})
