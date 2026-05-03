/**
 * findParamOrigin — locate the VCNode that originates a given VC param.
 *
 * "Origin" means the node in the VC tree that carries the binding which exposes
 * the param to callers:
 *   - Non-slot params:   the node whose propBindings[propKey].paramId matches.
 *   - Slot params:       the base.slot-outlet node whose props.slotName matches
 *                        param.name. propKey is always 'slotName' for those.
 *
 * Architecture source: Contribution #619 §2
 * Constraint #269: This file must NOT import from editor/ or editor-store/.
 */

import type { VisualComponent, VCNode, VCParam } from './schemas'

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface ParamOrigin {
  nodeId: string
  propKey: string
}

// ---------------------------------------------------------------------------
// findParamOrigin
// ---------------------------------------------------------------------------

/**
 * Find the node within `vc.rootNode` (DFS via childNodes) that originates
 * the given param.
 * - For non-slot params: returns the first node where
 *   `node.propBindings[propKey].paramId === paramId`.
 * - For slot params: returns the `base.slot-outlet` node where
 *   `node.props.slotName === param.name`. propKey is `'slotName'` for those.
 * Returns null if no origin exists (orphan param — shouldn't happen with GC,
 * but the UI must render the row defensively).
 */
export function findParamOrigin(
  vc: VisualComponent,
  paramId: string,
): ParamOrigin | null {
  const maybeParam = vc.params.find((p) => p.id === paramId)
  if (!maybeParam) return null
  // Re-bind to a non-optional local so TypeScript retains the narrowing inside
  // the `dfs` closure (control-flow narrowing does not propagate into closures).
  const param: VCParam = maybeParam

  function dfs(node: VCNode): ParamOrigin | null {
    if (param.type === 'slot') {
      // Slot params are originated by base.slot-outlet nodes.
      // node.props.slotName is Record<string, unknown> — read defensively.
      if (
        node.moduleId === 'base.slot-outlet' &&
        String(node.props.slotName) === param.name
      ) {
        return { nodeId: node.id, propKey: 'slotName' }
      }
    } else {
      // Non-slot params: match on propBindings[propKey].paramId
      if (node.propBindings) {
        for (const [propKey, binding] of Object.entries(node.propBindings)) {
          if (binding.paramId === paramId) {
            return { nodeId: node.id, propKey }
          }
        }
      }
    }

    // DFS: recurse into childNodes (undefined when the node is a leaf)
    if (node.childNodes) {
      for (const child of node.childNodes) {
        const found = dfs(child)
        if (found) return found
      }
    }

    return null
  }

  return dfs(vc.rootNode)
}
