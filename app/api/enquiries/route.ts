import { saveEnquiry } from '@/lib/enquiries/server'
import { validateEnquiry } from '@/lib/enquiries/validation'

export const runtime = 'nodejs'
export const maxDuration = 15

const maxBodySize = 16_000

function respond(body: Record<string, unknown>, status: number, headers: HeadersInit = {}) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getRequestOrigin(request: Request) {
  const protocol = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
  const host = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
    ?? request.headers.get('host')?.split(',')[0]?.trim()

  if (protocol && host) {
    try {
      return new URL(`${protocol}://${host}`).origin
    } catch {
      return new URL(request.url).origin
    }
  }

  return new URL(request.url).origin
}

function getClientIdentifier(request: Request) {
  const realIp = request.headers.get('x-real-ip')?.trim()
  const forwardedIp = request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()
  const identifier = realIp || forwardedIp || 'unknown'
  return identifier.length <= 128 ? identifier : 'unknown'
}

function getSourcePage(request: Request) {
  const referer = request.headers.get('referer')
  if (!referer) return '/contact'

  try {
    const refererUrl = new URL(referer)
    if (refererUrl.origin !== getRequestOrigin(request)) return '/contact'
    return refererUrl.pathname.slice(0, 512) || '/contact'
  } catch {
    return '/contact'
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin) {
    try {
      if (new URL(origin).origin !== getRequestOrigin(request)) {
        return respond({ error: 'invalid_origin', message: 'Please submit this form from our website.' }, 403)
      }
    } catch {
      return respond({ error: 'invalid_origin', message: 'Please submit this form from our website.' }, 403)
    }
  }

  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return respond({ error: 'unsupported_media_type', message: 'Submit the enquiry using the website form.' }, 415)
  }

  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > maxBodySize) {
    return respond({ error: 'payload_too_large', message: 'The enquiry is too long to submit.' }, 413)
  }

  const bodyText = await request.text()
  if (new TextEncoder().encode(bodyText).byteLength > maxBodySize) {
    return respond({ error: 'payload_too_large', message: 'The enquiry is too long to submit.' }, 413)
  }

  let payload: unknown
  try {
    payload = JSON.parse(bodyText)
  } catch {
    return respond({ error: 'invalid_json', message: 'The form could not be read. Please try again.' }, 400)
  }

  if (isRecord(payload) && typeof payload.website === 'string' && payload.website.trim()) {
    return respond({ error: 'invalid_submission', message: 'Please check the form and try again.' }, 400)
  }

  const validation = validateEnquiry(payload)
  if (!validation.success) {
    return respond({
      error: 'invalid_submission',
      message: 'Please check the enquiry details and try again.',
      fieldErrors: validation.fieldErrors,
    }, 422)
  }

  try {
    const result = await saveEnquiry(
      { ...validation.value, sourcePage: getSourcePage(request) },
      getClientIdentifier(request),
    )

    if (result.status === 'rate_limited') {
      return respond(
        { error: 'rate_limited', message: 'Please wait a little before sending another enquiry.' },
        429,
        { 'Retry-After': '900' },
      )
    }

    return respond({ status: 'received', reference: result.reference }, 201)
  } catch {
    console.error('[api/enquiries] Unable to persist enquiry')
    return respond({
      error: 'persistence_unavailable',
      message: 'We could not save your enquiry. Please try again shortly or contact our team directly.',
    }, 503)
  }
}
