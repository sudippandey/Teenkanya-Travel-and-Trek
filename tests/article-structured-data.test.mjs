import test from 'node:test'
import assert from 'node:assert/strict'
import { createArticleStructuredData, serializeJsonLd } from '../lib/article-structured-data.ts'

const article = {
  slug: 'first-time-in-nepal',
  title: 'A thoughtful first journey through Nepal',
  excerpt: 'A practical introduction to planning a visit.',
  category: 'Travel guide',
  image: '/images/nepal.jpg',
  content: ['Plan with care.', 'Leave room for the unexpected.'],
}

test('article structured data includes accurate editorial fields and absolute URLs', () => {
  const data = createArticleStructuredData(article, 'https://example.com')
  assert.equal(data['@context'], 'https://schema.org')
  assert.equal(data['@type'], 'BlogPosting')
  assert.equal(data.headline, article.title)
  assert.equal(data.articleSection, article.category)
  assert.equal(data.image, 'https://example.com/images/nepal.jpg')
  assert.equal(data.mainEntityOfPage['@id'], 'https://example.com/blog/first-time-in-nepal')
  assert.equal(data.publisher.name, 'Teenkanya Travel & Trek')
  assert.equal(data.wordCount, 8)
  assert.equal('datePublished' in data, false, 'descriptive editorial labels must not be presented as publication dates')
})

test('JSON-LD serialization escapes markup-significant characters', () => {
  const serialized = serializeJsonLd({ headline: '</script><script>alert(1)</script>', note: 'A & B' })
  assert.equal(serialized.includes('</script>'), false)
  assert.equal(serialized.includes('<script>'), false)
  assert.match(serialized, /\\u003c/)
  assert.match(serialized, /\\u0026/)
  assert.deepEqual(JSON.parse(serialized), { headline: '</script><script>alert(1)</script>', note: 'A & B' })
})
