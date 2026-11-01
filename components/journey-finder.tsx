'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import type { BrowseItem, TravelPackage } from '@/lib/travel-data'

type FinderKind = 'destination' | 'tour' | 'trek'
type FinderResult = {
  kind: FinderKind
  slug: string
  title: string
  location: string
  duration?: string
  description: string
  href: string
}

const ANY_DESTINATION = 'all'
const ANY_EXPERIENCE = 'all'
const ANY_DURATION = 'all'
const durations = [
  { value: ANY_DURATION, label: 'Any duration' },
  { value: '1-5', label: '1–5 days' },
  { value: '6-10', label: '6–10 days' },
  { value: '11+', label: '11+ days' },
]
const experiences = ['Trekking', 'Culture & nature', 'Culture', 'Nature', 'Wildlife', 'Pilgrimage']

function matchesDuration(days: number | undefined, selected: string) {
  if (selected === ANY_DURATION) return true
  if (days === undefined) return false
  if (selected === '1-5') return days <= 5
  if (selected === '6-10') return days >= 6 && days <= 10
  return days >= 11
}

function resultHref(kind: FinderKind, slug: string) {
  if (kind === 'destination') return `/destinations/${slug}`
  if (kind === 'trek') return `/trekking/${slug}`
  return `/tours/${slug}`
}

export function JourneyFinder({ packages, destinations, treks }: { packages: TravelPackage[]; destinations: BrowseItem[]; treks: BrowseItem[] }) {
  const [destination, setDestination] = useState(ANY_DESTINATION)
  const [category, setCategory] = useState(ANY_EXPERIENCE)
  const [duration, setDuration] = useState(ANY_DURATION)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const destinationValue = params.get('destination')
    const categoryValue = params.get('experience')
    const durationValue = params.get('duration')
    if (destinationValue && destinations.some((item) => item.slug === destinationValue)) setDestination(destinationValue)
    if (categoryValue && experiences.includes(categoryValue)) setCategory(categoryValue)
    if (durationValue && durations.some((item) => item.value === durationValue)) setDuration(durationValue)
    if (destinationValue || categoryValue || durationValue) setSearched(true)
  }, [destinations])

  const destinationOptions = useMemo(() => destinations.map((item) => ({ value: item.slug, label: item.title })), [destinations])

  const results = useMemo<FinderResult[]>(() => {
    const selectedDestination = destinations.find((item) => item.slug === destination)
    const placeTokens = selectedDestination
      ? [selectedDestination.slug.replaceAll('-', ' '), selectedDestination.title, selectedDestination.title.split(' ')[0]]
      : []
    const searchable = [
      ...destinations.map((item): FinderResult => ({ kind: 'destination', slug: item.slug, title: item.title, location: item.location, description: item.description, href: resultHref('destination', item.slug) })),
      ...packages.map((item): FinderResult => ({ kind: 'tour', slug: item.slug, title: item.title, location: item.destination, duration: item.duration, description: item.description, href: resultHref('tour', item.slug) })),
      ...treks.map((item): FinderResult => ({ kind: 'trek', slug: item.slug, title: item.title, location: item.location, duration: item.duration, description: item.description, href: resultHref('trek', item.slug) })),
    ]
    return searchable.filter((item) => {
      const searchableText = `${item.title} ${item.location} ${item.description} ${item.slug}`.toLowerCase()
      const matchesDestination = destination === ANY_DESTINATION || placeTokens.some((token) => searchableText.includes(token.toLowerCase()))
      const matchesCategory = category === ANY_EXPERIENCE || (category === 'Trekking' ? item.kind === 'trek' || searchableText.includes('trekking') : searchableText.toLowerCase().includes(category.toLowerCase()))
      const days = Number(item.duration?.match(/\d+/)?.[0] ?? 0) || undefined
      return matchesDestination && matchesCategory && matchesDuration(days, duration)
    })
  }, [destinations, packages, treks, destination, category, duration])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (destination !== ANY_DESTINATION) params.set('destination', destination)
    if (category !== ANY_EXPERIENCE) params.set('experience', category)
    if (duration !== ANY_DURATION) params.set('duration', duration)
    const query = params.toString()
    window.history.replaceState(null, '', query ? `${window.location.pathname}?${query}#discover` : `${window.location.pathname}#discover`)
    setSearched(true)
  }

  function clearFilters() {
    setDestination(ANY_DESTINATION)
    setCategory(ANY_EXPERIENCE)
    setDuration(ANY_DURATION)
    setSearched(false)
    window.history.replaceState(null, '', `${window.location.pathname}#discover`)
  }

  return <div className="discovery-panel-wrap">
    <form className="discovery-panel" onSubmit={handleSubmit}>
      <label>Where would you like to go?<span><select value={destination} onChange={(event) => setDestination(event.target.value)} aria-label="Choose a destination"><option value={ANY_DESTINATION}>Anywhere in Nepal</option>{destinationOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></span></label>
      <label>Choose your experience<span><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Choose a travel category"><option value={ANY_EXPERIENCE}>Any experience</option>{experiences.map((item) => <option key={item}>{item}</option>)}</select></span></label>
      <label>How long do you have?<span><select value={duration} onChange={(event) => setDuration(event.target.value)} aria-label="Choose a trip duration">{durations.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></span></label>
      <button className="discovery-submit" type="submit"><Search aria-hidden="true" /> Find a journey</button>
    </form>
    {searched && <div className="finder-results" aria-live="polite">
      <div className="finder-results-head"><span>{results.length ? `${results.length} places and journeys to explore` : 'No exact matches found'}</span><button type="button" onClick={clearFilters} aria-label="Clear journey filters">Clear filters</button></div>
      {results.length ? <div className="finder-result-list">{results.map((item) => <Link href={item.href} key={`${item.kind}-${item.slug}`}><span><strong>{item.title}</strong><small>{item.kind === 'destination' ? 'Destination' : item.kind === 'trek' ? 'Trekking route' : 'Sample journey'} · {item.location}{item.duration ? ` · ${item.duration}` : ''}</small></span><ArrowUpRight aria-hidden="true" /></Link>)}</div> : <p>Try another combination or <Link href="/contact">tell us what you have in mind</Link>.</p>}
    </div>}
  </div>
}
