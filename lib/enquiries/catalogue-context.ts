import { destinations, packages, treks } from '@/lib/travel-data'
import { createEnquiryCatalogueResolver } from './catalogue-context-core.ts'

const resolver = createEnquiryCatalogueResolver({ destinations, packages, treks })

export const getEnquiryCatalogueContext = resolver.getEnquiryCatalogueContext
export const resolveEnquiryCatalogueQuery = resolver.resolveEnquiryCatalogueQuery

export type {
  CatalogueQuery,
  EnquiryCatalogueContext,
} from './catalogue-context-core.ts'
