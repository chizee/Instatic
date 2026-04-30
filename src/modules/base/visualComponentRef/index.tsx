/**
 * base.visualComponentRef — Visual Component instance module.
 *
 * Renders a reference to a user-authored Visual Component (VC) on the canvas.
 * Each instance can override individual VC params via propOverrides.
 *
 * Architecture source: Contribution #619 §3, §4, §7, §8.4–8.5
 *
 * Editor canvas behaviour:
 *   - Single-click: selects the instance; PropertiesPanel shows ComponentRefView.
 *   - Double-click: opens the referenced VC in canvas editing mode.
 *     Handled in CanvasRoot via CanvasSelectionContext.onNodeDoubleClick.
 *
 * Publisher:
 *   - render(): safe placeholder — VC HTML emission handled by export.ts §5.
 *   - toJsx(): records VC import; emits <ComponentName {…overrides}/>.
 *
 * Constraint #269: imports from core/ are allowed; no editor/ imports in render/toJsx.
 */

import type { ModuleDefinition } from '../../../core/module-engine/types'
import type { VisualComponentRefProps } from '../../../core/visualComponents/types'
import { registry } from '../../../core/module-engine/registry'
import { VisualComponentRefEditor } from './VisualComponentRefEditor'

// ---------------------------------------------------------------------------
// Module definition
// ---------------------------------------------------------------------------

export const VisualComponentRefModule: ModuleDefinition<VisualComponentRefProps> = {
  id: 'base.visualComponentRef',
  name: 'Component Instance',
  description:
    'A reusable Visual Component instance. Double-click to edit. Override params per-instance.',
  category: 'Components',
  version: '1.0.0',
  icon: 'square-stack',
  trusted: true,
  canHaveChildren: false, // instances do not accept ad-hoc children

  schema: {
    componentId: {
      type: 'text',
      label: 'Component ID',
      description: 'ID of the referenced Visual Component',
    },
    // propOverrides is dynamic — rendered via ComponentRefView, not this schema
  },

  defaults: {
    componentId: '',
    propOverrides: {},
  },

  component: VisualComponentRefEditor,

  render: (_props, _renderedChildren) => {
    // Static HTML for a componentRef is emitted by the publisher (export.ts §5).
    // This fallback is invoked only if a componentRef appears in HTML-mode export,
    // which is unsupported — emit a safe, visible placeholder.
    return {
      html: `<!-- Visual Component instance — only available in React mode -->`,
    }
  },

  toJsx: (props, _renderedChildren) => {
    // The publisher (export.ts) handles VC name resolution and import tracking.
    // This toJsx is a fallback; real emission is driven by vcToComponent.ts.
    // componentId is an internal registry ID — safe to embed.
    const componentId = String(props.componentId ?? '')
    if (!componentId) return `{/* missing component */}`
    return `<VisualComponentRef componentId={${JSON.stringify(componentId)}} />`
  },
}

registry.register(VisualComponentRefModule)
