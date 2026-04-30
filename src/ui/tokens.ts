/**
 * Design token bridge — typed CSS custom property references.
 *
 * Every value is a `var(--editor-*)` string that resolves to the token
 * defined in `src/styles/globals.css`.  Import from this file rather than
 * writing raw hex literals or CSS var strings by hand in component files.
 *
 * Usage in React inline styles:
 *   import { t } from '@ui/tokens'
 *   style={{ color: t.text, background: t.surface }}
 *
 * DO NOT add magic numbers / raw hex to this file.
 * To add a new token: (1) add the CSS custom property to globals.css,
 * (2) add the reference entry here.
 *
 * Palette: Strictly achromatic — pure black, near-black neutrals, white accent (Guideline #376).
 * No zinc, slate, blue, indigo, or violet tints anywhere (user directive #1601).
 */

export const t = {
  // ─── Surfaces ────────────────────────────────────────────────────────── //
  bg:        'var(--editor-bg)',        // #000000
  surface:   'var(--editor-surface)',   // #0a0a0a
  surface2:  'var(--editor-surface-2)', // #111111
  surface3:  'var(--editor-surface-3)', // #080808
  surface4:  'var(--editor-surface-4)', // #1a1a1a (input / toggle bg)

  // ─── Borders ─────────────────────────────────────────────────────────── //
  border:       'var(--editor-border)',        // #1f1f1f
  borderMed:    'var(--editor-border-med)',    // #2e2e2e (slightly elevated)
  borderSubtle: 'var(--editor-border-subtle)', // rgba(255,255,255,0.05)

  // ─── Text ─────────────────────────────────────────────────────────────── //
  text:          'var(--editor-text)',           // #ededed
  textSecondary: 'var(--editor-text-secondary)', // #a1a1aa
  textMuted:     'var(--editor-text-muted)',     // #71717a
  textSubtle:    'var(--editor-text-subtle)',    // #52525b

  // ─── Accent — editor chrome stays achromatic; canvas rings use canvas tokens //
  accent:            'var(--editor-accent)',              // #ffffff
  accentHover:       'var(--editor-accent-hover)',        // #e4e4e7
  accentLight:       'var(--editor-accent-light)',        // #a1a1aa
  accentViolet:      'var(--editor-accent-violet)',       // rgba(255,255,255,0.80)
  accentVioletLight: 'var(--editor-accent-violet-light)', // rgba(255,255,255,0.50) — override indicator
  accentIndigo:      'var(--editor-accent-indigo)',       // rgba(255,255,255,0.60) — active breakpoint
  selection:         'var(--editor-selection)',           // rgba(255,255,255,0.08)

  // ─── Semantic ────────────────────────────────────────────────────────── //
  danger:         'var(--editor-danger)',         // #ef4444
  dangerLight:    'var(--editor-danger-light)',   // #f87171 (red-400, lighter text)
  dangerLighter:  'var(--editor-danger-lighter)', // #fca5a5 (red-300, very light)
  dangerBg:       'var(--editor-danger-bg)',      // rgba(239,68,68,0.1)
  dangerBorder:   'var(--editor-danger-border)',  // rgba(239,68,68,0.2)
  warning:        'var(--editor-warning)',        // #f59e0b
  success:        'var(--editor-success)',        // #10b981
  successGreen:   'var(--editor-success-green)',  // #34d399 (emerald-400, saved indicator)
  successBright:  'var(--editor-success-bright)', // #4ade80 (green-400, agent tool ok)

  // ─── Radius ──────────────────────────────────────────────────────────── //
  radiusSm: 'var(--editor-radius-sm)', // 3px
  radius:   'var(--editor-radius)',    // 6px
  radiusLg: 'var(--editor-radius-lg)', // 8px

  // ─── Panels ──────────────────────────────────────────────────────────── //
  panelBg:     'var(--editor-panel-bg)',     // #0a0a0a
  panelBorder: 'var(--editor-panel-border)', // #1f1f1f

  // ─── Floating Overlay Panels (Guideline #356/#366/#376 — black glass style) //
  // Legacy flat refs (kept for backward compat — prefer `panel.*` below)
  panelOverlayBg:     'var(--panel-bg)',     // rgba(4, 4, 4, 0.90) — pure black
  panelOverlayBorder: 'var(--panel-border)', // rgba(255, 255, 255, 0.10) — achromatic
  panelOverlayRadius: 'var(--panel-radius)', // 12px
  panelOverlayShadow: 'var(--panel-shadow)', // composed inset + drop shadow

  // ─── Canvas ───────────────────────────────────────────────────────────── //
  canvasBg:          'var(--canvas-bg)',
  canvasGrid:        'var(--canvas-grid)',
  canvasFrameBg:     'var(--canvas-frame-bg)',
  canvasFrameShadow: 'var(--canvas-frame-shadow)',
} as const

export const inputBase = {
  bg: 'var(--input-bg)',
  bgFocus: 'var(--input-bg-focus)',
  border: 'var(--input-border)',
  borderFocus: 'var(--input-border-focus)',
  shadow: 'var(--input-shadow)',
  shadowFocus: 'var(--input-shadow-focus)',
  radius: 'var(--input-radius)',
} as const
