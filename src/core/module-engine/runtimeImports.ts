const runtimeImportCache = new Map<string, Promise<unknown>>()

export function importRuntimeDependency<TModule>(url: string): Promise<TModule> {
  let cached = runtimeImportCache.get(url)

  if (!cached) {
    cached = import(/* @vite-ignore */ url) as Promise<unknown>
    runtimeImportCache.set(url, cached)
  }

  return cached as Promise<TModule>
}
