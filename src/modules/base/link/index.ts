/**
 * base.link — anchor element.
 *
 * Emits a bare `<a>` with no default class or default CSS.
 * Visual styling is opt-in via user classes (mcClassName / multi-class system).
 */
import type { ModuleDefinition } from '@core/module-engine'
import { registry } from '@core/module-engine'
import { LinkIcon } from 'pixel-art-icons/icons/link'
import { safeUrl } from '@modules/base/utils/escape'
import { Type, Value, type Static } from '@core/utils/typeboxHelpers'
import { AnchorTargetSchema, ANCHOR_TARGET_OPTIONS, anchorRel } from '@modules/base/shared/anchorTarget'
import {
  dataAttributesAttr,
  dataAttributesControl,
  DataAttributesPropSchemaOptions,
} from '@modules/base/shared/dataAttributes'
import { htmlIdAttr, htmlIdControl, HtmlIdPropSchemaOptions } from '@modules/base/shared/htmlId'
import { linkUsesChildren } from './content'
import { LinkEditor } from './LinkEditor'

const LinkPropsSchema = Type.Object({
  href: Type.String({ default: '#' }),
  text: Type.String({ default: 'Click here' }),
  target: AnchorTargetSchema,
  htmlId: Type.String(HtmlIdPropSchemaOptions),
  dataAttributes: Type.Record(Type.String(), Type.String(), DataAttributesPropSchemaOptions),
})

export type LinkStoredProps = Static<typeof LinkPropsSchema>

export const LinkModule: ModuleDefinition<LinkStoredProps> = {
  id: 'base.link',
  name: 'Link',
  description: 'An anchor element.',
  category: 'Interactive',
  version: '2.0.0',
  icon: LinkIcon,
  trusted: true,
  canHaveChildren: true,

  schema: {
    href: { type: 'url', label: 'URL' },
    text: { type: 'text', label: 'Link text', placeholder: 'Displayed when no children' },
    target: {
      type: 'select',
      label: 'Target',
      options: [...ANCHOR_TARGET_OPTIONS],
    },
    htmlId: htmlIdControl(),
    dataAttributes: dataAttributesControl(),
  },

  propsSchema: LinkPropsSchema,

  defaults: Value.Create(LinkPropsSchema),

  component: LinkEditor,

  htmlTag: 'a',

  render: (props, renderedChildren) => {
    const href = safeUrl(props.href)
    const idAttr = htmlIdAttr(props.htmlId)
    const dataAttrs = dataAttributesAttr(props.dataAttributes)
    const rel = anchorRel(props.target)
    const relAttr = rel ? ` rel="${rel}"` : ''
    const targetAttr = ` target="${String(props.target)}"`
    const content = linkUsesChildren(renderedChildren.length)
      ? renderedChildren.join('')
      : String(props.text ?? '')
    return {
      html: `<a${idAttr}${dataAttrs} href="${href}"${targetAttr}${relAttr}>${content}</a>`,
    }
  },
}

registry.registerOrReplace(LinkModule)
