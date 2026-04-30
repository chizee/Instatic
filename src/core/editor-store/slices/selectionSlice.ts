import type { StateCreator } from 'zustand'
import type { EditorStore } from '../store'

export interface SelectionSlice {
  /** Currently selected node ID — null if nothing is selected */
  selectedNodeId: string | null
  /** Hovered node ID — null if no hover */
  hoveredNodeId: string | null

  selectNode: (id: string | null) => void
  hoverNode: (id: string | null) => void
  clearSelection: () => void
}

export const createSelectionSlice: StateCreator<EditorStore, [], [], SelectionSlice> = (set, get) => ({
  selectedNodeId: null,
  hoveredNodeId: null,

  selectNode: (id) => {
    const current = get()
    const shouldCollapseProperties = !id
    const selectedChanged = !Object.is(current.selectedNodeId, id)
    const panelChanged = !Object.is(current.propertiesPanel.collapsed, shouldCollapseProperties)

    if (!selectedChanged && !panelChanged) return

    set((state) => ({
      selectedNodeId: id,
      propertiesPanel: panelChanged
        ? { ...state.propertiesPanel, collapsed: shouldCollapseProperties }
        : state.propertiesPanel,
    }))
  },
  hoverNode: (id) => set({ hoveredNodeId: id }),
  clearSelection: () => set({ selectedNodeId: null, hoveredNodeId: null }),
})
