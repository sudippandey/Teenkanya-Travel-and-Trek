import assert from 'node:assert/strict'
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
    ccEmail: 'teenkanya@example.com',
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
  assert.equal(payload.ccemail, 'teenkanya@example.com')
  assert.equal(payload.to, undefined)
  assert.equal(payload.replyto, 'asha@example.com')
})

test('Web3Forms provider rejection does not report success', async () => {
  const notify = createWeb3FormsNotifier({
    accessKey: 'test-access-key',
    ccEmail: 'teenkanya@example.com',
    fetcher: async () => new Response(JSON.stringify({ success: false }), { status: 200 }),
  })

  assert.deepEqual(await notify(enquiry), { success: false, reason: 'rejected' })
})

test('missing server configuration fails closed without a network request', async () => {
  let requestCount = 0
  const notify = createWeb3FormsNotifier({
    accessKey: undefined,
    ccEmail: 'teenkanya@example.com',
    fetcher: async () => {
      requestCount += 1
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    },
  })

  assert.deepEqual(await notify(enquiry), { success: false, reason: 'configuration' })
  assert.equal(requestCount, 0)
})
