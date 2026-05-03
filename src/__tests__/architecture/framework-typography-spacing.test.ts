/**
 * Architecture gates for the new Typography & Spacing framework modules.
 *
 * Mirrors the gating style of the existing color framework / panel rail tests:
 *   - The engine layer (src/core/framework/typography.ts, .../spacing.ts,
 *     .../scale.ts, .../preferences.ts) MUST stay React-free so the publisher
 *     and any future server-side code can import it.
 *   - The editor panels MUST live under src/editor/components/<Family>Panel/
 *     and consume only the page-builder design tokens (no raw hex, no Tailwind).
 *   - The new icons (`type`, `ruler-dimension`) MUST be on the panel rail and
 *     reachable through the catalog import path the icon gate already enforces.
 *
 * Each gate failure produces a precise, actionable error so a future refactor
 * never silently drops a constraint.
 */

import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '../..')

function readSource(relative: string): string {
  const path = join(ROOT, relative)
  if (!existsSync(path)) {
    throw new Error(`[arch] expected file does not exist: ${relative}`)
  }
  return readFileSync(path, 'utf8')
}

describe('architecture — framework typography & spacing engine', () => {
  it('engine modules are React-free (no react/react-dom imports)', () => {
    const sources = [
      'core/framework/scale.ts',
      'core/framework/typography.ts',
      'core/framework/spacing.ts',
      'core/framework/preferences.ts',
      'core/framework/defaults.ts',
    ]
    for (const relative of sources) {
      const source = readSource(relative)
      expect(source).not.toMatch(/from\s+['"]react['"]/i)
      expect(source).not.toMatch(/from\s+['"]react-dom['"]/i)
    }
  })

  it('engine modules emit only token-style declarations (no inline hex colors)', () => {
    const sources = [
      'core/framework/scale.ts',
      'core/framework/typography.ts',
      'core/framework/spacing.ts',
    ]
    const HEX = /#[0-9a-fA-F]{3,8}\b/
    for (const relative of sources) {
      const source = readSource(relative)
      expect(HEX.test(source)).toBe(false)
    }
  })
})

describe('architecture — typography / spacing panels', () => {
  it('TypographyPanel and SpacingPanel exist at the expected paths', () => {
    expect(existsSync(join(ROOT, 'editor/components/TypographyPanel/TypographyPanel.tsx'))).toBe(
      true,
    )
    expect(existsSync(join(ROOT, 'editor/components/SpacingPanel/SpacingPanel.tsx'))).toBe(true)
    expect(
      existsSync(join(ROOT, 'editor/components/shared/FrameworkScalePanel/FrameworkScalePanel.tsx')),
    ).toBe(true)
  })

  it('panel CSS module uses only design tokens, never raw hex colors', () => {
    const css = readSource(
      'editor/components/shared/FrameworkScalePanel/FrameworkScalePanel.module.css',
    )
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
    // Must reference the canonical token names so a refactor of globals.css
    // does not silently break the panel.
    expect(css).toContain('var(--editor-text)')
    expect(css).toContain('var(--editor-surface)')
  })

  it('panels do NOT pull tinted Tailwind color classes', () => {
    const TINTED = /\b(zinc|slate|blue|indigo|violet)-\d{2,3}\b/
    for (const file of [
      'editor/components/TypographyPanel/TypographyPanel.tsx',
      'editor/components/SpacingPanel/SpacingPanel.tsx',
      'editor/components/shared/FrameworkScalePanel/FrameworkScalePanel.tsx',
    ]) {
      expect(TINTED.test(readSource(file))).toBe(false)
    }
  })
})

describe('architecture — panel rail', () => {
  const railSource = readSource('editor/components/PanelRail/PanelRail.tsx')

  it('rail wires both new panels via the catalog icon imports', () => {
    expect(railSource).toContain("from 'pixel-art-icons/icons/text-start-t'")
    expect(railSource).toContain("from 'pixel-art-icons/icons/ruler-dimension'")
  })

  it('rail exposes typography + spacing entries with stable ids', () => {
    expect(railSource).toMatch(/id:\s*'typography'/)
    expect(railSource).toMatch(/id:\s*'spacing'/)
  })
})

describe('architecture — left sidebar', () => {
  const layoutSource = readSource('editor/components/LeftSidebar/LeftSidebar.tsx')

  it('mounts TypographyPanel and SpacingPanel as docked variants', () => {
    expect(layoutSource).toContain('<TypographyPanel variant="docked" />')
    expect(layoutSource).toContain('<SpacingPanel variant="docked" />')
  })
})
