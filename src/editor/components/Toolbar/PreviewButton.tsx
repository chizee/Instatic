/**
 * PreviewButton — opens the in-browser preview overlay (Phase 7).
 *
 * WCAG 2.5.5: 44×44px minimum touch target.
 */
import { useEditorStore } from '@core/editor-store/store'
import { Icon } from '../../../ui/icons/Icon'
import { Button } from '@ui/components/Button'

export function PreviewButton() {
  const openPreview = useEditorStore((s) => s.openPreview)
  const project = useEditorStore((s) => s.project)
  const disabled = !project

  return (
    <Button
      variant="secondary"
      size="sm"
      aria-label="Preview page"
      title="Preview published output"
      onClick={() => openPreview()}
      disabled={disabled}
      data-testid="toolbar-preview-btn"
    >
      <Icon name="eye" size={14} aria-hidden="true" />
      <span>Preview</span>
    </Button>
  )
}
