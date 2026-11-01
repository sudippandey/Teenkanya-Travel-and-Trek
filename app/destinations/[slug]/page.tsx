import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DestinationDetail } from '@/components/page-templates'
import { travelCatalog } from '@/lib/travel-service'

export async function generateStaticParams() {
  return (await travelCatalog.listDestinations()).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const destination = await travelCatalog.getDestination(slug)
  return destination ? {
    title: destination.title,
    description: destination.description,
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: { title: `${destination.title} | Teenkanya Travel & Trek`, description: destination.description, images: [destination.heroImage.src] },
  } : { title: 'Destination not found' }
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [destination, packageItems, treks] = await Promise.all([
    travelCatalog.getDestination(slug),
    travelCatalog.listPackageCards(),
    travelCatalog.listTreks(),
  ])
  if (!destination) notFound()

  const relatedPackages = new Set(destination.relatedPackageSlugs)
  const relatedTrekSlugs = new Set(destination.relatedTrekSlugs)

  return <DestinationDetail
    destination={destination}
    relatedPackages={packageItems.filter((item) => relatedPackages.has(item.slug))}
    relatedTreks={treks.filter((item) => relatedTrekSlugs.has(item.slug))}
  />
}
