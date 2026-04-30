/**
 * Editor layout persistence + rail integration tests.
 *
 * These cover the user-facing layout contract: panel open/closed state is
 * restored from localStorage on refresh, and the permanent left rail can reopen
 * closed panels without using the top toolbar.
 */

import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import React from 'react'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import EditorLayout from '../../app/EditorLayout'
import { useEditorStore } from '../../core/editor-store/store'
import { makeNode, makePage, makeProject } from '../fixtures'
import '../../modules/base/index'

const LAYOUT_STORAGE_KEY = 'pb-editor-layout-v1'

afterEach(cleanup)

function resetStore() {
  localStorage.clear()
  useEditorStore.setState({
    project: null,
    activePageId: null,
    selectedNodeId: null,
    hoveredNodeId: null,
    activeBreakpointId: 'desktop',
    domTreePanel: { collapsed: false, x: 0, y: 0, width: 280 },
    propertiesPanel: { collapsed: false, x: 0, y: 0, width: 360 },
    propertiesPanelMode: 'docked',
    leftSidebarWidth: 320,
    focusedPanel: 'canvas',
    projectExplorerPanelOpen: false,
    codeEditorPanelOpen: false,
    activeEditorFileId: null,
    dependenciesPanelOpen: false,
    isAgentOpen: false,
    isAgentStreaming: false,
    agentMessages: [],
    agentError: null,
    _historyPast: [],
    _historyFuture: [],
    canUndo: false,
    canRedo: false,
    hasUnsavedChanges: false,
  } as Parameters<typeof useEditorStore.setState>[0])
}

function renderEditorLayout() {
  render(
    <MemoryRouter initialEntries={['/editor/new-project']}>
      <Routes>
        <Route path="/editor/:projectId" element={<EditorLayout />} />
      </Routes>
    </MemoryRouter>,
  )
}

function loadProjectWithSelectedHeading() {
  const rootId = 'root-1'
  const nodeId = 'heading-1'
  const rootNode = makeNode({ id: rootId, moduleId: 'base.root', children: [nodeId] })
  const headingNode = makeNode({
    id: nodeId,
    moduleId: 'base.heading',
    props: { text: 'Hello', level: 'h2', align: 'left' },
    children: [],
  })
  const page = makePage({
    id: 'page-1',
    rootNodeId: rootId,
    nodes: { [rootId]: rootNode, [nodeId]: headingNode },
  })
  const project = makeProject({ pages: [page] })
  useEditorStore.setState({
    project,
    activePageId: 'page-1',
    selectedNodeId: nodeId,
  } as Parameters<typeof useEditorStore.setState>[0])
}

beforeEach(resetStore)

describe('EditorLayout — persisted panel layout', () => {
  it('restores panel visibility from localStorage on mount', async () => {
    localStorage.setItem(
      LAYOUT_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        panels: {
          dom: { open: false },
          properties: { open: true, mode: 'floating', width: 390 },
          project: { open: true },
          codeeditor: { open: true },
          dependencies: { open: true },
          agent: { open: true },
        },
        sidebars: { leftWidth: 410 },
        activeEditorFileId: 'file-1',
      }),
    )
    loadProjectWithSelectedHeading()

    renderEditorLayout()

    await waitFor(() => {
      const state = useEditorStore.getState()
      expect(state.domTreePanel.collapsed).toBe(true)
      expect(state.propertiesPanel.collapsed).toBe(false)
      expect(state.propertiesPanelMode).toBe('floating')
      expect(state.propertiesPanel.width).toBe(390)
      expect(state.leftSidebarWidth).toBe(410)
      expect(state.projectExplorerPanelOpen).toBe(true)
      expect(state.codeEditorPanelOpen).toBe(true)
      expect(state.activeEditorFileId).toBe('file-1')
      expect(state.dependenciesPanelOpen).toBe(false)
      expect(state.isAgentOpen).toBe(false)
    }, { timeout: 150 })
  })

  it('ignores retired Files panel layout records', async () => {
    localStorage.setItem(
      LAYOUT_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        panels: {
          files: { open: true },
          project: { open: false },
        },
      }),
    )

    renderEditorLayout()

    await waitFor(() => {
      const state = useEditorStore.getState()
      expect(state.projectExplorerPanelOpen).toBe(false)

      const stored = JSON.parse(localStorage.getItem(LAYOUT_STORAGE_KEY) ?? '{}')
      expect(stored.panels.files).toBeUndefined()
      expect(stored.panels.project.open).toBe(false)
    }, { timeout: 150 })
  })
})

describe('EditorLayout — permanent panel rail', () => {
  it('does not render the deferred timeline shell or rail button', () => {
    renderEditorLayout()

    expect(screen.queryByTestId('timeline-panel')).toBeNull()
    expect(screen.queryByTestId('panel-rail-timeline')).toBeNull()
  })

  it('renders a left panel rail that can toggle the Project panel', () => {
    renderEditorLayout()

    const rail = screen.queryByRole('navigation', { name: /panel dock/i })
    expect(rail).not.toBeNull()

    const projectButton = within(rail!).getByRole('button', { name: /open project panel/i })
    expect(projectButton.getAttribute('aria-pressed')).toBe('false')
    expect(within(rail!).queryByRole('button', { name: /properties panel/i })).toBeNull()
    expect(within(rail!).queryByRole('button', { name: /code editor/i })).toBeNull()

    fireEvent.click(projectButton)

    expect(useEditorStore.getState().projectExplorerPanelOpen).toBe(true)
    expect(projectButton.getAttribute('aria-pressed')).toBe('true')
  })

  it('orders primary rail panels by importance and uses the chosen panel icons', () => {
    renderEditorLayout()

    const rail = screen.getByRole('navigation', { name: /panel dock/i })
    const primaryButtons = within(rail).getAllByRole('button').slice(0, 4)

    expect(primaryButtons.map((button) => button.getAttribute('data-testid'))).toEqual([
      'panel-rail-layers',
      'panel-rail-agent',
      'panel-rail-project',
      'panel-rail-dependencies',
    ])
    expect(primaryButtons.map((button) => button.getAttribute('data-icon'))).toEqual([
      'bulletlist-2-sharp',
      'ai-settings-solid',
      'files-stack-2',
      'box-stack',
    ])
    expect(primaryButtons.map((button) => button.getAttribute('data-accent'))).toEqual([
      'mint',
      'lilac',
      'sky',
      'peach',
    ])
  })

  it('docks left rail panels into an expanding sidebar and switches between them', () => {
    renderEditorLayout()

    const sidebar = screen.getByTestId('left-sidebar')
    const rail = within(sidebar).getByRole('navigation', { name: /panel dock/i })

    expect(sidebar.getAttribute('data-expanded')).toBe('true')
    expect(sidebar.getAttribute('data-active-panel')).toBe('layers')
    expect(sidebar.getAttribute('style')).toContain('--left-sidebar-panel-width: 320px')
    expect(within(sidebar).getByRole('separator', { name: /resize left sidebar/i })).toBeDefined()
    expect(within(sidebar).getByLabelText('DOM tree panel')).toBeDefined()

    fireEvent.click(within(rail).getByRole('button', { name: /open project panel/i }))

    expect(sidebar.getAttribute('data-expanded')).toBe('true')
    expect(sidebar.getAttribute('data-active-panel')).toBe('project')
    expect(useEditorStore.getState().projectExplorerPanelOpen).toBe(true)
    expect(useEditorStore.getState().dependenciesPanelOpen).toBe(false)
    expect(useEditorStore.getState().domTreePanel.collapsed).toBe(true)
    expect(useEditorStore.getState().isAgentOpen).toBe(false)
    expect(within(sidebar).getByTestId('project-explorer-panel')).toBeDefined()
    expect(within(sidebar).queryByTestId('deps-section')).toBeNull()

    fireEvent.click(within(rail).getByRole('button', { name: /close project panel/i }))

    expect(sidebar.getAttribute('data-expanded')).toBe('false')
    expect(sidebar.getAttribute('data-active-panel')).toBe('none')
    expect(useEditorStore.getState().projectExplorerPanelOpen).toBe(false)

    fireEvent.click(within(rail).getByRole('button', { name: /open dependencies panel/i }))

    expect(sidebar.getAttribute('data-expanded')).toBe('true')
    expect(sidebar.getAttribute('data-active-panel')).toBe('dependencies')
    expect(sidebar.getAttribute('style')).toContain('--left-sidebar-panel-width: 320px')
    expect(useEditorStore.getState().dependenciesPanelOpen).toBe(true)
    expect(useEditorStore.getState().projectExplorerPanelOpen).toBe(false)
    expect(useEditorStore.getState().domTreePanel.collapsed).toBe(true)
    expect(useEditorStore.getState().isAgentOpen).toBe(false)
    expect(within(sidebar).getByTestId('dependencies-panel')).toBeDefined()
    expect(within(sidebar).getByTestId('deps-section')).toBeDefined()

    fireEvent.click(within(rail).getByRole('button', { name: /open ai assistant panel/i }))

    expect(sidebar.getAttribute('data-expanded')).toBe('true')
    expect(sidebar.getAttribute('data-active-panel')).toBe('agent')
    expect(sidebar.getAttribute('style')).toContain('--left-sidebar-panel-width: 320px')
    expect(useEditorStore.getState().isAgentOpen).toBe(true)
    expect(useEditorStore.getState().dependenciesPanelOpen).toBe(false)
    expect(useEditorStore.getState().projectExplorerPanelOpen).toBe(false)
    expect(useEditorStore.getState().domTreePanel.collapsed).toBe(true)
    expect(within(sidebar).getByTestId('agent-panel')).toBeDefined()
  })

  it('docks Properties into the right sidebar by default and can switch to floating mode', async () => {
    loadProjectWithSelectedHeading()
    renderEditorLayout()

    const rightSidebar = await screen.findByTestId('right-sidebar')

    await waitFor(() => {
      expect(rightSidebar.getAttribute('data-expanded')).toBe('true')
      expect(rightSidebar.getAttribute('data-mode')).toBe('docked')
    }, { timeout: 150 })

    expect(rightSidebar.getAttribute('style')).toContain('--right-sidebar-panel-width: 360px')
    expect(within(rightSidebar).getByTestId('properties-panel').getAttribute('data-variant')).toBe('docked')

    fireEvent.click(within(rightSidebar).getByRole('button', { name: /unpin properties panel/i }))

    await waitFor(() => {
      expect(useEditorStore.getState().propertiesPanelMode).toBe('floating')
      expect(rightSidebar.getAttribute('data-expanded')).toBe('false')
    }, { timeout: 150 })

    const floatingPanel = screen.getByTestId('properties-panel')
    expect(floatingPanel.getAttribute('data-variant')).toBe('floating')

    fireEvent.click(within(floatingPanel).getByRole('button', { name: /dock properties panel/i }))

    await waitFor(() => {
      expect(useEditorStore.getState().propertiesPanelMode).toBe('docked')
      expect(rightSidebar.getAttribute('data-expanded')).toBe('true')
      expect(within(rightSidebar).getByTestId('properties-panel').getAttribute('data-variant')).toBe('docked')
    }, { timeout: 150 })
  })

  it('marks the canvas stage while the right sidebar is open', async () => {
    loadProjectWithSelectedHeading()
    renderEditorLayout()

    const canvasStage = screen.getByTestId('canvas-root').parentElement
    expect(canvasStage).not.toBeNull()

    await waitFor(() => {
      expect(canvasStage!.getAttribute('data-right-sidebar-expanded')).toBe('true')
    }, { timeout: 150 })

    const rightSidebar = screen.getByTestId('right-sidebar')
    fireEvent.click(within(rightSidebar).getByRole('button', { name: /unpin properties panel/i }))

    await waitFor(() => {
      expect(canvasStage!.getAttribute('data-right-sidebar-expanded')).toBe('false')
    }, { timeout: 150 })
  })

  it('resizes both sidebars with keyboard-accessible handles and persists the widths', async () => {
    loadProjectWithSelectedHeading()
    localStorage.setItem(
      LAYOUT_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        panels: {
          project: { open: true },
          properties: { open: true, mode: 'docked', width: 420 },
        },
        sidebars: { leftWidth: 410 },
      }),
    )

    renderEditorLayout()

    const leftSidebar = screen.getByTestId('left-sidebar')
    const rightSidebar = await screen.findByTestId('right-sidebar')

    await waitFor(() => {
      expect(leftSidebar.getAttribute('style')).toContain('--left-sidebar-panel-width: 410px')
      expect(rightSidebar.getAttribute('style')).toContain('--right-sidebar-panel-width: 420px')
    }, { timeout: 150 })

    fireEvent.keyDown(within(leftSidebar).getByRole('separator', { name: /resize left sidebar/i }), {
      key: 'ArrowRight',
    })
    fireEvent.keyDown(within(rightSidebar).getByRole('separator', { name: /resize right sidebar/i }), {
      key: 'ArrowLeft',
    })

    await waitFor(() => {
      const state = useEditorStore.getState()
      expect(state.leftSidebarWidth).toBe(420)
      expect(state.propertiesPanel.width).toBe(430)
      const stored = JSON.parse(localStorage.getItem(LAYOUT_STORAGE_KEY) ?? '{}')
      expect(stored.sidebars.leftWidth).toBe(420)
      expect(stored.panels.properties.width).toBe(430)
    }, { timeout: 150 })
  })

  it('keeps the Properties panel disconnected from the left rail', () => {
    renderEditorLayout()

    const sidebar = screen.getByTestId('left-sidebar')
    const rail = within(sidebar).getByRole('navigation', { name: /panel dock/i })

    expect(within(rail).queryByRole('button', { name: /properties panel/i })).toBeNull()

    act(() => {
      useEditorStore.setState({
        propertiesPanel: { collapsed: false, x: 0, y: 0, width: 360 },
        selectedNodeId: 'selected-for-shortcut',
      } as Parameters<typeof useEditorStore.setState>[0])
    })
    fireEvent.keyDown(document, { key: 'R', ctrlKey: true, shiftKey: true })

    expect(sidebar.getAttribute('data-active-panel')).toBe('layers')
    expect(useEditorStore.getState().propertiesPanel.collapsed).toBe(true)
  })

  it('keeps panel keyboard shortcuts on the permanent rail', () => {
    renderEditorLayout()

    fireEvent.keyDown(document, { key: 'E', ctrlKey: true, shiftKey: true })
    expect(useEditorStore.getState().projectExplorerPanelOpen).toBe(true)

    fireEvent.keyDown(document, { key: 'R', ctrlKey: true, shiftKey: true })
    expect(useEditorStore.getState().propertiesPanel.collapsed).toBe(true)

    fireEvent.keyDown(document, { key: 'i', metaKey: true })
    expect(useEditorStore.getState().isAgentOpen).toBe(true)
  })
})
