import { useCallback } from 'react'
import type { ModuleComponentProps } from '../../../core/module-engine/types'
import type { VisualComponentRefProps } from '../../../core/visualComponents/types'
import { useEditorStore } from '../../../core/editor-store/store'
import { Icon } from '../../../ui/icons/Icon'
import styles from './visualComponentRef.module.css'

export function VisualComponentRefEditor({
  props,
  nodeId,
}: ModuleComponentProps<VisualComponentRefProps>) {
  const vc = useEditorStore(
    useCallback(
      (s) =>
        s.project?.visualComponents?.find((v) => v.id === props.componentId) ?? null,
      [props.componentId],
    ),
  )

  if (!vc) {
    return (
      <div
        className={styles.vcMissing}
        data-testid={`vc-ref-missing-${nodeId}`}
      >
        <Icon name="warning-diamond" size={14} color="currentColor" aria-hidden="true" />
        <span className={styles.vcMissingLabel}>Unknown component</span>
      </div>
    )
  }

  const hasOverrides = Object.keys(props.propOverrides ?? {}).length > 0

  return (
    <div
      className={styles.vcBoundary}
      data-testid={`vc-ref-${nodeId}`}
      data-vc-instance-id={nodeId}
      data-vc-component-id={props.componentId}
      title="Double-click to edit component"
    >
      <div className={styles.vcLabelBar} aria-hidden="true">
        <Icon name="braces" size={10} color="currentColor" aria-hidden="true" />
        <span className={styles.vcLabelName}>{vc.name}</span>
        {hasOverrides && (
          <span className={styles.vcOverrideBadge} aria-hidden="true" title="Has overrides" />
        )}
      </div>

      <div className={styles.vcPlaceholderContent}>
        <Icon name="square-stack" size={24} color="var(--editor-text-subtle)" aria-hidden="true" />
        <span className={styles.vcPlaceholderHint}>{vc.name}</span>
      </div>
    </div>
  )
}
