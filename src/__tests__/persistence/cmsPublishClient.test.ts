import { describe, expect, it } from 'bun:test'
import { publishCmsDraft } from '../../core/persistence/cmsPublish'

describe('publishCmsDraft', () => {
  it('posts to the CMS publish endpoint with session credentials', async () => {
    const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = []

    const result = await publishCmsDraft(async (input, init) => {
      calls.push({ input, init })
      return new Response(JSON.stringify({ publishedPages: 2 }), { status: 200 })
    })

    expect(result).toEqual({ publishedPages: 2 })
    expect(calls[0]).toMatchObject({
      input: '/api/cms/publish',
      init: { method: 'POST', credentials: 'include' },
    })
  })

  it('throws when the publish API rejects the request', async () => {
    await expect(
      publishCmsDraft(async () =>
        new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })),
    ).rejects.toThrow('CMS publish failed with 401')
  })
})
