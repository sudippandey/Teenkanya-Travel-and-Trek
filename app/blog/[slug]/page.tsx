import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleDetail } from '@/components/page-templates'
import { travelCatalog } from '@/lib/travel-service'

export async function generateStaticParams() { return (await travelCatalog.listArticles()).map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await travelCatalog.getArticle(slug)
  return article ? { title: article.title, description: article.excerpt } : { title: 'Guide not found' }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await travelCatalog.getArticle(slug)
  if (!article) notFound()
  return <ArticleDetail article={article} />
}
