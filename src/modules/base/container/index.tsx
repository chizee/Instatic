/* eslint-disable react-refresh/only-export-components */
/**
 * base.container — semantic wrapper with class-backed layout styling.
 */
import React from 'react'
import { type ModuleDefinition, type ModuleComponentProps } from '../../../core/module-engine/types'
import { registry } from '../../../core/module-engine/registry'
import styles from './container.module.css'
import { cn } from '../../../ui/cn'
import { pxBinding, rawBinding } from '../styleBindings'

export interface ContainerProps extends Record<string, unknown> {
  tag: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer'
}

const MODULE_CLASS = 'pb-container'
const VALID_TAGS = new Set<ContainerProps['tag']>(['div', 'section', 'article', 'main', 'header', 'footer'])

export function resolveContainerTag(value: unknown): ContainerProps['tag'] {
  return typeof value === 'string' && VALID_TAGS.has(value as ContainerProps['tag'])
    ? value as ContainerProps['tag']
    : 'div'
}

const ContainerEditor: React.FC<ModuleComponentProps<ContainerProps>> = ({ props, children, mcClassName }) => {
  const Tag = resolveContainerTag(props.tag)
  return React.createElement(Tag, { className: cn(styles.container, mcClassName) }, children)
}

export const ContainerModule: ModuleDefinition<ContainerProps> = {
  id: 'base.container',
  name: 'Container',
  description: 'A semantic container. Layout and visual styling are class-backed.',
  category: 'Layout',
  version: '2.0.0',
  icon: 'Square',
  trusted: true,
  canHaveChildren: true,

  schema: {
    tag: {
      type: 'select',
      label: 'HTML tag',
      options: [
        { label: 'div', value: 'div' },
        { label: 'section', value: 'section' },
        { label: 'article', value: 'article' },
        { label: 'main', value: 'main' },
        { label: 'header', value: 'header' },
        { label: 'footer', value: 'footer' },
      ],
    },
  },

  defaults: {
    tag: 'div',
  },

  classStyleBindings: {
    display: rawBinding(
      'display',
      {
        type: 'select',
        label: 'Display',
        options: [
          { label: 'Block', value: 'block' },
          { label: 'Flex', value: 'flex' },
          { label: 'Grid', value: 'grid' },
        ],
      },
      'flex',
    ),
    flexDirection: rawBinding(
      'flexDirection',
      {
        type: 'select',
        label: 'Flex direction',
        options: [
          { label: 'Row', value: 'row' },
          { label: 'Column', value: 'column' },
          { label: 'Row reverse', value: 'row-reverse' },
          { label: 'Column reverse', value: 'column-reverse' },
        ],
      },
      'column',
    ),
    justifyContent: rawBinding(
      'justifyContent',
      {
        type: 'select',
        label: 'Justify content',
        options: [
          { label: 'Start', value: 'flex-start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'flex-end' },
          { label: 'Space between', value: 'space-between' },
          { label: 'Space around', value: 'space-around' },
          { label: 'Space evenly', value: 'space-evenly' },
        ],
      },
      'flex-start',
    ),
    alignItems: rawBinding(
      'alignItems',
      {
        type: 'select',
        label: 'Align items',
        options: [
          { label: 'Stretch', value: 'stretch' },
          { label: 'Start', value: 'flex-start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'flex-end' },
          { label: 'Baseline', value: 'baseline' },
        ],
      },
      'stretch',
    ),
    flexWrap: rawBinding(
      'flexWrap',
      {
        type: 'select',
        label: 'Flex wrap',
        options: [
          { label: 'No wrap', value: 'nowrap' },
          { label: 'Wrap', value: 'wrap' },
          { label: 'Wrap reverse', value: 'wrap-reverse' },
        ],
      },
      'nowrap',
    ),
    gap: pxBinding('gap', { type: 'slider', label: 'Gap', min: 0, max: 160, step: 2, unit: 'px' }, 16),
    paddingTop: pxBinding('paddingTop', { type: 'slider', label: 'Padding top', min: 0, max: 240, step: 2, unit: 'px' }, 16),
    paddingRight: pxBinding('paddingRight', { type: 'slider', label: 'Padding right', min: 0, max: 240, step: 2, unit: 'px' }, 16),
    paddingBottom: pxBinding('paddingBottom', { type: 'slider', label: 'Padding bottom', min: 0, max: 240, step: 2, unit: 'px' }, 16),
    paddingLeft: pxBinding('paddingLeft', { type: 'slider', label: 'Padding left', min: 0, max: 240, step: 2, unit: 'px' }, 16),
    backgroundColor: rawBinding('backgroundColor', { type: 'color', label: 'Background' }, 'transparent'),
    maxWidth: rawBinding('maxWidth', { type: 'text', label: 'Max width', placeholder: '100%' }, '100%'),
    minHeight: pxBinding('minHeight', { type: 'slider', label: 'Min height', min: 0, max: 2000, step: 10, unit: 'px' }, 0),
    borderRadius: pxBinding('borderRadius', { type: 'slider', label: 'Border radius', min: 0, max: 96, step: 1, unit: 'px' }, 0),
    overflow: rawBinding(
      'overflow',
      {
        type: 'select',
        label: 'Overflow',
        options: [
          { label: 'Visible', value: 'visible' },
          { label: 'Hidden', value: 'hidden' },
          { label: 'Scroll', value: 'scroll' },
          { label: 'Auto', value: 'auto' },
        ],
      },
      'visible',
    ),
  },

  component: ContainerEditor,

  render: (props, renderedChildren) => {
    const tag = resolveContainerTag(props.tag)
    return {
      html: `<${tag} class="${MODULE_CLASS}">${renderedChildren.join('')}</${tag}>`,
      css: `.${MODULE_CLASS}{display:flex;flex-direction:column;justify-content:flex-start;align-items:stretch;flex-wrap:nowrap;gap:16px;padding:16px;background-color:transparent;max-width:100%;width:100%;min-height:0;border-radius:0;overflow:visible;box-sizing:border-box}`,
    }
  },

  toJsx: (props, renderedChildren) => {
    const tag = resolveContainerTag(props.tag)
    const inner = renderedChildren.join('\n      ')
    return `<${tag} className="${MODULE_CLASS}">\n      ${inner}\n    </${tag}>`
  },
}

registry.register(ContainerModule)
