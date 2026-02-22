export type HealthResponse = {
  ok: boolean
  service: string
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch('/api/health', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Health check failed (${response.status})`)
  }

  const data = (await response.json()) as HealthResponse
  return data
}
