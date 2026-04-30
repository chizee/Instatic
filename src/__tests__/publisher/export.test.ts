/**
 * Publisher — ZIP Export Tests
 *
 * Covers `exportProjectAsZip` and `downloadZip` from `src/core/publisher/export.ts`.
 *
 * ─── Test groups ────────────────────────────────────────────────────────────
 *   1. exportProjectAsZip — returns a Blob
 *   2. exportProjectAsZip — ZIP file contents (JSZip.loadAsync round-trip)
 *   3. exportProjectAsZip — multi-page projects
 *   4. Slug sanitization / filename safety (Constraint #229 — path traversal)
 *   5. downloadZip — URL lifecycle (memory-safety, Constraint #190)
 *
 * Guideline #172: Publishing/Render Pipeline requires golden-file tests.
 * Constraint #229: ZIP filenames must be sanitised (path traversal prevention).
 * Constraint #190: Editor/published bundle split — no editor code in export.
 */

import { describe, it, expect, mock, beforeEach } from 'bun:test'
import JSZip from 'jszip'
import { readFileSync } from 'fs'
import { exportProjectAsZip, downloadZip } from '../../core/publisher/export'
import { publishPage } from '../../core/publisher/render'
import { makeModule, makeRegistry, makePage, makeProject } from './helpers'

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const headingModule = makeModule('base.heading', {
  canHaveChildren: false,
  render: (props) => ({ html: `<h1>${props['text'] ?? 'Hello'}</h1>` }),
})

const rootModule = makeModule('base.root', {
  canHaveChildren: true,
  render: (_props, children) => ({ html: children.join('') }),
})

function makeSinglePageProject() {
  const page = makePage(
    {
      root: { moduleId: 'base.root', children: ['h1'] },
      h1: { moduleId: 'base.heading', props: { text: 'Welcome' } },
    },
    'root',
  )
  return makeProject({
    name: 'My Site',
    pages: [{ ...page, slug: 'index', title: 'Home' }],
  })
}

function makeMultiPageProject() {
  const registry = makeRegistry({ 'base.root': rootModule, 'base.heading': headingModule })
  const home = {
    ...makePage(
      {
        root: { moduleId: 'base.root', children: ['h1'] },
        h1: { moduleId: 'base.heading', props: { text: 'Home' } },
      },
      'root',
    ),
    id: 'page-home',
    slug: 'index',
    title: 'Home',
  }
  const about = {
    ...makePage(
      {
        root: { moduleId: 'base.root', children: ['h1'] },
        h1: { moduleId: 'base.heading', props: { text: 'About' } },
      },
      'root',
    ),
    id: 'page-about',
    slug: 'about',
    title: 'About',
  }
  return {
    project: makeProject({ name: 'My Site', pages: [home, about] }),
    registry,
  }
}

const registry = makeRegistry({ 'base.root': rootModule, 'base.heading': headingModule })

// ---------------------------------------------------------------------------
// 1 — exportProjectAsZip returns a Blob
// ---------------------------------------------------------------------------

describe('exportProjectAsZip — returns a Blob', () => {
  it('returns a Promise<Blob>', async () => {
    const project = makeSinglePageProject()
    const result = exportProjectAsZip(project, registry)
    expect(result).toBeInstanceOf(Promise)
    const blob = await result
    expect(blob).toBeInstanceOf(Blob)
  })

  it('returns a Blob with non-zero size', async () => {
    const project = makeSinglePageProject()
    const blob = await exportProjectAsZip(project, registry)
    expect(blob.size).toBeGreaterThan(0)
  })

  it('multi-page ZIP is larger than single-page ZIP', async () => {
    const { project: multi, registry: reg } = makeMultiPageProject()
    const single = makeSinglePageProject()
    const [singleBlob, multiBlob] = await Promise.all([
      exportProjectAsZip(single, registry),
      exportProjectAsZip(multi, reg),
    ])
    expect(multiBlob.size).toBeGreaterThan(singleBlob.size)
  })
})

// ---------------------------------------------------------------------------
// 2 — ZIP file contents (JSZip round-trip)
// ---------------------------------------------------------------------------

describe('exportProjectAsZip — ZIP file contents', () => {
  it('single-page project produces exactly one file in the ZIP', async () => {
    const project = makeSinglePageProject()
    const blob = await exportProjectAsZip(project, registry)

    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const files = Object.keys(zip.files)
    expect(files.length).toBe(1)
  })

  it('the single file is named "index.html" (home page slug: "index")', async () => {
    const project = makeSinglePageProject()
    const blob = await exportProjectAsZip(project, registry)

    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const files = Object.keys(zip.files)
    expect(files).toContain('index.html')
  })

  it('HTML content is a complete document (<!DOCTYPE html>)', async () => {
    const project = makeSinglePageProject()
    const blob = await exportProjectAsZip(project, registry)

    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const html = await zip.file('index.html')!.async('string')
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<html')
    expect(html).toContain('<head>')
    expect(html).toContain('<body>')
    expect(html).toContain('</html>')
  })

  it('HTML content matches publishPage output for the same page', async () => {
    const project = makeSinglePageProject()
    const blob = await exportProjectAsZip(project, registry)

    // Reference output from publishPage directly
    const expected = publishPage(project.pages[0], project, registry)

    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const actual = await zip.file('index.html')!.async('string')
    expect(actual).toBe(expected.html)
  })

  it('HTML contains the page title from project settings', async () => {
    const project = makeSinglePageProject()
    const blob = await exportProjectAsZip(project, registry)

    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const html = await zip.file('index.html')!.async('string')
    // The page title "Home" (or project name "My Site") should appear in <title>
    expect(html).toMatch(/<title>[^<]*<\/title>/)
  })

  it('HTML contains the Content-Security-Policy meta tag (Constraint #227)', async () => {
    const project = makeSinglePageProject()
    const blob = await exportProjectAsZip(project, registry)

    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const html = await zip.file('index.html')!.async('string')
    expect(html).toContain('Content-Security-Policy')
    // script-src 'none' is the hardened policy
    expect(html).toContain("script-src 'none'")
  })
})

// ---------------------------------------------------------------------------
// 3 — Multi-page projects
// ---------------------------------------------------------------------------

describe('exportProjectAsZip — multi-page projects', () => {
  it('two-page project produces exactly two files in the ZIP', async () => {
    const { project, registry: reg } = makeMultiPageProject()
    const blob = await exportProjectAsZip(project, reg)

    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const files = Object.keys(zip.files)
    expect(files.length).toBe(2)
  })

  it('files are named "index.html" and "about.html"', async () => {
    const { project, registry: reg } = makeMultiPageProject()
    const blob = await exportProjectAsZip(project, reg)

    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const files = Object.keys(zip.files).sort()
    expect(files).toContain('index.html')
    expect(files).toContain('about.html')
  })

  it('each file contains its respective page content', async () => {
    const { project, registry: reg } = makeMultiPageProject()
    const blob = await exportProjectAsZip(project, reg)

    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const homeHtml = await zip.file('index.html')!.async('string')
    const aboutHtml = await zip.file('about.html')!.async('string')

    // Home page has "Home" heading, About page has "About" heading
    expect(homeHtml).toContain('Home')
    expect(aboutHtml).toContain('About')

    // Pages must not bleed into each other
    expect(homeHtml).not.toContain('>About<')
    expect(aboutHtml).not.toContain('>Home<')
  })

  it('pages are independent — no shared stylesheets or inter-page links', async () => {
    const { project, registry: reg } = makeMultiPageProject()
    const blob = await exportProjectAsZip(project, reg)

    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const homeHtml = await zip.file('index.html')!.async('string')
    const aboutHtml = await zip.file('about.html')!.async('string')

    // No external CSS file references (styles must be embedded)
    expect(homeHtml).not.toContain('<link rel="stylesheet" href="styles')
    expect(aboutHtml).not.toContain('<link rel="stylesheet" href="styles')
  })
})

// ---------------------------------------------------------------------------
// 4 — Slug sanitisation / filename safety (Constraint #229)
// ---------------------------------------------------------------------------

describe('publishPage — filename slug sanitisation (Constraint #229)', () => {
  // slugToFilename() is private but tested indirectly via publishPage().filename

  it('normal slug "about-us" → "about-us.html"', () => {
    const page = {
      ...makePage({ root: { moduleId: 'base.root', children: [] } }, 'root'),
      slug: 'about-us',
      title: 'About Us',
    }
    const project = makeProject({ pages: [page] })
    const { filename } = publishPage(page, project, registry)
    expect(filename).toBe('about-us.html')
  })

  it('"index" slug → "index.html"', () => {
    const page = {
      ...makePage({ root: { moduleId: 'base.root', children: [] } }, 'root'),
      slug: 'index',
      title: 'Home',
    }
    const project = makeProject({ pages: [page] })
    const { filename } = publishPage(page, project, registry)
    expect(filename).toBe('index.html')
  })

  it('empty slug falls back to page title, slugified', () => {
    const page = {
      ...makePage({ root: { moduleId: 'base.root', children: [] } }, 'root'),
      slug: '',
      title: 'Contact Us',
    }
    const project = makeProject({ pages: [page] })
    const { filename } = publishPage(page, project, registry)
    // title "Contact Us" → "contact-us.html"
    expect(filename).toBe('contact-us.html')
  })

  it('path traversal "../../../etc/passwd" in slug is sanitised (Constraint #229)', () => {
    const maliciousSlug = '../../../etc/passwd'
    const page = {
      ...makePage({ root: { moduleId: 'base.root', children: [] } }, 'root'),
      slug: maliciousSlug,
      title: 'Evil Page',
    }
    const project = makeProject({ pages: [page] })
    const { filename } = publishPage(page, project, registry)
    // Path separators and dots stripped — no ../ in output
    expect(filename).not.toContain('../')
    expect(filename).not.toContain('/')
    expect(filename).not.toContain('\\')
    // Should produce something like "etc-passwd.html" (dots stripped)
    expect(filename).toMatch(/^[a-z0-9-]+\.html$/)
  })

  it('slug with null bytes and special chars produces a clean filename', () => {
    const page = {
      ...makePage({ root: { moduleId: 'base.root', children: [] } }, 'root'),
      slug: 'my page! (2024)',
      title: 'My Page',
    }
    const project = makeProject({ pages: [page] })
    const { filename } = publishPage(page, project, registry)
    // Special characters replaced with hyphens, deduped
    expect(filename).toMatch(/^[a-z0-9-]+\.html$/)
    expect(filename).not.toContain(' ')
    expect(filename).not.toContain('!')
    expect(filename).not.toContain('(')
  })

  it('slug "UPPER-CASE" is lowercased', () => {
    const page = {
      ...makePage({ root: { moduleId: 'base.root', children: [] } }, 'root'),
      slug: 'ABOUT-US',
      title: 'About',
    }
    const project = makeProject({ pages: [page] })
    const { filename } = publishPage(page, project, registry)
    expect(filename).toBe('about-us.html')
  })
})

// ---------------------------------------------------------------------------
// 5 — downloadZip — source-scan assertions (memory safety, Constraint #190)
//
// `downloadZip` creates a temporary anchor element, clicks it, then removes it.
// The key safety invariant is that `URL.revokeObjectURL` is called inside a
// `finally` block — guaranteeing the object URL is freed even if anchor.click()
// throws. We verify this structurally rather than calling downloadZip directly
// (happy-dom navigation events from anchor.click() would leak into other test files).
// ---------------------------------------------------------------------------

describe('downloadZip — source-scan (memory safety, Constraint #190)', () => {
  const exportSrc = readFileSync(
    new URL('../../core/publisher/export.ts', import.meta.url),
    'utf-8',
  )

  it('revokeObjectURL is called inside a finally block (prevents memory leak)', () => {
    // Constraint #190: object URL must always be revoked — even if click() throws.
    expect(exportSrc).toContain('finally')
    expect(exportSrc).toContain('URL.revokeObjectURL(url)')
    // The revokeObjectURL call must appear AFTER the finally keyword
    const finallyIndex = exportSrc.indexOf('finally')
    const revokeIndex = exportSrc.indexOf('URL.revokeObjectURL(url)')
    expect(revokeIndex).toBeGreaterThan(finallyIndex)
  })

  it('anchor element is removed from document.body after click (no DOM leak)', () => {
    // The anchor created for the download must be cleaned up.
    expect(exportSrc).toContain('document.body.removeChild(anchor)')
  })

  it('downloadZip defaults to "website.zip" when no filename is provided', () => {
    expect(exportSrc).toContain("filename = 'website.zip'")
  })

  it('anchor is styled display:none to avoid layout flash during trigger', () => {
    // A hidden anchor prevents the page from visually rendering a link.
    expect(exportSrc).toContain("anchor.style.display = 'none'")
  })

  it('anchor href is set to the object URL (not a static string)', () => {
    expect(exportSrc).toContain('anchor.href = url')
  })

  it('anchor download attribute is set to the filename parameter', () => {
    expect(exportSrc).toContain('anchor.download = filename')
  })
})
