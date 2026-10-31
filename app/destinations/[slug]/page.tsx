import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DestinationDetail } from '@/components/page-templates'
import { travelCatalog } from '@/lib/travel-service'

export async function generateStaticParams() { return (await travelCatalog.listDestinations()).map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const destination = await travelCatalog.getDestination(slug)
  return destination ? { title: destination.title, description: destination.description } : { title: 'Destination not found' }
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const destination = await travelCatalog.getDestination(slug)
  if (!destination) notFound()
  return <DestinationDetail destination={destination} />
}
