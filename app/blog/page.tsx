import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero, PageIntro, JourneyCta } from '@/components/page-templates'
import { travelCatalog } from '@/lib/travel-service'

export const metadata: Metadata = { title: 'Travel Journal', description: 'Read sample destination guides, trekking notes and practical travel tips for Nepal.' }

export default async function BlogPage() {
  const articles = await travelCatalog.listArticles()
  return <><PageHero eyebrow="TRAVEL JOURNAL" title="Notes for the road ahead." description="Thoughtful guides and practical notes to help you prepare for a journey through Nepal." image="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=85" /><section className="section"><div className="container"><PageIntro label="THE FIELD NOTES" title="A little context before you go.">These editable sample articles are a starting point for Teenkanya’s future travel journal, not company news or claims.</PageIntro><div className="article-grid">{articles.map((article) => <article className="article-card" key={article.slug}><Link className="article-image" href={`/blog/${article.slug}`}><img src={article.image} alt={article.title} loading="lazy" /></Link><div className="article-body"><span>{article.category} · {article.readingTime}</span><h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2><p>{article.excerpt}</p><Link className="text-link" href={`/blog/${article.slug}`}>Read the guide</Link></div></article>)}</div></div></section><JourneyCta title="Planning a trip and need a local perspective?" /></>
}
