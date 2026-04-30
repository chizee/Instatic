import { useRef, type CSSProperties } from 'react'
import { selectRightSidebarExpanded, useEditorStore } from '@core/editor-store/store'
import { PropertiesPanel } from '../PropertiesPanel'
import { SidebarResizeHandle } from '../shared/SidebarResizeHandle'
import styles from './RightSidebar.module.css'

export function RightSidebar() {
  const sidebarRef = useRef<HTMLElement | null>(null)
  const propertiesPanel = useEditorStore((s) => s.propertiesPanel)
  const propertiesPanelMode = useEditorStore((s) => s.propertiesPanelMode)
  const setPropertiesPanel = useEditorStore((s) => s.setPropertiesPanel)

  const isDocked = propertiesPanelMode === 'docked'
  const isExpanded = useEditorStore(selectRightSidebarExpanded)
  const panelWidth = isExpanded ? propertiesPanel.width : 0

  const style = {
    '--right-sidebar-panel-width': `${panelWidth}px`,
  } as CSSProperties

  return (
    <aside
      ref={sidebarRef}
      className={styles.sidebar}
      data-testid="right-sidebar"
      data-expanded={isExpanded ? 'true' : 'false'}
      data-mode={propertiesPanelMode}
      style={style}
    >
      {isExpanded && (
        <SidebarResizeHandle
          side="right"
          width={propertiesPanel.width}
          targetRef={sidebarRef}
          cssVariable="--right-sidebar-panel-width"
          ariaLabel="Resize right sidebar"
          onResize={(width) => setPropertiesPanel({ width })}
        />
      )}

      {isDocked && (
        <div
          className={styles.panelSlot}
          data-testid="right-sidebar-panel-slot"
          aria-hidden={isExpanded ? undefined : 'true'}
        >
          <PropertiesPanel variant="docked" />
        </div>
      )}
    </aside>
  )
}
