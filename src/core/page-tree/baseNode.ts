/**
 * BaseNode — shared structural base for both page-flat-map nodes (PageNode)
 * and Visual Component tree nodes (VCNode).
 *
 * Lives in its own module (rather than inside `page-tree/types.ts`) so that
 * `visualComponents/schemas.ts` can import this base without pulling in the
 * full Site / page-tree type graph — which would create the cycle
 * `page-tree/types ↔ visualComponents/{types,schemas}`.
 *
 * Constraint #269: no imports from editor / editor-store here.
 */

/**
 * Fields shared by every node regardless of whether it lives in a page flat-map
 * or inside a Visual Component tree.
 *
 * `PageNode` (in `./types`) extends this interface, adding the
 * CMS-template-only `dynamicBindings` field and narrowing `childNodes` to
 * `PageNode[]`.
 *
 * `VCNode` (in `src/core/visualComponents/schemas.ts`) is defined as
 * `BaseNode & { childNodes?: VCNode[] }` — it reuses this base without
 * the dynamic-bindings surface that is exclusive to CMS template pages.
 *
 * The shared base eliminates the `as unknown as PageNode` / `as unknown as VCNode`
 * casts that would otherwise be required when tree-walking functions need to
 * operate on nodes from either context.
 */
export interface BaseNode {
  /** Unique ID — generated with nanoid() */
  id: string

  /**
   * References a ModuleDefinition in the registry.
   * Format: "namespace.module-name" — e.g. "base.text"
   */
  moduleId: string

  /**
   * Resolved property values for this node's module.
   * Shape validated against ModuleDefinition.schema at runtime.
   * Keys are FLAT — no dot-path nesting.
   */
  props: Record<string, unknown>

  /**
   * Per-breakpoint prop overrides — shallow-merged on top of props when
   * rendering at a given breakpoint. Key is Breakpoint.id.
   */
  breakpointOverrides: Record<string, Partial<Record<string, unknown>>>

  /**
   * Ordered array of child node IDs.
   * Only meaningful when ModuleDefinition.canHaveChildren === true.
   * All children are in a single default slot (multi-slot deferred post-MVP).
   */
  children: string[]

  /** Optional user-facing label — overrides the module name in the DOM tree panel */
  label?: string

  /** When true, cannot be selected or moved in the editor */
  locked?: boolean

  /** When true, hidden on the canvas (still present in the tree) */
  hidden?: boolean

  /**
   * Ordered class IDs from the site's class registry.
   * Applied as the referenced user-facing class names on the element.
   * Later classes in the array win in cascade order.
   * Empty array when no classes are applied.
   */
  classIds: string[]

  /**
   * Prop bindings for render-time parameter substitution.
   * Maps prop key → { paramId } (stable VCParam.id reference).
   * When present, the renderer substitutes instanceProps[param.name] for
   * the bound prop key at render time (Contribution #619 §4 Option β).
   * Optional — absent on all standard Page nodes and unbound VC nodes.
   */
  propBindings?: Record<string, { paramId: string }>
}
