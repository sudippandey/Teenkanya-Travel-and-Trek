import 'server-only'

import { createHmac, randomBytes } from 'node:crypto'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
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
  source_page: string | null
  notification_status: EnquiryNotificationStatus
  updated_at: string
}

const enquiryColumns = 'id,submission_id,reference,full_name,email,phone,country_of_residence,preferred_contact_channel,interest,message,travel_start_date,dates_flexible,traveller_count,source_page,notification_status,updated_at'
const notificationLeaseMs = 2 * 60 * 1000

let cachedClient: SupabaseClient | null = null
let cachedSecret: string | null = null

function getSupabaseConnection() {
  if (cachedClient && cachedSecret) return { client: cachedClient, secret: cachedSecret }

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !secret) throw new Error('Supabase server credentials are not configured')

  const timedFetch: typeof fetch = (input, init) => {
    const timeoutSignal = AbortSignal.timeout(2_000)
    const signal = init?.signal ? AbortSignal.any([init.signal, timeoutSignal]) : timeoutSignal
    return fetch(input, { ...init, signal })
  }

  cachedClient = createClient(url, secret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: { fetch: timedFetch },
  })
  cachedSecret = secret

  return { client: cachedClient, secret }
}

function createReference() {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/gu, '')
  return `TTT-${datePart}-${randomBytes(8).toString('hex').toUpperCase()}`
}

function toPersistedEnquiry(
  row: EnquiryRow,
  shouldNotify: boolean,
  duplicate: boolean,
): PersistedEnquiry {
  const deliverySnapshot: EnquiryDeliverySnapshot = {
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
    sourcePage: row.source_page ?? '/contact',
  }

  return {
    status: 'saved',
    reference: row.reference,
    notificationStatus: row.notification_status,
    shouldNotify,
    duplicate,
    deliverySnapshot,
  }
}

async function findExistingEnquiry(client: SupabaseClient, submissionId: string) {
  const { data, error } = await client
    .from('enquiries')
    .select(enquiryColumns)
    .eq('submission_id', submissionId)
    .maybeSingle()

  if (error) throw new Error('Existing enquiry could not be retrieved')
  return data as EnquiryRow | null
}

async function resolveExistingEnquiry(
  client: SupabaseClient,
  row: EnquiryRow,
): Promise<PersistedEnquiry> {
  const pendingIsStale = row.notification_status === 'pending'
    && Date.parse(row.updated_at) < Date.now() - notificationLeaseMs
  const canClaim = row.notification_status === 'failed'
    || row.notification_status === 'not_configured'
    || pendingIsStale

  if (!canClaim) return toPersistedEnquiry(row, false, true)

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

  const latest = await findExistingEnquiry(client, row.submission_id)
  if (!latest) throw new Error('Existing enquiry could not be retrieved')
  return toPersistedEnquiry(latest, false, true)
}

export async function saveEnquiry(
  enquiry: EnquiryForStorage,
  clientIdentifier: string,
): Promise<EnquiryPersistenceResult> {
  const { client, secret } = getSupabaseConnection()
  const keyHash = createHmac('sha256', secret).update(clientIdentifier).digest('hex')
  const { data: allowed, error: rateLimitError } = await client.rpc('consume_enquiry_rate_limit', {
    p_key_hash: keyHash,
    p_limit: 5,
    p_window_seconds: 900,
  })

  if (rateLimitError) throw new Error('Enquiry rate limit could not be checked')
  if (allowed !== true) return { status: 'rate_limited' }

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
        source_page: enquiry.sourcePage,
        notification_status: 'pending',
      })
      .select(enquiryColumns)
      .single()

    if (!error && data) return toPersistedEnquiry(data as EnquiryRow, true, false)

    if (error?.code === '23505') {
      const existing = await findExistingEnquiry(client, enquiry.submissionId)
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
  const { client } = getSupabaseConnection()
  const { data, error } = await client
    .from('enquiries')
    .update({ notification_status: status, updated_at: new Date().toISOString() })
    .eq('submission_id', submissionId)
    .eq('notification_status', 'pending')
    .select('id')
    .maybeSingle()

  if (error || !data) throw new Error('Enquiry notification status could not be updated')
}
