import { describe, expect, it } from 'bun:test'
import { useEditorStore } from '../../core/editor-store/store'
import { processStreamEvent } from '../../core/agent/agentSlice'
import type { AgentMessage } from '../../core/agent/types'
import '../../modules/base'

function freshAgentState() {
  useEditorStore.setState({
    project: null,
    _historyPast: [],
    _historyFuture: [],
    canUndo: false,
    canRedo: false,
    selectedNodeId: null,
    hoveredNodeId: null,
    activeClassId: null,
    isAgentOpen: true,
    isAgentStreaming: true,
    agentMessages: [],
    agentError: null,
    hasUnsavedChanges: false,
  })

  const project = useEditorStore.getState().createProject('Agent Test')
  const rootId = project.pages[0].rootNodeId
  const assistantId = 'assistant-1'
  const assistantMessage: AgentMessage = {
    id: assistantId,
    role: 'assistant',
    content: '',
    toolCalls: [],
    timestamp: Date.now(),
  }
  useEditorStore.setState({ agentMessages: [assistantMessage] })
  return { assistantId, rootId }
}

describe('processStreamEvent — action failures', () => {
  it('marks unexecuted tool calls as error instead of leaving them pending', async () => {
    const { assistantId, rootId } = freshAgentState()

    await processStreamEvent(
      {
        type: 'actions',
        actions: [
          { type: 'insertNode', ref: 'hero', moduleId: 'base.container', parentId: rootId },
          { type: 'insertNode', moduleId: 'base.text', parentRef: 'missing-ref', props: { text: 'Hero', tag: 'h1' } },
          { type: 'insertNode', moduleId: 'base.button', parentRef: 'hero', props: { label: 'Start' } },
        ],
      },
      assistantId,
      () => {},
      useEditorStore.setState,
      useEditorStore.getState,
    )

    const state = useEditorStore.getState()
    const toolCalls = state.agentMessages[0].toolCalls

    expect(toolCalls.map((tc) => tc.status)).toEqual(['success', 'error', 'error'])
    expect(toolCalls[2].result?.error).toContain('Skipped')
    expect(state.agentError).toContain('Some actions could not be completed')
    expect(state.agentMessages[0].content).toContain("couldn't complete all changes")
  })
})
