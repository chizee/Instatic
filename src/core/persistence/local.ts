import type { Project } from '../page-tree/types'
import type { IPersistenceAdapter, ProjectSummary } from './types'

const DB_NAME = 'page-builder'
const DB_VERSION = 1
const STORE_PROJECTS = 'projects'

/**
 * LocalAdapter — IndexedDB-backed persistence for MVP.
 *
 * Implements IPersistenceAdapter; swapped for ConvexAdapter in Phase 8.
 * Uses the native IndexedDB API directly (no idb library) to keep bundle size minimal.
 */
export class LocalAdapter implements IPersistenceAdapter {
  private _db: IDBDatabase | null = null

  private async getDb(): Promise<IDBDatabase> {
    if (this._db) return this._db
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION)
      req.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
          db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' })
        }
      }
      req.onsuccess = (event) => {
        this._db = (event.target as IDBOpenDBRequest).result
        resolve(this._db)
      }
      req.onerror = () => reject(req.error)
    })
  }

  async saveProject(project: Project): Promise<void> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite')
      const req = tx.objectStore(STORE_PROJECTS).put(project)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  async loadProject(id: string): Promise<Project | undefined> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readonly')
      const req = tx.objectStore(STORE_PROJECTS).get(id)
      req.onsuccess = () => resolve(req.result as Project | undefined)
      req.onerror = () => reject(req.error)
    })
  }

  async listProjects(): Promise<ProjectSummary[]> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readonly')
      const req = tx.objectStore(STORE_PROJECTS).getAll()
      req.onsuccess = () => {
        const projects = req.result as Project[]
        const summaries: ProjectSummary[] = projects.map((p) => ({
          id: p.id,
          name: p.name,
          updatedAt: p.updatedAt,
          createdAt: p.createdAt,
          pageCount: p.pages.length,
        }))
        summaries.sort((a, b) => b.updatedAt - a.updatedAt)
        resolve(summaries)
      }
      req.onerror = () => reject(req.error)
    })
  }

  async deleteProject(id: string): Promise<void> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite')
      const req = tx.objectStore(STORE_PROJECTS).delete(id)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }
}

/** Singleton adapter instance — import this throughout the app. */
export const localAdapter = new LocalAdapter()
