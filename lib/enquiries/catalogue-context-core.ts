import type { CatalogueItemType, EnquiryInterest } from './validation.ts'

export interface CatalogueEntry {
  slug: string
  title: string
  category: string
  href?: string
}

export interface EnquiryCatalogueContext {
  kind: CatalogueItemType
  slug: string
  title: string
  href: string
  interest: EnquiryInterest
}

export interface CatalogueQuery {
  trek?: string | string[] | null
  tour?: string | string[] | null
  destination?: string | string[] | null
}

function firstQueryValue(value: string | string[] | null | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value
  return typeof candidate === 'string' ? candidate.trim().toLowerCase() : ''
}

function destinationInterest(category: string): EnquiryInterest {
  return category.toLowerCase().includes('trek') ? 'trekking' : 'tour'
}

export function createEnquiryCatalogueResolver(data: {
  destinations: readonly CatalogueEntry[]
  packages: readonly CatalogueEntry[]
  treks: readonly CatalogueEntry[]
}) {
  function getEnquiryCatalogueContext(
    kind: CatalogueItemType,
    rawSlug: string,
  ): EnquiryCatalogueContext | null {
    const slug = rawSlug.trim().toLowerCase()
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)) return null

    if (kind === 'destination') {
      const destination = data.destinations.find((item) => item.slug === slug)
      if (!destination) return null
      return {
        kind,
        slug: destination.slug,
        title: destination.title,
        href: `/destinations/${destination.slug}`,
        interest: destinationInterest(destination.category),
      }
    }

    if (kind === 'package') {
      const travelPackage = data.packages.find((item) => item.slug === slug)
      if (!travelPackage) return null
      return {
        kind,
        slug: travelPackage.slug,
        title: travelPackage.title,
        href: `/tours/${travelPackage.slug}`,
        interest: destinationInterest(travelPackage.category),
      }
    }

    const trek = data.treks.find((item) => item.slug === slug)
    if (!trek) return null
    return {
      kind,
      slug: trek.slug,
      title: trek.title,
      href: trek.href ?? `/trekking/${trek.slug}`,
      interest: 'trekking',
    }
  }

  function resolveEnquiryCatalogueQuery(query: CatalogueQuery): EnquiryCatalogueContext | null {
    const trek = firstQueryValue(query.trek)
    const tour = firstQueryValue(query.tour)
    const destination = firstQueryValue(query.destination)

    if (trek) return getEnquiryCatalogueContext('trek', trek)
    if (tour) return getEnquiryCatalogueContext('package', tour)
    if (destination) return getEnquiryCatalogueContext('destination', destination)
    return null
  }

  return { getEnquiryCatalogueContext, resolveEnquiryCatalogueQuery }
}
