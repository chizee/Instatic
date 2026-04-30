/**
 * Architecture Source-Scan — Phase 5 Persistence Safety Gates
 *
 * Pre-registered gate tests for the Phase 5 persistence layer.
 * These tests use adaptive skipping (same pattern as no-anthropic-sdk.test.ts):
 * they skip with a clear log message if target files don't exist yet, and
 * activate automatically the moment Phase 5 implementation begins.
 *
 * ENFORCED CONSTRAINTS:
 *
 * 1. LocalAdapter.ts must call sanitizeRichtext() before store hydration (Task #302,
 *    Constraint #299 + Security Auditor review of Contribution #411).
 *    Attack surface: a crafted project JSON file could contain XSS payloads in
 *    richtext props. Even though values entered via the Properties Panel are
 *    sanitized at write time, project JSON could be imported from an untrusted source.
 *
 * 2. IDB schema must have TWO object stores: `projects_meta` (dashboard metadata)
 *    and `projects_data` (full project JSON). Loading only metadata on dashboard open
 *    is critical for the < 150ms cold-load budget. Loading full JSON for all projects
 *    on every dashboard render violates the Phase 5 performance spec.
 *
 * 3. An auto-save flush must be registered for tab-close / navigation-away events
 *    (beforeunload or equivalent). The 1s debounce means the last unsaved change
 *    is lost on tab close without a synchronous flush.
 *
 * @see Task #302 — Phase 5 Pre-req: Sanitize Richtext Props on Store Hydration
 * @see Constraint #299 — Richtext Publisher Pass-Through + Write Boundary Rules
 * @see Contribution #411 — DOMPurify at Properties Panel boundary (Test Engineer)
 * @see Contribution #413 — Phase 5 Performance Spec (Performance Engineer)
 * @see Guideline #297 — Phase 5 Project Dashboard UX Patterns (UX Reviewer)
 */

import { describe, it, expect } from 'bun:test'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const SRC_ROOT = join(import.meta.dir, '../../')
const PERSISTENCE_DIR = join(SRC_ROOT, 'core/persistence')
const LOCAL_ADAPTER_PATH = join(PERSISTENCE_DIR, 'LocalAdapter.ts')
const AUTO_SAVE_PATH = join(PERSISTENCE_DIR, 'AutoSaveManager.ts')

const PHASE5_IMPLEMENTED = existsSync(LOCAL_ADAPTER_PATH)

// ---------------------------------------------------------------------------
// Gate 1: LocalAdapter must sanitize richtext props during project hydration
//
// Context: Constraint #299 (Architect) + Security Auditor review of #411.
// The Properties Panel calls sanitizeRichtext() at write time (Contribution #411),
// but project JSON can also be loaded from file or IndexedDB. A crafted project
// file could contain XSS payloads in richtext-typed props. The fix is one call to
// sanitizeRichtext() per richtext prop in loadProject() before store hydration.
// ---------------------------------------------------------------------------

describe('Phase 5 — LocalAdapter richtext sanitization (Constraint #299 / Task #302)', () => {
  it('[pre-registered] LocalAdapter.ts imports sanitizeRichtext from src/core/sanitize.ts', () => {
    if (!PHASE5_IMPLEMENTED) {
      // Test activates when Phase 5 implementation creates LocalAdapter.ts
      console.log(
        '[Phase5 gate] LocalAdapter.ts not yet created — ' +
        'richtext sanitization gate pre-registered (Task #302 / Constraint #299)'
      )
      expect(true).toBe(true)
      return
    }

    const src = readFileSync(LOCAL_ADAPTER_PATH, 'utf8')

    // Must import sanitizeRichtext (from sanitize.ts or as a re-export)
    const hasSanitizeImport =
      /import\s+\{[^}]*sanitizeRichtext[^}]*\}/.test(src) ||
      /import\s+sanitizeRichtext\s+from/.test(src)

    if (!hasSanitizeImport) {
      throw new Error(
        '[Constraint #299 / Task #302] LocalAdapter.ts must import sanitizeRichtext.\n' +
        'The loadProject() method must sanitize all richtext-typed props before store hydration.\n' +
        'Pattern: import { sanitizeRichtext, isRichtextPropKey } from "../sanitize"\n' +
        'See Contribution #411 and Security Auditor review of it for the write-path pattern.'
      )
    }
    expect(hasSanitizeImport).toBe(true)
  })

  it('[pre-registered] LocalAdapter.ts calls sanitizeRichtext() in the hydration path', () => {
    if (!PHASE5_IMPLEMENTED) {
      expect(true).toBe(true)
      return
    }

    const src = readFileSync(LOCAL_ADAPTER_PATH, 'utf8')

    // Must call sanitizeRichtext — not just import it
    const callsIt = /sanitizeRichtext\s*\(/.test(src)
    if (!callsIt) {
      throw new Error(
        '[Constraint #299 / Task #302] LocalAdapter.ts imports but does not call sanitizeRichtext().\n' +
        'Dead import detected. Every richtext-typed prop in the loaded Project must be\n' +
        'passed through sanitizeRichtext() before useEditorStore hydration.\n' +
        'Use isRichtextPropKey() to identify which props need sanitization.'
      )
    }
    expect(callsIt).toBe(true)
  })

  it('[pre-registered] LocalAdapter.ts uses isRichtextPropKey() or equivalent detection', () => {
    if (!PHASE5_IMPLEMENTED) {
      expect(true).toBe(true)
      return
    }

    const src = readFileSync(LOCAL_ADAPTER_PATH, 'utf8')

    // Must reference the richtext key detector — either isRichtextPropKey() or
    // an inline equivalent (checking for 'richtext'/'html' suffix patterns)
    const hasKeyDetection =
      /isRichtextPropKey\s*\(/.test(src) ||
      /richtext.*prop.*key/i.test(src) ||
      // Inline pattern: checking for richtext/html suffix
      /endsWith\s*\(\s*['"]richtext['"]\s*\)|endsWith\s*\(\s*['"]html['"]\s*\)/.test(src)

    if (!hasKeyDetection) {
      throw new Error(
        '[Constraint #299 / Task #302] LocalAdapter.ts does not detect richtext prop keys.\n' +
        'Preferred: import { isRichtextPropKey } from "../sanitize" and use it to identify\n' +
        'which node props need sanitizeRichtext() during hydration.\n' +
        'Alternative: inline suffix check for "richtext" and "html" prop key suffixes.'
      )
    }
    expect(hasKeyDetection).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Gate 2: IDB schema must use the metadata/data split
//
// Context: Performance Engineer spec (Contribution #413) + Guideline #297.
// Dashboard cold-load budget: < 150ms (jank threshold: 300ms).
// Loading full project JSON for every card in the dashboard grid violates this.
// The fix: a `projects_meta` store for lightweight metadata reads (dashboard)
// and a `projects_data` store for full JSON reads (editor open).
// ---------------------------------------------------------------------------

describe('Phase 5 — IDB two-store schema (projects_meta + projects_data)', () => {
  it('[pre-registered] LocalAdapter.ts uses "projects_meta" and "projects_data" object stores', () => {
    if (!PHASE5_IMPLEMENTED) {
      console.log(
        '[Phase5 gate] LocalAdapter.ts not yet created — ' +
        'IDB two-store schema gate pre-registered (Contribution #413 perf spec)'
      )
      expect(true).toBe(true)
      return
    }

    const src = readFileSync(LOCAL_ADAPTER_PATH, 'utf8')
    // NOTE: This scan checks for string literals only. If the store names are
    // defined as constants in a separate file (e.g. `const PROJECTS_META = 'projects_meta'`),
    // this gate may pass vacuously. Implementers must ensure the literal string values
    // 'projects_meta' and 'projects_data' appear somewhere in the LocalAdapter source
    // (or in a constants file imported by it), not hidden behind an opaque symbol.
    const hasMetaStore = /['"`]projects_meta['"`]/.test(src)
    const hasDataStore = /['"`]projects_data['"`]/.test(src)

    const missing: string[] = []
    if (!hasMetaStore) missing.push('projects_meta')
    if (!hasDataStore) missing.push('projects_data')

    if (missing.length > 0) {
      throw new Error(
        `[Phase 5 perf] LocalAdapter.ts IDB schema is missing store(s): ${missing.join(', ')}.\n` +
        'Required schema: two object stores for the metadata/data split pattern.\n' +
        '  "projects_meta" — stores ProjectMeta (name, updatedAt, pageCount) for dashboard reads\n' +
        '  "projects_data" — stores full Project JSON, loaded only when opening an editor tab\n' +
        'Without this split, loading 20 projects in the dashboard means 20× full JSON reads.\n' +
        'See Contribution #413 (Phase 5 Perf Spec), Section 2.'
      )
    }

    expect(hasMetaStore).toBe(true)
    expect(hasDataStore).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Gate 3: Auto-save must register a beforeunload flush
//
// Context: Contribution #413 (Performance Engineer), Section 1.
// The 1s debounce means the last change before tab close is lost without a
// synchronous flushImmediate() on the beforeunload event.
// ---------------------------------------------------------------------------

describe('Phase 5 — Auto-save beforeunload flush', () => {
  it('[pre-registered] AutoSaveManager or LocalAdapter registers a beforeunload / flushImmediate handler', () => {
    const autoSaveExists = existsSync(AUTO_SAVE_PATH)

    if (!autoSaveExists && !PHASE5_IMPLEMENTED) {
      console.log(
        '[Phase5 gate] AutoSaveManager.ts not yet created — ' +
        'beforeunload flush gate pre-registered (Contribution #413 perf spec, Section 1)'
      )
      expect(true).toBe(true)
      return
    }

    // Check AutoSaveManager first (preferred location), fall back to LocalAdapter
    const filesToCheck = [AUTO_SAVE_PATH, LOCAL_ADAPTER_PATH].filter(existsSync)

    const hasFlush = filesToCheck.some((filePath) => {
      const src = readFileSync(filePath, 'utf8')
      return /beforeunload/.test(src) || /flushImmediate/.test(src)
    })

    if (!hasFlush) {
      throw new Error(
        '[Phase 5 perf] No beforeunload / flushImmediate handler found in persistence layer.\n' +
        'The 1s auto-save debounce means edits made in the final second before tab close are lost.\n' +
        'Required: call flushImmediate(project) on window.beforeunload AND React Router navigation.\n' +
        'See Contribution #413 (Phase 5 Perf Spec), Section 1 — "Critical: beforeunload flush is non-negotiable".'
      )
    }
    expect(hasFlush).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Gate 4: No direct JSON.stringify call inside Zustand selectors (perf trap)
//
// Context: Contribution #413 (Performance Engineer), Section 7.
// Calling JSON.stringify(project) inside a Zustand selector fires on every
// store mutation — 60+ serializations/s during a property drag. The serializer
// must only run inside the debounced auto-save callback, never in a selector.
// ---------------------------------------------------------------------------

describe('Phase 5 — No JSON.stringify in Zustand selectors (performance trap)', () => {
  it('[pre-registered] Persistence layer files do not call JSON.stringify inside useEditorStore() selectors', () => {
    if (!PHASE5_IMPLEMENTED) {
      console.log(
        '[Phase5 gate] Phase 5 not yet implemented — ' +
        'JSON.stringify-in-selector perf trap gate pre-registered'
      )
      expect(true).toBe(true)
      return
    }

    // Scan all persistence files for the dangerous pattern:
    //   useEditorStore((state) => JSON.stringify(...))
    //   useEditorStore(state => JSON.stringify(...))
    // A JSON.stringify inside a selector fires on every store mutation.
    const { readdirSync, statSync } = require('fs') as typeof import('fs')
    const { extname } = require('path') as typeof import('path')

    function collectTs(dir: string): string[] {
      if (!existsSync(dir)) return []
      return readdirSync(dir).flatMap((entry: string) => {
        const full = join(dir, entry)
        if (statSync(full).isDirectory()) return collectTs(full)
        return ['.ts', '.tsx'].includes(extname(entry)) ? [full] : []
      })
    }

    const persistenceFiles = collectTs(PERSISTENCE_DIR)
    const DANGEROUS_PATTERN = /useEditorStore\s*\(\s*[^)]*JSON\.stringify/

    const violations = persistenceFiles.filter((f) => {
      try { return DANGEROUS_PATTERN.test(readFileSync(f, 'utf8')) } catch { return false }
    })

    if (violations.length > 0) {
      const rel = violations.map((f) => f.replace(SRC_ROOT, 'src/'))
      throw new Error(
        '[Phase 5 perf] JSON.stringify() detected inside a Zustand selector — CRITICAL perf trap!\n' +
        'A selector fires on every store mutation. JSON.stringify on the full Project at 60Hz\n' +
        'blocks the UI thread and causes slider/drag jank. Move serialization to the debounced\n' +
        'save callback only. See Contribution #413 (Phase 5 Perf Spec), Section 7.\n' +
        'Violating files:\n' +
        rel.map((f) => `  ${f}`).join('\n')
      )
    }
    expect(violations).toHaveLength(0)
  })
})
