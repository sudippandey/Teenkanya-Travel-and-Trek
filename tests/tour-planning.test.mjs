import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../lib/travel-data.ts', import.meta.url), 'utf8')
const packageSection = source.slice(source.indexOf('export const packages'), source.indexOf('export const treks'))
const destinationSection = source.slice(source.indexOf('export const destinations'), source.indexOf('export const packages'))
const trekSection = source.slice(source.indexOf('export const treks'), source.indexOf('export const destinationItems'))
const packageSlugs = [
  'kathmandu-pokhara-discovery',
  'annapurna-foothills-walk',
  'everest-trail-highlights',
  'wild-nepal-chitwan',
]

function packageBlock(slug) {
  const start = packageSection.indexOf(`slug: '${slug}'`)
  assert.notEqual(start, -1, `Missing package ${slug}`)
  const end = packageSection.indexOf('\n  },', start)
  assert.notEqual(end, -1, `Could not find end of package ${slug}`)
  return packageSection.slice(start, end)
}

test('every sample tour has explicit related links and pre-quote planning notes', () => {
  for (const slug of packageSlugs) {
    const block = packageBlock(slug)
    assert.match(block, /relatedDestinationSlugs: \[/)
    assert.match(block, /relatedTrekSlugs: \[/)
    assert.ok((block.match(/question:/g) ?? []).length >= 3, `${slug} should answer common planning questions`)
    assert.ok((block.match(/^      '/gm) ?? []).length >= 4, `${slug} should include a pre-quote checklist`)
    for (const [, ref] of (block.match(/relatedDestinationSlugs: \[([^\]]*)\]/)?.[1] ?? '').matchAll(/'([^']+)'/g)) {
      assert.match(destinationSection, new RegExp(`slug: '${ref}'`), `Unknown destination ${ref} on ${slug}`)
    }
    for (const [, ref] of (block.match(/relatedTrekSlugs: \[([^\]]*)\]/)?.[1] ?? '').matchAll(/'([^']+)'/g)) {
      assert.match(trekSection, new RegExp(`slug: '${ref}'`), `Unknown trek ${ref} on ${slug}`)
    }
  }
})
