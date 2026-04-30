import { memo, useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@ui/components/Button'
import { Input } from '@ui/components/Input'
import { CloseIcon } from '@ui/icons/icons/close'
import type { ProjectCreateKind } from './projectItemNames'
import styles from './ProjectCreateDialog.module.css'

export type { ProjectCreateKind } from './projectItemNames'

interface ProjectCreateDialogProps {
  kind: ProjectCreateKind
  onCancel: () => void
  onCreate: (name: string) => void
}

const COPY: Record<ProjectCreateKind, { title: string; placeholder: string }> = {
  page: { title: 'New page', placeholder: 'About' },
  component: { title: 'New component', placeholder: 'Hero card' },
  style: { title: 'New stylesheet', placeholder: 'theme' },
  script: { title: 'New script', placeholder: 'analytics' },
}

export const ProjectCreateDialog = memo(function ProjectCreateDialog({
  kind,
  onCancel,
  onCreate,
}: ProjectCreateDialogProps) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const copy = COPY[kind]
  const trimmedName = name.trim()

  useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onCancel])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!trimmedName) return
    onCreate(trimmedName)
  }

  return createPortal(
    <div
      className={styles.backdrop}
      data-testid="project-create-dialog-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-create-dialog-title"
        className={styles.dialog}
        data-testid="project-create-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="project-create-dialog-title" className={styles.title}>
            {copy.title}
          </h2>
          <Button
            variant="ghost"
            size="xs"
            iconOnly
            aria-label="Close dialog"
            onClick={onCancel}
          >
            <CloseIcon size={12} color="currentColor" aria-hidden="true" />
          </Button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Name</span>
            <Input
              ref={inputRef}
              fieldSize="sm"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={copy.placeholder}
              autoComplete="off"
              spellCheck={false}
            />
          </label>

          <div className={styles.actions}>
            <Button variant="secondary" size="sm" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={!trimmedName}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
})
