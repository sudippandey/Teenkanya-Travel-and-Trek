import 'server-only'

import { getSupabaseServerConnection } from '@/lib/supabase/server-client'
import type { EnquiryListQuery } from './input'
import type { EnquiryStatus } from '@/lib/enquiries/status'

const summaryColumns = 'reference,full_name,email,phone,country_of_residence,preferred_contact_channel,interest,catalogue_item_type,catalogue_item_slug,travel_start_date,dates_flexible,traveller_count,status,notification_status,notification_attempts,acknowledgement_status,assigned_staff_id,created_at,updated_at,status_changed_at'
const detailColumns = `id,${summaryColumns},message,special_requirements,source_page,last_notification_attempt_at`

type Row = Record<string, unknown>

function toSummary(row: Row) {
  return {
    reference: row.reference,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    countryOfResidence: row.country_of_residence,
    preferredContactChannel: row.preferred_contact_channel,
    interest: row.interest,
    catalogueItem: row.catalogue_item_type
      ? { type: row.catalogue_item_type, slug: row.catalogue_item_slug }
      : null,
    travelStartDate: row.travel_start_date,
    datesFlexible: row.dates_flexible,
    travellerCount: row.traveller_count,
    status: row.status,
    notificationStatus: row.notification_status,
    notificationAttempts: row.notification_attempts,
    acknowledgementStatus: row.acknowledgement_status,
    assignedStaffId: row.assigned_staff_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    statusChangedAt: row.status_changed_at,
  }
}

export async function listEnquiries(query: EnquiryListQuery) {
  const { client } = getSupabaseServerConnection()
  const from = (query.page - 1) * query.pageSize

  let request = client
    .from('enquiries')
    .select(summaryColumns, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + query.pageSize - 1)

  if (query.status) request = request.eq('status', query.status)
  if (query.reference) request = request.eq('reference', query.reference)
  if (query.email) request = request.eq('email', query.email)

  const { data, error, count } = await request
  if (error) throw new Error('Enquiries could not be listed')

  return {
    items: (data ?? []).map((row) => toSummary(row as Row)),
    page: query.page,
    pageSize: query.pageSize,
    total: count ?? 0,
  }
}

export async function getEnquiryDetail(reference: string) {
  const { client } = getSupabaseServerConnection()
  const { data, error } = await client
    .from('enquiries')
    .select(detailColumns)
    .eq('reference', reference)
    .maybeSingle()

  if (error) throw new Error('Enquiry could not be loaded')
  if (!data) return null
  const row = data as Row

  const { data: events, error: eventsError } = await client
    .from('enquiry_events')
    .select('id,event_type,actor_type,actor_id,from_status,to_status,note,metadata,created_at')
    .eq('enquiry_id', row.id as string)
    .order('created_at', { ascending: true })
    .limit(200)

  if (eventsError) throw new Error('Enquiry history could not be loaded')

  return {
    ...toSummary(row),
    message: row.message,
    specialRequirements: row.special_requirements,
    sourcePage: row.source_page,
    lastNotificationAttemptAt: row.last_notification_attempt_at,
    events: (events ?? []).map((event) => ({
      id: event.id,
      type: event.event_type,
      actorType: event.actor_type,
      actorId: event.actor_id,
      fromStatus: event.from_status,
      toStatus: event.to_status,
      note: event.note,
      metadata: event.metadata,
      createdAt: event.created_at,
    })),
  }
}

export async function changeEnquiryStatus(
  reference: string,
  from: EnquiryStatus,
  to: EnquiryStatus,
  actorId: string,
  note: string | null,
) {
  const { client } = getSupabaseServerConnection()
  const { data, error } = await client.rpc('change_enquiry_status', {
    p_reference: reference,
    p_from_status: from,
    p_to_status: to,
    p_actor_id: actorId,
    p_note: note,
  })
  if (error) throw new Error('Enquiry status could not be changed')
  return data as 'updated' | 'conflict' | 'not_found'
}

export async function addEnquiryNote(reference: string, actorId: string, note: string) {
  const { client } = getSupabaseServerConnection()
  const { data, error } = await client.rpc('add_enquiry_note', {
    p_reference: reference,
    p_actor_id: actorId,
    p_note: note,
  })
  if (error) throw new Error('Enquiry note could not be added')
  return data as 'added' | 'not_found'
}
