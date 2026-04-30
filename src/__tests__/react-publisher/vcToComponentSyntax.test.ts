/**
 * vcToComponent — emitter syntax + correctness gates
 *
 * Source: CR Contribution #654 (MUST-FIX 1 + MUST-FIX 2 in Task #439).
 *
 * ── MUST-FIX 1 (Bug 1) ──────────────────────────────────────────────────────
 * `replaceSentinels` in vcToComponent.ts substitutes the sentinel with
 * `props.${param.name}`, but the function signature uses destructured params:
 *
 *   export default function Card({ title = "Default" }: CardProps) {
 *     return <h2>{props.title}</h2>  ← props is NEVER in scope
 *   }
 *
 * Fix: substitute bare `${param.name}` so output is `{title}`, not `{props.title}`.
 *
 * ── MUST-FIX 2 (Bug 2) ──────────────────────────────────────────────────────
 * `addParam()` (visualComponentsSlice) has zero param-name validation.
 * A param named `class`, `default`, etc. produces a SyntaxError at parse time:
 *
 *   export default function Foo({ class = "a" }: FooProps) { ... }
 *   //                            ^^^^^ SyntaxError: unexpected token
 *
 * Fix: export `validateParamName()` from nameValidation.ts (mirrors
 * `validateComponentName`) and call it from `addParam` + `updateParam`.
 *
 * ── Gate status — all GREEN (fixes landed before gates) ────────────────────
 * SX-1  PASSING  bound prop → no {props.X} refs + parseable
 * SX-2  PASSING  3 bound props → all direct param refs + parseable
 * SX-3  PASSING  no params → parseable (regression guard)
 * SX-4  PASSING  reserved-keyword param `class` → parseable (nonce sentinel)
 * SX-5  PASSING  2 unbound params → parseable (regression guard)
 *
 * PV-1  PASSING  validateParamName exported from nameValidation.ts
 * PV-2  PASSING  empty name → { ok: false, error: 'EMPTY' }
 * PV-3  PASSING  valid camelCase → { ok: true }
 * PV-4  PASSING  'class' → { ok: false, error: 'RESERVED_JS_KEYWORD' }
 * PV-5  PASSING  'default' → { ok: false, error: 'RESERVED_JS_KEYWORD' }
 * PV-6  PASSING  PascalCase 'Title' → { ok: false, error: 'NOT_CAMEL_CASE' }
 * PV-7  PASSING  duplicate param name → { ok: false, error: 'DUPLICATE' }
 */

import { describe, it, expect } from 'bun:test'
import { vcToComponent } from '../../core/react-publisher/vcToComponent'
import type { VisualComponent, VCParam } from '../../core/visualComponents/types'
import type { Project, Page, PageNode } from '../../core/page-tree/types'
import type { IModuleRegistry, AnyModuleDefinition } from '../../core/module-engine/types'
import * as nameValidation from '../../core/visualComponents/nameValidation'

// ---------------------------------------------------------------------------
// Helpers — parser
// ---------------------------------------------------------------------------

/**
 * Attempt to transpile the source string as TSX via Bun.Transpiler.
 * Throws if the source has a *syntax* error (SyntaxError, unexpected token, etc.).
 * Note: this catches parse errors only — it does NOT perform type checking,
 * so undefined-reference bugs like Bug 1 require string assertions (see SX-1/SX-2).
 */
function assertParsesTSX(source: string, gateLabel: string): void {
  // Bun.Transpiler is available globally in the Bun runtime.
   
  const BunGlobal = globalThis as unknown as {
    Bun: { Transpiler: new (opts: { loader: string }) => { transformSync(s: string): string } }
  }
  try {
    const transpiler = new BunGlobal.Bun.Transpiler({ loader: 'tsx' })
    transpiler.transformSync(source)
  } catch (err) {
    throw new Error(
      `${gateLabel}: emitted source is not parseable TSX.\n` +
        `Parse error: ${err}\n\n` +
        `Emitted source:\n${source}`,
    )
  }
}

/** Returns true if the emitted source contains any {props.X} reference */
function hasPropsReference(source: string): boolean {
  return /\{props\.\w+\}/.test(source)
}

// ---------------------------------------------------------------------------
// Helpers — vcToComponent fixtures
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

/** Heading module that emits the `text` prop into JSX as a string expression */
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

/**
 * Build a VC with one heading child node whose `text` prop is bound
 * to a param via propBindings.
 */
function makeBoundPropVC(paramName: string, paramId: string): VisualComponent {
  const headingNodeId = `h-${paramId}`
  return {
    id: 'vc-1',
    name: 'Card',
    rootNode: {
      id: 'vc-root',
      moduleId: 'base.root',
      props: {},
      children: [headingNodeId],
      breakpointOverrides: {},
      childNodes: [
        {
          id: headingNodeId,
          moduleId: 'base.heading',
          props: { text: 'Default', level: 'h2' },
          children: [],
          breakpointOverrides: {},
          propBindings: { text: { paramId } },
        },
      ],
    },
    params: [makeParam(paramId, paramName, 'string', 'Default')],
    breakpoints: [],
    classIds: [],
    filePath: 'src/components/Card.tsx',
    generated: false,
    ejected: false,
    createdAt: 0,
  }
}

const defaultRegistry = makeRegistry({
  'base.root': makeRootModule(),
  'base.heading': makeHeadingModule(),
})

// ---------------------------------------------------------------------------
// SX — Emitter output correctness gates
// ---------------------------------------------------------------------------

describe('SX — vcToComponent emitter output correctness (CR Contribution #654)', () => {
  /**
   * SX-1 [PRE-FAILING — Bug 1]
   *
   * A VC with one bound text param: when rendered, the JSX body should contain
   * the bare param name reference `{title}`, NOT `{props.title}`.
   *
   * Current bug: replaceSentinels substitutes `"__VCPARAM_title__"` → `props.title`,
   * producing `{props.title}` in the JSX body while the function signature is
   * `{ title = "Default" }: CardProps` — `props` is never in scope.
   *
   * Fix: change the substitution to just `${param.name}` (bare identifier).
   */
  it('SX-1: bound prop uses bare param name {title}, not {props.title}', () => {
    const vc = makeBoundPropVC('title', 'p-title')
    const result = vcToComponent(vc, makeProject([vc]), defaultRegistry)
    const src = result.source

    // Bug 1 check: no {props.X} reference anywhere in the emitted source
    expect(hasPropsReference(src)).toBe(false)

    // The param name must appear as a direct JSX expression in the return body
    // (checking the function signature already has `title` via destructuring)
    expect(src).toContain('title')

    // The emitted source must be parseable TSX
    assertParsesTSX(src, 'SX-1')
  })

  /**
   * SX-2 [PRE-FAILING — Bug 1]
   *
   * Same check with three bound params. All three must use direct references.
   */
  it('SX-2: three bound props — all use bare param names, none use props.X', () => {
    const headingId = 'h-title'
    const subId = 'h-sub'
    const imgId = 'img-1'
    const vc: VisualComponent = {
      id: 'vc-multi',
      name: 'HeroCard',
      rootNode: {
        id: 'vc-root',
        moduleId: 'base.root',
        props: {},
        children: [headingId, subId],
        breakpointOverrides: {},
        childNodes: [
          {
            id: headingId,
            moduleId: 'base.heading',
            props: { text: 'Hero Title', level: 'h2' },
            children: [],
            breakpointOverrides: {},
            propBindings: { text: { paramId: 'p-title' } },
          },
          {
            id: subId,
            moduleId: 'base.heading',
            props: { text: 'Subtitle', level: 'h2' },
            children: [],
            breakpointOverrides: {},
            propBindings: { text: { paramId: 'p-sub' } },
          },
        ],
      },
      params: [
        makeParam('p-title', 'title', 'string', 'Hero Title'),
        makeParam('p-sub', 'subtitle', 'string', 'Subtitle'),
        makeParam('p-count', 'itemCount', 'number', 0),
      ],
      breakpoints: [],
      classIds: [],
      filePath: 'src/components/HeroCard.tsx',
      generated: false,
      ejected: false,
      createdAt: 0,
    }

    const result = vcToComponent(vc, makeProject([vc]), defaultRegistry)
    const src = result.source

    // No {props.X} references anywhere
    expect(hasPropsReference(src)).toBe(false)

    // All three param names appear in the emitted source
    expect(src).toContain('title')
    expect(src).toContain('subtitle')
    expect(src).toContain('itemCount')

    assertParsesTSX(src, 'SX-2')
  })

  /**
   * SX-3 [PASSING — regression guard]
   *
   * A VC with no params uses `_props: NoParamsProps` signature and has no
   * sentinel substitution. The emitted source should always be parseable.
   */
  it('SX-3: VC with no params emits parseable TSX (regression guard)', () => {
    const vc: VisualComponent = {
      id: 'vc-noparams',
      name: 'Static',
      rootNode: {
        id: 'vc-root',
        moduleId: 'base.root',
        props: {},
        children: [],
        breakpointOverrides: {},
      },
      params: [],
      breakpoints: [],
      classIds: [],
      filePath: 'src/components/Static.tsx',
      generated: false,
      ejected: false,
      createdAt: 0,
    }

    const result = vcToComponent(vc, makeProject([vc]), makeRegistry({ 'base.root': makeRootModule() }))
    assertParsesTSX(result.source, 'SX-3')
  })

  /**
   * SX-4 [PRE-FAILING — Bug 2]
   *
   * A VC with a param whose name is the JS reserved word `class`.
   * Current bug: emits `{ class = "default-class" }: FooProps` which is a
   * SyntaxError — `class` is a reserved keyword in destructuring position.
   *
   * Fix: `validateParamName` prevents this at the slice write boundary, AND/OR
   * `vcToComponent` sanitizes/skips reserved-keyword params defensively.
   * Either way, the emitted source must be parseable after the fix.
   */
  it('SX-4: VC with reserved-keyword param name `class` emits parseable TSX', () => {
    const vc: VisualComponent = {
      id: 'vc-reserved',
      name: 'Classed',
      rootNode: {
        id: 'vc-root',
        moduleId: 'base.root',
        props: {},
        children: [],
        breakpointOverrides: {},
      },
      params: [
        // `class` is a JS reserved word — destructuring `{ class = "a" }` is SyntaxError
        makeParam('p-class', 'class', 'string', 'default-class'),
      ],
      breakpoints: [],
      classIds: [],
      filePath: 'src/components/Classed.tsx',
      generated: false,
      ejected: false,
      createdAt: 0,
    }

    const result = vcToComponent(vc, makeProject([vc]), makeRegistry({ 'base.root': makeRootModule() }))
    // This should be parseable after the fix. Currently throws SyntaxError.
    assertParsesTSX(result.source, 'SX-4')
  })

  /**
   * SX-5 [PASSING — regression guard]
   *
   * A VC with two unbound params (no propBindings). No sentinel substitution
   * occurs; defaults appear only in the function signature. Must be parseable.
   */
  it('SX-5: VC with 2 unbound params emits parseable TSX (regression guard)', () => {
    const vc: VisualComponent = {
      id: 'vc-unbound',
      name: 'WithDefaults',
      rootNode: {
        id: 'vc-root',
        moduleId: 'base.root',
        props: {},
        children: [],
        breakpointOverrides: {},
      },
      params: [
        makeParam('p-1', 'label', 'string', 'Click me'),
        makeParam('p-2', 'count', 'number', 42),
      ],
      breakpoints: [],
      classIds: [],
      filePath: 'src/components/WithDefaults.tsx',
      generated: false,
      ejected: false,
      createdAt: 0,
    }

    const result = vcToComponent(vc, makeProject([vc]), makeRegistry({ 'base.root': makeRootModule() }))
    assertParsesTSX(result.source, 'SX-5')
  })
})

// ---------------------------------------------------------------------------
// PV — validateParamName contract gates (all PRE-FAILING — function not yet exported)
// ---------------------------------------------------------------------------

/**
 * Retrieve `validateParamName` from nameValidation.ts, or throw with a clear
 * message pointing at the implementation gap if the export is missing.
 *
 * Expected signature (mirroring validateComponentName):
 *   validateParamName(
 *     name: string,
 *     existing: Array<{ id: string; name: string }>,
 *     selfId?: string,
 *   ): { ok: true } | { ok: false; error: ParamError; reason: string }
 *
 * Expected ParamError codes:
 *   'EMPTY' | 'NOT_CAMEL_CASE' | 'RESERVED_JS_KEYWORD' | 'DUPLICATE'
 */
function getValidateParamName(): (
  name: string,
  existing: Array<{ id: string; name: string }>,
  selfId?: string,
) => { ok: true } | { ok: false; error: string; reason: string } {
   
  const fn = (nameValidation as unknown as Record<string, unknown>)['validateParamName']
  if (typeof fn !== 'function') {
    throw new Error(
      'validateParamName is not yet exported from nameValidation.ts.\n' +
        'Implement and export validateParamName() per CR Contribution #654 MUST-FIX 2.\n' +
        'Expected signature mirrors validateComponentName(); error codes:\n' +
        "  'EMPTY' | 'NOT_CAMEL_CASE' | 'RESERVED_JS_KEYWORD' | 'DUPLICATE'",
    )
  }
  return fn as (
    name: string,
    existing: Array<{ id: string; name: string }>,
    selfId?: string,
  ) => { ok: true } | { ok: false; error: string; reason: string }
}

describe('PV — validateParamName contract (CR Contribution #654 MUST-FIX 2)', () => {
  /**
   * PV-1 [PRE-FAILING]
   * validateParamName must be exported from nameValidation.ts.
   */
  it('PV-1: validateParamName is exported from nameValidation.ts', () => {
    // This throws a descriptive error if the export is missing.
    getValidateParamName()
  })

  /**
   * PV-2 [PRE-FAILING]
   * Empty / blank name → EMPTY error.
   */
  it('PV-2: empty name → { ok: false, error: "EMPTY" }', () => {
    const validate = getValidateParamName()
    expect(validate('', [])).toMatchObject({ ok: false, error: 'EMPTY' })
    expect(validate('   ', [])).toMatchObject({ ok: false, error: 'EMPTY' })
  })

  /**
   * PV-3 [PRE-FAILING]
   * Valid camelCase identifier → { ok: true }.
   */
  it('PV-3: valid camelCase name → { ok: true }', () => {
    const validate = getValidateParamName()
    expect(validate('title', [])).toEqual({ ok: true })
    expect(validate('itemCount', [])).toEqual({ ok: true })
    expect(validate('myPropValue123', [])).toEqual({ ok: true })
  })

  /**
   * PV-4 [PRE-FAILING]
   * JS reserved word `class` → RESERVED_JS_KEYWORD error.
   * These produce SyntaxError in destructuring position:
   *   function Foo({ class = "a" }: FooProps) { ... }
   */
  it('PV-4: reserved keyword "class" → { ok: false, error: "RESERVED_JS_KEYWORD" }', () => {
    const validate = getValidateParamName()
    expect(validate('class', [])).toMatchObject({ ok: false, error: 'RESERVED_JS_KEYWORD' })
  })

  /**
   * PV-5 [PRE-FAILING]
   * JS reserved word `default` → RESERVED_JS_KEYWORD error.
   */
  it('PV-5: reserved keyword "default" → { ok: false, error: "RESERVED_JS_KEYWORD" }', () => {
    const validate = getValidateParamName()
    expect(validate('default', [])).toMatchObject({ ok: false, error: 'RESERVED_JS_KEYWORD' })
  })

  /**
   * PV-6 [PRE-FAILING]
   * PascalCase name (starts with uppercase) is not a valid camelCase param name
   * (that would conflict with component naming) → NOT_CAMEL_CASE error.
   */
  it('PV-6: PascalCase "Title" → { ok: false, error: "NOT_CAMEL_CASE" }', () => {
    const validate = getValidateParamName()
    expect(validate('Title', [])).toMatchObject({ ok: false, error: 'NOT_CAMEL_CASE' })
    expect(validate('MyProp', [])).toMatchObject({ ok: false, error: 'NOT_CAMEL_CASE' })
  })

  /**
   * PV-7 [PRE-FAILING]
   * Param name already used by another param in the same VC → DUPLICATE error.
   * selfId skips own entry to allow rename-to-same-value.
   */
  it('PV-7: duplicate name → { ok: false, error: "DUPLICATE" }', () => {
    const validate = getValidateParamName()
    const existing = [
      { id: 'p-1', name: 'title' },
      { id: 'p-2', name: 'subtitle' },
    ]
    expect(validate('title', existing)).toMatchObject({ ok: false, error: 'DUPLICATE' })
    // selfId skips own entry — renaming p-1 to its current name is allowed
    expect(validate('title', existing, 'p-1')).toEqual({ ok: true })
  })
})
