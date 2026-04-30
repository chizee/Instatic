/**
 * ClassPropertyRow — unified CSS property editing row.
 *
 * Renders a single CSSPropertyBag entry as a typed control row.
 * Uses the SAME property-control components as the Module section
 * (TextControl / SliderControl / ColorControl / SelectControl),
 * producing byte-identical DOM + className tokens (PP-18 acceptance criterion).
 *
 * A remove button is overlaid on each row via position:absolute so the
 * control itself is visually unchanged from a module property row.
 *
 * Phase 3 / Task #464 / Spec #671.
 */

import { useCallback, useMemo } from 'react'
import type { CSSPropertyBag } from '../../../core/page-tree/types'
import { TextControl } from '../PropertyControls/TextControl'
import { SliderControl } from '../PropertyControls/SliderControl'
import { ColorControl } from '../PropertyControls/ColorControl'
import { SelectControl } from '../PropertyControls/SelectControl'
import { Button } from '@ui/components/Button'
import { CloseIcon } from '../../../ui/icons/icons/close'
import { cn } from '@ui/cn'
import {
  getCSSPropertyControlType,
  getEnumOptions,
  getSliderConfig,
  cssPropertyLabel,
  NUMBER_TYPED_PROPS,
} from './cssControlTypes'
import styles from './ClassPropertyRow.module.css'

// ---------------------------------------------------------------------------
// ClassPropertyRow
// ---------------------------------------------------------------------------

interface ClassPropertyRowProps {
  property: keyof CSSPropertyBag
  value: string | number | undefined
  isSet?: boolean
  onChange: (property: keyof CSSPropertyBag, value: string | number | undefined) => void
  onRemove: (property: keyof CSSPropertyBag) => void
}

export function ClassPropertyRow({ property, value, isSet = true, onChange, onRemove }: ClassPropertyRowProps) {
  const type = getCSSPropertyControlType(property)
  const label = cssPropertyLabel(String(property))
  const sliderConfig = getSliderConfig(property)

  // ── Adapter: any control's onChange → CSSPropertyBag-typed value ────────
  const handleTextChange = useCallback(
    (_key: string, val: unknown) => {
      onChange(property, String(val ?? ''))
    },
    [property, onChange],
  )

  const handleSliderChange = useCallback(
    (_key: string, numVal: number) => {
      if (NUMBER_TYPED_PROPS.has(property)) {
        // zIndex / opacity: store type is number, pass directly
        onChange(property, numVal)
      } else {
        // String-typed CSS properties: reconstruct "12px" from 12 + unit
        const unit = sliderConfig?.unit ?? ''
        onChange(property, unit ? `${numVal}${unit}` : String(numVal))
      }
    },
    [property, onChange, sliderConfig],
  )

  // ── Parse the current CSS string value to a number for SliderControl ────
  const numericValue = useMemo(() => {
    if (typeof value === 'number') return value
    const n = parseFloat(String(value ?? ''))
    return isNaN(n) ? (sliderConfig?.min ?? 0) : n
  }, [value, sliderConfig])

  // ── Dispatch to the correct control ─────────────────────────────────────
  // Each control renders with its own .controlWrapper so the row is
  // visually identical to a module property row (PP-18).
  let control: React.ReactNode

  switch (type) {
    case 'slider':
      control = sliderConfig ? (
        <SliderControl
          key={`${String(property)}-${String(value ?? '')}`}
          propKey={String(property)}
          value={numericValue}
          onChange={handleSliderChange}
          label={label}
          min={sliderConfig.min}
          max={sliderConfig.max}
          step={sliderConfig.step}
          unit={sliderConfig.unit}
        />
      ) : (
        // Fallback for slider-categorised props without a config (should not happen)
        <TextControl
          propKey={String(property)}
          value={String(value ?? '')}
          onChange={handleTextChange}
          label={label}
        />
      )
      break

    case 'color':
      control = (
        <ColorControl
          key={`${String(property)}-${String(value ?? '')}`}
          propKey={String(property)}
          value={String(value ?? '')}
          onChange={handleTextChange}
          label={label}
        />
      )
      break

    case 'select': {
      const opts = getEnumOptions(property) ?? []
      control = (
        <SelectControl
          propKey={String(property)}
          value={String(value ?? '')}
          onChange={handleTextChange}
          label={label}
          options={[
            { label: '—', value: '' },
            ...opts.map((o) => ({ label: o, value: o })),
          ]}
        />
      )
      break
    }

    case 'text':
    default:
      control = (
        <TextControl
          propKey={String(property)}
          value={String(value ?? '')}
          onChange={handleTextChange}
          label={label}
        />
      )
      break
  }

  return (
    <div
      className={cn(styles.propertyRowWrap, !isSet && styles.propertyRowUnset)}
      data-state={isSet ? 'set' : 'unset'}
      data-testid={`css-property-row-${String(property)}`}
    >
      {/* Control renders with its own .controlWrapper — identical to module rows (PP-18) */}
      {control}

      {/* Remove button: overlaid on the label column; revealed on hover/focus-within */}
      {isSet && (
        <Button
          variant="ghost"
          size="micro"
          iconOnly
          onClick={() => onRemove(property)}
          aria-label={`Remove ${label} property`}
          title={`Remove ${label}`}
          className={styles.removeBtn}
        >
          <CloseIcon size={16} color="currentColor" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}
