import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PackageDetail } from '@/components/page-templates'
import { travelCatalog } from '@/lib/travel-service'

export async function generateStaticParams() { return (await travelCatalog.listPackages()).map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = await travelCatalog.getPackage(slug)
  return item ? {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/tours/${item.slug}` },
    openGraph: { title: `${item.title} | Teenkanya Travel & Trek`, description: item.description, images: [item.image] },
  } : { title: 'Journey not found' }
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const travelPackage = await travelCatalog.getPackage(slug)
  if (!travelPackage) notFound()
  return <PackageDetail travelPackage={travelPackage} />
}
