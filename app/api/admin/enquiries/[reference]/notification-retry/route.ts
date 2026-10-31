import { authorizeStaff } from '@/lib/admin/auth.server'
import { errorResponse, jsonResponse } from '@/lib/admin/http'
import { parseReference } from '@/lib/admin/input'
import { sendEnquiryNotification } from '@/lib/enquiries/notification-provider.server'
import { claimNotificationRetry, updateEnquiryNotificationStatus } from '@/lib/enquiries/server'
import { logEvent } from '@/lib/observability/log'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 15

export async function POST(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const auth = await authorizeStaff(request, 'enquiries:retry_notification')
  if (!auth.ok) return auth.response

  const reference = parseReference((await params).reference)
  if (!reference) return errorResponse('not_found', 'Enquiry not found.', 404)

  try {
    const claim = await claimNotificationRetry(reference, auth.staff.userId)
    if (claim.status === 'not_found') return errorResponse('not_found', 'Enquiry not found.', 404)
    if (claim.status === 'already_sent') return jsonResponse({ reference, notificationStatus: 'sent', retried: false })
    if (claim.status === 'in_progress') {
      return errorResponse('notification_in_progress', 'A notification attempt is already in progress.', 409)
    }

    const delivery = await sendEnquiryNotification(claim.snapshot)
    const finalStatus = delivery.success ? 'sent' : 'failed'
    await updateEnquiryNotificationStatus(claim.snapshot.submissionId, finalStatus)

    logEvent(delivery.success ? 'info' : 'warn', 'admin.notification_retry', { reference, outcome: finalStatus })
    return jsonResponse({ reference, notificationStatus: finalStatus, retried: true }, delivery.success ? 200 : 502)
  } catch {
    logEvent('error', 'admin.notification_retry_failed', { reference })
    return errorResponse('service_unavailable', 'The notification retry could not be completed.', 503)
  }
}
