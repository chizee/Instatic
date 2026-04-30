/**
 * SettingsButton — opens the Settings modal.
 */
import { useEditorStore } from '@core/editor-store/store'
import { Icon } from '../../../ui/icons/Icon'
import { Button } from '@ui/components/Button'

export function SettingsButton() {
  const openSettings = useEditorStore((s) => s.openSettingsModal)

  return (
    <Button
      variant="ghost"
      size="sm"
      iconOnly
      aria-label="Open settings"
      title="Settings"
      onClick={() => openSettings('pages')}
      data-testid="toolbar-settings-btn"
    >
      <Icon name="settings-cog" size={16} aria-hidden="true" />
    </Button>
  )
}
