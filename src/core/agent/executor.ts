/**
 * Phase D — Agent tool executor.
 *
 * Maps agent action objects (from the server NDJSON stream) to Zustand
 * store calls. All inputs are validated with Zod before touching the store
 * (Constraint #272 — all tool calls must pass Zod validation before dispatch).
 *
 * Constraint #283/#286: No Anthropic SDK imports here.
 */

import { z } from 'zod'
import { useEditorStore } from '../editor-store/store'
import { registry } from '../module-engine/registry'
import { sanitizeRichtext, isRichtextPropKey } from '../sanitize'
import type {
  AgentAction,
  AgentActionResult,
  InsertTreeNode,
} from './types'

// ---------------------------------------------------------------------------
// Per-action Zod schemas (Constraint #272)
// ---------------------------------------------------------------------------

const insertNodeSchema = z.object({
  type: z.literal('insertNode'),
  moduleId: z.string().min(1),
  parentId: z.string().min(1).optional(),
  parentRef: z.string().min(1).optional(),
  ref: z.string().min(1).optional(),
  index: z.number().int().nonnegative().optional(),
  props: z.record(z.string(), z.unknown()).optional().default({}),
  classIds: z.array(z.string().min(1)).optional().default([]),
}).refine((action) => Boolean(action.parentId || action.parentRef), {
  message: 'Either parentId or parentRef is required',
})

const classDefinitionSchema = z.object({
  name: z.string().min(1),
  styles: z.record(z.string(), z.union([z.string(), z.number()])).optional().default({}),
})

const insertTreeNodeSchema: z.ZodType<InsertTreeNode> = z.lazy(() => z.object({
  moduleId: z.string().min(1),
  ref: z.string().min(1).optional(),
  props: z.record(z.string(), z.unknown()).optional().default({}),
  classIds: z.array(z.string().min(1)).optional().default([]),
  children: z.array(insertTreeNodeSchema).optional().default([]),
}))

const insertTreeSchema = z.object({
  type: z.literal('insertTree'),
  parentId: z.string().min(1).optional(),
  parentRef: z.string().min(1).optional(),
  index: z.number().int().nonnegative().optional(),
  classes: z.array(classDefinitionSchema).optional().default([]),
  tree: insertTreeNodeSchema,
}).refine((action) => Boolean(action.parentId || action.parentRef), {
  message: 'Either parentId or parentRef is required',
})

const deleteNodeSchema = z.object({
  type: z.literal('deleteNode'),
  nodeId: z.string().min(1).optional(),
  nodeRef: z.string().min(1).optional(),
}).refine((action) => Boolean(action.nodeId || action.nodeRef), {
  message: 'Either nodeId or nodeRef is required',
})

const updateNodePropsSchema = z.object({
  type: z.literal('updateNodeProps'),
  nodeId: z.string().min(1).optional(),
  nodeRef: z.string().min(1).optional(),
  patch: z.record(z.string(), z.unknown()),
}).refine((action) => Boolean(action.nodeId || action.nodeRef), {
  message: 'Either nodeId or nodeRef is required',
})

const moveNodeSchema = z.object({
  type: z.literal('moveNode'),
  nodeId: z.string().min(1).optional(),
  nodeRef: z.string().min(1).optional(),
  newParentId: z.string().min(1).optional(),
  newParentRef: z.string().min(1).optional(),
  newIndex: z.number().int().nonnegative(),
}).refine((action) => Boolean(action.nodeId || action.nodeRef), {
  message: 'Either nodeId or nodeRef is required',
}).refine((action) => Boolean(action.newParentId || action.newParentRef), {
  message: 'Either newParentId or newParentRef is required',
})

const renameNodeSchema = z.object({
  type: z.literal('renameNode'),
  nodeId: z.string().min(1).optional(),
  nodeRef: z.string().min(1).optional(),
  label: z.string().min(1),
}).refine((action) => Boolean(action.nodeId || action.nodeRef), {
  message: 'Either nodeId or nodeRef is required',
})

const createClassSchema = z.object({
  type: z.literal('createClass'),
  name: z.string().min(1),
  styles: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
})

const updateClassStylesSchema = z.object({
  type: z.literal('updateClassStyles'),
  classId: z.string().min(1),
  patch: z.record(z.string(), z.union([z.string(), z.number()])),
})

const assignClassSchema = z.object({
  type: z.literal('assignClass'),
  nodeId: z.string().min(1).optional(),
  nodeRef: z.string().min(1).optional(),
  classId: z.string().min(1),
}).refine((action) => Boolean(action.nodeId || action.nodeRef), {
  message: 'Either nodeId or nodeRef is required',
})

const removeClassSchema = z.object({
  type: z.literal('removeClass'),
  nodeId: z.string().min(1).optional(),
  nodeRef: z.string().min(1).optional(),
  classId: z.string().min(1),
}).refine((action) => Boolean(action.nodeId || action.nodeRef), {
  message: 'Either nodeId or nodeRef is required',
})

const addPageSchema = z.object({
  type: z.literal('addPage'),
  title: z.string().min(1),
  slug: z.string().optional(),
})

const updateProjectSettingsSchema = z.object({
  type: z.literal('updateProjectSettings'),
  patch: z.record(z.string(), z.unknown()),
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Resolve a classId that may be either a real nanoid (checked first) or a
 * class name (fallback lookup).  Returns the resolved ID string, or null if
 * no matching class is found.
 *
 * This bridges the "same-batch ID gap": the agent can't know the nanoid
 * assigned to a class it just created, so it's allowed to pass the class
 * *name* in assignClass / updateClassStyles / removeClass.  The executor
 * transparently resolves it here so callers never need to worry about it.
 */
function resolveClassId(
  store: ReturnType<typeof useEditorStore.getState>,
  classIdOrName: string,
): string | null {
  const classes = store.project?.classes
  if (!classes) return null
  // Direct ID match (fast path)
  if (classes[classIdOrName]) return classIdOrName
  // Name-based fallback — use filter instead of find so we can detect ambiguity.
  // Uniqueness is enforced at createClass/renameClass time (classSlice), but this
  // guard provides defense-in-depth: if two classes somehow share a name, refuse to
  // guess rather than silently picking the wrong one.
  const matches = Object.values(classes).filter((c) => c.name === classIdOrName)
  if (matches.length > 1) return null // ambiguous — fail safely
  return matches[0]?.id ?? null
}

interface AgentExecutionContext {
  nodeRefs: Map<string, string>
}

function resolveParentId(
  action: z.infer<typeof insertNodeSchema>,
  context: AgentExecutionContext | undefined,
): string | null {
  if (action.parentRef) {
    return context?.nodeRefs.get(action.parentRef) ?? null
  }
  return action.parentId ?? null
}

function resolveTreeParentId(
  action: z.infer<typeof insertTreeSchema>,
  context: AgentExecutionContext | undefined,
): string | null {
  if (action.parentRef) {
    return context?.nodeRefs.get(action.parentRef) ?? null
  }
  return action.parentId ?? null
}

function resolveNodeId(
  action: { nodeId?: string; nodeRef?: string },
  context: AgentExecutionContext | undefined,
): string | null {
  if (action.nodeRef) {
    return context?.nodeRefs.get(action.nodeRef) ?? null
  }
  return action.nodeId ?? null
}

function resolveMoveParentId(
  action: z.infer<typeof moveNodeSchema>,
  context: AgentExecutionContext | undefined,
): string | null {
  if (action.newParentRef) {
    return context?.nodeRefs.get(action.newParentRef) ?? null
  }
  return action.newParentId ?? null
}

function resolveOrCreateClassId(
  store: ReturnType<typeof useEditorStore.getState>,
  classIdOrName: string,
  styles: Record<string, string | number> = {},
): string | null {
  const resolved = resolveClassId(store, classIdOrName)
  if (resolved) return resolved

  try {
    return store.createClass(classIdOrName, styles).id
  } catch {
    return null
  }
}

function resolveOrCreateClassIds(
  store: ReturnType<typeof useEditorStore.getState>,
  classIdsOrNames: string[],
): string[] | null {
  const resolved: string[] = []
  for (const classIdOrName of classIdsOrNames) {
    const classId = resolveOrCreateClassId(store, classIdOrName)
    if (!classId) return null
    if (!resolved.includes(classId)) resolved.push(classId)
  }
  return resolved
}

function ensureClassIdWithStyles(
  store: ReturnType<typeof useEditorStore.getState>,
  classIdOrName: string,
  styles: Record<string, string | number> = {},
): string | null {
  const classId = resolveOrCreateClassId(store, classIdOrName, styles)
  if (!classId) return null
  if (Object.keys(styles).length > 0) {
    store.updateClassStyles(classId, styles)
  }
  return classId
}

function validateRegisteredModule(moduleId: string): string | null {
  const mod = registry.get(moduleId)
  if (!mod) return `Module not found: ${moduleId}`
  if (typeof mod.component !== 'function') return `Module component unavailable: ${moduleId}`
  return null
}

function validateTreeModules(node: InsertTreeNode): string | null {
  const moduleError = validateRegisteredModule(node.moduleId)
  if (moduleError) return moduleError
  for (const child of node.children ?? []) {
    const childError = validateTreeModules(child)
    if (childError) return childError
  }
  return null
}

function sanitizeNodeProps(props: Record<string, unknown>): Record<string, unknown> {
  const sanitizedProps: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    sanitizedProps[key] = isRichtextPropKey(key) && typeof value === 'string'
      ? sanitizeRichtext(value)
      : value
  }
  return sanitizedProps
}

function ensureTreeClassIds(
  store: ReturnType<typeof useEditorStore.getState>,
  node: InsertTreeNode,
): string | null {
  for (const classIdOrName of node.classIds ?? []) {
    const classId = ensureClassIdWithStyles(store, classIdOrName)
    if (!classId) return classIdOrName
  }
  for (const child of node.children ?? []) {
    const unresolved = ensureTreeClassIds(store, child)
    if (unresolved) return unresolved
  }
  return null
}

function insertTreeNode(
  store: ReturnType<typeof useEditorStore.getState>,
  node: InsertTreeNode,
  parentId: string,
  index: number | undefined,
  context: AgentExecutionContext | undefined,
): string {
  const nodeId = store.insertNode(
    node.moduleId,
    sanitizeNodeProps(node.props ?? {}),
    parentId,
    index,
  )
  if (node.ref) context?.nodeRefs.set(node.ref, nodeId)

  const classIds = resolveOrCreateClassIds(store, node.classIds ?? []) ?? []
  for (const classId of classIds) {
    store.addNodeClass(nodeId, classId)
  }

  for (const child of node.children ?? []) {
    insertTreeNode(store, child, nodeId, undefined, context)
  }

  return nodeId
}

// ---------------------------------------------------------------------------
// Executor
// ---------------------------------------------------------------------------

/**
 * Execute a single agent action against the Zustand store.
 *
 * Validates the action with Zod before dispatch (Constraint #272).
 * Returns `{ success: true, nodeId? }` or `{ success: false, error }`.
 */
export async function executeAgentAction(
  action: AgentAction,
  context?: AgentExecutionContext,
): Promise<AgentActionResult> {
  const store = useEditorStore.getState()

  try {
    switch (action.type) {
      case 'insertNode': {
        const a = insertNodeSchema.parse(action)
        const moduleError = validateRegisteredModule(a.moduleId)
        if (moduleError) return { success: false, error: moduleError }
        const parentId = resolveParentId(a, context)
        if (!parentId) {
          const ref = a.parentRef ? `parentRef "${a.parentRef}"` : 'parentId'
          return { success: false, error: `Could not resolve ${ref}` }
        }
        const resolvedClassIds = resolveOrCreateClassIds(store, a.classIds)
        if (!resolvedClassIds) {
          return { success: false, error: 'One or more classes could not be resolved for insertNode' }
        }
        // Sanitize richtext-keyed props before writing to store (Constraint #299)
        const sanitizedProps = sanitizeNodeProps(a.props)
        const nodeId = store.insertNode(
          a.moduleId,
          sanitizedProps,
          parentId,
          a.index,
        )
        if (a.ref) context?.nodeRefs.set(a.ref, nodeId)
        for (const classId of resolvedClassIds) {
          store.addNodeClass(nodeId, classId)
        }
        return { success: true, nodeId }
      }

      case 'insertTree': {
        const a = insertTreeSchema.parse(action)
        const parentId = resolveTreeParentId(a, context)
        if (!parentId) {
          const ref = a.parentRef ? `parentRef "${a.parentRef}"` : 'parentId'
          return { success: false, error: `Could not resolve ${ref}` }
        }
        const moduleError = validateTreeModules(a.tree)
        if (moduleError) return { success: false, error: moduleError }

        for (const classDef of a.classes) {
          const classId = ensureClassIdWithStyles(
            useEditorStore.getState(),
            classDef.name,
            classDef.styles as Record<string, string | number>,
          )
          if (!classId) return { success: false, error: `Class could not be created: ${classDef.name}` }
        }

        const unresolvedClass = ensureTreeClassIds(useEditorStore.getState(), a.tree)
        if (unresolvedClass) {
          return { success: false, error: `Class could not be resolved: ${unresolvedClass}` }
        }

        const nodeId = insertTreeNode(useEditorStore.getState(), a.tree, parentId, a.index, context)
        return { success: true, nodeId }
      }

      case 'deleteNode': {
        const a = deleteNodeSchema.parse(action)
        const nodeId = resolveNodeId(a, context)
        if (!nodeId) {
          const ref = a.nodeRef ? `nodeRef "${a.nodeRef}"` : 'nodeId'
          return { success: false, error: `Could not resolve ${ref}` }
        }
        store.deleteNode(nodeId)
        return { success: true }
      }

      case 'updateNodeProps': {
        const a = updateNodePropsSchema.parse(action)
        const nodeId = resolveNodeId(a, context)
        if (!nodeId) {
          const ref = a.nodeRef ? `nodeRef "${a.nodeRef}"` : 'nodeId'
          return { success: false, error: `Could not resolve ${ref}` }
        }
        // Sanitize richtext-keyed props before writing to store (Constraint #299)
        const sanitizedPatch: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(a.patch)) {
          sanitizedPatch[key] = isRichtextPropKey(key) && typeof value === 'string'
            ? sanitizeRichtext(value)
            : value
        }
        store.updateNodeProps(nodeId, sanitizedPatch)
        return { success: true }
      }

      case 'moveNode': {
        const a = moveNodeSchema.parse(action)
        const nodeId = resolveNodeId(a, context)
        if (!nodeId) {
          const ref = a.nodeRef ? `nodeRef "${a.nodeRef}"` : 'nodeId'
          return { success: false, error: `Could not resolve ${ref}` }
        }
        const newParentId = resolveMoveParentId(a, context)
        if (!newParentId) {
          const ref = a.newParentRef ? `newParentRef "${a.newParentRef}"` : 'newParentId'
          return { success: false, error: `Could not resolve ${ref}` }
        }
        store.moveNode(nodeId, newParentId, a.newIndex)
        return { success: true }
      }

      case 'renameNode': {
        const a = renameNodeSchema.parse(action)
        const nodeId = resolveNodeId(a, context)
        if (!nodeId) {
          const ref = a.nodeRef ? `nodeRef "${a.nodeRef}"` : 'nodeId'
          return { success: false, error: `Could not resolve ${ref}` }
        }
        store.renameNode(nodeId, a.label)
        return { success: true }
      }

      case 'createClass': {
        const a = createClassSchema.parse(action)
        const cls = store.createClass(
          a.name,
          (a.styles ?? {}) as Record<string, string | number>,
        )
        return { success: true, nodeId: cls.id }
      }

      case 'updateClassStyles': {
        const a = updateClassStylesSchema.parse(action)
        // Resolve classId by ID first, then fall back to name lookup.
        // This lets the agent reference a class it just created in the same
        // batch by name (since nanoid IDs are unknown at generation time).
        const ucsResolvedId = resolveOrCreateClassId(
          store,
          a.classId,
          a.patch as Record<string, string | number>,
        )
        if (!ucsResolvedId) return { success: false, error: `Class not found: ${a.classId}` }
        store.updateClassStyles(
          ucsResolvedId,
          a.patch as Record<string, string | number>,
        )
        return { success: true }
      }

      case 'assignClass': {
        const a = assignClassSchema.parse(action)
        const nodeId = resolveNodeId(a, context)
        if (!nodeId) {
          const ref = a.nodeRef ? `nodeRef "${a.nodeRef}"` : 'nodeId'
          return { success: false, error: `Could not resolve ${ref}` }
        }
        // Resolve classId by ID first, then fall back to name lookup.
        const acResolvedId = resolveClassId(store, a.classId)
        if (!acResolvedId) return { success: false, error: `Class not found: ${a.classId}` }
        store.addNodeClass(nodeId, acResolvedId)
        return { success: true }
      }

      case 'removeClass': {
        const a = removeClassSchema.parse(action)
        const nodeId = resolveNodeId(a, context)
        if (!nodeId) {
          const ref = a.nodeRef ? `nodeRef "${a.nodeRef}"` : 'nodeId'
          return { success: false, error: `Could not resolve ${ref}` }
        }
        // Resolve classId by ID first, then fall back to name lookup.
        const rcResolvedId = resolveClassId(store, a.classId)
        if (!rcResolvedId) return { success: false, error: `Class not found: ${a.classId}` }
        store.removeNodeClass(nodeId, rcResolvedId)
        return { success: true }
      }

      case 'addPage': {
        const a = addPageSchema.parse(action)
        store.addPage(a.title, a.slug)
        return { success: true }
      }

      case 'updateProjectSettings': {
        const a = updateProjectSettingsSchema.parse(action)
        // updateProjectSettings is a shallow merge via updateNodeProps pattern
        // (project settings live in project.settings — use the settings slice if available)
        // For now, emit a warning since there's no direct store method
        console.warn('[agent] updateProjectSettings action ignored — no store method yet', a)
        return { success: false, error: 'updateProjectSettings not yet implemented' }
      }

      default: {
        const exhaustive: never = action
        return { success: false, error: `Unknown action type: ${(exhaustive as AgentAction).type}` }
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}

/**
 * Execute a batch of agent actions in order.
 * Stops on first failure (fail-fast) and returns all results up to the failure.
 */
export async function executeAgentActions(
  actions: AgentAction[],
): Promise<AgentActionResult[]> {
  const results: AgentActionResult[] = []
  const context: AgentExecutionContext = { nodeRefs: new Map() }
  for (const action of actions) {
    const result = await executeAgentAction(action, context)
    results.push(result)
    if (!result.success) break // fail-fast
  }
  return results
}
