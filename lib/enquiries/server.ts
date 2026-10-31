import 'server-only'

import { createHmac, randomBytes } from 'node:crypto'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { ValidatedEnquiry } from './validation'

interface EnquiryForStorage extends ValidatedEnquiry {
  sourcePage: string
}

type SaveEnquiryResult =
  | { status: 'rate_limited' }
  | { status: 'saved'; reference: string; duplicate: boolean }

let cachedClient: SupabaseClient | null = null
let cachedSecret: string | null = null

function getSupabaseConnection() {
  if (cachedClient && cachedSecret) return { client: cachedClient, secret: cachedSecret }

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !secret) throw new Error('Supabase server credentials are not configured')

  const timedFetch: typeof fetch = (input, init) => {
    const timeoutSignal = AbortSignal.timeout(5_000)
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

export async function saveEnquiry(
  enquiry: EnquiryForStorage,
  clientIdentifier: string,
): Promise<SaveEnquiryResult> {
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
      })
      .select('reference')
      .single()

    if (!error && data) return { status: 'saved', reference: data.reference, duplicate: false }

    if (error?.code === '23505') {
      const { data: existing, error: lookupError } = await client
        .from('enquiries')
        .select('reference')
        .eq('submission_id', enquiry.submissionId)
        .maybeSingle()

      if (lookupError) throw new Error('Existing enquiry could not be retrieved')
      if (existing) return { status: 'saved', reference: existing.reference, duplicate: true }
      continue
    }

    throw new Error('Enquiry could not be saved')
  }

  throw new Error('Enquiry reference could not be generated')
}
