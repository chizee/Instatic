/**
 * Canvas coordinate conversion utilities — pure functions, zero side effects.
 *
 * These are the canonical coordinate-space conversion functions defined in
 * Architecture Spec #435 (Decision 2 — Two Coordinate Spaces, One Conversion).
 *
 * Transform model: `translate(panX, panY) scale(zoom)`
 * → a point at document coords (dx, dy) appears at viewport coords
 *   (dx * zoom + panX, dy * zoom + panY)
 *
 * Invariant: node dimensions, page tree coordinates, and all store data are
 * always in document space. Pointer events arrive in viewport space and must
 * be converted via viewportToDocument() before touching the page tree.
 *
 * @see Contribution #435 — Phase 2 Infinite Canvas Architecture Spec (Decision 2)
 */

/**
 * Convert a viewport-space point to document-space coordinates.
 *
 * Use this when a raw pointer event (e.clientX/Y relative to the canvas
 * root element) needs to be mapped to a position in the page tree.
 *
 * @param vx   Viewport X — client X relative to the canvas root element left edge
 * @param vy   Viewport Y — client Y relative to the canvas root element top edge
 * @param pan  Current pan offsets `{ x: panX, y: panY }` in viewport space
 * @param zoom Current zoom level (0.1 – 4.0)
 * @returns    Point in document (canvas) space
 */
export function viewportToDocument(
  vx: number,
  vy: number,
  pan: { x: number; y: number },
  zoom: number,
): { x: number; y: number } {
  return {
    x: (vx - pan.x) / zoom,
    y: (vy - pan.y) / zoom,
  }
}

/**
 * Convert a document-space point to viewport-space coordinates.
 *
 * Use this when a page tree position (e.g. node bounds) needs to be
 * mapped back to viewport pixels — for example, to position a selection
 * overlay or a tooltip over the canvas.
 *
 * @param dx   Document X — X coordinate in canvas/document space
 * @param dy   Document Y — Y coordinate in canvas/document space
 * @param pan  Current pan offsets `{ x: panX, y: panY }` in viewport space
 * @param zoom Current zoom level (0.1 – 4.0)
 * @returns    Point in viewport space (relative to the canvas root element)
 */
export function documentToViewport(
  dx: number,
  dy: number,
  pan: { x: number; y: number },
  zoom: number,
): { x: number; y: number } {
  return {
    x: dx * zoom + pan.x,
    y: dy * zoom + pan.y,
  }
}
