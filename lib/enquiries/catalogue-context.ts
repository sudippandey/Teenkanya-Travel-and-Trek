import { destinations, packages, treks } from '@/lib/travel-data'
import { createEnquiryCatalogueResolver } from './catalogue-context-core'

export type { CatalogueKind, CatalogueQuery, EnquiryCatalogueContext } from './catalogue-context-core'

const resolver = createEnquiryCatalogueResolver({ destinations, packages, treks })

export const getEnquiryCatalogueContext = resolver.getEnquiryCatalogueContext
export const resolveEnquiryCatalogueQuery = resolver.resolveEnquiryCatalogueQuery
