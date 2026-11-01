import type { MetadataRoute } from 'next'
import { articles, destinations, packages, treks } from '@/lib/travel-data'
import { siteUrl } from '@/lib/site-url'

const staticPaths = ['/', '/about', '/destinations', '/tours', '/trekking', '/services', '/blog', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
  const fixedRoutes = staticPaths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : 0.7,
  }))
  const detailRoutes = [
    ...destinations.map(({ slug }) => `/destinations/${slug}`),
    ...packages.map(({ slug }) => `/tours/${slug}`),
    ...treks.map(({ slug }) => `/trekking/${slug}`),
    ...articles.map(({ slug }) => `/blog/${slug}`),
  ].map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...fixedRoutes, ...detailRoutes]
}
