/**
 * ImageControl — image URL input with inline preview thumbnail.
 * For MVP: URL entry only. A full media-picker integration can be
 * added in a future sprint without changing the PropertyControl API.
 *
 * Security (CWE-20): validates URL protocol before storing or rendering
 * the preview. Only https://, http://, and data:image/* are allowed.
 * javascript: and arbitrary data: schemes are rejected to prevent
 * unexpected content in the editor preview and in persisted project props.
 */
import { useState } from 'react'
import type { ControlProps } from './shared'
import { isValidImageUrl } from '../../../core/utils/urlValidation'
import { Input } from '@ui/components/Input'
import { cn } from '@ui/cn'
import styles from './controls.module.css'

export function ImageControl({
  propKey,
  value,
  onChange,
  label,
  isOverride,
  disabled,
}: ControlProps<string>) {
  const src = String(value ?? '')
  // Validate the stored value on initial render so loading a crafted project
  // with a non-image URL shows an error indicator immediately.
  const [error, setError] = useState(() => !isValidImageUrl(src))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    const valid = isValidImageUrl(v)
    setError(!valid)
    if (valid) onChange(propKey, v)
  }

  // Only render preview for validated, non-empty URLs (never for javascript: / data:text)
  const safePreviewSrc = !error && src ? src : ''

  return (
    <div className={cn(styles.controlWrapper, disabled && styles.controlWrapperDisabled)}>
      <div className={styles.labelRow}>
        <label
          htmlFor={`ctrl-${propKey}`}
          className={isOverride ? styles.labelOverride : undefined}
        >
          {label ?? propKey}
        </label>
        {error && (
          <span className={styles.labelError} role="alert">
            Invalid image URL
          </span>
        )}
      </div>

      {/* Preview thumbnail — only shown when URL is valid */}
      {safePreviewSrc && (
        <div className={styles.imagePreview}>
          <img
            src={safePreviewSrc}
            alt="preview"
            className={styles.imagePreviewImg}
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      )}

      <Input
        id={`ctrl-${propKey}`}
        type="url"
        value={src}
        placeholder="https://…"
        disabled={disabled}
        onChange={handleChange}
        invalid={error}
      />
    </div>
  )
}
