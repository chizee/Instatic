/**
 * Hidden imported `data-*` attribute support for base modules that emit
 * ordinary authored elements. These attributes are used by many static HTML
 * templates as runtime hooks (`data-bg-src`, `data-aos`, `data-bs-*`, …).
 *
 * The prop is intentionally hidden from the Properties panel. It preserves
 * imported behaviour without making arbitrary attributes a first-class editing
 * surface.
 */
import type { PropertyControl } from '@core/module-engine'
import { isRenderableDataAttributeName } from '@core/htmlAttributes'
import { escapeHtml } from '@modules/base/utils/escape'

export const DataAttributesPropSchemaOptions = { default: {} } as const

export function dataAttributesControl(): PropertyControl {
  return {
    type: 'group',
    label: 'Data attributes',
    hidden: true,
    children: {},
  }
}

export function normalizeDataAttributes(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}

  const attrs: Record<string, string> = {}
  for (const [rawName, rawValue] of Object.entries(value as Record<string, unknown>)) {
    const name = rawName.trim().toLowerCase()
    if (!isRenderableDataAttributeName(name)) continue
    if (typeof rawValue !== 'string') continue
    attrs[name] = rawValue
  }
  return attrs
}

export function dataAttributesAttr(value: unknown): string {
  const attrs = normalizeDataAttributes(value)
  return Object.entries(attrs)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, attrValue]) => ` ${name}="${escapeHtml(attrValue)}"`)
    .join('')
}

export function dataAttributesForReact(value: unknown): Record<string, string> {
  return normalizeDataAttributes(value)
}
