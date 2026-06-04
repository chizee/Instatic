# Unified Template Layouts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the entry-only template feature into one unified, auto-nesting template system where a template declares *what it targets* (everywhere, or one/more post types) and matched content flows into a single `base.outlet` — so a header/footer layout wraps every page and post with zero per-page placement.

**Architecture:** A template is a page-tree (a row in the `pages` table) carrying a `target` (`everywhere` | `postTypes`) plus a `priority`. For each public URL the resolver collects every matching template, orders them **broadest → narrowest** (everywhere is outermost, a post-type entry template nests inside it), and a composer splices each inner tree into the outer template's `base.outlet` node, producing **one merged page tree** that the existing `publishPage` pipeline renders in a single pass. `base.outlet` is polymorphic: it renders spliced inner content if present, else the current entry's body (with the `data-instatic-content-region` live-edit marker), else nothing. `base.content` is retired.

**Tech Stack:** Bun, TypeScript, TypeBox (boundary validation), React 19 (admin), the in-house page-tree + publisher engine. Tests with `bun test`.

---

## Why this shape

Two facts from the current code drive every decision below:

1. **`base.content` is just a binding leaf.** It renders `props.html` (bound to `{currentEntry.body}` via `dynamicBindings`) wrapped in `<article data-instatic-content-region>`. The marker is how the Content workspace mounts Tiptap on the live body. Nothing about it is "inject a tree" — so the layout outlet (which *does* inject a tree) is a genuinely new capability, and we fold the body-rendering behaviour into the new `base.outlet` rather than keep two modules.

2. **Everything already renders through one `publishPage(page, site, registry, options)` call** that does CSS bundling, loop/media prefetch, hole detection, and binding resolution over a single tree. If the composer produces **one merged tree**, all of that machinery is reused for free — no per-layer CSS merge, no double prefetch. This is the central reason we compose by *splicing trees* rather than rendering layers and string-concatenating.

### Nesting model (locked decisions)

- **Auto by target breadth.** Resolver orders templates; the author only picks a target. Breadth levels, outer → inner: `everywhere` (0) → `postTypes` (1). Within a level the single highest-`priority` match wins (ties broken by document order). **v1 deliberately nests at most 2 deep** (one everywhere layout + one entry template) — this is the agreed scope, not an accident. The architecture adds depth later by inserting new breadth levels (e.g. path-prefix sections) — no resolver rewrite needed.
- **Targeting v1:** `everywhere` and `postTypes: [slugs]` only. No path prefixes. **No `conditions`** — the field is cut entirely (schema, parser, matcher, seed) per the repo's no-dead-code / no-"just in case" rule; a future finer-grained rule is added as a real, used feature when it lands, not carried as an unused stub now.
- **One `base.outlet`**, polymorphic; `base.content` retired. A template tree must contain **exactly one** `base.outlet` (validated — see Task 3.1); zero or two is an authoring error, not a silent blank page.

### The terminal + chain, by route kind

| Route | Chain (outer→inner) | Terminal content (innermost outlet renders) |
|---|---|---|
| `/about` (page) | `[everywhere?]` | the `/about` page tree |
| `/posts/hello` (entry) | `[everywhere?, posts-entry-template]` | the row `body` (currentEntry.body) |

If no `everywhere` template exists, the chain for `/about` is empty → the page renders exactly as today. If no entry template exists for a post type, the entry route 404s exactly as today.

---

## File Structure

**Engine — core (`src/core/`)**
- `src/core/page-tree/pageTemplate.ts` — **modify.** Replace `context: Literal('entry')` + `tableSlug` with a `target` discriminated union. Update `parsePageTemplate`.
- `src/core/data/pageFromRow.ts` — **modify.** `readTemplateFromCells` / `pageToCells` read/write `templateTarget` (JSON cell) instead of `templateContext` + `templateTableSlug`.
- `src/core/templates/templateMatching.ts` — **modify.** Replace `selectEntryTemplate` with `resolveTemplateChain` + helpers (`isTemplatePage`, breadth ordering).
- `src/core/templates/templateCompose.ts` — **create.** `composeTemplateChain(chain, terminal)` → one merged `Page`. Tree splice + id re-keying.
- `src/core/templates/index.ts` (barrel) — **modify.** Export the new resolver/composer surface; drop `selectEntryTemplate`.

**Engine — modules (`src/modules/`)**
- `src/modules/base/outlet/` — **create.** `index.ts` (`base.outlet` module), `OutletEditor.tsx`, `OutletEditor.module.css`.
- `src/modules/base/content/` — **delete.** Remove `index.ts`, `ContentEditor.tsx`, CSS, and its `import` from `src/modules/base/index.ts`.
- `src/modules/base/index.ts` — **modify.** Register `outlet`, drop `content`.

**Server (`server/`)**
- `server/publish/publicRenderer.ts` — **modify.** Both render paths build a chain + compose; exclude template pages from direct slug routing.
- `server/publish/publicRouter.ts` — **modify.** `resolvePublicRoute` must not serve a template page at its own slug.
- `server/publish/staticArtefact.ts` + whichever module drives publish (`publishDraftSite` / equivalent) — **modify.** Publishing/editing a template must re-bake every dependent Layer-A static artefact, not just bump the in-memory cache (Task 5.4).
- `src/core/templates/templateValidation.ts` — **create.** `findOutletIds(page)` (→ outlet ids) + `assertSingleOutlet(ids)` (throws `TemplateOutletError` unless exactly one) — the exactly-one-`base.outlet` invariant, used by the composer and surfaced to the admin.
- `server/repositories/data/templateSeeding.ts` — **modify.** Seed `base.outlet` (not `base.content`); write `templateTarget` cells; `hasEntryTemplate` reads the new shape.

**Admin (`src/admin/`)**
- `src/admin/shared/dialogs/TemplateSettingsDialog/TemplateSettingsDialog.tsx` — **modify.** Target selector: "Everywhere" vs "Post types" (multi-select), instead of single Table + always-entry.
- `src/admin/pages/site/hooks/useTemplatePreviewContext.ts` — **modify.** Drive the outlet placeholder/preview from `target`.

**Docs + tests**
- `docs/features/templates.md` — **rewrite** for the unified model.
- `src/__tests__/architecture/*` — update any gate that names `base.content` or the old template shape.

---

## Phase 1 — Template schema (`target` replaces `context`/`tableSlug`)

### Task 1.1: Redefine `PageTemplateConfigSchema` with a `target` union

**Files:**
- Modify: `src/core/page-tree/pageTemplate.ts`
- Test: `src/core/page-tree/__tests__/pageTemplate.test.ts` (create if absent)

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'bun:test'
import { parsePageTemplate } from '../pageTemplate'

describe('parsePageTemplate target', () => {
  it('parses an everywhere target', () => {
    const t = parsePageTemplate({ enabled: true, target: { kind: 'everywhere' }, priority: 5 })
    expect(t).toEqual({ enabled: true, target: { kind: 'everywhere' }, priority: 5 })
  })

  it('parses a postTypes target and drops blank slugs', () => {
    const t = parsePageTemplate({ enabled: true, target: { kind: 'postTypes', tableSlugs: ['posts', ''] }, priority: 0 })
    expect(t).toEqual({ enabled: true, target: { kind: 'postTypes', tableSlugs: ['posts'] }, priority: 0 })
  })

  it('rejects a postTypes target with no usable slugs', () => {
    expect(parsePageTemplate({ enabled: true, target: { kind: 'postTypes', tableSlugs: [''] }, priority: 0 })).toBeNull()
  })

  it('rejects the retired context/tableSlug shape', () => {
    expect(parsePageTemplate({ enabled: true, context: 'entry', tableSlug: 'posts', priority: 0 })).toBeNull()
  })

  it('ignores a stray conditions field (cut from the model)', () => {
    const t = parsePageTemplate({ enabled: true, target: { kind: 'everywhere' }, priority: 0, conditions: [{ id: 'x' }] })
    expect(t).toEqual({ enabled: true, target: { kind: 'everywhere' }, priority: 0 })
  })

  it('defaults priority', () => {
    const t = parsePageTemplate({ enabled: true, target: { kind: 'everywhere' } })
    expect(t).toEqual({ enabled: true, target: { kind: 'everywhere' }, priority: 0 })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/core/page-tree/__tests__/pageTemplate.test.ts`
Expected: FAIL (parser still expects `context`).

- [ ] **Step 3: Rewrite the schema + parser**

Replace the schema/parser region of `src/core/page-tree/pageTemplate.ts` with:

```ts
export const TemplateTargetSchema = Type.Union([
  Type.Object({ kind: Type.Literal('everywhere') }),
  Type.Object({
    kind: Type.Literal('postTypes'),
    tableSlugs: Type.Array(Type.String({ minLength: 1 }), { minItems: 1 }),
  }),
])
export type TemplateTarget = Static<typeof TemplateTargetSchema>

export const PageTemplateConfigSchema = Type.Object({
  enabled: Type.Literal(true),
  target: TemplateTargetSchema,
  priority: Type.Number(),
})
export type PageTemplateConfig = Static<typeof PageTemplateConfigSchema>

function parseTarget(raw: unknown): TemplateTarget | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const r = raw as Record<string, unknown>
  if (r.kind === 'everywhere') return { kind: 'everywhere' }
  if (r.kind === 'postTypes') {
    const slugs = Array.isArray(r.tableSlugs)
      ? r.tableSlugs.filter((s): s is string => typeof s === 'string' && s.length > 0)
      : []
    return slugs.length > 0 ? { kind: 'postTypes', tableSlugs: slugs } : null
  }
  return null
}

export function parsePageTemplate(raw: unknown): PageTemplateConfig | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const r = raw as Record<string, unknown>
  if (r.enabled !== true) return null
  const target = parseTarget(r.target)
  if (!target) return null
  const priority = typeof r.priority === 'number' && isFinite(r.priority) ? r.priority : 0
  return { enabled: true, target, priority }
}
```

There is **no `conditions` field** — it is intentionally cut from the model (a stray `conditions` key in stored data is ignored, not preserved). Update the file header comment to describe `target` instead of "rendered once per matching CMS entry".

- [ ] **Step 4: Export the new type from the page-tree barrel**

In `src/core/page-tree/index.ts`, wherever `PageTemplateConfig` is re-exported, also re-export `TemplateTarget` and `TemplateTargetSchema` (follow the existing export line for `pageTemplate`).

- [ ] **Step 5: Run test to verify it passes**

Run: `bun test src/core/page-tree/__tests__/pageTemplate.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/core/page-tree/pageTemplate.ts src/core/page-tree/index.ts src/core/page-tree/__tests__/pageTemplate.test.ts
git commit -m "feat(templates): replace entry-only context with target union"
```

### Task 1.2: Persist `target` through the row⇄page adapter

**Files:**
- Modify: `src/core/data/pageFromRow.ts:73-101` (`readTemplateFromCells`) and `:114-133` (`pageToCells`)
- Test: `src/core/data/__tests__/pageFromRow.test.ts` (create if absent)

The cells representation drops `templateContext`, `templateTableSlug`, **and `templateConditions`**, and gains a single JSON cell `templateTarget`. (Cells live in the JSONB `cells_json` column — no migration needed; pre-release means existing dev rows are disposable. Re-seeding on boot, Task 4.3, rewrites the system `posts` template into the new shape.)

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'bun:test'
import { pageFromRow, pageToCells } from '../pageFromRow'
import type { DataRow } from '@core/data/schemas'

const baseRow = (cells: Record<string, unknown>): DataRow => ({
  id: 'p1', tableId: 'pages', slug: 'posts-template', cells: cells as never,
  authorUserId: null, createdByUserId: null, updatedByUserId: null,
} as unknown as DataRow)

describe('pageFromRow template target', () => {
  it('reads a postTypes target round-trip', () => {
    const page = pageFromRow(baseRow({
      title: 'T', slug: 'posts-template',
      templateEnabled: true,
      templateTarget: { kind: 'postTypes', tableSlugs: ['posts'] },
      templatePriority: 10,
    }))
    expect(page.template).toEqual({
      enabled: true, target: { kind: 'postTypes', tableSlugs: ['posts'] }, priority: 10,
    })
    const cells = pageToCells(page)
    expect(cells.templateTarget).toEqual({ kind: 'postTypes', tableSlugs: ['posts'] })
    expect(cells.templateContext).toBeUndefined()
    expect(cells.templateConditions).toBeUndefined()
  })

  it('drops a malformed target', () => {
    const page = pageFromRow(baseRow({ templateEnabled: true, templateTarget: { kind: 'nonsense' } }))
    expect(page.template).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/core/data/__tests__/pageFromRow.test.ts`
Expected: FAIL

- [ ] **Step 3: Rewrite `readTemplateFromCells` to use `parsePageTemplate`**

Replace the body of `readTemplateFromCells` in `src/core/data/pageFromRow.ts` with a delegation to the canonical parser (single source of truth — no second hand-rolled validator):

```ts
import { parsePageTemplate } from '@core/page-tree'

function readTemplateFromCells(cells: DataRowCells): PageTemplateConfig | null {
  if (cells.templateEnabled !== true) return null
  return parsePageTemplate({
    enabled: true,
    target: cells.templateTarget,
    priority: cells.templatePriority,
  })
}
```

- [ ] **Step 4: Rewrite the template branch of `pageToCells`**

```ts
  if (page.template) {
    cells.templateEnabled = true
    cells.templateTarget = page.template.target
    cells.templatePriority = page.template.priority
  }
```

Delete the `templateContext` / `templateTableSlug` / `templateConditions` assignments and update the file's top doc comment (the `cells.template*` mapping list).

- [ ] **Step 5: Run test to verify it passes**

Run: `bun test src/core/data/__tests__/pageFromRow.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/core/data/pageFromRow.ts src/core/data/__tests__/pageFromRow.test.ts
git commit -m "feat(templates): persist template target through row adapter"
```

---

## Phase 2 — Resolver (chain, not single template)

### Task 2.1: `resolveTemplateChain` + `isTemplatePage`

**Files:**
- Modify: `src/core/templates/templateMatching.ts`
- Test: `src/core/templates/__tests__/templateMatching.test.ts` (create if absent)

`RouteResolutionContext` describes what the URL named. Breadth order is fixed: everywhere outer, postTypes inner.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'bun:test'
import { resolveTemplateChain, isTemplatePage } from '../templateMatching'
import type { Page, SiteDocument } from '@core/page-tree'

const tpl = (id: string, target: Page['template'], priority = 0): Page => ({
  id, slug: id, title: id, nodes: {}, rootNodeId: '',
  template: { ...(target as object), priority } as Page['template'],
})
const site = (pages: Page[]): SiteDocument => ({ id: 's', pages } as unknown as SiteDocument)

const everywhere = (id: string, p = 0) => tpl(id, { enabled: true, target: { kind: 'everywhere' } } as never, p)
const forPosts = (id: string, p = 0) => tpl(id, { enabled: true, target: { kind: 'postTypes', tableSlugs: ['posts'] } } as never, p)

describe('resolveTemplateChain', () => {
  it('returns [] for a page route with no everywhere template', () => {
    expect(resolveTemplateChain(site([forPosts('e')]), { kind: 'page' })).toEqual([])
  })

  it('wraps a page route in the everywhere layout', () => {
    const s = site([everywhere('layout'), forPosts('entry')])
    expect(resolveTemplateChain(s, { kind: 'page' }).map((p) => p.id)).toEqual(['layout'])
  })

  it('nests everywhere outside the post entry template', () => {
    const s = site([forPosts('entry'), everywhere('layout')])
    expect(resolveTemplateChain(s, { kind: 'entry', tableSlug: 'posts' }).map((p) => p.id)).toEqual(['layout', 'entry'])
  })

  it('picks the highest-priority template per breadth level', () => {
    const s = site([everywhere('lowL', 1), everywhere('highL', 9), forPosts('lowE', 1), forPosts('highE', 9)])
    expect(resolveTemplateChain(s, { kind: 'entry', tableSlug: 'posts' }).map((p) => p.id)).toEqual(['highL', 'highE'])
  })

  it('does not match a post entry template for a different table', () => {
    const s = site([forPosts('entry')])
    expect(resolveTemplateChain(s, { kind: 'entry', tableSlug: 'authors' })).toEqual([])
  })

  it('isTemplatePage flags template-configured pages', () => {
    expect(isTemplatePage(everywhere('x'))).toBe(true)
    expect(isTemplatePage(tpl('plain', undefined as never))).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/core/templates/__tests__/templateMatching.test.ts`
Expected: FAIL (`resolveTemplateChain` undefined).

- [ ] **Step 3: Replace `selectEntryTemplate` with the chain resolver**

Rewrite `src/core/templates/templateMatching.ts` (keep `normalizeRouteBase` untouched):

```ts
import type { Page, SiteDocument } from '@core/page-tree'

export function normalizeRouteBase(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return '/'
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/g, '')
  return withoutTrailingSlash || '/'
}

/** What an inbound public URL resolved to, for template matching. */
export type RouteResolutionContext =
  | { kind: 'page' }
  | { kind: 'entry'; tableSlug: string }

export function isTemplatePage(page: Page): boolean {
  return page.template?.enabled === true
}

/**
 * Breadth levels, OUTER → INNER. Adding a level here (e.g. a path-prefix
 * "section" layout between everywhere and postTypes) is the only change
 * needed to deepen nesting — the resolver loop is level-agnostic.
 */
function matchesLevel(
  page: Page,
  level: 'everywhere' | 'postTypes',
  ctx: RouteResolutionContext,
): boolean {
  const target = page.template?.target
  if (!target) return false
  if (level === 'everywhere') return target.kind === 'everywhere'
  if (level === 'postTypes') {
    return target.kind === 'postTypes'
      && ctx.kind === 'entry'
      && target.tableSlugs.includes(ctx.tableSlug)
  }
  return false
}

const LEVELS = ['everywhere', 'postTypes'] as const

/**
 * Collect every template matching the route, ordered outer → inner. At most
 * one template per breadth level (highest priority, document order breaks ties).
 */
export function resolveTemplateChain(
  site: SiteDocument,
  ctx: RouteResolutionContext,
): Page[] {
  const indexed = site.pages.map((page, index) => ({ page, index }))
  const chain: Page[] = []
  for (const level of LEVELS) {
    const winner = indexed
      .filter(({ page }) => isTemplatePage(page) && matchesLevel(page, level, ctx))
      .sort((a, b) => ((b.page.template?.priority ?? 0) - (a.page.template?.priority ?? 0)) || a.index - b.index)[0]
    if (winner) chain.push(winner.page)
  }
  return chain
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test src/core/templates/__tests__/templateMatching.test.ts`
Expected: PASS

- [ ] **Step 5: Update the templates barrel**

In `src/core/templates/index.ts`, export `resolveTemplateChain`, `isTemplatePage`, `RouteResolutionContext`; remove the `selectEntryTemplate` export. (Callers are fixed in Phase 5 — expect transient type errors until then; that's acceptable mid-plan.)

- [ ] **Step 6: Commit**

```bash
git add src/core/templates/templateMatching.ts src/core/templates/index.ts src/core/templates/__tests__/templateMatching.test.ts
git commit -m "feat(templates): resolve an ordered template chain per route"
```

---

## Phase 3 — Composer (merge the chain into one tree)

### Task 3.1: Outlet invariant (`assertSingleOutlet`)

A template's whole purpose is "content flows into the outlet", so the exactly-one-`base.outlet` rule is a real invariant — enforced here, reused by the composer (Task 3.2), the renderer (surfaces a publish error), and the admin save guard (Task 6.1).

**Files:**
- Create: `src/core/templates/templateValidation.ts`
- Test: `src/core/templates/__tests__/templateValidation.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'bun:test'
import { findOutletIds, assertSingleOutlet, TemplateOutletError } from '../templateValidation'
import type { Page } from '@core/page-tree'

const page = (moduleIds: string[]): Page => ({
  id: 'p', slug: 'p', title: 'p', rootNodeId: 'r',
  nodes: Object.fromEntries(moduleIds.map((m, i) => [`n${i}`, { id: `n${i}`, moduleId: m, props: {}, breakpointOverrides: {}, children: [] }])),
} as unknown as Page)

describe('outlet validation', () => {
  it('finds the single outlet id', () => {
    expect(findOutletIds(page(['base.body', 'base.outlet']))).toEqual(['n1'])
  })
  it('assertSingleOutlet passes for exactly one', () => {
    expect(() => assertSingleOutlet(['n1'])).not.toThrow()
  })
  it('throws TemplateOutletError for zero outlets', () => {
    expect(() => assertSingleOutlet([])).toThrow(TemplateOutletError)
  })
  it('throws TemplateOutletError for two outlets', () => {
    expect(() => assertSingleOutlet(['a', 'b'])).toThrow(TemplateOutletError)
  })
})
```

- [ ] **Step 2: Run test to verify it fails** — `bun test src/core/templates/__tests__/templateValidation.test.ts`

- [ ] **Step 3: Implement**

```ts
import type { Page } from '@core/page-tree'

/** Thrown when a template tree does not contain exactly one base.outlet. */
export class TemplateOutletError extends Error {
  constructor(readonly count: number) {
    super(`A template must contain exactly one base.outlet (found ${count}).`)
    this.name = 'TemplateOutletError'
  }
}

export function findOutletIds(page: Page): string[] {
  const ids: string[] = []
  for (const id in page.nodes) if (page.nodes[id].moduleId === 'base.outlet') ids.push(id)
  return ids
}

export function assertSingleOutlet(outletIds: string[]): void {
  if (outletIds.length !== 1) throw new TemplateOutletError(outletIds.length)
}
```

- [ ] **Step 4: Run test to verify it passes**

- [ ] **Step 5: Export from the templates barrel** (`findOutletIds`, `assertSingleOutlet`, `TemplateOutletError`).

- [ ] **Step 6: Commit**

```bash
git add src/core/templates/templateValidation.ts src/core/templates/__tests__/templateValidation.test.ts src/core/templates/index.ts
git commit -m "feat(templates): enforce exactly-one base.outlet per template"
```

### Task 3.2: `composeTemplateChain`

**Files:**
- Create: `src/core/templates/templateCompose.ts`
- Test: `src/core/templates/__tests__/templateCompose.test.ts`

**Contract.** Given `chain` (outer→inner templates) and a `terminal`, return one `Page`:
- `terminal.kind === 'page'`: the innermost template's `base.outlet` is replaced by the page tree's content (the page's `base.body` children are spliced at the outlet position; the page's `base.body` wrapper is dropped to avoid nested `<body>`).
- `terminal.kind === 'entry'`: the innermost template's `base.outlet` is **left in place** — it renders `currentEntry.body` at render time (Phase 4).
- Each *outer* template's `base.outlet` is replaced by the next inner template's *whole tree* (its `base.body` wrapper is dropped too — the outermost template owns the document `<body>`).
- If `chain` is empty: return the page tree unchanged (page route) — entry routes always have ≥1 template or they 404 upstream.
- Inner node ids are re-keyed on every splice so a merged tree never collides ids.

**The one document `<body>` is the OUTERMOST template's `base.body`.** Every inner `base.body` wrapper is dropped on splice. The drop must **not** silently lose body-level styling: if a dropped inner `base.body` carries non-empty `props` or `breakpointOverrides`, its children are wrapped in a single `base.container` node bearing those `props`/`breakpointOverrides` at the splice site, so background / padding / classes survive. An inner `base.body` with empty props splices its children directly (no needless wrapper). This is the decided answer to "where do the page's body props go" — outer body wins as the `<body>`, inner body props migrate onto a container, nothing is discarded.

**Outlet invariant.** The host template at each splice must contain **exactly one** `base.outlet` (validated via `assertSingleOutlet`, Task 3.1). Zero outlets or two outlets throws a typed `TemplateOutletError` rather than silently swallowing or dropping content — the renderer surfaces this as a publish error and the admin blocks save.

Splice rule: at the outlet node `O` (the single `base.outlet`) with parent `P`, replace `O`'s id in `P.children` with the inner content's spliced node id(s). "Inner content" = inner root's children when the inner root is `base.body` with empty props; a single migrated `base.container` when the inner root is `base.body` with non-empty props; else the inner root itself.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'bun:test'
import { composeTemplateChain } from '../templateCompose'
import type { Page } from '@core/page-tree'

// Minimal tree builders -----------------------------------------------------
const body = (id: string, children: string[]) => ({ id, moduleId: 'base.body', props: {}, breakpointOverrides: {}, children })
const node = (id: string, moduleId: string, children: string[] = []) => ({ id, moduleId, props: {}, breakpointOverrides: {}, children })

// Layout: body > [header, outlet, footer]
const layout = (): Page => ({
  id: 'layout', slug: 'layout', title: 'Layout', rootNodeId: 'L_body',
  template: { enabled: true, target: { kind: 'everywhere' }, priority: 0 },
  nodes: {
    L_body: body('L_body', ['L_header', 'L_outlet', 'L_footer']),
    L_header: node('L_header', 'base.text'),
    L_outlet: node('L_outlet', 'base.outlet'),
    L_footer: node('L_footer', 'base.text'),
  },
})

// Page: body > [p_heading]
const aboutPage = (): Page => ({
  id: 'about', slug: 'about', title: 'About', rootNodeId: 'A_body',
  nodes: { A_body: body('A_body', ['A_heading']), A_heading: node('A_heading', 'base.text') },
})

describe('composeTemplateChain', () => {
  it('returns the page unchanged when the chain is empty', () => {
    const merged = composeTemplateChain([], { kind: 'page', page: aboutPage() })
    expect(merged.rootNodeId).toBe('A_body')
    expect(Object.keys(merged.nodes)).toEqual(['A_body', 'A_heading'])
  })

  it('splices a page into the everywhere layout outlet, dropping the page body wrapper', () => {
    const merged = composeTemplateChain([layout()], { kind: 'page', page: aboutPage() })
    expect(merged.rootNodeId).toBe('L_body')
    const root = merged.nodes[merged.rootNodeId]
    // outlet replaced by the page's heading (its base.body wrapper dropped)
    expect(root.children).toHaveLength(3)
    const middleId = root.children[1]
    expect(merged.nodes[middleId].moduleId).toBe('base.text') // the spliced heading
    expect(Object.values(merged.nodes).some((n) => n.moduleId === 'base.outlet')).toBe(false)
  })

  it('migrates a styled page body onto a container instead of dropping its props', () => {
    const styled = aboutPage()
    styled.nodes.A_body = { ...styled.nodes.A_body, props: { background: 'navy' } } as never
    const merged = composeTemplateChain([layout()], { kind: 'page', page: styled })
    const root = merged.nodes[merged.rootNodeId]
    const middle = merged.nodes[root.children[1]]
    // body props preserved on a wrapping container, NOT silently lost
    expect(middle.moduleId).toBe('base.container')
    expect(middle.props).toEqual({ background: 'navy' })
    expect(merged.nodes[middle.children[0]].moduleId).toBe('base.text') // original heading underneath
  })

  it('throws when a template has zero or two outlets', () => {
    const noOutlet = layout()
    noOutlet.nodes.L_body = body('L_body', ['L_header', 'L_footer'])
    expect(() => composeTemplateChain([noOutlet], { kind: 'page', page: aboutPage() })).toThrow()
    const twoOutlets = layout()
    twoOutlets.nodes.L_body = body('L_body', ['L_header', 'L_outlet', 'L_outlet2'])
    twoOutlets.nodes.L_outlet2 = node('L_outlet2', 'base.outlet')
    expect(() => composeTemplateChain([twoOutlets], { kind: 'page', page: aboutPage() })).toThrow()
  })

  it('keeps the innermost outlet for an entry terminal', () => {
    const merged = composeTemplateChain([layout()], { kind: 'entry' })
    // layout is BOTH outer and innermost here; its outlet stays to render the body
    expect(Object.values(merged.nodes).some((n) => n.moduleId === 'base.outlet')).toBe(true)
  })

  it('re-keys inner ids so two chained templates never collide', () => {
    const inner = layout()
    inner.id = 'inner'
    const merged = composeTemplateChain([layout(), inner], { kind: 'entry' })
    const ids = Object.keys(merged.nodes)
    expect(new Set(ids).size).toBe(ids.length) // all unique
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/core/templates/__tests__/templateCompose.test.ts`
Expected: FAIL (module missing).

- [ ] **Step 3: Implement the composer**

```ts
import type { Page, PageNode } from '@core/page-tree'
import { assertSingleOutlet } from './templateValidation'

export type TerminalContent =
  | { kind: 'page'; page: Page }
  | { kind: 'entry' }

type Nodes = Record<string, PageNode>

/** The single base.outlet id, or throw TemplateOutletError on zero/two. */
function requireOutletId(nodes: Nodes): string {
  const ids: string[] = []
  for (const id in nodes) if (nodes[id].moduleId === 'base.outlet') ids.push(id)
  assertSingleOutlet(ids) // throws TemplateOutletError unless exactly one
  return ids[0]
}

function hasMeaningfulBodyProps(node: PageNode): boolean {
  return Object.keys(node.props ?? {}).length > 0
    || Object.keys(node.breakpointOverrides ?? {}).length > 0
}

/** Clone a tree's nodes with every id prefixed, returning the remapped root id. */
function rekey(nodes: Nodes, rootId: string, prefix: string): { nodes: Nodes; rootId: string } {
  const map = new Map<string, string>()
  for (const id in nodes) map.set(id, `${prefix}${id}`)
  const out: Nodes = {}
  for (const id in nodes) {
    const n = nodes[id]
    out[map.get(id)!] = { ...n, id: map.get(id)!, children: n.children.map((c) => map.get(c) ?? c) }
  }
  return { nodes: out, rootId: map.get(rootId)! }
}

/** Find the parent id + index of `childId` within `nodes`. */
function locate(nodes: Nodes, childId: string): { parentId: string; index: number } | null {
  for (const id in nodes) {
    const i = nodes[id].children.indexOf(childId)
    if (i !== -1) return { parentId: id, index: i }
  }
  return null
}

/**
 * Resolve the spliced content of an inner tree, mutating `nodes` if a wrapper
 * must be created:
 *  - inner root is base.body with NO meaningful props → splice its children
 *    directly (avoid a nested <body>, no needless wrapper);
 *  - inner root is base.body WITH props/breakpointOverrides → migrate those onto
 *    a fresh base.container wrapping its children, so body styling survives;
 *  - otherwise → the root itself.
 * Returns the ids to insert at the outlet position. The dropped base.body
 * wrapper is removed from `nodes` by the caller.
 */
function contentRootIds(nodes: Nodes, rootId: string, prefix: string): string[] {
  const root = nodes[rootId]
  if (root?.moduleId !== 'base.body') return [rootId]
  if (!hasMeaningfulBodyProps(root)) return [...root.children]
  // Migrate body-level styling onto a container so nothing is silently lost.
  const containerId = `${prefix}bodyprops`
  nodes[containerId] = {
    id: containerId,
    moduleId: 'base.container',
    props: { ...root.props },
    breakpointOverrides: { ...root.breakpointOverrides },
    children: [...root.children],
  }
  return [containerId]
}

/** Replace the single base.outlet in `host` with `inner`'s content nodes. */
function spliceIntoOutlet(host: Nodes, hostRoot: string, inner: Nodes, innerRoot: string, prefix: string): { nodes: Nodes; rootId: string } {
  const outletId = requireOutletId(host) // throws on zero/two outlets
  const at = locate(host, outletId)
  const rekeyed = rekey(inner, innerRoot, prefix)
  const merged: Nodes = { ...host, ...rekeyed.nodes }
  const contentIds = contentRootIds(merged, rekeyed.rootId, prefix)
  delete merged[outletId]
  // If the inner root was base.body, that wrapper node is now orphaned — drop it.
  if (rekeyed.nodes[rekeyed.rootId]?.moduleId === 'base.body') delete merged[rekeyed.rootId]
  if (at) {
    const parent = merged[at.parentId]
    merged[at.parentId] = {
      ...parent,
      children: [...parent.children.slice(0, at.index), ...contentIds, ...parent.children.slice(at.index + 1)],
    }
  }
  return { nodes: merged, rootId: hostRoot }
}

/**
 * Merge an ordered (outer→inner) template chain + terminal into one Page.
 * See plan Phase 3 for the splice contract.
 */
export function composeTemplateChain(chain: Page[], terminal: TerminalContent): Page {
  if (chain.length === 0) {
    if (terminal.kind === 'page') return terminal.page
    throw new Error('composeTemplateChain: entry terminal requires at least one template')
  }

  // Build the merged tree from the INNERMOST template outward.
  const innermost = chain[chain.length - 1]
  let acc: { nodes: Nodes; rootId: string } = { nodes: { ...innermost.nodes }, rootId: innermost.rootNodeId }

  // Innermost terminal handling.
  if (terminal.kind === 'page') {
    acc = spliceIntoOutlet(acc.nodes, acc.rootId, terminal.page.nodes, terminal.page.rootNodeId, 'c0_')
  }
  // entry terminal: leave the innermost outlet in place (renders currentEntry.body).

  // Wrap with each outer template, inner-most-but-one first.
  for (let i = chain.length - 2; i >= 0; i--) {
    const outer = chain[i]
    acc = spliceIntoOutlet({ ...outer.nodes }, outer.rootNodeId, acc.nodes, acc.rootId, `t${i}_`)
  }

  const root = chain[0]
  return {
    id: innermost.id, // identifies "what was rendered" for the publish.html filter
    slug: innermost.slug,
    title: innermost.title,
    rootNodeId: acc.rootId,
    nodes: acc.nodes,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test src/core/templates/__tests__/templateCompose.test.ts`
Expected: PASS

- [ ] **Step 5: Export from the templates barrel**

Add `composeTemplateChain` and `TerminalContent` to `src/core/templates/index.ts`.

- [ ] **Step 6: Commit**

```bash
git add src/core/templates/templateCompose.ts src/core/templates/__tests__/templateCompose.test.ts src/core/templates/index.ts
git commit -m "feat(templates): compose a template chain into one merged tree"
```

---

## Phase 4 — `base.outlet` module; retire `base.content`

### Task 4.1: Create the `base.outlet` module

**Files:**
- Create: `src/modules/base/outlet/index.ts`, `src/modules/base/outlet/OutletEditor.tsx`, `src/modules/base/outlet/OutletEditor.module.css`
- Test: `src/modules/base/outlet/__tests__/outlet.render.test.ts`

**Render semantics** (mirror how `base.content` reads the entry body today — see `src/core/templates/dynamicBindings.ts` `format: 'html'` path):
- If the node has spliced children (a layout outlet that the composer *didn't* remove — shouldn't happen post-compose, but keep the walker contract: render children), the walker renders them.
- Else, when a current entry is in `templateContext`, emit `<article data-instatic-content-region>{bodyHtml}</article>` (markdown→HTML via the same binding the seed used).
- Else emit `<article data-instatic-content-region></article>` (empty live-edit anchor) — so the Content workspace always has a mount point.

Because the entry-body value flows through the binding system (`dynamicBindings.html`), the **seed** (Task 4.3) attaches `dynamicBindings: { html: { source: 'currentEntry', field: 'body', format: 'html' } }` to the outlet node exactly as `base.content` had it, and the module renders `props.html`. This keeps Tiptap live-editing working unchanged.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'bun:test'
import { OutletModule } from '../index'

describe('base.outlet render', () => {
  it('emits an empty content region when no body is bound', () => {
    expect(OutletModule.render({ html: '' } as never).html).toBe('<article data-instatic-content-region></article>')
  })
  it('wraps bound body html in a content region', () => {
    expect(OutletModule.render({ html: '<p>hi</p>' } as never).html).toBe('<article data-instatic-content-region><p>hi</p></article>')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/modules/base/outlet/__tests__/outlet.render.test.ts`
Expected: FAIL (module missing).

- [ ] **Step 3: Implement the module**

`src/modules/base/outlet/index.ts` (adapted from the deleted `base.content`):

```ts
/**
 * base.outlet — the single content outlet for templates.
 *
 * Polymorphic: the composer either splices matched content (a page tree or a
 * nested template) in place of this node, OR — for the innermost outlet on an
 * entry route — leaves it here to render the current entry's body. The
 * `data-instatic-content-region` marker is what the Content workspace's Live
 * mode mounts Tiptap against, so it is emitted unconditionally.
 */
import type { ModuleDefinition } from '@core/module-engine'
import { registry } from '@core/module-engine'
import { Type, Value, type Static } from '@core/utils/typeboxHelpers'
import { TargetSolidIcon } from 'pixel-art-icons/icons/target-solid'
import { OutletEditor } from './OutletEditor'

const OutletPropsSchema = Type.Object({ html: Type.String({ default: '' }) })
type OutletProps = Static<typeof OutletPropsSchema>

export const OutletModule: ModuleDefinition<OutletProps> = {
  id: 'base.outlet',
  name: 'Content Outlet',
  description: 'Where matched content (a page or the current entry body) flows in.',
  category: 'CMS',
  version: '1.0.0',
  icon: TargetSolidIcon,
  trusted: true,
  canHaveChildren: false,
  schema: { html: { type: 'richtext', label: 'HTML' } },
  propsSchema: OutletPropsSchema,
  defaults: Value.Create(OutletPropsSchema) as OutletProps,
  component: OutletEditor,
  htmlTag: 'article',
  render: (props) => {
    const html = typeof props.html === 'string' ? props.html : ''
    return { html: `<article data-instatic-content-region>${html}</article>` }
  },
}

registry.registerOrReplace(OutletModule)
```

`src/modules/base/outlet/OutletEditor.tsx`: copy `src/modules/base/content/ContentEditor.tsx` verbatim, rename the component to `OutletEditor`, and point its CSS import at `./OutletEditor.module.css`. `OutletEditor.module.css`: copy `ContentEditor.module.css`. (Read `ContentEditor.tsx` at execution time and reproduce it — the canvas placeholder/empty-state behaviour must be identical so live editing is unchanged.)

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test src/modules/base/outlet/__tests__/outlet.render.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/base/outlet
git commit -m "feat(modules): add base.outlet content outlet"
```

### Task 4.2: Delete `base.content`, register `base.outlet`

**Files:**
- Delete: `src/modules/base/content/` (whole folder)
- Modify: `src/modules/base/index.ts`

- [ ] **Step 1: Swap the registration**

In `src/modules/base/index.ts`, remove the `import './content'` line and add `import './outlet'` in the same spot.

- [ ] **Step 2: Delete the folder**

```bash
git rm -r src/modules/base/content
```

- [ ] **Step 3: Find every remaining `base.content` reference**

Run: `grep -rn "base.content\|ContentModule\|ContentEditor" --include="*.ts" --include="*.tsx" src server | grep -v "src/modules/base/outlet"`
Expected: only seeding (Task 4.3), tests (Task 7.x), and docs remain. Fix each as its task comes; note any surprise hit in the commit body.

- [ ] **Step 4: Commit**

```bash
git add -A src/modules/base
git commit -m "refactor(modules): retire base.content in favour of base.outlet"
```

### Task 4.3: Seed the new shape (`base.outlet` + `templateTarget`)

**Files:**
- Modify: `server/repositories/data/templateSeeding.ts`
- Test: `server/repositories/data/__tests__/templateSeeding.test.ts` (extend if present; else create a focused unit test on `buildDefaultTemplateCells`)

- [ ] **Step 1: Make `buildDefaultTemplateCells` exportable and test it**

Add `export` to `buildDefaultTemplateCells`. Test:

```ts
import { describe, expect, it } from 'bun:test'
import { buildDefaultTemplateCells } from '../templateSeeding'
import type { DataTable } from '@core/data/schemas'

const table = { slug: 'posts', singularLabel: 'Post' } as DataTable

describe('buildDefaultTemplateCells', () => {
  it('targets the post type and uses base.outlet for the body', () => {
    const cells = buildDefaultTemplateCells(table, 'posts-template') as Record<string, any>
    expect(cells.templateTarget).toEqual({ kind: 'postTypes', tableSlugs: ['posts'] })
    expect(cells.templateContext).toBeUndefined()
    const nodes = cells.body.nodes as Record<string, any>
    const outlet = Object.values(nodes).find((n: any) => n.moduleId === 'base.outlet') as any
    expect(outlet).toBeTruthy()
    expect(outlet.dynamicBindings.html).toEqual({ source: 'currentEntry', field: 'body', format: 'html' })
    expect(Object.values(nodes).some((n: any) => n.moduleId === 'base.content')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test server/repositories/data/__tests__/templateSeeding.test.ts`
Expected: FAIL

- [ ] **Step 3: Update the seed**

In `buildDefaultTemplateCells`: change the body node's `moduleId` from `'base.content'` to `'base.outlet'` (keep its `dynamicBindings.html` exactly). Replace the trailing template cells:

```ts
    templateEnabled: true,
    templateTarget: { kind: 'postTypes', tableSlugs: [table.slug] },
    templatePriority: 0,
```

In `hasEntryTemplate`, replace the cell check with:

```ts
    const target = cells.templateTarget as { kind?: string; tableSlugs?: unknown } | undefined
    if (cells.templateEnabled === true
      && target?.kind === 'postTypes'
      && Array.isArray(target.tableSlugs)
      && target.tableSlugs.includes(tableSlug)
    ) {
      return true
    }
```

Update the file header doc comment (`base.content` → `base.outlet`; `template.{enabled,context,tableSlug}` → `template.{enabled,target}`).

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test server/repositories/data/__tests__/templateSeeding.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/repositories/data/templateSeeding.ts server/repositories/data/__tests__/templateSeeding.test.ts
git commit -m "feat(templates): seed base.outlet entry template with postTypes target"
```

---

## Phase 5 — Wire resolver + composer into the public renderer

### Task 5.1: Exclude template pages from direct slug routing

A layout template is a `pages` row with a slug; `getPublishedPageBySlug` would otherwise serve it directly at `/posts-template`. Template pages are never directly routable — they only ever wrap.

**Files:**
- Modify: `server/publish/publicRouter.ts:142-175` (`resolvePublicRoute`)
- Test: `server/publish/__tests__/publicRouter.resolve.test.ts` (extend if present)

- [ ] **Step 1: Write the failing test**

Add a case asserting that when `getPublishedPageBySlug` returns a snapshot whose page has `template.enabled === true`, the resolver does **not** return `kind: 'page'` for it (it falls through to row/redirect/not-found). (Follow the existing mocking style in the file's neighbouring tests; if none exist, write a thin test that injects a fake `db` returning a template-configured page snapshot.)

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test server/publish/__tests__/publicRouter.resolve.test.ts`
Expected: FAIL (template page served directly).

- [ ] **Step 3: Guard the page branch**

In `resolvePublicRoute`, after fetching `pageSnapshot`, find the page in the snapshot and skip it when it's a template. Import `isTemplatePage` from `@core/templates`:

```ts
  const pageSnapshot = await getPublishedPageBySlug(db, pageSlug)
  if (pageSnapshot) {
    const page = pageSnapshot.site.pages.find((p) => p.id === pageSnapshot.pageRowId)
    if (page && !isTemplatePage(page)) {
      return { kind: 'page', snapshot: pageSnapshot }
    }
    // template page: not directly routable — fall through to row/redirect/not-found
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test server/publish/__tests__/publicRouter.resolve.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/publish/publicRouter.ts server/publish/__tests__/publicRouter.resolve.test.ts
git commit -m "fix(publish): never serve a template page at its own slug"
```

### Task 5.2: Render through the chain composer

**Files:**
- Modify: `server/publish/publicRenderer.ts` (`renderPublishedSnapshot`, `renderPublishedDataRowTemplate`)
- Test: `server/publish/__tests__/publicRenderer.chain.test.ts`

Both paths now: build a `RouteResolutionContext`, `resolveTemplateChain`, `composeTemplateChain`, then feed the **merged page** to `publishPage` (via the same `buildSiteCssBundle` / `prefetchLoopData` / `prefetchMediaAssets` calls, all pointed at the merged page).

- [ ] **Step 1: Write the failing integration test**

```ts
import { describe, expect, it } from 'bun:test'
import { renderPublishedSnapshot } from '../publicRenderer'
// Build a PublishedPageSnapshot whose site has: an everywhere layout
// (body > header "MASTHEAD" + base.outlet) and a plain page /about (body > "ABOUT BODY").
// Assert the rendered html contains BOTH "MASTHEAD" and "ABOUT BODY", proving the
// page was spliced into the layout outlet.
```

(Construct the snapshot with the same builders Phase 3 used; reuse an existing snapshot factory in `server/publish/__tests__` if one exists.)

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test server/publish/__tests__/publicRenderer.chain.test.ts`
Expected: FAIL (`MASTHEAD` absent — layout not applied yet).

- [ ] **Step 3: Rewrite `renderPublishedSnapshot` (page route)**

```ts
import { resolveTemplateChain, composeTemplateChain } from '@core/templates'

export async function renderPublishedSnapshot(snapshot, ctx) {
  const page = snapshot.site.pages.find((c) => c.id === snapshot.pageRowId)
  if (!page) throw new Error(`Published page "${snapshot.pageRowId}" not found in snapshot`)

  const chain = resolveTemplateChain(snapshot.site, { kind: 'page' })
  const merged = composeTemplateChain(chain, { kind: 'page', page })

  const cssBundle = buildSiteCssBundle(snapshot.site, registry, merged)
  const [loopData, mediaAssets] = await Promise.all([
    prefetchLoopData(merged, snapshot.site, ctx.db, ctx.url),
    prefetchMediaAssets(merged, snapshot.site, registry, ctx.db),
  ])
  const html = publishPage(merged, snapshot.site, registry, {
    runtimeAssets: snapshot.runtimeAssets,
    runtimePackageImportmap: snapshot.runtimePackageImportmap,
    cssEmission: 'external', cssBundle, cssAssetBaseUrl: CSS_ASSET_BASE_URL,
    loopData, mediaAssets, loopEndpointBaseUrl: LOOP_ENDPOINT_BASE_URL,
    publishVersion: ctx.publishVersion ?? getPublishVersion(),
    templateContext: ctx.url ? { entryStack: [], route: buildRouteFrame(ctx.url.toString()) } : undefined,
  }).html
  return { html, pageId: page.id, slug: page.slug, siteId: snapshot.site.id }
}
```

- [ ] **Step 4: Rewrite `renderPublishedDataRowTemplate` (entry route)**

```ts
export async function renderPublishedDataRowTemplate(snapshot, row, ctx) {
  const chain = resolveTemplateChain(snapshot.site, { kind: 'entry', tableSlug: row.tableSlug })
  if (chain.length === 0) return null // no entry template → 404 (unchanged behaviour)
  const merged = composeTemplateChain(chain, { kind: 'entry' })

  const cssBundle = buildSiteCssBundle(snapshot.site, registry, merged)
  const [loopData, mediaAssets] = await Promise.all([
    prefetchLoopData(merged, snapshot.site, ctx.db, ctx.url),
    prefetchMediaAssets(merged, snapshot.site, registry, ctx.db),
  ])
  const html = publishPage(merged, snapshot.site, registry, {
    templateContext: {
      entryStack: [publishedDataRowToLoopItem(row)],
      ...(ctx.url ? { route: buildRouteFrame(ctx.url.toString()) } : {}),
    },
    runtimeAssets: snapshot.runtimeAssets,
    runtimePackageImportmap: snapshot.runtimePackageImportmap,
    cssEmission: 'external', cssBundle, cssAssetBaseUrl: CSS_ASSET_BASE_URL,
    loopData, mediaAssets, loopEndpointBaseUrl: LOOP_ENDPOINT_BASE_URL,
    publishVersion: ctx.publishVersion ?? getPublishVersion(),
  }).html
  return { html, pageId: merged.id, slug: merged.slug, siteId: snapshot.site.id }
}
```

Remove the now-unused `selectEntryTemplate` import.

- [ ] **Step 5: Run test to verify it passes**

Run: `bun test server/publish/__tests__/publicRenderer.chain.test.ts`
Expected: PASS

- [ ] **Step 6: Fix remaining `selectEntryTemplate` callers**

Run: `grep -rn "selectEntryTemplate" --include="*.ts" --include="*.tsx" src server`

Two distinct caller shapes:
- **Render/bake callers** (`server/repositories/data/publish.ts` `publishDataRow`, any preview that renders HTML): switch to the **full chain** — `resolveTemplateChain(site, { kind: 'entry', tableSlug })` + `composeTemplateChain(chain, { kind: 'entry' })` (or just call the now-chain-aware `renderPublishedDataRowTemplate`). The incremental entry artefact must carry the *whole* chain (everywhere layout + entry template), exactly like the live renderer — otherwise an incrementally-baked `/posts/hello.html` would be missing the layout chrome that the live path shows. `publishDataRow`'s `if (!template) return` becomes `if (chain.length === 0) return`.
- **Existence/guard callers** that only need "is there an entry template for this table?": use `resolveTemplateChain(site, { kind: 'entry', tableSlug }).some((p) => p.template?.target.kind === 'postTypes')` or the dedicated `hasEntryTemplate` seed helper — do not resurrect `selectEntryTemplate`.

Update each caller and its test. After this step, `grep -rn "selectEntryTemplate"` returns nothing.

- [ ] **Step 7: Commit**

```bash
git add server/publish/publicRenderer.ts server/publish/__tests__/publicRenderer.chain.test.ts
git commit -m "feat(publish): render pages and entries through the template chain"
```

### Task 5.3: Static-publish path parity

**Files:**
- Modify: whatever bakes Layer A artefacts (`server/repositories/publish.ts` `publishDraftSiteLocked`, `server/repositories/data/publish.ts` `publishDataRow`) — confirm they call `renderPublishedSnapshot` / `renderPublishedDataRowTemplate` (now chain-aware) and not a bypassing renderer.
- Test: existing static-artefact tests.

- [ ] **Step 1: Trace the bakers**

Run: `grep -rn "renderPublishedSnapshot\|renderPublishedDataRowTemplate\|publishPage(" --include="*.ts" server/publish server/repositories`
Confirm every HTML-baking call now goes through the two chain-aware functions. If a baker calls `publishPage` directly on a single page, route it through the chain the same way (resolve + compose first).

- [ ] **Step 2: Run the publish test suite**

Run: `bun test server/publish server/repositories`
Expected: PASS (fix any baker that still renders un-wrapped pages).

- [ ] **Step 3: Commit**

```bash
git add -A server/publish server/repositories
git commit -m "fix(publish): apply template chain on the static bake path too"
```

### Task 5.4: Static re-bake correctness for template edits

**Why.** A template (especially `everywhere`) now wraps many baked artefacts, so two things must hold on the Layer-A disk export:

1. **A template page must never be baked at its own slug.** `publishDraftSiteLocked` iterates `publishedSite.pages` and writes `/<page.slug>.html` for each. A layout/entry template is a `pages` row with a slug, so without a guard it bakes a junk `/<template-slug>.html`. Task 5.1 guarded the *live* router; the bake loop needs the same `isTemplatePage` skip.
2. **Editing a template must refresh the artefacts it wraps.** This already falls out of the architecture *once the guard is in place*: page publishing always runs the full `publishDraftSiteLocked`, which wipes the inactive slot and re-bakes **every** page through the now-chain-aware `renderPublishedSnapshot` — so `/about.html` etc. pick up the edited layout. We add a test to *pin* that guarantee so a future change can't silently regress it.

**Entry-detail artefacts (`/posts/hello.html`)** are written incrementally to the active slot by `publishDataRow` and are wiped by the next slot swap (existing behaviour), after which `/posts/hello` falls through to the chain-aware **live renderer** (Task 5.2) and is re-baked correctly on the row's next incremental publish. So no stale *wrongly-wrapped* entry HTML is ever served — document this explicitly; do **not** add a full entry re-bake to `publishDraftSite` (it would duplicate the live/incremental path and bloat every publish).

**Files:**
- Modify: `server/repositories/publish.ts` (`publishDraftSiteLocked` bake loop)
- Test: `server/repositories/__tests__/publish.rebake.test.ts` (create; follow the existing publish-test harness/fixtures)

- [ ] **Step 1: Write the failing test**

Build a draft site with an `everywhere` layout (`body > header "MASTHEAD" + base.outlet`) and a plain `/about` page (`body > "ABOUT BODY"`). Run `publishDraftSite`, then read the baked artefact for `/about` from the active slot (`readArtefact(uploadsDir, '/about')`). Assert it **contains `MASTHEAD`** (layout applied on the static bake) and that **no `/<layout-slug>` artefact exists** (template page not baked at its own slug).

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test server/repositories/__tests__/publish.rebake.test.ts`
Expected: FAIL (`MASTHEAD` absent and/or template artefact present).

- [ ] **Step 3: Guard the bake loop**

In `publishDraftSiteLocked`, in the HTML-artefact loop (and the CSS-asset loop above it, to skip needless work), `continue` when `isTemplatePage(page)`:

```ts
      for (const snapshot of snapshots) {
        const page = snapshot.site.pages.find((p) => p.id === snapshot.pageRowId)
        if (!page || isTemplatePage(page)) continue // template pages only ever wrap; never baked at their own slug
        // …existing render + writeArtefact…
      }
```

Import `isTemplatePage` from `@core/templates`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test server/repositories/__tests__/publish.rebake.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/repositories/publish.ts server/repositories/__tests__/publish.rebake.test.ts
git commit -m "fix(publish): re-bake wrapped pages and skip template pages on full publish"
```

---

## Phase 6 — Admin: target selection + preview

### Task 6.1: Target selector in `TemplateSettingsDialog`

**Files:**
- Modify: `src/admin/shared/dialogs/TemplateSettingsDialog/TemplateSettingsDialog.tsx`
- Test: `src/admin/shared/dialogs/TemplateSettingsDialog/__tests__/TemplateSettingsDialog.test.tsx` (create if absent; follow existing dialog test patterns)

Replace the single **Table** `Select` (which always produced `context: 'entry'`) with a **Target kind** control:
- A `Select` for kind: `Everywhere` | `Post types`.
- When `Post types`: show a multi-select of routable post-type tables (reuse the existing `listCmsDataTables` + `routeBase` filter already in the file). Store the chosen slugs.
- `handleSubmit` builds `template: { enabled: true, target, priority }` where `target` is `{ kind: 'everywhere' }` or `{ kind: 'postTypes', tableSlugs }`. **No `conditions`.**
- Keep the `priority` input. Drop `tableSlug`/`context` state. No `conditions` UI exists.
- **Outlet guard:** when the dialog *enables* a template, validate the page's tree with `findOutletIds(page)` (Task 3.1). If the count is not exactly 1, show a blocking `role="alert"` message ("A template needs exactly one Content Outlet — add one from the block list" / "Remove the extra Content Outlet") and disable Save. This catches the zero/two-outlet authoring error at config time rather than as a publish failure.

Use the shared `Select` primitive (`@ui/components/Select`). For the multi-select, follow the project's existing multi-select pattern if one exists (search `multiSelect` / `FilterBar`); otherwise render a checkbox list of tables using the `Switch`/checkbox primitive. Do **not** hand-roll a `<select multiple>`.

- [ ] **Step 1: Write the failing test**

Assert that choosing "Everywhere" and saving calls `onSave` with `template.target = { kind: 'everywhere' }` and **no `conditions` key**; choosing "Post types" + checking `posts` yields `{ kind: 'postTypes', tableSlugs: ['posts'] }`. Add a case: enabling a template whose tree has zero `base.outlet` nodes shows the alert and Save is disabled.

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/admin/shared/dialogs/TemplateSettingsDialog`
Expected: FAIL

- [ ] **Step 3: Implement the target UI**

Edit `TemplateSettingsPayload` is unchanged (`template: PageTemplateConfig`). Add `targetKind` + `selectedSlugs` state seeded from `page.template?.target`. Render kind `Select` + conditional post-types multi-select. Rewrite `handleSubmit` to assemble `target`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test src/admin/shared/dialogs/TemplateSettingsDialog`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/admin/shared/dialogs/TemplateSettingsDialog
git commit -m "feat(admin): template target selector (everywhere / post types)"
```

### Task 6.2: Outlet preview context in the editor

**Files:**
- Modify: `src/admin/pages/site/hooks/useTemplatePreviewContext.ts`
- Test: matching `__tests__` if present.

When editing a template, the `base.outlet` node needs a sensible in-canvas preview:
- `target.kind === 'postTypes'`: preview against a sample row of the first targeted table (the hook already builds an entry preview context for the old `tableSlug` — repoint it at `target.tableSlugs[0]`).
- `target.kind === 'everywhere'`: render the outlet as a labelled placeholder ("Page content appears here") — no entry context.

- [ ] **Step 1: Read the current hook, then write a test** asserting the preview context reflects `target` (sample-entry for postTypes, placeholder for everywhere).

- [ ] **Step 2: Run test to verify it fails.** `bun test src/admin/pages/site/hooks`

- [ ] **Step 3: Implement** the `target`-driven branch (replace `template.tableSlug` reads with `template.target`).

- [ ] **Step 4: Run test to verify it passes.**

- [ ] **Step 5: Commit**

```bash
git add src/admin/pages/site/hooks/useTemplatePreviewContext.ts
git commit -m "feat(admin): preview the content outlet by template target"
```

---

## Phase 7 — Docs, architecture gates, full verification

### Task 7.1: Update architecture tests that name the old shape

**Files:**
- Modify: any test under `src/__tests__/architecture/` (and module tests) referencing `base.content` or `context: 'entry'` / `templateContext` / `tableSlug`.

- [ ] **Step 1: Find them**

Run: `grep -rln "base.content\|templateContext\|context: 'entry'\|selectEntryTemplate\|templateTableSlug\|templateConditions\|TemplateConditionSchema" --include="*.ts" --include="*.tsx" src server`

- [ ] **Step 2: Update each** to the new symbols (`base.outlet`, `templateTarget`, `resolveTemplateChain`). For module-registry gate tests that enumerate base modules, swap `base.content` → `base.outlet`.

- [ ] **Step 3: Run the architecture suite**

Run: `bun test src/__tests__/architecture`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add -A src/__tests__ src server
git commit -m "test: update gates for unified template model"
```

### Task 7.2: Rewrite `docs/features/templates.md`

**Files:**
- Modify: `docs/features/templates.md`

- [ ] **Step 1: Rewrite** to describe: the unified Template (target + priority — **no conditions**), auto-nesting by breadth (everywhere → postTypes, **2-level v1** with the breadth-level list as the documented extension point), the exactly-one `base.outlet` invariant, the `base.outlet` polymorphism (spliced content vs entry body), the chain → merged-tree → single `publishPage` render (including the inner-`base.body` drop + body-prop→container migration), that template pages are not directly routable and are skipped by the static bake, and how a layout edit re-bakes wrapped page artefacts on full publish. Remove `base.content` and `context: 'entry'` references. Cross-link from `docs/README.md` if the link text changed.

- [ ] **Step 2: Grep docs for stale references**

Run: `grep -rn "base.content\|context.*entry\|selectEntryTemplate" docs`
Fix any remaining mentions (e.g. `visual-components.md`, `publisher.md`, `architecture.md`).

- [ ] **Step 3: Commit**

```bash
git add docs
git commit -m "docs: document the unified template + outlet model"
```

### Task 7.3: Full verification

- [ ] **Step 1: Build**

Run: `bun run build`
Expected: `tsc -b` + `vite build` clean for touched files. Fix type errors in your diff (pre-existing failures in untouched areas are out of scope — note them).

- [ ] **Step 2: Test**

Run: `bun test`
Expected: PASS for everything you touched.

- [ ] **Step 3: Lint**

Run: `bun run lint`
Expected: clean (no manual memoization in new admin code; CSS tokens only).

- [ ] **Step 4: Manual smoke (admin)**

Start `bun run dev`; log in (`ai@ai.com` / `qwerty123456`). Create an `everywhere` template with a header + `base.outlet` + footer, publish, and confirm `/` and a `/posts/<slug>` both show the header/footer with the page/post body in the outlet — with no per-page placement. Confirm the post detail still shows its title binding and body, and that the body is still live-editable in the Content workspace.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "chore(templates): verification fixes"
```

---

## Self-Review notes (for the executor)

- **Type consistency:** `target` is `TemplateTarget` everywhere (`{ kind: 'everywhere' } | { kind: 'postTypes'; tableSlugs: string[] }`). `PageTemplateConfig` is `{ enabled: true; target; priority }` — **no `conditions`**. `resolveTemplateChain(site, ctx)` returns `Page[]` outer→inner. `composeTemplateChain(chain, terminal)` returns one `Page`. `isTemplatePage(page)` is the single "is this a template" predicate (used by resolver, live router, and the static bake loop). `assertSingleOutlet` is the single outlet-count invariant (used by composer + admin guard).
- **Single source of truth:** row⇄page parsing delegates to `parsePageTemplate` (Task 1.2) — no second validator.
- **The two risky merge details:** (1) dropping inner `base.body` wrappers so the merged document has exactly one `<body>`, **migrating non-empty body props onto a `base.container`** so styling is never silently lost (Phase 3, `contentRootIds` + the orphan-wrapper delete); (2) the exactly-one-`base.outlet` invariant (`requireOutletId` → `assertSingleOutlet`). The Phase 3 tests pin both; the Phase 5 integration test (`MASTHEAD` + `ABOUT BODY` both present, once) and the Task 5.4 re-bake test are the backstops.
- **Static re-bake:** page artefacts re-bake through the chain on every full publish (Task 5.2 + 5.4); template pages are never baked at their own slug; entry-detail artefacts ride the chain-aware live/incremental path — documented in Task 5.4 so no stale wrongly-wrapped HTML is served.
- **Live editing** depends on `base.outlet` emitting `data-instatic-content-region` and the seed keeping `dynamicBindings.html` — verified in Task 4.1/4.3 and the manual smoke.
- **Out of scope (v1) — deliberate, agreed scope, not stubs:** path-prefix/section targets (and therefore >2-level nesting) and any `conditions`-style finer matching. These are *absent*, not carried as unused fields — the breadth-level list `LEVELS` in `templateMatching.ts` is the documented single insertion point when they land as real features. Per-template caching beyond `bumpPublishVersion` is also out of scope.
```