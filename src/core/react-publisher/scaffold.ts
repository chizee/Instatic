/**
 * ReactPublisher — Project scaffold generator.
 *
 * Generates the boilerplate files needed to run the exported React project
 * with Vite + TypeScript. The scaffold is deterministic — given the same
 * project name and pages it always produces the same output (no timestamps,
 * no random IDs).
 *
 * Files generated:
 *   package.json          — React 18 + Vite 5 + TypeScript deps
 *   vite.config.ts        — @vitejs/plugin-react
 *   tsconfig.json         — strict TS, jsx: react-jsx
 *   index.html            — single HTML entry point
 *   src/main.tsx          — ReactDOM.createRoot bootstrap
 *   src/App.tsx           — hash-router linking all pages
 *
 * Isolation (Constraint #269): MUST NOT import from src/core/publisher/ or src/editor/.
 */

import {
  mergeWithDefaultPackageJson,
  type ProjectPackageJson,
} from '../project-dependencies/manifest'

export type ScaffoldFiles = Record<string, string>

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Convert a project name to a valid npm package name. */
function toPackageName(name: string): string {
  return (name || 'my-site')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'my-site'
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ScaffoldPage {
  slug: string
  componentName: string
}

/**
 * Generate all scaffold file contents as a filename → content map.
 * Caller is responsible for writing these strings to the ZIP archive.
 */
export function generateScaffold(
  projectName: string,
  pages: ScaffoldPage[],
  projectPackageJson?: ProjectPackageJson,
): ScaffoldFiles {
  const pkgName = toPackageName(projectName)
  const firstComponent = pages[0]?.componentName ?? 'App'
  const packageManifest = mergeWithDefaultPackageJson(projectPackageJson)

  // ── package.json ────────────────────────────────────────────────────────
  const packageJson = JSON.stringify(
    {
      name: pkgName,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: packageManifest.dependencies,
      devDependencies: packageManifest.devDependencies,
    },
    null,
    2,
  )

  // ── vite.config.ts ──────────────────────────────────────────────────────
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
`

  // ── tsconfig.json ───────────────────────────────────────────────────────
  const tsconfig = JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
      },
      include: ['src'],
    },
    null,
    2,
  )

  // ── index.html ──────────────────────────────────────────────────────────
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`

  // ── src/main.tsx ─────────────────────────────────────────────────────────
  const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`

  // ── src/App.tsx — minimal hash router with per-page lazy loading ──────────
  // Pages are lazy-loaded so each page's JS only loads when the user navigates
  // to it, avoiding a single monolithic bundle (Guideline #311 / Task #335).
  const lazyLines = pages
    .map((p) => `const ${p.componentName} = React.lazy(() => import('./pages/${p.componentName}'))`)
    .join('\n')

  const routeLines = pages
    .map((p, i) => {
      const match =
        i === 0
          ? `(hash === '${p.slug}' || hash === '' || hash === '/')`
          : `hash === '${p.slug}'`
      return `  if (${match}) return <Suspense fallback={null}><${p.componentName} /></Suspense>`
    })
    .join('\n')

  const appTsx = `import React, { useState, useEffect, Suspense } from 'react'
${lazyLines}

function getHash() {
  return window.location.hash.replace(/^#\\/?/, '')
}

export default function App() {
  const [hash, setHash] = useState(getHash)

  useEffect(() => {
    const handler = () => setHash(getHash())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

${routeLines}
  return <Suspense fallback={null}><${firstComponent} /></Suspense>
}
`

  return {
    'package.json': packageJson,
    'vite.config.ts': viteConfig,
    'tsconfig.json': tsconfig,
    'index.html': indexHtml,
    'src/main.tsx': mainTsx,
    'src/App.tsx': appTsx,
  }
}
