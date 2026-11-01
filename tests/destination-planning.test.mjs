import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../lib/travel-data.ts', import.meta.url), 'utf8')
const destinationSlugs = [
  'kathmandu',
  'pokhara',
  'everest-region',
  'annapurna-region',
  'chitwan',
  'mustang',
  'langtang',
  'lumbini',
]

function blockFor(slug) {
  const start = source.indexOf(`slug: '${slug}'`)
  assert.notEqual(start, -1, `Missing destination ${slug}`)
  const end = source.indexOf('\n  },', start)
  assert.notEqual(end, -1, `Could not find end of destination ${slug}`)
  return source.slice(start, end)
}

test('every published destination has a planning map, access and permit guidance', () => {
  for (const slug of destinationSlugs) {
    const block = blockFor(slug)
    assert.match(block, /mapQuery: '.+Nepal'/)
    assert.match(block, /accessNotes: '.{40,}'/)
    assert.match(block, /permitNotes: '.{40,}'/)
    assert.match(block, /planningFaqs: \[/)
    assert.ok((block.match(/question:/g) ?? []).length >= 3, `${slug} should have at least three planning FAQs`)
  }
})

test('destination related catalogue references point to existing package and trek slugs', () => {
  const packageSection = source.slice(source.indexOf('export const packages'), source.indexOf('export const treks'))
  const trekSection = source.slice(source.indexOf('export const treks'), source.indexOf('export const destinationItems'))
  for (const slug of destinationSlugs) {
    const block = blockFor(slug)
    const packageRefs = block.match(/relatedPackageSlugs: \[([^\]]*)\]/)?.[1] ?? ''
    const trekRefs = block.match(/relatedTrekSlugs: \[([^\]]*)\]/)?.[1] ?? ''
    for (const [, ref] of packageRefs.matchAll(/'([^']+)'/g)) {
      assert.match(packageSection, new RegExp(`slug: '${ref}'`), `Unknown related package ${ref} on ${slug}`)
    }
    for (const [, ref] of trekRefs.matchAll(/'([^']+)'/g)) {
      assert.match(trekSection, new RegExp(`slug: '${ref}'`), `Unknown related trek ${ref} on ${slug}`)
    }
  }
})
