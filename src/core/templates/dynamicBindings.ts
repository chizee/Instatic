import type { DynamicPropBinding } from '../page-tree'
import { firstImagePathFromMarkdown, renderContentMarkdownToHtml } from '../markdown/renderContentMarkdown'

export interface TemplateEntryData {
  id: string
  entryId?: string
  collectionId: string
  collectionSlug: string
  collectionRouteBase?: string
  versionNumber?: number
  title: string
  slug: string
  bodyMarkdown: string
  featuredMediaId: string | null
  featuredMediaPath: string | null
  firstImagePath?: string | null
  seoTitle: string
  seoDescription: string
  publishedAt: string
  createdAt: string
}

export interface TemplateRenderDataContext {
  currentEntry?: TemplateEntryData | null
}

function resolveCurrentEntryField(binding: DynamicPropBinding, context: TemplateRenderDataContext): unknown {
  const entry = context.currentEntry
  if (!entry) return undefined

  switch (binding.field) {
    case 'title':
      return entry.title
    case 'slug':
      return entry.slug
    case 'body':
    case 'bodyMarkdown':
      return binding.format === 'html'
        ? renderContentMarkdownToHtml(entry.bodyMarkdown)
        : entry.bodyMarkdown
    case 'featuredMedia':
    case 'featuredMediaPath':
    case 'featuredMediaUrl':
      return entry.featuredMediaPath
    case 'firstImage':
    case 'firstImagePath':
    case 'firstImageUrl':
      return entry.firstImagePath ?? firstImagePathFromMarkdown(entry.bodyMarkdown)
    case 'seoTitle':
      return entry.seoTitle
    case 'seoDescription':
      return entry.seoDescription
    case 'publishedAt':
      return entry.publishedAt
    case 'createdAt':
      return entry.createdAt
    default:
      return (entry as unknown as Record<string, unknown>)[binding.field]
  }
}

export function resolveDynamicProps(
  staticProps: Record<string, unknown>,
  bindings: Record<string, DynamicPropBinding> | undefined,
  context: TemplateRenderDataContext | undefined,
): Record<string, unknown> {
  if (!bindings || !context?.currentEntry) return staticProps

  const resolved = { ...staticProps }
  for (const [propKey, binding] of Object.entries(bindings)) {
    if (binding.source !== 'currentEntry') continue

    const value = resolveCurrentEntryField(binding, context)
    if (value === undefined || value === null) {
      if (binding.fallback === 'empty') resolved[propKey] = ''
      continue
    }

    resolved[propKey] = value
  }

  return resolved
}
