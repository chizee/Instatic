/**
 * Structured-content endpoints — collections + entries.
 *
 * Two route groups, dispatched in order. Each group's handler returns either
 * a `Response` (it claimed the URL) or `null` (not my route — try the next).
 * Splitting by resource keeps each file focused on one subject and matches
 * how the rest of `server/handlers/cms/*` is organized.
 *
 * URL surface owned by this folder:
 *   /admin/api/cms/content/authors                   (GET)
 *   /admin/api/cms/content/collections               (GET, POST)
 *   /admin/api/cms/content/collections/:id           (PATCH, DELETE)
 *   /admin/api/cms/content/collections/:id/entries   (GET, POST)
 *   /admin/api/cms/content/entries/:id               (GET, PUT, DELETE)
 *   /admin/api/cms/content/entries/:id/publish       (POST)
 *   /admin/api/cms/content/entries/:id/status        (PATCH)
 *   /admin/api/cms/content/entries/:id/author        (PATCH)
 *   /admin/api/cms/content/entries/:id/collection    (PATCH)
 */
import type { DbClient } from '../../../db/client'
import { handleContentCollectionRoutes } from './collections'
import { handleContentEntryRoutes } from './entries'

export async function handleContentRoutes(req: Request, db: DbClient): Promise<Response | null> {
  return (await handleContentCollectionRoutes(req, db))
    ?? (await handleContentEntryRoutes(req, db))
}
