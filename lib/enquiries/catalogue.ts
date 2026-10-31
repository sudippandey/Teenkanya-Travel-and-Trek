import { destinations, packages, treks } from '@/lib/travel-data'
import type { CatalogueItemType } from './validation'

const catalogueSlugs: Record<CatalogueItemType, ReadonlySet<string>> = {
  destination: new Set(destinations.map((item) => item.slug)),
  package: new Set(packages.map((item) => item.slug)),
  trek: new Set(treks.map((item) => item.slug)),
}

export function isKnownCatalogueItem(type: CatalogueItemType, slug: string) {
  return catalogueSlugs[type].has(slug)
}
