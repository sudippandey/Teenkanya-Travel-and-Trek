import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateEnquiry } from '../lib/enquiries/validation.ts'

const validEmailEnquiry = {
  submissionId: '123e4567-e89b-42d3-a456-426614174000',
  fullName: '  Ana  Rai ',
  email: 'ANA@example.net',
  phone: '',
  interest: 'trekking',
  message: 'We would like to plan a trek in October.',
}

test('normalizes the simplified enquiry for storage', () => {
  const result = validateEnquiry(validEmailEnquiry)

  assert.equal(result.success, true)
  if (!result.success) return

  assert.equal(result.value.fullName, 'Ana Rai')
  assert.equal(result.value.email, 'ana@example.net')
  assert.equal(result.value.phone, null)
  assert.equal(result.value.preferredContactChannel, 'email')
  assert.equal(result.value.travelStartDate, null)
  assert.equal(result.value.datesFlexible, false)
  assert.equal(result.value.travellerCount, null)
})

test('accepts a phone-only enquiry and retains tour context in the optional message', () => {
  const result = validateEnquiry({
    ...validEmailEnquiry,
    email: '',
    phone: '+977 9851248173',
    message: 'I am interested in the Everest Base Camp Trek.',
  })

  assert.equal(result.success, true)
  if (!result.success) return

  assert.equal(result.value.email, null)
  assert.equal(result.value.phone, '+977 9851248173')
  assert.equal(result.value.preferredContactChannel, 'phone')
  assert.match(result.value.message, /Everest Base Camp Trek/u)
})

test('allows an empty optional message', () => {
  const result = validateEnquiry({ ...validEmailEnquiry, message: '' })

  assert.equal(result.success, true)
  if (!result.success) return
  assert.equal(result.value.message, '')
})

test('requires at least one reply method', () => {
  const result = validateEnquiry({ ...validEmailEnquiry, email: '', phone: '' })

  assert.equal(result.success, false)
  if (result.success) return
  assert.match(result.fieldErrors.contact, /phone number or email address/u)
})

test('validates contact details, required interest and message length', () => {
  const result = validateEnquiry({
    ...validEmailEnquiry,
    email: 'not-an-email',
    phone: 'call me maybe',
    interest: 'unknown',
    message: 'x'.repeat(3001),
  })

  assert.equal(result.success, false)
  if (result.success) return

  assert.match(result.fieldErrors.email, /valid email/u)
  assert.match(result.fieldErrors.phone, /valid phone/u)
  assert.match(result.fieldErrors.interest, /what you are planning/u)
  assert.match(result.fieldErrors.message, /under 3,000 characters/u)
})
