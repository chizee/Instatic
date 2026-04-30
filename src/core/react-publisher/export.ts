/**
 * ReactPublisher — ZIP export via fflate.
 *
 * Converts an entire Project into a downloadable ZIP containing a complete
 * Vite + React 18 + TypeScript project:
 *
 *   package.json / vite.config.ts / tsconfig.json / index.html
 *   src/main.tsx          — app entry point
 *   src/App.tsx           — hash router
 *   src/pages/<Name>.tsx  — one component per page
 *   project.files[]       — user-authored and ejected-scaffold files (Task #430)
 *
 * Uses fflate.zipSync() (Guideline #311 — no tsc dependency at export time).
 * The sync API is used because all data is already in memory; the async wrapper
 * is exposed for callers that need to yield to the event loop.
 *
 * Isolation (Constraint #269): MUST NOT import from src/core/publisher/ or src/editor/.
 */

import { zipSync, strToU8 } from 'fflate'
import type { Project } from '../page-tree/types'
import type { IModuleRegistry } from '../module-engine/types'
import { pageToComponent, type PageComponent } from './pageToComponent'
import { generateScaffold } from './scaffold'
import type { ProjectPackageJson } from '../project-dependencies/manifest'
import { vcToComponent, topoSortVCs } from './vcToComponent'

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Decode a base64 string to Uint8Array.
 * Used for asset files stored as base64 blobs in ProjectFile.blob.
 */
function base64ToU8(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ReactProjectExportOptions {
  packageJson?: ProjectPackageJson
}

/**
 * Export the entire project as a React + Vite ZIP archive.
 *
 * Returns a Promise to remain compatible with async call sites (e.g. export
 * button handlers) and to allow future migration to fflate's async API without
 * breaking consumers.
 *
 * @param project   Full project document
 * @param registry  Module registry (all modules must be registered and have toJsx())
 * @returns         Blob containing the .zip archive (application/zip)
 */
export async function exportReactProjectAsZip(
  project: Project,
  registry: IModuleRegistry,
  options: ReactProjectExportOptions = {},
): Promise<Blob> {
  // 1. Compile each page to a .tsx component
  const pageComponents: PageComponent[] = project.pages.map((page) =>
    pageToComponent(page, project, registry),
  )

  // 2. Generate scaffold files (package.json, vite config, etc.)
  const scaffoldFiles = generateScaffold(
    project.name,
    pageComponents.map((p) => ({ slug: p.slug, componentName: p.componentName })),
    options.packageJson ?? project.packageJson,
  )

  // 3. Assemble the fflate file map: { path: Uint8Array }
  const files: Record<string, Uint8Array> = {}

  // Scaffold files land first — user files (step 4) may overwrite them when ejected.
  for (const [path, content] of Object.entries(scaffoldFiles)) {
    files[path] = strToU8(content)
  }

  for (const pc of pageComponents) {
    files[`src/pages/${pc.componentName}.tsx`] = strToU8(pc.source)
  }

  // 4. Emit user files from project.files[]  (Contribution #595 §4.2 / Task #430)
  //
  // Precedence rules (documented in Contribution #595 §4.3):
  //   generated=true, ejected=false  → scaffold version already added; skip.
  //   generated=true, ejected=true   → user edited the generated file; overwrite scaffold.
  //   generated=false (or undefined) → user-authored file; always emit (may overwrite scaffold).
  //
  // This means the assignment `files[f.path] = ...` in the non-skipped branch
  // intentionally wins over scaffold for both ejected and user-authored files.
  for (const f of project.files) {
    if (f.generated && !f.ejected) continue   // defer to scaffold

    if (f.type === 'asset') {
      if (f.blob?.base64) {
        files[f.path] = base64ToU8(f.blob.base64)
      }
      // Asset without blob data is silently skipped — nothing to emit.
    } else {
      files[f.path] = strToU8(f.content ?? '')
    }
  }

  // 5. Emit Visual Components from project.visualComponents[]  (Contribution #619 §7 / Task #439)
  //
  // Eject precedence (mirrors project.files[] loop above — Contribution #616):
  //   generated=true, ejected=false  → scaffold / canvas version re-emitted; skip here.
  //   generated=true, ejected=true   → user edited the generated .tsx; emit canvas tree.
  //   generated=false (user-authored) → always emit from canvas tree.
  //
  // Path-collision guard: a user file (non-generated or ejected) at the same path
  // as a VC's filePath takes precedence — user file wins (step 4 wins over step 5).
  // Without this guard a VC would silently overwrite the user file.
  //
  // VCs are emitted in topological order (dependencies before dependents).
  const userFilePaths = new Set<string>()
  for (const f of project.files) {
    if (!f.generated || f.ejected) {
      userFilePaths.add(f.path)
    }
  }

  const sortedVCs = topoSortVCs(project.visualComponents ?? [])
  for (const vc of sortedVCs) {
    if (vc.generated && !vc.ejected) continue   // defer to scaffold

    try {
      const vcComp = vcToComponent(vc, project, registry)

      // User file at the same path wins — skip the VC to avoid silent overwrite.
      if (userFilePaths.has(vcComp.filePath)) {
        console.warn(
          `[exportReactProjectAsZip] VC "${vc.name}" path ${vcComp.filePath} ` +
          `collides with a user file; user file wins`,
        )
        continue
      }

      files[vcComp.filePath] = strToU8(vcComp.source)
    } catch (err) {
      // Failed VCs are skipped rather than aborting the whole export.
      // Matches the lenient-per-item contract in validateProject() (Contribution #619 §9).
      console.warn(`[exportReactProjectAsZip] Skipping VC "${vc.name}":`, err)
    }
  }

  // 6. Compress synchronously (all data is in memory — sync is fine here)
  const zipped = zipSync(files, { level: 6 })
  const blobBytes = new Uint8Array(zipped.length)
  blobBytes.set(zipped)
  return new Blob([blobBytes.buffer], { type: 'application/zip' })
}

/**
 * Trigger a browser file-save dialog for the given Blob.
 * Call this from the export button handler after exportReactProjectAsZip() resolves.
 *
 * @param blob      ZIP Blob from exportReactProjectAsZip()
 * @param filename  Download filename (default: "react-project.zip")
 */
export function downloadReactZip(
  blob: Blob,
  filename = 'react-project.zip',
): void {
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
    URL.revokeObjectURL(url)
  }
}
