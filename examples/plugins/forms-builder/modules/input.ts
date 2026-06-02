/**
 * Forms Builder — `instatic.forms.input`
 *
 * Single-line text/email/url/tel/number input with accessible label,
 * helper text, and required-asterisk.
 */
import { control, defineModule, html, raw } from '@instatic/plugin-sdk'

type InputType = 'text' | 'email' | 'url' | 'tel' | 'number'

export default defineModule({
  id: 'instatic.forms.input',
  name: 'Text Input',
  description: 'Single-line input field (text, email, URL, tel, number).',
  category: 'Forms',
  htmlTag: 'div',
  canHaveChildren: false,
  defaults: {
    name: 'field',
    label: 'Label',
    placeholder: '',
    required: false,
    helperText: '',
    inputType: 'text' as InputType,
  },
  schema: {
    name: control.text('Field Name', {
      placeholder: 'field_name',
      description: 'HTML name attribute — must be unique within the form.',
    }),
    label: control.text('Label'),
    placeholder: control.text('Placeholder'),
    required: control.toggle('Required'),
    helperText: control.text('Helper Text'),
    inputType: control.select('Input Type', [
      { label: 'Text',   value: 'text'   },
      { label: 'Email',  value: 'email'  },
      { label: 'URL',    value: 'url'    },
      { label: 'Phone',  value: 'tel'    },
      { label: 'Number', value: 'number' },
    ]),
  },
  render: ({ props }) => {
    const requiredAttr = props.required ? ' required' : ''
    const placeholderAttr = props.placeholder ? ` placeholder="${props.placeholder}"` : ''
    const asterisk = props.required
      ? raw('<span class="instatic-forms-required" aria-hidden="true">*</span>')
      : raw('')
    const helper = props.helperText
      ? html`<small class="instatic-forms-help">${props.helperText}</small>`
      : ''
    return {
      html: html`<div class="instatic-forms-field">
  <label class="instatic-forms-label" for="instatic-${props.name}">${props.label}${asterisk}</label>
  <input
    class="instatic-forms-control"
    id="instatic-${props.name}"
    type="${props.inputType}"
    name="${props.name}"${raw(placeholderAttr)}${raw(requiredAttr)}
  >
  ${raw(helper)}
</div>`,
    }
  },
})
