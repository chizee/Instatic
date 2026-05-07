/**
 * Content-entry endpoints.
 *
 *   GET    /admin/api/cms/content/authors                — list assignable authors
 *   GET    /admin/api/cms/content/entries/:id            — read a single entry
 *   PUT    /admin/api/cms/content/entries/:id            — save the draft
 *   DELETE /admin/api/cms/content/entries/:id            — soft delete
 *   POST   /admin/api/cms/content/entries/:id/publish    — publish
 *   PATCH  /admin/api/cms/content/entries/:id/status     — flip between draft/unpublished
 *   PATCH  /admin/api/cms/content/entries/:id/author     — reassign the author
 *   PATCH  /admin/api/cms/content/entries/:id/collection — move an entry to a new collection
 */
import type { DbClient } from '../../../db/client'
import { createAuditEvent } from '../../../repositories/audit'
import {
  getContentEntry,
  listContentAuthorOptions,
  publishContentEntry,
  saveContentEntryDraft,
  softDeleteContentEntry,
  updateContentEntryAuthor,
  updateContentEntryCollection,
  updateContentEntryStatus,
} from '../../../repositories/content'
import { findUserById } from '../../../repositories/users'
import { slugFromTitle } from '@core/utils/slug'
import { badRequest, jsonResponse, methodNotAllowed } from '../../../http'
import { CMS_API_PREFIX, readValidatedBody, requestAuditContext } from '../shared'
import {
  EntryAuthorBodySchema,
  EntryCollectionBodySchema,
  EntryStatusBodySchema,
  EntryUpsertBodySchema,
  type EntryUpsertBody,
} from './schemas'
import {
  canEditContentEntry,
  canPublishContentEntry,
  canReadContentEntry,
  forbidden,
  requireContentAccess,
  requireContentAuthorManager,
  requireContentEditor,
  requireContentPublisher,
} from './access'

interface EntryDraft {
  title: string
  slug: string
  bodyMarkdown: string
  featuredMediaId: string | null
  seoTitle: string
  seoDescription: string
}

/**
 * Normalize an EntryUpsert payload into the strict shape both
 * `createContentEntry` and `saveContentEntryDraft` expect. Empty / missing
 * `title` falls back to "Untitled" so a draft always has a usable label;
 * `slug` derives from `title` when not supplied so entries are addressable
 * the moment they're saved.
 */
export function entryDraftFromBody(body: EntryUpsertBody): EntryDraft {
  const title = body.title?.trim() || 'Untitled'
  return {
    title,
    slug: slugFromTitle(body.slug?.trim() || title),
    bodyMarkdown: body.bodyMarkdown ?? '',
    featuredMediaId: body.featuredMediaId ?? null,
    seoTitle: body.seoTitle ?? '',
    seoDescription: body.seoDescription ?? '',
  }
}

export async function handleContentEntryRoutes(
  req: Request,
  db: DbClient,
): Promise<Response | null> {
  const url = new URL(req.url)

  if (url.pathname === `${CMS_API_PREFIX}/content/authors`) {
    const user = await requireContentAuthorManager(req, db)
    if (user instanceof Response) return user
    if (req.method !== 'GET') return methodNotAllowed()
    return jsonResponse({ authors: await listContentAuthorOptions(db) })
  }

  const contentEntryMatch = url.pathname.match(/^\/admin\/api\/cms\/content\/entries\/([^/]+)$/)
  if (contentEntryMatch) {
    const user = req.method === 'GET'
      ? await requireContentAccess(req, db)
      : await requireContentEditor(req, db)
    if (user instanceof Response) return user

    const entryId = decodeURIComponent(contentEntryMatch[1])

    if (req.method === 'GET') {
      const entry = await getContentEntry(db, entryId)
      if (!entry) return jsonResponse({ error: 'Content entry not found' }, { status: 404 })
      if (!canReadContentEntry(user, entry)) return forbidden()
      return jsonResponse({ entry })
    }

    if (req.method === 'PUT') {
      const currentEntry = await getContentEntry(db, entryId)
      if (!currentEntry) return jsonResponse({ error: 'Content entry not found' }, { status: 404 })
      if (!canEditContentEntry(user, currentEntry)) return forbidden()

      const body = await readValidatedBody(req, EntryUpsertBodySchema)
      if (!body) return badRequest('Invalid entry payload')

      const entry = await saveContentEntryDraft(db, entryId, entryDraftFromBody(body), user.id)
      if (!entry) return jsonResponse({ error: 'Content entry not found' }, { status: 404 })
      await createAuditEvent(db, {
        actorUserId: user.id,
        action: 'content.entry.update',
        targetType: 'content_entry',
        targetId: entry.id,
        metadata: { collectionId: entry.collectionId, slug: entry.slug },
        ...requestAuditContext(req),
      })
      return jsonResponse({ entry })
    }

    if (req.method === 'DELETE') {
      const currentEntry = await getContentEntry(db, entryId)
      if (!currentEntry) return jsonResponse({ error: 'Content entry not found' }, { status: 404 })
      if (!canEditContentEntry(user, currentEntry)) return forbidden()

      const entry = await softDeleteContentEntry(db, entryId, user.id)
      if (!entry) return jsonResponse({ error: 'Content entry not found' }, { status: 404 })
      await createAuditEvent(db, {
        actorUserId: user.id,
        action: 'content.entry.delete',
        targetType: 'content_entry',
        targetId: entry.id,
        metadata: { collectionId: entry.collectionId, slug: entry.slug },
        ...requestAuditContext(req),
      })
      return jsonResponse({ entry })
    }

    return methodNotAllowed()
  }

  const publishMatch = url.pathname.match(/^\/admin\/api\/cms\/content\/entries\/([^/]+)\/publish$/)
  if (publishMatch) {
    const user = await requireContentPublisher(req, db)
    if (user instanceof Response) return user
    if (req.method !== 'POST') return methodNotAllowed()

    const entryId = decodeURIComponent(publishMatch[1])
    const currentEntry = await getContentEntry(db, entryId)
    if (!currentEntry) return jsonResponse({ error: 'Content entry not found' }, { status: 404 })
    if (!canPublishContentEntry(user, currentEntry)) return forbidden()

    const result = await publishContentEntry(db, entryId, user.id)
    await createAuditEvent(db, {
      actorUserId: user.id,
      action: 'content.entry.publish',
      targetType: 'content_entry',
      targetId: result.entry.id,
      metadata: {
        collectionId: result.entry.collectionId,
        slug: result.entry.slug,
        versionNumber: result.version.versionNumber,
      },
      ...requestAuditContext(req),
    })
    return jsonResponse(result)
  }

  const statusMatch = url.pathname.match(/^\/admin\/api\/cms\/content\/entries\/([^/]+)\/status$/)
  if (statusMatch) {
    const user = await requireContentEditor(req, db)
    if (user instanceof Response) return user
    if (req.method !== 'PATCH') return methodNotAllowed()

    const body = await readValidatedBody(req, EntryStatusBodySchema)
    if (!body) return badRequest('Status must be draft or unpublished')

    const entryId = decodeURIComponent(statusMatch[1])
    const currentEntry = await getContentEntry(db, entryId)
    if (!currentEntry) return jsonResponse({ error: 'Content entry not found' }, { status: 404 })
    if (!canEditContentEntry(user, currentEntry)) return forbidden()

    const entry = await updateContentEntryStatus(db, entryId, body.status, user.id)
    if (!entry) return jsonResponse({ error: 'Content entry not found' }, { status: 404 })
    await createAuditEvent(db, {
      actorUserId: user.id,
      action: 'content.entry.status',
      targetType: 'content_entry',
      targetId: entry.id,
      metadata: { collectionId: entry.collectionId, slug: entry.slug, status: body.status },
      ...requestAuditContext(req),
    })
    return jsonResponse({ entry })
  }

  const authorMatch = url.pathname.match(/^\/admin\/api\/cms\/content\/entries\/([^/]+)\/author$/)
  if (authorMatch) {
    const user = await requireContentAuthorManager(req, db)
    if (user instanceof Response) return user
    if (req.method !== 'PATCH') return methodNotAllowed()

    const body = await readValidatedBody(req, EntryAuthorBodySchema)
    if (!body || !body.authorUserId.trim()) return badRequest('Author is required')

    const author = await findUserById(db, body.authorUserId)
    if (!author || author.status !== 'active') return badRequest('Author must be an active user')

    const entryId = decodeURIComponent(authorMatch[1])
    const currentEntry = await getContentEntry(db, entryId)
    if (!currentEntry) return jsonResponse({ error: 'Content entry not found' }, { status: 404 })

    const entry = await updateContentEntryAuthor(db, entryId, body.authorUserId, user.id)
    if (!entry) return jsonResponse({ error: 'Content entry not found' }, { status: 404 })

    await createAuditEvent(db, {
      actorUserId: user.id,
      action: 'content.author.assign',
      targetType: 'content_entry',
      targetId: entry.id,
      metadata: {
        previousAuthorUserId: currentEntry.authorUserId,
        authorUserId: body.authorUserId,
      },
      ...requestAuditContext(req),
    })
    return jsonResponse({ entry })
  }

  const collectionMatch = url.pathname.match(/^\/admin\/api\/cms\/content\/entries\/([^/]+)\/collection$/)
  if (collectionMatch) {
    const user = await requireContentEditor(req, db)
    if (user instanceof Response) return user
    if (req.method !== 'PATCH') return methodNotAllowed()

    const body = await readValidatedBody(req, EntryCollectionBodySchema)
    if (!body || !body.collectionId.trim()) return badRequest('Collection is required')

    const entryId = decodeURIComponent(collectionMatch[1])
    const currentEntry = await getContentEntry(db, entryId)
    if (!currentEntry) return jsonResponse({ error: 'Content entry not found' }, { status: 404 })
    if (!canEditContentEntry(user, currentEntry)) return forbidden()

    const result = await updateContentEntryCollection(db, entryId, body.collectionId, user.id)
    if (result.ok) {
      await createAuditEvent(db, {
        actorUserId: user.id,
        action: 'content.entry.move',
        targetType: 'content_entry',
        targetId: result.entry.id,
        metadata: { collectionId: result.entry.collectionId, slug: result.entry.slug },
        ...requestAuditContext(req),
      })
      return jsonResponse({ entry: result.entry })
    }
    if (result.reason === 'slug_conflict') {
      return jsonResponse({ error: 'An entry with this slug already exists in the target collection' }, { status: 409 })
    }
    if (result.reason === 'collection_not_found') {
      return jsonResponse({ error: 'Collection not found' }, { status: 404 })
    }
    return jsonResponse({ error: 'Content entry not found' }, { status: 404 })
  }

  return null
}
