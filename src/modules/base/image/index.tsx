/* eslint-disable react-refresh/only-export-components */
/**
 * base.image — image content.
 *
 * Emits a bare `<img>` with no default class or default CSS.
 * Visual styling is opt-in via user classes (mcClassName / multi-class system).
 */
import React from 'react'
import { type ModuleDefinition, type ModuleComponentProps } from '@core/module-engine/types'
import { registry } from '@core/module-engine/registry'
import { ImageIcon } from 'pixel-art-icons/icons/image'
import { safeUrl } from '../utils/escape'
import { cn } from '@ui/cn'
import styles from './image.module.css'

interface ImageProps extends Record<string, unknown> {
  src: string
  alt: string
  loading: 'lazy' | 'eager'
}

const ImageEditor: React.FC<ModuleComponentProps<ImageProps>> = ({ props, mcClassName }) => {
  if (props.src) {
    return <img src={props.src} alt={props.alt || ''} className={mcClassName} loading={props.loading} />
  }
  return <div className={cn(styles.placeholder, mcClassName)}>No image selected</div>
}

export const ImageModule: ModuleDefinition<ImageProps> = {
  id: 'base.image',
  name: 'Image',
  description: 'A responsive image.',
  category: 'Media',
  version: '2.0.0',
  icon: ImageIcon,
  trusted: true,
  canHaveChildren: false,

  schema: {
    // Image picker is wide by nature (library list, URL preview, etc.) — it
    // already gets `layout: 'stacked'` from the per-type default. The alt
    // text input reads better stacked too, since it sits visually next to
    // the image and frequently holds long descriptive sentences.
    src: { type: 'image', label: 'Image' },
    alt: { type: 'text', label: 'Alt text', placeholder: 'Describe the image…', layout: 'stacked' },
    loading: {
      type: 'select',
      label: 'Loading',
      options: [
        { label: 'Lazy', value: 'lazy' },
        { label: 'Eager', value: 'eager' },
      ],
    },
  },

  defaults: {
    src: '',
    alt: '',
    loading: 'lazy',
  },

  component: ImageEditor,

  render: (props) => {
    const src = safeUrl(props.src)
    const alt = String(props.alt ?? '')
    const loading = props.loading === 'eager' ? 'eager' : 'lazy'
    if (!src) return { html: '' }
    return {
      html: `<img src="${src}" alt="${alt}" loading="${loading}">`,
    }
  },
}

registry.register(ImageModule)
