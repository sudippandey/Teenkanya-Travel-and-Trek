import type { CatalogueItemType, EnquiryInterest } from './validation'

export type CatalogueKind = 'destination' | 'tour' | 'trek'

export interface EnquiryCatalogueContext {
  kind: CatalogueKind
  /** Canonical database value: tours are stored as packages. */
  catalogueItemType: CatalogueItemType
  slug: string
  title: string
  href: string
  interest: Extract<EnquiryInterest, 'tour' | 'trekking'>
}

export interface CatalogueRecords {
  destinations: readonly { slug: string; title: string; category: string }[]
  packages: readonly { slug: string; title: string; category: string }[]
  treks: readonly { slug: string; title: string; href: string }[]
}

export type CatalogueQuery = Record<string, string | string[] | undefined>

function firstQueryValue(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value
  return typeof candidate === 'string' ? candidate.trim() : ''
}

function destinationInterest(category: string): 'tour' | 'trekking' {
  return category.toLowerCase().includes('trek') ? 'trekking' : 'tour'
}

export function createEnquiryCatalogueResolver(records: CatalogueRecords) {
  function getEnquiryCatalogueContext(kind: CatalogueKind, value: string): EnquiryCatalogueContext | null {
    const normalized = value.trim().toLowerCase()
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(normalized)) return null

    if (kind === 'destination') {
      const destination = records.destinations.find((item) => item.slug === normalized)
      if (!destination) return null
      return {
        kind,
        catalogueItemType: 'destination',
        slug: destination.slug,
        title: destination.title,
        href: `/destinations/${destination.slug}`,
        interest: destinationInterest(destination.category),
      }
    }

    if (kind === 'tour') {
      const travelPackage = records.packages.find((item) => item.slug === normalized)
      if (!travelPackage) return null
      return {
        kind,
        catalogueItemType: 'package',
        slug: travelPackage.slug,
        title: travelPackage.title,
        href: `/tours/${travelPackage.slug}`,
        interest: destinationInterest(travelPackage.category),
      }
    }

    const trek = records.treks.find((item) => item.slug === normalized)
    if (!trek) return null
    return {
      kind,
      catalogueItemType: 'trek',
      slug: trek.slug,
      title: trek.title,
      href: trek.href,
      interest: 'trekking',
    }
  }

  function resolveEnquiryCatalogueQuery(query: CatalogueQuery): EnquiryCatalogueContext | null {
    const trek = firstQueryValue(query.trek)
    const tour = firstQueryValue(query.tour)
    const destination = firstQueryValue(query.destination)

    if (trek) return getEnquiryCatalogueContext('trek', trek)
    if (tour) return getEnquiryCatalogueContext('tour', tour)
    if (destination) return getEnquiryCatalogueContext('destination', destination)
    return null
  }

  return { getEnquiryCatalogueContext, resolveEnquiryCatalogueQuery }
}
