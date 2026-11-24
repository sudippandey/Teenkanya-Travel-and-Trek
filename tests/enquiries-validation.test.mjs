import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateEnquiry } from '../lib/enquiries/validation.ts'

const validEmailEnquiry = {
  submissionId: '123e4567-e89b-42d3-a456-426614174000',
  fullName: '  Ana  Rai ',
  email: 'ANA@example.net',
  phone: '',
  countryOfResidence: 'Nepal',
  preferredContactChannel: 'email',
  interest: 'trekking',
  message: 'We would like to plan a trek in October.',
  travelStartDate: '2027-10-10',
  datesFlexible: true,
  travellerCount: '2',
}

test('normalizes a valid enquiry for storage', () => {
  const result = validateEnquiry(validEmailEnquiry)

  assert.equal(result.success, true)
  if (!result.success) return

  assert.equal(result.value.fullName, 'Ana Rai')
  assert.equal(result.value.email, 'ana@example.net')
  assert.equal(result.value.travellerCount, 2)
  assert.equal(result.value.travelStartDate, '2027-10-10')
})

test('validates and preserves package-specific trip context in the existing message field', () => {
  const result = validateEnquiry({
    ...validEmailEnquiry,
    travelFocus: 'international_tour',
    destinationOrPackage: 'Japan autumn trip',
    budgetRange: 'USD 2,000 per person',
    additionalRequirements: 'Vegetarian meals and step-free accommodation.',
  })

  assert.equal(result.success, true)
  if (!result.success) return

  assert.match(result.value.message, /Travel focus: International tour/u)
  assert.match(result.value.message, /Destination or package: Japan autumn trip/u)
  assert.match(result.value.message, /Indicative budget: USD 2,000 per person/u)
  assert.match(result.value.message, /Additional requirements: Vegetarian meals/u)
  assert.match(result.value.message, /Message\nWe would like to plan a trek in October\./u)
})

test('rejects invalid travel focus and oversized planning details', () => {
  const result = validateEnquiry({
    ...validEmailEnquiry,
    travelFocus: 'unknown',
    destinationOrPackage: 'x'.repeat(161),
    budgetRange: 'x'.repeat(101),
    additionalRequirements: 'x'.repeat(1001),
  })

  assert.equal(result.success, false)
  if (result.success) return

  assert.match(result.fieldErrors.travelFocus, /valid travel focus/u)
  assert.match(result.fieldErrors.destinationOrPackage, /under 160 characters/u)
  assert.match(result.fieldErrors.budgetRange, /under 100 characters/u)
  assert.match(result.fieldErrors.additionalRequirements, /under 1,000 characters/u)
})

test('accepts a phone-only enquiry when phone is the preferred contact', () => {
  const result = validateEnquiry({
    ...validEmailEnquiry,
    email: '',
    phone: '+977 9851248173',
    preferredContactChannel: 'whatsapp',
  })

  assert.equal(result.success, true)
  if (!result.success) return

  assert.equal(result.value.email, null)
  assert.equal(result.value.phone, '+977 9851248173')
})

test('rejects submissions without a valid contact method', () => {
  const result = validateEnquiry({ ...validEmailEnquiry, email: '', phone: '' })

  assert.equal(result.success, false)
  if (result.success) return

  assert.match(result.fieldErrors.contact, /email address or phone number/u)
})

test('rejects invalid email and phone values', () => {
  const result = validateEnquiry({
    ...validEmailEnquiry,
    email: 'not-an-email',
    phone: 'call me maybe',
    preferredContactChannel: 'phone',
  })

  assert.equal(result.success, false)
  if (result.success) return

  assert.match(result.fieldErrors.email, /valid email/u)
  assert.match(result.fieldErrors.phone, /valid phone/u)
})

test('rejects invalid travel dates and traveller counts', () => {
  const result = validateEnquiry({
    ...validEmailEnquiry,
    travelStartDate: '2027-02-30',
    travellerCount: '0',
  })

  assert.equal(result.success, false)
  if (result.success) return

  assert.match(result.fieldErrors.travelStartDate, /valid travel date/u)
  assert.match(result.fieldErrors.travellerCount, /whole number/u)
})
