import { useCallback } from 'react'
import { selectActivePage, useEditorStore } from '@core/editor-store/store'
import { registry } from '@core/module-engine/registry'
import { getMissingModuleDependencies } from '@core/module-engine/dependencies'
import type { AnyModuleDefinition } from '@core/module-engine/types'

export function useInsertModule() {
  const page = useEditorStore(selectActivePage)
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId)
  const insertNode = useEditorStore((s) => s.insertNode)
  const selectNode = useEditorStore((s) => s.selectNode)
  const packageJson = useEditorStore((s) => s.packageJson)
  const setDependency = useEditorStore((s) => s.setDependency)

  return useCallback(
    (mod: AnyModuleDefinition) => {
      if (!page) return null

      let parentId = page.rootNodeId
      if (selectedNodeId) {
        const selectedNode = page.nodes[selectedNodeId]
        if (selectedNode) {
          const def = registry.get(selectedNode.moduleId)
          if (def?.canHaveChildren) {
            parentId = selectedNodeId
          } else {
            const parentNode = Object.values(page.nodes).find((node) =>
              node.children.includes(selectedNodeId),
            )
            if (parentNode) parentId = parentNode.id
          }
        }
      }

      for (const dependency of getMissingModuleDependencies(mod, packageJson)) {
        setDependency(dependency.name, dependency.version, dependency.dev)
      }

      const nodeId = insertNode(mod.id, mod.defaults, parentId)
      selectNode(nodeId)
      return nodeId
    },
    [page, selectedNodeId, packageJson, setDependency, insertNode, selectNode],
  )
}
