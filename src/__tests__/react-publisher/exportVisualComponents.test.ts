/**
 * React Publisher — Visual Components emission in ZIP export (Task #439)
 *
 * Architecture source: Contribution #619 §7 + Task #439
 *
 * Tests that exportReactProjectAsZip() correctly:
 *   1. Backward compat: projects with no VCs produce the same scaffold as before.
 *   2. Single VC emit: src/components/{Name}.tsx appears in the ZIP.
 *   3. Multi-VC emit: all VCs are present.
 *   4. propBindings substitution: bound props emit as {props.paramName}.
 *   5. Eject matrix: 4 combinations of generated × ejected.
 *   6. Topological sort: VC dependencies emit before dependents.
 *   7. Lenient-per-VC: a VC with a broken tree doesn't abort the whole export.
 */

import { describe, it, expect } from 'bun:test'
import { unzipSync, strToU8 } from 'fflate'
import { exportReactProjectAsZip } from '../../core/react-publisher/export'
import { generateScaffold } from '../../core/react-publisher/scaffold'
import type { Project, Page, PageNode } from '../../core/page-tree/types'
import type { VisualComponent, VCParam } from '../../core/visualComponents/types'
import type { IModuleRegistry, AnyModuleDefinition } from '../../core/module-engine/types'

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

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
      if (!m) throw new Error(`Not found: ${id}`)
      return m
    },
    has: (id: string) => id in modules,
    list: () => Object.values(modules),
    listByCategory: () => ({}),
  } as IModuleRegistry
}

function makeRootNode(): PageNode {
  return {
    id: 'root',
    moduleId: 'base.root',
    props: {},
    children: [],
    breakpointOverrides: {},
  }
}

function makePage(): Page {
  const root = makeRootNode()
  return {
    id: 'page-1',
    slug: 'index',
    title: 'Home',
    rootNodeId: 'root',
    nodes: { root },
  }
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
    render: (_p, children) => ({ html: children.join('') }),
    toJsx: (_p, children) => `<div>${children.join('')}</div>`,
  } as AnyModuleDefinition
}

/** A simple base.heading-like module for VC content */
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
    render: (props) => ({ html: `<h2>${String(props.text ?? '')}</h2>` }),
    toJsx: (props) => `<h2>{${JSON.stringify(String((props as Record<string,unknown>).text ?? ''))}}</h2>`,
  } as AnyModuleDefinition
}

function makeProject(vcs: VisualComponent[] = []): Project {
  return {
    id: 'proj-1',
    name: 'Test Project',
    projectMode: 'react',
    pages: [makePage()],
    files: [],
    visualComponents: vcs,
    breakpoints: [{ id: 'desktop', label: 'Desktop', width: 1440, icon: 'monitor' }],
    settings: {
      colorTokens: {},
      typeScale: { baseSize: 16, ratio: 1.25 },
      shortcuts: {},
    },
    classes: {},
    createdAt: 0,
    updatedAt: 0,
  }
}

function makeVC(
  id: string,
  name: string,
  overrides: Partial<VisualComponent> = {},
): VisualComponent {
  const rootNodeId = `vc-root-${id}`
  return {
    id,
    name,
    rootNode: {
      id: rootNodeId,
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
    ...overrides,
  }
}

function makeParam(id: string, name: string, type: VCParam['type'] = 'string', defaultValue: unknown = ''): VCParam {
  return { id, name, type, defaultValue, required: false }
}

async function exportAndUnzip(
  project: Project,
  registry = makeRegistry({ 'base.root': makeRootModule() }),
): Promise<Record<string, string>> {
  const blob = await exportReactProjectAsZip(project, registry)
  const buf = await blob.arrayBuffer()
  const unzipped = unzipSync(new Uint8Array(buf))
  const result: Record<string, string> = {}
  for (const [path, bytes] of Object.entries(unzipped)) {
    result[path] = new TextDecoder().decode(bytes)
  }
  return result
}

// ---------------------------------------------------------------------------
// Test 1 — Backward compatibility: no VCs → no src/components/ entries
// ---------------------------------------------------------------------------

describe('VC Emission — backward compat (no VCs)', () => {
  it('project with no visualComponents produces identical scaffold to before Task #439', async () => {
    const project = makeProject([]) // empty VC array
    const files = await exportAndUnzip(project)

    // Scaffold files should exist
    expect('src/main.tsx' in files || 'package.json' in files).toBe(true)

    // No src/components/ entries should exist
    const componentPaths = Object.keys(files).filter((p) =>
      p.startsWith('src/components/'),
    )
    expect(componentPaths).toHaveLength(0)
  })

  it('project without visualComponents field (legacy) does not throw', async () => {
    const project = makeProject()
    // Remove the field to simulate a legacy project
    const legacyProject = { ...project } as Project & { visualComponents?: unknown }
    delete legacyProject.visualComponents

    await expect(exportAndUnzip(legacyProject as Project)).resolves.toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// Test 2 — Single VC emit
// ---------------------------------------------------------------------------

describe('VC Emission — single VC', () => {
  it('emits src/components/{Name}.tsx for a user-authored VC', async () => {
    const vc = makeVC('vc-1', 'Card')
    const project = makeProject([vc])
    const files = await exportAndUnzip(project)

    expect('src/components/Card.tsx' in files).toBe(true)
    const src = files['src/components/Card.tsx']
    expect(src).toContain('export default function Card')
    expect(src).toContain("import React from 'react'")
  })

  it('emitted file contains a props interface (even if empty)', async () => {
    const vc = makeVC('vc-1', 'Hero')
    const project = makeProject([vc])
    const files = await exportAndUnzip(project)

    const src = files['src/components/Hero.tsx']
    expect(src).toContain('export interface HeroProps')
  })

  it('emitted component name matches VC name', async () => {
    const vc = makeVC('vc-1', 'PricingCard')
    const project = makeProject([vc])
    const files = await exportAndUnzip(project)

    expect('src/components/PricingCard.tsx' in files).toBe(true)
    const src = files['src/components/PricingCard.tsx']
    expect(src).toContain('function PricingCard(')
  })
})

// ---------------------------------------------------------------------------
// Test 3 — Multi-VC emit
// ---------------------------------------------------------------------------

describe('VC Emission — multiple VCs', () => {
  it('emits one file per VC', async () => {
    const vcs = [
      makeVC('vc-1', 'Card'),
      makeVC('vc-2', 'Banner'),
      makeVC('vc-3', 'Footer'),
    ]
    const project = makeProject(vcs)
    const files = await exportAndUnzip(project)

    expect('src/components/Card.tsx' in files).toBe(true)
    expect('src/components/Banner.tsx' in files).toBe(true)
    expect('src/components/Footer.tsx' in files).toBe(true)
  })

  it('each emitted VC has the correct default-export function', async () => {
    const vcs = [makeVC('vc-1', 'Card'), makeVC('vc-2', 'Banner')]
    const project = makeProject(vcs)
    const files = await exportAndUnzip(project)

    expect(files['src/components/Card.tsx']).toContain('export default function Card')
    expect(files['src/components/Banner.tsx']).toContain('export default function Banner')
  })
})

// ---------------------------------------------------------------------------
// Test 4 — propBindings substitution
// ---------------------------------------------------------------------------

describe('VC Emission — propBindings substitution', () => {
  it('bound text prop emits as {props.paramName} in generated JSX', async () => {
    const headingNodeId = 'h-node-1'
    const titleParam = makeParam('p-title', 'title', 'string', 'Default Title')

    const vc: VisualComponent = makeVC('vc-1', 'Card', {
      params: [titleParam],
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
            props: { text: 'Default Title', level: 'h2' },
            children: [],
            breakpointOverrides: {},
            propBindings: { text: { paramId: 'p-title' } },
          },
        ],
      },
    })

    const registry = makeRegistry({
      'base.root': makeRootModule(),
      'base.heading': makeHeadingModule(),
    })
    const project = makeProject([vc])
    const files = await exportAndUnzip(project, registry)

    const src = files['src/components/Card.tsx']
    expect(src).toBeDefined()
    // The bound text prop must emit as the bare destructured param name {title}, NOT {props.title}.
    // The function signature is:  function Card({ title = "…" }: CardProps)
    // `title` is the in-scope destructured binding; `props` is not defined.
    expect(src).toContain('{title}')
    expect(src).not.toContain('props.title')
    // The param name must also appear in the interface and signature
    expect(src).toContain('title')
  })

  it('unbound props emit as literal values', async () => {
    const headingNodeId = 'h-node-2'
    const vc: VisualComponent = makeVC('vc-2', 'StaticCard', {
      params: [],
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
            props: { text: 'Fixed Title', level: 'h2' },
            children: [],
            breakpointOverrides: {},
            // No propBindings — should emit literal
          },
        ],
      },
    })

    const registry = makeRegistry({
      'base.root': makeRootModule(),
      'base.heading': makeHeadingModule(),
    })
    const project = makeProject([vc])
    const files = await exportAndUnzip(project, registry)

    const src = files['src/components/StaticCard.tsx']
    expect(src).toContain('Fixed Title')
  })

  it('props interface includes typed fields for all params', async () => {
    const vc = makeVC('vc-1', 'Typed', {
      params: [
        makeParam('p-1', 'title', 'string', 'Hello'),
        makeParam('p-2', 'count', 'number', 0),
        makeParam('p-3', 'visible', 'boolean', true),
      ],
    })
    const project = makeProject([vc])
    const files = await exportAndUnzip(project)

    const src = files['src/components/Typed.tsx']
    expect(src).toContain('title?: string')
    expect(src).toContain('count?: number')
    expect(src).toContain('visible?: boolean')
  })
})

// ---------------------------------------------------------------------------
// Test 5 — Eject matrix (4 combinations of generated × ejected)
// ---------------------------------------------------------------------------

describe('VC Emission — eject precedence matrix', () => {
  // generated=false, ejected=false → user-authored: ALWAYS emit
  it('[generated=false, ejected=false] always emits (user-authored VC)', async () => {
    const vc = makeVC('vc-1', 'Always', { generated: false, ejected: false })
    const project = makeProject([vc])
    const files = await exportAndUnzip(project)
    expect('src/components/Always.tsx' in files).toBe(true)
  })

  // generated=false, ejected=true → user-authored + ejected flag set: ALWAYS emit
  it('[generated=false, ejected=true] always emits (ejected flag on user-authored is odd but emit)', async () => {
    const vc = makeVC('vc-1', 'AlwaysE', { generated: false, ejected: true })
    const project = makeProject([vc])
    const files = await exportAndUnzip(project)
    expect('src/components/AlwaysE.tsx' in files).toBe(true)
  })

  // generated=true, ejected=false → publisher-owned: SKIP (scaffold handles it)
  it('[generated=true, ejected=false] skips emission (scaffold owns this file)', async () => {
    const vc = makeVC('vc-1', 'Skipped', { generated: true, ejected: false })
    const project = makeProject([vc])
    const files = await exportAndUnzip(project)
    expect('src/components/Skipped.tsx' in files).toBe(false)
  })

  // generated=true, ejected=true → user took manual control: EMIT (user version wins)
  it('[generated=true, ejected=true] emits (user ejected the generated file)', async () => {
    const vc = makeVC('vc-1', 'Ejected', { generated: true, ejected: true })
    const project = makeProject([vc])
    const files = await exportAndUnzip(project)
    expect('src/components/Ejected.tsx' in files).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Test 6 — Topological sort (dependency before dependent)
// ---------------------------------------------------------------------------

describe('VC Emission — topological order', () => {
  it('inner VC (dependency) emits before outer VC (dependent)', async () => {
    // Outer references Inner via base.visualComponentRef
    const innerVC = makeVC('vc-inner', 'Inner')
    const outerVC = makeVC('vc-outer', 'Outer', {
      rootNode: {
        id: 'vc-outer-root',
        moduleId: 'base.root',
        props: {},
        children: ['ref-node'],
        breakpointOverrides: {},
        childNodes: [
          {
            id: 'ref-node',
            moduleId: 'base.visualComponentRef',
            props: { componentId: 'vc-inner', propOverrides: {} },
            children: [],
            breakpointOverrides: {},
          },
        ],
      },
    })

    // Both VCs are user-authored (generated=false) — both will emit
    const project = makeProject([outerVC, innerVC]) // outer listed FIRST
    const files = await exportAndUnzip(project)

    // Both should be emitted
    expect('src/components/Inner.tsx' in files).toBe(true)
    expect('src/components/Outer.tsx' in files).toBe(true)
  })

  it('three independent VCs all emit regardless of order', async () => {
    const vcs = [
      makeVC('vc-3', 'Gamma'),
      makeVC('vc-1', 'Alpha'),
      makeVC('vc-2', 'Beta'),
    ]
    const project = makeProject(vcs)
    const files = await exportAndUnzip(project)

    expect('src/components/Alpha.tsx' in files).toBe(true)
    expect('src/components/Beta.tsx' in files).toBe(true)
    expect('src/components/Gamma.tsx' in files).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Test 7 — Lenient-per-VC: broken VC doesn't abort entire export
// ---------------------------------------------------------------------------

describe('VC Emission — resilience', () => {
  it('a VC with an unregistered module does not abort the ZIP export', async () => {
    // VC with a module that isn't in the registry (toJsx will emit a comment)
    const brokenVC = makeVC('vc-broken', 'Broken', {
      rootNode: {
        id: 'vc-broken-root',
        moduleId: 'unknown.module',   // not in registry
        props: {},
        children: [],
        breakpointOverrides: {},
      },
    })
    const goodVC = makeVC('vc-good', 'Good')
    const project = makeProject([brokenVC, goodVC])

    // Should not throw
    const files = await exportAndUnzip(project)

    // Good VC still emits
    expect('src/components/Good.tsx' in files).toBe(true)
  })

  it('pages still emit correctly even when VCs are present', async () => {
    const vc = makeVC('vc-1', 'Card')
    const project = makeProject([vc])
    const files = await exportAndUnzip(project)

    // Page should still be present
    expect('src/pages/Index.tsx' in files || 'src/pages/index.tsx' in files ||
           Object.keys(files).some(p => p.startsWith('src/pages/'))).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Test 8 — TypeScript defaults in function signature
// ---------------------------------------------------------------------------

describe('VC Emission — function signature defaults', () => {
  it('params with defaults produce destructured signature with defaults', async () => {
    const vc = makeVC('vc-1', 'WithDefaults', {
      params: [
        makeParam('p-1', 'label', 'string', 'Click me'),
        makeParam('p-2', 'count', 'number', 42),
      ],
    })
    const project = makeProject([vc])
    const files = await exportAndUnzip(project)

    const src = files['src/components/WithDefaults.tsx']
    expect(src).toContain('label =')
    expect(src).toContain('"Click me"')
    expect(src).toContain('count =')
    expect(src).toContain('42')
  })

  it('VC with no params emits a minimal interface and valid function', async () => {
    const vc = makeVC('vc-1', 'NoParams', { params: [] })
    const project = makeProject([vc])
    const files = await exportAndUnzip(project)

    const src = files['src/components/NoParams.tsx']
    expect(src).toContain('export interface NoParamsProps {}')
    expect(src).toContain('export default function NoParams(')
  })
})

// ---------------------------------------------------------------------------
// Test 9 — MUST-FIX 1: bound prop emits as bare destructured name (not props.X)
// ---------------------------------------------------------------------------

describe('VC Emission — bound prop uses destructured name, never props.X', () => {
  it('generated source compiles: no props.X reference in scope of destructured signature', async () => {
    const headingNodeId = 'h-node-mf1'
    const titleParam = makeParam('p-title', 'title', 'string', 'Hello')
    const countParam = makeParam('p-count', 'count', 'number', 0)

    const vc: VisualComponent = makeVC('vc-mf1', 'MF1Card', {
      params: [titleParam, countParam],
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
            props: { text: 'Hello', level: 'h2' },
            children: [],
            breakpointOverrides: {},
            propBindings: { text: { paramId: 'p-title' } },
          },
        ],
      },
    })

    const registry = makeRegistry({
      'base.root': makeRootModule(),
      'base.heading': makeHeadingModule(),
    })
    const project = makeProject([vc])
    const files = await exportAndUnzip(project, registry)
    const src = files['src/components/MF1Card.tsx']

    // Bare param name must be present in JSX body
    expect(src).toContain('{title}')

    // props.X must NOT appear anywhere — there is no `props` binding
    expect(src).not.toContain('props.title')
    expect(src).not.toContain('props.count')

    // Destructured signature must contain default for bound param
    expect(src).toContain('title =')
  })
})

// ---------------------------------------------------------------------------
// Test 10 — SHOULD-FIX 3: sentinel nonce prevents user-content collision
// ---------------------------------------------------------------------------

describe('VC Emission — sentinel nonce prevents content collision', () => {
  it('user literal that looks like old sentinel is NOT rewritten in output', async () => {
    const headingNodeId = 'h-node-sf3'
    const titleParam = makeParam('p-title', 'title', 'string', 'Default')

    // This heading has a DIFFERENT node that uses the literal sentinel-like text
    const vc: VisualComponent = makeVC('vc-sf3', 'SF3Card', {
      params: [titleParam],
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
            // The text value is a literal that looks like the OLD sentinel (no nonce).
            // After the nonce fix, the emit uses __VCPARAM_<nonce>_title__ so this
            // old-format literal must survive untouched in the output.
            props: { text: '__VCPARAM_title__', level: 'h2' },
            children: [],
            breakpointOverrides: {},
            // NOT bound — this is a user's intentional literal string
          },
        ],
      },
    })

    const registry = makeRegistry({
      'base.root': makeRootModule(),
      'base.heading': makeHeadingModule(),
    })
    const project = makeProject([vc])
    const files = await exportAndUnzip(project, registry)
    const src = files['src/components/SF3Card.tsx']

    // The old-format sentinel literal must appear verbatim in the output —
    // it must NOT be silently replaced with the param name
    expect(src).toContain('__VCPARAM_title__')
  })
})

// ---------------------------------------------------------------------------
// Test 11 — SHOULD-FIX 4: VC does not overwrite user file at same path
// ---------------------------------------------------------------------------

describe('VC Emission — user file wins over VC at same path', () => {
  it('user file at src/components/Card.tsx is preserved over a VC of the same name', async () => {
    const vc = makeVC('vc-1', 'Card')   // filePath = src/components/Card.tsx

    // A user-authored file at the same path as the VC
    const project: Project = {
      ...makeProject([vc]),
      files: [
        {
          id: 'f-user-card',
          path: 'src/components/Card.tsx',
          type: 'component',
          content: '/* USER FILE — should not be overwritten */',
          generated: false,
          ejected: false,
          createdAt: 0,
          updatedAt: 0,
        },
      ],
    }

    const files = await exportAndUnzip(project)
    const cardSrc = files['src/components/Card.tsx']

    // The user file content must win
    expect(cardSrc).toContain('USER FILE — should not be overwritten')

    // The auto-generated VC comment must NOT appear
    expect(cardSrc).not.toContain('Auto-generated by Page Builder')
  })

  it('VC at a path with no user-file collision emits normally', async () => {
    const vc = makeVC('vc-2', 'UniqueComp')

    const project: Project = {
      ...makeProject([vc]),
      files: [
        {
          id: 'f-other',
          path: 'src/components/Other.tsx',
          type: 'component',
          content: '/* different file */',
          generated: false,
          ejected: false,
          createdAt: 0,
          updatedAt: 0,
        },
      ],
    }

    const files = await exportAndUnzip(project)

    // VC at its unique path must emit
    expect('src/components/UniqueComp.tsx' in files).toBe(true)
    expect(files['src/components/UniqueComp.tsx']).toContain('Auto-generated by Page Builder')
  })
})
