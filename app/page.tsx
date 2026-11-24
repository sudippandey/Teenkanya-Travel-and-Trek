import { HomePage } from '@/components/home-page'
import type { Metadata } from 'next'
import { travelCatalog } from '@/lib/travel-service'
import { destinationPhotos } from '@/lib/travel-data'

export const metadata: Metadata = {
  title: 'Nepal Tours, Treks & Travel Planning',
  description: 'Plan Nepal tours, treks, domestic journeys or international travel with Teenkanya, a Kathmandu-based agency serving travellers in Nepal and abroad.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Teenkanya Travel & Trek | Thoughtful Journeys Through Nepal', description: 'Thoughtful journeys through Nepal, from Kathmandu Valley to the high Himalaya.', images: [destinationPhotos['everest-region'][0].src] },
}

export default async function Page() {
  const [destinationItems, packageItems, articles, packages, treks] = await Promise.all([
    travelCatalog.listDestinationCards(),
    travelCatalog.listPackageCards(),
    travelCatalog.listArticles(),
    travelCatalog.listPackages(),
    travelCatalog.listTreks(),
  ])
  return <HomePage destinationItems={destinationItems} packageItems={packageItems} articles={articles} packages={packages} treks={treks} />
}
