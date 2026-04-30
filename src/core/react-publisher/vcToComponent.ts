/**
 * vcToComponent — Visual Component → .tsx source generator (Task #439)
 *
 * Architecture source: Contribution #619 §7
 *
 * Converts a VisualComponent canvas tree into a self-contained .tsx file that
 * exports a typed React functional component:
 *
 *   export interface CardProps { title?: string; image?: string }
 *   export default function Card(props: CardProps) { return <...> }
 *
 * Prop binding substitution (Contribution #619 §4 Option β):
 * - Nodes with propBindings emit bound props as {props.paramName} expressions
 *   instead of literal values.
 * - Implemented via sentinel injection + post-processing string replacement
 *   so existing module toJsx() functions need no modification.
 *
 * Topological sort (topoSortVCs):
 * - VCs are sorted so dependencies emit before dependents.
 * - Cycle-free guaranteed by the slice's recursion guard (Contribution #619 §3).
 *
 * Isolation (Constraint #269): MUST NOT import from src/editor/ or src/core/editor-store/.
 */

import type { IModuleRegistry } from '../module-engine/types'
import type { VisualComponent, VCParam } from '../visualComponents/types'
import type { Page, Project } from '../page-tree/types'
import { nodeToJsx } from './nodeToJsx'
import { RESERVED_JS_KEYWORDS } from '../visualComponents/nameValidation'

// ---------------------------------------------------------------------------
// Sentinel — marks bound prop values for post-processing replacement
// ---------------------------------------------------------------------------

/**
 * Sentinel template used to wrap param names in prop values during emit.
 *
 * A per-emit nonce (random hex) is mixed in to prevent accidental collision
 * with user-authored string content that happens to look like a sentinel.
 *
 * Injection: props[key] = sentinel(paramName, nonce) for each bound prop.
 * Emission:  nodeToJsx encodes that as '{"__VCPARAM_<nonce>_title__"}'
 * Replacement: the quoted sentinel → bare identifier `title`
 *
 * Using the destructured param name directly (not `props.paramName`) matches
 * the function signature:
 *   export default function Card({ title = "…" }: CardProps) { … }
 *   return <h2>{title}</h2>   ← `title` is the in-scope destructured binding
 */
const SENTINEL_PREFIX = '__VCPARAM_'
const SENTINEL_SUFFIX = '__'

function sentinel(paramName: string, nonce: string): string {
  return `${SENTINEL_PREFIX}${nonce}_${paramName}${SENTINEL_SUFFIX}`
}

/** The quoted form that appears in JSON.stringify output */
function sentinelJson(paramName: string, nonce: string): string {
  return `"${SENTINEL_PREFIX}${nonce}_${paramName}${SENTINEL_SUFFIX}"`
}

// ---------------------------------------------------------------------------
// Tree flattening: nested VCNode tree → flat nodes map (for nodeToJsx compat)
// ---------------------------------------------------------------------------

/** Minimal node shape extracted from VC tree for flat map construction */
interface FlatNode {
  id: string
  moduleId: string
  props: Record<string, unknown>
  children: string[]
  breakpointOverrides: Record<string, Partial<Record<string, unknown>>>
  propBindings?: Record<string, { paramId: string }>
}

/**
 * Flatten the VC's nested `childNodes` tree into a flat `Record<string, FlatNode>`.
 * `nodeToJsx` expects a `page.nodes` flat map — this bridges the two formats.
 */
function flattenVCTree(
  root: VisualComponent['rootNode'],
): Record<string, FlatNode> {
  const flat: Record<string, FlatNode> = {}

  function walk(node: VisualComponent['rootNode']): void {
    flat[node.id] = {
      id: node.id,
      moduleId: node.moduleId,
      props: { ...node.props },
      children: node.children,
      breakpointOverrides: node.breakpointOverrides ?? {},
      propBindings: node.propBindings,
    }
    const childNodes = node.childNodes as Array<VisualComponent['rootNode']> | undefined
    if (childNodes) {
      for (const child of childNodes) {
        walk(child)
      }
    }
  }

  walk(root)
  return flat
}

// ---------------------------------------------------------------------------
// Sentinel injection: replace bound prop values with sentinel strings
// ---------------------------------------------------------------------------

/**
 * Build a modified flat nodes map where bound props are replaced with sentinels.
 * The sentinel encodes the param NAME + per-emit nonce so the post-processing
 * pass can restore it without risk of collision with user content.
 *
 * @param flatNodes  Flat node map from flattenVCTree()
 * @param params     VC's param array (for paramId → paramName lookup)
 * @param nonce      Per-emit random string to prevent sentinel collisions
 */
function injectSentinels(
  flatNodes: Record<string, FlatNode>,
  params: VCParam[],
  nonce: string,
): Record<string, FlatNode> {
  const paramById = new Map<string, string>()
  for (const p of params) {
    paramById.set(p.id, p.name)
  }

  const result: Record<string, FlatNode> = {}

  for (const [nodeId, node] of Object.entries(flatNodes)) {
    if (!node.propBindings || Object.keys(node.propBindings).length === 0) {
      result[nodeId] = node
      continue
    }

    // Clone props and inject sentinels for bound keys
    const modifiedProps: Record<string, unknown> = { ...node.props }
    for (const [propKey, binding] of Object.entries(node.propBindings)) {
      const paramName = paramById.get(binding.paramId)
      if (paramName) {
        modifiedProps[propKey] = sentinel(paramName, nonce)
      }
    }

    result[nodeId] = { ...node, props: modifiedProps }
  }

  return result
}

// ---------------------------------------------------------------------------
// Sentinel replacement pass
// ---------------------------------------------------------------------------

/**
 * Replace all sentinel JSON string literals in the generated JSX with
 * bare param name references (matching the destructured function signature).
 *
 * JSON.stringify("__VCPARAM_<nonce>_title__") = '"__VCPARAM_<nonce>_title__"'
 * In generated JSX: {"__VCPARAM_<nonce>_title__"}
 * After replacement: {title}   ← bare destructured binding, not props.title
 *
 * Using bare `paramName` (not `props.paramName`) is REQUIRED because the
 * function signature is destructured:
 *   export default function Card({ title = "…" }: CardProps) { … }
 * There is no `props` identifier in scope. The destructured binding `title`
 * is what callers pass and what the JSX body must reference.
 */
function replaceSentinels(jsx: string, params: VCParam[], nonce: string): string {
  let result = jsx
  for (const param of params) {
    // Replace the quoted sentinel with the safe (possibly `_`-prefixed) param name.
    // safeParamName handles reserved-keyword params so the JSX reference matches
    // the destructured binding in the function signature.
    // The surrounding {} are already in the JSX from nodeToJsx string encoding.
    result = result.replaceAll(sentinelJson(param.name, nonce), safeParamName(param.name))
  }
  return result
}

// ---------------------------------------------------------------------------
// Safe param name — escape reserved JS keywords
// ---------------------------------------------------------------------------

/**
 * Return a safe identifier for a param in the emitted function signature and JSX body.
 *
 * If the param name is a JS reserved keyword (e.g. `class`, `default`, `function`),
 * prefix it with `_` so the destructured binding is syntactically valid TypeScript.
 *
 * This is a defensive emitter-level guard. The slice-level `validateParamName()`
 * already blocks reserved names at write time, but legacy projects loaded from
 * persistence may contain reserved names if they were created before the guard was
 * added. Prefixing with `_` is the TypeScript-idiomatic opt-out for both
 * `noUnusedParameters` and keyword conflicts.
 */
function safeParamName(name: string): string {
  return RESERVED_JS_KEYWORDS.has(name) ? `_${name}` : name
}

// ---------------------------------------------------------------------------
// TypeScript interface generation
// ---------------------------------------------------------------------------

/** Map VCParam type → TypeScript type string */
function tsType(paramType: VCParam['type']): string {
  switch (paramType) {
    case 'string':   return 'string'
    case 'number':   return 'number'
    case 'boolean':  return 'boolean'
    case 'url':      return 'string'
    case 'color':    return 'string'
    case 'enum':     return 'string'
    default:         return 'unknown'
  }
}

/**
 * Generate a TypeScript props interface for the VC.
 * All params are optional (? modifier) — callers may omit them and get defaults.
 * Reserved-keyword param names are emitted with a `_` prefix (safeParamName).
 */
function generatePropsInterface(name: string, params: VCParam[]): string {
  if (params.length === 0) {
    return `export interface ${name}Props {}\n`
  }
  const fields = params
    .map((p) => `  ${safeParamName(p.name)}?: ${tsType(p.type)}`)
    .join('\n')
  return `export interface ${name}Props {\n${fields}\n}\n`
}

// ---------------------------------------------------------------------------
// Default value expression
// ---------------------------------------------------------------------------

/**
 * Emit a safe TypeScript default value expression for a VCParam.
 * Returns undefined-safe defaults (empty string for text, 0 for number, etc.)
 */
function defaultExpr(param: VCParam): string {
  const v = param.defaultValue
  switch (param.type) {
    case 'string':
    case 'url':
    case 'color':
    case 'enum':
      return JSON.stringify(String(v ?? ''))
    case 'number':
      return String(Number(v ?? 0))
    case 'boolean':
      return String(Boolean(v))
    default:
      return 'undefined'
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface VCComponent {
  /** PascalCase component name — e.g. "Card" */
  name: string
  /** Canonical file path — e.g. "src/components/Card.tsx" */
  filePath: string
  /** Full .tsx source file content */
  source: string
}

/**
 * Convert a VisualComponent canvas tree to a .tsx source string.
 *
 * @param vc       The Visual Component to compile
 * @param project  Full project document (reserved — not accessed in this phase)
 * @param registry Module registry with trusted base modules (toJsx() must be present)
 * @returns        VCComponent with name, filePath, and full TSX source
 */
export function vcToComponent(
  vc: VisualComponent,
  _project: Project,
  registry: IModuleRegistry,
): VCComponent {
  // 0. Generate a per-emit nonce to prevent sentinel string collisions.
  //    Probability of collision: ~10⁻⁹ per param per emit invocation.
  const nonce = Math.random().toString(36).slice(2, 8)

  // 1. Flatten nested VC tree → flat node map
  const flatNodes = flattenVCTree(vc.rootNode)

  // 2. Inject sentinels for bound props (nonce makes each sentinel unique to this emit)
  const nodesWithSentinels = injectSentinels(flatNodes, vc.params, nonce)

  // 3. Build a minimal fake Page so nodeToJsx can traverse the flat map
  //    nodeToJsx only reads page.nodes — other Page fields are unused here.
  const fakePage: Pick<Page, 'nodes'> & { nodes: Record<string, FlatNode> } = {
    nodes: nodesWithSentinels,
  }

  // 4. Run the existing JSX tree serializer
  let rawJsx = nodeToJsx(
    vc.rootNode.id,
    fakePage as unknown as Page,
    registry,
  )

  // 5. Replace sentinel strings with bare destructured param name references.
  //    e.g. {"__VCPARAM_abc123_title__"} → {title}
  //    The destructured signature `function Card({ title = "…" }: CardProps)` binds
  //    `title` directly; there is no `props` identifier in scope.
  rawJsx = replaceSentinels(rawJsx, vc.params, nonce)

  // 6. Assemble defaults section (used in function signature destructuring)
  //    Only include params that have non-trivial defaults.
  const hasParams = vc.params.length > 0

  // 7. Build the TypeScript interface
  const propsInterface = generatePropsInterface(vc.name, vc.params)

  // 8. Build default param destructuring for the function signature
  //    export default function Card({ title = "Default", ... }: CardProps)
  //    Reserved-keyword param names are prefixed with `_` (safeParamName) to avoid
  //    SyntaxErrors in destructuring position for legacy VCs.
  const paramDefaults = vc.params
    .map((p) => `${safeParamName(p.name)} = ${defaultExpr(p)}`)
    .join(', ')
  const propsSignature = hasParams
    ? `{ ${paramDefaults} }: ${vc.name}Props`
    : `_props: ${vc.name}Props`

  const jsxBody = rawJsx || '<></>'

  const source = [
    `// Auto-generated by Page Builder — do not edit manually.`,
    `// Visual Component: ${JSON.stringify(vc.name)}`,
    `import React from 'react'`,
    ``,
    propsInterface,
    `export default function ${vc.name}(${propsSignature}) {`,
    `  return (`,
    `    ${jsxBody}`,
    `  )`,
    `}`,
    ``,
  ].join('\n')

  return { name: vc.name, filePath: vc.filePath, source }
}

// ---------------------------------------------------------------------------
// Topological sort — emit VC dependencies before dependents
// ---------------------------------------------------------------------------

/**
 * Collect all `base.visualComponentRef` componentId values from a VC's tree.
 * Returns a Set of VC ids directly referenced by this VC.
 */
function collectDirectDeps(vc: VisualComponent): Set<string> {
  const deps = new Set<string>()

  function walkNode(node: VisualComponent['rootNode']): void {
    if (
      node.moduleId === 'base.visualComponentRef' &&
      typeof node.props.componentId === 'string'
    ) {
      deps.add(node.props.componentId)
    }
    const childNodes = node.childNodes as Array<VisualComponent['rootNode']> | undefined
    if (childNodes) {
      for (const child of childNodes) {
        walkNode(child)
      }
    }
  }

  walkNode(vc.rootNode)
  return deps
}

/**
 * Topologically sort Visual Components so each VC appears after all VCs it
 * references (dependencies first).
 *
 * The recursion guard on the slice boundary guarantees no cycles, so DFS
 * post-order always succeeds.
 *
 * @param vcs  Raw array from project.visualComponents
 * @returns    Sorted copy (mutations in-place not guaranteed — always use return value)
 */
export function topoSortVCs(vcs: VisualComponent[]): VisualComponent[] {
  const byId = new Map<string, VisualComponent>()
  for (const vc of vcs) {
    byId.set(vc.id, vc)
  }

  const visited = new Set<string>()
  const sorted: VisualComponent[] = []

  function visit(vcId: string): void {
    if (visited.has(vcId)) return
    visited.add(vcId)

    const vc = byId.get(vcId)
    if (!vc) return

    // Visit all dependencies first (post-order DFS)
    for (const depId of collectDirectDeps(vc)) {
      visit(depId)
    }

    sorted.push(vc)
  }

  for (const vc of vcs) {
    visit(vc.id)
  }

  return sorted
}
