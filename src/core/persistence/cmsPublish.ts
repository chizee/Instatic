export interface CmsPublishResult {
  publishedPages: number
}

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export async function publishCmsDraft(
  fetchImpl: FetchLike = globalThis.fetch.bind(globalThis),
  basePath = '/api/cms',
): Promise<CmsPublishResult> {
  const res = await fetchImpl(`${basePath}/publish`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`CMS publish failed with ${res.status}`)
  return await res.json() as CmsPublishResult
}
