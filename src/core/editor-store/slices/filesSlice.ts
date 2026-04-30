/**
 * filesSlice — Files Data Layer store slice.
 *
 * Architecture source: Contribution #595 §6 (amended in msg #1844)
 *
 * Manages project.files[] CRUD.  State lives in project.files (owned by
 * projectSlice); this slice owns only the action methods — same pattern as
 * classSlice (project.classes).
 *
 * Every write boundary:
 *  - Calls normalizePath() to collapse dot-segments.
 *  - Calls isSafePath() and throws on invalid input (CWE-22).
 *  - Enforces path uniqueness and throws on collision (not silent overwrite).
 *
 * Dependency direction: MUST NOT import from editor/, page-tree/mutations,
 * or react-publisher/.  This is a pure data-layer slice.
 */

import { produce } from 'immer'
import { nanoid } from 'nanoid'
import type { StateCreator } from 'zustand'
import type { EditorStore } from '../store'
import type { ProjectFile, ProjectFileType } from '../../files/types'
import { isSafePath, normalizePath } from '../../files/pathValidation'

// ---------------------------------------------------------------------------
// Slice interface
// ---------------------------------------------------------------------------

export interface FilesSlice {
  /**
   * Create a new file at the given path with the given type.
   * Returns the new file's id.
   *
   * Throws if:
   * - No project is loaded.
   * - `path` fails isSafePath() (after normalization).
   * - A file at the normalized path already exists (CWE-22 / uniqueness).
   */
  createFile(path: string, type: ProjectFileType, content?: string): string

  /**
   * Delete the file with the given id.
   * No-op if the id does not exist.
   */
  deleteFile(id: string): void

  /**
   * Rename (move) a file to newPath.
   *
   * Throws if:
   * - No project is loaded.
   * - `newPath` fails isSafePath() (after normalization).
   * - Another file already occupies the normalized newPath.
   */
  renameFile(id: string, newPath: string): void

  /**
   * Update the text content of a file.
   * No-op if the id does not exist.
   * For 'asset' files use updateFileBlob() instead.
   */
  updateFileContent(id: string, content: string): void

  /**
   * Update the binary blob of an asset file.
   * No-op if the id does not exist.
   */
  updateFileBlob(id: string, blob: { mimeType: string; base64: string }): void
}

// ---------------------------------------------------------------------------
// Slice implementation
// ---------------------------------------------------------------------------

export const createFilesSlice: StateCreator<EditorStore, [], [], FilesSlice> = (set, get) => ({
  createFile(path, type, content) {
    const { project } = get()
    if (!project) throw new Error('[filesSlice] No project loaded')

    const normalized = normalizePath(path)
    if (!isSafePath(normalized)) {
      throw new Error(`[filesSlice] Invalid path: "${path}"`)
    }

    // Uniqueness — throw on collision (msg #1844 amendment)
    if (project.files.some((f) => f.path === normalized)) {
      throw new Error(`[filesSlice] A file at path "${normalized}" already exists`)
    }

    const now = Date.now()
    const id = nanoid()

    set(
      produce((state: EditorStore) => {
        if (!state.project) return
        const newFile: ProjectFile = {
          id,
          path: normalized,
          type,
          // For non-asset types, initialize content to provided value or empty string
          content: type !== 'asset' ? (content ?? '') : undefined,
          createdAt: now,
          updatedAt: now,
        }
        state.project.files.push(newFile)
        state.project.updatedAt = now
      }),
    )

    return id
  },

  deleteFile(id) {
    set(
      produce((state: EditorStore) => {
        if (!state.project) return
        const idx = state.project.files.findIndex((f) => f.id === id)
        if (idx === -1) return
        state.project.files.splice(idx, 1)
        if (state.activeEditorFileId === id) state.activeEditorFileId = null
        state.project.updatedAt = Date.now()
      }),
    )
  },

  renameFile(id, newPath) {
    const { project } = get()
    if (!project) throw new Error('[filesSlice] No project loaded')

    const normalized = normalizePath(newPath)
    if (!isSafePath(normalized)) {
      throw new Error(`[filesSlice] Invalid path: "${newPath}"`)
    }

    // Collision check — allow renaming to same path (no-op), reject if occupied by another file
    const occupant = project.files.find((f) => f.path === normalized)
    if (occupant && occupant.id !== id) {
      throw new Error(`[filesSlice] A file at path "${normalized}" already exists`)
    }

    set(
      produce((state: EditorStore) => {
        if (!state.project) return
        const file = state.project.files.find((f) => f.id === id)
        if (!file) return
        file.path = normalized
        file.updatedAt = Date.now()
        state.project.updatedAt = Date.now()
      }),
    )
  },

  updateFileContent(id, content) {
    set(
      produce((state: EditorStore) => {
        if (!state.project) return
        const file = state.project.files.find((f) => f.id === id)
        if (!file) return
        file.content = content
        if (file.generated) file.ejected = true
        file.updatedAt = Date.now()
        state.project.updatedAt = Date.now()
      }),
    )
  },

  updateFileBlob(id, blob) {
    set(
      produce((state: EditorStore) => {
        if (!state.project) return
        const file = state.project.files.find((f) => f.id === id)
        if (!file) return
        file.blob = blob
        if (file.generated) file.ejected = true
        file.updatedAt = Date.now()
        state.project.updatedAt = Date.now()
      }),
    )
  },
})
