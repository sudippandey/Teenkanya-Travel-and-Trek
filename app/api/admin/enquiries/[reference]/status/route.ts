import { authorizeStaff } from '@/lib/admin/auth.server'
import { changeEnquiryStatus } from '@/lib/admin/enquiries-repository.server'
import { errorResponse, jsonResponse, readJsonBody } from '@/lib/admin/http'
import { parseReference, parseStatusUpdate } from '@/lib/admin/input'
import { logEvent } from '@/lib/observability/log'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const auth = await authorizeStaff(request, 'enquiries:update_status')
  if (!auth.ok) return auth.response

  const reference = parseReference((await params).reference)
  if (!reference) return errorResponse('not_found', 'Enquiry not found.', 404)

  const body = await readJsonBody(request)
  if (!body.ok) return body.response

  const update = parseStatusUpdate(body.value)
  if (!update.ok) return errorResponse('invalid_update', 'Check the status change.', 422, { fieldErrors: update.fieldErrors })

  try {
    const result = await changeEnquiryStatus(
      reference,
      update.value.expectedStatus,
      update.value.status,
      auth.staff.userId,
      update.value.note,
    )

    if (result === 'not_found') return errorResponse('not_found', 'Enquiry not found.', 404)
    if (result === 'conflict') {
      return errorResponse('status_conflict', 'The enquiry status changed since you loaded it. Refresh and try again.', 409)
    }

    logEvent('info', 'admin.enquiry_status_changed', { reference, to: update.value.status })
    return jsonResponse({ reference, status: update.value.status })
  } catch {
    logEvent('error', 'admin.enquiry_status_failed', { reference })
    return errorResponse('service_unavailable', 'The status could not be changed.', 503)
  }
}
