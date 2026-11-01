import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TrekDetail } from '@/components/trek-detail'
import { travelCatalog } from '@/lib/travel-service'

export async function generateStaticParams() {
  return (await travelCatalog.listTreks()).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const trek = await travelCatalog.getTrek(slug)
  return trek ? {
    title: trek.title,
    description: trek.description,
    alternates: { canonical: `/trekking/${trek.slug}` },
    openGraph: { title: `${trek.title} | Teenkanya Travel & Trek`, description: trek.description, images: [trek.image] },
  } : { title: 'Trek not found' }
}

export default async function TrekPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const trek = await travelCatalog.getTrek(slug)
  if (!trek) notFound()
  return <TrekDetail trek={trek} />
}
