const EXTERNAL_FONT_STYLESHEET_HOSTS = new Set([
  'fonts.googleapis.com',
])

const CSS_IMPORT_RE = /@import\s+(?:url\(\s*(['"]?)([^'")]+)\1\s*\)|(['"])([^'"]+)\3)[^;]*;/gi
const CSS_COMMENT_RE = /\/\*[\s\S]*?\*\//g

function isExternalFontStylesheetUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl)
    return parsed.protocol === 'https:' && EXTERNAL_FONT_STYLESHEET_HOSTS.has(parsed.hostname.toLowerCase())
  } catch {
    return false
  }
}

/**
 * Extract safe external font stylesheet URLs from CSS @import rules.
 *
 * The importer deliberately does not model arbitrary @import CSS as page
 * styles: that would leave an opaque third-party stylesheet in published
 * output. Font provider stylesheets are different; they are the browser
 * loading directive for imported font-family declarations such as
 * `--body-font: "Manrope", sans-serif`.
 */
export function extractExternalFontImportUrls(cssSource: string): string[] {
  const urls: string[] = []
  const seen = new Set<string>()
  const sourceWithoutComments = cssSource.replace(CSS_COMMENT_RE, '')

  for (const match of sourceWithoutComments.matchAll(CSS_IMPORT_RE)) {
    const rawUrl = (match[2] ?? match[4] ?? '').trim()
    if (!isExternalFontStylesheetUrl(rawUrl) || seen.has(rawUrl)) continue
    seen.add(rawUrl)
    urls.push(rawUrl)
  }

  return urls
}

export function stripExternalFontImportRules(cssSource: string): string {
  return cssSource.replace(CSS_IMPORT_RE, (source, _q1, rawUrl1, _q2, rawUrl2) => {
    const rawUrl = String(rawUrl1 ?? rawUrl2 ?? '').trim()
    return isExternalFontStylesheetUrl(rawUrl) ? '' : source
  })
}
