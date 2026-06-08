/**
 * Shared HTML id support for base modules that emit ordinary authored
 * elements. The publisher passes plain string props through `escapeProps()`
 * before render(), so `htmlIdAttr()` must not HTML-escape again.
 */
import type { PropertyControl } from '@core/module-engine'

export const HtmlIdPropSchemaOptions = { default: '' } as const

export function htmlIdControl(): PropertyControl {
  return {
    type: 'text',
    label: 'HTML ID',
    placeholder: 'e.g. preloader',
    category: 'layout',
  }
}

export function normalizeHtmlId(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function htmlIdAttr(value: unknown): string {
  const id = normalizeHtmlId(value)
  return id ? ` id="${id}"` : ''
}

export function htmlIdForReact(value: unknown): string | undefined {
  const id = normalizeHtmlId(value)
  return id || undefined
}
