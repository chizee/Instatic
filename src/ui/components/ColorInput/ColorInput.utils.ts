const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i

export function getColorInputValue(value: unknown, fallback = '#000000') {
  const next = typeof value === 'string' ? value : ''
  return HEX_COLOR_RE.test(next) ? next : fallback
}
