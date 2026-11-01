import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { getWhatsAppHref } from '../lib/contact-links.ts'

test('WhatsApp links use the public Teenkanya number and safely encode message text', () => {
  assert.equal(getWhatsAppHref(), 'https://wa.me/9779851248173')
  assert.equal(
    getWhatsAppHref('Hello Teenkanya, I need help.'),
    'https://wa.me/9779851248173?text=Hello%20Teenkanya%2C%20I%20need%20help.'
  )
})

test('every service enquiry slug has a matching contact-form prefill', () => {
  const data = readFileSync(new URL('../lib/travel-data.ts', import.meta.url), 'utf8')
  const form = readFileSync(new URL('../components/contact-form.tsx', import.meta.url), 'utf8')
  const services = data.slice(data.indexOf('export const services'), data.indexOf('export const galleryImages'))
  const serviceSlugs = [...services.matchAll(/slug: '([^']+)'/g)].map((match) => match[1])
  assert.equal(serviceSlugs.length, 6)
  for (const slug of serviceSlugs) {
    assert.match(form, new RegExp(`\\b${slug.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}: '`), `Missing prefill for ${slug}`)
  }
})
