/**
 * Global test setup — runs before every test file via bunfig.toml preload.
 *
 * Sets up a happy-dom environment so that @testing-library/react and
 * other DOM-dependent code can run in bun test without a real browser.
 *
 * Uses GlobalWindow (not Window) so that JS built-ins (SyntaxError, TypeError,
 * etc.) are available on the window object — required by @testing-library/dom's
 * querySelectorAll implementation.
 */
import { GlobalWindow } from 'happy-dom'

const happyWindow = new GlobalWindow({ url: 'http://localhost/' })

// Assign the window and document globals first — other globals are derived from these
;(globalThis as Record<string, unknown>).window = happyWindow
;(globalThis as Record<string, unknown>).document = happyWindow.document

// Assign all remaining browser globals from the happy-dom GlobalWindow.
// This ensures built-in constructors (SyntaxError, HTMLElement, etc.) are
// accessible both as standalone globals AND as window.* properties.
const GLOBALS_TO_COPY = [
  'navigator',
  'location',
  'history',
  'screen',
  'HTMLElement',
  'Element',
  'Node',
  'Event',
  'CustomEvent',
  'KeyboardEvent',
  'MouseEvent',
  'FocusEvent',
  'InputEvent',
  'MutationObserver',
  'ResizeObserver',
  'IntersectionObserver',
  'DOMParser',
  'XMLSerializer',
  'URLSearchParams',
  'URL',
  'FormData',
  'Blob',
  'File',
  'FileReader',
  'Headers',
  'Request',
  'Response',
  'fetch',
  'AbortController',
  'AbortSignal',
  'crypto',
  'getComputedStyle',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'setTimeout',
  'clearTimeout',
  'setInterval',
  'clearInterval',
  'queueMicrotask',
  'performance',
  'localStorage',
  'sessionStorage',
  'SyntaxError',
  'TypeError',
  'RangeError',
  'DOMException',
  'Text',
  'Comment',
  'DocumentFragment',
  'Range',
  'Selection',
  'Storage',
  'CSSStyleDeclaration',
  'HTMLInputElement',
  'HTMLButtonElement',
  'HTMLDivElement',
  'HTMLSpanElement',
  'HTMLAnchorElement',
  'HTMLFormElement',
  'HTMLSelectElement',
  'HTMLTextAreaElement',
  'SVGElement',
] as const

for (const key of GLOBALS_TO_COPY) {
  const val = (happyWindow as Record<string, unknown>)[key]
  if (val !== undefined) {
    ;(globalThis as Record<string, unknown>)[key] = val
  }
}
