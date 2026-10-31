import { HomePage } from '@/components/home-page'
import type { Metadata } from 'next'
import { travelCatalog } from '@/lib/travel-service'
import { destinationPhotos } from '@/lib/travel-data'

export const metadata: Metadata = {
  title: 'Thoughtful Journeys Through Nepal',
  description: 'Plan thoughtful holidays, cultural journeys and Himalayan treks through Nepal with a Kathmandu-based travel team.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Teenkanya Travel & Trek | Thoughtful Journeys Through Nepal', description: 'Thoughtful journeys through Nepal, from Kathmandu Valley to the high Himalaya.', images: [destinationPhotos['everest-region'][0].src] },
}

export default async function Page() {
  const [destinationItems, packageItems, articles, packages] = await Promise.all([
    travelCatalog.listDestinationCards(),
    travelCatalog.listPackageCards(),
    travelCatalog.listArticles(),
    travelCatalog.listPackages(),
  ])
  return <HomePage destinationItems={destinationItems} packageItems={packageItems} articles={articles} packages={packages} />
}
