const DATA_ATTRIBUTE_NAME_RE = /^data-[a-z0-9_.:-]+$/i
const RESERVED_DATA_PREFIX_RE = /^data-(instatic|canvas)-/i
const RESERVED_DATA_NAMES = new Set([
  'data-node-id',
  'data-module-id',
  'data-hovered',
])

export function isRenderableDataAttributeName(name: string): boolean {
  const normalised = name.trim().toLowerCase()
  return (
    DATA_ATTRIBUTE_NAME_RE.test(normalised) &&
    !RESERVED_DATA_PREFIX_RE.test(normalised) &&
    !RESERVED_DATA_NAMES.has(normalised)
  )
}
