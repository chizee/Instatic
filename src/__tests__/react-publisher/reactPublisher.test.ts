/**
 * React Publisher — Unit Tests
 *
 * Covers:
 * - utils.ts: buildJsxStyle, jsxStr, jsxUrl, jsxAttr
 * - nodeToJsx.ts: iterative post-order DFS, trusted guard, toJsx dispatch
 * - pageToComponent.ts: slugToComponentName, pageToComponent output shape
 * - scaffold.ts: generateScaffold file set completeness
 *
 * Security tests verify that user-controlled strings cannot inject code into
 * the generated JSX output (Constraints #303, #290 — CWE-94 prevention).
 *
 * Isolation (Constraint #269): imports only from react-publisher and page-tree.
 */

import { describe, it, expect } from 'bun:test'
import { buildJsxStyle, jsxStr, jsxUrl, jsxAttr } from '../../core/react-publisher/utils'
import { nodeToJsx } from '../../core/react-publisher/nodeToJsx'
import { slugToComponentName, pageToComponent } from '../../core/react-publisher/pageToComponent'
import { generateScaffold } from '../../core/react-publisher/scaffold'
import type { Page, PageNode } from '../../core/page-tree/types'
import type { ModuleDefinition, IModuleRegistry, AnyModuleDefinition } from '../../core/module-engine/types'

// ---------------------------------------------------------------------------
// Minimal test fixtures
// ---------------------------------------------------------------------------

function makeRegistry(
  modules: Record<string, AnyModuleDefinition>,
): IModuleRegistry {
  return {
    register: () => {},
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

function makeNode(
  id: string,
  moduleId: string,
  props: Record<string, unknown> = {},
  children: string[] = [],
): PageNode {
  return {
    id,
    moduleId,
    props,
    children,
    breakpointOverrides: {},
    locked: false,
    hidden: false,
  }
}

function makePage(nodes: Record<string, PageNode>, rootNodeId = 'root'): Page {
  return {
    id: 'test-page',
    slug: 'index',
    title: 'Test Page',
    nodes,
    rootNodeId,
  }
}

function makeModule(id: string, overrides: Partial<ModuleDefinition> = {}): ModuleDefinition {
  return {
    id,
    name: id,
    category: 'test',
    version: '1.0.0',
    trusted: true,
    canHaveChildren: false,
    schema: {},
    defaults: {},
    component: () => null as never,
    render: () => ({ html: `<div>${id}</div>` }),
    toJsx: (props, children) => {
      void props
      return `<div data-mod="${id}">${children.join('')}</div>`
    },
    ...overrides,
  }
}

function makeProject() {
  return {
    id: 'proj',
    name: 'My Project',
    projectMode: 'react' as const,
    pages: [],
    breakpoints: [],
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

// ---------------------------------------------------------------------------
// utils.ts — buildJsxStyle
// ---------------------------------------------------------------------------

describe('buildJsxStyle', () => {
  it('produces a double-brace JSX style expression', () => {
    const result = buildJsxStyle({ color: '#f00', fontSize: '16px' })
    expect(result).toMatch(/^\{\{/)
    expect(result).toMatch(/\}\}$/)
  })

  it('includes all non-undefined entries', () => {
    const result = buildJsxStyle({ color: '#f00', fontSize: '16px', display: 'flex' })
    expect(result).toContain('color')
    expect(result).toContain('fontSize')
    expect(result).toContain('display')
  })

  it('omits undefined values', () => {
    const result = buildJsxStyle({ color: '#f00', flexDirection: undefined })
    expect(result).not.toContain('flexDirection')
  })

  it('omits empty string values', () => {
    const result = buildJsxStyle({ color: '', fontSize: '16px' })
    expect(result).not.toContain('"",')
  })

  it('uses JSON.stringify on values — quotes are escaped', () => {
    // A CSS value with a double-quote (unusual but possible) must be safely escaped
    const result = buildJsxStyle({ content: '"hello"' })
    // JSON.stringify('"hello"') → '"hello"' with inner quotes escaped as \"
    expect(result).toContain('\\"hello\\"')
  })

  it('returns {{}} for empty or all-undefined input', () => {
    expect(buildJsxStyle({})).toBe('{{}}')
  })
})

// ---------------------------------------------------------------------------
// utils.ts — jsxStr (CWE-94 prevention)
// ---------------------------------------------------------------------------

describe('jsxStr', () => {
  it('wraps value in {JSON.stringify()} expression', () => {
    const result = jsxStr('Hello World')
    expect(result).toBe('{"Hello World"}')
  })

  it('CWE-94: result is a valid JSON string literal expression', () => {
    // The generated code {"<script>alert(1)</script>"} is SAFE in JSX:
    // React renders JSX text expressions as DOM text nodes (auto HTML-escaped),
    // NOT as innerHTML. So angle brackets in the string are rendered as text.
    // The critical property is that the value cannot break out of the string literal.
    const result = jsxStr('<script>alert(1)</script>')
    // Must be wrapped in {" ... "} — a JSX expression containing a string literal
    expect(result).toMatch(/^\{".*"\}$/)
    // Must be properly JSON-encoded (the string is closed correctly)
    const inner = result.slice(1, -1) // remove outer { }
    expect(() => JSON.parse(inner)).not.toThrow()
  })

  it('CWE-94: embedded quotes cannot break out of the string literal', () => {
    // User-controlled value with embedded quotes that would normally break string context
    // JSON.stringify escapes inner quotes as \", preventing string escape
    const malicious = '}</h2><script>require("fs").unlinkSync("/")</script><h2>{"'
    const result = jsxStr(malicious)
    // Must be a well-formed JSX expression containing a valid JS string literal
    expect(result).toMatch(/^\{".+"\}$/)
    // The inner value must be valid JSON (properly escaped, not injectable code)
    const inner = result.slice(1, -1) // strip outer { }
    expect(() => JSON.parse(inner)).not.toThrow()
    // The parsed value must equal the original string (no data loss, just encoding)
    expect(JSON.parse(inner)).toBe(malicious)
  })

  it('handles null and undefined safely', () => {
    expect(jsxStr(null)).toBe('{""}')
    expect(jsxStr(undefined)).toBe('{""}')
  })
})

// ---------------------------------------------------------------------------
// utils.ts — jsxUrl
// ---------------------------------------------------------------------------

describe('jsxUrl', () => {
  it('passes through safe https URLs', () => {
    const result = jsxUrl('https://example.com/img.jpg')
    expect(result).toContain('https://example.com/img.jpg')
  })

  it('blocks javascript: URLs (returns "#")', () => {
    const result = jsxUrl('javascript:alert(1)')
    expect(result).not.toContain('javascript:')
    expect(result).toContain('#')
  })

  it('blocks vbscript: URLs', () => {
    const result = jsxUrl('vbscript:MsgBox(1)')
    expect(result).not.toContain('vbscript:')
  })

  it('blocks data: URLs', () => {
    const result = jsxUrl('data:text/html,<script>alert(1)</script>')
    expect(result).not.toContain('data:')
  })

  it('blocks tab-normalised javascript: bypass', () => {
    const result = jsxUrl('java\tscript:alert(1)')
    expect(result).not.toContain('alert(1)')
  })
})

// ---------------------------------------------------------------------------
// utils.ts — jsxAttr
// ---------------------------------------------------------------------------

describe('jsxAttr', () => {
  it('produces a named JSX attribute with JSON-encoded value', () => {
    const result = jsxAttr('alt', 'Profile photo')
    expect(result).toBe(` alt={"Profile photo"}`)
  })

  it('returns empty string for falsy values', () => {
    expect(jsxAttr('alt', '')).toBe('')
    expect(jsxAttr('alt', null)).toBe('')
  })

  it('value is JSON-encoded (quotes are escaped)', () => {
    // jsxAttr uses JSON.stringify so embedded quotes cannot break attribute string context
    const result = jsxAttr('title', 'say "hello"')
    expect(result).toContain('\\"hello\\"')
    // Must be valid as a JS expression
    const exprMatch = result.match(/=\{(.+)\}/)
    expect(exprMatch).not.toBeNull()
    expect(() => JSON.parse(exprMatch![1])).not.toThrow()
  })
})

// ---------------------------------------------------------------------------
// nodeToJsx.ts — basic traversal
// ---------------------------------------------------------------------------

describe('nodeToJsx — basic traversal', () => {
  it('calls toJsx() for the root node', () => {
    const root = makeNode('root', 'test.leaf', { text: 'Hello' })
    const page = makePage({ root })
    const registry = makeRegistry({
      'test.leaf': makeModule('test.leaf', {
        toJsx: () => `<span>leaf</span>`,
      }),
    })
    const result = nodeToJsx('root', page, registry)
    expect(result).toBe('<span>leaf</span>')
  })

  it('passes rendered children to parent toJsx()', () => {
    const child = makeNode('child', 'test.child')
    const root = makeNode('root', 'test.parent', {}, ['child'])
    const page = makePage({ root, child })
    const registry = makeRegistry({
      'test.parent': makeModule('test.parent', {
        canHaveChildren: true,
        toJsx: (_props, children) => `<div>${children.join('')}</div>`,
      }),
      'test.child': makeModule('test.child', {
        toJsx: () => `<p>child</p>`,
      }),
    })
    const result = nodeToJsx('root', page, registry)
    expect(result).toBe('<div><p>child</p></div>')
  })

  it('post-order: renders multiple children in correct order', () => {
    const c1 = makeNode('c1', 'test.m')
    const c2 = makeNode('c2', 'test.m')
    const c3 = makeNode('c3', 'test.m')
    const root = makeNode('root', 'test.container', {}, ['c1', 'c2', 'c3'])
    const page = makePage({ root, c1, c2, c3 })
    const registry = makeRegistry({
      'test.m': makeModule('test.m', {
        toJsx: () => `<span/>`,
      }),
      'test.container': makeModule('test.container', {
        canHaveChildren: true,
        toJsx: (_props, children) => `<div>${children.join('')}</div>`,
      }),
    })
    const result = nodeToJsx('root', page, registry)
    expect(result).toContain('<div>')
    expect(result).toContain('<span/>')
  })

  it('emits comment placeholder for module without toJsx', () => {
    const root = makeNode('root', 'test.no-jsx', {})
    const page = makePage({ root })
    const registry = makeRegistry({
      'test.no-jsx': makeModule('test.no-jsx', {
        toJsx: undefined,
      }),
    })
    const result = nodeToJsx('root', page, registry)
    expect(result).toContain('does not support React export')
  })

  it('emits comment for unknown module', () => {
    const root = makeNode('root', 'test.missing', {})
    const page = makePage({ root })
    const registry = makeRegistry({})
    const result = nodeToJsx('root', page, registry)
    expect(result).toContain('unknown module')
  })
})

// ---------------------------------------------------------------------------
// nodeToJsx.ts — Constraint B: trusted guard
// ---------------------------------------------------------------------------

describe('nodeToJsx — Constraint B: trusted guard', () => {
  it('does NOT call toJsx() on untrusted modules — uses dangerouslySetInnerHTML', () => {
    let toJsxCalled = false
    const untrustedModule = makeModule('test.untrusted', {
      trusted: false,
      toJsx: () => {
        toJsxCalled = true
        // This would be RCE if called: arbitrary TypeScript in the output
        return `const fs = require('fs'); fs.unlinkSync('/')`
      },
      render: () => ({ html: '<div>safe fallback</div>' }),
    })

    const root = makeNode('root', 'test.untrusted')
    const page = makePage({ root })
    const registry = makeRegistry({ 'test.untrusted': untrustedModule })

    const result = nodeToJsx('root', page, registry)

    expect(toJsxCalled).toBe(false)
    expect(result).toContain('dangerouslySetInnerHTML')
    expect(result).not.toContain('require(')
    expect(result).not.toContain('unlinkSync')
  })

  it('DOES call toJsx() on trusted modules', () => {
    let toJsxCalled = false
    const trustedModule = makeModule('test.trusted', {
      trusted: true,
      toJsx: () => {
        toJsxCalled = true
        return `<span>trusted</span>`
      },
    })

    const root = makeNode('root', 'test.trusted')
    const page = makePage({ root })
    const registry = makeRegistry({ 'test.trusted': trustedModule })

    nodeToJsx('root', page, registry)
    expect(toJsxCalled).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// pageToComponent.ts — slugToComponentName
// ---------------------------------------------------------------------------

describe('slugToComponentName', () => {
  it('converts "index" → "Index"', () => {
    expect(slugToComponentName('index')).toBe('Index')
  })

  it('converts "about-us" → "AboutUs"', () => {
    expect(slugToComponentName('about-us')).toBe('AboutUs')
  })

  it('converts "contact_page" → "ContactPage"', () => {
    expect(slugToComponentName('contact_page')).toBe('ContactPage')
  })

  it('handles empty slug → "Page"', () => {
    expect(slugToComponentName('')).toBe('Page')
  })

  it('strips leading numbers', () => {
    const name = slugToComponentName('123abc')
    expect(name).toMatch(/^[A-Z]/)
  })
})

// ---------------------------------------------------------------------------
// pageToComponent.ts — pageToComponent
// ---------------------------------------------------------------------------

describe('pageToComponent', () => {
  const mod = makeModule('test.root', {
    toJsx: () => `<main><p>Hello</p></main>`,
  })
  const reg = makeRegistry({ 'test.root': mod })
  const proj = makeProject()

  it('returns correct componentName derived from slug', () => {
    const page = makePage({ root: makeNode('root', 'test.root') })
    const { componentName } = pageToComponent(page, proj, reg)
    expect(componentName).toBe('Index')
  })

  it('source contains React import', () => {
    const page = makePage({ root: makeNode('root', 'test.root') })
    const { source } = pageToComponent(page, proj, reg)
    expect(source).toContain("import React from 'react'")
  })

  it('source contains exported default function named after component', () => {
    const page = { ...makePage({ root: makeNode('root', 'test.root') }), slug: 'about-us' }
    const { source, componentName } = pageToComponent(page, proj, reg)
    expect(componentName).toBe('AboutUs')
    expect(source).toContain(`export default function AboutUs()`)
  })

  it('source contains the JSX body from toJsx()', () => {
    const page = makePage({ root: makeNode('root', 'test.root') })
    const { source } = pageToComponent(page, proj, reg)
    expect(source).toContain('<main><p>Hello</p></main>')
  })

  it('source contains a return() with JSX body', () => {
    const page = makePage({ root: makeNode('root', 'test.root') })
    const { source } = pageToComponent(page, proj, reg)
    expect(source).toContain('return (')
  })

  it('emits trusted module React export imports and declarations once', () => {
    const withAssets = makeModule('test.with-assets', {
      reactExport: {
        imports: [`import * as THREE from 'three'`],
        declarations: [`function RuntimeScene() { return <div /> }`],
      },
      toJsx: () => `<RuntimeScene />`,
    })
    const page = makePage({ root: makeNode('root', 'test.with-assets') })
    const { source } = pageToComponent(page, proj, makeRegistry({ 'test.with-assets': withAssets }))

    expect(source).toContain(`import * as THREE from 'three'`)
    expect(source).toContain(`function RuntimeScene() { return <div /> }`)
    expect(source).toContain(`<RuntimeScene />`)
  })
})

// ---------------------------------------------------------------------------
// scaffold.ts — generateScaffold
// ---------------------------------------------------------------------------

describe('generateScaffold', () => {
  const pages = [
    { slug: 'index', componentName: 'Index' },
    { slug: 'about', componentName: 'About' },
  ]

  it('generates package.json', () => {
    const files = generateScaffold('My Site', pages)
    expect(files['package.json']).toBeDefined()
    const pkg = JSON.parse(files['package.json'])
    expect(pkg.dependencies.react).toBeDefined()
    expect(pkg.devDependencies.vite).toBeDefined()
  })

  it('merges project dependencies into package.json', () => {
    const files = generateScaffold('My Site', pages, {
      dependencies: { three: '^0.184.0' },
      devDependencies: { eslint: '^10.0.0' },
    })
    const pkg = JSON.parse(files['package.json'])
    expect(pkg.dependencies.react).toBeDefined()
    expect(pkg.dependencies.three).toBe('^0.184.0')
    expect(pkg.devDependencies.vite).toBeDefined()
    expect(pkg.devDependencies.eslint).toBe('^10.0.0')
  })

  it('generates vite.config.ts', () => {
    const files = generateScaffold('My Site', pages)
    expect(files['vite.config.ts']).toContain('@vitejs/plugin-react')
  })

  it('generates tsconfig.json with JSX support', () => {
    const files = generateScaffold('My Site', pages)
    const ts = JSON.parse(files['tsconfig.json'])
    expect(ts.compilerOptions.jsx).toBe('react-jsx')
  })

  it('generates index.html with root div and main.tsx entry', () => {
    const files = generateScaffold('My Site', pages)
    expect(files['index.html']).toContain('<div id="root">')
    expect(files['index.html']).toContain('main.tsx')
  })

  it('generates src/main.tsx with ReactDOM.createRoot', () => {
    const files = generateScaffold('My Site', pages)
    expect(files['src/main.tsx']).toContain('ReactDOM.createRoot')
  })

  it('generates src/App.tsx lazy-loading all page components (Guideline #311 / Task #335)', () => {
    const files = generateScaffold('My Site', pages)
    // Pages must be lazy-loaded for per-page bundle splitting — static imports
    // would collapse all page code into one bundle (Guideline #311).
    expect(files['src/App.tsx']).toContain("React.lazy(() => import('./pages/Index'))")
    expect(files['src/App.tsx']).toContain("React.lazy(() => import('./pages/About'))")
    expect(files['src/App.tsx']).toContain('Suspense')
    // Must NOT use static imports for page components
    expect(files['src/App.tsx']).not.toContain("import Index from './pages/Index'")
    expect(files['src/App.tsx']).not.toContain("import About from './pages/About'")
  })

  it('App.tsx includes hash routing for all pages', () => {
    const files = generateScaffold('My Site', pages)
    expect(files['src/App.tsx']).toContain('index')
    expect(files['src/App.tsx']).toContain('about')
  })

  it('package name is sanitized from project name', () => {
    const files = generateScaffold('My Awesome Site!', pages)
    const pkg = JSON.parse(files['package.json'])
    expect(pkg.name).toMatch(/^[a-z0-9-]+$/)
    expect(pkg.name).not.toContain(' ')
    expect(pkg.name).not.toContain('!')
  })
})
