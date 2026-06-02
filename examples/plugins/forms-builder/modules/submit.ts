/**
 * Forms Builder — `instatic.forms.submit`
 *
 * Submit button for a form.
 */
import { control, defineModule, html } from '@instatic/plugin-sdk'

export default defineModule({
  id: 'instatic.forms.submit',
  name: 'Submit Button',
  description: 'Submit button for a form.',
  category: 'Forms',
  htmlTag: 'div',
  canHaveChildren: false,
  defaults: {
    label: 'Submit',
  },
  schema: {
    label: control.text('Button Label', { placeholder: 'Submit' }),
  },
  render: ({ props }) => ({
    html: html`<div class="instatic-forms-submit-wrap">
  <button class="instatic-forms-submit" type="submit">${props.label}</button>
</div>`,
    css: `
.instatic-forms-submit-wrap{display:flex;}
.instatic-forms-submit{display:inline-flex;align-items:center;justify-content:center;padding:10px 24px;background:#111;color:#fff;border:none;border-radius:4px;font-size:0.9375rem;font-family:inherit;font-weight:500;cursor:pointer;transition:opacity 0.15s;}
.instatic-forms-submit:hover{opacity:0.85;}
.instatic-forms-submit:disabled{opacity:0.5;cursor:not-allowed;}
`,
  }),
})
