/**
 * The `__buildApi()` factory — builds the `api` object every plugin lifecycle
 * hook receives (`api.plugin.*`, `api.cms.*`). Split out of `pluginRuntime.ts`
 * so the factory and the `__run*` dispatchers stay independently readable; both
 * are bundled into one IIFE by `scripts/sync-plugin-bootstrap.ts`, so the
 * runners reach this via the installed `globalThis.__buildApi`.
 *
 * Host-injected globals (`__hostCall`, `__log`, `__plugin_meta`,
 * `__plugin_settings`) are declared in `globals.d.ts`. `__nextId` is the
 * factory's private id minter and lives here with its only caller.
 */

// ------- the api object plugins receive -------
globalThis.__buildApi = function buildApi() {
  const meta = globalThis.__plugin_meta

  function assertPermission(perm: string) {
    // Sync defense-in-depth check INSIDE the VM, validated against the
    // AUTHORITATIVE granted-permission set (NOT the declared `permissions`
    // array). The host-side dispatcher also enforces permissions
    // (kernel-of-correctness), but the host check surfaces as a rejected
    // Promise — plugin code that doesn't await would otherwise silently
    // succeed. Throwing synchronously here keeps the VM, host, and editor
    // layers in agreement on one authority: meta.grantedPermissions.
    if (meta.grantedPermissions.indexOf(perm) < 0) {
      throw new Error('Plugin "' + meta.id + '" requires permission "' + perm + '"')
    }
  }

  function call(target: string, args: unknown[]) {
    return __hostCall(target, args)
  }

  function normalizePath(p: unknown): string {
    const t = String(p).trim()
    if (!t || t === '/') return '/'
    return '/' + t.replace(/^\/+|\/+$/g, '')
  }

  // Route registration with a tagged access discriminator. Three shapes:
  //
  //   api.cms.routes.get(path, capability, handler)
  //       Standard gated route. The capability argument is a core
  //       capability string (e.g. 'content.manage'). Internally builds
  //       an access record of kind "capability".
  //
  //   api.cms.routes.authenticated.get(path, handler)
  //       Any logged-in user. No capability check, but session cookie
  //       required. Builds an access record of kind "authenticated".
  //
  //   api.cms.routes.public.get(path, handler)
  //       Anonymous-callable. NO authentication. Requires the plugin to
  //       declare cms.routes.public in its permissions so the operator
  //       sees the warning at install time.
  function makeRoute(method: string) {
    return function (path: unknown, capability: unknown, handler: unknown) {
      assertPermission('cms.routes')
      if (typeof handler !== 'function') throw new TypeError('Route handler must be a function')
      const routeKey = method + ':' + normalizePath(path)
      globalThis.__plugin_handlers.routes[routeKey] = handler as BootstrapFn
      return call('cms.routes.register', [{
        method: method,
        path: normalizePath(path),
        access: { kind: 'capability', capability: capability },
        routeKey: routeKey,
      }])
    }
  }
  function registerAuthenticated(method: string) {
    return function (path: unknown, handler: unknown) {
      assertPermission('cms.routes')
      if (typeof handler !== 'function') throw new TypeError('Route handler must be a function')
      const routeKey = method + ':' + normalizePath(path)
      globalThis.__plugin_handlers.routes[routeKey] = handler as BootstrapFn
      return call('cms.routes.register', [{
        method: method,
        path: normalizePath(path),
        access: { kind: 'authenticated' },
        routeKey: routeKey,
      }])
    }
  }
  function registerPublic(method: string) {
    return function (path: unknown, handler: unknown) {
      assertPermission('cms.routes')
      assertPermission('cms.routes.public')
      if (typeof handler !== 'function') throw new TypeError('Route handler must be a function')
      const routeKey = method + ':' + normalizePath(path)
      globalThis.__plugin_handlers.routes[routeKey] = handler as BootstrapFn
      return call('cms.routes.register', [{
        method: method,
        path: normalizePath(path),
        access: { kind: 'public' },
        routeKey: routeKey,
      }])
    }
  }

  function on(event: unknown, listener: unknown) {
    assertPermission('cms.hooks')
    if (typeof listener !== 'function') throw new TypeError('Hook listener must be a function')
    const listenerId = __nextId('listener')
    globalThis.__plugin_handlers.listeners[listenerId] = listener as BootstrapFn
    return call('cms.hooks.on', [{ event: String(event), listenerId: listenerId }])
  }
  function filter(name: unknown, handler: unknown) {
    assertPermission('cms.hooks')
    if (typeof handler !== 'function') throw new TypeError('Hook filter must be a function')
    const filterId = __nextId('filter')
    globalThis.__plugin_handlers.filters[filterId] = handler as BootstrapFn
    return call('cms.hooks.filter', [{ name: String(name), filterId: filterId }])
  }
  function emit(event: unknown, payload: unknown) {
    assertPermission('cms.hooks')
    return call('cms.hooks.emit', [{ event: String(event), payload: payload === undefined ? null : payload }])
  }

  function registerSource(source: PluginInput) {
    assertPermission('loops.register')
    if (!source || typeof source !== 'object') throw new TypeError('Loop source must be an object')
    if (typeof source.fetch !== 'function') throw new TypeError('Loop source.fetch must be a function')
    const sourceId = String(source.id)
    globalThis.__plugin_handlers.loopSources[sourceId] = {
      fetch: source.fetch,
      preview: typeof source.preview === 'function' ? source.preview : function () { return [] },
    }
    const descriptor = {
      id: sourceId,
      label: source.label,
      description: source.description,
      filterSchema: source.filterSchema || {},
      orderByOptions: source.orderByOptions || [],
      fields: source.fields || [],
      requestDependent: source.requestDependent === true ? true : undefined,
      perVisitor: source.perVisitor === true ? true : undefined,
    }
    return call('cms.loops.registerSource', [descriptor])
  }

  function collection(resourceId: unknown) {
    assertPermission('cms.storage')
    return {
      list: function (options: unknown) { return call('cms.storage.list', [String(resourceId), options ?? {}]) },
      create: function (data: unknown) { return call('cms.storage.create', [String(resourceId), data]) },
      update: function (recordId: unknown, data: unknown) { return call('cms.storage.update', [String(resourceId), String(recordId), data]) },
      delete: function (recordId: unknown) { return call('cms.storage.delete', [String(resourceId), String(recordId)]) },
    }
  }

  // ---- scheduled jobs --------------------------------------------------
  // Plugin declares cadence + handler at activate-time. The host upserts
  // a row; the scheduler tick fires the handler via __runSchedule(id).
  // Handler is stored INSIDE the VM (not serialised) — the host carries
  // only the schedule metadata in plugin_schedules.

  // The host namespaces schedule ids as <pluginId>.<localId> before
  // storing them (see pluginScheduleRegistration.ts:registerPluginSchedule)
  // and dispatches firings using the namespaced id. The VM's handler map
  // must use the SAME key so __runSchedule can resolve a registered handler.
  function namespaceScheduleId(localId: string): string {
    const prefix = meta.id + '.'
    return localId.indexOf(prefix) === 0 ? localId : prefix + localId
  }

  function scheduleRegister(def: PluginInput) {
    assertPermission('cms.schedule')
    if (!def || typeof def !== 'object') throw new TypeError('schedule.register: argument must be an object')
    if (typeof def.id !== 'string' || def.id.length === 0) throw new TypeError("schedule.register: 'id' is required")
    if (typeof def.handler !== 'function') throw new TypeError("schedule.register: 'handler' must be a function")
    if (!def.cadence || typeof def.cadence !== 'object') throw new TypeError("schedule.register: 'cadence' is required")
    const scheduleId = String(def.id)
    globalThis.__plugin_handlers.schedules[namespaceScheduleId(scheduleId)] = def.handler
    const overlap = def.overlap === 'queue' || def.overlap === 'parallel' ? def.overlap : 'skip'
    // Cap at the host-side maximum (5 minutes); a stricter cap can be
    // negotiated later via a per-plugin manifest field. Default 5_000ms
    // matches the VM's default eval deadline so behaviour is consistent
    // with route / hook / loop calls.
    let maxDurationMs = typeof def.maxDurationMs === 'number' ? def.maxDurationMs : 5000
    if (maxDurationMs < 100) maxDurationMs = 100
    if (maxDurationMs > 5 * 60 * 1000) maxDurationMs = 5 * 60 * 1000
    return call('cms.schedule.register', [{
      scheduleId: scheduleId,
      cadence: def.cadence,
      overlap: overlap,
      maxDurationMs: maxDurationMs,
    }])
  }

  function scheduleCancel(id: unknown) {
    assertPermission('cms.schedule')
    const scheduleId = String(id)
    delete globalThis.__plugin_handlers.schedules[namespaceScheduleId(scheduleId)]
    return call('cms.schedule.cancel', [{ scheduleId: scheduleId }])
  }

  const scheduleApi = {
    register: scheduleRegister,
    cancel: scheduleCancel,
    daily: function (id: unknown, at: unknown, handler: unknown) {
      return scheduleRegister({ id: id, cadence: { interval: 'daily', at: at }, handler: handler })
    },
    hourly: function (id: unknown, handler: unknown) {
      return scheduleRegister({ id: id, cadence: { interval: 'hourly' }, handler: handler })
    },
    every: function (minutes: unknown, id: unknown, handler: unknown) {
      return scheduleRegister({ id: id, cadence: { interval: 'every', minutes: minutes }, handler: handler })
    },
  }

  const settingsApi = {
    get: function (key: string) { return globalThis.__plugin_settings[key] },
    getAll: function () { return Object.assign({}, globalThis.__plugin_settings) },
    replace: async function (next: unknown) {
      const updated = await call('cms.settings.replace', [next])
      for (const k of Object.keys(globalThis.__plugin_settings)) delete globalThis.__plugin_settings[k]
      if (updated && typeof updated === 'object') Object.assign(globalThis.__plugin_settings, updated)
    },
  }

  // ---- media subsystem -----------------------------------------------------
  // Three independent surfaces under api.cms.media. The callbacks live INSIDE
  // the VM (stored under __plugin_handlers.mediaAdapters / mediaUrlTransformers);
  // the host only knows the adapter id + metadata. The host calls back into
  // the VM via __runMediaAdapterCall / __runMediaUrlTransformer when it
  // actually needs to upload/delete/transform a path.

  function registerStorageAdapter(adapter: PluginInput) {
    assertPermission('media.storage.adapter')
    if (!adapter || typeof adapter !== 'object') throw new TypeError('registerStorageAdapter: adapter must be an object')
    if (typeof adapter.id !== 'string' || !adapter.id) throw new TypeError("registerStorageAdapter: 'id' is required")
    if (adapter.id.indexOf(meta.id + '.') !== 0) {
      throw new Error('registerStorageAdapter: adapter id "' + adapter.id + '" must start with the plugin id "' + meta.id + '."')
    }
    if (typeof adapter.label !== 'string' || !adapter.label) throw new TypeError("registerStorageAdapter: 'label' is required")
    if (!Array.isArray(adapter.roles) || adapter.roles.length === 0) {
      throw new TypeError("registerStorageAdapter: 'roles' must be a non-empty array")
    }
    if (typeof adapter.servingMode !== 'string') throw new TypeError("registerStorageAdapter: 'servingMode' is required")
    if (typeof adapter.beginWrite !== 'function') throw new TypeError("registerStorageAdapter: 'beginWrite' must be a function")
    if (typeof adapter.finalizeWrite !== 'function') throw new TypeError("registerStorageAdapter: 'finalizeWrite' must be a function")
    if (typeof adapter.abortWrite !== 'function') throw new TypeError("registerStorageAdapter: 'abortWrite' must be a function")
    if (typeof adapter['delete'] !== 'function') throw new TypeError("registerStorageAdapter: 'delete' must be a function")
    if (typeof adapter.verify !== 'function') throw new TypeError("registerStorageAdapter: 'verify' must be a function")
    // Mode-specific constraints — the host re-validates but throwing here
    // surfaces the bug at activation time instead of first-use.
    if (adapter.servingMode === 'proxy' && typeof adapter.readStream !== 'function') {
      throw new TypeError("registerStorageAdapter: servingMode 'proxy' requires a 'readStream' function")
    }
    if (adapter.servingMode !== 'proxy' && typeof adapter.getReadUrl !== 'function') {
      throw new TypeError("registerStorageAdapter: servingMode '" + adapter.servingMode + "' requires a 'getReadUrl' function")
    }
    // Stash the live callback bag — keyed by id so the host's call-into-VM
    // round-trip can find it without iterating.
    globalThis.__plugin_handlers.mediaAdapters[adapter.id] = {
      beginWrite: adapter.beginWrite,
      finalizeWrite: adapter.finalizeWrite,
      abortWrite: adapter.abortWrite,
      delete: adapter['delete'],
      getReadUrl: typeof adapter.getReadUrl === 'function' ? adapter.getReadUrl : null,
      verify: adapter.verify,
      readStream: typeof adapter.readStream === 'function' ? adapter.readStream : null,
    }
    // Normalise CSP origins — accept either array of objects or undefined.
    const cspOrigins = Array.isArray(adapter.cspOrigins)
      ? adapter.cspOrigins.map(function (entry: PluginInput) {
        return { directive: String(entry.directive), origin: String(entry.origin) }
      })
      : undefined
    return call('cms.media.registerStorageAdapter', [{
      adapterId: adapter.id,
      label: String(adapter.label),
      roles: adapter.roles.slice(),
      servingMode: String(adapter.servingMode),
      hasGetReadUrl: typeof adapter.getReadUrl === 'function',
      hasReadStream: typeof adapter.readStream === 'function',
      cspOrigins: cspOrigins,
    }])
  }

  function registerUrlTransformer(fn: unknown) {
    assertPermission('media.url.transform')
    if (typeof fn !== 'function') throw new TypeError('registerUrlTransformer: argument must be a function')
    const transformerId = __nextId('mediaUrlT')
    globalThis.__plugin_handlers.mediaUrlTransformers[transformerId] = fn as BootstrapFn
    return call('cms.media.registerUrlTransformer', [{ transformerId: transformerId }])
  }

  function registerVariantDelegate(delegate: PluginInput) {
    assertPermission('media.variant.delegate')
    if (!delegate || typeof delegate !== 'object') throw new TypeError('registerVariantDelegate: argument must be an object')
    if (typeof delegate.id !== 'string' || !delegate.id) throw new TypeError("registerVariantDelegate: 'id' is required")
    if (delegate.id.indexOf(meta.id + '.') !== 0) {
      throw new Error('registerVariantDelegate: id "' + delegate.id + '" must start with the plugin id "' + meta.id + '."')
    }
    if (typeof delegate.variantUrlTemplate !== 'string') {
      throw new TypeError("registerVariantDelegate: 'variantUrlTemplate' must be a string")
    }
    if (!Array.isArray(delegate.widths) || delegate.widths.length === 0) {
      throw new TypeError("registerVariantDelegate: 'widths' must be a non-empty array")
    }
    if (!Array.isArray(delegate.formats) || delegate.formats.length === 0) {
      throw new TypeError("registerVariantDelegate: 'formats' must be a non-empty array")
    }
    return call('cms.media.registerVariantDelegate', [{
      delegateId: delegate.id,
      variantUrlTemplate: delegate.variantUrlTemplate,
      widths: delegate.widths.slice(),
      formats: delegate.formats.slice(),
    }])
  }

  return {
    plugin: {
      id: meta.id,
      version: meta.version,
      // The plugin's own view of its permissions is the AUTHORITATIVE granted
      // set — what it can actually use — matching the host-side and editor-side
      // checks. (The declared `permissions` array is host-side, consent-only.)
      permissions: meta.grantedPermissions.slice(),
      log: function (...args: unknown[]) {
        const parts: string[] = []
        for (let i = 0; i < args.length; i++) {
          const a = args[i]
          if (typeof a === 'string') parts.push(a)
          else {
            try { parts.push(JSON.stringify(a)) }
            catch (_) { parts.push(String(a)) }
          }
        }
        __log('info', parts.join(' '))
      },
      // Build a URL for a static file the plugin shipped in its zip.
      // assetBasePath looks like '/uploads/plugins/<id>/<version>'; we
      // join it with the package-relative path and normalize the slashes.
      assetUrl: function (path: unknown) {
        if (typeof path !== 'string' || path.length === 0) {
          throw new TypeError('assetUrl: path must be a non-empty string')
        }
        const base = (meta.assetBasePath || '').replace(/\/+$/g, '')
        const rel = String(path).replace(/^\/+/g, '')
        return base + '/' + rel
      },
    },
    cms: {
      routes: {
        // Capability-gated routes — most common shape.
        // Usage: api.cms.routes.get('/path', 'content.manage', handler)
        get: makeRoute('GET'),
        post: makeRoute('POST'),
        patch: makeRoute('PATCH'),
        delete: makeRoute('DELETE'),
        // Authenticated-only routes (any logged-in user).
        // Usage: api.cms.routes.authenticated.get('/path', handler)
        authenticated: {
          get: registerAuthenticated('GET'),
          post: registerAuthenticated('POST'),
          patch: registerAuthenticated('PATCH'),
          delete: registerAuthenticated('DELETE'),
        },
        // Public routes — anonymous-callable. Plugin must declare
        // cms.routes.public in its manifest permissions.
        // Usage: api.cms.routes.public.get('/path', handler)
        public: {
          get: registerPublic('GET'),
          post: registerPublic('POST'),
          patch: registerPublic('PATCH'),
          delete: registerPublic('DELETE'),
        },
      },
      storage: { collection: collection },
      hooks: { on: on, filter: filter, emit: emit },
      loops: { registerSource: registerSource },
      settings: settingsApi,
      schedule: scheduleApi,
      content: {
        // Schema introspection
        tables: {
          list: function () {
            assertPermission('cms.content.read')
            return call('cms.content.tables.list', [])
          },
          get: function (slug: unknown) {
            assertPermission('cms.content.read')
            return call('cms.content.tables.get', [String(slug)])
          },
          create: function (input: unknown) {
            assertPermission('cms.content.tables.manage')
            return call('cms.content.tables.create', [input])
          },
        },
        // Per-table CRUD
        table: function (slug: unknown) {
          const s = String(slug)
          return {
            list: function (options: unknown) {
              assertPermission('cms.content.read')
              return call('cms.content.entries.list', [s, options || {}])
            },
            get: function (entryId: unknown) {
              assertPermission('cms.content.read')
              return call('cms.content.entries.get', [s, String(entryId)])
            },
            getBySlug: function (entrySlug: unknown) {
              assertPermission('cms.content.read')
              return call('cms.content.entries.getBySlug', [s, String(entrySlug)])
            },
            create: function (input: unknown) {
              assertPermission('cms.content.write')
              return call('cms.content.entries.create', [s, input])
            },
            update: function (entryId: unknown, patch: unknown) {
              assertPermission('cms.content.write')
              return call('cms.content.entries.update', [s, String(entryId), patch])
            },
            'delete': function (entryId: unknown) {
              assertPermission('cms.content.delete')
              return call('cms.content.entries.delete', [s, String(entryId)])
            },
            publish: function (entryId: unknown, options: unknown) {
              assertPermission('cms.content.publish')
              return call('cms.content.entries.publish', [s, String(entryId), options || {}])
            },
            moveToTable: function (entryId: unknown, targetSlug: unknown) {
              assertPermission('cms.content.write')
              return call('cms.content.entries.moveTable', [s, String(entryId), String(targetSlug)])
            },
            createMany: function (inputs: unknown) {
              assertPermission('cms.content.write')
              return call('cms.content.entries.createMany', [s, inputs])
            },
            updateMany: function (updates: unknown) {
              assertPermission('cms.content.write')
              return call('cms.content.entries.updateMany', [s, updates])
            },
            deleteMany: function (entryIds: unknown) {
              assertPermission('cms.content.delete')
              return call('cms.content.entries.deleteMany', [s, entryIds])
            },
          }
        },
        // Tree mutation for pageTree-typed cells
        tree: function (entryId: unknown, fieldId: unknown) {
          const e = String(entryId)
          const f = String(fieldId)
          return {
            read: function () {
              assertPermission('cms.content.read')
              return call('cms.content.tree.read', [e, f])
            },
            mutate: function (operations: unknown) {
              assertPermission('cms.content.write')
              return call('cms.content.tree.mutate', [e, f, operations])
            },
            replace: function (tree: unknown) {
              assertPermission('cms.content.write')
              return call('cms.content.tree.replace', [e, f, tree])
            },
          }
        },
        // Cross-table
        search: function (query: unknown, limit: unknown) {
          assertPermission('cms.content.read')
          return call('cms.content.search', [String(query), Number(limit || 50)])
        },
        getPublishedSnapshot: function (entryId: unknown) {
          assertPermission('cms.content.read')
          return call('cms.content.snapshot', [String(entryId)])
        },
        republishAll: function () {
          assertPermission('cms.content.publish')
          return call('cms.content.republishAll', [])
        },
      },
      media: {
        registerStorageAdapter: registerStorageAdapter,
        registerUrlTransformer: registerUrlTransformer,
        registerVariantDelegate: registerVariantDelegate,
      },
    },
  }
}

let __idCounter = 0
function __nextId(prefix: string): string { __idCounter += 1; return prefix + '_' + __idCounter + '_' + Date.now().toString(36) }
