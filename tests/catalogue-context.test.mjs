import assert from 'node:assert/strict'
import test from 'node:test'
import { createEnquiryCatalogueResolver } from '../lib/enquiries/catalogue-context-core.ts'

const resolver = createEnquiryCatalogueResolver({
  destinations: [
    { slug: 'pokhara', title: 'Pokhara', category: 'Nature' },
    { slug: 'everest-region', title: 'Everest Region', category: 'Trekking' },
  ],
  packages: [
    { slug: 'kathmandu-pokhara-discovery', title: 'Kathmandu & Pokhara Discovery', category: 'Culture & nature' },
    { slug: 'annapurna-foothills-walk', title: 'Annapurna Foothills Walk', category: 'Trekking' },
  ],
  treks: [
    { slug: 'everest-trail-highlights', title: 'Everest Trail Highlights', category: 'Challenging', href: '/trekking/everest-trail-highlights' },
  ],
})

test('resolves destination context with the canonical destination route', () => {
  assert.deepEqual(resolver.getEnquiryCatalogueContext('destination', 'POKHARA'), {
    kind: 'destination',
    slug: 'pokhara',
    title: 'Pokhara',
    href: '/destinations/pokhara',
    interest: 'tour',
  })
})

test('classifies trekking destinations and packages as trekking enquiries', () => {
  assert.equal(resolver.getEnquiryCatalogueContext('destination', 'everest-region')?.interest, 'trekking')
  assert.equal(resolver.getEnquiryCatalogueContext('package', 'annapurna-foothills-walk')?.interest, 'trekking')
  assert.equal(resolver.getEnquiryCatalogueContext('package', 'kathmandu-pokhara-discovery')?.interest, 'tour')
})

test('resolves trek context using its catalogue href', () => {
  assert.deepEqual(resolver.getEnquiryCatalogueContext('trek', 'everest-trail-highlights'), {
    kind: 'trek',
    slug: 'everest-trail-highlights',
    title: 'Everest Trail Highlights',
    href: '/trekking/everest-trail-highlights',
    interest: 'trekking',
  })
})

test('query resolver prioritizes trek, then tour, then destination', () => {
  assert.equal(resolver.resolveEnquiryCatalogueQuery({
    trek: 'everest-trail-highlights',
    tour: 'kathmandu-pokhara-discovery',
    destination: 'pokhara',
  })?.kind, 'trek')
  assert.equal(resolver.resolveEnquiryCatalogueQuery({ tour: 'kathmandu-pokhara-discovery' })?.kind, 'package')
  assert.equal(resolver.resolveEnquiryCatalogueQuery({ destination: 'pokhara' })?.kind, 'destination')
})

test('rejects unknown and malformed catalogue slugs', () => {
  assert.equal(resolver.getEnquiryCatalogueContext('trek', 'not-a-real-trek'), null)
  assert.equal(resolver.getEnquiryCatalogueContext('trek', '../admin'), null)
  assert.equal(resolver.resolveEnquiryCatalogueQuery({ trek: 'unknown-trek' }), null)
})

test('uses the first value when query parameters are repeated', () => {
  assert.equal(resolver.resolveEnquiryCatalogueQuery({ tour: ['kathmandu-pokhara-discovery', 'unknown'] })?.slug, 'kathmandu-pokhara-discovery')
})
