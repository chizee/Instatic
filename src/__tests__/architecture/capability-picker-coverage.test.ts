/**
 * Architecture gate — every entry in `CORE_CAPABILITIES` must appear in
 * `CAPABILITY_META` AND in one `CAPABILITY_GROUPS` section. Otherwise a
 * new capability added on the server side would silently fall out of the
 * role-edit UI — admins couldn't grant it to a custom role.
 *
 * Mirror test ensures the server's `CoreCapability` literal union and the
 * client's `CORE_CAPABILITIES` array stay aligned. The two files MUST list
 * the same set of strings; this test catches the case where someone adds
 * a literal to one but forgets the other.
 */

import { describe, expect, it } from 'bun:test'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import { CORE_CAPABILITIES } from '@core/capabilities'
import {
  ALL_PICKER_CAPABILITIES,
  CAPABILITY_GROUPS,
  CAPABILITY_META,
} from '@admin/pages/users/utils/capabilities'

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

describe('capability picker coverage', () => {
  it('every CoreCapability has a CAPABILITY_META entry', () => {
    const missing = CORE_CAPABILITIES.filter((cap) => !(cap in CAPABILITY_META))
    if (missing.length > 0) {
      throw new Error(
        `[capability-picker-coverage] capabilities missing from CAPABILITY_META:\n` +
        missing.map((c) => `  - ${c}`).join('\n') +
        `\n\nAdd a { label, description } entry in ` +
        `src/admin/pages/users/utils/capabilities.ts so the role-edit dialog ` +
        `can render a human-readable row for each grant.`,
      )
    }
    expect(missing).toHaveLength(0)
  })

  it('every CoreCapability appears in one CAPABILITY_GROUPS section', () => {
    const pickerSet = new Set(ALL_PICKER_CAPABILITIES)
    const missing = CORE_CAPABILITIES.filter((cap) => !pickerSet.has(cap))
    if (missing.length > 0) {
      throw new Error(
        `[capability-picker-coverage] capabilities not assigned to a picker group:\n` +
        missing.map((c) => `  - ${c}`).join('\n') +
        `\n\nAdd each capability to the appropriate { title, capabilities } ` +
        `entry in CAPABILITY_GROUPS so the role-edit dialog renders a ` +
        `checkbox for it.`,
      )
    }
    expect(missing).toHaveLength(0)
  })

  it('CAPABILITY_GROUPS does not reference unknown capabilities', () => {
    const coreSet = new Set<string>(CORE_CAPABILITIES)
    const orphans = ALL_PICKER_CAPABILITIES.filter((cap) => !coreSet.has(cap))
    if (orphans.length > 0) {
      throw new Error(
        `[capability-picker-coverage] picker references capabilities that ` +
        `are not in CORE_CAPABILITIES:\n` +
        orphans.map((c) => `  - ${c}`).join('\n') +
        `\n\nEither remove them from CAPABILITY_GROUPS or add them to ` +
        `CORE_CAPABILITIES in both src/core/capabilities.ts and ` +
        `server/auth/capabilities.ts.`,
      )
    }
    expect(orphans).toHaveLength(0)
  })

  it('client CORE_CAPABILITIES matches the server-side CoreCapabilitySchema literals', async () => {
    // Read the server file and extract the literal union members. Using a
    // text scan rather than importing the server file avoids pulling in
    // the TypeBox + DbClient transitive deps just for a string-set check.
    const serverSource = await readFile(
      join(REPO_ROOT, 'server', 'auth', 'capabilities.ts'),
      'utf-8',
    )
    const literalMatches = [...serverSource.matchAll(/Type\.Literal\('([^']+)'\)/g)]
      .map((m) => m[1])

    const serverSet = new Set(literalMatches)
    const clientSet = new Set<string>(CORE_CAPABILITIES)

    const onlyServer = [...serverSet].filter((c) => !clientSet.has(c))
    const onlyClient = [...clientSet].filter((c) => !serverSet.has(c))

    if (onlyServer.length > 0 || onlyClient.length > 0) {
      const lines: string[] = []
      if (onlyServer.length > 0) {
        lines.push(
          `[capability-picker-coverage] capabilities in server schema but missing from client CORE_CAPABILITIES:`,
          ...onlyServer.map((c) => `  - ${c}`),
        )
      }
      if (onlyClient.length > 0) {
        lines.push(
          `[capability-picker-coverage] capabilities in client CORE_CAPABILITIES but missing from server schema:`,
          ...onlyClient.map((c) => `  - ${c}`),
        )
      }
      lines.push(
        ``,
        `Server file: server/auth/capabilities.ts (Type.Literal union)`,
        `Client file: src/core/capabilities.ts (CORE_CAPABILITIES array)`,
        `These must stay in sync.`,
      )
      throw new Error(lines.join('\n'))
    }

    expect(onlyServer).toHaveLength(0)
    expect(onlyClient).toHaveLength(0)
  })
})
