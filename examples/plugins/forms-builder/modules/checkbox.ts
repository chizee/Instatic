/**
 * Forms Builder — `instatic.forms.checkbox`
 *
 * Single checkbox with a visible label and optional helper text.
 */
import { control, defineModule, html, raw } from '@instatic/plugin-sdk'

export default defineModule({
  id: 'instatic.forms.checkbox',
  name: 'Checkbox',
  description: 'A single checkbox field.',
  category: 'Forms',
  htmlTag: 'div',
  canHaveChildren: false,
  defaults: {
    name: 'agree',
    label: 'I agree to the terms',
    required: false,
    helperText: '',
  },
  schema: {
    name: control.text('Field Name', {
      placeholder: 'agree',
      description: 'HTML name attribute — must be unique within the form.',
    }),
    label: control.text('Label'),
    required: control.toggle('Required'),
    helperText: control.text('Helper Text'),
  },
  render: ({ props }) => {
    const requiredAttr = props.required ? ' required' : ''
    const asterisk = props.required
      ? raw('<span class="instatic-forms-required" aria-hidden="true">*</span>')
      : raw('')
    const helper = props.helperText
      ? html`<small class="instatic-forms-help">${props.helperText}</small>`
      : ''
    return {
      html: html`<div class="instatic-forms-field instatic-forms-field--checkbox">
  <label class="instatic-forms-label instatic-forms-label--checkbox">
    <input
      class="instatic-forms-checkbox"
      type="checkbox"
      name="${props.name}"
      value="1"${raw(requiredAttr)}
    >
    ${props.label}${asterisk}
  </label>
  ${raw(helper)}
</div>`,
      css: `
.instatic-forms-field--checkbox .instatic-forms-label--checkbox{display:flex;align-items:flex-start;gap:8px;font-size:0.9375rem;cursor:pointer;}
.instatic-forms-checkbox{flex-shrink:0;margin-top:3px;width:15px;height:15px;}
`,
    }
  },
})
