import { describe, expect, it } from 'bun:test'
import {
  buildAgentResponseEventsFromText,
  parseAgentActionBlocks,
  stripAgentActionBlocks,
} from '../../core/agent/actionBlocks'

describe('agent action block parsing', () => {
  it('removes pb:actions markup from visible assistant text while preserving actions', () => {
    const text = `I'll build it now.
<pb:actions>
[
  { "type": "createClass", "name": "hero", "styles": { "padding": "64px" } }
]
</pb:actions>
Done.`

    const parsed = parseAgentActionBlocks(text)

    expect(parsed.cleanText).toBe("I'll build it now.\nDone.")
    expect(parsed.actionBatches).toHaveLength(1)
    expect(parsed.actionBatches[0][0]).toEqual({
      type: 'createClass',
      name: 'hero',
      styles: { padding: '64px' },
    })
  })

  it('strips a partial pb:actions block so streamed UI never shows raw JSON', () => {
    const visible = stripAgentActionBlocks('Working...\n<pb:actions>\n[{ "type": "insertNode"')

    expect(visible).toBe('Working...')
    expect(visible).not.toContain('<pb:actions>')
    expect(visible).not.toContain('insertNode')
  })

  it('builds browser stream events with clean text and separate actions only', () => {
    const events = buildAgentResponseEventsFromText(`Adding styles.
<pb:actions>
[
  { "type": "createClass", "name": "cta", "styles": { "color": "#fff" } }
]
</pb:actions>
Ready.`)

    expect(events).toEqual([
      { type: 'text', text: 'Adding styles.\nReady.' },
      {
        type: 'actions',
        actions: [
          { type: 'createClass', name: 'cta', styles: { color: '#fff' } },
        ],
      },
    ])
    expect(JSON.stringify(events)).not.toContain('<pb:actions>')
  })
})
