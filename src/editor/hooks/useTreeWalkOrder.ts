/**
 * useTreeWalkOrder — stable flat walk of the visible DOM tree.
 *
 * Computes a depth-first pre-order list of { nodeId, depth } for every
 * node that is currently VISIBLE (i.e. its ancestors are all expanded).
 *
 * Performance contract (Contribution #437 / Guideline #318):
 * - Called ONCE at the DomPanel level — NOT inside each TreeNode.
 * - Re-computes only when: rootNodeId changes, nodes map reference changes
 *   (structural edit), or the expanded Set changes.
 * - Node prop edits (label, style) do NOT change the nodes map reference in
 *   an Immer store, so those edits do NOT trigger a re-walk.
 *
 * Used for:
 *   - Scroll-to-selected: `rows.findIndex(r => r.nodeId === selectedNodeId)`
 *   - Virtual scroll threshold check (> 150 visible rows)
 *   - Ancestry expansion: `rows.map(r => r.nodeId)` gives all visible IDs
 */

import { useMemo } from 'react'
import { useEditorStore, selectActivePage } from '@core/editor-store/store'
import { useDomTree } from '../components/DomPanel/DomTreeContext'

export interface TreeRow {
  nodeId: string
  depth: number
}

/** Stable empty sentinel — prevents new array allocation when page is null */
const EMPTY_ROWS: TreeRow[] = []

export function useTreeWalkOrder(): TreeRow[] {
  const page = useEditorStore(selectActivePage)
  const { expanded } = useDomTree()

  // Stable selector — rootNodeId is a primitive, nodes is a map reference.
  // Nodes map reference changes on structural edits (add/remove/move) but NOT
  // on prop edits, so this useMemo re-runs only when the tree structure changes.
  const rootNodeId = page?.rootNodeId
  const nodes = page?.nodes

  return useMemo(() => {
    if (!rootNodeId || !nodes) return EMPTY_ROWS

    const rows: TreeRow[] = []

    function walk(nodeId: string, depth: number): void {
      if (!nodes) return
      rows.push({ nodeId, depth })
      if (expanded.has(nodeId)) {
        const node = nodes[nodeId]
        if (node?.children) {
          for (const childId of node.children) {
            walk(childId, depth + 1)
          }
        }
      }
    }

    walk(rootNodeId, 0)
    return rows
  }, [rootNodeId, nodes, expanded])
}

/**
 * Returns all ancestor node IDs for the given nodeId (from root down to parent).
 * Used to auto-expand the tree path when a canvas selection targets a hidden node.
 */
export function getAncestorIds(
  nodes: Record<string, { children: string[] }>,
  rootNodeId: string,
  targetId: string,
): string[] {
  // BFS to find path from root to targetId
  const queue: Array<{ nodeId: string; path: string[] }> = [
    { nodeId: rootNodeId, path: [] },
  ]
  while (queue.length > 0) {
    const { nodeId, path } = queue.shift()!
    if (nodeId === targetId) return path
    const node = nodes[nodeId]
    if (!node) continue
    for (const childId of node.children) {
      queue.push({ nodeId: childId, path: [...path, nodeId] })
    }
  }
  return []
}
