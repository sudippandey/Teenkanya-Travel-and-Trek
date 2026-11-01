import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleDetail } from '@/components/page-templates'
import { createArticleStructuredData, serializeJsonLd } from '@/lib/article-structured-data'
import { travelCatalog } from '@/lib/travel-service'

export async function generateStaticParams() { return (await travelCatalog.listArticles()).map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await travelCatalog.getArticle(slug)
  return article ? {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: { title: `${article.title} | Teenkanya Travel & Trek`, description: article.excerpt, images: [article.image] },
  } : { title: 'Guide not found' }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await travelCatalog.getArticle(slug)
  if (!article) notFound()

  const structuredData = createArticleStructuredData(article)

  return <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
    />
    <ArticleDetail article={article} />
  </>
}
