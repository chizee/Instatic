/**
 * CanvasModeToggle — Design / Preview switch for the canvas surface.
 *
 * - Design mode: the live React-based module renderer is shown. Property edits
 *   are reactive, no scripts are executed in the canvas.
 * - Preview mode: the runtime-preview iframe is shown. Site scripts run in
 *   their sandbox and authors can interact with them. Property/class edits do
 *   not auto-rebuild the iframe; the user clicks Refresh (or navigates page,
 *   breakpoint, or edits scripts/deps) to rebuild.
 *
 * The two modes are mutually exclusive, replacing the previous architecture
 * where the iframe was stacked over the design canvas and constantly rebuilt
 * to look "live" (which caused scripts to re-execute on every keystroke).
 */
import { useCallback, type SyntheticEvent } from 'react'
import { useEditorStore } from '@core/editor-store/store'
import { CursorMinimalIcon } from 'pixel-art-icons/icons/cursor-minimal'
import { EyeIcon } from 'pixel-art-icons/icons/eye'
import { cn } from '@ui/cn'
import { Tooltip } from '@ui/components/Tooltip'
import styles from './CanvasModeToggle.module.css'

export function CanvasModeToggle() {
  const view = useEditorStore((s) => s.canvasView)
  const setView = useEditorStore((s) => s.setCanvasView)

  // The toggle lives inside the canvas surface, which has its own click /
  // keyboard handlers (deselect, shortcuts, etc.). Stop propagation so the
  // tab buttons feel like chrome, not "clicks on empty canvas".
  const stopCanvasInteraction = useCallback((event: SyntheticEvent) => {
    event.stopPropagation()
  }, [])

  return (
    <div
      className={styles.shell}
      role="tablist"
      aria-label="Canvas mode"
      data-testid="canvas-mode-toggle"
      onClick={stopCanvasInteraction}
    >
      <Tooltip content="Design mode (edit page visually)">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'design'}
          aria-label="Design"
          data-testid="canvas-mode-toggle-design"
          className={cn(styles.tab, view === 'design' && styles.tabActive)}
          onClick={() => setView('design')}
        >
          <CursorMinimalIcon size={14} aria-hidden="true" />
        </button>
      </Tooltip>
      <Tooltip content="Preview mode (run site scripts in sandboxed iframe)">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'preview'}
          aria-label="Preview"
          data-testid="canvas-mode-toggle-preview"
          className={cn(styles.tab, view === 'preview' && styles.tabActive)}
          onClick={() => setView('preview')}
        >
          <EyeIcon size={14} aria-hidden="true" />
        </button>
      </Tooltip>
    </div>
  )
}
