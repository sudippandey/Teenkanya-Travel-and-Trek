import 'server-only'

import { createHmac, randomBytes } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseServerConnection } from '@/lib/supabase/server-client'
import { logEvent } from '@/lib/observability/log'
import { computeContentFingerprint } from './fingerprint'
import type { ValidatedEnquiry } from './validation'
import type {
  EnquiryDeliverySnapshot,
  EnquiryNotificationStatus,
  EnquiryPersistenceResult,
  PersistedEnquiry,
} from './submission-workflow'

interface EnquiryForStorage extends ValidatedEnquiry {
  sourcePage: string
}

interface EnquiryRow {
  id: string
  submission_id: string
  reference: string
  full_name: string
  email: string | null
  phone: string | null
  country_of_residence: string | null
  preferred_contact_channel: EnquiryDeliverySnapshot['preferredContactChannel']
  interest: EnquiryDeliverySnapshot['interest']
  message: string
  travel_start_date: string | null
  dates_flexible: boolean
  traveller_count: number | null
  catalogue_item_type: EnquiryDeliverySnapshot['catalogueItemType']
  catalogue_item_slug: string | null
  special_requirements: string | null
  source_page: string | null
  notification_status: EnquiryNotificationStatus
  updated_at: string
}

const enquiryColumns = 'id,submission_id,reference,full_name,email,phone,country_of_residence,preferred_contact_channel,interest,message,travel_start_date,dates_flexible,traveller_count,catalogue_item_type,catalogue_item_slug,special_requirements,source_page,notification_status,updated_at'
const notificationLeaseMs = 2 * 60 * 1000
const duplicateWindowMs = 24 * 60 * 60 * 1000

export const publicRateLimit = { limit: 5, windowSeconds: 900 } as const

function createReference() {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/gu, '')
  return `TTT-${datePart}-${randomBytes(8).toString('hex').toUpperCase()}`
}

function toDeliverySnapshot(row: EnquiryRow): EnquiryDeliverySnapshot {
  return {
    submissionId: row.submission_id,
    reference: row.reference,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    countryOfResidence: row.country_of_residence,
    preferredContactChannel: row.preferred_contact_channel,
    interest: row.interest,
    message: row.message,
    travelStartDate: row.travel_start_date,
    datesFlexible: row.dates_flexible,
    travellerCount: row.traveller_count,
    catalogueItemType: row.catalogue_item_type,
    catalogueItemSlug: row.catalogue_item_slug,
    specialRequirements: row.special_requirements,
    sourcePage: row.source_page ?? '/contact',
  }
}

function toPersistedEnquiry(row: EnquiryRow, shouldNotify: boolean, duplicate: boolean): PersistedEnquiry {
  return {
    status: 'saved',
    reference: row.reference,
    notificationStatus: row.notification_status,
    shouldNotify,
    duplicate,
    deliverySnapshot: toDeliverySnapshot(row),
  }
}

async function recordEvent(
  client: SupabaseClient,
  enquiryId: string,
  event: { eventType: string; actorType: 'system' | 'customer' | 'staff'; actorId?: string | null; metadata?: Record<string, unknown> },
) {
  const { error } = await client.from('enquiry_events').insert({
    enquiry_id: enquiryId,
    event_type: event.eventType,
    actor_type: event.actorType,
    actor_id: event.actorId ?? null,
    metadata: event.metadata ?? {},
  })
  if (error) logEvent('warn', 'enquiry.audit_event_failed', { eventType: event.eventType })
}

async function findBy(client: SupabaseClient, column: 'submission_id' | 'reference', value: string) {
  const { data, error } = await client
    .from('enquiries')
    .select(enquiryColumns)
    .eq(column, value)
    .maybeSingle()

  if (error) throw new Error('Existing enquiry could not be retrieved')
  return data as EnquiryRow | null
}

async function findRecentContentDuplicate(client: SupabaseClient, fingerprint: string, submissionId: string) {
  const { data, error } = await client
    .from('enquiries')
    .select(enquiryColumns)
    .eq('content_fingerprint', fingerprint)
    .neq('submission_id', submissionId)
    .gte('created_at', new Date(Date.now() - duplicateWindowMs).toISOString())
    .neq('status', 'spam')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error('Duplicate enquiry check failed')
  return data as EnquiryRow | null
}

function isNotificationClaimable(row: EnquiryRow) {
  const pendingIsStale = row.notification_status === 'pending'
    && Date.parse(row.updated_at) < Date.now() - notificationLeaseMs
  return row.notification_status === 'failed'
    || row.notification_status === 'not_configured'
    || pendingIsStale
}

async function resolveExistingEnquiry(client: SupabaseClient, row: EnquiryRow): Promise<PersistedEnquiry> {
  if (!isNotificationClaimable(row)) return toPersistedEnquiry(row, false, true)

  const { data: claimed, error } = await client
    .from('enquiries')
    .update({ notification_status: 'pending', updated_at: new Date().toISOString() })
    .eq('id', row.id)
    .eq('notification_status', row.notification_status)
    .eq('updated_at', row.updated_at)
    .select(enquiryColumns)
    .maybeSingle()

  if (error) throw new Error('Enquiry notification could not be claimed')
  if (claimed) return toPersistedEnquiry(claimed as EnquiryRow, true, true)

  const latest = await findBy(client, 'submission_id', row.submission_id)
  if (!latest) throw new Error('Existing enquiry could not be retrieved')
  return toPersistedEnquiry(latest, false, true)
}

export async function saveEnquiry(
  enquiry: EnquiryForStorage,
  clientIdentifier: string,
): Promise<EnquiryPersistenceResult> {
  const { client, secret } = getSupabaseServerConnection()
  const keyHash = createHmac('sha256', secret).update(clientIdentifier).digest('hex')
  const { data: allowed, error: rateLimitError } = await client.rpc('consume_enquiry_rate_limit', {
    p_key_hash: keyHash,
    p_limit: publicRateLimit.limit,
    p_window_seconds: publicRateLimit.windowSeconds,
  })

  if (rateLimitError) throw new Error('Enquiry rate limit could not be checked')
  if (allowed !== true) return { status: 'rate_limited' }

  const contentFingerprint = computeContentFingerprint(enquiry, secret)
  const contentDuplicate = await findRecentContentDuplicate(client, contentFingerprint, enquiry.submissionId)
  if (contentDuplicate) {
    await recordEvent(client, contentDuplicate.id, { eventType: 'duplicate_suppressed', actorType: 'customer' })
    logEvent('info', 'enquiry.duplicate_suppressed', { reference: contentDuplicate.reference })
    return resolveExistingEnquiry(client, contentDuplicate)
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const reference = createReference()
    const { data, error } = await client
      .from('enquiries')
      .insert({
        submission_id: enquiry.submissionId,
        reference,
        full_name: enquiry.fullName,
        email: enquiry.email,
        phone: enquiry.phone,
        country_of_residence: enquiry.countryOfResidence,
        preferred_contact_channel: enquiry.preferredContactChannel,
        interest: enquiry.interest,
        message: enquiry.message,
        travel_start_date: enquiry.travelStartDate,
        dates_flexible: enquiry.datesFlexible,
        traveller_count: enquiry.travellerCount,
        catalogue_item_type: enquiry.catalogueItemType,
        catalogue_item_slug: enquiry.catalogueItemSlug,
        special_requirements: enquiry.specialRequirements,
        content_fingerprint: contentFingerprint,
        source_page: enquiry.sourcePage,
        notification_status: 'pending',
      })
      .select(enquiryColumns)
      .single()

    if (!error && data) return toPersistedEnquiry(data as EnquiryRow, true, false)

    if (error?.code === '23505') {
      const existing = await findBy(client, 'submission_id', enquiry.submissionId)
      if (existing) return resolveExistingEnquiry(client, existing)
      continue
    }

    throw new Error('Enquiry could not be saved')
  }

  throw new Error('Enquiry reference could not be generated')
}

export async function updateEnquiryNotificationStatus(
  submissionId: string,
  status: 'sent' | 'failed',
) {
  const { client } = getSupabaseServerConnection()
  const { data, error } = await client
    .from('enquiries')
    .update({ notification_status: status, updated_at: new Date().toISOString() })
    .eq('submission_id', submissionId)
    .eq('notification_status', 'pending')
    .select('id')
    .maybeSingle()

  if (error || !data) throw new Error('Enquiry notification status could not be updated')
}

export type NotificationRetryClaim =
  | { status: 'not_found' }
  | { status: 'already_sent' }
  | { status: 'in_progress' }
  | { status: 'claimed'; snapshot: EnquiryDeliverySnapshot }

export async function claimNotificationRetry(reference: string, staffUserId: string): Promise<NotificationRetryClaim> {
  const { client } = getSupabaseServerConnection()
  const row = await findBy(client, 'reference', reference)
  if (!row) return { status: 'not_found' }
  if (row.notification_status === 'sent') return { status: 'already_sent' }

  await recordEvent(client, row.id, {
    eventType: 'notification_retry_requested',
    actorType: 'staff',
    actorId: staffUserId,
    metadata: { from: row.notification_status },
  })

  const resolved = await resolveExistingEnquiry(client, row)
  if (!resolved.shouldNotify) {
    return resolved.notificationStatus === 'sent' ? { status: 'already_sent' } : { status: 'in_progress' }
  }
  return { status: 'claimed', snapshot: resolved.deliverySnapshot }
}
