/* eslint-disable react-refresh/only-export-components */
/**
 * demo.card - module-field API demo with prop fields and CSS-backed fields.
 */
import React from 'react'
import { defineModule, propField, styleField } from '../../../core/module-engine/defineModule'
import { type ModuleComponentProps } from '../../../core/module-engine/types'
import { registry } from '../../../core/module-engine/registry'
import { pxBinding, rawBinding, readNumber, toPx } from '../styleBindings'
import styles from './demoCard.module.css'
import { cn } from '../../../ui/cn'

interface DemoCardProps extends Record<string, unknown> {
  eyebrow: string
  title: string
  body: string
  ctaLabel: string
}

const MODULE_CLASS = 'demo-card'

const DemoCardEditor: React.FC<ModuleComponentProps<DemoCardProps>> = ({ props, mcClassName }) => (
  <article className={cn(styles.card, mcClassName)}>
    <span className={styles.eyebrow}>{props.eyebrow}</span>
    <h2 className={styles.title}>{props.title}</h2>
    <p className={styles.body}>{props.body}</p>
    <span className={styles.cta}>{props.ctaLabel}</span>
  </article>
)

export const DemoCardModule = defineModule<DemoCardProps>({
  id: 'demo.card',
  name: 'Demo Card',
  description: 'Demonstrates prop fields and CSS-backed module fields in one module.',
  category: 'Demo',
  version: '1.0.0',
  icon: 'RectangleHorizontal',
  trusted: true,
  canHaveChildren: false,

  fields: {
    eyebrow: propField({ type: 'text', label: 'Eyebrow', placeholder: 'Feature' }),
    title: propField({ type: 'text', label: 'Title', placeholder: 'Build faster' }),
    body: propField({ type: 'textarea', label: 'Body', rows: 3 }),
    ctaLabel: propField({ type: 'text', label: 'CTA label', placeholder: 'Learn more' }),

    density: styleField({
      label: 'Density',
      properties: ['display', 'flexDirection', 'gap', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
      control: { type: 'slider', label: 'Density', min: 12, max: 56, step: 2, unit: 'px' },
      defaultValue: 24,
      toCSS: (value) => {
        const density = Math.max(12, Math.min(56, Math.round(Number(value) || 24)))
        const horizontal = Math.round(density * 1.1)
        return {
          display: 'flex',
          flexDirection: 'column',
          gap: toPx(Math.round(density / 2)),
          paddingTop: toPx(density),
          paddingRight: toPx(horizontal),
          paddingBottom: toPx(density),
          paddingLeft: toPx(horizontal),
        }
      },
      fromCSS: (style) => readNumber(style.paddingTop, 24),
      isSet: (style) => Boolean(style.paddingTop || style.paddingRight || style.gap),
    }),
    backgroundColor: styleField(rawBinding('backgroundColor', { type: 'color', label: 'Background' }, '#111827')),
    color: styleField(rawBinding('color', { type: 'color', label: 'Text color' }, '#f9fafb')),
    borderRadius: styleField(pxBinding('borderRadius', { type: 'slider', label: 'Radius', min: 0, max: 48, step: 1, unit: 'px' }, 12)),
    maxWidth: styleField(rawBinding('maxWidth', { type: 'text', label: 'Max width', placeholder: '520px' }, '520px')),
    accent: styleField({
      label: 'Accent',
      properties: ['borderLeft'],
      control: { type: 'color', label: 'Accent' },
      defaultValue: '#6366f1',
      toCSS: (value) => ({ borderLeft: `4px solid ${String(value || '#6366f1')}` }),
      fromCSS: (style) => {
        const match = String(style.borderLeft ?? '').match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/)
        return match?.[1] ?? '#6366f1'
      },
      isSet: (style) => Boolean(style.borderLeft),
    }),
  },

  defaults: {
    eyebrow: 'Field API',
    title: 'Composable module settings',
    body: 'Content fields stay on the module, while visual fields write to the shared class style pipeline.',
    ctaLabel: 'Inspect fields',
  },

  component: DemoCardEditor,

  render: (props) => ({
    html: `<article class="${MODULE_CLASS}"><span class="${MODULE_CLASS}__eyebrow">${String(props.eyebrow)}</span><h2 class="${MODULE_CLASS}__title">${String(props.title)}</h2><p class="${MODULE_CLASS}__body">${String(props.body)}</p><span class="${MODULE_CLASS}__cta">${String(props.ctaLabel)}</span></article>`,
    css: `.${MODULE_CLASS}{display:flex;flex-direction:column;gap:12px;width:100%;max-width:520px;padding:24px;border-left:4px solid #6366f1;border-radius:12px;background-color:#111827;color:#f9fafb;box-shadow:0 18px 60px rgba(0,0,0,.18)}.${MODULE_CLASS}__eyebrow{color:#a5b4fc;font-size:11px;font-weight:760;letter-spacing:.08em;text-transform:uppercase}.${MODULE_CLASS}__title{margin:0;color:inherit;font-size:28px;line-height:1.1}.${MODULE_CLASS}__body{margin:0;color:rgba(249,250,251,.74);font-size:15px;line-height:1.6}.${MODULE_CLASS}__cta{width:fit-content;margin-top:4px;padding:9px 13px;border-radius:7px;background:rgba(255,255,255,.1);color:inherit;font-size:13px;font-weight:680}`,
  }),

  toJsx: (props) =>
    `<article className="${MODULE_CLASS}"><span className="${MODULE_CLASS}__eyebrow">{${JSON.stringify(String(props.eyebrow))}}</span><h2 className="${MODULE_CLASS}__title">{${JSON.stringify(String(props.title))}}</h2><p className="${MODULE_CLASS}__body">{${JSON.stringify(String(props.body))}}</p><span className="${MODULE_CLASS}__cta">{${JSON.stringify(String(props.ctaLabel))}}</span></article>`,
})

registry.register(DemoCardModule)
