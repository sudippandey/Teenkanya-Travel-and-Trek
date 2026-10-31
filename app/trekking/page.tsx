import type { Metadata } from 'next'
import { CollectionBrowser } from '@/components/collection-browser'
import { PageHero, PageIntro, JourneyCta } from '@/components/page-templates'
import { travelCatalog } from '@/lib/travel-service'
import { destinationPhotos } from '@/lib/travel-data'

export const metadata: Metadata = {
  title: 'Trekking in Nepal',
  description: 'Explore sample trekking routes in Everest, Annapurna and Langtang with Teenkanya Travel & Trek.',
  alternates: { canonical: '/trekking' },
  openGraph: { title: 'Trekking in Nepal | Teenkanya Travel & Trek', description: 'Discover walking routes across the Himalaya, from forest trails to high mountain country.', images: [destinationPhotos['annapurna-region'][0].src] },
}

export default async function TrekkingPage() {
  const treks = await travelCatalog.listTreks()
  return <><PageHero eyebrow="TREKKING & HIKING" title="Find your feet in the Himalaya." description="From forest trails to high mountain country, discover walking routes that can be shaped around your pace." image={destinationPhotos['annapurna-region'][0]} /><section className="section"><div className="container"><PageIntro label="TRAIL NOTES" title="A route is only the beginning.">Difficulty and duration are indicative. The right route depends on season, experience, health and pace—talk with the team before making plans.</PageIntro><CollectionBrowser kind="treks" items={treks} filters={['Moderate', 'Challenging']} /></div></section><section className="section section-soft"><div className="container"><PageIntro label="BEFORE YOU SET OUT" title="Good preparation makes a difference.">We can help you think through route options and practical details. Current conditions and local guidance should always be confirmed before departure.</PageIntro><div className="value-grid"><article className="value-card"><span>01</span><h3>Choose your pace</h3><p>Discuss previous trekking experience, daily walking time and altitude comfort.</p></article><article className="value-card"><span>02</span><h3>Allow flexibility</h3><p>Weather and local conditions can change. A flexible plan helps protect the experience.</p></article><article className="value-card"><span>03</span><h3>Ask questions</h3><p>Get current information on preparation, equipment and route logistics.</p></article><article className="value-card"><span>04</span><h3>Travel responsibly</h3><p>Follow local guidance and respect the communities and environments along the trail.</p></article></div></div></section><JourneyCta title="Let’s find the right trail for you." /></>
}
