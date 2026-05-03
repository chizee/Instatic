/**
 * Visual Components — type re-exports.
 *
 * All types are derived from Zod schemas in schemas.ts.
 * Schemas are the source of truth — types follow via `z.infer<typeof Schema>`.
 *
 * Architecture source: Contribution #619 §2
 * Constraint #269: This file must NOT import from editor/ or editor-store/.
 */

export type { VCParamType, VCParam, VCNode, VisualComponent } from './schemas'
