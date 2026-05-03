/**
 * Tooltip — lightweight hover-only tooltip primitive.
 *
 * Renders content through a shared portal (#tooltip-root on document.body).
 * Position is computed by an inline helper — no @floating-ui dependency.
 *
 * Hover only: shows on mouseenter, hides on mouseleave, Escape, scroll, or
 * pointerdown outside the trigger.
 *
 * Trigger element: captured from e.currentTarget on mouseenter and stored in
 * state (not a useRef) so that closures passed to cloneElement don't close
 * over a ref value — which is flagged by the react-hooks/refs rule in v7 of
 * eslint-plugin-react-hooks.  bubbleRef (for measuring the portal bubble) is
 * the only useRef; it is read only inside useLayoutEffect (an effect), which
 * is the pattern the rule requires.
 *
 * Accessibility: the tooltip element carries role="tooltip" and a stable id
 * (from useId). The trigger child receives aria-describedby while the tooltip
 * is visible; on hide the attribute is removed.
 */

import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@ui/cn'
import styles from './Tooltip.module.css'

// ─── Public types ─────────────────────────────────────────────────────────────

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right' | 'auto'
export type TooltipAlign = 'start' | 'center' | 'end'

export interface TooltipProps {
  /** Tooltip content — string or simple JSX. */
  content: ReactNode
  /** Which side to prefer. 'auto' tries top→bottom→right→left. Default: 'auto'. */
  side?: TooltipSide
  /** Alignment along the cross-axis. Default: 'center'. */
  align?: TooltipAlign
  /** Gap between trigger and tooltip bubble in px. Default: 8. */
  offset?: number
  /** If true, render children as-is without any tooltip wrapping. */
  disabled?: boolean
  /** Single trigger element. Must accept mouse event handlers. */
  children: ReactElement
}

// ─── Portal root ─────────────────────────────────────────────────────────────

/** Lazily appends a single #tooltip-root container to document.body. */
function getTooltipRoot(): HTMLElement {
  let root = document.getElementById('tooltip-root')
  if (!root) {
    root = document.createElement('div')
    root.id = 'tooltip-root'
    document.body.appendChild(root)
  }
  return root
}

// ─── Position computation ─────────────────────────────────────────────────────

const VIEWPORT_MARGIN = 8
/** Half of the 6px rotated-square arrow. */
const ARROW_HALF = 3
/** Minimum arrow offset from bubble edge to keep arrow visually anchored. */
const ARROW_EDGE_PAD = 6

type ResolvedSide = 'top' | 'bottom' | 'left' | 'right'

interface Position {
  x: number
  y: number
  /** Distance from the bubble's leading edge to the arrow center, in px. */
  arrowOffset: number
  side: ResolvedSide
}

function alignedX(trigger: DOMRect, tooltipWidth: number, align: TooltipAlign): number {
  if (align === 'start') return trigger.left
  if (align === 'end') return trigger.right - tooltipWidth
  return trigger.left + trigger.width / 2 - tooltipWidth / 2
}

function alignedY(trigger: DOMRect, tooltipHeight: number, align: TooltipAlign): number {
  if (align === 'start') return trigger.top
  if (align === 'end') return trigger.bottom - tooltipHeight
  return trigger.top + trigger.height / 2 - tooltipHeight / 2
}

function sideCandidate(
  side: ResolvedSide,
  trigger: DOMRect,
  tw: number,
  th: number,
  align: TooltipAlign,
  offset: number,
): { x: number; y: number; fits: boolean; arrowOffset: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight

  let rawX: number
  let rawY: number

  if (side === 'top') {
    rawX = alignedX(trigger, tw, align)
    rawY = trigger.top - th - offset - ARROW_HALF
  } else if (side === 'bottom') {
    rawX = alignedX(trigger, tw, align)
    rawY = trigger.bottom + offset + ARROW_HALF
  } else if (side === 'left') {
    rawX = trigger.left - tw - offset - ARROW_HALF
    rawY = alignedY(trigger, th, align)
  } else {
    rawX = trigger.right + offset + ARROW_HALF
    rawY = alignedY(trigger, th, align)
  }

  const fits =
    rawX >= VIEWPORT_MARGIN &&
    rawX + tw <= vw - VIEWPORT_MARGIN &&
    rawY >= VIEWPORT_MARGIN &&
    rawY + th <= vh - VIEWPORT_MARGIN

  const x = Math.max(VIEWPORT_MARGIN, Math.min(rawX, vw - tw - VIEWPORT_MARGIN))
  const y = Math.max(VIEWPORT_MARGIN, Math.min(rawY, vh - th - VIEWPORT_MARGIN))

  let arrowOffset: number
  if (side === 'top' || side === 'bottom') {
    const cx = trigger.left + trigger.width / 2
    arrowOffset = Math.max(ARROW_EDGE_PAD, Math.min(tw - ARROW_EDGE_PAD, cx - x))
  } else {
    const cy = trigger.top + trigger.height / 2
    arrowOffset = Math.max(ARROW_EDGE_PAD, Math.min(th - ARROW_EDGE_PAD, cy - y))
  }

  return { x, y, fits, arrowOffset }
}

function computePosition(
  trigger: DOMRect,
  tw: number,
  th: number,
  side: TooltipSide,
  align: TooltipAlign,
  offset: number,
): Position {
  const vw = window.innerWidth
  const vh = window.innerHeight

  const candidates: ResolvedSide[] =
    side === 'auto' ? ['top', 'bottom', 'right', 'left'] : [side as ResolvedSide]

  // Try each side in priority order; return on the first that fits.
  for (const s of candidates) {
    const c = sideCandidate(s, trigger, tw, th, align, offset)
    if (c.fits) return { x: c.x, y: c.y, arrowOffset: c.arrowOffset, side: s }
  }

  // No side fits — pick the one with the most available space and clamp.
  const scored = (
    side === 'auto'
      ? (['top', 'bottom', 'right', 'left'] as ResolvedSide[])
      : [side as ResolvedSide]
  ).map((s) => {
    const space =
      s === 'top' ? trigger.top :
      s === 'bottom' ? vh - trigger.bottom :
      s === 'right' ? vw - trigger.right :
      trigger.left
    return { s, space }
  })
  scored.sort((a, b) => b.space - a.space)
  const best = scored[0].s
  const c = sideCandidate(best, trigger, tw, th, align, offset)
  return { x: c.x, y: c.y, arrowOffset: c.arrowOffset, side: best }
}

// ─── Inner component (all hooks live here) ───────────────────────────────────

/** Props the Tooltip composes with on the trigger child. */
interface TriggerChildProps {
  onMouseEnter?: React.MouseEventHandler<HTMLElement>
  onMouseLeave?: React.MouseEventHandler<HTMLElement>
  'aria-describedby'?: string
}

function TooltipInner({
  content,
  side,
  align,
  offset,
  children,
}: Required<Omit<TooltipProps, 'disabled'>>) {
  const id = useId()
  const [shown, setShown] = useState(false)
  const [position, setPosition] = useState<Position | null>(null)
  // State (not useRef) so closures passed to cloneElement never close over a
  // ref value — which is disallowed during render by react-hooks/refs.
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null)
  // bubbleRef is only ever read inside useLayoutEffect (an effect), which is
  // the safe pattern the react-hooks/refs rule requires.
  const bubbleRef = useRef<HTMLDivElement>(null)

  const hide = useCallback(() => {
    setShown(false)
    setPosition(null)
  }, [])

  // Measure bubble and compute position after it enters the DOM.
  useLayoutEffect(() => {
    if (!shown || !triggerEl || !bubbleRef.current) return
    const triggerRect = triggerEl.getBoundingClientRect()
    const { width, height } = bubbleRef.current.getBoundingClientRect()
    setPosition(computePosition(triggerRect, width, height, side, align, offset))
  }, [shown, triggerEl, side, align, offset])

  // Global dismiss: scroll (hide), Escape (hide), pointerdown outside (hide).
  useEffect(() => {
    if (!shown || !triggerEl) return

    const onScroll = () => hide()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide()
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!triggerEl.contains(e.target as Node)) hide()
    }

    window.addEventListener('scroll', onScroll, { capture: true, passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)

    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [shown, triggerEl, hide])

  // Compose with the child's existing handlers; inject aria-describedby.
  // Closures here capture only state setters and callbacks — no useRef values.
  const childTyped = children as ReactElement<TriggerChildProps>
  const existingMouseEnter = childTyped.props.onMouseEnter
  const existingMouseLeave = childTyped.props.onMouseLeave

  const cloned = cloneElement(childTyped, {
    'aria-describedby': shown ? id : undefined,
    onMouseEnter(e: React.MouseEvent<HTMLElement>) {
      existingMouseEnter?.(e)
      // Capture the trigger element from the event (event handler, not render).
      setTriggerEl(e.currentTarget)
      setShown(true)
    },
    onMouseLeave(e: React.MouseEvent<HTMLElement>) {
      existingMouseLeave?.(e)
      hide()
    },
  })

  const bubbleStyle = {
    '--tooltip-x': position ? `${position.x}px` : '0px',
    '--tooltip-y': position ? `${position.y}px` : '0px',
    '--tooltip-arrow-offset': position ? `${position.arrowOffset}px` : '0px',
  } as CSSProperties

  return (
    <>
      {cloned}
      {shown &&
        createPortal(
          <div
            ref={bubbleRef}
            id={id}
            role="tooltip"
            className={cn(styles.bubble, position !== null && styles.visible)}
            data-side={position?.side ?? 'top'}
            style={bubbleStyle}
          >
            {content}
            <div className={styles.arrow} />
          </div>,
          getTooltipRoot(),
        )}
    </>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────

/**
 * Tooltip wraps a single trigger element and shows a floating label on hover.
 *
 * When `disabled` is true the children are returned untouched — no portal,
 * no event handlers, no aria injection.
 */
export function Tooltip({
  disabled = false,
  side = 'auto',
  align = 'center',
  offset = 8,
  content,
  children,
}: TooltipProps) {
  // Return children as-is; no hooks needed in the disabled path.
  if (disabled) return children

  return (
    <TooltipInner content={content} side={side} align={align} offset={offset}>
      {children}
    </TooltipInner>
  )
}
