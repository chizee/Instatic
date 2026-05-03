/* eslint-disable react-refresh/only-export-components */
/**
 * base.container — semantic wrapper.
 *
 * Emits the chosen semantic tag with no default class or default CSS.
 * Visual styling is opt-in via user classes (mcClassName / multi-class system).
 */
import React from 'react'
import { type ModuleDefinition, type ModuleComponentProps } from '@core/module-engine/types'
import { registry } from '@core/module-engine/registry'
import { SquareIcon } from 'pixel-art-icons/icons/square'

interface ContainerProps extends Record<string, unknown> {
  tag: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer'
}

const VALID_TAGS = new Set<ContainerProps['tag']>(['div', 'section', 'article', 'main', 'header', 'footer'])

function resolveContainerTag(value: unknown): ContainerProps['tag'] {
  return typeof value === 'string' && VALID_TAGS.has(value as ContainerProps['tag'])
    ? value as ContainerProps['tag']
    : 'div'
}

const ContainerEditor: React.FC<ModuleComponentProps<ContainerProps>> = ({ props, children, mcClassName }) => {
  const Tag = resolveContainerTag(props.tag)
  return React.createElement(Tag, { className: mcClassName }, children)
}

export const ContainerModule: ModuleDefinition<ContainerProps> = {
  id: 'base.container',
  name: 'Container',
  description: 'A semantic container.',
  category: 'Layout',
  version: '2.0.0',
  icon: SquareIcon,
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

  component: ContainerEditor,

  render: (props, renderedChildren) => {
    const tag = resolveContainerTag(props.tag)
    return {
      html: `<${tag}>${renderedChildren.join('')}</${tag}>`,
    }
  },
}

registry.register(ContainerModule)
