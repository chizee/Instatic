import {
  forwardRef,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Button, type ButtonProps } from '@ui/components/Button'
import { Separator } from '@ui/components/Separator'
import { ChevronRightIcon } from 'pixel-art-icons/icons/chevron-right'
import { cn } from '@ui/cn'
import styles from './ContextMenu.module.css'

interface ContextMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  x: number
  y: number
  ariaLabel: string
  onClose: () => void
  children: ReactNode
  minWidth?: number
  width?: number
  zIndex?: number
  menuClassName?: string
}

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu(
  {
    x,
    y,
    ariaLabel,
    onClose,
    children,
    minWidth = 176,
    width = minWidth,
    zIndex = 1000,
    menuClassName,
    onKeyDown,
    ...props
  },
  ref,
) {
  const style = {
    '--context-menu-x': `${x}px`,
    '--context-menu-y': `${y}px`,
    '--context-menu-min-width': `${minWidth}px`,
    '--context-menu-width': `${width}px`,
    '--context-menu-z-index': zIndex,
  } as CSSProperties

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
    onKeyDown?.(event)
  }

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={onClose}
        onContextMenu={(event) => {
          event.preventDefault()
          onClose()
        }}
        style={style}
      />
      <div
        ref={ref}
        role="menu"
        aria-label={ariaLabel}
        className={cn(styles.menu, menuClassName)}
        style={style}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </>
  )
})

interface ContextMenuItemProps extends Omit<ButtonProps, 'variant' | 'size' | 'menuItem' | 'tone'> {
  danger?: boolean
}

export const ContextMenuItem = forwardRef<HTMLButtonElement, ContextMenuItemProps>(
  function ContextMenuItem({ danger = false, className, children, ...props }, ref) {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="xs"
        menuItem
        role="menuitem"
        tone={danger ? 'danger' : 'default'}
        className={cn(styles.item, className)}
        {...props}
      >
        {children}
      </Button>
    )
  },
)

export function ContextMenuSeparator() {
  return <Separator spacing="compact" className={styles.separator} />
}

// ---------------------------------------------------------------------------
// ContextMenuSubmenu
// ---------------------------------------------------------------------------

interface ContextMenuSubmenuProps {
  /** Trigger label — displayed on the submenu row */
  label: ReactNode
  /** Optional icon shown to the left of the label (use pixel-art-icons) */
  icon?: ReactNode
  /**
   * Called after a submenu item is clicked — typically the parent menu's
   * `onClose` handler so the entire menu closes when an item is selected.
   */
  onClose?: () => void
  /** Submenu items — typically `ContextMenuItem` elements */
  children: ReactNode
  /** z-index base for the submenu panel (submenu uses zIndex + 10). Default: 1000 */
  zIndex?: number
}

/**
 * Nested submenu trigger for ContextMenu.
 *
 * Renders a trigger row (role="menuitem") with a trailing chevron. Hovering
 * or pressing ArrowRight opens a positioned submenu panel to the right.
 * ArrowLeft or Escape closes the submenu without closing the parent menu.
 * Clicking a submenu item calls `onClose` (if provided) to close the parent.
 *
 * Usage:
 * ```tsx
 * <ContextMenuSubmenu label="Insert here" icon={<PlusIcon size={12} />} onClose={close}>
 *   <ContextMenuItem onClick={...}>Item A</ContextMenuItem>
 * </ContextMenuSubmenu>
 * ```
 */
export function ContextMenuSubmenu({
  label,
  icon,
  onClose,
  children,
  zIndex = 1000,
}: ContextMenuSubmenuProps) {
  const [open, setOpen] = useState(false)
  const [submenuStyle, setSubmenuStyle] = useState<CSSProperties>({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const submenuRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Snapshot the trigger's bounding rect and return the submenu CSS vars.
  // Called in event handlers (never during render) so ref access is safe.
  function snapshotSubmenuStyle(): CSSProperties {
    const rect = triggerRef.current?.getBoundingClientRect()
    const x = rect ? rect.right + 2 : 0
    const y = rect ? rect.top : 0
    return {
      '--context-menu-x': `${x}px`,
      '--context-menu-y': `${y}px`,
      '--context-menu-z-index': zIndex + 10,
      '--context-menu-min-width': '176px',
      '--context-menu-width': '176px',
    } as CSSProperties
  }

  // Open submenu: snapshot position, show panel, auto-focus first item via rAF.
  function openSubmenu() {
    setSubmenuStyle(snapshotSubmenuStyle())
    setOpen(true)
    requestAnimationFrame(() => {
      const first = submenuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')
      first?.focus()
    })
  }

  // Schedule a delayed close — cancelled if mouse re-enters trigger or submenu.
  function scheduleClose() {
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
      closeTimerRef.current = null
    }, 100)
  }

  function cancelClose() {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  function handleTriggerClick() {
    if (open) {
      setOpen(false)
    } else {
      openSubmenu()
    }
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      openSubmenu()
    }
  }

  function handleSubmenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft' || event.key === 'Escape') {
      // Close submenu only — stop propagation so parent ContextMenu's
      // Escape handler does NOT fire (closing submenu ≠ closing parent).
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
      triggerRef.current?.focus()
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const items = [
        ...(submenuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []),
      ]
      const currentIndex = items.indexOf(document.activeElement as HTMLElement)
      const next = currentIndex + (event.key === 'ArrowDown' ? 1 : -1)
      if (next >= 0 && next < items.length) {
        items[next].focus()
      }
    }
  }

  // Any click inside the submenu panel closes both submenu and parent menu.
  function handleSubmenuClick() {
    setOpen(false)
    onClose?.()
  }

  return (
    <div className={styles.submenuRoot}>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="xs"
        menuItem
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={open}
        fullWidth
        align="between"
        className={cn(styles.item, styles.submenuTrigger)}
        onMouseEnter={() => {
          cancelClose()
          openSubmenu()
        }}
        onMouseLeave={scheduleClose}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={styles.submenuTriggerContent}>
          {icon && <span aria-hidden="true">{icon}</span>}
          {label}
        </span>
        <span aria-hidden="true" className={styles.submenuChevron}>
          <ChevronRightIcon size={10} color="currentColor" />
        </span>
      </Button>
      {open && (
        <div
          ref={submenuRef}
          role="menu"
          aria-label={typeof label === 'string' ? label : undefined}
          className={styles.menu}
          style={submenuStyle}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          onKeyDown={handleSubmenuKeyDown}
          onClick={handleSubmenuClick}
        >
          {children}
        </div>
      )}
    </div>
  )
}
