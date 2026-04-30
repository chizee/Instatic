/**
 * Phase D — Agent server endpoint handler.
 *
 * Uses the Claude Agent SDK (@anthropic-ai/claude-agent-sdk) to run
 * Claude as a page builder assistant. Streams NDJSON back to the browser.
 *
 * Auth: ambient Claude Code credentials (claude auth login) — Constraint #385.
 * No API key, no endpoint URL, no environment variable required.
 *
 * Architecture:
 * - Browser POSTs { prompt, messages, pageContext }
 * - This handler runs query() with a custom system prompt + tools: []
 * - Claude responds with text that may include <pb:actions> JSON blocks
 * - Handler parses action blocks, validates the JSON, streams events:
 *     { type: "text", text: "..." }
 *     { type: "actions", actions: [...] }
 *     { type: "done" }
 *     { type: "error", message: "..." }
 *
 * Constraint #272 — tool calls validated before dispatch:
 * The server validates action JSON structure before forwarding.
 * Full Zod validation happens in the browser executor (executor.ts).
 */

import { query } from '@anthropic-ai/claude-agent-sdk'
import { buildSystemPrompt } from '../src/core/agent/systemPrompt'
import { buildAgentResponseEventsFromText } from '../src/core/agent/actionBlocks'
import type {
  AgentRequestBody,
  ServerStreamEvent,
} from '../src/core/agent/types'

// ---------------------------------------------------------------------------
// NDJSON stream helpers
// ---------------------------------------------------------------------------

function encodeEvent(event: ServerStreamEvent): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(event) + '\n')
}

// ---------------------------------------------------------------------------
// handleAgentRequest
// ---------------------------------------------------------------------------

/**
 * Handle a POST /api/agent request.
 * Returns a streaming Response with NDJSON lines.
 */
export async function handleAgentRequest(req: Request): Promise<Response> {
  // CORS preflight handled by the server before reaching here.
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body: AgentRequestBody
  try {
    body = (await req.json()) as AgentRequestBody
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  const { prompt, pageContext } = body
  if (!prompt || typeof prompt !== 'string') {
    return new Response('Missing prompt', { status: 400 })
  }

  const systemPrompt = buildSystemPrompt(pageContext)

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let fullText = ''

        for await (const message of query({
          prompt,
          options: {
            systemPrompt,
            // Disable ALL Claude Code built-in tools — Claude only outputs text
            tools: [],
            // Prevent Claude Code from writing to the filesystem
            disallowedTools: [
              'Bash', 'Read', 'Write', 'Edit', 'Glob', 'Grep',
              'WebFetch', 'WebSearch', 'TodoWrite',
            ],
          },
        })) {
          if (message.type === 'assistant') {
            // Guard: SDK sets message.error instead of message.message on auth/billing failure
            // Constraint #388: log server-side, never forward raw SDK error details to browser
            const sdkMsg = message as {
              type: 'assistant'
              message?: { content: Array<{ type: string; text?: string }> }
              error?: unknown
            }
            if (!sdkMsg.message) {
              console.error('[agentHandler] SDK assistant message unavailable (auth/billing error):', sdkMsg.error)
              controller.enqueue(
                encodeEvent({ type: 'error', message: 'Agent authentication or billing error. Check your Claude credentials.' }),
              )
              controller.close()
              return
            }
            // BetaMessage — extract text content
            const betaMsg = sdkMsg.message
            for (const block of betaMsg.content) {
              if (block.type === 'text' && block.text) {
                fullText += block.text
              }
            }
          } else if (message.type === 'result') {
            // Check for result-level error (safety refusal, context overflow, etc.)
            // Constraint #388: log errors server-side, never forward raw SDK content to browser
            const resultMsg = message as {
              type: 'result'
              is_error?: boolean
              subtype?: string
              errors?: string[]
            }
            if (resultMsg.is_error) {
              console.error('[agentHandler] SDK result error:', resultMsg.subtype, resultMsg.errors)
              controller.enqueue(
                encodeEvent({ type: 'error', message: 'Agent session ended with an error. Please try again.' }),
              )
              controller.close()
              return
            }
            // Session complete — parse any action blocks from accumulated text
            for (const event of buildAgentResponseEventsFromText(fullText)) {
              controller.enqueue(encodeEvent(event))
            }
          }
        }

        controller.enqueue(encodeEvent({ type: 'done' }))
        controller.close()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        // Emit error event then close
        try {
          controller.enqueue(encodeEvent({ type: 'error', message }))
          controller.close()
        } catch {
          // Controller already closed
        }
      }
    },
  })

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no', // disable Nginx proxy buffering for SSE
    },
  })
}
