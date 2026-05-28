/**
 * Site-editing capabilities are split three ways:
 *
 *   site.structure.edit  — add/remove/move/duplicate/rename nodes; manage
 *                          pages, visual components, classes registry.
 *   site.content.edit    — modify content-typed props on existing nodes
 *                          (text, richtext, image src/alt, link href, etc.).
 *                          The "client / copy editor" surface.
 *   site.style.edit      — modify CSS classes, style overrides, breakpoints,
 *                          framework tokens.
 *
 * Mirrored from `server/auth/capabilities.ts` — keep both lists in sync.
 * The `capability-picker-coverage.test.ts` architecture gate enforces full
 * coverage between this list, the picker UI, and the server schema.
 */
export const CORE_CAPABILITIES = [
  'dashboard.read',
  'site.read',
  'site.structure.edit',
  'site.content.edit',
  'site.style.edit',
  'pages.edit',
  'pages.publish',
  'content.create',
  'content.edit.own',
  'content.edit.any',
  'content.publish.own',
  'content.publish.any',
  'content.manage',
  // Media — granular split (read/write/replace/delete).
  'media.read',
  'media.write',
  'media.replace',
  'media.delete',
  // Runtime + storage — split out of the old `runtime.manage`.
  'runtime.dependencies',
  'storage.elect',
  'storage.migrate',
  // Plugins — granular split (read/configure/install/lifecycle).
  'plugins.read',
  'plugins.configure',
  'plugins.install',
  'plugins.lifecycle',
  'users.manage',
  'roles.manage',
  'audit.read',
  // Data workspace — split from `content.manage`.
  'data.tables.read',
  'data.tables.manage',
  'data.rows.move',
  'data.export',
  'data.import',
  // AI runtime — `ai.chat` for conversations + read tools; `ai.tools.write`
  // for canvas write tools. See `docs/plans/2026-05-26-ai-runtime-rewrite.md`.
  'ai.chat',
  'ai.tools.write',
  'ai.providers.manage',
  'ai.audit.read',
] as const

export type CoreCapability = typeof CORE_CAPABILITIES[number]

/**
 * Convenience set — any of these means the user can mutate the draft site in
 * some way. Granular diff validation enforces which kinds of changes are
 * actually allowed for a given caller.
 */
export const SITE_WRITE_CAPABILITIES: readonly CoreCapability[] = [
  'site.structure.edit',
  'site.content.edit',
  'site.style.edit',
]
