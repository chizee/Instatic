/**
 * Admin-side runtime helpers for loading plugin admin app modules.
 *
 *   • `loadPluginAdminAppComponent(page)` — dynamic-imports the plugin's
 *     admin app entrypoint and returns its default-exported React component
 *     (a `PluginAdminAppComponent` from `definePluginAdminApp`).
 *   • `buildPluginRoutesHelper(pluginId)` — produces the fetch + json
 *     helpers handed to plugin code through the host-hooks `PluginContext`.
 *
 * Plugin admin apps used to receive a curated `api` and `ui` namespace
 * via render-function arguments. That layer is gone — plugins now write
 * real React components and pull editor / settings / route helpers from
 * `@pagebuilder/host-hooks` (which the host populates per-mount via
 * `PluginContext`).
 */
import type { TSchema, Static } from '@sinclair/typebox'
import { parseJsonResponse } from '@core/utils/jsonValidate'
import type {
  PluginAdminAppComponent,
  PluginAdminPageRoute,
} from '@core/plugin-sdk'

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

const defaultFetch: FetchLike = (input, init) => globalThis.fetch(input, init)

/**
 * Loaded plugin admin app module shape — the `default` export is the
 * `PluginAdminAppComponent` returned by `definePluginAdminApp`.
 */
export type LoadedAdminAppModule = { default: PluginAdminAppComponent }

export type PluginAdminAppImport = (url: string) => Promise<LoadedAdminAppModule>

/**
 * Append a cache-buster query string to plugin entrypoint URLs. The
 * browser otherwise pins each `/uploads/.../<entry>.js` forever within
 * a session — when `pb-plugin dev` rewrites the file (or the user
 * re-uploads), a soft reload would still execute the stale module.
 */
function bustedImportUrl(url: string): string {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}v=${Date.now()}`
}

const defaultImportModule: PluginAdminAppImport = async (url) =>
  await import(/* @vite-ignore */ bustedImportUrl(url)) as LoadedAdminAppModule

export function pluginAdminAssetUrl(assetPath: string, entrypoint: string): string {
  return `${assetPath.replace(/\/+$/g, '')}/${entrypoint.replace(/^\/+/g, '')}`
}

function runtimePath(pluginId: string, path: string): string {
  const normalized = path.trim().replace(/^\/+/g, '')
  return `/admin/api/cms/plugins/${encodeURIComponent(pluginId)}/runtime/${normalized}`
}

export interface PluginRoutesHelper {
  fetch: (path: string, init?: RequestInit) => Promise<Response>
  json: <T extends TSchema>(path: string, schema: T, init?: RequestInit) => Promise<Static<T>>
}

/**
 * Build the plugin-scoped HTTP routes helper. Stable signature, suitable
 * for handing through `PluginContext` so plugin code can call
 * `usePluginRoutes()` and reach its own server entrypoint without
 * constructing URLs manually.
 */
export function buildPluginRoutesHelper(
  pluginId: string,
  fetchImpl: FetchLike = defaultFetch,
): PluginRoutesHelper {
  return {
    fetch(path, init) {
      return fetchImpl(runtimePath(pluginId, path), {
        credentials: 'include',
        ...init,
      })
    },
    async json<T extends TSchema>(path: string, schema: T, init?: RequestInit): Promise<Static<T>> {
      const res = await fetchImpl(runtimePath(pluginId, path), {
        credentials: 'include',
        ...init,
      })
      if (!res.ok) throw new Error(`Plugin route failed with ${res.status}`)
      return await parseJsonResponse(res, schema)
    },
  }
}

/**
 * Resolve a plugin admin page's entrypoint module via dynamic `import()`.
 * Throws if the module doesn't default-export a `PluginAdminAppComponent`.
 */
export async function loadPluginAdminAppComponent(
  page: PluginAdminPageRoute,
  importModule: PluginAdminAppImport = defaultImportModule,
): Promise<{ Component: PluginAdminAppComponent }> {
  if (page.content.kind !== 'app') {
    throw new Error('Plugin admin app loader requires app page content')
  }
  if (!page.content.assetPath) {
    throw new Error(`Plugin admin app "${page.pluginId}:${page.id}" is missing an asset path`)
  }
  const mod = await importModule(pluginAdminAssetUrl(page.content.assetPath, page.content.entry))
  const Component = (mod as { default?: unknown }).default
  if (typeof Component !== 'function' && typeof Component !== 'object') {
    throw new Error(
      `Plugin admin app "${page.pluginId}:${page.id}" must default-export a React component (definePluginAdminApp).`,
    )
  }
  return { Component: Component as PluginAdminAppComponent }
}
