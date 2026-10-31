'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import type { BrowseItem } from '@/lib/travel-data'
import { DestinationCard, PackageCard } from '@/components/travel-cards'
import { ScrollReveal } from '@/components/scroll-reveal'

type CollectionKind = 'destinations' | 'packages' | 'treks'

export function CollectionBrowser({ kind, items, filters }: { kind: CollectionKind; items: BrowseItem[]; filters: string[] }) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [placeFilter, setPlaceFilter] = useState('All places')
  const [durationFilter, setDurationFilter] = useState('Any duration')
  const places = useMemo(() => Array.from(new Set(items.map((item) => item.location))), [items])
  const filtered = useMemo(() => items.filter((item) => {
    const matchesQuery = `${item.title} ${item.location} ${item.description} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase())
    const matchesCategory = activeFilter === 'All' || item.category === activeFilter
    const matchesPlace = placeFilter === 'All places' || item.location === placeFilter
    const days = Number(item.duration?.match(/\d+/)?.[0] ?? 0)
    const matchesDuration = kind === 'destinations' || durationFilter === 'Any duration' || (durationFilter === '1–5 days' && days <= 5) || (durationFilter === '6–10 days' && days >= 6 && days <= 10) || (durationFilter === '11+ days' && days >= 11)
    return matchesQuery && matchesCategory && matchesPlace && matchesDuration
  }), [items, query, activeFilter, placeFilter, durationFilter, kind])

  return <div className="collection-browser">
    <div className="browser-controls">
      <label className="search-control"><Search aria-hidden="true" /><span className="sr-only">Search {kind}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${kind}...`} /></label>
      <span className="results-count"><SlidersHorizontal aria-hidden="true" />{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</span>
    </div>
    <div className="collection-selects">
      <label>{kind === 'packages' ? 'Destination' : kind === 'treks' ? 'Region' : 'Region'}<select aria-label={kind === 'packages' ? 'Filter by destination' : 'Filter by region'} value={placeFilter} onChange={(event) => setPlaceFilter(event.target.value)}><option>All places</option>{places.map((place) => <option key={place}>{place}</option>)}</select></label>
      {kind !== 'destinations' && <label>Duration<select aria-label="Filter by duration" value={durationFilter} onChange={(event) => setDurationFilter(event.target.value)}><option>Any duration</option><option>1–5 days</option><option>6–10 days</option><option>11+ days</option></select></label>}
    </div>
    <div className="filter-row" aria-label={`Filter ${kind}`}>
      {['All', ...filters].map((filter) => <button type="button" key={filter} className={`filter-chip ${activeFilter === filter ? 'is-active' : ''}`} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
    </div>
    {filtered.length ? <div className={kind === 'destinations' ? 'destination-grid' : 'package-grid'}>
      {filtered.map((item, index) => <ScrollReveal key={item.slug} delay={(index % 4) * 70}>{kind === 'destinations' ? <DestinationCard item={item} /> : <PackageCard item={item} />}</ScrollReveal>)}
    </div> : <div className="empty-state"><span className="eyebrow">NO MATCHES JUST YET</span><h3>Try a different search.</h3><p>Adjust your filters to explore more of Nepal.</p><button className="text-link" type="button" onClick={() => { setQuery(''); setActiveFilter('All'); setPlaceFilter('All places'); setDurationFilter('Any duration') }}>Clear filters</button></div>}
  </div>
}
