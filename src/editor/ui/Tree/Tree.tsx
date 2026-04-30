/**
 * Tree — generic WAI-ARIA tree primitive (Task #455).
 *
 * Owns: role="tree" container, roving tabIndex, keyboard navigation
 *   (Up/Down/Left/Right/Home/End/Enter/Space), aria-selected, aria-expanded.
 *
 * Caller owns (via renderItem): icons, labels, badges, context menus,
 *   kind-specific styling, depth-based padding.
 *
 * Controlled component: caller manages expand + selection state.
 * Tree manages roving tabIndex focus internally (UI-only ephemeral state).
 *
 * Guideline #234: role="treeitem" + tabIndex + keyboard handlers are ALL on
 *   the SAME element — never split across wrapper + inner divs.
 *
 * @see Guideline #234 (role/tabIndex/handlers on same element)
 * @see Guideline #235 (canvas nodes use role="button" — untouched by this primitive)
 * @see Guideline #376 (achromatic only)
 * @see Guideline #357 (compact density)
 * @see Constraint #402 (CSS Modules, no Tailwind, no inline styles)
 * @see Constraint #403 (no !important)
 * @see Guideline #350 (@motion/icons only — primitive is icon-agnostic)
 */

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react'
import styles from './Tree.module.css'

// ─── Public types ──────────────────────────────────────────────────────────────

/**
 * Context passed to renderItem so the caller can adapt visual output per item.
 * The Tree owns ARIA + keyboard; the caller owns ALL visual content.
 */
export interface TreeItemRenderCtx {
  /** 0-based indent depth (0 = root level). Use for padding calculation. */
  depth: number
  /** True when this item holds keyboard focus (roving tabIndex). */
  isFocused: boolean
  /** True when this item is expanded (mirrors caller's isExpanded(item)). */
  isExpanded: boolean
  /** True when this item is selected (mirrors caller's isSelected(item)). */
  isSelected: boolean
}

/**
 * Props for the generic Tree component.
 * All state is controlled: the Tree reads but never mutates expand / selection.
 */
export interface TreeProps<T> {
  /** Root-level items to render. */
  items: T[]
  /** Extract a stable unique string ID from an item (used as React key + ARIA). */
  getId: (item: T) => string
  /**
   * Get the children of an item.
   * Return undefined or an empty array to mark the item as a leaf node.
   */
  getChildren: (item: T) => T[] | undefined
  /** Controlled expand state — read only; call onToggleExpand to request change. */
  isExpanded: (item: T) => boolean
  /** Controlled selection state — read only; call onSelect to request change. */
  isSelected: (item: T) => boolean
  /**
   * Render the visual CONTENT of a single tree row.
   *
   * The Tree renders role="treeitem" + tabIndex + all keyboard/click handlers.
   * This callback provides what appears INSIDE that element (icons, label,
   * chevron, badges, context-menu trigger etc.).
   *
   * Zero per-panel branches allowed inside Tree — all panel-specific logic
   * must live in this callback (T-8 gate).
   */
  renderItem: (item: T, ctx: TreeItemRenderCtx) => ReactNode
  /**
   * Called when the user activates (clicks or Enter/Space) a leaf item.
   * Tree calls this for items that have no children.
   * Items with children get onToggleExpand instead of onSelect on click/Enter.
   */
  onSelect: (id: string) => void
  /**
   * Called when expand/collapse is requested via keyboard or row click on a
   * parent item. NOT called for leaf items.
   */
  onToggleExpand: (id: string) => void
  /** Required aria-label for the role="tree" element (WAI-ARIA tree pattern). */
  ariaLabel: string
  /** Optional data-testid for the tree container element. */
  testId?: string
  /**
   * Called when a key NOT handled by the Tree is pressed on a focused item.
   * Use for panel-specific keyboard triggers that the generic Tree cannot know about
   * (e.g. ContextMenu / Shift+F10 opening a right-click menu — WCAG 2.1.1).
   *
   * Receives:
   *   id  — the focused item's string ID (pass to getId to look up the full item)
   *   item — the focused item itself
   *   e   — the original SyntheticEvent (call e.preventDefault() if handled)
   *   el  — the DOM element for the focused treeitem (for getBoundingClientRect on keyboard open)
   */
  onItemKeyDown?: (id: string, item: T, e: React.KeyboardEvent, el: HTMLElement | null) => void
  /**
   * Forward a ref to the underlying role="tree" div.
   * Enables consumers to query treeitem focus state after external events
   * (e.g. CM-7: return focus to the treeitem after a context menu closes).
   * Optional — defaults to an internal ref so existing callers are unaffected.
   * Mirrors TreeContainerProps.containerRef for API symmetry.
   */
  containerRef?: Ref<HTMLDivElement>
}

/**
 * TreeContainer — lightweight role="tree" wrapper for panels that manage their
 * own item rendering (e.g. DomPanel which needs per-node Zustand selectors +
 * @dnd-kit sortable integration that cannot be expressed via the renderItem API).
 *
 * Provides: role="tree", aria-label, data-testid — nothing else.
 * The caller renders item components (with role="treeitem") as children.
 */
export interface TreeContainerProps {
  ariaLabel: string
  testId?: string
  className?: string
  /** Forward a ref to the underlying div (e.g. for scroll-to-selected). */
  containerRef?: Ref<HTMLDivElement>
  children: ReactNode
}

// ─── TreeContainer ────────────────────────────────────────────────────────────

export function TreeContainer({
  ariaLabel,
  testId,
  className,
  containerRef,
  children,
}: TreeContainerProps) {
  return (
    <div
      ref={containerRef}
      role="tree"
      aria-label={ariaLabel}
      data-testid={testId}
      className={className}
    >
      {children}
    </div>
  )
}

// ─── Tree (generic controlled component) ─────────────────────────────────────

/** Internal flat item shape used for keyboard navigation. */
interface FlatItem<T> {
  id: string
  item: T
}

export function Tree<T>({
  items,
  getId,
  getChildren,
  isExpanded,
  isSelected,
  renderItem,
  onSelect,
  onToggleExpand,
  ariaLabel,
  testId,
  onItemKeyDown,
  containerRef: externalContainerRef,
}: TreeProps<T>) {
  // ── Roving tabIndex state ─────────────────────────────────────────────────
  const [focusedId, setFocusedId] = useState<string | null>(null)
  // Internal ref always populated — used for contains(activeElement) focus checks.
  const treeRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(externalContainerRef, () => treeRef.current as HTMLDivElement)
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // ── Flat visible list for keyboard navigation ─────────────────────────────
  const visibleItems = useMemo(
    () => flattenVisible(items, getId, getChildren, isExpanded),
    [items, getId, getChildren, isExpanded],
  )

  const effectiveFocusedId = focusedId ?? visibleItems[0]?.id ?? null

  // When focusedId changes, imperatively move DOM focus (only if tree is active)
  useEffect(() => {
    if (!focusedId) return
    const el = nodeRefs.current.get(focusedId)
    if (el && treeRef.current?.contains(document.activeElement)) {
      el.focus()
    }
  }, [focusedId])

  // ── Node ref registration ─────────────────────────────────────────────────
  const setNodeRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) nodeRefs.current.set(id, el)
      else nodeRefs.current.delete(id)
    },
    [],
  )

  // ── Focus helpers ─────────────────────────────────────────────────────────
  function moveFocus(delta: number) {
    if (visibleItems.length === 0) return
    const idx = visibleItems.findIndex((n) => n.id === effectiveFocusedId)
    const nextIdx = idx === -1
      ? 0
      : Math.max(0, Math.min(visibleItems.length - 1, idx + delta))
    const target = visibleItems[nextIdx]
    setFocusedId(target.id)
    nodeRefs.current.get(target.id)?.focus()
  }

  function focusById(id: string) {
    setFocusedId(id)
    nodeRefs.current.get(id)?.focus()
  }

  // ── Keyboard handler ──────────────────────────────────────────────────────
  function handleKeyDown(e: React.KeyboardEvent, item: T, id: string) {
    const children = getChildren(item)
    const hasChildren = !!children && children.length > 0

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        moveFocus(1)
        break

      case 'ArrowUp':
        e.preventDefault()
        moveFocus(-1)
        break

      case 'ArrowRight':
        e.preventDefault()
        if (hasChildren) {
          if (!isExpanded(item)) {
            onToggleExpand(id)
          } else {
            // Move into the first child
            const firstChildId = getId(children[0])
            focusById(firstChildId)
          }
        }
        break

      case 'ArrowLeft': {
        e.preventDefault()
        if (hasChildren && isExpanded(item)) {
          onToggleExpand(id)
        } else {
          // Move focus to nearest visible ancestor
          const parent = findParent(visibleItems, id, getId, getChildren)
          if (parent) focusById(parent.id)
        }
        break
      }

      case 'Home':
        e.preventDefault()
        if (visibleItems.length > 0) focusById(visibleItems[0].id)
        break

      case 'End':
        e.preventDefault()
        if (visibleItems.length > 0) focusById(visibleItems[visibleItems.length - 1].id)
        break

      case 'Enter':
      case ' ':
        e.preventDefault()
        if (hasChildren) onToggleExpand(id)
        else onSelect(id)
        break

      default:
        // Forward any unhandled key to the caller (e.g. ContextMenu / Shift+F10
        // to trigger a context menu — WCAG 2.1.1).
        onItemKeyDown?.(id, item, e, nodeRefs.current.get(id) ?? null)
        break
    }
  }

  // ── Recursive renderer ────────────────────────────────────────────────────
  function renderNodes(nodeItems: T[], depth: number): ReactNode {
    return nodeItems.map((item) => {
      const id = getId(item)
      const children = getChildren(item)
      const hasChildren = !!children && children.length > 0
      const expanded = isExpanded(item)
      const selected = isSelected(item)
      const isFocused = effectiveFocusedId === id

      return (
        <div key={id} role="none">
          {/*
            Guideline #234 compliance:
            role="treeitem" + tabIndex + onKeyDown + onClick are ALL on this ONE div.
            renderItem provides purely visual content inside — no ARIA attributes needed there.
          */}
          <div
            ref={setNodeRef(id)}
            role="treeitem"
            aria-selected={selected}
            aria-expanded={hasChildren ? expanded : undefined}
            tabIndex={isFocused ? 0 : -1}
            onClick={(e) => {
              e.stopPropagation()
              if (hasChildren) onToggleExpand(id)
              else onSelect(id)
            }}
            onFocus={() => setFocusedId(id)}
            onKeyDown={(e) => handleKeyDown(e, item, id)}
            className={styles.treeItem}
          >
            {renderItem(item, { depth, isFocused, isExpanded: expanded, isSelected: selected })}
          </div>
          {/* Children group — WAI-ARIA tree pattern requires role="group" */}
          {hasChildren && expanded && (
            <div role="group">
              {renderNodes(children, depth + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div
      ref={treeRef}
      role="tree"
      aria-label={ariaLabel}
      data-testid={testId}
      className={styles.tree}
    >
      {renderNodes(items, 0)}
    </div>
  )
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Depth-first traversal of currently visible nodes (respects isExpanded). */
function flattenVisible<T>(
  nodes: T[],
  getId: (item: T) => string,
  getChildren: (item: T) => T[] | undefined,
  isExpanded: (item: T) => boolean,
): FlatItem<T>[] {
  const result: FlatItem<T>[] = []
  function visit(item: T) {
    result.push({ id: getId(item), item })
    if (isExpanded(item)) {
      const children = getChildren(item) ?? []
      for (const child of children) visit(child)
    }
  }
  for (const node of nodes) visit(node)
  return result
}

/**
 * Find the nearest visible ancestor of targetId.
 * Walks the flat visible list and checks if any item contains targetId in its children.
 */
function findParent<T>(
  visibleItems: FlatItem<T>[],
  targetId: string,
  getId: (item: T) => string,
  getChildren: (item: T) => T[] | undefined,
): FlatItem<T> | null {
  for (const flat of visibleItems) {
    const children = getChildren(flat.item) ?? []
    if (children.some((c) => getId(c) === targetId)) return flat
  }
  return null
}
