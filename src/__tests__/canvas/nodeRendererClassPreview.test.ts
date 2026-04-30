import { describe, it, expect } from 'bun:test'
import { getCanvasNodeClassName } from '../../editor/components/Canvas/NodeRenderer'

describe('NodeRenderer class hover preview', () => {
  it('adds a hovered class preview to the matching canvas node className', () => {
    expect(
      getCanvasNodeClassName(
        ['assigned'],
        { nodeId: 'node-1', classId: 'preview' },
        'node-1',
      ),
    ).toBe('mc-assigned mc-preview')
  })

  it('does not add a preview class to other nodes', () => {
    expect(
      getCanvasNodeClassName(
        ['assigned'],
        { nodeId: 'node-2', classId: 'preview' },
        'node-1',
      ),
    ).toBe('mc-assigned')
  })

  it('does not duplicate a class already assigned to the node', () => {
    expect(
      getCanvasNodeClassName(
        ['assigned', 'preview'],
        { nodeId: 'node-1', classId: 'preview' },
        'node-1',
      ),
    ).toBe('mc-assigned mc-preview')
  })
})
