import type { Metadata } from 'next'
import { PageHero, PageIntro, JourneyCta } from '@/components/page-templates'
import { ArticleCard } from '@/components/travel-cards'
import { ScrollReveal } from '@/components/scroll-reveal'
import { travelCatalog } from '@/lib/travel-service'
import { destinationPhotos } from '@/lib/travel-data'

export const metadata: Metadata = {
  title: 'Travel Journal',
  description: 'Read destination guides, trekking notes and practical travel tips for Nepal.',
  alternates: { canonical: '/blog' },
  openGraph: { title: 'Travel Journal | Teenkanya Travel & Trek', description: 'Practical notes for planning a thoughtful journey through Nepal.', images: [destinationPhotos.mustang[1].src] },
}

export default async function BlogPage() {
  const articles = await travelCatalog.listArticles()
  return <><PageHero eyebrow="TRAVEL JOURNAL" title="Notes for the road ahead." description="Thoughtful guides and practical notes to help you prepare for a journey through Nepal." image={destinationPhotos.mustang[1]} /><section className="section"><div className="container"><PageIntro label="THE FIELD NOTES" title="A little context before you go.">These general planning notes are a starting point. Confirm current access, safety and seasonal details with official sources and local operators before travel.</PageIntro><div className="article-grid">{articles.map((article, index) => <ScrollReveal key={article.slug} delay={index * 80}><ArticleCard article={article} /></ScrollReveal>)}</div></div></section><JourneyCta title="Planning a trip and need a local perspective?" /></>
}
