import 'server-only'

import { getSupabaseServerConnection, isSupabaseConfigured } from '@/lib/supabase/server-client'
import { logEvent } from '@/lib/observability/log'
import { errorResponse } from './http'
import {
  extractBearerToken,
  hasPermission,
  isStaffRole,
  type StaffPermission,
  type StaffRole,
} from './permissions'

export interface StaffContext {
  userId: string
  role: StaffRole
}

export type StaffAuthorization =
  | { ok: true; staff: StaffContext }
  | { ok: false; response: Response }

const unauthenticated = () => errorResponse(
  'unauthenticated',
  'Sign in with a staff account to continue.',
  401,
  {},
  { 'WWW-Authenticate': 'Bearer' },
)

/**
 * Verifies a Supabase Auth access token, then requires an active staff_members row
 * whose role grants the requested permission. Every admin route must call this first.
 */
export async function authorizeStaff(request: Request, permission: StaffPermission): Promise<StaffAuthorization> {
  const token = extractBearerToken(request.headers.get('authorization'))
  if (!token) return { ok: false, response: unauthenticated() }

  if (!isSupabaseConfigured()) {
    return { ok: false, response: errorResponse('service_unavailable', 'The admin service is not configured.', 503) }
  }

  try {
    const { client } = getSupabaseServerConnection()
    const { data: userData, error: userError } = await client.auth.getUser(token)
    if (userError || !userData.user) return { ok: false, response: unauthenticated() }

    const { data: staff, error: staffError } = await client
      .from('staff_members')
      .select('role,active')
      .eq('user_id', userData.user.id)
      .maybeSingle()

    if (staffError) throw new Error('Staff lookup failed')
    if (!staff || staff.active !== true || !isStaffRole(staff.role)) {
      logEvent('warn', 'admin.forbidden_non_staff', { permission })
      return { ok: false, response: errorResponse('forbidden', 'This account does not have staff access.', 403) }
    }

    if (!hasPermission(staff.role, permission)) {
      logEvent('warn', 'admin.forbidden_permission', { permission, role: staff.role })
      return { ok: false, response: errorResponse('forbidden', 'Your role does not allow this action.', 403) }
    }

    return { ok: true, staff: { userId: userData.user.id, role: staff.role } }
  } catch {
    logEvent('error', 'admin.authorization_unavailable', { permission })
    return { ok: false, response: errorResponse('service_unavailable', 'Authorization could not be verified. Try again shortly.', 503) }
  }
}
