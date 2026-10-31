import { createHmac } from 'node:crypto'

export interface FingerprintInput {
  email: string | null
  phone: string | null
  message: string
  catalogueItemType: string | null
  catalogueItemSlug: string | null
}

export function buildFingerprintMaterial(input: FingerprintInput) {
  const phoneDigits = input.phone?.replace(/\D/gu, '') ?? ''
  const message = input.message.toLowerCase().replace(/\s+/gu, ' ').trim()
  return [
    'v1',
    input.email ?? '',
    phoneDigits,
    input.catalogueItemType ?? '',
    input.catalogueItemSlug ?? '',
    message,
  ].join('\u001f')
}

export function computeContentFingerprint(input: FingerprintInput, secret: string) {
  return createHmac('sha256', secret)
    .update(`enquiry-fingerprint:${buildFingerprintMaterial(input)}`)
    .digest('hex')
}
