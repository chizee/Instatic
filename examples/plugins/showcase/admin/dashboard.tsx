/**
 * Showcase plugin — admin dashboard.
 *
 * Real React component that uses JSX, host design-system primitives, and
 * host hooks. The plugin's bundle externalizes `react`,
 * `@pagebuilder/host-ui`, `@pagebuilder/host-hooks`, and
 * `@pagebuilder/plugin-sdk` — the host's import map resolves those at
 * mount time so this code shares the editor's React instance + UI.
 */
import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Code,
  Heading,
  Stack,
  Text,
} from '@pagebuilder/host-ui'
import { usePluginRoutes } from '@pagebuilder/host-hooks'
import { definePluginAdminApp } from '@pagebuilder/plugin-sdk'

interface Status {
  ok: boolean
  plugin: string
  total: number
  byEvent: Record<string, number>
}

function ShowcaseDashboard() {
  const routes = usePluginRoutes()
  const [status, setStatus] = useState<Status | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await routes.fetch('status')
      const body = (await res.json()) as Status
      setStatus(body)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load status')
    } finally {
      setLoading(false)
    }
  }, [routes])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const clearAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await routes.fetch('clear', { method: 'POST' })
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear')
      setLoading(false)
    }
  }, [refresh, routes])

  return (
    <Stack gap={16}>
      <Heading level={2}>Showcase</Heading>
      <Text variant="muted">
        Open a published page in another tab; events fire automatically and appear
        here in real time.
      </Text>
      {error && (
        <Alert tone="danger" title="Error">
          {error}
        </Alert>
      )}
      <Card padding={16}>
        <Stack gap={12}>
          <Heading level={3}>Tracker status</Heading>
          {loading ? (
            <Text variant="muted">Loading...</Text>
          ) : (
            <Code>{JSON.stringify(status, null, 2)}</Code>
          )}
          <Stack direction="row" gap={8}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void refresh()}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => void clearAll()}
              disabled={loading || !status || status.total === 0}
            >
              Clear events
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  )
}

export default definePluginAdminApp(ShowcaseDashboard)
