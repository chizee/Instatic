/**
 * SaveIndicator — shows "Saved" or "Unsaved changes" pill in the toolbar.
 *
 * Subscribes only to `hasUnsavedChanges` — re-renders on that flag only.
 * J12 (LocalAdapter) sets this flag via `setHasUnsavedChanges()` on
 * auto-save and on explicit Cmd+S.
 *
 * The pill uses role="status" so screen readers announce state changes
 * without interrupting the user's workflow (polite, not assertive).
 */

import { useEditorStore } from '@core/editor-store/store'
import { cn } from '@ui/cn'
import styles from './Toolbar.module.css'

export function SaveIndicator() {
  const hasUnsaved = useEditorStore((s) => s.hasUnsavedChanges)

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="save-indicator"
      aria-label={hasUnsaved ? 'Unsaved changes' : 'All changes saved'}
      className={cn(
        styles.pill,
        hasUnsaved ? styles.pillUnsaved : styles.pillSaved,
      )}
    >
      {/* Status dot */}
      <span
        aria-hidden="true"
        className={cn(
          styles.dot,
          hasUnsaved ? styles.dotUnsaved : styles.dotSaved,
        )}
      />
      {hasUnsaved ? 'Unsaved changes' : 'Saved'}
    </div>
  )
}
