import { HomePage } from '@/components/home-page'
import { travelCatalog } from '@/lib/travel-service'

export default async function Page() {
  const [destinationItems, packageItems, articles, packages] = await Promise.all([
    travelCatalog.listDestinationCards(),
    travelCatalog.listPackageCards(),
    travelCatalog.listArticles(),
    travelCatalog.listPackages(),
  ])
  return <HomePage destinationItems={destinationItems} packageItems={packageItems} articles={articles} packages={packages} />
}
