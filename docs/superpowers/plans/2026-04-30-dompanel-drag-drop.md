# DOMPanel Drag And Drop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace DOMPanel's sibling-only drag/drop with smooth before, after, and inside drops that support containers, columns, auto-expand, and non-layout-shifting indicators.

**Architecture:** Add a DOMPanel-specific DnD layer with pure target-resolution logic plus a React hook for transient drag state. Keep `@dnd-kit/core` for sensors and drag overlay behavior, but stop using nested `SortableContext` as the source of truth for valid drops. Store writes occur once on successful drop.

**Tech Stack:** React 19, Zustand, TypeScript, Bun test, `@dnd-kit/core`, CSS Modules.

---

## File Structure

- Create `src/editor/components/DomPanel/domPanelDnd.ts`: pure target-resolution and validation helpers.
- Create `src/editor/components/DomPanel/useDomPanelDnd.ts`: transient drag state, row registration, auto-expand, and auto-scroll.
- Create `src/editor/components/DomPanel/DomPanelDndContext.ts`: typed React context for rows to access DnD state.
- Modify `src/editor/components/DomPanel/DomPanel.tsx`: wire the hook, `DndContext`, `DragOverlay`, and single drop commit.
- Modify `src/editor/components/DomPanel/TreeNode.tsx`: replace `useSortable`/`SortableContext` with row registration, drag props, and visual indicators.
- Modify `src/editor/components/DomPanel/TreeNode.module.css`: non-layout-shifting drop indicators and drag overlay row styles.
- Modify `src/editor/components/DomPanel/DomTreeContext.ts`: expose `expandNode(id)` if not already available to support auto-expand.
- Create `src/__tests__/dom-panel-dnd/target-resolution.test.ts`: pure target-resolution tests.
- Modify `src/__tests__/panels/domPanel.test.tsx`: focused integration tests for indicators and move commits where practical.

## Tasks

### Task 1: Pure DOMPanel Drop Target Model

**Files:**
- Create: `src/editor/components/DomPanel/domPanelDnd.ts`
- Test: `src/__tests__/dom-panel-dnd/target-resolution.test.ts`

- [ ] **Step 1: Write failing tests for target resolution**

```ts
import { describe, expect, it } from 'bun:test'
import type { Page, PageNode } from '../../core/page-tree/types'
import {
  getDomDropZone,
  resolveDomDropTarget,
  type DomDropRowMeta,
} from '../../editor/components/DomPanel/domPanelDnd'

function node(id: string, moduleId: string, children: string[] = [], locked = false): PageNode {
  return { id, moduleId, props: {}, breakpointOverrides: {}, children, locked }
}

function page(nodes: Record<string, PageNode>, rootNodeId = 'root'): Page {
  return { id: 'page', slug: 'index', title: 'Home', rootNodeId, nodes }
}

const canHaveChildren = (moduleId: string) =>
  moduleId === 'base.root' || moduleId === 'base.container' || moduleId === 'base.columns'

const meta = (nodeId: string, top = 100, height = 30): DomDropRowMeta => ({
  nodeId,
  rect: { top, bottom: top + height, height },
})

describe('DOMPanel DnD target resolution', () => {
  it('maps row coordinates to before, inside, and after zones', () => {
    const row = meta('a', 100, 30)
    expect(getDomDropZone(row.rect, 102)).toBe('before')
    expect(getDomDropZone(row.rect, 115)).toBe('inside')
    expect(getDomDropZone(row.rect, 128)).toBe('after')
  })

  it('resolves before and after sibling drops', () => {
    const p = page({
      root: node('root', 'base.root', ['a', 'b', 'c']),
      a: node('a', 'base.heading'),
      b: node('b', 'base.heading'),
      c: node('c', 'base.heading'),
    })

    expect(resolveDomDropTarget({ page: p, draggedId: 'c', overId: 'b', zone: 'before', canHaveChildren })).toEqual({
      draggedId: 'c',
      parentId: 'root',
      index: 1,
      position: 'before',
      slot: 'default',
    })

    expect(resolveDomDropTarget({ page: p, draggedId: 'a', overId: 'b', zone: 'after', canHaveChildren })).toEqual({
      draggedId: 'a',
      parentId: 'root',
      index: 1,
      position: 'after',
      slot: 'default',
    })
  })

  it('resolves inside append into containers and columns', () => {
    const p = page({
      root: node('root', 'base.root', ['container', 'columns', 'leaf']),
      container: node('container', 'base.container', []),
      columns: node('columns', 'base.columns', ['inside']),
      inside: node('inside', 'base.heading'),
      leaf: node('leaf', 'base.paragraph'),
    })

    expect(resolveDomDropTarget({ page: p, draggedId: 'leaf', overId: 'container', zone: 'inside', canHaveChildren })).toEqual({
      draggedId: 'leaf',
      parentId: 'container',
      index: 0,
      position: 'inside',
      slot: 'default',
    })

    expect(resolveDomDropTarget({ page: p, draggedId: 'leaf', overId: 'columns', zone: 'inside', canHaveChildren })).toEqual({
      draggedId: 'leaf',
      parentId: 'columns',
      index: 1,
      position: 'inside',
      slot: 'default',
    })
  })

  it('rejects root moves, leaf inside drops, self/descendant drops, locked moves, and no-ops', () => {
    const p = page({
      root: node('root', 'base.root', ['a', 'b', 'locked']),
      a: node('a', 'base.container', ['child']),
      child: node('child', 'base.heading'),
      b: node('b', 'base.heading'),
      locked: node('locked', 'base.heading', [], true),
    })

    expect(resolveDomDropTarget({ page: p, draggedId: 'root', overId: 'b', zone: 'after', canHaveChildren })).toBeNull()
    expect(resolveDomDropTarget({ page: p, draggedId: 'b', overId: 'child', zone: 'inside', canHaveChildren })).toBeNull()
    expect(resolveDomDropTarget({ page: p, draggedId: 'a', overId: 'child', zone: 'inside', canHaveChildren })).toBeNull()
    expect(resolveDomDropTarget({ page: p, draggedId: 'locked', overId: 'b', zone: 'before', canHaveChildren })).toBeNull()
    expect(resolveDomDropTarget({ page: p, draggedId: 'b', overId: 'b', zone: 'inside', canHaveChildren })).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/__tests__/dom-panel-dnd/target-resolution.test.ts`

Expected: FAIL because `domPanelDnd.ts` does not exist.

- [ ] **Step 3: Implement pure target resolution**

Create types and functions:

```ts
export type DomDropPosition = 'before' | 'after' | 'inside'
export type DomDropZone = DomDropPosition

export interface DomDropTarget {
  draggedId: string
  parentId: string
  index: number
  position: DomDropPosition
  slot: 'default'
}

export interface DomDropRowRect {
  top: number
  bottom: number
  height: number
}

export interface DomDropRowMeta {
  nodeId: string
  rect: DomDropRowRect
}

export interface ResolveDomDropTargetInput {
  page: Page
  draggedId: string
  overId: string
  zone: DomDropZone
  canHaveChildren: (moduleId: string) => boolean
}
```

Implement `getDomDropZone(rect, pointerY)` with top/bottom hit bands clamped between 8px and 12px and `resolveDomDropTarget(input)` with validation from the design spec.

- [ ] **Step 4: Run target tests**

Run: `bun test src/__tests__/dom-panel-dnd/target-resolution.test.ts`

Expected: PASS.

### Task 2: DnD Context And Hook

**Files:**
- Create: `src/editor/components/DomPanel/DomPanelDndContext.ts`
- Create: `src/editor/components/DomPanel/useDomPanelDnd.ts`
- Modify: `src/editor/components/DomPanel/DomTreeContext.ts`

- [ ] **Step 1: Add DnD context contract**

Create a context exposing:

```ts
export interface DomPanelDndContextValue {
  activeId: string | null
  activeLabel: string | null
  activeModuleId: string | null
  target: DomDropTarget | null
  invalidOverId: string | null
  registerRow: (nodeId: string, element: HTMLElement | null) => void
  getDragAttributes: (nodeId: string) => {
    attributes: DraggableAttributes
    listeners: SyntheticListenerMap | undefined
    setNodeRef: (element: HTMLElement | null) => void
    isDragging: boolean
  }
}
```

Use a default context value that throws if consumed outside the provider.

- [ ] **Step 2: Add hook with row registration and pointer target calculation**

Use `useDraggable` in each row through `getDragAttributes` or a small row-level wrapper hook, and use `DndContext` events in the main hook:

- `handleDragStart`: cache row rects, set active metadata.
- `handleDragMove`: compute the row under the pointer and resolve a target through `domPanelDnd.ts`.
- `handleDragEnd`: return the latest target for `DomPanel` to commit.
- `handleDragCancel`: clear transient state.

Use refs for high-frequency pointer data and local state only for rendering the active indicator.

- [ ] **Step 3: Add still-hover auto-expand**

In `handleDragMove`, when the active target is `inside`, valid, collapsed, and pointer movement remains within the stillness threshold, start a 350ms timeout that calls `expandNode(target.parentId)`.

Cancel the timer on target change, movement beyond threshold, drag end, or invalid target.

- [ ] **Step 4: Add tree-area auto-scroll**

Track the tree scroll container. Use `requestAnimationFrame` while dragging near top/bottom edges. Scroll speed should increase near the edge. Refresh row rect cache after scrolling.

### Task 3: DOMPanel Wiring

**Files:**
- Modify: `src/editor/components/DomPanel/DomPanel.tsx`
- Modify: `src/editor/components/DomPanel/TreeNode.tsx`

- [ ] **Step 1: Replace nested sortable contexts**

Remove `SortableContext`, `verticalListSortingStrategy`, and `useSortable` from DOMPanel rows. Keep `DndContext`, but use `@dnd-kit/core` events and `DragOverlay`.

- [ ] **Step 2: Commit one move on drop**

On drag end:

```ts
const target = dnd.handleDragEnd(event)
if (target) {
  useEditorStore.getState().moveNode(target.draggedId, target.parentId, target.index)
}
```

Wrap the store call in a `try/catch` so a stale invalid target cannot crash the editor.

- [ ] **Step 3: Render drag overlay**

Render a compact overlay row with icon and label for the active dragged node. Keep the overlay outside normal tree flow.

- [ ] **Step 4: Preserve selection and expand behavior**

Clicking a row should still select and toggle parents as it does today. Rename input and context menu must continue to stop pointer propagation.

### Task 4: Non-Layout Drop Indicators

**Files:**
- Modify: `src/editor/components/DomPanel/TreeNode.tsx`
- Modify: `src/editor/components/DomPanel/TreeNode.module.css`

- [ ] **Step 1: Add indicator classes**

Add row wrapper classes for:

- `dropBefore`
- `dropAfter`
- `dropInside`
- `dropInvalid`
- `dragSource`
- `dragOverlay`

Before/after classes use `::before` or `::after` absolute positioning. They must not change row height or add sibling elements.

- [ ] **Step 2: Apply indicator classes from context**

For each row:

```ts
const isDropBefore = target?.position === 'before' && target.parentId === parentId && target.index === index
const isDropAfter = target?.position === 'after' && target.parentId === parentId && target.index === index + 1
const isDropInside = target?.position === 'inside' && target.parentId === nodeId
```

Prefer a direct `target.overId` field if implementation adds it for simpler rendering.

- [ ] **Step 3: Test indicator layout**

Add a DOMPanel test that measures row count and row style before/after setting an active target through a test hook or class fixture. The test should assert the indicator is represented by class/CSS, not an inserted placeholder row.

### Task 5: Verification

**Files:**
- Modify: `src/__tests__/dom-panel-dnd/target-resolution.test.ts`
- Modify: `src/__tests__/panels/domPanel.test.tsx`

- [ ] **Step 1: Run focused tests**

Run:

```bash
bun test src/__tests__/dom-panel-dnd/target-resolution.test.ts
bun test src/__tests__/panels/domPanel.test.tsx
```

Expected: PASS.

- [ ] **Step 2: Run full verification**

Run:

```bash
bun test
bun run lint
bun run build
```

Expected: PASS.

- [ ] **Step 3: Manual browser check**

Run the app with `bun run dev`, open the editor, and manually verify:

- Drag before/after siblings.
- Drag into container.
- Drag into columns.
- Drag into empty container.
- Drag over collapsed container and wait for auto-expand.
- Drop indicators do not shift row height.
- Invalid drops do not commit.
