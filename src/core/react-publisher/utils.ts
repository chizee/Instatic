/**
 * ReactPublisher — JSX generation utilities.
 *
 * Security (Constraints #303, #290 — CWE-94 code injection prevention):
 * - jsxStr(): User-controlled string values MUST be embedded via JSON.stringify.
 *   e.g. `<h2>{${JSON.stringify(props.text)}}</h2>`
 * - buildJsxStyle(): CSS property values are embedded as JSON string literals
 *   inside a React style object — safe because React applies them via the DOM
 *   style API (not as raw CSS string injection).
 * - Constrained-set props (enums, booleans) and numeric CSS values may be
 *   embedded directly since they cannot contain injection payloads.
 *
 * Isolation (Constraint #269 / #271):
 * - MUST NOT import from src/core/publisher/ or src/editor/.
 */

// ---------------------------------------------------------------------------
// Style object builder
// ---------------------------------------------------------------------------

/**
 * Build a JSX-safe inline style object string from a CSS property map.
 * Returns the full `{{ ... }}` double-brace expression for use as a JSX style prop.
 *
 * All values are passed through JSON.stringify to ensure embedded quotes and
 * backslashes are safely escaped in the generated source file.
 *
 * @example
 * buildJsxStyle({ color: '#0f172a', fontSize: '36px' })
 * // → `{{ color: "#0f172a", fontSize: "36px" }}`
 */
export function buildJsxStyle(
  styles: Record<string, string | number | undefined>,
): string {
  const entries = Object.entries(styles)
    .filter(([, v]) => v !== undefined && v !== '' && v !== null)
    .map(([k, v]) => `${k}: ${JSON.stringify(String(v))}`)
  if (entries.length === 0) return '{{}}'
  return `{{ ${entries.join(', ')} }}`
}

// ---------------------------------------------------------------------------
// Text / attribute value helpers
// ---------------------------------------------------------------------------

/**
 * Embed a user-controlled string as a safe JSX text expression.
 *
 * Uses JSON.stringify to create a JS string literal — when the generated file
 * is compiled by Vite/React, JSX renders it as text (HTML-escaped by React),
 * never as raw HTML (CWE-94 prevention, Constraints #303 / #290).
 *
 * @example
 * jsxStr(props.text)  // → `{"Hello <world>"}`
 */
export function jsxStr(value: unknown): string {
  return `{${JSON.stringify(String(value ?? ''))}}`
}

/**
 * Embed a validated URL as a safe JSX attribute value.
 * Blocks javascript: / vbscript: / data: schemes.
 * Returns '#' if the URL is unsafe (same contract as safeUrl() in module utils).
 *
 * Separate from jsxStr() to make URL validation explicit at the call site.
 */
export function jsxUrl(value: unknown): string {
  const raw = String(value ?? '').trim()
  const safe = isSafeUrlScheme(raw) ? raw : '#'
  return `{${JSON.stringify(safe)}}`
}

/**
 * Minimal URL scheme check — mirrors isSafeUrl() from src/core/publisher/utils.ts
 * without importing from the publisher (Constraint #269).
 *
 * Blocks javascript:, vbscript:, data: schemes.
 * Tab/newline normalisation mirrors the WHATWG URL parser (same logic as publisher).
 */
function isSafeUrlScheme(url: string): boolean {
  if (!url || url === '#') return true
  // Normalise whitespace characters that the WHATWG URL parser strips before scheme detection
  const normalised = url.replace(/[\t\n\r]/g, '').toLowerCase()
  return (
    !normalised.startsWith('javascript:') &&
    !normalised.startsWith('vbscript:') &&
    !normalised.startsWith('data:')
  )
}

// ---------------------------------------------------------------------------
// Helpers for conditional attributes
// ---------------------------------------------------------------------------

/**
 * Produce a JSX attribute fragment from an optional string value.
 * Returns an empty string when value is falsy (safe omission).
 *
 * @example
 * jsxAttr('alt', props.alt)  // → ` alt={"Profile photo"}`
 */
export function jsxAttr(name: string, value: unknown): string {
  const s = String(value ?? '')
  if (!s) return ''
  return ` ${name}={${JSON.stringify(s)}}`
}
