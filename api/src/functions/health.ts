import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

export async function health(
  _request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log('Health check requested.')

  return {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
    jsonBody: {
      ok: true,
      service: 'pomofocus-api',
    },
  }
}

app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: health,
})
