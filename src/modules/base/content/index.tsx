/* eslint-disable react-refresh/only-export-components */
/**
 * base.content — renders the current CMS entry body.
 *
 * Emits a bare `<article>` wrapper around the entry's HTML, with no default
 * class or default CSS. Visual styling is opt-in via user classes
 * (mcClassName / multi-class system).
 */
import React from 'react'
import { type ModuleDefinition, type ModuleComponentProps } from '@core/module-engine/types'
import { registry } from '@core/module-engine/registry'
import { ArticleIcon } from 'pixel-art-icons/icons/article'
import { cn } from '@ui/cn'
import styles from './content.module.css'

interface ContentProps extends Record<string, unknown> {
  html: string
}

const ContentEditor: React.FC<ModuleComponentProps<ContentProps>> = ({ props, mcClassName }) => {
  if (!props.html) {
    return <div className={cn(styles.placeholder, mcClassName)}>Content body</div>
  }

  return (
    <article
      className={mcClassName}
      dangerouslySetInnerHTML={{ __html: props.html }}
    />
  )
}

export const ContentModule: ModuleDefinition<ContentProps> = {
  id: 'base.content',
  name: 'Content Body',
  description: 'Renders the current CMS entry body.',
  category: 'CMS',
  version: '1.0.0',
  icon: ArticleIcon,
  trusted: true,
  canHaveChildren: false,

  schema: {
    html: { type: 'richtext', label: 'HTML' },
  },

  defaults: {
    html: '',
  },

  component: ContentEditor,

  render: (props) => {
    const html = typeof props.html === 'string' ? props.html : ''
    if (!html) return { html: '' }
    return {
      html: `<article>${html}</article>`,
    }
  },
}

registry.register(ContentModule)
