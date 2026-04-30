/**
 * Architecture Gate Tests — Post-#434 Migration Regression Guards
 *
 * Replaces the stale Phase E+ ProjectPanel gates (Task #364 era).
 * ProjectPanel was deleted in Task #434 (Contribution #627); DepsSection
 * now lives under the standalone DependenciesPanel.
 *
 * These guards assert the post-migration architectural invariants:
 *
 * 1. DepsSection exists at its canonical standalone DependenciesPanel path.
 * 2. projectPanelSlice retains the live dep-management fields (setDependency,
 *    removeDependency, packageJson) but no longer carries dead panel-toggle
 *    state (isProjectPanelOpen, activeProjectPanelTab, setProjectPanelOpen,
 *    setProjectPanelTab) — removed in Task #441.
 * 3. EditorLayout.tsx has no ProjectPanel import (migration regression guard).
 * 4. DepsSection retains SAFE_PACKAGE_NAME validation (Constraint #361 Rule 5).
 * 5. Dead panel-toggle state absent from projectPanelSlice (Task #441 sweep).
 *
 * @see Task #434 — Migration & ProjectPanel Cleanup (Contribution #627)
 * @see Task #441 — Post-#434 Orphan Sweep (this rewrite)
 * @see Constraint #361 — Phase G Local Dev Bridge Security (Rule 5 — package name)
 * @see Guideline #341 — Zustand Store Slice Registry
 * @see Guideline #410 — 5-Panel Fixed Overlay Layout
 */

import { describe, it, expect } from 'bun:test'
import { existsSync, readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const SRC_ROOT = join(import.meta.dir, '../../')

const DEPS_SECTION_PATH = join(SRC_ROOT, 'editor/components/DependenciesPanel/DepsSection.tsx')
const PROJECT_PANEL_SLICE_PATH = join(SRC_ROOT, 'core/editor-store/slices/projectPanelSlice.ts')
const EDITOR_LAYOUT_PATH = join(SRC_ROOT, 'app/EditorLayout.tsx')
const PROJECT_PANEL_DIR = join(SRC_ROOT, 'editor/components/ProjectPanel')

// ---------------------------------------------------------------------------
// Gate 1 — DepsSection exists at canonical standalone DependenciesPanel path
//
// DepsSection.tsx was migrated from ProjectPanel/DepsTab.tsx in Task #434,
// then split out of the project file-tree work into a standalone DependenciesPanel.
// Regression guard: if someone accidentally deletes or moves this file,
// the entire dependency management feature silently disappears.
// ---------------------------------------------------------------------------

describe('Post-#434 Gate 1 — DepsSection at canonical DependenciesPanel path', () => {
  it('DepsSection.tsx must exist at src/editor/components/DependenciesPanel/DepsSection.tsx', () => {
    if (!existsSync(DEPS_SECTION_PATH)) {
      throw new Error(
        '[Post-#434 regression] DepsSection.tsx not found at expected path.\n' +
        'Expected: src/editor/components/DependenciesPanel/DepsSection.tsx\n' +
        '\n' +
        'DepsSection was migrated from ProjectPanel/DepsTab.tsx in Task #434.\n' +
        'If you moved it, update this gate to the new canonical path.\n' +
        'If you accidentally deleted it, restore from Contribution #627.'
      )
    }
    expect(existsSync(DEPS_SECTION_PATH)).toBe(true)
  })

  it('ProjectPanel/ directory must NOT exist (deleted in Task #434)', () => {
    if (existsSync(PROJECT_PANEL_DIR)) {
      // Allow an empty directory shell temporarily, but fail if it has files
      let entries: string[] = []
      try { entries = readdirSync(PROJECT_PANEL_DIR) } catch { /* fine */ }
      if (entries.length > 0) {
        throw new Error(
          '[Post-#434 regression] src/editor/components/ProjectPanel/ still has files.\n' +
          `Found: ${entries.join(', ')}\n` +
          'ProjectPanel was fully deleted in Task #434 (Contribution #627).\n' +
          'Remove remaining files and the directory.'
        )
      }
      // Empty shell is a minor hygiene issue but not a functional regression
      expect(entries).toHaveLength(0)
    } else {
      // Directory gone — ideal state
      expect(existsSync(PROJECT_PANEL_DIR)).toBe(false)
    }
  })
})

// ---------------------------------------------------------------------------
// Gate 2 — projectPanelSlice retains live dep-management fields
//
// After removing dead panel-toggle state, the slice must still export:
//   - packageJson     the in-memory package.json manifest (PackageJson type)
//   - setDependency   adds/updates a dep (SAFE_PACKAGE_NAME validated at call site)
//   - removeDependency removes from both dependencies + devDependencies
//
// These are consumed by DepsSection.tsx and must not be accidentally removed.
// ---------------------------------------------------------------------------

describe('Post-#434 Gate 2 — projectPanelSlice retains live dep-management exports (Guideline #341)', () => {
  it('projectPanelSlice.ts must exist', () => {
    expect(existsSync(PROJECT_PANEL_SLICE_PATH)).toBe(true)
  })

  const LIVE_FIELDS = ['packageJson', 'setDependency', 'removeDependency'] as const

  for (const field of LIVE_FIELDS) {
    it(`projectPanelSlice must declare live field: "${field}"`, () => {
      const src = readFileSync(PROJECT_PANEL_SLICE_PATH, 'utf8')
      if (!src.includes(field)) {
        throw new Error(
          `[Post-#434 / Guideline #341] "${field}" missing from projectPanelSlice.ts.\n` +
          'This is a live field consumed by DepsSection.tsx — do not remove it.\n' +
          `DepsSection reads "${field}" via: useEditorStore((s) => s.${field})`
        )
      }
      expect(src).toContain(field)
    })
  }
})

// ---------------------------------------------------------------------------
// Gate 3 — Dead panel-toggle fields removed from projectPanelSlice (Task #441)
//
// isProjectPanelOpen, activeProjectPanelTab, setProjectPanelOpen,
// setProjectPanelTab were zombie state after Task #434:
//   - ProjectPanel overlay no longer exists (Guideline #410: 5-panel layout)
//   - No production consumer reads these fields after the migration
//
// Keeping them pollutes the store type, bloats the slice, and creates
// a misleading API surface (the panel they toggle no longer exists).
// ---------------------------------------------------------------------------

describe('Post-#434 Gate 3 — Dead panel-toggle state removed from projectPanelSlice (Task #441)', () => {
  const DEAD_FIELDS = [
    'isProjectPanelOpen',
    'activeProjectPanelTab',
    'setProjectPanelOpen',
    'setProjectPanelTab',
  ] as const

  for (const deadField of DEAD_FIELDS) {
    it(`projectPanelSlice must NOT declare zombie field: "${deadField}"`, () => {
      if (!existsSync(PROJECT_PANEL_SLICE_PATH)) {
        expect(true).toBe(true)
        return
      }
      const src = readFileSync(PROJECT_PANEL_SLICE_PATH, 'utf8')

      // Filter out JSDoc comment lines and single-line comments before checking
      const nonCommentLines = src
        .split('\n')
        .filter((line) => !/^\s*\*/.test(line) && !/^\s*\/\//.test(line))
        .join('\n')

      if (nonCommentLines.includes(deadField)) {
        throw new Error(
          `[Post-#434 / Task #441] Zombie field "${deadField}" still present in projectPanelSlice.ts.\n` +
          '\n' +
          'This field has no production consumers after Task #434 deleted ProjectPanel.\n' +
          'The panel-toggle sweep in Task #441 should have removed it.\n' +
          '\n' +
          `Fix: remove "${deadField}" from:\n` +
          '  1. The ProjectPanelSlice interface (types section)\n' +
          '  2. The createProjectPanelSlice factory (initial state + setter)\n' +
          '\n' +
          'Preserve: packageJson, setDependency, removeDependency (still used by DepsSection).'
        )
      }
      expect(nonCommentLines.includes(deadField)).toBe(false)
    })
  }
})

// ---------------------------------------------------------------------------
// Gate 4 — EditorLayout.tsx has no ProjectPanel import (regression guard)
//
// ProjectPanel was removed from EditorLayout in Task #434. This gate catches
// accidental re-introduction (e.g. merge conflict, revert, stale import).
//
// EditorLayout must render the current panel architecture:
//   LeftSidebar | PropertiesPanel | CodeEditorPanel
// ---------------------------------------------------------------------------

describe('Post-#434 Gate 4 — EditorLayout has no ProjectPanel import (regression guard / Guideline #410)', () => {
  it('EditorLayout.tsx must not import from ProjectPanel', () => {
    const src = readFileSync(EDITOR_LAYOUT_PATH, 'utf8')
    const hasProjectPanelImport = src
      .split('\n')
      .filter((l) => !/^\s*\/\//.test(l))
      .some((l) => /ProjectPanel/.test(l))

    if (hasProjectPanelImport) {
      throw new Error(
        '[Post-#434 regression / Guideline #410] ProjectPanel import found in EditorLayout.tsx.\n' +
        '\n' +
        'ProjectPanel was deleted in Task #434 (Contribution #627).\n' +
        'EditorLayout must render the current panel architecture:\n' +
        '  <LeftSidebar />\n' +
        '  <PropertiesPanel />\n' +
        '  <CodeEditorPanel />\n' +
        '\n' +
        'Remove the ProjectPanel import and its JSX from EditorLayout.tsx.'
      )
    }
    expect(hasProjectPanelImport).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Gate 5 — DepsSection retains SAFE_PACKAGE_NAME validation (Constraint #361 Rule 5)
//
// Before any setDependency() dispatch, DepsSection must validate the package
// name against the SAFE_PACKAGE_NAME regex. This is CWE-78 prevention:
// without it, a malicious name ("react; rm -rf ~") could achieve RCE via
// `bun add` when Phase G bridge is active.
//
// The validation survived the DepsTab → DepsSection migration (Task #434).
// This gate ensures it is not accidentally removed in future refactors.
// ---------------------------------------------------------------------------

describe('Post-#434 Gate 5 — SAFE_PACKAGE_NAME validation retained in DepsSection (Constraint #361 Rule 5)', () => {
  it('DepsSection.tsx must contain SAFE_PACKAGE_NAME validation pattern', () => {
    const src = readFileSync(DEPS_SECTION_PATH, 'utf8')

    const hasSafeCheck =
      /SAFE_PACKAGE_NAME/.test(src) ||
      /\/\^(?:\(\?:@|\[@)/.test(src) ||
      /SAFE_PACKAGE_NAME.*\.test/.test(src)

    if (!hasSafeCheck) {
      throw new Error(
        '[Post-#434 security / Constraint #361 Rule 5] SAFE_PACKAGE_NAME validation\n' +
        'not found in DepsSection.tsx.\n' +
        '\n' +
        'This validation was present in DepsTab.tsx and must be preserved in DepsSection.\n' +
        'Without it, a malicious package name could achieve RCE via `bun add` when\n' +
        'Phase G bridge is active (CWE-78 — OS Command Injection).\n' +
        '\n' +
        'Required in DepsSection.tsx:\n' +
        '  const SAFE_PACKAGE_NAME =\n' +
        '    /^(?:@[a-z0-9-~][a-z0-9-._~]*\\/)?[a-z0-9-~][a-z0-9-._~]*$/\n' +
        '\n' +
        '  function handleAddPackage(name: string) {\n' +
        '    if (!SAFE_PACKAGE_NAME.test(name)) {\n' +
        '      setAddError("Invalid package name")\n' +
        '      return\n' +
        '    }\n' +
        '    setDependency(name, "*", addDev)\n' +
        '  }\n' +
        '\n' +
        'See Constraint #361 Rule 5 (Phase G Security Architecture).'
      )
    }
    expect(hasSafeCheck).toBe(true)
  })
})
