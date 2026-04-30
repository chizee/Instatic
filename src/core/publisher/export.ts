/**
 * Publisher — ZIP Export
 *
 * Converts an entire Project into a ZIP archive containing one HTML file per page.
 * Each page is a fully self-contained HTML document — no shared CSS files,
 * no inter-page dependencies, no editor or framework runtime.
 *
 * Uses jszip (already in project dependencies).
 */

import JSZip from 'jszip'
import type { Project } from '../page-tree/types'
import type { IModuleRegistry } from '../module-engine/types'
import { publishPage } from './render'

/**
 * Export the entire project as a ZIP Blob.
 *
 * Each page → one .html file inside the ZIP root.
 * The ZIP is DEFLATE-compressed at level 6 (good ratio, reasonable speed).
 *
 * @param project   The full project document
 * @param registry  The module registry (all modules must be registered)
 * @returns         A Blob containing the .zip archive
 */
export async function exportProjectAsZip(
  project: Project,
  registry: IModuleRegistry,
): Promise<Blob> {
  const zip = new JSZip()

  for (const page of project.pages) {
    const { filename, html } = publishPage(page, project, registry)
    zip.file(filename, html)
  }

  return zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  })
}

/**
 * Trigger a browser file-save dialog for the given Blob.
 * Call this from the Toolbar's "Export" button handler.
 *
 * @param blob      The ZIP Blob returned by exportProjectAsZip()
 * @param filename  Download filename (default: "website.zip")
 */
export function downloadZip(blob: Blob, filename = 'website.zip'): void {
  const url = URL.createObjectURL(blob)
  try {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  } finally {
    // Always revoke — even if click() throws — to prevent memory leak
    URL.revokeObjectURL(url)
  }
}
