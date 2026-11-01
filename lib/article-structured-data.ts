export type StructuredArticle = {
  slug: string
  title: string
  excerpt: string
  category: string
  image: string
  content: string[]
}

export function createArticleStructuredData(article: StructuredArticle, siteUrl = 'https://3kanyatravel.vercel.app') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: new URL(article.image, siteUrl).toString(),
    articleSection: article.category,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': new URL(`/blog/${article.slug}`, siteUrl).toString(),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Teenkanya Travel & Trek',
    },
    inLanguage: 'en',
    isAccessibleForFree: true,
    wordCount: article.content.join(' ').trim().split(/\s+/).filter(Boolean).length,
  }
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}
