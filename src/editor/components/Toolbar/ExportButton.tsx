/**
 * ExportButton — dropdown with HTML and React Project export options.
 *
 * Architect decision: all export options (HTML / React) are always visible
 * regardless of projectMode. Users can export in any format at any time.
 *
 * Export flow:
 *   HTML  → exportProjectAsZip()      → downloadZip()       (src/core/publisher/export.ts)
 *   React → exportReactProjectAsZip() → downloadReactZip()  (src/core/react-publisher/export.ts)
 *
 * Accessibility (WCAG 2.1 AA):
 *   - role="menu" / role="menuitem" pattern for the dropdown
 *   - aria-haspopup, aria-expanded on trigger
 *   - Keyboard: Enter/Space/ArrowDown to open, Escape to close, ArrowUp/Down to navigate
 *   - Focus returns to trigger on close (Esc or after export starts)
 *   - Minimum 44×44px touch targets (WCAG 2.5.5)
 *
 * Error handling (Guideline #224): inline error per export type, auto-clears after 5s.
 */

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  type KeyboardEvent,
} from 'react'
import { useEditorStore } from '@core/editor-store/store'
import { registry } from '@core/module-engine/registry'
import { exportProjectAsZip, downloadZip } from '@core/publisher/export'
import { exportReactProjectAsZip, downloadReactZip } from '@core/react-publisher/export'
import { Icon } from '../../../ui/icons/Icon'
import { cn } from '@ui/cn'
import { Button } from '@ui/components/Button'
import styles from './Toolbar.module.css'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ExportType = 'html' | 'react'
type ExportState = 'idle' | 'exporting' | 'error'

interface PerTypeState {
  state: ExportState
  errorMsg: string | null
}

// ---------------------------------------------------------------------------
// ExportButton
// ---------------------------------------------------------------------------

export function ExportButton() {
  const project = useEditorStore((s) => s.project)
  const packageJson = useEditorStore((s) => s.packageJson)

  const [open, setOpen] = useState(false)
  const [exportStates, setExportStates] = useState<Record<ExportType, PerTypeState>>({
    html:  { state: 'idle', errorMsg: null },
    react: { state: 'idle', errorMsg: null },
  })

  const triggerRef  = useRef<HTMLButtonElement>(null)
  const menuRef     = useRef<HTMLDivElement>(null)
  const htmlRef     = useRef<HTMLButtonElement>(null)
  const reactRef    = useRef<HTMLButtonElement>(null)
  const errorTimerRef = useRef<Record<ExportType, ReturnType<typeof setTimeout> | null>>({
    html: null, react: null,
  })

  // ── Close on outside click ──────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // ── Focus first item when menu opens ───────────────────────────────────
  useEffect(() => {
    if (open) htmlRef.current?.focus()
  }, [open])

  // ── Cleanup timers on unmount ───────────────────────────────────────────
  useEffect(() => {
    const timers = errorTimerRef.current
    return () => {
      if (timers.html)  clearTimeout(timers.html)
      if (timers.react) clearTimeout(timers.react)
    }
  }, [])

  // ── Keyboard on trigger ─────────────────────────────────────────────────
  const handleTriggerKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
    }
    if (e.key === 'Escape') setOpen(false)
  }, [])

  // ── Keyboard on menu container ──────────────────────────────────────────
  const handleMenuKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    }
  }, [])

  // ── Run export ──────────────────────────────────────────────────────────
  const runExport = useCallback(async (type: ExportType) => {
    if (!project || exportStates[type].state === 'exporting') return

    // Close menu and return focus to trigger
    setOpen(false)
    triggerRef.current?.focus()

    // Clear any previous error timer
    if (errorTimerRef.current[type]) clearTimeout(errorTimerRef.current[type]!)

    setExportStates((prev) => ({
      ...prev,
      [type]: { state: 'exporting', errorMsg: null },
    }))

    try {
      if (type === 'html') {
        const blob = await exportProjectAsZip(project, registry)
        const name = `${project.name.toLowerCase().replace(/\s+/g, '-') || 'website'}.zip`
        downloadZip(blob, name)
      } else {
        const blob = await exportReactProjectAsZip(project, registry, { packageJson })
        const name = `${project.name.toLowerCase().replace(/\s+/g, '-') || 'react-project'}.zip`
        downloadReactZip(blob, name)
      }
      setExportStates((prev) => ({
        ...prev,
        [type]: { state: 'idle', errorMsg: null },
      }))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setExportStates((prev) => ({
        ...prev,
        [type]: { state: 'error', errorMsg: msg },
      }))
      errorTimerRef.current[type] = setTimeout(() => {
        setExportStates((prev) => ({
          ...prev,
          [type]: { state: 'idle', errorMsg: null },
        }))
      }, 5000)
    }
  }, [project, packageJson, exportStates])

  // ── Derived state ───────────────────────────────────────────────────────
  const htmlState    = exportStates.html
  const reactState   = exportStates.react
  const isExporting  = htmlState.state === 'exporting' || reactState.state === 'exporting'
  const hasError     = htmlState.state === 'error' || reactState.state === 'error'

  const triggerLabel =
    htmlState.state === 'exporting'  ? 'Exporting HTML…'   :
    reactState.state === 'exporting' ? 'Exporting React…'  :
    hasError                         ? 'Export failed'     : 'Export'

  return (
    <div className={styles.exportWrapper}>
      {/* ── Trigger ───────────────────────────────────────────────────── */}
      <Button
        ref={triggerRef}
        variant="secondary"
        size="sm"
        aria-label="Export project"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-busy={isExporting}
        title="Export"
        onClick={() => { if (!isExporting) setOpen((v) => !v) }}
        onKeyDown={handleTriggerKeyDown}
        disabled={!project}
        data-testid="toolbar-export-btn"
        active={!hasError && open}
        tone={hasError ? 'danger' : 'default'}
      >
        {isExporting
          ? <Icon name="loader" size={13} className={styles.spinIcon} />
          : <Icon name="download" size={13} />}
        <span>{triggerLabel}</span>
        <Icon
          name="chevron-down"
          size={10}
          className={cn(styles.exportChevron, open && styles.exportChevronOpen)}
        />
      </Button>

      {/* ── Dropdown menu ─────────────────────────────────────────────── */}
      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Export options"
          onKeyDown={handleMenuKeyDown}
          className={styles.exportMenu}
        >
          <div className={styles.exportMenuHeading}>
            Export as
          </div>

          <ExportMenuItem
            ref={htmlRef}
            icon={<Icon name="code" size={14} />}
            label="HTML Website"
            description="Static HTML files, ready to deploy"
            itemState={htmlState}
            onClick={() => runExport('html')}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); reactRef.current?.focus() }
              if (e.key === 'ArrowUp')   { e.preventDefault(); triggerRef.current?.focus() }
            }}
          />

          <ExportMenuItem
            ref={reactRef}
            icon={<Icon name="file-big-code" size={14} />}
            label="React Project"
            description="Vite + React 18 + TypeScript"
            itemState={reactState}
            onClick={() => runExport('react')}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); htmlRef.current?.focus() }
              if (e.key === 'ArrowUp')   { e.preventDefault(); htmlRef.current?.focus() }
            }}
          />
        </div>
      )}

      {/* ── Error toasts ──────────────────────────────────────────────── */}
      {htmlState.state === 'error' && htmlState.errorMsg && (
        <ErrorToast message={`HTML export failed: ${htmlState.errorMsg}`} />
      )}
      {reactState.state === 'error' && reactState.errorMsg && (
        <ErrorToast message={`React export failed: ${reactState.errorMsg}`} />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ExportMenuItem
// ---------------------------------------------------------------------------

interface ExportMenuItemProps {
  icon: React.ReactNode
  label: string
  description: string
  itemState: PerTypeState
  onClick: () => void
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void
}

const ExportMenuItem = forwardRef<HTMLButtonElement, ExportMenuItemProps>(
  function ExportMenuItem({ icon, label, description, itemState, onClick, onKeyDown }, ref) {
    const { state } = itemState
    const isExporting = state === 'exporting'
    const isError     = state === 'error'

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        menuItem
        role="menuitem"
        disabled={isExporting}
        tone={isError ? 'danger' : 'default'}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {/* icon badge */}
        <span className={cn(
          styles.exportMenuItemIcon,
          isError && styles.exportMenuItemIconError,
        )}>
          {isExporting
            ? <Icon name="loader" size={13} className={styles.spinIcon} />
            : icon}
        </span>

        {/* text */}
        <span className={styles.exportMenuItemText}>
          <span className={cn(
            styles.exportMenuItemLabel,
            isError && styles.exportMenuItemLabelError,
          )}>
            {isExporting ? `${label} — exporting…` : isError ? `${label} — failed` : label}
          </span>
          <span className={styles.exportMenuItemDesc}>
            {description}
          </span>
        </span>
      </Button>
    )
  },
)

// ---------------------------------------------------------------------------
// ErrorToast
// ---------------------------------------------------------------------------

function ErrorToast({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className={styles.exportErrorToast}
    >
      {message}
    </div>
  )
}
