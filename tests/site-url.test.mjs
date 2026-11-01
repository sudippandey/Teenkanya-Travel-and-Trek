import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveSiteUrl } from '../lib/site-url.ts'

test('uses the current Vercel production hostname as a safe fallback', () => {
  assert.equal(resolveSiteUrl(), 'https://3kanyatravel.vercel.app')
})

test('uses the configured canonical origin and normalizes a trailing slash', () => {
  assert.equal(resolveSiteUrl('https://example.com/'), 'https://example.com')
})

test('uses the deployment-specific Vercel hostname when SITE_URL is not configured', () => {
  assert.equal(resolveSiteUrl(undefined, 'teenkanya-preview.vercel.app'), 'https://teenkanya-preview.vercel.app')
})

test('allows HTTP only for local development', () => {
  assert.equal(resolveSiteUrl('http://localhost:3000'), 'http://localhost:3000')
  assert.throws(() => resolveSiteUrl('http://example.com'), /HTTPS/)
})

test('rejects a URL containing a path, query, hash or credentials', () => {
  assert.throws(() => resolveSiteUrl('https://example.com/subpath'), /site origin/)
  assert.throws(() => resolveSiteUrl('https://example.com/?preview=1'), /site origin/)
  assert.throws(() => resolveSiteUrl('https://user:pass@example.com'), /site origin/)
})

test('rejects malformed URLs', () => {
  assert.throws(() => resolveSiteUrl('not-a-url'), /valid absolute URL/)
})
