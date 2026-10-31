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

export interface TravelCatalogService {
  listDestinations(): Promise<Destination[]>
  listDestinationCards(): Promise<BrowseItem[]>
  getDestination(slug: string): Promise<Destination | undefined>
  listPackages(): Promise<TravelPackage[]>
  listPackageCards(): Promise<BrowseItem[]>
  getPackage(slug: string): Promise<TravelPackage | undefined>
  listTreks(): Promise<BrowseItem[]>
  getTrek(slug: string): Promise<BrowseItem | undefined>
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
  async listTreks() { return treks },
  async getTrek(slug) { return treks.find((item) => item.slug === slug) },
  async listArticles() { return articles },
  async getArticle(slug) { return articles.find((item) => item.slug === slug) },
}
