/**
 * Editor store — combined-state type.
 *
 * `EditorStore` lives here (rather than in `./store.ts`) so each slice can
 * import the full union via `import type { EditorStore } from '../types'`
 * without going through `./store.ts`, which itself imports each slice
 * creator. This breaks the runtime store ↔ slice cycle that the static
 * graph would otherwise exhibit.
 *
 * Type-only imports are erased by tsc, so there is no runtime dependency
 * from a slice file back into this module — each slice's value graph
 * terminates at its own creator function.
 *
 * If you add a new slice:
 *   1. Define and export its slice interface from the slice file.
 *   2. Import its type here and add it to the `EditorStore` intersection.
 *   3. Wire its creator into `./store.ts`.
 */
import type { SiteSlice } from './slices/siteSlice'
import type { SelectionSlice } from './slices/selectionSlice'
import type { CanvasSlice } from './slices/canvasSlice'
import type { UiSlice } from './slices/uiSlice'
import type { ClassSlice } from './slices/classSlice'
import type { FilesSlice } from './slices/filesSlice'
import type { VisualComponentsSlice } from './slices/visualComponentsSlice'
import type { SettingsSlice } from './slices/settingsSlice'
import type { AgentSlice } from '../agent/agentSlice'
import type { SitePanelSlice } from './slices/sitePanelSlice'

export type EditorStore =
  & SiteSlice
  & SelectionSlice
  & CanvasSlice
  & UiSlice
  & ClassSlice
  & FilesSlice
  & VisualComponentsSlice
  & SettingsSlice
  & AgentSlice
  & SitePanelSlice
