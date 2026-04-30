import { useState, type ChangeEvent } from 'react'
import type { ControlProps } from './shared'
import { Input } from '@ui/components/Input'
import { ColorInput } from '@ui/components/ColorInput'
import { cn } from '@ui/cn'
import styles from './controls.module.css'
interface ColorControlProps extends ControlProps<string> {
  format?: 'hex' | 'rgba'
}

export function ColorControl({
  propKey,
  value,
  onChange,
  label,
  isOverride,
  disabled,
}: ColorControlProps) {
  const stringValue = String(value ?? '')
  const [text, setText] = useState(stringValue)

  const handleSwatch = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setText(v)
    onChange(propKey, v)
  }

  const handleText = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const handleTextBlur = () => {
    // Validate before committing
    const s = text.trim()
    const cssSupportsColor =
      typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
        ? CSS.supports('color', s)
        : true
    if (s === '' || cssSupportsColor) {
      onChange(propKey, s)
    } else {
      // Revert to last known-good value
      setText(String(value ?? ''))
    }
  }

  return (
    <div className={cn(styles.controlWrapper, disabled && styles.controlWrapperDisabled)}>
      <div className={styles.labelRow}>
        <label
          htmlFor={`ctrl-${propKey}-text`}
          className={isOverride ? styles.labelOverride : undefined}
        >
          {label ?? propKey}
        </label>
      </div>
      <div className={styles.colorRow}>
        <ColorInput
          id={`ctrl-${propKey}-swatch`}
          value={stringValue}
          disabled={disabled}
          onChange={handleSwatch}
          aria-label={`${label ?? propKey} colour swatch`}
          fieldSize="md"
        />
        {/* Manual text entry */}
        <Input
          id={`ctrl-${propKey}-text`}
          type="text"
          value={text}
          disabled={disabled}
          fieldSize="sm"
          monospace
          onChange={handleText}
          onBlur={handleTextBlur}
          placeholder="#000000 or rgb(…)"
          className={styles.colorText}
        />
      </div>
    </div>
  )
}
