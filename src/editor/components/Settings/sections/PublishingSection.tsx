/**
 * PublishingSection — Export ZIP button + Phase 8 Convex cloud placeholder.
 *
 * Project metadata (name, meta title, description, favicon, language) has
 * been moved to GeneralSection (Phase 6 — Task #183).
 *
 * Phase 2 (Task #187 — Convex): the cloud-publish section will replace the
 * placeholder below.
 */
import { useState, useCallback } from 'react'
import { useEditorStore } from '../../../../core/editor-store/store'
import { registry } from '../../../../core/module-engine/registry'
import { exportProjectAsZip, downloadZip } from '../../../../core/publisher'
import { Button } from '@ui/components/Button'
import { Icon } from '../../../../ui/icons/Icon'
import s from '../Settings.module.css'

export function PublishingSection() {
  const project = useEditorStore((state) => state.project)

  const [exportState, setExportState] = useState<'idle' | 'exporting' | 'done' | 'error'>('idle')
  const [exportError, setExportError] = useState<string | null>(null)

  const handleExport = useCallback(async () => {
    if (!project || exportState === 'exporting') return
    setExportState('exporting')
    setExportError(null)
    try {
      const blob = await exportProjectAsZip(project, registry)
      const filename = `${project.name.toLowerCase().replace(/\s+/g, '-') || 'website'}.zip`
      downloadZip(blob, filename)
      setExportState('done')
      setTimeout(() => setExportState('idle'), 3000)
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Unknown error')
      setExportState('error')
    }
  }, [project, exportState])

  if (!project) {
    return <div className={s.noProject}>No project loaded.</div>
  }

  return (
    <div>
      <h3 className={s.sectionHeading}>Publishing</h3>
      <p className={s.sectionDescription}>
        Export your project as a self-contained static ZIP or publish via the cloud (Phase 8).
      </p>

      {/* ── Static ZIP Export ─────────────────────────────────────────────── */}
      <section aria-labelledby="pub-export-heading" className={s.sectionBlock}>
        <h4 id="pub-export-heading" className={s.subHeading}>
          Static Export
        </h4>

        <p className={s.pubExportNote}>
          Downloads a ZIP containing one clean HTML file per page — no framework
          runtime, no editor code.
        </p>

        <Button
          variant={exportState === 'error' ? 'destructive' : 'primary'}
          size="md"
          onClick={handleExport}
          disabled={exportState === 'exporting'}
          aria-busy={exportState === 'exporting'}
          aria-label={exportState === 'exporting' ? 'Exporting…' : 'Export project as ZIP'}
        >
          {exportState === 'exporting' ? (
            <><Icon name="loader" size={13} aria-hidden /> Exporting…</>
          ) : exportState === 'done' ? (
            <><Icon name="check" size={13} aria-hidden /> Download started!</>
          ) : exportState === 'error' ? (
            <><Icon name="circle-alert" size={13} aria-hidden /> Export failed</>
          ) : (
            <><Icon name="download" size={13} aria-hidden /> Export as ZIP</>
          )}
        </Button>

        {exportState === 'error' && exportError && (
          <p role="alert" className={s.pubErrorNote}>
            {exportError}
          </p>
        )}
      </section>

      {/* ── Phase 8 Cloud Publishing Placeholder ──────────────────────────── */}
      <section aria-labelledby="pub-cloud-heading">
        <h4 id="pub-cloud-heading" className={s.subHeading}>
          Cloud Publishing
        </h4>

        <div className={s.infoBox}>
          <p className={s.infoBoxTitle}>
            Coming in Phase 8 — Convex Backend
          </p>
          <p className={s.infoBoxText}>
            One-click cloud publishing with automatic CDN, custom domain support,
            and version history. Use static ZIP export above in the meantime.
          </p>
        </div>
      </section>
    </div>
  )
}
