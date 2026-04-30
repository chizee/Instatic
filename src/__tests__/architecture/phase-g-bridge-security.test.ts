/**
 * Architecture Gate Tests — Phase G Bridge: Zod Schema Security
 * (Contribution #523 — Security Auditor Medium Finding from Review #521)
 *
 * Pre-registered gate tests enforcing the four binding requirements from
 * the Architect's addendum to Guideline #368 (Contribution #523):
 *
 * Gate 1 — ADD_DEP and REMOVE_DEP Zod schemas must carry
 *   `.regex(SAFE_PACKAGE_NAME)` on the `name` field (Medium — CWE-20).
 *   A bare `z.string()` allows any string — a handler-level check can be
 *   silently dropped in a refactor, but a schema-level `.regex()` cannot.
 *   This is Constraint #361 Rule 5 enforced at the Zod parse boundary.
 *
 * Gate 2 — ADD_DEP Zod schema must carry `.regex(SAFE_VERSION)` on the
 *   `version` field (Low advisory). While array-form Bun.spawn() prevents
 *   CWE-78 shell injection, an unbounded version string could trigger
 *   unexpected bun behaviour with crafted inputs.
 *
 * Gate 3 — BridgeWebSocketAdapter `pending` Map must have a 30-second
 *   per-entry TTL (Low — memory leak prevention). Without a TTL, a hanging
 *   subprocess leaves Map entries alive indefinitely, preventing GC of the
 *   associated closures and request state (Contribution #523 §2).
 *
 * Gate 4 — `isFilePatchCandidate` (or `isFilePatchMessage`) must be defined
 *   as a safe type guard with `typeof v === 'object' && v !== null` checks
 *   (advisory). `typeof null === 'object'` — without the null guard, passing
 *   a null WS frame causes a runtime TypeError before the Zod safeParse call
 *   (Contribution #523 §3).
 *
 * All gates use the adaptive-skip pattern:
 *   Gates 1 & 2 activate when `packages/dev-bridge/src/schemas.ts` is created.
 *   Gates 3 & 4 activate when `src/core/bridge/BridgeWebSocketAdapter.ts` is created.
 *
 * @see Contribution #523 — Architect's Zod Schema Security Addendum
 * @see Guideline #368 — Phase G Local Dev Bridge Implementation Architecture (updated)
 * @see Constraint #361 — Phase G Security Controls (Rule 5: SAFE_PACKAGE_NAME)
 * @see Security Auditor message #1581 — Review of Contribution #521 (medium/low findings)
 * @see Contribution #521 — Phase G Local Dev Bridge Implementation Architecture
 */

import { describe, it, expect } from 'bun:test'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const SRC_ROOT = join(import.meta.dir, '../../')
const REPO_ROOT = join(import.meta.dir, '../../../')

// Phase G canonical file paths
const BRIDGE_SCHEMAS_PATH = join(REPO_ROOT, 'packages/dev-bridge/src/schemas.ts')
const BRIDGE_ADAPTER_PATH = join(SRC_ROOT, 'core/bridge/BridgeWebSocketAdapter.ts')

// ---------------------------------------------------------------------------
// Gate 1 — SAFE_PACKAGE_NAME regex must be inline in ADD_DEP and REMOVE_DEP
//          Zod schemas (Medium — CWE-20 / Constraint #361 Rule 5)
//
// Context: Security Auditor Review #521 (message #1581), Contribution #523 §1.
//
// `z.string()` alone on `name` is insufficient. The regex must be INLINE in
// the schema definition so that it cannot be silently dropped by a handler
// refactor. Canonical schema (Contribution #523 §1):
//
//   const SAFE_PACKAGE_NAME = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]{0,213}$/;
//   AddDepSchema:    name: z.string().regex(SAFE_PACKAGE_NAME)
//   RemoveDepSchema: name: z.string().regex(SAFE_PACKAGE_NAME)
//
// Activates when `packages/dev-bridge/src/schemas.ts` is created.
// ---------------------------------------------------------------------------

describe(
  'Phase G Bridge Gate 1 — SAFE_PACKAGE_NAME regex must be in ADD_DEP and REMOVE_DEP schemas (Constraint #361 Rule 5)',
  () => {
    it(
      'schemas.ts must define SAFE_PACKAGE_NAME and apply .regex(SAFE_PACKAGE_NAME) to ADD_DEP name and REMOVE_DEP name',
      () => {
        // Gate is pre-registered until Phase G schemas.ts is created
        if (!existsSync(BRIDGE_SCHEMAS_PATH)) {
          console.log(
            '[PhaseG bridge gate] packages/dev-bridge/src/schemas.ts not yet created — ' +
              'SAFE_PACKAGE_NAME schema regex gate pre-registered ' +
              '(Contribution #523 §1 / Constraint #361 Rule 5 / Task #359)'
          )
          expect(true).toBe(true)
          return
        }

        const src = readFileSync(BRIDGE_SCHEMAS_PATH, 'utf8')
        const violations: string[] = []

        // 1. SAFE_PACKAGE_NAME constant must be defined in the file
        if (!src.includes('SAFE_PACKAGE_NAME')) {
          violations.push(
            'SAFE_PACKAGE_NAME regex constant is not defined in schemas.ts.\n' +
              '  Required:\n' +
              "    const SAFE_PACKAGE_NAME = /^(@[a-z0-9-~][a-z0-9-._~]*\\/)?[a-z0-9-~][a-z0-9-._~]{0,213}$/;"
          )
        }

        // 2. ADD_DEP schema must exist
        if (!src.includes('ADD_DEP')) {
          violations.push(
            "ADD_DEP message type not found in schemas.ts.\n" +
              '  Required per Contribution #521 §3.1 (WebSocket protocol — client→server messages).'
          )
        }

        // 3. REMOVE_DEP schema must exist
        if (!src.includes('REMOVE_DEP')) {
          violations.push(
            "REMOVE_DEP message type not found in schemas.ts.\n" +
              '  Required per Contribution #521 §3.1 (WebSocket protocol — client→server messages).'
          )
        }

        // 4. .regex(SAFE_PACKAGE_NAME) must appear at least twice —
        //    once for ADD_DEP.name and once for REMOVE_DEP.name.
        //    Using the literal string `.regex(SAFE_PACKAGE_NAME)` as the signal.
        const regexCallCount = (src.match(/\.regex\s*\(\s*SAFE_PACKAGE_NAME\s*\)/g) || []).length
        if (regexCallCount < 2) {
          violations.push(
            '`.regex(SAFE_PACKAGE_NAME)` appears ' +
              regexCallCount +
              ' time(s) in schemas.ts — expected ≥ 2 (once for ADD_DEP.name, once for REMOVE_DEP.name).\n' +
              '  Correct pattern:\n' +
              '    AddDepSchema:    name: z.string().regex(SAFE_PACKAGE_NAME)\n' +
              '    RemoveDepSchema: name: z.string().regex(SAFE_PACKAGE_NAME)\n' +
              '  A bare `z.string()` on `name` is insufficient — the regex must be inline\n' +
              '  in the schema so it cannot be dropped by a handler refactor.'
          )
        }

        if (violations.length > 0) {
          throw new Error(
            '[Phase G security / Constraint #361 Rule 5] SAFE_PACKAGE_NAME schema validation is missing or incomplete.\n' +
              '\n' +
              'Rationale: Constraint #361 Rule 5 requires server-side package-name validation.\n' +
              'The Zod schema IS that enforcement point — a handler-level check can be silently\n' +
              'dropped in a refactor, but `.regex()` inline on the schema field cannot.\n' +
              '(Contribution #523 §1 — medium finding from Security Auditor Review #521.)\n' +
              '\n' +
              'Required in packages/dev-bridge/src/schemas.ts:\n' +
              "  const SAFE_PACKAGE_NAME = /^(@[a-z0-9-~][a-z0-9-._~]*\\/)?[a-z0-9-~][a-z0-9-._~]{0,213}$/;\n" +
              '\n' +
              '  z.object({ type: z.literal("ADD_DEP"),    ..., name: z.string().regex(SAFE_PACKAGE_NAME), ... })\n' +
              '  z.object({ type: z.literal("REMOVE_DEP"), ..., name: z.string().regex(SAFE_PACKAGE_NAME)         })\n' +
              '\n' +
              'Violations:\n' +
              violations.map((v) => `  • ${v}`).join('\n\n')
          )
        }

        expect(violations).toHaveLength(0)
      }
    )
  }
)

// ---------------------------------------------------------------------------
// Gate 2 — SAFE_VERSION regex must be applied to ADD_DEP version field (Low advisory)
//
// Context: Security Auditor Review #521 (message #1581) low finding,
// Contribution #523 §1.
//
// Bun.spawn() array form prevents CWE-78 shell injection, but an unbounded
// `version: z.string()` allows crafted version strings that could trigger
// unexpected bun behaviour (e.g. flag injection via semver-shaped strings
// like "^1.0.0 --registry http://evil.example.com").
//
// Required:
//   const SAFE_VERSION = /^[\w.^~*<>=|-]{1,64}$/;
//   AddDepSchema: version: z.string().regex(SAFE_VERSION)
//
// Activates when `packages/dev-bridge/src/schemas.ts` is created.
// ---------------------------------------------------------------------------

describe(
  'Phase G Bridge Gate 2 — SAFE_VERSION regex must be applied to ADD_DEP version field (Contribution #523 §1)',
  () => {
    it('schemas.ts must define SAFE_VERSION and apply .regex(SAFE_VERSION) to ADD_DEP version', () => {
      // Gate is pre-registered until Phase G schemas.ts is created
      if (!existsSync(BRIDGE_SCHEMAS_PATH)) {
        console.log(
          '[PhaseG bridge gate] packages/dev-bridge/src/schemas.ts not yet created — ' +
            'SAFE_VERSION schema regex gate pre-registered (Contribution #523 §1 / Task #359)'
        )
        expect(true).toBe(true)
        return
      }

      const src = readFileSync(BRIDGE_SCHEMAS_PATH, 'utf8')
      const violations: string[] = []

      // 1. SAFE_VERSION constant must be defined
      if (!src.includes('SAFE_VERSION')) {
        violations.push(
          'SAFE_VERSION regex constant is not defined in schemas.ts.\n' +
            '  Required:\n' +
            "    const SAFE_VERSION = /^[\\w.^~*<>=|-]{1,64}$/;"
        )
      }

      // 2. .regex(SAFE_VERSION) must appear (for the ADD_DEP version field)
      const hasVersionRegex = /\.regex\s*\(\s*SAFE_VERSION\s*\)/.test(src)
      if (!hasVersionRegex) {
        violations.push(
          '`.regex(SAFE_VERSION)` is not applied to the `version` field of ADD_DEP schema.\n' +
            '  Required:\n' +
            '    z.object({ type: z.literal("ADD_DEP"), ..., version: z.string().regex(SAFE_VERSION), ... })\n' +
            "  Canonical regex: /^[\\w.^~*<>=|-]{1,64}$/"
        )
      }

      if (violations.length > 0) {
        throw new Error(
          '[Phase G advisory / Contribution #523 §1] SAFE_VERSION regex missing from ADD_DEP Zod schema.\n' +
            '\n' +
            'While Bun.spawn() array form prevents shell injection (CWE-78 ✅), an\n' +
            'unbounded version string can trigger unexpected bun behaviour with crafted\n' +
            'inputs (e.g. flag injection via semver-shaped strings).\n' +
            '\n' +
            'Required in packages/dev-bridge/src/schemas.ts:\n' +
            "  const SAFE_VERSION = /^[\\w.^~*<>=|-]{1,64}$/;\n" +
            '  AddDepSchema: version: z.string().regex(SAFE_VERSION)\n' +
            '\n' +
            'Violations:\n' +
            violations.map((v) => `  • ${v}`).join('\n\n')
        )
      }

      expect(violations).toHaveLength(0)
    })
  }
)

// ---------------------------------------------------------------------------
// Gate 3 — `pending` Map must have a 30-second per-entry TTL (Low — memory leak)
//
// Context: Security Auditor Review #521 (message #1581) low finding,
// Contribution #523 §2.
//
// `BridgeWebSocketAdapter.pending` is a `Map<reqId, { resolve; reject }>`.
// Without a TTL, a hanging `bun add` subprocess (e.g. on a network-unavailable
// registry) leaves entries alive indefinitely, preventing GC of the closures.
//
// Required pattern (Contribution #523 §2):
//   const timer = setTimeout(() => {
//     this.pending.delete(reqId);
//     reject(new Error('bridge request timeout'));
//   }, 30_000);
//   this.pending.set(reqId, {
//     resolve: (v) => { clearTimeout(timer); resolve(v); },
//     reject,
//   });
//
// Key signals:
//   - `setTimeout` near `pending` assignment
//   - Timeout value is 30,000ms (30_000 or 30000)
//   - `clearTimeout` in the resolve path to prevent double-fire after success
//
// Activates when `src/core/bridge/BridgeWebSocketAdapter.ts` is created.
// ---------------------------------------------------------------------------

describe(
  'Phase G Bridge Gate 3 — pending Map must have 30s per-entry TTL + clearTimeout (Contribution #523 §2)',
  () => {
    it(
      'BridgeWebSocketAdapter.ts must use setTimeout(30_000) on pending entries and clearTimeout in resolve path',
      () => {
        // Gate is pre-registered until Phase G client adapter is created
        if (!existsSync(BRIDGE_ADAPTER_PATH)) {
          console.log(
            '[PhaseG bridge gate] src/core/bridge/BridgeWebSocketAdapter.ts not yet created — ' +
              '30s pending Map TTL gate pre-registered (Contribution #523 §2 / Task #359)'
          )
          expect(true).toBe(true)
          return
        }

        const src = readFileSync(BRIDGE_ADAPTER_PATH, 'utf8')
        const violations: string[] = []

        // 1. setTimeout must be present (TTL mechanism)
        if (!src.includes('setTimeout')) {
          violations.push(
            'No `setTimeout` found in BridgeWebSocketAdapter.ts.\n' +
              '  The pending Map requires a 30s per-entry TTL to prevent memory leaks\n' +
              '  from hung subprocesses or dropped WebSocket connections.\n' +
              '  See Contribution #523 §2 for the required pattern.'
          )
        }

        // 2. Timeout value must be 30,000ms — matches `30_000` or `30000`
        const thirtySecondPattern = /setTimeout\s*\([\s\S]{0,300}?\b30[_]?000\b/
        const thirtySecondPatternReverse = /\b30[_]?000\b[\s\S]{0,100}?setTimeout/
        const hasThirtySecondTimeout =
          thirtySecondPattern.test(src) || thirtySecondPatternReverse.test(src)

        if (src.includes('setTimeout') && !hasThirtySecondTimeout) {
          violations.push(
            '`setTimeout` is present but the timeout value does not appear to be 30,000ms.\n' +
              '  Contribution #523 §2 specifies a 30-second TTL:\n' +
              '    setTimeout(() => { this.pending.delete(reqId); reject(...); }, 30_000)\n' +
              '  Verify the timeout argument is `30_000` (30 seconds).'
          )
        }

        // 3. clearTimeout must be called in the resolve path
        //    Without this, the timer fires after a successful response and incorrectly
        //    rejects an already-resolved request.
        if (!src.includes('clearTimeout')) {
          violations.push(
            '`clearTimeout` is missing from BridgeWebSocketAdapter.ts.\n' +
              '  The resolve wrapper must cancel the TTL timer on success:\n' +
              '    resolve: (v) => { clearTimeout(timer); resolve(v); }\n' +
              '  Without this, the timer fires after a successful RESPONSE message\n' +
              '  and spuriously rejects an already-resolved request.'
          )
        }

        if (violations.length > 0) {
          throw new Error(
            '[Phase G reliability / Contribution #523 §2] pending Map TTL pattern missing or incomplete.\n' +
              '\n' +
              'A hanging bun add/remove subprocess (e.g. unreachable npm registry) leaves\n' +
              'pending Map entries alive indefinitely, preventing GC of request closures.\n' +
              '\n' +
              'Required pattern in src/core/bridge/BridgeWebSocketAdapter.ts:\n' +
              '  private request<T>(type: string, payload: object): Promise<T> {\n' +
              '    const reqId = crypto.randomUUID();\n' +
              '    return new Promise((resolve, reject) => {\n' +
              '      const timer = setTimeout(() => {\n' +
              '        this.pending.delete(reqId);\n' +
              "        reject(new Error('bridge request timeout'));\n" +
              '      }, 30_000);\n' +
              '      this.pending.set(reqId, {\n' +
              '        resolve: (v) => { clearTimeout(timer); resolve(v); },\n' +
              '        reject,\n' +
              '      });\n' +
              '      this.ws.send(JSON.stringify({ type, reqId, ...payload }));\n' +
              '    });\n' +
              '  }\n' +
              '\n' +
              'Violations:\n' +
              violations.map((v) => `  • ${v}`).join('\n\n')
          )
        }

        expect(violations).toHaveLength(0)
      }
    )
  }
)

// ---------------------------------------------------------------------------
// Gate 4 — `isFilePatchCandidate` must be a safe type guard with null check
//           (Contribution #523 §3)
//
// Context: Security Auditor advisory (Review #521, message #1581),
// Contribution #523 §3.
//
// `isFilePatchCandidate` (or `isFilePatchMessage`) is called in the WS message
// handler BEFORE `BridgeFilePatchSchema.safeParse()`. It must narrow `unknown`
// to `Record<string, unknown>` without throwing on any input, including null.
//
// The required guard pattern:
//   function isFilePatchCandidate(v: unknown): v is Record<string, unknown> {
//     return typeof v === 'object' && v !== null && (v as any).type === 'FILE_PATCH'
//   }
//
// Two common mistakes:
//   ① Missing `v !== null` — `typeof null === 'object'` causes TypeError on
//     null WS frames (malformed / empty messages) before safeParse can catch it.
//   ② Missing `typeof v === 'object'` — accessing `.type` on a primitive throws.
//
// Activates when `src/core/bridge/BridgeWebSocketAdapter.ts` is created.
// ---------------------------------------------------------------------------

describe(
  'Phase G Bridge Gate 4 — isFilePatchCandidate must be a safe type guard with typeof + null check (Contribution #523 §3)',
  () => {
    it(
      'BridgeWebSocketAdapter.ts must define isFilePatchCandidate with typeof === "object" AND !== null guards',
      () => {
        // Gate is pre-registered until Phase G client adapter is created
        if (!existsSync(BRIDGE_ADAPTER_PATH)) {
          console.log(
            '[PhaseG bridge gate] src/core/bridge/BridgeWebSocketAdapter.ts not yet created — ' +
              'isFilePatchCandidate safe type guard gate pre-registered (Contribution #523 §3 / Task #359)'
          )
          expect(true).toBe(true)
          return
        }

        const src = readFileSync(BRIDGE_ADAPTER_PATH, 'utf8')
        const violations: string[] = []

        // 1. The type guard function must be defined (either name is acceptable)
        const guardName = src.includes('isFilePatchCandidate')
          ? 'isFilePatchCandidate'
          : src.includes('isFilePatchMessage')
            ? 'isFilePatchMessage'
            : null

        if (guardName === null) {
          violations.push(
            'Neither `isFilePatchCandidate` nor `isFilePatchMessage` is defined in BridgeWebSocketAdapter.ts.\n' +
              '  This helper must exist and be called BEFORE BridgeFilePatchSchema.safeParse().\n' +
              '  Required:\n' +
              '    function isFilePatchCandidate(v: unknown): v is Record<string, unknown> {\n' +
              "      return typeof v === 'object' && v !== null && (v as any).type === 'FILE_PATCH'\n" +
              '    }'
          )
        } else {
          // 2. Check for typeof guard and null check in proximity to the function
          //    (using a generous window around the function name to handle multiline defs)
          const guardIndex = src.indexOf(guardName)
          const windowEnd = Math.min(src.length, guardIndex + 400)
          const vicinity = src.slice(guardIndex, windowEnd)

          const hasTypeofCheck = /typeof\s+\w+\s*===\s*['"]object['"]/.test(vicinity)
          const hasNullCheck = /!==\s*null|null\s*!==/.test(vicinity)

          if (!hasTypeofCheck) {
            violations.push(
              `\`${guardName}\` is missing the \`typeof v === "object"\` check.\n` +
                '  Without it, calling the guard on a primitive (string, number) may throw\n' +
                '  when the function tries to access `.type` on the narrowed value.'
            )
          }

          if (!hasNullCheck) {
            violations.push(
              `\`${guardName}\` is missing the \`v !== null\` check.\n` +
                '  This is required because `typeof null === "object"` in JavaScript.\n' +
                '  Without it, passing a null WS frame causes a TypeError BEFORE safeParse\n' +
                '  can handle the malformed message gracefully.'
            )
          }
        }

        if (violations.length > 0) {
          throw new Error(
            '[Phase G safety / Contribution #523 §3] isFilePatchCandidate type guard is missing or unsafe.\n' +
              '\n' +
              '`typeof null === "object"` is a well-known JS quirk — without an explicit\n' +
              'null guard, the function throws a TypeError when the WS delivers a null frame\n' +
              '(malformed / empty message). This would crash the message handler before the\n' +
              'Zod safeParse call, which is the designated error-recovery boundary.\n' +
              '\n' +
              'Required definition alongside the BridgeFilePatchSchema.safeParse call:\n' +
              '  function isFilePatchCandidate(v: unknown): v is Record<string, unknown> {\n' +
              "    return typeof v === 'object' && v !== null && (v as any).type === 'FILE_PATCH'\n" +
              '  }\n' +
              '\n' +
              'Usage:\n' +
              '  private handleMessage(msg: unknown) {\n' +
              '    if (isFilePatchCandidate(msg)) {\n' +
              '      const parsed = BridgeFilePatchSchema.safeParse(msg.patch);\n' +
              '      if (!parsed.success) return;  // drop malformed\n' +
              '      this.watchCallbacks.forEach(cb => cb(parsed.data));\n' +
              '      return;\n' +
              '    }\n' +
              '    // ... handle other message types\n' +
              '  }\n' +
              '\n' +
              'Violations:\n' +
              violations.map((v) => `  • ${v}`).join('\n\n')
          )
        }

        expect(violations).toHaveLength(0)
      }
    )
  }
)
