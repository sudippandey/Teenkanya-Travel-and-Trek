export const staffRoles = ['admin', 'agent'] as const
export type StaffRole = (typeof staffRoles)[number]

export const staffPermissions = [
  'enquiries:read',
  'enquiries:update_status',
  'enquiries:add_note',
  'enquiries:retry_notification',
] as const
export type StaffPermission = (typeof staffPermissions)[number]

const rolePermissions: Record<StaffRole, ReadonlySet<StaffPermission>> = {
  admin: new Set(staffPermissions),
  agent: new Set(['enquiries:read', 'enquiries:update_status', 'enquiries:add_note']),
}

export function isStaffRole(value: unknown): value is StaffRole {
  return typeof value === 'string' && (staffRoles as readonly string[]).includes(value)
}

export function hasPermission(role: StaffRole, permission: StaffPermission) {
  return rolePermissions[role].has(permission)
}

const bearerPattern = /^Bearer ([A-Za-z0-9\-._~+/]+=*)$/u

export function extractBearerToken(headerValue: string | null) {
  if (!headerValue || headerValue.length > 4096) return null
  return bearerPattern.exec(headerValue.trim())?.[1] ?? null
}
