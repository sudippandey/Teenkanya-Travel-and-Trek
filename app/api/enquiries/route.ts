import { sendEnquiryNotification } from '@/lib/enquiries/notification-provider.server'
import { saveEnquiry, updateEnquiryNotificationStatus } from '@/lib/enquiries/server'
import { processEnquirySubmission } from '@/lib/enquiries/submission-workflow'

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

  try {
    const outcome = await processEnquirySubmission(
      payload,
      getClientIdentifier(request),
      getSourcePage(request),
      {
        persist: saveEnquiry,
        notify: sendEnquiryNotification,
        updateNotificationStatus: updateEnquiryNotificationStatus,
      },
    )

    if (outcome.status === 'invalid') {
      return respond({
        error: 'invalid_submission',
        message: 'Please check the enquiry details and try again.',
        fieldErrors: outcome.fieldErrors,
      }, 422)
    }

    if (outcome.status === 'rate_limited') {
      return respond(
        { error: 'rate_limited', message: 'Please wait a little before sending another enquiry.' },
        429,
        { 'Retry-After': '900' },
      )
    }

    if (outcome.status === 'notification_pending') {
      return respond({
        error: 'notification_pending',
        saved: true,
        reference: outcome.reference,
        message: 'Your enquiry is saved, but its email notification is still being processed. Please wait a moment before retrying.',
      }, 409)
    }

    if (outcome.status === 'notification_failed') {
      if (outcome.statusUpdateFailed) {
        console.error('[api/enquiries] Notification failure state could not be saved')
      }
      return respond({
        error: 'notification_failed',
        saved: true,
        reference: outcome.reference,
        message: 'Your enquiry is saved, but Web3Forms did not confirm the email submission. Please retry, or contact our team with the saved reference.',
      }, 502)
    }

    if (outcome.statusUpdateFailed) {
      console.error('[api/enquiries] Notification success state could not be saved')
    }

    return respond(
      { status: 'received', reference: outcome.reference },
      outcome.duplicate ? 200 : 201,
    )
  } catch {
    console.error('[api/enquiries] Unable to complete enquiry submission')
    return respond({
      error: 'submission_unavailable',
      message: 'We could not complete your enquiry. Please retry with the same details or contact our team directly.',
    }, 503)
  }
}
