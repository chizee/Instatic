/**
 * Shared types for property controls.
 *
 * Styles are now in controls.module.css — imported per-component.
 * This file only exports TypeScript interfaces.
 */

/** Props shared by every property control component. */
export interface ControlProps<T = unknown> {
  /** Property key in the node's props map */
  propKey: string
  /** Current value */
  value: T
  /** Fires whenever the value changes — causes an immediate store update */
  onChange: (propKey: string, value: T) => void
  /** Optional label override (falls back to schema label) */
  label?: string
  /** Whether the control is for a breakpoint override (highlights modified props) */
  isOverride?: boolean
  /** Disable the control */
  disabled?: boolean
}
