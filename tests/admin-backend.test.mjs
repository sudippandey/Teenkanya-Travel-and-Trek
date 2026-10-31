import test from 'node:test'
import assert from 'node:assert/strict'
import { extractBearerToken, hasPermission, isStaffRole } from '../lib/admin/permissions.ts'
import { parseListQuery, parseNote, parseReference, parseStatusUpdate } from '../lib/admin/input.ts'
import { canTransitionEnquiryStatus, isEnquiryStatus } from '../lib/enquiries/status.ts'
import { buildFingerprintMaterial, computeContentFingerprint } from '../lib/enquiries/fingerprint.ts'

test('agents cannot retry notifications but admins can', () => {
  assert.equal(hasPermission('agent', 'enquiries:read'), true)
  assert.equal(hasPermission('agent', 'enquiries:retry_notification'), false)
  assert.equal(hasPermission('admin', 'enquiries:retry_notification'), true)
  assert.equal(isStaffRole('owner'), false)
})

test('bearer tokens are extracted strictly', () => {
  assert.equal(extractBearerToken('Bearer abc.def-ghi'), 'abc.def-ghi')
  assert.equal(extractBearerToken('Basic abc'), null)
  assert.equal(extractBearerToken('Bearer '), null)
  assert.equal(extractBearerToken(null), null)
  assert.equal(extractBearerToken(`Bearer ${'a'.repeat(5000)}`), null)
})

test('status transitions follow the workflow', () => {
  assert.equal(canTransitionEnquiryStatus('new', 'contacted'), true)
  assert.equal(canTransitionEnquiryStatus('new', 'confirmed'), false)
  assert.equal(canTransitionEnquiryStatus('confirmed', 'new'), false)
  assert.equal(isEnquiryStatus('archived'), false)
})

test('status updates reject invalid transitions and oversized notes', () => {
  assert.equal(parseStatusUpdate({ status: 'contacted', expectedStatus: 'new' }).ok, true)
  const invalid = parseStatusUpdate({ status: 'confirmed', expectedStatus: 'new' })
  assert.equal(invalid.ok, false)
  assert.ok(!invalid.ok && invalid.fieldErrors.status)
  assert.equal(parseStatusUpdate({ status: 'contacted', expectedStatus: 'new', note: 'x'.repeat(2001) }).ok, false)
  assert.equal(parseStatusUpdate(null).ok, false)
})

test('notes are normalized and bounded', () => {
  const parsed = parseNote({ note: '  Called back\u0000 \r\n ' })
  assert.deepEqual(parsed, { ok: true, value: { note: 'Called back' } })
  assert.equal(parseNote({ note: '   ' }).ok, false)
  assert.equal(parseNote({ note: 42 }).ok, false)
})

test('references and list filters are validated', () => {
  assert.equal(parseReference('ttt-261101-0123456789abcdef'), 'TTT-261101-0123456789ABCDEF')
  assert.equal(parseReference('TTT-1; drop table'), null)

  const ok = parseListQuery(new URLSearchParams('status=new&page=2&pageSize=10'))
  assert.deepEqual(ok, { ok: true, value: { status: 'new', reference: null, email: null, page: 2, pageSize: 10 } })
  const bad = parseListQuery(new URLSearchParams('status=bogus&pageSize=500&email=nope'))
  assert.equal(bad.ok, false)
  assert.deepEqual(Object.keys(!bad.ok ? bad.fieldErrors : {}).sort(), ['email', 'pageSize', 'status'])
})

test('content fingerprints ignore whitespace and case but depend on the secret', () => {
  const base = { email: 'a@b.co', phone: '+977 98-1', message: 'Hello  Everest', catalogueItemType: 'trek', catalogueItemSlug: 'ebc' }
  const variant = { ...base, phone: '+97798 1', message: ' hello everest ' }
  assert.equal(buildFingerprintMaterial(base), buildFingerprintMaterial(variant))
  assert.equal(computeContentFingerprint(base, 's1'), computeContentFingerprint(variant, 's1'))
  assert.notEqual(computeContentFingerprint(base, 's1'), computeContentFingerprint(base, 's2'))
  assert.notEqual(computeContentFingerprint(base, 's1'), computeContentFingerprint({ ...base, message: 'other' }, 's1'))
})
