/**
 * Architecture Source-Scan — Constraint B (from Contribution #398)
 *
 * `toJsx()` must ONLY be called inside a `module.trusted` guard.
 *
 * WHY THIS MATTERS
 * ----------------
 * The AstroPublisher (Phase E) calls `module.toJsx()` to generate `.tsx`/`.astro`
 * source files that are compiled by `astro build` on the user's machine.
 *
 * A malicious community module's `toJsx()` can return arbitrary Node.js/TypeScript
 * source code. That code is compiled and executed on the user's system at build time
 * — bypassing all browser sandboxing entirely (CWE-94 — Code Injection).
 *
 * The iframe sandbox from Constraint #218 provides ZERO protection here: it only
 * applies at editor-runtime. At export time there is no sandbox.
 *
 * REQUIRED PATTERN
 * ----------------
 *   // ✅ CORRECT — only call toJsx() for trusted (base) modules
 *   if (module.trusted && module.toJsx) {
 *     jsx = module.toJsx(escapedProps)
 *   } else {
 *     // Untrusted community modules fall back to set:html + render()
 *     jsx = `<Fragment set:html={${JSON.stringify(rawHtml)}} />`
 *   }
 *
 *   // ❌ WRONG — no trust guard
 *   jsx = module.toJsx(props)
 *
 * @see Constraint B — Community modules must never have toJsx() called without trusted gate
 * @see Constraint #218 — Module Sandbox Strategy
 * @see Contribution #398 — Phase E Security Architecture (Threats 5 & 3)
 * @see Guideline #270 — ModuleDefinition `toJsx` authoring pattern
 */

import { describe, it, expect } from 'bun:test'
import { readdirSync, readFileSync, statSync, existsSync } from 'fs'
import { join, extname } from 'path'

const SRC_ROOT = join(import.meta.dir, '../../')

// ---------------------------------------------------------------------------
// File walker — same pattern as no-anthropic-sdk.test.ts
// ---------------------------------------------------------------------------

function collectFiles(dir: string, exts = ['.ts', '.tsx']): string[] {
  const results: string[] = []
  if (!existsSync(dir)) return results
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      results.push(...collectFiles(full, exts))
    } else if (exts.includes(extname(entry))) {
      results.push(full)
    }
  }
  return results
}

// ---------------------------------------------------------------------------
// Publisher directories — the only places that should ever call toJsx()
// ---------------------------------------------------------------------------

const PUBLISHER_DIRS = [
  join(SRC_ROOT, 'core/publisher'),
  join(SRC_ROOT, 'core/react-publisher'),
  join(SRC_ROOT, 'core/astro-publisher'),
]

// Pattern that detects an actual .toJsx( call (not interface/type definitions)
const TO_JSX_CALL_RE = /\.toJsx\s*\(/

// Patterns that indicate a module.trusted guard in the surrounding context
const TRUSTED_GUARD_PATTERNS = [
  /module\.trusted/,
  /\.trusted\s*===\s*true/,
  /\.trusted\s*&&/,
  /if\s*\(\s*trusted/,
  /trusted\s*\?/,
]

function hasTrustedGuard(contextLines: string[]): boolean {
  const context = contextLines.join('\n')
  return TRUSTED_GUARD_PATTERNS.some((re) => re.test(context))
}

function isDefinitionOrComment(line: string): boolean {
  const trimmed = line.trim()
  // Skip type/interface/type-alias definitions
  if (/^\s*(\/\/|\*)/.test(line)) return true           // comment lines
  if (/toJsx\s*\??\s*:/.test(trimmed)) return true     // interface field: toJsx?: (...)
  if (/typeof.*toJsx/.test(trimmed)) return true        // typeof guard
  if (/interface|type\s+\w/.test(trimmed)) return true  // type definition line
  return false
}

// ---------------------------------------------------------------------------
// Constraint B — every .toJsx() call must be guarded by module.trusted
// ---------------------------------------------------------------------------

describe('Constraint B — toJsx() must be guarded by module.trusted', () => {
  it('all .toJsx() calls in publisher code have a module.trusted guard', () => {
    const violations: string[] = []

    for (const dir of PUBLISHER_DIRS) {
      if (!existsSync(dir)) continue  // dir not yet created (Phase E not started)

      for (const file of collectFiles(dir)) {
        const content = readFileSync(file, 'utf8')

        // Fast skip: no toJsx reference in file at all
        if (!content.includes('toJsx')) continue

        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]

          // Must be an actual call, not a definition or comment
          if (!TO_JSX_CALL_RE.test(line)) continue
          if (isDefinitionOrComment(line)) continue

          // Check 12 lines of context before this call for the trusted guard
          // (covers the if-block opening, even with JSDoc comments between them)
          const contextStart = Math.max(0, i - 12)
          const context = lines.slice(contextStart, i + 1)

          if (!hasTrustedGuard(context)) {
            const rel = file.replace(SRC_ROOT, 'src/')
            violations.push(`${rel}:${i + 1} — .toJsx() called without module.trusted guard`)
          }
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `[Constraint B] .toJsx() called without module.trusted guard.\n\n` +
          `Community modules (trusted=false) MUST fall back to render() + set:html.\n` +
          `Calling toJsx() on an untrusted module is RCE at build time (CWE-94).\n\n` +
          `Required pattern:\n` +
          `  if (module.trusted && module.toJsx) {\n` +
          `    jsx = module.toJsx(escapedProps)   // base module\n` +
          `  } else {\n` +
          `    // community module fallback — never executes module code at build time\n` +
          `    jsx = \`<Fragment set:html={\${JSON.stringify(rawHtml)}} />\`\n` +
          `  }\n\n` +
          `Violations:\n` +
          violations.map((v) => `  ${v}`).join('\n')
      )
    }

    expect(violations).toHaveLength(0)
  })

  // ---------------------------------------------------------------------------
  // Pre-registered Phase E gate — activates when astro-publisher is created
  // This test is intentionally non-skipped so it runs NOW (and always passes
  // until the directory exists). Once Phase E is claimed and the directory
  // is created, it becomes a live enforcement check.
  // ---------------------------------------------------------------------------

  it('[PHASE-E] AstroPublisher must have trusted guard before any toJsx() call', () => {
    const astroDir = join(SRC_ROOT, 'core/astro-publisher')
    if (!existsSync(astroDir)) {
      // Phase E not yet started — pre-registration only, no violations possible
      return
    }

    const violations: string[] = []

    for (const file of collectFiles(astroDir)) {
      const content = readFileSync(file, 'utf8')
      if (!content.includes('toJsx')) continue

      // File-level check: if file calls .toJsx( it MUST also reference .trusted
      if (TO_JSX_CALL_RE.test(content) && !content.includes('trusted')) {
        const rel = file.replace(SRC_ROOT, 'src/')
        violations.push(`${rel} — file calls .toJsx() but never checks .trusted`)
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `[Constraint B — AstroPublisher] .toJsx() without .trusted check.\n` +
          violations.map((v) => `  ${v}`).join('\n')
      )
    }

    expect(violations).toHaveLength(0)
  })

  // ---------------------------------------------------------------------------
  // Editor and core must never call toJsx() at all
  // toJsx() is ONLY for publisher-time code generation — never for rendering
  // in the editor or the HTML publisher (which uses render() exclusively).
  // ---------------------------------------------------------------------------

  it('src/editor/ and src/modules/ must not call .toJsx() (publisher-only API)', () => {
    const editorOnlyDirs = [
      join(SRC_ROOT, 'editor'),
      join(SRC_ROOT, 'modules'),
      join(SRC_ROOT, 'ui'),
      join(SRC_ROOT, 'app'),
    ]

    const violations: string[] = []

    for (const dir of editorOnlyDirs) {
      if (!existsSync(dir)) continue

      for (const file of collectFiles(dir)) {
        const content = readFileSync(file, 'utf8')
        if (!TO_JSX_CALL_RE.test(content)) continue
        // Allow toJsx in interface/type definitions inside module files
        const lines = content.split('\n')
        const hasBareCall = lines.some(
          (l) => TO_JSX_CALL_RE.test(l) && !isDefinitionOrComment(l)
        )
        if (hasBareCall) {
          const rel = file.replace(SRC_ROOT, 'src/')
          violations.push(`${rel} — .toJsx() must not be called in editor/UI code`)
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `[Constraint B] .toJsx() called outside of publisher code.\n` +
          `The toJsx() API is for code generation at export time only.\n` +
          `Editor rendering uses render() (Constraint #219).\n` +
          violations.map((v) => `  ${v}`).join('\n')
      )
    }

    expect(violations).toHaveLength(0)
  })
})
