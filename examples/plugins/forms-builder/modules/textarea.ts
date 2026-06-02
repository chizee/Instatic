/**
 * Forms Builder — `instatic.forms.textarea`
 *
 * Multi-line textarea field with accessible label and helper text.
 */
import { control, defineModule, html, raw } from '@instatic/plugin-sdk'

export default defineModule({
  id: 'instatic.forms.textarea',
  name: 'Textarea',
  description: 'Multi-line text area field.',
  category: 'Forms',
  htmlTag: 'div',
  canHaveChildren: false,
  defaults: {
    name: 'message',
    label: 'Message',
    placeholder: '',
    required: false,
    helperText: '',
    rows: 4,
  },
  schema: {
    name: control.text('Field Name', {
      placeholder: 'message',
      description: 'HTML name attribute — must be unique within the form.',
    }),
    label: control.text('Label'),
    placeholder: control.text('Placeholder'),
    required: control.toggle('Required'),
    helperText: control.text('Helper Text'),
    rows: control.number('Rows', { min: 2, max: 20, step: 1 }),
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
  <textarea
    class="instatic-forms-control"
    id="instatic-${props.name}"
    name="${props.name}"
    rows="${props.rows}"${raw(placeholderAttr)}${raw(requiredAttr)}
  ></textarea>
  ${raw(helper)}
</div>`,
    }
  },
})
