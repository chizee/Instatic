import type { ControlProps } from './shared'
import { Textarea } from '@ui/components/Input'
import { cn } from '@ui/cn'
import styles from './controls.module.css'

interface TextareaControlProps extends ControlProps<string> {
  rows?: number
  placeholder?: string
}

export function TextareaControl({ propKey, value, onChange, label, rows = 3, placeholder, isOverride, disabled }: TextareaControlProps) {
  return (
    <div className={cn(styles.controlWrapper, disabled && styles.controlWrapperDisabled)}>
      <div className={styles.labelRow}>
        <label
          htmlFor={`ctrl-${propKey}`}
          className={isOverride ? styles.labelOverride : undefined}
        >
          {label ?? propKey}
        </label>
      </div>
      <Textarea
        id={`ctrl-${propKey}`}
        value={value ?? ''}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(propKey, e.target.value)}
      />
    </div>
  )
}
