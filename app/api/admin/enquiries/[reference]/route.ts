import { authorizeStaff } from '@/lib/admin/auth.server'
import { getEnquiryDetail } from '@/lib/admin/enquiries-repository.server'
import { errorResponse, jsonResponse } from '@/lib/admin/http'
import { parseReference } from '@/lib/admin/input'
import { logEvent } from '@/lib/observability/log'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const auth = await authorizeStaff(request, 'enquiries:read')
  if (!auth.ok) return auth.response

  const reference = parseReference((await params).reference)
  if (!reference) return errorResponse('not_found', 'Enquiry not found.', 404)

  try {
    const enquiry = await getEnquiryDetail(reference)
    if (!enquiry) return errorResponse('not_found', 'Enquiry not found.', 404)
    return jsonResponse({ enquiry })
  } catch {
    logEvent('error', 'admin.enquiry_detail_failed')
    return errorResponse('service_unavailable', 'The enquiry could not be loaded.', 503)
  }
}
