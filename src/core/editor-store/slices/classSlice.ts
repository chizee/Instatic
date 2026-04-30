/**
 * classSlice — Phase C CSS Class System store slice.
 *
 * Manages the project's global class registry (CSSClass[]) and the
 * per-node class assignments (node.classIds). All mutations go through
 * Immer produce() for immutability and undo-ability.
 *
 * Architecture:
 * - Classes live in project.classes (flat map, keyed by CSSClass.id)
 * - Nodes reference class IDs in node.classIds (ordered array)
 * - The active class ID controls which class the Class Composer edits
 *
 * Guideline #242 — no-op guard: every setter must bail out if the new
 * value equals the current value (Object.is) to prevent re-render loops.
 */

import { produce } from 'immer'
import { nanoid } from 'nanoid'
import type { StateCreator } from 'zustand'
import type { EditorStore } from '../store'
import type { CSSClass, CSSPropertyBag } from '../../page-tree/types'

export interface ClassPreviewAssignment {
  nodeId: string
  classId: string
}

// ---------------------------------------------------------------------------
// Slice interface
// ---------------------------------------------------------------------------

export interface ClassSlice {
  // ── UI state ──────────────────────────────────────────────────────────────
  /** The class currently being edited in the Class Composer (null = none) */
  activeClassId: string | null
  setActiveClass(id: string | null): void

  /** Transient class assignment previewed on the canvas while hovering a suggestion. */
  previewClassAssignment: ClassPreviewAssignment | null
  setPreviewNodeClass(nodeId: string, classId: string): void
  clearPreviewNodeClass(nodeId?: string, classId?: string): void

  // ── CRUD ──────────────────────────────────────────────────────────────────
  /**
   * Create a new class with the given name and optional initial styles.
   * Returns the new CSSClass so callers can immediately activate it.
   * Throws if a class with the same name already exists.
   */
  createClass(name: string, styles?: Partial<CSSPropertyBag>): CSSClass

  /** Shallow-merge a style patch into a class's base styles. */
  updateClassStyles(classId: string, patch: Partial<CSSPropertyBag>): void

  /** Shallow-merge a style patch into a class's breakpoint-specific styles. */
  setClassBreakpointStyles(
    classId: string,
    breakpointId: string,
    patch: Partial<CSSPropertyBag>,
  ): void

  /** Ensure a hidden node-scoped class exists for module instance style fields. */
  ensureNodeStyleClass(nodeId: string, moduleName?: string): CSSClass | null

  /** Rename a class. Throws if the new name is already taken. */
  renameClass(classId: string, name: string): void

  /** Delete a class and remove it from all nodes that reference it. */
  deleteClass(classId: string): void

  // ── Node ↔ class assignment ───────────────────────────────────────────────
  /** Append a classId to a node's classIds (no-op if already present). */
  addNodeClass(nodeId: string, classId: string): void

  /** Remove a classId from a node's classIds (no-op if not present). */
  removeNodeClass(nodeId: string, classId: string): void

  /** Swap two classIds by index within a node's classIds array. */
  reorderNodeClasses(nodeId: string, fromIndex: number, toIndex: number): void

  /**
   * Move a classId one position up ('up' = lower index = lower cascade priority)
   * or down ('down' = higher index = higher cascade priority) in a node's classIds array.
   * No-op at array boundaries (Guideline #242 — no-op mutation guard).
   */
  reorderNodeClass(nodeId: string, classId: string, direction: 'up' | 'down'): void
}

// ---------------------------------------------------------------------------
// Slice implementation
// ---------------------------------------------------------------------------

export const createClassSlice: StateCreator<EditorStore, [], [], ClassSlice> = (set, get) => ({
  // ── UI state ───────────────────────────────────────────────────────────────

  activeClassId: null,
  previewClassAssignment: null,

  setActiveClass(id) {
    // Guideline #242 no-op guard
    if (Object.is(get().activeClassId, id)) return
    set({ activeClassId: id })
  },

  setPreviewNodeClass(nodeId, classId) {
    const current = get().previewClassAssignment
    if (current?.nodeId === nodeId && current.classId === classId) return
    set({ previewClassAssignment: { nodeId, classId } })
  },

  clearPreviewNodeClass(nodeId, classId) {
    const current = get().previewClassAssignment
    if (!current) return
    if (nodeId !== undefined && current.nodeId !== nodeId) return
    if (classId !== undefined && current.classId !== classId) return
    set({ previewClassAssignment: null })
  },

  // ── CRUD ───────────────────────────────────────────────────────────────────

  createClass(name, styles = {}) {
    const { project } = get()
    if (!project) throw new Error('[classSlice] No project loaded')

    // Uniqueness check
    const existing = Object.values(project.classes).find((c) => c.name === name)
    if (existing) throw new Error(`[classSlice] A class named "${name}" already exists`)

    const now = Date.now()
    const newClass: CSSClass = {
      id: nanoid(),
      name,
      styles,
      breakpointStyles: {},
      createdAt: now,
      updatedAt: now,
    }

    set(
      produce((state: EditorStore) => {
        if (!state.project) return
        state.project.classes[newClass.id] = newClass
        state.project.updatedAt = Date.now()
      }),
    )

    return newClass
  },

  updateClassStyles(classId, patch) {
    const { project } = get()
    if (!project?.classes[classId]) return

    set(
      produce((state: EditorStore) => {
        if (!state.project?.classes[classId]) return
        const cls = state.project.classes[classId]
        Object.assign(cls.styles, patch)
        // Remove keys explicitly set to undefined/null (allow clearing a property)
        for (const [k, v] of Object.entries(patch)) {
          if (v === undefined || v === null) {
            delete cls.styles[k as keyof CSSPropertyBag]
          }
        }
        cls.updatedAt = Date.now()
        state.project.updatedAt = Date.now()
      }),
    )
  },

  setClassBreakpointStyles(classId, breakpointId, patch) {
    const { project } = get()
    if (!project?.classes[classId]) return

    set(
      produce((state: EditorStore) => {
        if (!state.project?.classes[classId]) return
        const cls = state.project.classes[classId]
        if (!cls.breakpointStyles[breakpointId]) {
          cls.breakpointStyles[breakpointId] = {}
        }
        Object.assign(cls.breakpointStyles[breakpointId], patch)
        // Remove keys explicitly set to undefined/null
        for (const [k, v] of Object.entries(patch)) {
          if (v === undefined || v === null) {
            delete cls.breakpointStyles[breakpointId][k as keyof CSSPropertyBag]
          }
        }
        cls.updatedAt = Date.now()
        state.project.updatedAt = Date.now()
      }),
    )
  },

  ensureNodeStyleClass(nodeId, moduleName = 'Module') {
    const { project } = get()
    if (!project) return null

    const page = project.pages.find((p) => p.nodes[nodeId])
    const node = page?.nodes[nodeId]
    if (!node) return null

    const existingId = node.classIds?.find((id) => {
      const cls = project.classes[id]
      return cls?.scope?.type === 'node' && cls.scope.nodeId === nodeId && cls.scope.role === 'module-style'
    })
    if (existingId && project.classes[existingId]) {
      return project.classes[existingId]
    }

    const now = Date.now()
    const newClass: CSSClass = {
      id: nanoid(),
      name: `${moduleName} instance ${nodeId.slice(0, 6)}`,
      description: 'Node-scoped module style layer',
      scope: { type: 'node', nodeId, role: 'module-style' },
      styles: {},
      breakpointStyles: {},
      tags: ['module-instance'],
      createdAt: now,
      updatedAt: now,
    }

    set(
      produce((state: EditorStore) => {
        if (!state.project) return
        state.project.classes[newClass.id] = newClass
        for (const p of state.project.pages) {
          const target = p.nodes[nodeId]
          if (!target) continue
          if (!target.classIds) target.classIds = []
          target.classIds = target.classIds.filter((id) => {
            const cls = state.project?.classes[id]
            return !(cls?.scope?.type === 'node' && cls.scope.nodeId === nodeId && cls.scope.role === 'module-style')
          })
          target.classIds.push(newClass.id)
          break
        }
        state.project.updatedAt = Date.now()
      }),
    )

    return newClass
  },

  renameClass(classId, name) {
    const { project } = get()
    if (!project?.classes[classId]) return

    // Uniqueness check (allow keeping same name)
    const existing = Object.values(project.classes).find(
      (c) => c.name === name && c.id !== classId,
    )
    if (existing) throw new Error(`[classSlice] A class named "${name}" already exists`)

    set(
      produce((state: EditorStore) => {
        if (!state.project?.classes[classId]) return
        state.project.classes[classId].name = name
        state.project.classes[classId].updatedAt = Date.now()
        state.project.updatedAt = Date.now()
      }),
    )
  },

  deleteClass(classId) {
    set(
      produce((state: EditorStore) => {
        if (!state.project) return
        // Remove from registry
        delete state.project.classes[classId]
        // Remove from all nodes on all pages
        for (const page of state.project.pages) {
          for (const node of Object.values(page.nodes)) {
            if (node.classIds && node.classIds.includes(classId)) {
              node.classIds = node.classIds.filter((id) => id !== classId)
            }
          }
        }
        state.project.updatedAt = Date.now()
        // Clear activeClassId if it pointed to the deleted class
        if (state.activeClassId === classId) {
          state.activeClassId = null
        }
      }),
    )
  },

  // ── Node ↔ class assignment ────────────────────────────────────────────────

  addNodeClass(nodeId, classId) {
    const { project } = get()
    if (!project) return
    // Find the node across pages
    const page = project.pages.find((p) => p.nodes[nodeId])
    if (!page?.nodes[nodeId]) return
    // No-op if already assigned
    if (page.nodes[nodeId].classIds?.includes(classId)) return

    set(
      produce((state: EditorStore) => {
        if (!state.project) return
        for (const p of state.project.pages) {
          if (p.nodes[nodeId]) {
            if (!p.nodes[nodeId].classIds) p.nodes[nodeId].classIds = []
            p.nodes[nodeId].classIds!.push(classId)
            break
          }
        }
        state.project.updatedAt = Date.now()
      }),
    )
  },

  removeNodeClass(nodeId, classId) {
    const { project } = get()
    if (!project) return

    set(
      produce((state: EditorStore) => {
        if (!state.project) return
        for (const p of state.project.pages) {
          if (p.nodes[nodeId] && p.nodes[nodeId].classIds) {
            p.nodes[nodeId].classIds = p.nodes[nodeId].classIds!.filter((id) => id !== classId)
            break
          }
        }
        state.project.updatedAt = Date.now()
      }),
    )
  },

  reorderNodeClasses(nodeId, fromIndex, toIndex) {
    const { project } = get()
    if (!project) return
    if (fromIndex === toIndex) return

    set(
      produce((state: EditorStore) => {
        if (!state.project) return
        for (const p of state.project.pages) {
          const node = p.nodes[nodeId]
          if (node?.classIds && node.classIds.length > Math.max(fromIndex, toIndex)) {
            const arr = node.classIds
            const [moved] = arr.splice(fromIndex, 1)
            arr.splice(toIndex, 0, moved)
            break
          }
        }
        state.project.updatedAt = Date.now()
      }),
    )
  },

  reorderNodeClass(nodeId, classId, direction) {
    const { project } = get()
    if (!project) return
    const page = project.pages.find((p) => p.nodes[nodeId])
    const classIds = page?.nodes[nodeId]?.classIds
    if (!classIds || classIds.length < 2) return
    const idx = classIds.indexOf(classId)
    if (idx === -1) return
    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    // No-op at array boundaries — Guideline #242
    if (newIdx < 0 || newIdx >= classIds.length) return

    set(
      produce((state: EditorStore) => {
        if (!state.project) return
        for (const p of state.project.pages) {
          const node = p.nodes[nodeId]
          if (node?.classIds) {
            const arr = node.classIds
            const [moved] = arr.splice(idx, 1)
            arr.splice(newIdx, 0, moved)
            break
          }
        }
        state.project.updatedAt = Date.now()
      }),
    )
  },
})
