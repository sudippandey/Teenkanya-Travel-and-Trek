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

test('accepts a catalogue selection only when the lookup confirms it exists', () => {
  const input = { ...validEmailEnquiry, catalogueItemType: 'trek', catalogueItemSlug: 'everest-base-camp' }
  const result = validateEnquiry(input, { isKnownCatalogueItem: (type, slug) => type === 'trek' && slug === 'everest-base-camp' })

  assert.equal(result.success, true)
  if (!result.success) return
  assert.equal(result.value.catalogueItemType, 'trek')
  assert.equal(result.value.catalogueItemSlug, 'everest-base-camp')
})

test('rejects unknown catalogue selections instead of silently dropping trip context', () => {
  const input = { ...validEmailEnquiry, catalogueItemType: 'trek', catalogueItemSlug: 'not-a-real-trek' }
  const result = validateEnquiry(input, { isKnownCatalogueItem: () => false })

  assert.equal(result.success, false)
  if (result.success) return
  assert.match(result.fieldErrors.catalogueItem, /no longer available/u)
})

test('rejects catalogue selections when no authoritative catalogue lookup is available', () => {
  const input = { ...validEmailEnquiry, catalogueItemType: 'package', catalogueItemSlug: 'annapurna-circuit' }
  const result = validateEnquiry(input)

  assert.equal(result.success, false)
  if (result.success) return
  assert.ok(result.fieldErrors.catalogueItem)
})
