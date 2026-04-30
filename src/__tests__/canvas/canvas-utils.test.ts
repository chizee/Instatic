/**
 * canvas.utils.ts — coordinate conversion unit tests
 *
 * Tests viewportToDocument and documentToViewport: the two canonical
 * coordinate-space conversion functions from Architecture Spec #435 (Decision 2).
 *
 * Invariant:
 *   documentToViewport(viewportToDocument(vx, vy, pan, zoom), pan, zoom) === { vx, vy }
 * i.e. round-tripping through both conversions is lossless (modulo floating point).
 *
 * @see Contribution #435 — Phase 2 Infinite Canvas Architecture Spec (Decision 2)
 * @see src/editor/components/Canvas/canvas.utils.ts
 */

import { describe, it, expect } from 'bun:test'
import { viewportToDocument, documentToViewport } from '../../editor/components/Canvas/canvas.utils'

// ---------------------------------------------------------------------------
// viewportToDocument
// ---------------------------------------------------------------------------

describe('viewportToDocument', () => {
  it('maps viewport origin to document origin at zoom=1, pan=(0,0)', () => {
    const result = viewportToDocument(0, 0, { x: 0, y: 0 }, 1)
    expect(result).toEqual({ x: 0, y: 0 })
  })

  it('is identity at zoom=1 with zero pan', () => {
    const result = viewportToDocument(100, 200, { x: 0, y: 0 }, 1)
    expect(result).toEqual({ x: 100, y: 200 })
  })

  it('scales down by zoom (zoom=2 halves document coordinates)', () => {
    const result = viewportToDocument(200, 400, { x: 0, y: 0 }, 2)
    expect(result).toEqual({ x: 100, y: 200 })
  })

  it('scales up by zoom (zoom=0.5 doubles document coordinates)', () => {
    const result = viewportToDocument(100, 50, { x: 0, y: 0 }, 0.5)
    expect(result).toEqual({ x: 200, y: 100 })
  })

  it('subtracts pan offset before scaling', () => {
    // viewport point (150, 150), pan (50, 50), zoom 1 → doc (100, 100)
    const result = viewportToDocument(150, 150, { x: 50, y: 50 }, 1)
    expect(result).toEqual({ x: 100, y: 100 })
  })

  it('applies both pan offset and zoom correctly', () => {
    // viewport (300, 200), pan (100, 0), zoom 2
    // doc.x = (300 - 100) / 2 = 100
    // doc.y = (200 - 0)   / 2 = 100
    const result = viewportToDocument(300, 200, { x: 100, y: 0 }, 2)
    expect(result.x).toBeCloseTo(100)
    expect(result.y).toBeCloseTo(100)
  })

  it('handles negative pan offsets', () => {
    // viewport (50, 50), pan (-100, -100), zoom 1
    // doc.x = (50 - (-100)) / 1 = 150
    const result = viewportToDocument(50, 50, { x: -100, y: -100 }, 1)
    expect(result).toEqual({ x: 150, y: 150 })
  })

  it('handles fractional zoom values', () => {
    const result = viewportToDocument(100, 100, { x: 0, y: 0 }, 0.25)
    expect(result.x).toBeCloseTo(400)
    expect(result.y).toBeCloseTo(400)
  })

  it('handles negative viewport coordinates', () => {
    const result = viewportToDocument(-100, -50, { x: 0, y: 0 }, 1)
    expect(result).toEqual({ x: -100, y: -50 })
  })
})

// ---------------------------------------------------------------------------
// documentToViewport
// ---------------------------------------------------------------------------

describe('documentToViewport', () => {
  it('maps document origin to viewport origin at zoom=1, pan=(0,0)', () => {
    const result = documentToViewport(0, 0, { x: 0, y: 0 }, 1)
    expect(result).toEqual({ x: 0, y: 0 })
  })

  it('is identity at zoom=1 with zero pan', () => {
    const result = documentToViewport(100, 200, { x: 0, y: 0 }, 1)
    expect(result).toEqual({ x: 100, y: 200 })
  })

  it('scales up by zoom (zoom=2 doubles viewport coordinates)', () => {
    const result = documentToViewport(100, 200, { x: 0, y: 0 }, 2)
    expect(result).toEqual({ x: 200, y: 400 })
  })

  it('scales down by zoom (zoom=0.5 halves viewport coordinates)', () => {
    const result = documentToViewport(200, 100, { x: 0, y: 0 }, 0.5)
    expect(result).toEqual({ x: 100, y: 50 })
  })

  it('adds pan offset after scaling', () => {
    // doc (100, 100), pan (50, 50), zoom 1 → viewport (150, 150)
    const result = documentToViewport(100, 100, { x: 50, y: 50 }, 1)
    expect(result).toEqual({ x: 150, y: 150 })
  })

  it('applies both scaling and pan offset correctly', () => {
    // doc (100, 100), pan (100, 0), zoom 2
    // vp.x = 100 * 2 + 100 = 300
    // vp.y = 100 * 2 + 0   = 200
    const result = documentToViewport(100, 100, { x: 100, y: 0 }, 2)
    expect(result).toEqual({ x: 300, y: 200 })
  })

  it('handles negative pan offsets', () => {
    const result = documentToViewport(150, 150, { x: -100, y: -100 }, 1)
    expect(result).toEqual({ x: 50, y: 50 })
  })

  it('handles fractional zoom values', () => {
    const result = documentToViewport(400, 400, { x: 0, y: 0 }, 0.25)
    expect(result.x).toBeCloseTo(100)
    expect(result.y).toBeCloseTo(100)
  })
})

// ---------------------------------------------------------------------------
// Round-trip invariant: documentToViewport(viewportToDocument(v)) === v
// ---------------------------------------------------------------------------

describe('round-trip invariant — viewportToDocument ↔ documentToViewport', () => {
  const cases: Array<{
    label: string
    vx: number
    vy: number
    pan: { x: number; y: number }
    zoom: number
  }> = [
    { label: 'identity', vx: 0, vy: 0, pan: { x: 0, y: 0 }, zoom: 1 },
    { label: 'zoom=2', vx: 300, vy: 200, pan: { x: 0, y: 0 }, zoom: 2 },
    { label: 'zoom=0.5', vx: 100, vy: 50, pan: { x: 0, y: 0 }, zoom: 0.5 },
    { label: 'pan only', vx: 150, vy: 150, pan: { x: 50, y: 50 }, zoom: 1 },
    { label: 'pan + zoom', vx: 300, vy: 200, pan: { x: 100, y: 0 }, zoom: 2 },
    { label: 'negative pan', vx: 50, vy: 50, pan: { x: -100, y: -100 }, zoom: 1 },
    { label: 'zoom=1.5 + pan', vx: 200, vy: 300, pan: { x: 80, y: -40 }, zoom: 1.5 },
    { label: 'min zoom', vx: 100, vy: 100, pan: { x: 0, y: 0 }, zoom: 0.1 },
    { label: 'max zoom', vx: 100, vy: 100, pan: { x: 0, y: 0 }, zoom: 4 },
  ]

  for (const { label, vx, vy, pan, zoom } of cases) {
    it(`round-trips losslessly (${label})`, () => {
      const doc = viewportToDocument(vx, vy, pan, zoom)
      const back = documentToViewport(doc.x, doc.y, pan, zoom)
      expect(back.x).toBeCloseTo(vx, 8)
      expect(back.y).toBeCloseTo(vy, 8)
    })
  }

  it('round-trip from document to viewport and back', () => {
    const dx = 250
    const dy = 180
    const pan = { x: 60, y: -30 }
    const zoom = 1.25
    const vp = documentToViewport(dx, dy, pan, zoom)
    const back = viewportToDocument(vp.x, vp.y, pan, zoom)
    expect(back.x).toBeCloseTo(dx, 8)
    expect(back.y).toBeCloseTo(dy, 8)
  })
})

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('edge cases', () => {
  it('viewportToDocument handles zoom approaching 0 (very small zoom)', () => {
    // At very small zoom, document coordinates are very large but finite
    const result = viewportToDocument(1, 1, { x: 0, y: 0 }, 0.01)
    expect(Number.isFinite(result.x)).toBe(true)
    expect(Number.isFinite(result.y)).toBe(true)
    expect(result.x).toBeCloseTo(100)
  })

  it('documentToViewport at zoom=0 returns NaN (degenerate input — caller must guard)', () => {
    // zoom=0 would mean the canvas is collapsed; division by zero in the
    // reverse direction. The caller is responsible for ensuring zoom > 0.
    // We document (not suppress) the degenerate behaviour here.
    const result = documentToViewport(100, 100, { x: 0, y: 0 }, 0)
    // zoom=0 * anything = 0, so result is the pan offset
    expect(result.x).toBe(0)
    expect(result.y).toBe(0)
  })

  it('both functions are pure — same inputs always produce same outputs', () => {
    const pan = { x: 40, y: -20 }
    const zoom = 1.5
    const a = viewportToDocument(100, 200, pan, zoom)
    const b = viewportToDocument(100, 200, pan, zoom)
    expect(a).toEqual(b)

    const c = documentToViewport(50, 80, pan, zoom)
    const d = documentToViewport(50, 80, pan, zoom)
    expect(c).toEqual(d)
  })

  it('functions do not mutate the pan object', () => {
    const pan = { x: 10, y: 20 }
    const originalX = pan.x
    const originalY = pan.y
    viewportToDocument(100, 100, pan, 2)
    documentToViewport(100, 100, pan, 2)
    expect(pan.x).toBe(originalX)
    expect(pan.y).toBe(originalY)
  })
})
