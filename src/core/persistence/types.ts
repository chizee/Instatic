import type { Project } from '../page-tree/types'

/**
 * IPersistenceAdapter — the interface all storage backends must satisfy.
 *
 * Constraint #184: Persistence is an interface. MVP uses IndexedDB (LocalAdapter).
 * Phase 8 swaps in a ConvexAdapter without touching any editor code.
 */
export interface IPersistenceAdapter {
  /** Persist (create or update) a project. */
  saveProject(project: Project): Promise<void>

  /** Load a project by ID. Returns undefined if not found. */
  loadProject(id: string): Promise<Project | undefined>

  /** List all project summaries (id + name + updatedAt) without loading full data. */
  listProjects(): Promise<ProjectSummary[]>

  /** Permanently delete a project and all its data. */
  deleteProject(id: string): Promise<void>
}

export interface ProjectSummary {
  id: string
  name: string
  updatedAt: number
  createdAt: number
  pageCount: number
}
