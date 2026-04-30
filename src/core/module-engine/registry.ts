import type { IModuleRegistry, AnyModuleDefinition } from './types'

/**
 * ModuleRegistry — Singleton that holds all registered ModuleDefinitions.
 *
 * Base modules self-register via `src/modules/base/index.ts` on app boot.
 * Community modules are registered dynamically when installed/loaded.
 *
 * Uses AnyModuleDefinition (ModuleDefinition<any>) because the registry is a
 * heterogeneous collection — each module has its own TProps type.
 * Type safety is enforced at each module's call site, not here.
 */
class ModuleRegistry implements IModuleRegistry {
  private readonly _modules = new Map<string, AnyModuleDefinition>()

  register(definition: AnyModuleDefinition): void {
    if (!definition.id || !definition.id.includes('.')) {
      throw new Error(
        `[ModuleRegistry] Invalid module ID "${definition.id}". ` +
          `IDs must be namespaced: "namespace.module-name" (e.g. "base.heading").`
      )
    }
    if (this._modules.has(definition.id)) {
      throw new Error(
        `[ModuleRegistry] Module "${definition.id}" is already registered. ` +
          `Use registerOrReplace() to intentionally overwrite.`
      )
    }
    this._modules.set(definition.id, definition)
  }

  registerOrReplace(definition: AnyModuleDefinition): void {
    if (!definition.id || !definition.id.includes('.')) {
      throw new Error(
        `[ModuleRegistry] Invalid module ID "${definition.id}".`
      )
    }
    this._modules.set(definition.id, definition)
  }

  unregister(id: string): void {
    this._modules.delete(id)
  }

  get(id: string): AnyModuleDefinition | undefined {
    return this._modules.get(id)
  }

  getOrThrow(id: string): AnyModuleDefinition {
    const mod = this._modules.get(id)
    if (!mod) {
      throw new Error(
        `[ModuleRegistry] Module "${id}" is not registered. ` +
          `Ensure the module is imported and registered before use.`
      )
    }
    return mod
  }

  has(id: string): boolean {
    return this._modules.has(id)
  }

  list(): AnyModuleDefinition[] {
    return Array.from(this._modules.values())
  }

  listByCategory(): Record<string, AnyModuleDefinition[]> {
    const result: Record<string, AnyModuleDefinition[]> = {}
    for (const mod of this._modules.values()) {
      const cat = mod.category
      if (!result[cat]) result[cat] = []
      result[cat].push(mod)
    }
    return result
  }

  get size(): number {
    return this._modules.size
  }
}

export const registry = new ModuleRegistry()
