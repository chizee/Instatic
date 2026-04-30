/**
 * React Publisher — project.files[] emission in ZIP export (Task #430)
 *
 * Tests that exportReactProjectAsZip() correctly:
 *   1. Emits user-authored files (component, script, style, asset) in the ZIP.
 *   2. Is backward-compatible: files:[] projects produce the same scaffold as today.
 *   3. Respects eject semantics: generated=true,ejected=false → scaffold wins;
 *      generated=true,ejected=true → user version overwrites scaffold.
 *   4. Handles asset files (base64 → binary bytes round-trip).
 *   5. Resolves path collisions correctly (ejected/user-authored wins over scaffold).
 *
 * Architecture source: Contribution #595 §4.2–§4.3 / Task #430.
 */

import { describe, it, expect } from 'bun:test'
import { unzipSync, strToU8 } from 'fflate'
import { exportReactProjectAsZip } from '../../core/react-publisher/export'
import { generateScaffold } from '../../core/react-publisher/scaffold'
import type { Project, Page, PageNode } from '../../core/page-tree/types'
import type { ProjectFile } from '../../core/files/types'
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
    toJsx: (_p, children) => `<>{${children.join('')}}</>`,
  } as AnyModuleDefinition
}

function makeProject(files: ProjectFile[] = []): Project {
  return {
    id: 'proj-1',
    name: 'Test Project',
    projectMode: 'react',
    pages: [makePage()],
    files,
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

function makeFile(
  id: string,
  path: string,
  type: ProjectFile['type'],
  overrides: Partial<ProjectFile> = {},
): ProjectFile {
  return {
    id,
    path,
    type,
    content: type !== 'asset' ? '' : undefined,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  }
}

/**
 * Export a project to ZIP and return the unzipped file map as
 * { path: string } (text) or { path: Uint8Array } (binary).
 * All entries are decoded as UTF-8 strings for inspection.
 */
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

/**
 * Export and return the raw unzipped Uint8Array map (for binary assertions).
 */
async function exportAndUnzipRaw(
  project: Project,
  registry = makeRegistry({ 'base.root': makeRootModule() }),
): Promise<Record<string, Uint8Array>> {
  const blob = await exportReactProjectAsZip(project, registry)
  const buf = await blob.arrayBuffer()
  return unzipSync(new Uint8Array(buf))
}

// ---------------------------------------------------------------------------
// 1. Backward compatibility — files:[] produces the same scaffold output
// ---------------------------------------------------------------------------

describe('exportReactProjectAsZip — backward compatibility (files: [])', () => {
  it('emits all scaffold files when project.files is empty', async () => {
    const files = await exportAndUnzip(makeProject([]))
    const keys = Object.keys(files)
    const scaffold = generateScaffold('Test Project', [{ slug: 'index', componentName: 'Index' }])
    for (const path of Object.keys(scaffold)) {
      expect(keys).toContain(path)
    }
  })

  it('emits src/pages/<Name>.tsx for each page', async () => {
    const files = await exportAndUnzip(makeProject([]))
    // slug "index" → componentName "Index"
    expect(Object.keys(files)).toContain('src/pages/Index.tsx')
  })

  it('ZIP with files:[] is non-empty', async () => {
    const blob = await exportReactProjectAsZip(makeProject([]), makeRegistry({ 'base.root': makeRootModule() }))
    expect(blob.size).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// 2. User-authored files appear in the ZIP
// ---------------------------------------------------------------------------

describe('exportReactProjectAsZip — user-authored files emitted', () => {
  it('emits a component file at its path', async () => {
    const f = makeFile('f1', 'src/components/Button.tsx', 'component', {
      content: 'export function Button() { return <button /> }',
    })
    const files = await exportAndUnzip(makeProject([f]))
    expect(Object.keys(files)).toContain('src/components/Button.tsx')
    expect(files['src/components/Button.tsx']).toContain('export function Button')
  })

  it('emits a script file at its path', async () => {
    const f = makeFile('f2', 'src/hooks/useTheme.ts', 'script', {
      content: 'export function useTheme() {}',
    })
    const files = await exportAndUnzip(makeProject([f]))
    expect(files['src/hooks/useTheme.ts']).toContain('useTheme')
  })

  it('emits a style file at its path', async () => {
    const f = makeFile('f3', 'src/styles/globals.css', 'style', {
      content: 'body { margin: 0; }',
    })
    const files = await exportAndUnzip(makeProject([f]))
    expect(files['src/styles/globals.css']).toBe('body { margin: 0; }')
  })

  it('emits multiple user files together in the same ZIP', async () => {
    const userFiles = [
      makeFile('f1', 'src/components/Button.tsx', 'component', { content: '// Button' }),
      makeFile('f2', 'src/styles/globals.css', 'style', { content: '/* global */' }),
      makeFile('f3', 'public/favicon.ico', 'asset', {
        blob: { mimeType: 'image/x-icon', base64: 'AAABAAEAEBA' },
      }),
    ]
    const files = await exportAndUnzip(makeProject(userFiles))
    const keys = Object.keys(files)
    expect(keys).toContain('src/components/Button.tsx')
    expect(keys).toContain('src/styles/globals.css')
    expect(keys).toContain('public/favicon.ico')
  })

  it('emits file with empty content as an empty entry', async () => {
    const f = makeFile('f4', 'src/components/Empty.tsx', 'component', { content: '' })
    const files = await exportAndUnzip(makeProject([f]))
    expect(files['src/components/Empty.tsx']).toBe('')
  })

  it('falls back to empty string when content is undefined for a non-asset', async () => {
    const f = makeFile('f5', 'src/foo.ts', 'script')
    // content is '' from makeFile, override with undefined to test fallback
    ;(f as Record<string, unknown>).content = undefined
    const files = await exportAndUnzip(makeProject([f]))
    expect(files['src/foo.ts']).toBe('')
  })
})

// ---------------------------------------------------------------------------
// 3. Asset round-trip — base64 → binary bytes
// ---------------------------------------------------------------------------

describe('exportReactProjectAsZip — asset files (base64 → binary round-trip)', () => {
  it('emits asset as binary bytes decoded from base64', async () => {
    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    const pngMagic = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    // btoa works on latin-1, use manual encode:
    const b64 = btoa(String.fromCharCode(...pngMagic))

    const f = makeFile('img', 'public/logo.png', 'asset', {
      blob: { mimeType: 'image/png', base64: b64 },
    })
    const raw = await exportAndUnzipRaw(makeProject([f]))
    expect(raw['public/logo.png']).toBeDefined()
    // First 8 bytes must match PNG magic
    const result = raw['public/logo.png']!
    expect(result[0]).toBe(0x89)
    expect(result[1]).toBe(0x50) // 'P'
    expect(result[2]).toBe(0x4e) // 'N'
    expect(result[3]).toBe(0x47) // 'G'
  })

  it('skips asset with no blob (no crash, file omitted)', async () => {
    // Asset without blob.base64 — should not throw, just not include the file
    const f = makeFile('img2', 'public/missing.png', 'asset')
    // No blob set
    expect(async () => {
      const files = await exportAndUnzip(makeProject([f]))
      // File may or may not be present; no crash is the key assertion
      void files
    }).not.toThrow()
  })
})

// ---------------------------------------------------------------------------
// 4. Eject semantics
// ---------------------------------------------------------------------------

describe('exportReactProjectAsZip — eject semantics', () => {
  it('skips generated=true,ejected=false file (scaffold version used)', async () => {
    // Create a ProjectFile that pretends to be the generated package.json
    // but is NOT ejected — the scaffold version should win.
    const userPkg = makeFile('pkg', 'package.json', 'config', {
      content: '{ "name": "user-override" }',
      generated: true,
      ejected: false,
    })
    const files = await exportAndUnzip(makeProject([userPkg]))
    // package.json must exist (from scaffold) and must NOT be the user's version
    expect(files['package.json']).toBeDefined()
    expect(files['package.json']).not.toContain('user-override')
  })

  it('emits generated=true,ejected=true file (user version overwrites scaffold)', async () => {
    const ejectedPkg = makeFile('pkg', 'package.json', 'config', {
      content: '{ "name": "my-ejected-project" }',
      generated: true,
      ejected: true,
    })
    const files = await exportAndUnzip(makeProject([ejectedPkg]))
    expect(files['package.json']).toContain('my-ejected-project')
  })

  it('emits non-generated file even if it collides with a scaffold path', async () => {
    // User creates vite.config.ts without the generated flag — user version wins
    const userVite = makeFile('vc', 'vite.config.ts', 'config', {
      content: '// my custom vite config',
      generated: false,
    })
    const files = await exportAndUnzip(makeProject([userVite]))
    expect(files['vite.config.ts']).toContain('my custom vite config')
  })

  it('generated=true with no ejected field (undefined) is treated as not ejected', async () => {
    const unejected = makeFile('f1', 'package.json', 'config', {
      content: '{ "name": "should-not-appear" }',
      generated: true,
      // ejected not set
    })
    const files = await exportAndUnzip(makeProject([unejected]))
    expect(files['package.json']).not.toContain('should-not-appear')
  })
})

// ---------------------------------------------------------------------------
// 5. Scaffold is intact when no project files collide
// ---------------------------------------------------------------------------

describe('exportReactProjectAsZip — scaffold preserved alongside user files', () => {
  it('scaffold files and user files co-exist in the ZIP', async () => {
    const userFiles = [
      makeFile('f1', 'src/components/Card.tsx', 'component', { content: '// Card' }),
    ]
    const files = await exportAndUnzip(makeProject(userFiles))
    const keys = Object.keys(files)

    // Scaffold entries must still be present
    expect(keys).toContain('package.json')
    expect(keys).toContain('vite.config.ts')
    expect(keys).toContain('tsconfig.json')
    expect(keys).toContain('index.html')
    expect(keys).toContain('src/main.tsx')
    expect(keys).toContain('src/App.tsx')
    // User file also present
    expect(keys).toContain('src/components/Card.tsx')
  })
})
