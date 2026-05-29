/**
 * HTML → module mapping rules for the HTML importer.
 *
 * Rules are tested in order; the first match wins. The catch-all `*` rule
 * is always last and guarantees every element produces a node — nothing
 * falls through.
 *
 * Verified prop names against module source:
 *   base.text    — `text` (string), `tag` (TextTag)
 *   base.link    — `text` (string), `href`, `target`   (NOT `label`)
 *   base.button  — `label` (string), `href`, `target`, `disabled`
 *   base.image   — `src` only (alt comes from media library, not a prop)
 *   base.container — `tag` (builtin name | 'custom'), `customTag` (free text)
 *
 * BUILTIN_HTML_TAGS in base.container: div, section, article, main, header,
 * footer, nav, aside, ul, ol. Tags outside that set MUST use tag:'custom' +
 * customTag so resolveHtmlTag emits the real element name.
 */

export interface ImportRule {
  /** CSS selector tested via `el.matches()`. */
  match: string
  /** Returns the moduleId and props for this element. */
  map: (el: Element) => { moduleId: string; props: Record<string, unknown> }
  /**
   * When true the walker recurses into the element's children and sets
   * `node.children` to their IDs. Leaf modules (text, image, button) omit
   * this flag so they remain childless.
   */
  recurse?: boolean
}

export const HTML_TO_MODULE_RULES: ImportRule[] = [
  // Headings / paragraphs / inline phrasing → base.text (LEAF).
  // Props: `text` + `tag`.
  {
    match: 'h1, h2, h3, h4, h5, h6, p, span, small, strong, em',
    map: (el) => ({
      moduleId: 'base.text',
      props: { text: el.textContent ?? '', tag: el.tagName.toLowerCase() },
    }),
  },

  // Anchors: btn-classed → base.button (prop `label`); plain → base.link (prop `text`). LEAF.
  {
    match: 'a',
    map: (el) =>
      el.classList.contains('btn')
        ? {
            moduleId: 'base.button',
            props: {
              label: el.textContent ?? '',
              href: el.getAttribute('href') ?? '',
              target: el.getAttribute('target') ?? '_self',
            },
          }
        : {
            moduleId: 'base.link',
            props: {
              text: el.textContent ?? '',
              href: el.getAttribute('href') ?? '',
              target: el.getAttribute('target') ?? '_self',
            },
          },
  },

  // Images. `src` only — alt text is sourced from the media library asset,
  // not stored as a per-instance prop. LEAF.
  {
    match: 'img',
    map: (el) => ({
      moduleId: 'base.image',
      props: { src: el.getAttribute('src') ?? '' },
    }),
  },

  // Buttons → base.button. LEAF.
  {
    match: 'button',
    map: (el) => ({
      moduleId: 'base.button',
      props: { label: el.textContent ?? '', disabled: el.hasAttribute('disabled') },
    }),
  },

  // ul / ol are BUILTIN_HTML_TAGS for base.container → container + RECURSE.
  {
    match: 'ul, ol',
    map: (el) => ({
      moduleId: 'base.container',
      props: { tag: el.tagName.toLowerCase() },
    }),
    recurse: true,
  },

  // Semantic containers (all in BUILTIN_HTML_TAGS). RECURSE.
  {
    match: 'div, section, article, main, header, footer, nav, aside',
    map: (el) => ({
      moduleId: 'base.container',
      props: { tag: el.tagName.toLowerCase() },
    }),
    recurse: true,
  },

  // Void HTML elements. Browsers never give these DOM children, and React
  // throws if you render children inside a void tag
  // ("input is a void element tag and must neither have 'children' nor use
  // 'dangerouslySetInnerHTML'"). Map to base.container with tag:'custom' so
  // resolveHtmlTag emits the real tag name, but leave recurse unset (false)
  // so the node stays childless.
  //
  // Note: <img> is already matched above as base.image. This rule covers the
  // remaining void elements: area, base, br, col, embed, hr, input, link,
  // meta, param, source, track, wbr.
  {
    match: 'area, base, br, col, embed, hr, input, link, meta, param, source, track, wbr',
    map: (el) => ({
      moduleId: 'base.container',
      props: { tag: 'custom', customTag: el.tagName.toLowerCase() },
    }),
    // recurse intentionally omitted — void elements must remain childless.
  },

  // Catch-all for every other tag (li, figure, blockquote, form, table,
  // dialog, …). MUST use tag:'custom' + customTag so resolveHtmlTag
  // emits the real element name — tag:'div' + customTag would render <div>.
  // RECURSE.
  {
    match: '*',
    map: (el) => ({
      moduleId: 'base.container',
      props: { tag: 'custom', customTag: el.tagName.toLowerCase() },
    }),
    recurse: true,
  },
]
