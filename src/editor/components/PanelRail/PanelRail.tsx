import { useEffect } from 'react'
import { useEditorStore } from '@core/editor-store/store'
import type { LeftSidebarPanelId } from '@core/editor-store/slices/uiSlice'
import { Icon } from '../../../ui/icons/Icon'
import { Button } from '@ui/components/Button'
import styles from './PanelRail.module.css'

type RailAccent = 'mint' | 'lilac' | 'sky' | 'peach'

interface PrimaryRailItem {
  id: LeftSidebarPanelId
  label: string
  icon: string
  accent: RailAccent
  ariaKeyshortcuts?: string
  shortcutLabel?: string
}

interface RailItem {
  id: string
  label: string
  icon: string
  accent: RailAccent
  open: boolean
  disabled?: boolean
  onToggle: () => void
  disabledTitle?: string
  ariaKeyshortcuts?: string
  shortcutLabel?: string
}

const PRIMARY_RAIL_ITEMS: PrimaryRailItem[] = [
  {
    id: 'layers',
    label: 'Layers',
    icon: 'bulletlist-2-sharp',
    accent: 'mint',
  },
  {
    id: 'agent',
    label: 'AI assistant',
    icon: 'ai-settings-solid',
    accent: 'lilac',
    ariaKeyshortcuts: 'Meta+I',
    shortcutLabel: 'Cmd+I',
  },
  {
    id: 'project',
    label: 'Project',
    icon: 'files-stack-2',
    accent: 'sky',
    ariaKeyshortcuts: 'Control+Shift+E',
    shortcutLabel: 'Ctrl+Shift+E',
  },
  {
    id: 'dependencies',
    label: 'Dependencies',
    icon: 'box-stack',
    accent: 'peach',
  },
]

export function PanelRail() {
  const domOpen = useEditorStore((s) => !s.domTreePanel.collapsed)
  const projectOpen = useEditorStore((s) => s.projectExplorerPanelOpen)
  const dependenciesOpen = useEditorStore((s) => s.dependenciesPanelOpen)
  const agentOpen = useEditorStore((s) => s.isAgentOpen)

  const toggleLeftSidebarPanel = useEditorStore((s) => s.toggleLeftSidebarPanel)

  useEffect(() => {
    function isTypingTarget(target: EventTarget | null) {
      const element = target as HTMLElement | null
      return Boolean(element && (
        element.tagName === 'INPUT' ||
        element.tagName === 'TEXTAREA' ||
        element.isContentEditable
      ))
    }

    function onKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return

      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        useEditorStore.getState().toggleLeftSidebarPanel('project')
      } else if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault()
        useEditorStore.getState().togglePropertiesPanel()
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault()
        useEditorStore.getState().toggleLeftSidebarPanel('agent')
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const panelOpenById = {
    layers: domOpen,
    agent: agentOpen,
    project: projectOpen,
    dependencies: dependenciesOpen,
  } satisfies Record<LeftSidebarPanelId, boolean>

  const primaryItems: RailItem[] = PRIMARY_RAIL_ITEMS.map((item) => ({
    ...item,
    open: panelOpenById[item.id],
    onToggle: () => toggleLeftSidebarPanel(item.id),
  }))

  return (
    <nav
      aria-label="Panel dock"
      className={styles.rail}
      data-testid="panel-rail"
    >
      <div className={styles.itemGroup}>
        {primaryItems.map((item) => (
          <RailButton key={item.id} item={item} />
        ))}
      </div>
    </nav>
  )
}

function RailButton({ item }: { item: RailItem }) {
  const action = item.open ? 'Close' : 'Open'
  const title = item.disabled
    ? item.disabledTitle
    : item.shortcutLabel
      ? `${item.label} panel (${item.shortcutLabel})`
      : `${item.label} panel`

  return (
    <Button
      variant="ghost"
      size="md"
      iconOnly
      pressed={item.open}
      aria-label={`${action} ${item.label} panel`}
      aria-keyshortcuts={item.ariaKeyshortcuts}
      disabled={item.disabled}
      title={title}
      data-testid={`panel-rail-${item.id}`}
      data-icon={item.icon}
      data-accent={item.accent}
      onClick={item.onToggle}
      className={styles.railButton}
    >
      <span className={styles.activeIndicator} aria-hidden="true" />
      <Icon name={item.icon} size={16} className={styles.railIcon} />
    </Button>
  )
}
