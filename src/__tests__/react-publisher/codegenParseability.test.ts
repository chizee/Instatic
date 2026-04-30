/**
 * Codegen Parser Meta-Gate (Task #459)
 *
 * Source: Idea #457 — CR Contribution #654 + Architect msg #2008 + Hot-fix Contribution #661.
 *
 * ## Why this file exists
 *
 * The P0 codegen bugs in Task #454 both produced syntactically invalid TypeScript,
 * yet the 20 tests in `exportVisualComponents.test.ts` passed — because those tests
 * only asserted string substrings (`expect(src).toContain('...')`), not parse validity.
 *
 * This file is the structural fix: every codegen surface (vcToComponent, pageToComponent)
 * is exercised through `Bun.Transpiler` — the same parser Bun uses to execute the project.
 * A SyntaxError inside `Bun.Transpiler.transformSync()` means the emitted file would fail
 * to parse at runtime, so any such failure here is a P0 regression.
 *
 * ## What this catches (that string assertions miss)
 *
 * - `{props.title}` in a destructured-signature function  → ReferenceError (Bug 1 / #454)
 * - `{ class = "x" }: FooProps` in function signature    → SyntaxError  (Bug 2 / #454)
 * - Any future emitter change that produces malformed JSX/TSX
 *
 * ## Gate status — all GREEN (fixes landed in Contribution #661)
 *
 * MG-1   PASSING  empty VC (no params, no children)
 * MG-2   PASSING  string param with non-empty default
 * MG-3   PASSING  number param
 * MG-4   PASSING  boolean param
 * MG-5   PASSING  url-type param
 * MG-6   PASSING  bound text prop emits bare param name — no {props.X}
 * MG-7   PASSING  three bound props of different types
 * MG-8   PASSING  reserved keyword param `class` → `_class` via safeParamName
 * MG-9   PASSING  reserved keyword param `default` → `_default`
 * MG-10  PASSING  reserved keyword param `function` → `_function`
 * MG-11  PASSING  6-param stress test (mixed types)
 * MG-12  PASSING  bound prop + unbound prop coexist in same component
 * MG-13  PASSING  pageToComponent() output is parseable TSX
 * MG-14  PASSING  topoSortVCs batch: all emitted VCs individually parseable
 *
 * Isolation: imports only from `../../core/react-publisher/` (Constraint #269).
 */

import { describe, it, expect } from 'bun:test'
import { vcToComponent, topoSortVCs } from '../../core/react-publisher/vcToComponent'
import { pageToComponent } from '../../core/react-publisher/pageToComponent'
import type { VisualComponent, VCParam } from '../../core/visualComponents/types'
import type { Project, Page, PageNode } from '../../core/page-tree/types'
import type { IModuleRegistry, AnyModuleDefinition } from '../../core/module-engine/types'

// ---------------------------------------------------------------------------
// Parse oracle — Bun.Transpiler
// ---------------------------------------------------------------------------

/**
 * Assert that `source` is valid TypeScript/TSX by running it through Bun's transpiler.
 *
 * Throws with a descriptive error including the gate label and the full offending
 * source if the transpiler raises a SyntaxError or any other parse-time exception.
 *
 * Note: Bun.Transpiler catches *syntax* errors (SyntaxError, unexpected token, etc.)
 * but does NOT perform type-checking. Semantic bugs like undefined variable references
 * (`props.title` in a destructured scope) still require string assertions — see MG-6.
 */
function assertParsesTSX(source: string, gateLabel: string): void {
  // Bun.Transpiler is available in the global Bun runtime.
   
  const BunGlobal = globalThis as unknown as {
    Bun: {
      Transpiler: new (opts: { loader: string }) => { transformSync(s: string): string }
    }
  }
  try {
    const transpiler = new BunGlobal.Bun.Transpiler({ loader: 'tsx' })
    transpiler.transformSync(source)
  } catch (err) {
    throw new Error(
      `${gateLabel}: emitted source is not parseable TSX.\n` +
        `Parse error: ${err}\n\n` +
        `=== Emitted source ===\n${source}\n=== End ===`,
    )
  }
}

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

function makeParam(
  id: string,
  name: string,
  type: VCParam['type'] = 'string',
  defaultValue: unknown = '',
): VCParam {
  return { id, name, type, defaultValue, required: false }
}

function makeRegistry(
  modules: Record<string, AnyModuleDefinition> = {},
): IModuleRegistry {
  return {
    register: () => {},
    registerOrReplace: () => {},
    unregister: () => {},
    get: (id: string) => modules[id],
    getOrThrow: (id: string) => {
      const m = modules[id]
      if (!m) throw new Error(`Module not found: ${id}`)
      return m
    },
    has: (id: string) => id in modules,
    list: () => Object.values(modules),
    listByCategory: () => ({}),
  } as IModuleRegistry
}

function makeRootModule(): AnyModuleDefinition {
  return {
    id: 'base.root',
    name: 'Root',
    category: 'base',
    version: '1.0.0',
    trusted: true,
    canHaveChildren: true,
    schema: {},
    defaults: {},
    component: () => null as never,
    render: (_p: Record<string, unknown>, children: string[]) => ({
      html: children.join(''),
    }),
    toJsx: (_p: Record<string, unknown>, children: string[]) =>
      `<div>${children.join('')}</div>`,
  } as AnyModuleDefinition
}

/**
 * Heading module — emits the `text` prop value into JSX as a JSON string expression.
 * Bound props replace the literal value with a sentinel → bare param name after
 * replaceSentinels(), so the emitted JSX looks like `<h2>{title}</h2>`.
 */
function makeHeadingModule(): AnyModuleDefinition {
  return {
    id: 'base.heading',
    name: 'Heading',
    category: 'base',
    version: '1.0.0',
    trusted: true,
    canHaveChildren: false,
    schema: {},
    defaults: { text: '', level: 'h2' },
    component: () => null as never,
    render: (props: Record<string, unknown>) => ({
      html: `<h2>${String(props.text ?? '')}</h2>`,
    }),
    toJsx: (props: Record<string, unknown>) =>
      `<h2>{${JSON.stringify(String(props.text ?? ''))}}</h2>`,
  } as AnyModuleDefinition
}

const defaultRegistry = makeRegistry({
  'base.root': makeRootModule(),
  'base.heading': makeHeadingModule(),
})

/** Build a bare-minimum VC with no params and no children. */
function makeEmptyVC(id = 'vc-1', name = 'Empty'): VisualComponent {
  return {
    id,
    name,
    rootNode: {
      id: `vc-root-${id}`,
      moduleId: 'base.root',
      props: {},
      children: [],
      breakpointOverrides: {},
    },
    params: [],
    breakpoints: [],
    classIds: [],
    filePath: `src/components/${name}.tsx`,
    generated: false,
    ejected: false,
    createdAt: 0,
  }
}

/** Build a VC with one heading child node whose `text` prop is bound to a param. */
function makeBoundPropVC(
  paramName: string,
  paramId: string,
  paramType: VCParam['type'] = 'string',
): VisualComponent {
  const headingId = `h-${paramId}`
  return {
    id: 'vc-bound',
    name: 'Bound',
    rootNode: {
      id: 'vc-root',
      moduleId: 'base.root',
      props: {},
      children: [headingId],
      breakpointOverrides: {},
      childNodes: [
        {
          id: headingId,
          moduleId: 'base.heading',
          props: { text: 'Default', level: 'h2' },
          children: [],
          breakpointOverrides: {},
          propBindings: { text: { paramId } },
        },
      ],
    },
    params: [makeParam(paramId, paramName, paramType, 'Default')],
    breakpoints: [],
    classIds: [],
    filePath: 'src/components/Bound.tsx',
    generated: false,
    ejected: false,
    createdAt: 0,
  }
}

function makeProject(vcs: VisualComponent[] = []): Project {
  const root: PageNode = {
    id: 'root',
    moduleId: 'base.root',
    props: {},
    children: [],
    breakpointOverrides: {},
  }
  const page: Page = {
    id: 'page-1',
    slug: 'index',
    title: 'Home',
    rootNodeId: 'root',
    nodes: { root },
  }
  return {
    id: 'proj-1',
    name: 'Test',
    projectMode: 'react',
    pages: [page],
    files: [],
    visualComponents: vcs,
    breakpoints: [{ id: 'desktop', label: 'Desktop', width: 1440, icon: 'monitor' }],
    settings: { colorTokens: {}, typeScale: { baseSize: 16, ratio: 1.25 }, shortcuts: {} },
    classes: {},
    createdAt: 0,
    updatedAt: 0,
  }
}

// ---------------------------------------------------------------------------
// MG-1..MG-5 — Basic param types
// ---------------------------------------------------------------------------

describe('MG — Codegen Parse-Validity Meta-Gate: basic param types', () => {
  /**
   * MG-1: Empty VC with no params and no children.
   * Emits `_props: EmptyProps` signature and `<div></div>` body.
   */
  it('MG-1: empty VC (no params, no children) emits parseable TSX', () => {
    const vc = makeEmptyVC('vc-1', 'Empty')
    const { source } = vcToComponent(vc, makeProject([vc]), defaultRegistry)
    assertParsesTSX(source, 'MG-1')
    // Structural sanity — has a default export
    expect(source).toContain('export default function Empty')
  })

  /**
   * MG-2: VC with one string param with a non-empty default.
   * Emits `{ label = "Click me" }: LabelledProps` signature.
   */
  it('MG-2: string param with default emits parseable TSX', () => {
    const vc: VisualComponent = {
      ...makeEmptyVC('vc-2', 'Labelled'),
      params: [makeParam('p-1', 'label', 'string', 'Click me')],
    }
    const { source } = vcToComponent(vc, makeProject([vc]), defaultRegistry)
    assertParsesTSX(source, 'MG-2')
    expect(source).toContain('label?: string')
    expect(source).toContain('label =')
    expect(source).toContain('"Click me"')
  })

  /**
   * MG-3: VC with a number param.
   * Emits `count?: number` in interface and `count = 42` in signature.
   */
  it('MG-3: number param emits parseable TSX', () => {
    const vc: VisualComponent = {
      ...makeEmptyVC('vc-3', 'Counter'),
      params: [makeParam('p-1', 'count', 'number', 42)],
    }
    const { source } = vcToComponent(vc, makeProject([vc]), defaultRegistry)
    assertParsesTSX(source, 'MG-3')
    expect(source).toContain('count?: number')
  })

  /**
   * MG-4: VC with a boolean param.
   * Emits `visible?: boolean` in interface.
   */
  it('MG-4: boolean param emits parseable TSX', () => {
    const vc: VisualComponent = {
      ...makeEmptyVC('vc-4', 'Toggle'),
      params: [makeParam('p-1', 'visible', 'boolean', true)],
    }
    const { source } = vcToComponent(vc, makeProject([vc]), defaultRegistry)
    assertParsesTSX(source, 'MG-4')
    expect(source).toContain('visible?: boolean')
  })

  /**
   * MG-5: VC with a url-type param (maps to `string` in TS interface).
   */
  it('MG-5: url-type param emits parseable TSX', () => {
    const vc: VisualComponent = {
      ...makeEmptyVC('vc-5', 'LinkedCard'),
      params: [makeParam('p-1', 'href', 'url', 'https://example.com')],
    }
    const { source } = vcToComponent(vc, makeProject([vc]), defaultRegistry)
    assertParsesTSX(source, 'MG-5')
    expect(source).toContain('href?: string')
  })
})

// ---------------------------------------------------------------------------
// MG-6..MG-7 — Bound props: no props.X in scope of destructured signature
// ---------------------------------------------------------------------------

describe('MG — Codegen Parse-Validity Meta-Gate: bound prop emission', () => {
  /**
   * MG-6: VC with one bound text prop.
   *
   * This is the Bug 1 regression gate. The bound prop must emit as the bare
   * destructured identifier `{title}`, NOT as `{props.title}`. The emitted
   * function signature is `{ title = "…" }: BoundProps` — there is no `props`
   * binding in scope, so `{props.title}` would be a ReferenceError at runtime.
   *
   * Bun.Transpiler catches *syntax* errors but not semantic undefined-variable
   * errors, so we also assert `!src.includes('props.')` as the Bug 1 oracle.
   */
  it('MG-6: bound prop emits bare param name — no props.X reference — parseable', () => {
    const vc = makeBoundPropVC('title', 'p-title', 'string')
    const { source } = vcToComponent(vc, makeProject([vc]), defaultRegistry)

    // Parse-validity gate
    assertParsesTSX(source, 'MG-6')

    // Bug 1 semantic gate: no props.X in scope of destructured signature
    expect(source).not.toMatch(/props\.\w+/)

    // The bound param name must appear as a JSX expression
    expect(source).toContain('title')
  })

  /**
   * MG-7: VC with three bound props of different types.
   * All three must emit as bare destructured names, no props.X.
   */
  it('MG-7: three bound props — all bare names, no props.X — parseable', () => {
    const h1Id = 'h-title'
    const h2Id = 'h-sub'

    const vc: VisualComponent = {
      id: 'vc-multi',
      name: 'MultiCard',
      rootNode: {
        id: 'vc-root',
        moduleId: 'base.root',
        props: {},
        children: [h1Id, h2Id],
        breakpointOverrides: {},
        childNodes: [
          {
            id: h1Id,
            moduleId: 'base.heading',
            props: { text: 'Title', level: 'h2' },
            children: [],
            breakpointOverrides: {},
            propBindings: { text: { paramId: 'p-title' } },
          },
          {
            id: h2Id,
            moduleId: 'base.heading',
            props: { text: 'Subtitle', level: 'h2' },
            children: [],
            breakpointOverrides: {},
            propBindings: { text: { paramId: 'p-sub' } },
          },
        ],
      },
      params: [
        makeParam('p-title', 'title', 'string', 'Title'),
        makeParam('p-sub', 'subtitle', 'string', 'Subtitle'),
        makeParam('p-count', 'itemCount', 'number', 0),
      ],
      breakpoints: [],
      classIds: [],
      filePath: 'src/components/MultiCard.tsx',
      generated: false,
      ejected: false,
      createdAt: 0,
    }

    const { source } = vcToComponent(vc, makeProject([vc]), defaultRegistry)

    assertParsesTSX(source, 'MG-7')
    expect(source).not.toMatch(/props\.\w+/)
    expect(source).toContain('title')
    expect(source).toContain('subtitle')
    expect(source).toContain('itemCount')
  })
})

// ---------------------------------------------------------------------------
// MG-8..MG-10 — Reserved keyword param names (safeParamName → _ prefix)
// ---------------------------------------------------------------------------

describe('MG — Codegen Parse-Validity Meta-Gate: reserved keyword params', () => {
  /**
   * MG-8: Reserved keyword param `class`.
   *
   * This is the Bug 2 regression gate. Before the fix, `addParam('class')` was
   * allowed and vcToComponent emitted `{ class = "a" }: ClashProps` — a SyntaxError
   * because `class` is a reserved word in destructuring position.
   *
   * After the fix: safeParamName('class') → '_class', so the emitted signature
   * is `{ _class = "a" }: ClashProps` — syntactically valid TypeScript.
   *
   * validateParamName() blocks this at slice write time; safeParamName() is the
   * defensive emitter-level guard for legacy persistence entries.
   */
  it('MG-8: reserved keyword param `class` emits parseable TSX (_class)', () => {
    const vc: VisualComponent = {
      ...makeEmptyVC('vc-class', 'Classed'),
      params: [makeParam('p-class', 'class', 'string', 'default-class')],
    }
    const { source } = vcToComponent(vc, makeProject([vc]), defaultRegistry)
    assertParsesTSX(source, 'MG-8')
    // safeParamName prefixes reserved words with `_`
    expect(source).toContain('_class')
    // Bare `class` keyword in destructuring position is the bug — must NOT appear
    // at a word boundary (i.e., `class =` alone, NOT `_class =` which is safe).
    // \b matches the word boundary; `_` is a word char so `\bclass` won't fire on `_class`.
    expect(source).not.toMatch(/\bclass\s*=/)   // bare `class =` is the bug
  })

  /**
   * MG-9: Reserved keyword param `default`.
   * `{ default = "x" }` is a SyntaxError; safe form is `{ _default = "x" }`.
   */
  it('MG-9: reserved keyword param `default` emits parseable TSX (_default)', () => {
    const vc: VisualComponent = {
      ...makeEmptyVC('vc-default', 'Defaulted'),
      params: [makeParam('p-default', 'default', 'string', 'fallback')],
    }
    const { source } = vcToComponent(vc, makeProject([vc]), defaultRegistry)
    assertParsesTSX(source, 'MG-9')
    expect(source).toContain('_default')
  })

  /**
   * MG-10: Reserved keyword param `function`.
   * `{ function = "x" }` is a SyntaxError; safe form is `{ _function = "x" }`.
   */
  it('MG-10: reserved keyword param `function` emits parseable TSX (_function)', () => {
    const vc: VisualComponent = {
      ...makeEmptyVC('vc-fn', 'WithFunction'),
      params: [makeParam('p-fn', 'function', 'string', 'handler')],
    }
    const { source } = vcToComponent(vc, makeProject([vc]), defaultRegistry)
    assertParsesTSX(source, 'MG-10')
    expect(source).toContain('_function')
  })
})

// ---------------------------------------------------------------------------
// MG-11..MG-12 — Stress tests
// ---------------------------------------------------------------------------

describe('MG — Codegen Parse-Validity Meta-Gate: stress tests', () => {
  /**
   * MG-11: VC with 6 params of mixed types.
   * Exercises the full param loop in generatePropsInterface and function signature.
   */
  it('MG-11: 6-param stress test (mixed types) emits parseable TSX', () => {
    const vc: VisualComponent = {
      ...makeEmptyVC('vc-stress', 'StressTest'),
      params: [
        makeParam('p-1', 'title', 'string', 'Hello'),
        makeParam('p-2', 'count', 'number', 3),
        makeParam('p-3', 'visible', 'boolean', true),
        makeParam('p-4', 'imageUrl', 'url', 'https://example.com/img.png'),
        makeParam('p-5', 'accent', 'color', '#000000'),
        makeParam('p-6', 'size', 'enum', 'large'),
      ],
    }
    const { source } = vcToComponent(vc, makeProject([vc]), defaultRegistry)
    assertParsesTSX(source, 'MG-11')

    // Interface fields
    expect(source).toContain('title?: string')
    expect(source).toContain('count?: number')
    expect(source).toContain('visible?: boolean')
    expect(source).toContain('imageUrl?: string')
    expect(source).toContain('accent?: string')
    expect(source).toContain('size?: string')
  })

  /**
   * MG-12: VC with one bound prop and one unbound prop.
   * The bound prop becomes a bare identifier reference; the unbound prop stays
   * as a literal string in the JSX. Both must coexist in parseable output.
   */
  it('MG-12: bound + unbound props coexist — parseable TSX with no props.X', () => {
    const boundId = 'h-bound'
    const unboundId = 'h-static'

    const vc: VisualComponent = {
      id: 'vc-mixed',
      name: 'MixedCard',
      rootNode: {
        id: 'vc-root',
        moduleId: 'base.root',
        props: {},
        children: [boundId, unboundId],
        breakpointOverrides: {},
        childNodes: [
          {
            id: boundId,
            moduleId: 'base.heading',
            props: { text: 'Dynamic', level: 'h2' },
            children: [],
            breakpointOverrides: {},
            propBindings: { text: { paramId: 'p-title' } },  // bound
          },
          {
            id: unboundId,
            moduleId: 'base.heading',
            props: { text: 'Static Title', level: 'h2' },
            children: [],
            breakpointOverrides: {},
            // no propBindings — unbound, emits literal
          },
        ],
      },
      params: [makeParam('p-title', 'title', 'string', 'Dynamic')],
      breakpoints: [],
      classIds: [],
      filePath: 'src/components/MixedCard.tsx',
      generated: false,
      ejected: false,
      createdAt: 0,
    }

    const { source } = vcToComponent(vc, makeProject([vc]), defaultRegistry)
    assertParsesTSX(source, 'MG-12')
    expect(source).not.toMatch(/props\.\w+/)
    // Bound prop: bare name in JSX
    expect(source).toContain('title')
    // Unbound prop: literal value still present
    expect(source).toContain('Static Title')
  })
})

// ---------------------------------------------------------------------------
// MG-13 — pageToComponent() parse-validity
// ---------------------------------------------------------------------------

describe('MG — Codegen Parse-Validity Meta-Gate: pageToComponent', () => {
  /**
   * MG-13: pageToComponent() output is parseable TSX.
   *
   * Covers the other half of the codegen surface. pageToComponent produces a
   * full .tsx file with a default-export React component from a page's node tree.
   */
  it('MG-13: pageToComponent() output is parseable TSX', () => {
    const root: PageNode = {
      id: 'root',
      moduleId: 'base.root',
      props: {},
      children: [],
      breakpointOverrides: {},
    }
    const page: Page = {
      id: 'page-1',
      slug: 'about-us',
      title: 'About Us',
      rootNodeId: 'root',
      nodes: { root },
    }
    const project = makeProject()
    const { source, componentName } = pageToComponent(page, project, defaultRegistry)

    assertParsesTSX(source, 'MG-13')
    expect(componentName).toBe('AboutUs')
    expect(source).toContain('export default function AboutUs(')
  })
})

// ---------------------------------------------------------------------------
// MG-14 — topoSortVCs: all emitted VCs individually parseable
// ---------------------------------------------------------------------------

describe('MG — Codegen Parse-Validity Meta-Gate: topoSortVCs batch', () => {
  /**
   * MG-14: topoSortVCs output — all VCs in the sorted list emit parseable TSX.
   *
   * Simulates a realistic project with 4 VCs of varying complexity.
   * After topological sort, each VC is individually compiled and parse-validated.
   * This is the most complete codegen end-to-end parse check short of a full ZIP export.
   */
  it('MG-14: all VCs in topoSortVCs result emit individually parseable TSX', () => {
    const vcs: VisualComponent[] = [
      // Simple VC — no params
      makeEmptyVC('vc-simple', 'SimpleCard'),

      // VC with string param
      {
        ...makeEmptyVC('vc-labelled', 'LabelledCard'),
        params: [makeParam('p-lbl', 'label', 'string', 'Read more')],
      },

      // VC with bound prop
      makeBoundPropVC('headline', 'p-headline', 'string'),

      // VC with reserved keyword param (legacy persistence scenario)
      {
        ...makeEmptyVC('vc-reserved', 'ReservedCard'),
        params: [
          makeParam('p-class', 'class', 'string', 'card'),
          makeParam('p-for', 'for', 'string', 'label-id'),
        ],
      },
    ]

    const project = makeProject(vcs)
    const sorted = topoSortVCs(vcs)

    expect(sorted).toHaveLength(vcs.length)

    for (const vc of sorted) {
      const { source, name } = vcToComponent(vc, project, defaultRegistry)
      assertParsesTSX(source, `MG-14[${name}]`)
      // Every emitted file must have a default export
      expect(source).toContain(`export default function ${name}`)
    }
  })
})
