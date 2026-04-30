/**
 * ReactPublisher — Iterative JSX tree renderer.
 *
 * Converts a Page (flat-map PageNode tree) into a JSX string fragment by
 * calling each node's ModuleDefinition.toJsx() method in post-order.
 *
 * Algorithm: iterative post-order DFS using a pre-order collection + reversal.
 * This avoids recursion-depth limits on deep trees (Guideline #311).
 *
 * Step 1: Pre-order DFS via stack → collect visitOrder[]
 * Step 2: Iterate visitOrder in reverse (post-order) → build jsxMap via toJsx()
 * Step 3: Return jsxMap[rootNodeId]
 *
 * Isolation (Constraint #269): MUST NOT import from src/core/publisher/.
 */

import type { Page } from '../page-tree/types'
import type { AnyModuleDefinition, IModuleRegistry } from '../module-engine/types'

export interface ReactExportCollector {
  imports: Set<string>
  declarations: Set<string>
}

export function createReactExportCollector(): ReactExportCollector {
  return {
    imports: new Set(),
    declarations: new Set(),
  }
}

function collectReactExportAssets(
  definition: AnyModuleDefinition,
  collector: ReactExportCollector | undefined,
): void {
  if (!collector || !definition.trusted || !definition.reactExport) return

  for (const importLine of definition.reactExport.imports ?? []) {
    collector.imports.add(importLine)
  }
  for (const declaration of definition.reactExport.declarations ?? []) {
    collector.declarations.add(declaration)
  }
}

/**
 * Render a page's node subtree as a JSX string fragment.
 *
 * Nodes whose module lacks toJsx() emit a JSX comment placeholder so the
 * generated file is always syntactically valid.
 *
 * @param rootNodeId  ID of the subtree root (typically Page.rootNodeId)
 * @param page        The page containing the flat node map
 * @param registry    Module registry for toJsx() dispatch
 * @returns           JSX string fragment for the entire subtree
 */
export function nodeToJsx(
  rootNodeId: string,
  page: Page,
  registry: IModuleRegistry,
  collector?: ReactExportCollector,
): string {
  // ─── Step 1: Pre-order DFS — collect visit order ──────────────────────────
  //
  // Children are pushed in reverse so the leftmost child is popped first (LIFO).
  // The resulting visitOrder[] is standard pre-order: root, left subtree, right subtree.
  const visitOrder: string[] = []
  const stack: string[] = [rootNodeId]
  const seen = new Set<string>()

  while (stack.length > 0) {
    const nodeId = stack.pop()!
    if (seen.has(nodeId)) continue
    seen.add(nodeId)
    visitOrder.push(nodeId)

    const node = page.nodes[nodeId]
    if (!node) continue

    // Push children in reverse so leftmost is processed first (LIFO)
    for (let i = node.children.length - 1; i >= 0; i--) {
      const childId = node.children[i]
      if (!seen.has(childId)) stack.push(childId)
    }
  }

  // ─── Step 2: Post-order processing — build jsxMap ─────────────────────────
  //
  // Iterating visitOrder in reverse gives post-order traversal:
  // children are processed before their parent, so renderedChildren is always
  // fully populated when the parent node is processed.
  const jsxMap = new Map<string, string>()

  for (let i = visitOrder.length - 1; i >= 0; i--) {
    const nodeId = visitOrder[i]
    const node = page.nodes[nodeId]

    if (!node) {
      jsxMap.set(nodeId, '')
      continue
    }

    const def = registry.get(node.moduleId)

    if (!def) {
      jsxMap.set(nodeId, `{/* unknown module: ${node.moduleId} */}`)
      continue
    }

    // Collect already-rendered children in declaration order
    const renderedChildren = node.children
      .map((id) => jsxMap.get(id) ?? '')
      .filter((s) => s.length > 0)

    // Constraint B (CWE-94 / Contribution #398):
    // ONLY call toJsx() on trusted (base) modules.
    // Untrusted community modules MUST NOT have toJsx() invoked at export time —
    // their toJsx() can return arbitrary source code executed by the compiler (RCE).
    // Fall back to dangerouslySetInnerHTML for untrusted modules.
    if (def.trusted && def.toJsx) {
      collectReactExportAssets(def, collector)
      const jsx = def.toJsx(node.props as never, renderedChildren)
      jsxMap.set(nodeId, jsx)
    } else if (!def.toJsx) {
      // Module doesn't support React mode — emit a comment placeholder
      jsxMap.set(nodeId, `{/* module ${node.moduleId} does not support React export */}`)
    } else {
      // Untrusted community module — trusted=false, toJsx exists but MUST NOT be called.
      // Render to HTML via the safe render() path and embed via dangerouslySetInnerHTML
      // (Constraint #304: untrusted modules use dangerouslySetInnerHTML fallback).
      const rawHtml = def.render(node.props as never, renderedChildren).html
      jsxMap.set(
        nodeId,
        `<div dangerouslySetInnerHTML={{ __html: ${JSON.stringify(rawHtml)} }} />`,
      )
    }
  }

  // ─── Step 3: Return root fragment ─────────────────────────────────────────
  return jsxMap.get(rootNodeId) ?? '<></>'
}
