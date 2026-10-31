import { canTransitionEnquiryStatus, isEnquiryStatus, type EnquiryStatus } from '../enquiries/status.ts'

export const enquiryReferencePattern = /^TTT-\d{6}-[0-9A-F]{16}$/u
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u

type Parsed<T> = { ok: true; value: T } | { ok: false; fieldErrors: Record<string, string> }

export function parseReference(value: string) {
  const reference = value.trim().toUpperCase()
  return enquiryReferencePattern.test(reference) ? reference : null
}

function normalizeNote(value: string) {
  return value
    .normalize('NFKC')
    .replace(/\r\n?/gu, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/gu, '')
    .trim()
}

export interface EnquiryListQuery {
  status: EnquiryStatus | null
  reference: string | null
  email: string | null
  page: number
  pageSize: number
}

export function parseListQuery(params: URLSearchParams): Parsed<EnquiryListQuery> {
  const fieldErrors: Record<string, string> = {}

  const rawStatus = params.get('status')
  const status = rawStatus ? (isEnquiryStatus(rawStatus) ? rawStatus : null) : null
  if (rawStatus && !status) fieldErrors.status = 'Unknown status.'

  const rawReference = params.get('reference')
  const reference = rawReference ? parseReference(rawReference) : null
  if (rawReference && !reference) fieldErrors.reference = 'Invalid reference format.'

  const rawEmail = params.get('email')?.trim().toLowerCase() || null
  if (rawEmail && (rawEmail.length > 254 || !emailPattern.test(rawEmail))) fieldErrors.email = 'Invalid email address.'

  const page = Number(params.get('page') ?? '1')
  if (!Number.isInteger(page) || page < 1 || page > 10_000) fieldErrors.page = 'Page must be a whole number from 1.'

  const pageSize = Number(params.get('pageSize') ?? '25')
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) fieldErrors.pageSize = 'Page size must be from 1 to 100.'

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors }
  return { ok: true, value: { status, reference, email: rawEmail, page, pageSize } }
}

export interface StatusUpdate {
  status: EnquiryStatus
  expectedStatus: EnquiryStatus
  note: string | null
}

export function parseStatusUpdate(body: unknown): Parsed<StatusUpdate> {
  const source = typeof body === 'object' && body !== null && !Array.isArray(body) ? body as Record<string, unknown> : {}
  const fieldErrors: Record<string, string> = {}

  if (!isEnquiryStatus(source.status)) fieldErrors.status = 'Choose a valid status.'
  if (!isEnquiryStatus(source.expectedStatus)) fieldErrors.expectedStatus = 'Provide the current status you are changing from.'

  let note: string | null = null
  if (source.note !== undefined && source.note !== null && source.note !== '') {
    if (typeof source.note !== 'string') fieldErrors.note = 'Enter valid text.'
    else {
      note = normalizeNote(source.note) || null
      if (note && note.length > 2000) fieldErrors.note = 'Keep the note under 2,000 characters.'
    }
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors }

  const status = source.status as EnquiryStatus
  const expectedStatus = source.expectedStatus as EnquiryStatus
  if (!canTransitionEnquiryStatus(expectedStatus, status)) {
    return { ok: false, fieldErrors: { status: `An enquiry cannot move from ${expectedStatus} to ${status}.` } }
  }

  return { ok: true, value: { status, expectedStatus, note } }
}

export function parseNote(body: unknown): Parsed<{ note: string }> {
  const source = typeof body === 'object' && body !== null && !Array.isArray(body) ? body as Record<string, unknown> : {}
  if (typeof source.note !== 'string') return { ok: false, fieldErrors: { note: 'Enter a note.' } }
  const note = normalizeNote(source.note)
  if (note.length < 1 || note.length > 2000) {
    return { ok: false, fieldErrors: { note: 'Write a note using 1 to 2,000 characters.' } }
  }
  return { ok: true, value: { note } }
}
