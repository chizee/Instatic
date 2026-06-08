/**
 * base.container — semantic wrapper.
 *
 * Emits the chosen semantic tag with no default class or default CSS.
 * Visual styling is opt-in via user classes (mcClassName / multi-class system).
 *
 * Tag selection is shared with `base.loop` via `@modules/base/utils/htmlTag`:
 * built-in layout/list tags plus a 'custom' escape hatch (free-form `customTag`
 * text input) so authors can render any valid HTML element name.
 */
import type { ModuleDefinition } from '@core/module-engine'
import { registry } from '@core/module-engine'
import { SquareSolidIcon } from 'pixel-art-icons/icons/square-solid'
import {
  customHtmlTagControl,
  htmlTagControl,
  resolveHtmlTag,
  VOID_HTML_ELEMENTS,
} from '@modules/base/utils/htmlTag'
import {
  dataAttributesAttr,
  dataAttributesControl,
  DataAttributesPropSchemaOptions,
} from '@modules/base/shared/dataAttributes'
import { htmlIdAttr, htmlIdControl, HtmlIdPropSchemaOptions } from '@modules/base/shared/htmlId'
import { Type, Value, type Static } from '@core/utils/typeboxHelpers'
import { ContainerEditor } from './ContainerEditor'

const ContainerPropsSchema = Type.Object({
  tag: Type.String({ default: 'div' }),
  customTag: Type.String({ default: '' }),
  htmlId: Type.String(HtmlIdPropSchemaOptions),
  dataAttributes: Type.Record(Type.String(), Type.String(), DataAttributesPropSchemaOptions),
})

export type ContainerStoredProps = Static<typeof ContainerPropsSchema>

export const ContainerModule: ModuleDefinition<ContainerStoredProps> = {
  id: 'base.container',
  name: 'Container',
  description: 'A semantic container.',
  category: 'Layout',
  version: '2.0.0',
  icon: SquareSolidIcon,
  trusted: true,
  canHaveChildren: true,

  schema: {
    tag: htmlTagControl(),
    customTag: customHtmlTagControl(),
    htmlId: htmlIdControl(),
    dataAttributes: dataAttributesControl(),
  },

  propsSchema: ContainerPropsSchema,

  defaults: Value.Create(ContainerPropsSchema),

  component: ContainerEditor,

  htmlTag: (props) => resolveHtmlTag(props.tag, props.customTag),

  render: (props, renderedChildren) => {
    const tag = resolveHtmlTag(props.tag, props.customTag)
    const idAttr = htmlIdAttr(props.htmlId)
    const dataAttrs = dataAttributesAttr(props.dataAttributes)
    // Void elements (br, hr, img, …) take no closing tag — `<br></br>` would
    // be parsed as two <br>s.
    if (VOID_HTML_ELEMENTS.has(tag.toLowerCase())) {
      return { html: `<${tag}${idAttr}${dataAttrs}>` }
    }
    return {
      html: `<${tag}${idAttr}${dataAttrs}>${renderedChildren.join('')}</${tag}>`,
    }
  },
}

registry.registerOrReplace(ContainerModule)
