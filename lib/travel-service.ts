import {
  articles,
  destinationItems,
  destinations,
  packageItems,
  packages,
  treks,
  type Article,
  type BrowseItem,
  type Destination,
  type TravelPackage,
} from '@/lib/travel-data'
import { trekProfiles, type TrekProfile } from '@/lib/trekking-data'

export type Trek = BrowseItem & TrekProfile

export interface TravelCatalogService {
  listDestinations(): Promise<Destination[]>
  listDestinationCards(): Promise<BrowseItem[]>
  getDestination(slug: string): Promise<Destination | undefined>
  listPackages(): Promise<TravelPackage[]>
  listPackageCards(): Promise<BrowseItem[]>
  getPackage(slug: string): Promise<TravelPackage | undefined>
  listTreks(): Promise<Trek[]>
  getTrek(slug: string): Promise<Trek | undefined>
  listArticles(): Promise<Article[]>
  getArticle(slug: string): Promise<Article | undefined>
}

// This sample-backed adapter is the single replacement point for a future API or database.
export const travelCatalog: TravelCatalogService = {
  async listDestinations() { return destinations },
  async listDestinationCards() { return destinationItems },
  async getDestination(slug) { return destinations.find((item) => item.slug === slug) },
  async listPackages() { return packages },
  async listPackageCards() { return packageItems },
  async getPackage(slug) { return packages.find((item) => item.slug === slug) },
  async listTreks() {
    return treks.flatMap((trek) => {
      const profile = trekProfiles[trek.slug]
      return profile ? [{ ...trek, ...profile }] : []
    })
  },
  async getTrek(slug) {
    const trek = treks.find((item) => item.slug === slug)
    const profile = trek ? trekProfiles[trek.slug] : undefined
    return trek && profile ? { ...trek, ...profile } : undefined
  },
  async listArticles() { return articles },
  async getArticle(slug) { return articles.find((item) => item.slug === slug) },
}
