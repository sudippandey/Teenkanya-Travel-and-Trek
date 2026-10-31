import type { Metadata } from 'next'
import { CollectionBrowser } from '@/components/collection-browser'
import { PageHero, PageIntro, JourneyCta } from '@/components/page-templates'
import { travelCatalog } from '@/lib/travel-service'
import { destinationPhotos } from '@/lib/travel-data'

export const metadata: Metadata = {
  title: 'Tours & Packages',
  description: 'Browse sample Nepal tours and flexible itineraries from Teenkanya Travel & Trek. Pricing and availability are discussed on enquiry.',
  alternates: { canonical: '/tours' },
  openGraph: { title: 'Tours & Packages | Teenkanya Travel & Trek', description: 'Flexible sample journeys through Nepal, shaped around your plans.', images: [destinationPhotos.pokhara[1].src] },
}

export default async function ToursPage() {
  const packageItems = await travelCatalog.listPackageCards()
  return <><PageHero eyebrow="TOURS & PACKAGES" title="A few good ways to begin." description="Explore sample journeys through Nepal. Every itinerary is an idea to discuss, not a fixed departure or live offer." image={destinationPhotos.pokhara[1]} /><section className="section"><div className="container"><PageIntro label="FLEXIBLE JOURNEY IDEAS" title="Find a journey that feels right.">Search the sample collection by destination or activity. Prices and availability are not listed; contact the team to discuss a route and the details.</PageIntro><CollectionBrowser kind="packages" items={packageItems} filters={['Culture & nature', 'Trekking', 'Wildlife']} /></div></section><JourneyCta title="Not quite what you’re looking for?" /></>
}
