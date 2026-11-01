import test from 'node:test'
import assert from 'node:assert/strict'
import { trekProfiles } from '../lib/trekking-data.ts'

const expectedSlugs = [
  'everest-trail-highlights',
  'annapurna-foothills-walk',
  'langtang-valley-trail',
]

test('every public trek has a structured planning profile', () => {
  assert.deepEqual(Object.keys(trekProfiles).sort(), [...expectedSlugs].sort())
  for (const slug of expectedSlugs) {
    const profile = trekProfiles[slug]
    assert.ok(profile.routeSummary.length > 50, `${slug} should explain its route`)
    assert.ok(profile.permits.length > 0, `${slug} should explain permit checks`)
    assert.ok(profile.accommodation.length > 0, `${slug} should explain accommodation`)
    assert.ok(profile.preparation.length > 0, `${slug} should include preparation guidance`)
    assert.ok(profile.safetyNotes.length > 0, `${slug} should include safety guidance`)
    assert.ok(profile.seasonCalendar.length >= 4, `${slug} should include a four-season planning calendar`)
    assert.ok(profile.faqs.length >= 4, `${slug} should include route-specific FAQs`)
    assert.ok(profile.contentSources.length > 0, `${slug} should cite official sources`)
    for (const source of profile.contentSources) {
      assert.match(source.url, /^https:\/\//)
      assert.match(source.url, /ntb\.gov\.np|trade\.ntb\.gov\.np/)
    }
  }
})

test('an undefined operating route is not presented as a fabricated day-by-day itinerary', () => {
  assert.equal(trekProfiles['annapurna-foothills-walk'].routeStages.length, 0)
  assert.match(trekProfiles['annapurna-foothills-walk'].routeSummary, /does not yet define a single operating route/)
})

test('Langtang altitude is qualified as a route reference, not a guaranteed trek maximum', () => {
  assert.match(trekProfiles['langtang-valley-trail'].altitudeNote, /approximately 3,800 m/)
  assert.match(trekProfiles['langtang-valley-trail'].altitudeNote, /Optional walks/)
})
