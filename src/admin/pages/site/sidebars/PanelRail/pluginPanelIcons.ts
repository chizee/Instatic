/**
 * Plugin panel icon registry — maps `iconName` strings declared by plugins
 * via `definePluginPanel({ iconName })` to actual `pixel-art-icons` React
 * components.
 *
 * The registry is intentionally curated: plugins can't reach into arbitrary
 * icon files at runtime (no dynamic import, no string-to-module shims), so
 * the rail's bundle stays tree-shakeable and the surface area authors
 * compile against is explicit. Unknown names fall back to `BoxIcon`.
 *
 * Adding a new icon: import it here and add a record entry. That's it.
 *
 * The list intentionally covers the high-frequency "sidebar panel" verbs —
 * extension / inspector / settings / data / docs — without bloating the
 * editor bundle with the entire 4k-icon catalog.
 */
import type { IconComponent } from 'pixel-art-icons/types'
import { BoxIcon } from 'pixel-art-icons/icons/box'
import { BoxStackIcon } from 'pixel-art-icons/icons/box-stack'
import { CircleAlertIcon } from 'pixel-art-icons/icons/circle-alert'
import { AiSettingsSolidIcon } from 'pixel-art-icons/icons/ai-settings-solid'
import { Bulletlist2SharpIcon } from 'pixel-art-icons/icons/bulletlist-2-sharp'
import { ColorsSwatchIcon } from 'pixel-art-icons/icons/colors-swatch'
import { FilesStack2Icon } from 'pixel-art-icons/icons/files-stack-2'
import { ImagesIcon } from 'pixel-art-icons/icons/images'
import { PaintBucketIcon } from 'pixel-art-icons/icons/paint-bucket'
import { RulerDimensionIcon } from 'pixel-art-icons/icons/ruler-dimension'
import { TextStartTIcon } from 'pixel-art-icons/icons/text-start-t'

/**
 * Icon name → component lookup. Names use the kebab-case file convention
 * from the `pixel-art-icons` package so plugin authors can copy them
 * directly from the icon catalog.
 */
const PLUGIN_PANEL_ICONS: Record<string, IconComponent> = {
  'box': BoxIcon,
  'box-stack': BoxStackIcon,
  'circle-alert': CircleAlertIcon,
  'ai-settings-solid': AiSettingsSolidIcon,
  'bulletlist-2-sharp': Bulletlist2SharpIcon,
  'colors-swatch': ColorsSwatchIcon,
  'files-stack-2': FilesStack2Icon,
  'images': ImagesIcon,
  'paint-bucket': PaintBucketIcon,
  'ruler-dimension': RulerDimensionIcon,
  'text-start-t': TextStartTIcon,
}

/**
 * Resolve a plugin-declared icon name to a `pixel-art-icons` component.
 * Falls back to `BoxIcon` for any name not in the registry — keeps the
 * rail visually stable even when a plugin ships an icon name we haven't
 * imported yet.
 */
export function resolvePluginPanelIcon(name: string): IconComponent {
  return PLUGIN_PANEL_ICONS[name] ?? BoxIcon
}

export const PLUGIN_PANEL_ICON_NAMES: ReadonlyArray<string> = Object.keys(PLUGIN_PANEL_ICONS)
