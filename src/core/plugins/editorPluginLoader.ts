import { listCmsPlugins } from '@core/persistence/cmsPlugins'
import type {
  EditorPluginModule,
  PluginManifest,
  PluginModulesEntrypointModule,
} from '@core/plugin-sdk'
import { activateEditorPlugin, pluginRuntime } from './runtime'
import {
  activatePluginModulePack,
  resetPluginModulePacks,
} from './modulePackLoader'
import type { PluginModuleComponentFactory } from './moduleAdapter'

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
type ImportEditorModule = (url: string) => Promise<EditorPluginModule>
type ImportModulePack = (url: string) => Promise<PluginModulesEntrypointModule>

export interface InstalledEditorPluginActivationFailure {
  pluginId: string
  error: unknown
}

export interface InstalledEditorPluginActivationResult {
  activated: string[]
  failed: InstalledEditorPluginActivationFailure[]
  /** Plugins that registered canvas modules (for diagnostics in the editor). */
  modulePacksLoaded: string[]
}

interface ActivateInstalledEditorPluginsOptions {
  fetchImpl?: FetchLike
  importEditorModule?: ImportEditorModule
  importModulePack?: ImportModulePack
  /**
   * Factory used by the canvas registry to build the React preview
   * component for plugin-provided modules. Required at the editor entry
   * point because `src/core/` cannot import runtime React. Tests and the
   * server rely on a stub factory.
   */
  componentFactory?: PluginModuleComponentFactory
}

const defaultFetch: FetchLike = (input, init) => globalThis.fetch(input, init)

/**
 * Append a cache-buster query string to plugin entrypoint URLs. The
 * browser's dynamic-import cache otherwise pins each `/uploads/.../editor/index.js`
 * forever within a session — when `pb-plugin dev` rewrites that file (or
 * the user re-uploads a plugin), a soft reload would still execute the
 * stale module. Mirrors the server-side worker host, which already appends
 * `?v=Date.now()` for the same reason.
 *
 * Cost: a fresh module is fetched and parsed on every editor mount. Worth
 * it — plugin code is small (kilobytes) and the cache hit-rate would be
 * worse than useless if the on-disk bundle changed.
 */
function bustedImportUrl(url: string): string {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}v=${Date.now()}`
}

const defaultImportEditorModule: ImportEditorModule = async (url) =>
  await import(/* @vite-ignore */ bustedImportUrl(url)) as EditorPluginModule

const defaultImportModulePack: ImportModulePack = async (url) =>
  await import(/* @vite-ignore */ bustedImportUrl(url)) as PluginModulesEntrypointModule

function joinAssetPath(assetBasePath: string, entrypoint: string): string {
  return `${assetBasePath.replace(/\/+$/g, '')}/${entrypoint.replace(/^\/+/g, '')}`
}

function manifestWithGrants(
  manifest: PluginManifest,
  grantedPermissions: PluginManifest['grantedPermissions'],
): PluginManifest {
  return { ...manifest, grantedPermissions }
}

export async function activateInstalledEditorPlugins(
  options: ActivateInstalledEditorPluginsOptions = {},
): Promise<InstalledEditorPluginActivationResult> {
  const fetchImpl = options.fetchImpl ?? defaultFetch
  const importEditorModule = options.importEditorModule ?? defaultImportEditorModule
  const importModulePack = options.importModulePack ?? defaultImportModulePack

  const result: InstalledEditorPluginActivationResult = {
    activated: [],
    failed: [],
    modulePacksLoaded: [],
  }

  pluginRuntime.reset()
  resetPluginModulePacks()

  const payload = await listCmsPlugins(fetchImpl)
  for (const plugin of payload.plugins) {
    const manifest = manifestWithGrants(plugin.manifest, plugin.grantedPermissions)
    // Cache the live settings snapshot so editor panels can read settings
    // synchronously inside their render(). Done unconditionally — even for
    // plugins without an editor entrypoint, since the snapshot might be
    // consulted by another plugin's panel via cross-plugin runCommand etc.
    pluginRuntime.setPluginSettings(plugin.id, plugin.settings)
    if (!plugin.enabled || plugin.lifecycleStatus === 'error' || !manifest.assetBasePath) {
      continue
    }

    let editorActivated = false

    // Module pack — load first so plugins that ship both an editor entry
    // AND modules can rely on their modules being registered when the
    // editor entry's `activate()` runs.
    if (manifest.entrypoints?.modules && plugin.grantedPermissions.includes('modules.register')) {
      try {
        const mod = await importModulePack(
          joinAssetPath(manifest.assetBasePath, manifest.entrypoints.modules),
        )
        activatePluginModulePack(manifest, mod, options.componentFactory)
        result.modulePacksLoaded.push(plugin.id)
      } catch (error) {
        result.failed.push({ pluginId: plugin.id, error })
      }
    }

    // Editor entrypoint — toolbar, commands, store transactions, etc.
    if (manifest.entrypoints?.editor) {
      try {
        const mod = await importEditorModule(
          joinAssetPath(manifest.assetBasePath, manifest.entrypoints.editor),
        )
        await activateEditorPlugin(manifest, mod, fetchImpl)
        editorActivated = true
      } catch (error) {
        result.failed.push({ pluginId: plugin.id, error })
      }
    }

    if (editorActivated || result.modulePacksLoaded.includes(plugin.id)) {
      result.activated.push(plugin.id)
    }
  }

  return result
}
