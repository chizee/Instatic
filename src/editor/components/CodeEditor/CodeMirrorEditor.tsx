/**
 * CodeMirrorEditor — CodeMirror 6 editor mount.
 *
 * This module is LAZY-LOADED via React.lazy() in CodeEditorPanel — it MUST
 * NOT be imported statically from the editor main chunk. CodeMirror 6 adds
 * ~150 kB min+gz; code-splitting it behind React.lazy keeps the editor
 * startup bundle lean.
 *
 * Features:
 * - Per-type extension stacks (JSX/TS, CSS, JSON, Markdown, plain text).
 * - Achromatic CM6 theme using --editor-* CSS custom properties (Guideline #376).
 * - Debounced 250ms content sync → updateFileContent() (Contribution #595 §3.3).
 * - Flush-on-switch: the useEffect cleanup flushes any pending edit before
 *   the view is destroyed, so unsaved edits survive file switches.
 *
 * Content sync pattern:
 *   Every CM6 doc change records the pending content in a ref. A 250ms debounce
 *   timer fires updateFileContent(). When the file switches (file.id changes),
 *   the old useEffect cleanup:
 *     1. Clears the debounce timer.
 *     2. Immediately flushes the pending content (flush-on-switch).
 *     3. Destroys the old CM6 view.
 *   The new effect creates a fresh view for the new file.
 *
 * @see CodeEditorPanel.tsx — parent (lazy-loads this module)
 * @see Contribution #595 §3 — architecture spec
 * @see Guideline #376 — achromatic palette (no hardcoded colors)
 * @see Constraint #402 — no inline styles
 */

import { useRef, useEffect, useCallback } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { json } from '@codemirror/lang-json'
import { markdown } from '@codemirror/lang-markdown'
import type { Extension } from '@codemirror/state'
import type { ProjectFile, ProjectFileType } from '../../../core/files/types'

// ---------------------------------------------------------------------------
// Achromatic CM6 theme — CSS custom properties only (Guideline #376)
// ---------------------------------------------------------------------------
// All color values are CSS custom properties from globals.css.
// No hex, rgb(), or hsl() literals — Guideline #376 strictly prohibits them.
const achromatic = EditorView.theme({
  '&': {
    backgroundColor: 'var(--editor-surface)',
    color: 'var(--editor-text)',
    height: '100%',
    fontSize: '12px',
    fontFamily: 'var(--font-mono, "Geist Mono", "JetBrains Mono", monospace)',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-content': {
    caretColor: 'var(--editor-accent)',
    padding: '8px 0',
  },
  '.cm-cursor': {
    borderLeftColor: 'var(--editor-accent)',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'var(--editor-selection)',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: 'var(--editor-selection)',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--editor-surface-3)',
    borderRight: '1px solid var(--panel-border)',
    color: 'var(--editor-text-subtle)',
  },
  '.cm-gutter': {
    minWidth: '3ch',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    color: 'var(--editor-text-subtle)',
    fontSize: '11px',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    color: 'var(--editor-text-muted)',
  },
  '.cm-line': {
    padding: '0 12px 0 4px',
  },
  // Syntax tokens — achromatic only
  '.tok-comment': {
    color: 'var(--editor-text-subtle)',
    fontStyle: 'italic',
  },
  '.tok-keyword': {
    color: 'var(--editor-text-secondary)',
    fontWeight: '600',
  },
  '.tok-string': {
    color: 'var(--editor-text)',
  },
  '.tok-number': {
    color: 'var(--editor-text)',
  },
  '.tok-operator': {
    color: 'var(--editor-text-muted)',
  },
  '.tok-variableName': {
    color: 'var(--editor-text)',
  },
  '.tok-typeName': {
    color: 'var(--editor-text-secondary)',
    fontWeight: '500',
  },
  '.tok-propertyName': {
    color: 'var(--editor-text)',
  },
  '.tok-tagName': {
    color: 'var(--editor-text-secondary)',
  },
  '.tok-attributeName': {
    color: 'var(--editor-text-muted)',
  },
  '.cm-tooltip': {
    backgroundColor: 'var(--editor-surface-2)',
    border: '1px solid var(--panel-border)',
    color: 'var(--editor-text)',
  },
}, { dark: true })

// ---------------------------------------------------------------------------
// Per-type extension stacks
// ---------------------------------------------------------------------------

/**
 * Returns the language-specific extension(s) for the given file type.
 * Maps ProjectFileType → CM6 language extension list.
 */
function getLanguageExtensions(type: ProjectFileType, path: string): Extension[] {
  switch (type) {
    case 'component':
      // JSX + TypeScript — component files are always TSX
      return [javascript({ jsx: true, typescript: true })]

    case 'script':
      // TypeScript without JSX
      return [javascript({ typescript: true })]

    case 'style':
      return [css()]

    case 'config':
      // Branch on extension: .json → JSON; .ts → TypeScript; else plain text
      if (path.endsWith('.json')) return [json()]
      if (path.endsWith('.ts') || path.endsWith('.mts')) {
        return [javascript({ typescript: true })]
      }
      return [] // plain text

    case 'doc':
      return [markdown()]

    case 'asset':
      // Binary — should not reach CodeMirrorEditor (ImagePreview handles it)
      return []

    default:
      return []
  }
}

// ---------------------------------------------------------------------------
// CodeMirrorEditor
// ---------------------------------------------------------------------------

interface CodeMirrorEditorProps {
  file: ProjectFile
  updateFileContent: (id: string, content: string) => void
}

export default function CodeMirrorEditor({ file, updateFileContent }: CodeMirrorEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Refs to hold pending debounce state. Using refs (not state) so that reads
  // inside the CM6 update listener always see the current values without
  // triggering re-renders.
  const pendingContentRef = useRef<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Always-current reference to updateFileContent — avoids stale closure inside
  // the CM6 updateListener while keeping the main useEffect dep-free.
  const updateFileContentRef = useRef(updateFileContent)
  useEffect(() => {
    updateFileContentRef.current = updateFileContent
  }, [updateFileContent])

  // Flush pending content to the store immediately (called on file switch).
  const flush = useCallback((fileId: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (pendingContentRef.current !== null) {
      // Flush-on-switch: persist pending edit before unmounting.
      updateFileContentRef.current(fileId, pendingContentRef.current)
      pendingContentRef.current = null
    }
  }, [])

  // Mount/destroy CM6 view when file.id changes (file switch).
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const currentFileId = file.id

    const view = new EditorView({
      state: EditorState.create({
        doc: file.content ?? '',
        extensions: [
          basicSetup,
          ...getLanguageExtensions(file.type, file.path),
          achromatic,
          EditorView.updateListener.of((update) => {
            if (!update.docChanged) return
            const content = update.state.doc.toString()
            // Record pending content
            pendingContentRef.current = content
            // Reset debounce timer — 250ms window
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => {
              if (pendingContentRef.current !== null) {
                updateFileContentRef.current(currentFileId, pendingContentRef.current)
                pendingContentRef.current = null
              }
              timerRef.current = null
            }, 250)
          }),
          // Prevent the editor from growing the container horizontally
          EditorView.lineWrapping,
        ],
      }),
      parent: container,
    })

    return () => {
      // Flush-on-switch: persist any pending edit before destroying this view.
      // This guarantees unsaved edits survive file switching even if the debounce
      // timer has not fired yet.
      flush(currentFileId)
      view.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file.id]) // Re-run only on file switch — flush handles mid-edit transitions

  return (
    <div
      ref={containerRef}
      data-codemirror-container=""
    />
  )
}
