import { describe, it, expect } from 'bun:test'
import { readFileSync } from 'fs'

const CANVAS_ROOT = new URL('../../editor/components/Canvas/CanvasRoot.tsx', import.meta.url)
const CANVAS_NOTCH = new URL('../../editor/components/Canvas/CanvasNotch.tsx', import.meta.url)
const CANVAS_NOTCH_CSS = new URL('../../editor/components/Canvas/CanvasNotch.module.css', import.meta.url)
const TOOLBAR = new URL('../../editor/components/Toolbar/Toolbar.tsx', import.meta.url)
const SELECTION_OVERLAY = new URL('../../editor/components/Canvas/SelectionOverlay.tsx', import.meta.url)

describe('CanvasNotch', () => {
  it('is rendered by CanvasRoot as fixed canvas chrome', () => {
    const src = readFileSync(CANVAS_ROOT, 'utf-8')

    expect(src).toContain('CanvasNotch')
    expect(src).toContain('<CanvasNotch />')
  })

  it('exposes the approved quick insert actions', () => {
    const src = readFileSync(CANVAS_NOTCH, 'utf-8')

    expect(src).toContain("moduleId: 'base.container'")
    expect(src).toContain("icon: 'checkbox-sharp'")
    expect(src).toContain("moduleId: 'base.text'")
    expect(src).toContain("moduleId: 'base.button'")
    expect(src).toContain('canvas-notch-add-btn')
  })

  it('uses one shared pseudo-element for inverted notch corners', () => {
    const css = readFileSync(CANVAS_NOTCH_CSS, 'utf-8')

    expect(css).toContain('.notch::before')
    expect(css).not.toContain('.notch::after')
    expect(css).toContain('.notch > *')
    expect(css).toContain('z-index: 1')
    expect(css).toContain('z-index: 0')
    expect(css).toContain('left: calc(2px - var(--notch-corner))')
    expect(css).toContain('right: calc(2px - var(--notch-corner))')
    expect(css).toContain('transform: rotate(180deg)')
    expect(css).toContain('radial-gradient(circle at 0 0')
    expect(css).toContain('radial-gradient(circle at 100% 0')
    expect(css).not.toContain('border-bottom-right-radius')
    expect(css).not.toContain('border-bottom-left-radius')
  })

  it('does not draw real side borders through the inverted-corner seam', () => {
    const css = readFileSync(CANVAS_NOTCH_CSS, 'utf-8')

    expect(css).toContain('border: 0')
    expect(css).not.toContain('border: 1px solid')
    expect(css).not.toContain('border-top: 0')
    expect(css).toContain('left: calc(2px - var(--notch-corner))')
    expect(css).toContain('right: calc(2px - var(--notch-corner))')
  })

  it('uses radial gradient corner fills instead of box-shadow illusion seams', () => {
    const css = readFileSync(CANVAS_NOTCH_CSS, 'utf-8')

    expect(css).toContain('radial-gradient(circle at 0 0')
    expect(css).toContain('radial-gradient(circle at 100% 0')
    expect(css).toContain('--notch-corner-cut')
    expect(css).not.toContain('box-shadow: 9px -9px')
    expect(css).not.toContain('box-shadow: -9px -9px')
  })

  it('moves the Add picker out of the top toolbar', () => {
    const src = readFileSync(TOOLBAR, 'utf-8')

    expect(src).not.toContain('ModulePickerDropdown')
    expect(src).not.toContain('toolbar-add-module-btn')
  })

  it('removes the floating Duplicate/Delete selection toolbar', () => {
    const src = readFileSync(SELECTION_OVERLAY, 'utf-8')

    expect(src).not.toContain('Duplicate selected element')
    expect(src).not.toContain('Delete selected element')
    expect(src).not.toContain('role="toolbar"')
  })
})
