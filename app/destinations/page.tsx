import type { Metadata } from 'next'
import { CollectionBrowser } from '@/components/collection-browser'
import { PageHero, PageIntro, JourneyCta } from '@/components/page-templates'
import { travelCatalog } from '@/lib/travel-service'

export const metadata: Metadata = { title: 'Destinations', description: 'Explore Nepal destinations from Kathmandu Valley and Pokhara to Everest, Annapurna, Chitwan and Mustang.' }

export default async function DestinationsPage() {
  const destinationItems = await travelCatalog.listDestinationCards()
  return <><PageHero eyebrow="DESTINATIONS" title="Many places. One remarkable country." description="Explore Nepal’s regions, from living heritage and lakeside days to high Himalayan trails." image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85" /><section className="section"><div className="container"><PageIntro label="CHOOSE YOUR STARTING POINT" title="Where will Nepal take you?">Use the filters to find a region or experience. These destination guides are sample content and can be expanded as your travel plans take shape.</PageIntro><CollectionBrowser kind="destinations" items={destinationItems} filters={['Culture', 'Nature', 'Trekking', 'Wildlife', 'Pilgrimage']} /></div></section><JourneyCta /></>
}
