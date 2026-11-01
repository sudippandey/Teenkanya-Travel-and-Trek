import assert from 'node:assert/strict'
import test from 'node:test'
import { processEnquirySubmission } from '../lib/enquiries/submission-workflow.ts'

const validSubmission = {
  submissionId: 'fb84a221-11f8-4bc1-b57e-0e37f45f4458',
  fullName: 'Asha Rai',
  email: 'asha@example.com',
  phone: null,
  countryOfResidence: 'Nepal',
  preferredContactChannel: 'email',
  interest: 'trekking',
  message: 'I would like details about a trekking trip.',
  travelStartDate: '2027-04-12',
  datesFlexible: true,
  travellerCount: 2,
}

function createDependencies({
  notificationSuccess = true,
  savedStatus = 'pending',
  persistedSubmissionId = validSubmission.submissionId,
} = {}) {
  const calls = { persist: 0, notify: 0, updates: [] }
  const dependencies = {
    async persist(enquiry) {
      calls.persist += 1
      return {
        status: 'saved',
        reference: 'TTT-270101-0123456789ABCDEF',
        notificationStatus: savedStatus,
        shouldNotify: savedStatus !== 'sent',
        duplicate: savedStatus === 'sent' || persistedSubmissionId !== validSubmission.submissionId,
        deliverySnapshot: {
          ...enquiry,
          submissionId: persistedSubmissionId,
          reference: 'TTT-270101-0123456789ABCDEF',
        },
      }
    },
    async notify() {
      calls.notify += 1
      return { success: notificationSuccess }
    },
    async updateNotificationStatus(submissionId, status) {
      calls.updates.push({ submissionId, status })
    },
  }
  return { calls, dependencies }
}

test('a provider-confirmed enquiry is marked sent and receives a reference', async () => {
  const { calls, dependencies } = createDependencies()
  const result = await processEnquirySubmission(
    validSubmission,
    'client-hash',
    '/contact',
    dependencies,
  )

  assert.equal(result.status, 'sent')
  assert.equal(result.reference, 'TTT-270101-0123456789ABCDEF')
  assert.deepEqual(calls.updates, [{ submissionId: validSubmission.submissionId, status: 'sent' }])
  assert.equal(calls.notify, 1)
})

test('invalid enquiry data is rejected before persistence or notification', async () => {
  const { calls, dependencies } = createDependencies()
  const result = await processEnquirySubmission(
    { ...validSubmission, email: 'not-an-email' },
    'client-hash',
    '/contact',
    dependencies,
  )

  assert.equal(result.status, 'invalid')
  assert.ok(result.fieldErrors.email)
  assert.equal(calls.persist, 0)
  assert.equal(calls.notify, 0)
  assert.deepEqual(calls.updates, [])
})

test('provider failure keeps the saved reference and marks notification failed', async () => {
  const { calls, dependencies } = createDependencies({ notificationSuccess: false })
  const result = await processEnquirySubmission(
    validSubmission,
    'client-hash',
    '/contact',
    dependencies,
  )

  assert.equal(result.status, 'notification_failed')
  assert.equal(result.reference, 'TTT-270101-0123456789ABCDEF')
  assert.deepEqual(calls.updates, [{ submissionId: validSubmission.submissionId, status: 'failed' }])
})

test('an already-notified duplicate does not send another email', async () => {
  const { calls, dependencies } = createDependencies({ savedStatus: 'sent' })
  const result = await processEnquirySubmission(
    validSubmission,
    'client-hash',
    '/contact',
    dependencies,
  )

  assert.equal(result.status, 'sent')
  assert.equal(result.duplicate, true)
  assert.equal(calls.notify, 0)
  assert.deepEqual(calls.updates, [])
})

test('content duplicate notification success updates the canonical persisted submission ID', async () => {
  const canonicalId = '123e4567-e89b-42d3-a456-426614174001'
  const { calls, dependencies } = createDependencies({ persistedSubmissionId: canonicalId })
  const result = await processEnquirySubmission(validSubmission, 'client-hash', '/contact', dependencies)

  assert.equal(result.status, 'sent')
  assert.equal(result.duplicate, true)
  assert.deepEqual(calls.updates, [{ submissionId: canonicalId, status: 'sent' }])
})

test('content duplicate notification failure updates the canonical persisted submission ID', async () => {
  const canonicalId = '123e4567-e89b-42d3-a456-426614174001'
  const { calls, dependencies } = createDependencies({
    notificationSuccess: false,
    persistedSubmissionId: canonicalId,
  })
  const result = await processEnquirySubmission(validSubmission, 'client-hash', '/contact', dependencies)

  assert.equal(result.status, 'notification_failed')
  assert.deepEqual(calls.updates, [{ submissionId: canonicalId, status: 'failed' }])
})
