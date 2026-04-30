/**
 * Tree — generic WAI-ARIA tree UI primitive (Task #455).
 *
 * Canonical export path: src/editor/ui/Tree
 *
 * Two exports:
 *   Tree<T>         — full generic tree for structural panels and future consumers
 *   TreeContainer   — role="tree" wrapper only (DomPanel lightweight migration)
 *   TreeRow         — shared visual row contract for all editor trees
 */

export type { TreeProps, TreeItemRenderCtx, TreeContainerProps } from './Tree'
export { Tree, TreeContainer } from './Tree'
export type { TreeRowProps, TreeChevronProps, TreeIconSlotProps } from './TreeRow'
export { TreeRow, TreeChevron, TreeIconSlot, TreeLabelGroup, TreeLabel, TreeMeta } from './TreeRow'
