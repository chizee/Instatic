import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '../../..')
const SRC_ROOT = join(ROOT, 'src')

function read(path: string): string {
  return readFileSync(path, 'utf8')
}

describe('Self-hosted CMS pivot — static ZIP export removal', () => {
  it('does not keep the old publisher ZIP export module', () => {
    expect(existsSync(join(SRC_ROOT, 'core/publisher/export.ts'))).toBe(false)
  })

  it('does not expose static ZIP export from the publisher barrel', () => {
    const src = read(join(SRC_ROOT, 'core/publisher/index.ts'))
    expect(src).not.toContain('exportProjectAsZip')
    expect(src).not.toContain('downloadZip')
    expect(src).not.toContain('./export')
  })

  it('does not keep JSZip as an application dependency', () => {
    const pkg = JSON.parse(read(join(ROOT, 'package.json'))) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }

    expect(pkg.dependencies?.jszip).toBeUndefined()
    expect(pkg.devDependencies?.['@types/jszip']).toBeUndefined()
  })

  it('removes stale React export file-map state from projectPanelSlice', () => {
    const src = read(join(SRC_ROOT, 'core/editor-store/slices/projectPanelSlice.ts'))
    expect(src).not.toContain('lastReactExport')
    expect(src).not.toContain('setLastReactExport')
  })
})
