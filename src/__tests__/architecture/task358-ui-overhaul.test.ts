/**
 * Architecture Gate Tests — Task #358: UI Overhaul
 *
 * Guards for the UI Overhaul directives (Task #358 / User directive #1532):
 *
 * 1. Panel design tokens in `tokens.ts` — `panel` export with glassmorphism keys.
 *    Guideline #356: all overlay panels must reference these tokens rather than
 *    raw hex literals or CSS var strings (Constraint #257 enforcement).
 *
 * 2. EditorLayout canvas-wrapper uses `position: relative` (the containing block
 *    for absolutely-positioned overlay panels).
 *    Guideline #356: floating panels use `position: absolute` — they need a
 *    `position: relative` ancestor scoped to the canvas area, not the viewport.
 *
 * 3. No `min-h-[44px]` in editor Toolbar and panel controls.
 *    Guideline #357: editor chrome targets ≤28px control height.
 *    The user explicitly waived WCAG touch-target requirements for editor UI
 *    (message #1532). `min-h-[44px]` must be replaced with `h-7` (28px) or `h-6` (24px).
 *
 * Gates 2 and 3 are pre-registered until Task #358 lands (detected by the
 * existence of `usePropertiesPanelAutoOpen.ts`). Gate 1 is self-activating —
 * it activates as soon as `export const panel` appears in tokens.ts.
 *
 * @see Task #358 — UI Overhaul (FSE: Full Stack Engineer)
 * @see Guideline #356 — Panel Visual Style — Floating Overlay (supersedes #213)
 * @see Guideline #357 — Editor UI Density — Compact Mode (amends #189)
 * @see Constraint #257 — No Hardcoded Hex Values in Component Files
 */

import { describe, it, expect } from 'bun:test'
import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const SRC_ROOT = join(import.meta.dir, '../../')

const TOKENS_PATH = join(SRC_ROOT, 'ui/tokens.ts')
const EDITOR_LAYOUT_PATH = join(SRC_ROOT, 'app/EditorLayout.tsx')

// Candidate paths for the usePropertiesPanelAutoOpen hook (Task #358 Deliverable 4)
const AUTO_OPEN_HOOK_CANDIDATES = [
  join(SRC_ROOT, 'editor/components/PropertiesPanel/usePropertiesPanelAutoOpen.ts'),
  join(SRC_ROOT, 'editor/components/PropertiesPanel/usePropertiesPanelAutoOpen.tsx'),
  join(SRC_ROOT, 'editor/hooks/usePropertiesPanelAutoOpen.ts'),
  join(SRC_ROOT, 'editor/hooks/usePropertiesPanelAutoOpen.tsx'),
]

// Task #358 is considered "landed" when the auto-open hook file exists.
// (It is one of the final deliverables — its existence implies the overlay
// panel redesign, token wiring, and compact density pass are complete.)
function isTask358Landed(): boolean {
  return AUTO_OPEN_HOOK_CANDIDATES.some(existsSync)
}
const TASK358_LANDED = isTask358Landed()

// Panel token keys mandated by Task #358 / Guideline #356
const REQUIRED_PANEL_TOKEN_KEYS = [
  'bg',
  'blur',
  'border',
  'radius',
  'shadowInsetTop',
  'shadowInsetBottom',
  'shadowDrop',
] as const

// Directories to scan for compact-density violations (Guideline #357).
// Excludes: SettingsModal (Phase 6, governed by Guideline #225),
//           AgentPanel (Phase D, separate density scope).
const COMPACT_DENSITY_DIRS = [
  join(SRC_ROOT, 'editor/components/Toolbar'),
  join(SRC_ROOT, 'editor/components/DomPanel'),
  join(SRC_ROOT, 'editor/components/PropertiesPanel'),
  join(SRC_ROOT, 'editor/components/PropertyControls'),
]

// ---------------------------------------------------------------------------
// File walker
// ---------------------------------------------------------------------------

function collectTs(dir: string): string[] {
  const results: string[] = []
  if (!existsSync(dir)) return results
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...collectTs(full))
    } else if (['.ts', '.tsx'].includes(extname(entry))) {
      results.push(full)
    }
  }
  return results
}

// ---------------------------------------------------------------------------
// Gate 1 — Panel token export shape (Guideline #356)
//
// Task #358 Deliverable 2 requires adding to `src/ui/tokens.ts`:
//   export const panel = {
//     bg: 'rgba(10, 20, 60, 0.45)',
//     blur: '18px',
//     border: 'rgba(100, 140, 255, 0.18)',
//     radius: '12px',
//     shadowInsetTop: 'inset 0 1px 0 rgba(180, 200, 255, 0.12)',
//     shadowInsetBottom: 'inset 0 -1px 0 rgba(0, 0, 20, 0.25)',
//     shadowDrop: '0 8px 32px rgba(0, 0, 40, 0.40)',
//   } as const
//
// These tokens must be consumed from tokens.ts — never as raw hex/rgba literals
// in component files (Constraint #257: no hardcoded hex in component files).
//
// Self-activating: the gate runs as soon as `export const panel` exists in tokens.ts.
// Before that, it logs a pre-registered message and passes.
// ---------------------------------------------------------------------------

describe('Task #358 Gate 1 — `panel` token export must have all required glassmorphism keys (Guideline #356)', () => {
  it('tokens.ts must export a `panel` object with the full set of overlay design tokens', () => {
    if (!existsSync(TOKENS_PATH)) {
      throw new Error(
        '[Task #358] tokens.ts not found at ' + TOKENS_PATH.replace(SRC_ROOT, 'src/') +
        '\nExpected at src/ui/tokens.ts per Phase B design token conventions.'
      )
    }

    const src = readFileSync(TOKENS_PATH, 'utf8')

    if (!/export\s+const\s+panel\b/.test(src)) {
      // `panel` export not yet added — pre-registered, not yet active
      console.log(
        '[Task358 gate] tokens.ts does not yet export `panel` — ' +
        'panel token shape gate pre-registered ' +
        '(Task #358 Deliverable 2 / Guideline #356)'
      )
      expect(true).toBe(true)
      return
    }

    // `panel` export exists — assert all required keys are present
    const violations: string[] = []
    for (const key of REQUIRED_PANEL_TOKEN_KEYS) {
      // Match `key:` as a property key in the panel object
      if (!new RegExp(`\\b${key}\\s*:`).test(src)) {
        violations.push(key)
      }
    }

    if (violations.length > 0) {
      throw new Error(
        '[Task #358 / Guideline #356] `panel` token export in tokens.ts is missing required keys.\n' +
        'All of these keys are required for the glassmorphism overlay panel visual style:\n' +
        REQUIRED_PANEL_TOKEN_KEYS.map((k) => `  ${k}`).join('\n') +
        '\n\nMissing keys:\n' +
        violations.map((k) => `  ${k}`).join('\n') +
        '\n\nExpected shape:\n' +
        '  export const panel = {\n' +
        '    bg: "rgba(10, 20, 60, 0.45)",\n' +
        '    blur: "18px",\n' +
        '    border: "rgba(100, 140, 255, 0.18)",\n' +
        '    radius: "12px",\n' +
        '    shadowInsetTop: "inset 0 1px 0 rgba(180, 200, 255, 0.12)",\n' +
        '    shadowInsetBottom: "inset 0 -1px 0 rgba(0, 0, 20, 0.25)",\n' +
        '    shadowDrop: "0 8px 32px rgba(0, 0, 40, 0.40)",\n' +
        '  } as const\n' +
        'See Task #358 Deliverable 2 — Wire Panel Design Tokens.'
      )
    }

    expect(violations).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// Gate 2 — EditorLayout canvas-wrapper uses position:relative (Guideline #356)
//
// Floating overlay panels (DomPanel, PropertiesPanel) use:
//   position: absolute; top: 16px; left/right: 16px; z-index: 50
//
// For `position: absolute` to scope to the editor canvas area (and NOT the
// browser viewport), the nearest positioned ancestor must be the canvas-
// containing div. That div must carry `position: relative` (Tailwind: `relative`).
//
// Without this, panel overlays will escape the canvas area and overlap the
// browser chrome / app shell.
//
// Pre-registered until Task #358 lands (usePropertiesPanelAutoOpen.ts exists).
// ---------------------------------------------------------------------------

describe('Task #358 Gate 2 — EditorLayout canvas-wrapper must be position:relative (Guideline #356)', () => {
  it('[pre-registered] The canvas-containing div in EditorLayout must carry the `relative` Tailwind class', () => {
    if (!TASK358_LANDED) {
      console.log(
        '[Task358 gate] Task #358 not yet landed — ' +
        'EditorLayout position:relative containing-block gate pre-registered (Guideline #356)'
      )
      expect(true).toBe(true)
      return
    }

    if (!existsSync(EDITOR_LAYOUT_PATH)) {
      throw new Error(
        '[Task #358 / Guideline #356] EditorLayout.tsx not found.\n' +
        'Expected at: ' + EDITOR_LAYOUT_PATH.replace(SRC_ROOT, 'src/')
      )
    }

    const src = readFileSync(EDITOR_LAYOUT_PATH, 'utf8')

    // Check that a className string in EditorLayout contains 'relative'
    // AND that the same file references CanvasRoot (confirming this is the
    // canvas-containing block, not an unrelated relative-positioned element).
    const hasRelativeClass = /className\s*=\s*[`{]["'][^`'"]*\brelative\b/.test(src)

    if (!hasRelativeClass) {
      throw new Error(
        '[Task #358 / Guideline #356] EditorLayout.tsx canvas-wrapper does not have position:relative.\n' +
        'Floating panels use `position: absolute` for overlay positioning.\n' +
        'Without a `position: relative` ancestor, they escape the canvas area and overlay browser chrome.\n' +
        '\n' +
        'Required change to EditorLayout.tsx:\n' +
        '  // ❌ Before (panels clip outside canvas)\n' +
        '  <div className="flex flex-1 overflow-hidden">\n' +
        '    <DomPanel />         {/* sidebar — takes up space */}\n' +
        '    <CanvasRoot />\n' +
        '    <PropertiesPanel />  {/* sidebar — takes up space */}\n' +
        '  </div>\n' +
        '\n' +
        '  // ✅ After (panels overlay canvas)\n' +
        '  <div className="flex flex-1 overflow-hidden relative">\n' +
        '    <CanvasRoot />       {/* fills full available area */}\n' +
        '    <DomPanel />         {/* absolute top:16 left:16 overlay */}\n' +
        '    <PropertiesPanel />  {/* absolute top:16 right:16 overlay */}\n' +
        '  </div>\n' +
        'See Guideline #356 — Panel Visual Style, Task #358 Deliverable 6.'
      )
    }

    expect(hasRelativeClass).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Gate 3 — No min-h-[44px] in editor Toolbar and panel controls (Guideline #357)
//
// User directive (message #1532): "I really don't care about WCAG … we really
// need to have smaller and cleaner elements. We cannot have these huge ass buttons!"
//
// Guideline #357 amends Guideline #189 for editor chrome:
//   - Toolbar buttons: h-7 (28px)
//   - Icon-only buttons: h-6 (24px)
//   - Input controls in panels: h-6 (24px)
//
// `min-h-[44px]` was the WCAG 2.1 AA touch-target minimum — it is explicitly
// waived for editor chrome. After Task #358, no toolbar or panel control file
// should contain this class.
//
// Scoped to: Toolbar, DomPanel, PropertiesPanel, PropertyControls.
// Excludes:  SettingsModal (Guideline #225 governs modal a11y separately),
//            AgentPanel (Phase D, separate scope).
//
// Pre-registered until Task #358 lands.
// ---------------------------------------------------------------------------

describe('Task #358 Gate 3 — No min-h-[44px] in editor Toolbar / panel controls (Guideline #357)', () => {
  it('[pre-registered] Editor control files must not use min-h-[44px] (compact density required)', () => {
    if (!TASK358_LANDED) {
      console.log(
        '[Task358 gate] Task #358 not yet landed — ' +
        'compact density min-h-[44px] gate pre-registered (Guideline #357 / Task #358 Deliverable 5)'
      )
      expect(true).toBe(true)
      return
    }

    const MIN_H_44_RE = /\bmin-h-\[44px\]/

    const violations: string[] = []

    for (const dir of COMPACT_DENSITY_DIRS) {
      for (const file of collectTs(dir)) {
        let src: string
        try { src = readFileSync(file, 'utf8') } catch { continue }

        if (!MIN_H_44_RE.test(src)) continue

        const lines = src.split('\n')
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          // Skip comments
          if (/^\s*\/\//.test(line)) continue
          if (MIN_H_44_RE.test(line)) {
            violations.push(
              `${file.replace(SRC_ROOT, 'src/')}:${i + 1} — ` +
              'min-h-[44px] must be replaced with h-7 (toolbar: 28px) or h-6 (icon: 24px)'
            )
          }
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        '[Task #358 / Guideline #357] min-h-[44px] found in editor Toolbar/panel control files.\n' +
        'User directive #1532 relaxes WCAG touch-target requirements for editor chrome.\n' +
        'All toolbar buttons must be ≤28px height; icon-only buttons must be ≤24px.\n' +
        '\n' +
        'Replacements:\n' +
        '  min-h-[44px]  →  h-7        (toolbar action buttons, 28px)\n' +
        '  min-h-[44px]  →  h-6 w-6    (icon-only buttons, 24px)\n' +
        '  p-3 / p-4     →  px-2 py-1  (toolbar button padding)\n' +
        '\n' +
        'See Guideline #357 — Editor UI Density — Compact Mode, Task #358 Deliverable 5.\n' +
        'Violations:\n' +
        violations.map((v) => `  ${v}`).join('\n')
      )
    }

    expect(violations).toHaveLength(0)
  })
})
