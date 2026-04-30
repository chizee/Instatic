/**
 * SliderControl — zero-latency range slider.
 *
 * Guideline #220 (uncontrolled input pattern):
 * - Input is UNCONTROLLED — defaultValue is set once on mount.
 * - onInput fires on every tick and updates the display imperatively via a
 *   ref-based <output> element and aria-valuenow attribute, with zero Zustand
 *   store writes during the drag.
 * - onChange is committed on mouseup/touchend only (one store write per
 *   drag gesture).
 * - Parent must provide a key="{nodeId}" to force re-mount when selection
 *   changes (so defaultValue reflects the new node's props).
 */
import { useRef } from 'react'
import type { ControlProps } from './shared'
import { Slider } from '@ui/components/Slider'
import { cn } from '@ui/cn'
import styles from './controls.module.css'

interface SliderControlProps extends ControlProps<number> {
  min: number
  max: number
  step: number
  unit?: string
}

export function SliderControl({
  propKey,
  value,
  onChange,
  label,
  min,
  max,
  step,
  unit,
  isOverride,
  disabled,
}: SliderControlProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLOutputElement>(null)
  const numericValue = Number(value ?? 0)
  const liveRef = useRef<number>(numericValue)

  /** Sync display on every drag tick — zero store writes */
  const handleInput = () => {
    if (!inputRef.current) return
    const v = inputRef.current.valueAsNumber
    liveRef.current = v
    if (outputRef.current) {
      outputRef.current.textContent = `${v}${unit ? ' ' + unit : ''}`
      // Imperative aria update for screen readers (Guideline #220)
      outputRef.current.setAttribute('aria-valuenow', String(v))
    }
  }

  /** Commit final value to store on drag end */
  const handleCommit = () => {
    onChange(propKey, liveRef.current)
  }

  const displayValue = `${numericValue}${unit ? ' ' + unit : ''}`

  return (
    <div className={cn(styles.controlWrapper, disabled && styles.controlWrapperDisabled)}>
      <div className={styles.labelRow}>
        <label
          htmlFor={`ctrl-${propKey}`}
          className={isOverride ? styles.labelOverride : undefined}
        >
          {label ?? propKey}
        </label>
        <output
          ref={outputRef}
          htmlFor={`ctrl-${propKey}`}
          aria-valuenow={numericValue}
          aria-valuemin={min}
          aria-valuemax={max}
          className={styles.sliderOutput}
        >
          {displayValue}
        </output>
      </div>
      <Slider
        ref={inputRef}
        id={`ctrl-${propKey}`}
        defaultValue={Number(value ?? 0)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-valuetext={displayValue}
        onInput={handleInput}
        onMouseUp={handleCommit}
        onTouchEnd={handleCommit}
        // Keyboard also needs commit (arrow keys fire onChange synchronously)
        onChange={handleCommit}
      />
    </div>
  )
}
