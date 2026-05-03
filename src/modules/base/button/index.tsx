/* eslint-disable react-refresh/only-export-components */
/**
 * base.button — content/behavior module.
 *
 * Emits a bare semantic `<button>` (or `<a>` when `href` is set) with no
 * default class or default CSS. Visual styling is opt-in via user classes
 * (mcClassName / multi-class system).
 */
import React from 'react'
import { type ModuleDefinition, type ModuleComponentProps } from '@core/module-engine/types'
import { registry } from '@core/module-engine/registry'
import { CursorClickIcon } from 'pixel-art-icons/icons/cursor-click'
import { safeUrl } from '../utils/escape'

interface ButtonProps extends Record<string, unknown> {
  label: string
  href: string
  target: '_blank' | '_self' | '_parent'
  disabled: boolean
}

const ButtonEditor: React.FC<ModuleComponentProps<ButtonProps>> = ({ props, mcClassName }) => {
  if (props.href) {
    const rel = props.target === '_blank' ? 'noopener noreferrer' : undefined
    return <a href={props.href} target={props.target} rel={rel} className={mcClassName}>{props.label || 'Button'}</a>
  }
  return <button type="button" className={mcClassName} disabled={props.disabled}>{props.label || 'Button'}</button>
}

export const ButtonModule: ModuleDefinition<ButtonProps> = {
  id: 'base.button',
  name: 'Button',
  description: 'A button or call-to-action link.',
  category: 'Interactive',
  version: '2.0.0',
  icon: CursorClickIcon,
  trusted: true,
  canHaveChildren: false,

  schema: {
    label: { type: 'text', label: 'Label', placeholder: 'Button text...' },
    href: { type: 'url', label: 'Link URL' },
    target: {
      type: 'select',
      label: 'Link target',
      condition: { field: 'href', notEq: '' },
      options: [
        { label: 'Same tab', value: '_self' },
        { label: 'New tab', value: '_blank' },
        { label: 'Parent', value: '_parent' },
      ],
    },
    disabled: { type: 'toggle', label: 'Disabled' },
  },

  defaults: {
    label: 'Get Started',
    href: '',
    target: '_self',
    disabled: false,
  },

  component: ButtonEditor,

  render: (props) => {
    const href = safeUrl(props.href)
    const label = String(props.label ?? '')
    const rel = props.target === '_blank' ? ' rel="noopener noreferrer"' : ''
    if (href && href !== '#') {
      return { html: `<a href="${href}" target="${String(props.target)}"${rel}>${label}</a>` }
    }
    const disabledAttr = props.disabled ? ' disabled aria-disabled="true"' : ''
    return { html: `<button type="button"${disabledAttr}>${label}</button>` }
  },
}

registry.register(ButtonModule)
