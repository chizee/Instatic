import type { AgentAction, ServerStreamEvent } from './types'

const ACTION_BLOCK_RE = /<pb:actions\b[^>]*>\s*([\s\S]*?)\s*<\/pb:actions>/gi
const OPEN_ACTION_BLOCK_RE = /<pb:actions\b[^>]*>[\s\S]*$/i

export interface ParsedAgentActionBlocks {
  cleanText: string
  actionBatches: AgentAction[][]
}

export function parseAgentActionBlocks(text: string): ParsedAgentActionBlocks {
  const actionBatches: AgentAction[][] = []
  const cleanText = text.replace(ACTION_BLOCK_RE, (_, json) => {
    try {
      const parsed = JSON.parse(String(json).trim()) as unknown
      if (!Array.isArray(parsed)) return ''

      const actions = parsed.filter(
        (item): item is AgentAction =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as Record<string, unknown>).type === 'string',
      )
      if (actions.length > 0) actionBatches.push(actions)
    } catch {
      // Malformed action JSON is ignored here; executor-side validation handles
      // any action object that does make it through.
    }

    return ''
  })

  return {
    cleanText: normalizeVisibleAgentText(cleanText),
    actionBatches,
  }
}

export function stripAgentActionBlocks(text: string): string {
  return normalizeVisibleAgentText(
    text
      .replace(ACTION_BLOCK_RE, '')
      .replace(OPEN_ACTION_BLOCK_RE, ''),
  )
}

export function buildAgentResponseEventsFromText(text: string): ServerStreamEvent[] {
  const { cleanText, actionBatches } = parseAgentActionBlocks(text)
  const events: ServerStreamEvent[] = []

  if (cleanText) events.push({ type: 'text', text: cleanText })
  for (const actions of actionBatches) {
    events.push({ type: 'actions', actions })
  }

  return events
}

function normalizeVisibleAgentText(text: string): string {
  return text
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim()
}
