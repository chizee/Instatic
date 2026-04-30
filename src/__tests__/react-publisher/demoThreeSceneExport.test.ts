import { describe, expect, it } from 'bun:test'
import { pageToComponent } from '../../core/react-publisher/pageToComponent'
import type { IModuleRegistry } from '../../core/module-engine/types'
import type { Page, Project } from '../../core/page-tree/types'
import { DemoSceneModule } from '../../modules/base/demoScene'

const registry: IModuleRegistry = {
  register: () => {},
  get: (id) => (id === DemoSceneModule.id ? DemoSceneModule : undefined),
  getOrThrow: (id) => {
    if (id !== DemoSceneModule.id) throw new Error(`Unknown module: ${id}`)
    return DemoSceneModule
  },
  has: (id) => id === DemoSceneModule.id,
  list: () => [DemoSceneModule],
  listByCategory: () => ({ Demo: [DemoSceneModule] }),
}

const page: Page = {
  id: 'page-1',
  slug: 'index',
  title: 'Home',
  rootNodeId: 'scene',
  nodes: {
    scene: {
      id: 'scene',
      moduleId: DemoSceneModule.id,
      props: DemoSceneModule.defaults,
      children: [],
      breakpointOverrides: {},
    },
  },
}

const project: Project = {
  id: 'project-1',
  name: 'Three Project',
  projectMode: 'react',
  pages: [page],
  files: [],
  visualComponents: [],
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

describe('Demo Three Scene React export', () => {
  it('keeps Three as a project dependency and provides a real editor runtime', async () => {
    expect(DemoSceneModule.editorRuntime?.sandbox).toBeUndefined()
    expect(DemoSceneModule.dependencies?.three).toBe('^0.184.0')

    const editorSource = await Bun.file('src/modules/base/demoScene/index.tsx').text()
    expect(editorSource).toContain('importRuntimeDependency<ThreeModule>')
    expect(editorSource).toContain('resolveDependencyUrl')
    expect(editorSource).toContain('getProjectDependencyVersion')
    expect(editorSource).toContain('resolveThreeDependency')
    expect(editorSource).toContain('Missing dependency: {THREE_PACKAGE}')
    expect(editorSource).toContain('Restore dependency')
    expect(editorSource).toContain('data-canvas-interactive="true"')
    expect(editorSource).toContain('onPointerUp={handleRestoreDependency}')
    expect(editorSource).toContain('createEditorScene')

    const nodeRendererSource = await Bun.file('src/editor/components/Canvas/NodeRenderer.tsx').text()
    expect(nodeRendererSource).toContain('definition.editorRuntime?.sandbox && !definition.trusted')
  })

  it('emits a real Three.js runtime component instead of a CSS-only fake', () => {
    const { source } = pageToComponent(page, project, registry)

    expect(source).toContain(`import * as THREE from 'three'`)
    expect(source).toContain('new THREE.WebGLRenderer')
    expect(source).toContain('new THREE.PerspectiveCamera')
    expect(source).toContain('<DemoThreeSceneRuntime')
  })
})
