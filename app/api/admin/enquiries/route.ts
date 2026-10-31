import { authorizeStaff } from '@/lib/admin/auth.server'
import { listEnquiries } from '@/lib/admin/enquiries-repository.server'
import { errorResponse, jsonResponse } from '@/lib/admin/http'
import { parseListQuery } from '@/lib/admin/input'
import { logEvent } from '@/lib/observability/log'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const auth = await authorizeStaff(request, 'enquiries:read')
  if (!auth.ok) return auth.response

  const query = parseListQuery(new URL(request.url).searchParams)
  if (!query.ok) return errorResponse('invalid_query', 'Check the filter values.', 422, { fieldErrors: query.fieldErrors })

  try {
    return jsonResponse(await listEnquiries(query.value))
  } catch {
    logEvent('error', 'admin.enquiries_list_failed')
    return errorResponse('service_unavailable', 'Enquiries could not be loaded.', 503)
  }
}
