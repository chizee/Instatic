/**
 * Files Data Layer — pure selector functions.
 *
 * Architecture source: Contribution #595 §6
 *
 * All functions here are pure (no store dependency) and operate on
 * ProjectFile[] directly.  Consumers import these and call them from
 * within React selectors or test code.
 *
 * Dependency direction: this module MUST NOT import from editor/, page-tree/,
 * or react-publisher/.  It is a pure data utility.
 */

import type { ProjectFile, ProjectFileType, FileTreeNode } from './types'

// ---------------------------------------------------------------------------
// getFileByPath
// ---------------------------------------------------------------------------

/**
 * Return the first ProjectFile whose path matches exactly, or undefined.
 * O(n) — acceptable for typical project file counts (<200).
 */
export function getFileByPath(files: ProjectFile[], path: string): ProjectFile | undefined {
  return files.find((f) => f.path === path)
}

// ---------------------------------------------------------------------------
// getFilesByType
// ---------------------------------------------------------------------------

/**
 * Return all ProjectFiles of the given type, preserving array order.
 */
export function getFilesByType(files: ProjectFile[], type: ProjectFileType): ProjectFile[] {
  return files.filter((f) => f.type === type)
}

// ---------------------------------------------------------------------------
// buildFileTree
// ---------------------------------------------------------------------------

/**
 * Convert a flat ProjectFile[] into a nested FileTreeNode[] for display.
 *
 * Algorithm:
 * - Sort files alphabetically for consistent, deterministic output.
 * - For each file, recursively ensure all ancestor directory nodes exist
 *   ("orphan-folder synthesis" — a directory is created even if no file sits
 *   directly in it).
 * - File leaf nodes carry a `file` reference; directory nodes do not.
 *
 * Root-level entries (files like "package.json" or top-level dirs like "src/")
 * are returned directly.  Sort order within each directory: alphabetical by
 * name (directories and files mixed — callers may re-sort if desired).
 */
export function buildFileTree(files: ProjectFile[]): FileTreeNode[] {
  // Synthesized directory nodes, keyed by their full path
  const dirNodes = new Map<string, FileTreeNode>()

  // The root-level list (no parent)
  const roots: FileTreeNode[] = []

  /**
   * Get-or-create a directory node for the given path.
   * Recursively ensures all ancestor directories exist.
   */
  function getOrCreateDir(dirPath: string): FileTreeNode {
    if (dirNodes.has(dirPath)) return dirNodes.get(dirPath)!

    const slashIdx = dirPath.lastIndexOf('/')
    const name = slashIdx === -1 ? dirPath : dirPath.slice(slashIdx + 1)
    const parentPath = slashIdx === -1 ? '' : dirPath.slice(0, slashIdx)

    const node: FileTreeNode = {
      name,
      path: dirPath,
      isDirectory: true,
      children: [],
    }
    dirNodes.set(dirPath, node)

    if (parentPath === '') {
      roots.push(node)
    } else {
      const parent = getOrCreateDir(parentPath)
      parent.children.push(node)
    }

    return node
  }

  // Sort files for consistent output
  const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path))

  for (const file of sorted) {
    const slashIdx = file.path.lastIndexOf('/')
    const fileName = slashIdx === -1 ? file.path : file.path.slice(slashIdx + 1)
    const dirPath = slashIdx === -1 ? '' : file.path.slice(0, slashIdx)

    const fileNode: FileTreeNode = {
      name: fileName,
      path: file.path,
      isDirectory: false,
      children: [],
      file,
    }

    if (dirPath === '') {
      roots.push(fileNode)
    } else {
      const parent = getOrCreateDir(dirPath)
      parent.children.push(fileNode)
    }
  }

  return roots
}
