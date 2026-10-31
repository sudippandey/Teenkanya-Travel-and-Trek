import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createWeb3FormsNotifier } from '../lib/enquiries/web3forms.ts'

const enquiry = {
  submissionId: 'fb84a221-11f8-4bc1-b57e-0e37f45f4458',
  reference: 'TTT-270101-0123456789ABCDEF',
  fullName: 'Asha Rai',
  email: 'asha@example.com',
  phone: '+977 9800000000',
  countryOfResidence: 'Nepal',
  preferredContactChannel: 'email',
  interest: 'trekking',
  message: 'I would like details about a trekking trip.',
  travelStartDate: '2027-04-12',
  datesFlexible: true,
  travellerCount: 2,
  sourcePage: '/contact',
}

test('Web3Forms success requires an HTTP success and success=true response', async () => {
  let requestUrl
  let requestInit
  const notify = createWeb3FormsNotifier({
    accessKey: 'test-access-key',
    fetcher: async (url, init) => {
      requestUrl = url
      requestInit = init
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    },
  })

  const result = await notify(enquiry)
  const payload = JSON.parse(requestInit.body)

  assert.deepEqual(result, { success: true })
  assert.equal(requestUrl, 'https://api.web3forms.com/submit')
  assert.equal(requestInit.method, 'POST')
  assert.equal(payload.access_key, 'test-access-key')
  assert.equal(payload.ccemail, undefined)
  assert.equal(payload.to, undefined)
  assert.equal(payload.replyto, 'asha@example.com')
})

test('Web3Forms provider rejection does not report success', async () => {
  const notify = createWeb3FormsNotifier({
    accessKey: 'test-access-key',
    fetcher: async () => new Response(JSON.stringify({ success: false }), { status: 200 }),
  })

  assert.deepEqual(await notify(enquiry), { success: false, reason: 'rejected' })
})

test('missing server configuration fails closed without a network request', async () => {
  let requestCount = 0
  const notify = createWeb3FormsNotifier({
    accessKey: undefined,
    fetcher: async () => {
      requestCount += 1
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    },
  })

  assert.deepEqual(await notify(enquiry), { success: false, reason: 'configuration' })
  assert.equal(requestCount, 0)
})

test('an invalid access key is a generic provider rejection and does not escape in the result', async () => {
  const invalidAccessKey = 'synthetic-invalid-access-key'
  let requestPayload
  const notify = createWeb3FormsNotifier({
    accessKey: invalidAccessKey,
    fetcher: async (_url, init) => {
      requestPayload = JSON.parse(init.body)
      return new Response(JSON.stringify({
        success: false,
        message: `Invalid access key ${invalidAccessKey}`,
      }), { status: 401 })
    },
  })

  const result = await notify(enquiry)

  assert.equal(requestPayload.access_key, invalidAccessKey)
  assert.deepEqual(result, { success: false, reason: 'rejected' })
  assert.equal(JSON.stringify(result).includes(invalidAccessKey), false)
})

test('a provider 403 response without JSON is handled as an invalid-key rejection', async () => {
  const notify = createWeb3FormsNotifier({
    accessKey: 'synthetic-invalid-key-verification',
    fetcher: async () => new Response('Forbidden', { status: 403 }),
  })

  assert.deepEqual(await notify(enquiry), { success: false, reason: 'rejected' })
})

test('a non-success HTTP response cannot report a successful submission', async () => {
  const notify = createWeb3FormsNotifier({
    accessKey: 'synthetic-test-key',
    fetcher: async () => new Response(JSON.stringify({ success: true }), { status: 503 }),
  })

  assert.deepEqual(await notify(enquiry), { success: false, reason: 'rejected' })
})

test('malformed provider JSON is treated as a generic rejection', async () => {
  const notify = createWeb3FormsNotifier({
    accessKey: 'synthetic-test-key',
    fetcher: async () => new Response('not-json', { status: 200 }),
  })

  assert.deepEqual(await notify(enquiry), { success: false, reason: 'rejected' })
})

test('network failures return unavailable without exposing transport details', async () => {
  const syntheticKey = 'synthetic-network-test-key'
  const notify = createWeb3FormsNotifier({
    accessKey: syntheticKey,
    fetcher: async () => {
      throw new TypeError(`Network failure for ${syntheticKey}`)
    },
  })

  const result = await notify(enquiry)

  assert.deepEqual(result, { success: false, reason: 'unavailable' })
  assert.equal(JSON.stringify(result).includes(syntheticKey), false)
})

test('the client contact form does not reference server credentials or the provider endpoint', async () => {
  const source = await readFile(new URL('../components/contact-form.tsx', import.meta.url), 'utf8')

  assert.doesNotMatch(source, /WEB3FORMS_ACCESS_KEY|access_key|api\.web3forms\.com|process\.env/)
})
