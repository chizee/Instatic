/**
 * Showcase plugin — editor entrypoint.
 *
 * Demonstrates every editor-side SDK surface:
 *   - register a command
 *   - add a toolbar button
 *   - register a left-sidebar panel (`editor.panels`) using a real React
 *     component with JSX, hooks, and the host design system.
 *
 * The plugin's bundle externalizes `react`, `@pagebuilder/host-ui`,
 * `@pagebuilder/host-hooks`, and `@pagebuilder/plugin-sdk`. The host's
 * import map (in `index.html`) resolves those bare specifiers to its own
 * React instance + design-system primitives at mount time.
 */
import { useState } from 'react'
import {
  Button,
  Card,
  Stack,
  Text,
} from '@pagebuilder/host-ui'
import {
  definePluginPanel,
  type EditorPluginApi,
  type EditorPluginModule,
} from '@pagebuilder/plugin-sdk'

function ShowcasePanel() {
  const [count, setCount] = useState(0)
  // Host renders the panel header (title + close button) — your component
  // emits the body only. Compose freely with host-ui primitives + any
  // React patterns you like.
  return (
    <Stack gap={12}>
      <Text variant="muted">Demo panel registered via editor.panels.</Text>
      <Card>
        <Stack gap={8}>
          <Text>Click count: {count}</Text>
          <Button variant="primary" onClick={() => setCount(count + 1)}>
            Increment
          </Button>
        </Stack>
      </Card>
    </Stack>
  )
}

const reviewPanel = definePluginPanel({
  id: 'acme.showcase.review',
  label: 'Showcase',
  iconName: 'box-stack',
  accent: 'mint',
  component: ShowcasePanel,
})

const mod: EditorPluginModule = {
  activate(api: EditorPluginApi) {
    api.editor.commands.register({
      id: 'acme.showcase.ping',
      label: 'Showcase Ping',
      run: () => ({ message: 'Showcase command fired' }),
    })

    api.editor.toolbar.addButton({
      id: 'acme.showcase.ping',
      label: 'Showcase',
      command: 'acme.showcase.ping',
    })

    api.editor.panels.register(reviewPanel)
  },
}

export default mod
export const activate = mod.activate!
