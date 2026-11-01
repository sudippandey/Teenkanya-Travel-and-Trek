import type { CatalogueItemType } from './validation'
import { getEnquiryCatalogueContext } from './catalogue-context'

export function isKnownCatalogueItem(type: CatalogueItemType, slug: string) {
  return getEnquiryCatalogueContext(type, slug) !== null
}
