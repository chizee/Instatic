/**
 * Visual Components — Zod schemas and derived types.
 *
 * Schemas are the source of truth. Types are derived via `z.infer<typeof Schema>`.
 * No parallel TypeScript interfaces — schema definitions ARE the contract.
 *
 * Architecture source: Contribution #619 §2
 * Constraint #269: This file must NOT import from editor/ or editor-store/.
 */

import { z } from 'zod'
import type { BaseNode } from '@core/page-tree/baseNode'

// ---------------------------------------------------------------------------
// VCParamType — valid param type values
// ---------------------------------------------------------------------------

export const VCParamTypeSchema = z.enum([
  'string',
  'number',
  'boolean',
  'url',
  'enum',
  'color',
  'image',
  'richText',
  'slot',
])

export type VCParamType = z.infer<typeof VCParamTypeSchema>

// ---------------------------------------------------------------------------
// VCNode — a node inside a Visual Component tree (parallel to PageNode)
//
// VCNode uses a nested structure (childNodes) rather than the flat-map structure
// of Page.nodes — tree traversal is simpler for VC authoring.
//
// VCNodeSchema is self-referential and requires z.lazy() with an explicit type
// annotation (standard Zod recursive schema pattern).
// ---------------------------------------------------------------------------

const PropBindingSchema = z.object({
  paramId: z.string(),
})

/**
 * A node inside a Visual Component tree.
 *
 * Defined as `BaseNode` (shared with `PageNode`) intersected with a
 * self-referential `childNodes` for nested tree traversal. Unlike `PageNode`,
 * `VCNode` carries no `dynamicBindings` — that field is exclusive to CMS
 * template pages.
 *
 * The `breakpointOverrides` value type matches `BaseNode`
 * (`Partial<Record<string, unknown>>`). The Zod schema uses
 * `z.record(z.string(), z.unknown())` for the inner map, whose output is
 * assignable to that shape.
 *
 * Explicit TypeScript type annotation required for z.lazy() recursive schema.
 * All props are flat (no dot-path keys) — same invariant as PageNode.
 */
export type VCNode = BaseNode & { childNodes?: VCNode[] }

export const VCNodeSchema: z.ZodType<VCNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    moduleId: z.string(),
    props: z.record(z.string(), z.unknown()).default({}),
    breakpointOverrides: z.record(z.string(), z.record(z.string(), z.unknown())).default({}),
    children: z.array(z.string()).default([]),
    label: z.string().optional(),
    locked: z.boolean().optional(),
    hidden: z.boolean().optional(),
    classIds: z.array(z.string()).default([]),
    propBindings: z.record(z.string(), PropBindingSchema).optional(),
    childNodes: z.array(VCNodeSchema).optional(),
  })
)

// ---------------------------------------------------------------------------
// VCParam — a named parameter on a Visual Component
// ---------------------------------------------------------------------------

export const VCParamSchema = z.object({
  /** Stable ID — generated with nanoid(); survives param renames */
  id: z.string(),
  /** camelCase, valid JS identifier, unique within the VC */
  name: z.string(),
  /** Param type — unknown values fall back to 'string' */
  type: VCParamTypeSchema.catch('string'),
  /** Optional human-readable description shown in the Properties Panel */
  description: z.string().optional(),
  defaultValue: z.unknown().default(''),
  required: z.boolean().default(false),
  /** Only meaningful when type === 'enum' — non-string items are silently dropped */
  enumOptions: z.preprocess(
    (v) => Array.isArray(v) ? v.filter((x) => typeof x === 'string') : undefined,
    z.array(z.string()).optional(),
  ),
})

export type VCParam = z.infer<typeof VCParamSchema>

// ---------------------------------------------------------------------------
// VisualComponent — top-level VC document
// ---------------------------------------------------------------------------

const VCBreakpointSchema = z.object({
  id: z.string().min(1),
  label: z.string().default(''),
  width: z.number().default(0),
  icon: z.string().default('monitor'),
})

/**
 * Zod schema for a VisualComponent stored in SiteDocument.visualComponents[].
 *
 * Resilient parsing:
 *   - params: silently drops items that fail VCParamSchema
 *   - breakpoints: silently drops items with empty id
 *   - createdAt: falls back to Date.now() for missing/invalid timestamps
 *
 * Naming invariants (enforced by validateComponentName at write boundaries):
 *   - PascalCase, valid JS identifier
 *   - Not a reserved React/JS name
 *   - Not a base module display name
 *   - Unique within the site
 */
export const VisualComponentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  rootNode: VCNodeSchema,
  params: z.array(z.unknown()).default([]).transform((items) =>
    items.flatMap((item) => {
      const r = VCParamSchema.safeParse(item)
      return r.success ? [r.data] : []
    })
  ),
  breakpoints: z.array(z.unknown()).default([]).transform((items) =>
    items.flatMap((item) => {
      const r = VCBreakpointSchema.safeParse(item)
      return r.success ? [r.data] : []
    })
  ),
  classIds: z.array(z.string()).default([]),
  /** Falls back to Date.now() for missing or non-numeric values */
  createdAt: z.number().catch(() => Date.now()),
})

export type VisualComponent = z.infer<typeof VisualComponentSchema>
