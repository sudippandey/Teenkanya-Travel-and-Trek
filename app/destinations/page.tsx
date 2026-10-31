import type { Metadata } from 'next'
import { CollectionBrowser } from '@/components/collection-browser'
import { PageHero, PageIntro, JourneyCta } from '@/components/page-templates'
import { travelCatalog } from '@/lib/travel-service'
import { destinationPhotos } from '@/lib/travel-data'

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'Explore Nepal destinations from Kathmandu Valley and Pokhara to Everest, Annapurna, Chitwan and Mustang.',
  alternates: { canonical: '/destinations' },
  openGraph: { title: 'Nepal Destinations | Teenkanya Travel & Trek', description: 'Explore Nepal’s distinct regions, from living heritage to high Himalayan trails.', images: [destinationPhotos.kathmandu[0].src] },
}

export default async function DestinationsPage() {
  const destinationItems = await travelCatalog.listDestinationCards()
  return <><PageHero eyebrow="DESTINATIONS" title="Many places. One remarkable country." description="Explore Nepal’s regions, from living heritage and lakeside days to high Himalayan trails." image={destinationPhotos.kathmandu[0]} /><section className="section"><div className="container"><PageIntro label="CHOOSE YOUR STARTING POINT" title="Where will Nepal take you?">Explore distinct regions through location-specific guides. Access, opening hours and seasonal conditions can change, so confirm current details before you travel.</PageIntro><CollectionBrowser kind="destinations" items={destinationItems} filters={['Culture', 'Nature', 'Trekking', 'Wildlife', 'Pilgrimage']} /></div></section><JourneyCta /></>
}
