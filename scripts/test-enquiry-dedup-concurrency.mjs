import assert from 'node:assert/strict'
import { randomBytes, randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for a disposable local Supabase project.')
}
if (!/localhost|127\.0\.0\.1/u.test(new URL(supabaseUrl).hostname)
  && process.env.ALLOW_NONLOCAL_DEDUP_TEST !== 'true') {
  throw new Error('Safety stop: this test only runs against localhost unless ALLOW_NONLOCAL_DEDUP_TEST=true is explicitly set.')
}

const client = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const fingerprint = randomBytes(32).toString('hex')
const submissionIds = [randomUUID(), randomUUID()]

function params(submissionId, suffix) {
  return {
    p_submission_id: submissionId,
    p_reference: `TTT-TEST-${randomBytes(8).toString('hex').toUpperCase()}`,
    p_full_name: 'Concurrent Deduplication Test',
    p_email: 'dedup-concurrency-test@example.invalid',
    p_phone: null,
    p_country_of_residence: 'Nepal',
    p_preferred_contact_channel: 'email',
    p_interest: 'trekking',
    p_message: 'Automated concurrent enquiry deduplication regression test.',
    p_travel_start_date: null,
    p_dates_flexible: true,
    p_traveller_count: 2,
    p_catalogue_item_type: null,
    p_catalogue_item_slug: null,
    p_special_requirements: null,
    p_content_fingerprint: fingerprint,
    p_source_page: `/test/dedup-${suffix}`,
  }
}

let testError
try {
  const responses = await Promise.all(submissionIds.map((id, index) =>
    client.rpc('save_enquiry_with_content_dedup', params(id, index)),
  ))

  for (const response of responses) {
    if (response.error) throw response.error
    assert.equal(typeof response.data?.duplicate, 'boolean', 'RPC returns a duplicate flag')
    assert.ok(response.data?.row?.id, 'RPC returns the canonical persisted row')
  }

  const duplicateFlags = responses.map((response) => response.data.duplicate)
  assert.equal(duplicateFlags.filter((duplicate) => !duplicate).length, 1,
    'exactly one concurrent request inserts a new enquiry')
  assert.equal(duplicateFlags.filter(Boolean).length, 1,
    'the competing request is suppressed as a content duplicate')
  assert.equal(responses[0].data.row.id, responses[1].data.row.id,
    'both requests resolve to the same canonical enquiry')

  const { count, error } = await client
    .from('enquiries')
    .select('id', { count: 'exact', head: true })
    .eq('content_fingerprint', fingerprint)

  if (error) throw error
  assert.equal(count, 1, 'only one database row exists for the fingerprint')
  console.log('PASS: concurrent content deduplication persisted exactly one enquiry.')
} catch (error) {
  testError = error
} finally {
  const { error } = await client.from('enquiries').delete().eq('content_fingerprint', fingerprint)
  if (error) {
    console.error('Cleanup failed for test fingerprint:', fingerprint, error.message)
    testError ??= error
  }
}

if (testError) throw testError
