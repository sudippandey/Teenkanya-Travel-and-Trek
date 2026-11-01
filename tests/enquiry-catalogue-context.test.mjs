import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createEnquiryCatalogueResolver } from '../lib/enquiries/catalogue-context-core.ts'

const resolver = createEnquiryCatalogueResolver({
  destinations: [
    { slug: 'kathmandu', title: 'Kathmandu Valley', category: 'Culture' },
    { slug: 'everest-region', title: 'Everest Region', category: 'Trekking' },
  ],
  packages: [
    { slug: 'kathmandu-pokhara-discovery', title: 'Kathmandu & Pokhara Discovery', category: 'Culture & nature' },
    { slug: 'annapurna-foothills-walk', title: 'Annapurna Foothills Walk', category: 'Trekking' },
  ],
  treks: [
    { slug: 'langtang-valley-trail', title: 'Langtang Valley Trail', href: '/trekking/langtang-valley-trail' },
  ],
})

test('resolves a destination to its canonical URL and interest', () => {
  assert.deepEqual(resolver.getEnquiryCatalogueContext('destination', 'KATHMANDU'), {
    kind: 'destination',
    catalogueItemType: 'destination',
    slug: 'kathmandu',
    title: 'Kathmandu Valley',
    href: '/destinations/kathmandu',
    interest: 'tour',
  })
})

test('maps public tour selections to the existing package database type', () => {
  assert.deepEqual(resolver.getEnquiryCatalogueContext('tour', 'kathmandu-pokhara-discovery'), {
    kind: 'tour',
    catalogueItemType: 'package',
    slug: 'kathmandu-pokhara-discovery',
    title: 'Kathmandu & Pokhara Discovery',
    href: '/tours/kathmandu-pokhara-discovery',
    interest: 'tour',
  })
})

test('maps trekking packages and trek pages to trekking interest', () => {
  assert.equal(resolver.getEnquiryCatalogueContext('tour', 'annapurna-foothills-walk')?.interest, 'trekking')
  assert.equal(resolver.getEnquiryCatalogueContext('trek', 'langtang-valley-trail')?.interest, 'trekking')
})

test('resolves query parameters in trek, tour, destination priority order', () => {
  const result = resolver.resolveEnquiryCatalogueQuery({
    destination: 'kathmandu',
    tour: 'kathmandu-pokhara-discovery',
    trek: 'langtang-valley-trail',
  })
  assert.equal(result?.kind, 'trek')
  assert.equal(result?.slug, 'langtang-valley-trail')
})

test('supports repeated query parameters by using the first value', () => {
  const result = resolver.resolveEnquiryCatalogueQuery({
    tour: ['kathmandu-pokhara-discovery', 'annapurna-foothills-walk'],
  })
  assert.equal(result?.slug, 'kathmandu-pokhara-discovery')
})

test('rejects unknown, malformed and path-like catalogue slugs', () => {
  assert.equal(resolver.getEnquiryCatalogueContext('tour', 'not-a-real-tour'), null)
  assert.equal(resolver.getEnquiryCatalogueContext('tour', '../contact'), null)
  assert.equal(resolver.getEnquiryCatalogueContext('destination', 'kathmandu?admin=true'), null)
  assert.equal(resolver.resolveEnquiryCatalogueQuery({ trek: 'unknown', tour: 'kathmandu-pokhara-discovery' }), null)
})
