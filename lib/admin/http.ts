import { readRequestBodyBounded } from '@/lib/enquiries/request-body'

export function jsonResponse(body: Record<string, unknown>, status = 200, headers: HeadersInit = {}) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  })
}

export function errorResponse(
  error: string,
  message: string,
  status: number,
  extra: Record<string, unknown> = {},
  headers: HeadersInit = {},
) {
  return jsonResponse({ error, message, ...extra }, status, headers)
}

export async function readJsonBody(request: Request, maxBytes = 8_000) {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return { ok: false as const, response: errorResponse('unsupported_media_type', 'Send a JSON body.', 415) }
  }

  const body = await readRequestBodyBounded(request, maxBytes)
  if (!body.ok) {
    return body.reason === 'too_large'
      ? { ok: false as const, response: errorResponse('payload_too_large', 'The request body is too large.', 413) }
      : { ok: false as const, response: errorResponse('invalid_json', 'The request body could not be read.', 400) }
  }

  try {
    return { ok: true as const, value: JSON.parse(body.text) as unknown }
  } catch {
    return { ok: false as const, response: errorResponse('invalid_json', 'The request body could not be read.', 400) }
  }
}
