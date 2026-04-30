# DOMPanel Drag And Drop Design

## Purpose

Refactor DOMPanel drag and drop so the Layers tree feels reliable, fast, and precise. The immediate target is DOMPanel only. FilesPanel and canvas drag/drop are out of scope for this implementation, though the design should avoid choices that block future reuse.

## Current Problems

The current implementation uses nested `SortableContext` groups and only commits moves when the dragged node is dropped over a sibling in the same parent. This makes cross-parent moves impossible, which is why users cannot reliably drop nodes into containers or columns. Empty or small trees also expose very small practical targets, so drag/drop feels unreliable when there are only a few elements.

The module system currently supports infinite nesting through `PageNode.children: string[]`, but it has only one default child list per node. It does not yet support named slots such as `leftColumn`, `rightColumn`, `header`, or `actions`. Columns should behave as a normal single-slot container for this feature: its children flow through CSS grid cells in order.

## Scope

In scope:

- DOMPanel row drag/drop.
- Before, after, and inside drop positions.
- Drops into `canHaveChildren` modules such as root, container, columns, and link.
- Empty container/columns drop targets.
- Collapsed parent auto-expand on still hover.
- Tree-area auto-scroll near edges.
- Smooth non-layout-shifting visual indicators.
- Pure target-resolution tests and focused DOMPanel integration tests.

Out of scope:

- FilesPanel drag/drop.
- Canvas drag/drop.
- Named child slots or multi-slot module rendering.
- Replacing base modules as part of this feature.
- Live tree reordering during pointer movement.

## Interaction Model

Every visible row exposes three logical drop zones:

- `before`: the top band of the row inserts the dragged node before that row.
- `after`: the bottom band inserts the dragged node after that row.
- `inside`: the middle band appends the dragged node into that row when the row's module has `canHaveChildren: true`.

The visible before/after indicator must be a non-layout overlay, such as an absolutely positioned line. It must not add margins, padding, placeholder rows, or any element that changes row or tree height. The actual pointer hit zones must be comfortably larger than the visible line; the line can be 2px while the hit band is roughly 25-35% of row height.

Only one active indicator is shown at a time:

- A thin horizontal line for before/after.
- An inset highlight or outline for inside.
- A muted invalid state only when the pointer is over a visible row but no valid target exists.

The tree should not reorder live during drag. The dragged row uses a lightweight overlay preview, and the source row fades in place. The project store is updated once, on drop.

## Drop Target Contract

The DnD layer normalizes all successful drops to this shape:

```ts
export type DomDropPosition = 'before' | 'after' | 'inside'

export interface DomDropTarget {
  draggedId: string
  parentId: string
  index: number
  position: DomDropPosition
  slot: 'default'
}
```

`slot: 'default'` is included deliberately. The current implementation has only one child list, but keeping the target slot-aware prevents this work from becoming a dead end if named slots are added later.

Target resolution rules:

- `before` resolves to the hovered row's parent and its current index.
- `after` resolves to the hovered row's parent and current index plus one.
- `inside` resolves to the hovered row id and appends to that node's `children`.
- Moving within the same parent adjusts the final insertion index so removing the source first does not create off-by-one results.
- No-op moves return `null` and do not call `moveNode`.

Invalid targets return `null`:

- Dragging the page root.
- Dropping before/after the page root.
- Dropping inside a node that cannot have children.
- Dropping into the dragged node itself.
- Dropping into a descendant of the dragged node.
- Moving locked nodes, if the source node is locked.
- Dropping into locked target nodes, if the target would become the new parent.

## Auto Expand

When the pointer is inside the center zone of a valid collapsed parent, a short still-hover timer starts. If the pointer remains over the same inside target with minimal movement for about 350ms, that parent expands. The drag remains active and no store write occurs.

The timer is cancelled when:

- The pointer leaves the inside zone.
- The target row changes.
- Movement exceeds the stillness threshold.
- The drag ends or is cancelled.
- The target becomes invalid.

After expansion, the user can move into the revealed children and choose a precise before/after/inside target.

## Auto Scroll

While dragging inside the DOMPanel tree area, the tree scrolls automatically when the pointer is near the top or bottom edge. Scroll velocity increases as the pointer gets closer to the edge. Auto-scroll is implemented with `requestAnimationFrame` and stops when the pointer leaves the scroll zone or drag ends.

Auto-scroll must not write to Zustand and must not trigger project mutations.

## Architecture

Add a DOMPanel-specific DnD layer rather than keeping all behavior inside `DomPanel.tsx` and `TreeNode.tsx`.

### `src/editor/components/DomPanel/domPanelDnd.ts`

Pure logic only:

- Define `DomDropTarget`, `DomDropPosition`, and row metadata types.
- Calculate row zone from pointer coordinates and row rect.
- Resolve `before`, `after`, and `inside` targets against the current page tree.
- Validate source and target constraints.
- Normalize same-parent insertion indices.

This file should not import React, Zustand, or DOMPanel components. It can import page-tree selectors/types and module registry types as needed.

### `src/editor/components/DomPanel/useDomPanelDnd.ts`

React hook for transient drag behavior:

- Own active drag id, pointer position, active target, invalid hover state, row rect cache, and auto-expand timer refs.
- Register/unregister row elements and metadata.
- Update local/ref drag state during pointer movement.
- Run auto-expand and auto-scroll.
- Expose props/callbacks needed by `DomPanel` and `TreeNode`.
- Commit nothing to the store during movement.

### `src/editor/components/DomPanel/TreeNode.tsx`

Keep TreeNode as a row renderer:

- Preserve per-node Zustand selectors for selection and hover.
- Register its row with the DnD hook.
- Render active drop indicator classes from the current target.
- Render drag handle/listener props on the row without breaking `role="treeitem"`.
- Keep context menu, rename, expand/collapse, selection, and hover behavior intact.

### `src/editor/components/DomPanel/DomPanel.tsx`

Own the drag context and final commit:

- Create sensors and DnD hook.
- Provide DnD context to rows.
- On drag end, commit one `moveNode(draggedId, parentId, index)` when a valid target exists.
- Expand ancestors and scroll selected behavior remains unchanged.

### `src/editor/components/DomPanel/DomTreeContext.tsx`

Expanded state remains UI-only. It may expose `expandNode(id)` to support auto-expand, but no expanded state is persisted into the project document.

## Library Choice

Keep `@dnd-kit/core` for sensors and drag overlay behavior. Stop depending on nested `SortableContext` as the source of truth for target calculation. The unreliable behavior comes from nested sortable groups plus sibling-only drop handling. Deterministic target resolution should be owned by DOMPanel.

If implementation proves that `@dnd-kit/core` blocks a required polish point, the hook boundary allows replacing the sensor layer without changing the pure target-resolution model.

## Visual Design

The visual behavior should feel close to a professional editor tree:

- Rows keep their stable 28px height during drag.
- Before/after lines are absolutely positioned and never affect layout.
- Inside highlights use an inset outline/background on the target row.
- Drag overlay uses the same icon and label as the row and avoids expensive shadows/filters.
- Source row opacity changes but remains in place.
- Invalid target feedback is subtle and does not flicker.
- Empty containers and columns expose a stable inside target while collapsed or empty.

## Performance Requirements

- No project/store mutation during pointer movement.
- No layout-changing placeholders during drag.
- Cache row rects at drag start and refresh when expansion or scrolling changes geometry.
- Use refs for high-frequency pointer data.
- Commit exactly once on successful drop.
- Keep per-node selectors in TreeNode so selecting/hovering a node does not re-render the whole tree.
- Use `requestAnimationFrame` for auto-scroll.

## Testing

Add pure tests for target resolution:

- Before and after sibling insertion.
- Inside append into container/columns/root.
- Empty container inside target.
- Same-parent index normalization when moving down and up.
- Reject root moves.
- Reject dropping into self or descendant.
- Reject inside drops into leaf modules.
- Reject no-op targets without calling move.

Add DOMPanel integration tests where practical:

- Dragging a child into a container commits one `moveNode` with the expected parent/index.
- Collapsed valid parent auto-expands only after still hover.
- Drop indicators are rendered without changing row height.
- Invalid targets do not call `moveNode`.

Run:

```bash
bun test src/__tests__/page-tree/mutations.test.ts
bun test src/__tests__/panels/domPanel.test.tsx
bun test
bun run lint
bun run build
```

## Risks

The largest risk is accidentally reintroducing layout shift or high-frequency store updates while improving visual feedback. The implementation should keep visual indicators as overlays and centralize pointer movement state in refs/local hook state.

The second risk is conflating this work with multi-slot modules. This design intentionally keeps columns as a single default-slot grid container. Named slots should be a separate architecture spec touching page-tree types, module definitions, renderers, publisher output, persistence validation, and agent actions.
