import type { CatalogueItemType } from './validation'
import { getEnquiryCatalogueContext, type CatalogueKind } from './catalogue-context'

const kindByType: Record<CatalogueItemType, CatalogueKind> = {
  destination: 'destination',
  package: 'tour',
  trek: 'trek',
}

/** Compatibility adapter for the existing server-side validation contract. */
export function isKnownCatalogueItem(type: CatalogueItemType, slug: string) {
  return getEnquiryCatalogueContext(kindByType[type], slug) !== null
}
