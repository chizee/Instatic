import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { useEditorStore } from '../../core/editor-store/store'
import { buildPageContext } from '../../core/agent/agentSlice'
import { registry } from '../../core/module-engine/registry'
import type { AnyModuleDefinition } from '../../core/module-engine/types'

const DYNAMIC_MODULE_ID = 'custom.dynamicHero'

const dynamicModule: AnyModuleDefinition = {
  id: DYNAMIC_MODULE_ID,
  name: 'Dynamic Hero',
  description: 'Runtime registered hero module',
  category: 'Marketing',
  version: '1.0.0',
  trusted: true,
  canHaveChildren: true,
  schema: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    tone: {
      type: 'select',
      label: 'Tone',
      options: [
        { label: 'Calm', value: 'calm' },
        { label: 'Bold', value: 'bold' },
      ],
    },
  },
  defaults: {
    eyebrow: 'Featured',
    tone: 'bold',
  },
  classStyleBindings: {
    backgroundColor: {
      properties: ['backgroundColor'],
      control: { type: 'color', label: 'Background' },
      defaultValue: '#111827',
      toCSS: (value) => ({ backgroundColor: String(value) }),
      fromCSS: (styles) => styles.backgroundColor ?? '#111827',
    },
  },
  component: () => null,
  render: () => ({ html: '' }),
}

function freshProject() {
  useEditorStore.setState({
    project: null,
    _historyPast: [],
    _historyFuture: [],
    canUndo: false,
    canRedo: false,
    selectedNodeId: null,
    hoveredNodeId: null,
    hasUnsavedChanges: false,
  })
  const state = useEditorStore.getState()
  const project = state.createProject('Agent Context')
  return project.pages[0]
}

beforeEach(() => {
  registry.registerOrReplace(dynamicModule)
})

afterEach(() => {
  registry.unregister(DYNAMIC_MODULE_ID)
})

describe('buildPageContext — dynamic module registry', () => {
  it('includes runtime-registered modules with defaults and schema metadata', () => {
    const page = freshProject()
    const context = buildPageContext(useEditorStore.getState(), page)

    const moduleContext = context.availableModules.find((mod) => mod.id === DYNAMIC_MODULE_ID)
    expect(moduleContext).toBeDefined()
    expect(moduleContext?.name).toBe('Dynamic Hero')
    expect(moduleContext?.canHaveChildren).toBe(true)
    expect(moduleContext?.defaults).toEqual({ eyebrow: 'Featured', tone: 'bold' })
    expect(moduleContext?.props.some((prop) => prop.key === 'eyebrow' && prop.type === 'text')).toBe(true)
    expect(moduleContext?.props.some((prop) =>
      prop.key === 'tone' &&
      prop.options?.some((option) => option.label === 'Bold' && option.value === 'bold'),
    )).toBe(true)
    expect(moduleContext?.styles.some((style) =>
      style.key === 'backgroundColor' &&
      style.cssProperties.includes('backgroundColor') &&
      style.defaultValue === '#111827',
    )).toBe(true)
  })
})
