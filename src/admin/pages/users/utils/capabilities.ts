/**
 * Capability metadata + groupings shown in the role-edit dialog.
 *
 * Every entry in `CAPABILITY_GROUPS` maps to a `<section>` with its own
 * "Select all / Clear" header. `CAPABILITY_META` carries the human-readable
 * label + description rendered next to each checkbox so admins don't have to
 * decode raw permission strings like `site.structure.edit`.
 *
 * Adding a new capability: append it to `CORE_CAPABILITIES` (server +
 * `src/core/capabilities.ts`), then add it to one of the groups here and add
 * its meta entry. The dialog only renders capabilities listed here — the
 * `capability-picker-coverage.test.ts` gate enforces full coverage so a new
 * capability can't quietly disappear from the role-edit UI.
 */
import type { CoreCapability } from '@core/capabilities'
import type { CapabilityGroup } from '../types'

export interface CapabilityMeta {
  /** Human-readable label rendered next to the checkbox. */
  label: string
  /** Short, plain-language description of what this capability grants. */
  description: string
}

export const CAPABILITY_META: Record<CoreCapability, CapabilityMeta> = {
  'dashboard.read': {
    label: 'View dashboard',
    description: 'Open the Dashboard workspace and see activity widgets.',
  },
  'site.read': {
    label: 'View site',
    description: 'Open the Site workspace; view pages, components, and classes.',
  },
  'site.structure.edit': {
    label: 'Edit site structure',
    description: 'Add, remove, move, and rename nodes; manage pages, components, and classes.',
  },
  'site.content.edit': {
    label: 'Edit site content',
    description: 'Change text, images, and links on existing nodes — no structure or style changes.',
  },
  'site.style.edit': {
    label: 'Edit site styles',
    description: 'Modify CSS classes, style overrides, breakpoints, and framework tokens.',
  },
  'pages.edit': {
    label: 'Edit pages',
    description: 'Edit page metadata such as title, slug, and SEO fields.',
  },
  'pages.publish': {
    label: 'Publish pages',
    description: 'Publish or unpublish pages to the live site.',
  },
  'content.create': {
    label: 'Create content',
    description: 'Create new draft posts and content rows.',
  },
  'content.edit.own': {
    label: 'Edit own content',
    description: 'Edit posts and rows that you authored.',
  },
  'content.edit.any': {
    label: 'Edit any content',
    description: 'Edit posts and rows authored by anyone.',
  },
  'content.publish.own': {
    label: 'Publish own content',
    description: 'Publish posts and rows that you authored.',
  },
  'content.publish.any': {
    label: 'Publish any content',
    description: 'Publish posts and rows authored by anyone.',
  },
  'content.manage': {
    label: 'Manage content',
    description: 'Full admin: manage content tables, fields, and every row.',
  },
  'media.manage': {
    label: 'Manage media',
    description: 'Upload, edit, delete, and migrate media; configure storage adapters.',
  },
  'runtime.manage': {
    label: 'Manage runtime',
    description: 'Edit site dependencies in package.json and trigger installs.',
  },
  'plugins.manage': {
    label: 'Manage plugins',
    description: 'Install, enable, disable, update, and uninstall plugins; edit plugin settings.',
  },
  'users.manage': {
    label: 'Manage users',
    description: 'Create, edit, delete, and suspend users; assign roles.',
  },
  'roles.manage': {
    label: 'Manage roles',
    description: 'Create, edit, and delete custom roles; assign capabilities to roles.',
  },
  'audit.read': {
    label: 'Read audit log',
    description: 'View the audit log and the Dashboard activity widget.',
  },
  'ai.use': {
    label: 'Use AI',
    description: 'Invoke AI features (chat, tools) and read your own AI conversations.',
  },
  'ai.providers.manage': {
    label: 'Manage AI providers',
    description: 'Configure AI providers, credentials, and per-scope defaults.',
  },
  'ai.audit.read': {
    label: 'Read AI audit log',
    description: 'View site-wide AI usage, cost, and error events across all users.',
  },
}

/**
 * Returns the human-readable label for a capability — falls back to the raw
 * ID for any value not in the meta map (defensive, in case a stored role
 * references a capability that has since been removed from the codebase).
 */
export function capabilityLabel(capability: string): string {
  return (CAPABILITY_META as Record<string, CapabilityMeta>)[capability]?.label ?? capability
}

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  { title: 'Dashboard', capabilities: ['dashboard.read'] },
  {
    title: 'Site',
    capabilities: [
      'site.read',
      'site.structure.edit',
      'site.content.edit',
      'site.style.edit',
    ],
  },
  { title: 'Pages', capabilities: ['pages.edit', 'pages.publish'] },
  {
    title: 'Content',
    capabilities: [
      'content.create',
      'content.edit.own',
      'content.edit.any',
      'content.publish.own',
      'content.publish.any',
      'content.manage',
    ],
  },
  { title: 'Media', capabilities: ['media.manage'] },
  { title: 'Runtime', capabilities: ['runtime.manage'] },
  { title: 'Plugins', capabilities: ['plugins.manage'] },
  { title: 'AI', capabilities: ['ai.use', 'ai.providers.manage', 'ai.audit.read'] },
  { title: 'Users & Roles', capabilities: ['users.manage', 'roles.manage'] },
  { title: 'Audit', capabilities: ['audit.read'] },
]

/**
 * Flat list of every capability rendered by the role-edit dialog, in the
 * order defined by `CAPABILITY_GROUPS`. Used for the dialog's "select all
 * across every group" master toggle.
 */
export const ALL_PICKER_CAPABILITIES: readonly CoreCapability[] = CAPABILITY_GROUPS.flatMap(
  (group) => group.capabilities,
)
