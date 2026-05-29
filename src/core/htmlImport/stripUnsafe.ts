/**
 * Strip dangerous / out-of-scope constructs from a parsed HTML Document,
 * mutating it in place.
 *
 * What is stripped:
 *   - <script> elements               → counted as `scripts`
 *   - <style> elements                → counted as `styles`
 *   - Inline event-handler attributes → counted as `inlineHandlers`
 *     (any attribute whose name begins with "on", e.g. onclick, onload)
 *   - Inline style="…" attributes    → counted as `inlineStyles`
 *   - HTML comments and processing instructions (no count — silently removed)
 *
 * CSS is entirely out of scope. No CSS is parsed or preserved.
 */

export interface StripReport {
  scripts: number
  styles: number
  inlineHandlers: number
  inlineStyles: number
}

/**
 * Recursively remove comment nodes (nodeType 8) and processing-instruction
 * nodes (nodeType 7) from the subtree rooted at `node`.
 *
 * Uses the `nextSibling` pattern (capture before removal) so we never skip
 * nodes while mutating the child list.
 */
function removeCommentsAndPIs(node: Node): void {
  let child = node.firstChild
  while (child !== null) {
    const next = child.nextSibling
    if (
      child.nodeType === 8 /* COMMENT_NODE */ ||
      child.nodeType === 7 /* PROCESSING_INSTRUCTION_NODE */
    ) {
      node.removeChild(child)
    } else {
      removeCommentsAndPIs(child)
    }
    child = next
  }
}

/**
 * Strip unsafe constructs from `doc` in place and return counts of what
 * was removed. The caller (importHtml) surfaces these counts in a toast so
 * the user knows what was dropped.
 */
export function stripUnsafe(doc: Document): StripReport {
  const report: StripReport = { scripts: 0, styles: 0, inlineHandlers: 0, inlineStyles: 0 }

  // Remove <script> elements first so their content cannot be accessed.
  for (const el of Array.from(doc.querySelectorAll('script'))) {
    el.remove()
    report.scripts++
  }

  // Remove <style> elements — CSS is out of scope for the importer.
  for (const el of Array.from(doc.querySelectorAll('style'))) {
    el.remove()
    report.styles++
  }

  // Strip dangerous attributes from every remaining element.
  // Collect attribute names before removing to avoid NamedNodeMap mutation
  // issues while iterating.
  for (const el of Array.from(doc.querySelectorAll('*'))) {
    const toRemove: string[] = []
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('on')) {
        toRemove.push(attr.name)
        report.inlineHandlers++
      } else if (attr.name === 'style') {
        toRemove.push(attr.name)
        report.inlineStyles++
      }
    }
    for (const name of toRemove) {
      el.removeAttribute(name)
    }
  }

  removeCommentsAndPIs(doc)

  return report
}
