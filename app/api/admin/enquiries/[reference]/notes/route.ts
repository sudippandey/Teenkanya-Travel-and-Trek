import { authorizeStaff } from '@/lib/admin/auth.server'
import { addEnquiryNote } from '@/lib/admin/enquiries-repository.server'
import { errorResponse, jsonResponse, readJsonBody } from '@/lib/admin/http'
import { parseNote, parseReference } from '@/lib/admin/input'
import { logEvent } from '@/lib/observability/log'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const auth = await authorizeStaff(request, 'enquiries:add_note')
  if (!auth.ok) return auth.response

  const reference = parseReference((await params).reference)
  if (!reference) return errorResponse('not_found', 'Enquiry not found.', 404)

  const body = await readJsonBody(request)
  if (!body.ok) return body.response

  const parsed = parseNote(body.value)
  if (!parsed.ok) return errorResponse('invalid_note', 'Check the note.', 422, { fieldErrors: parsed.fieldErrors })

  try {
    const result = await addEnquiryNote(reference, auth.staff.userId, parsed.value.note)
    if (result === 'not_found') return errorResponse('not_found', 'Enquiry not found.', 404)
    return jsonResponse({ reference, added: true }, 201)
  } catch {
    logEvent('error', 'admin.enquiry_note_failed', { reference })
    return errorResponse('service_unavailable', 'The note could not be saved.', 503)
  }
}
