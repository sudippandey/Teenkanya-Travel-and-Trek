'use client'

import { useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import type { TravelPackage } from '@/lib/travel-data'

const destinations = ['Any destination', 'Kathmandu', 'Pokhara', 'Everest', 'Annapurna', 'Chitwan']
const categories = ['Any experience', 'Culture & nature', 'Trekking', 'Wildlife']
const durations = ['Any duration', '1–5 days', '6–10 days', '11+ days']

export function JourneyFinder({ packages }: { packages: TravelPackage[] }) {
  const [destination, setDestination] = useState(destinations[0])
  const [category, setCategory] = useState(categories[0])
  const [duration, setDuration] = useState(durations[0])
  const [searched, setSearched] = useState(false)
  const results = useMemo(() => packages.filter((item) => {
    const place = `${item.destination} ${item.title}`.toLowerCase()
    const matchDestination = destination === destinations[0] || place.includes(destination.toLowerCase())
    const matchCategory = category === categories[0] || item.category === category
    const matchDuration = duration === durations[0] || (duration === '1–5 days' && item.days <= 5) || (duration === '6–10 days' && item.days >= 6 && item.days <= 10) || (duration === '11+ days' && item.days >= 11)
    return matchDestination && matchCategory && matchDuration
  }), [destination, category, duration])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearched(true)
  }

  return <div className="discovery-panel-wrap">
    <form className="discovery-panel" onSubmit={handleSubmit}>
      <label>Where would you like to go?<span><select value={destination} onChange={(event) => setDestination(event.target.value)} aria-label="Choose a destination">{destinations.map((item) => <option key={item}>{item}</option>)}</select></span></label>
      <label>Choose your experience<span><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Choose a travel category">{categories.map((item) => <option key={item}>{item}</option>)}</select></span></label>
      <label>How long do you have?<span><select value={duration} onChange={(event) => setDuration(event.target.value)} aria-label="Choose a trip duration">{durations.map((item) => <option key={item}>{item}</option>)}</select></span></label>
      <button className="discovery-submit" type="submit"><Search aria-hidden="true" /> Find a journey</button>
    </form>
    {searched && <div className="finder-results" aria-live="polite"><div className="finder-results-head"><span>{results.length ? `${results.length} journeys to explore` : 'No exact matches found'}</span><button type="button" onClick={() => setSearched(false)} aria-label="Close search results">Close</button></div>{results.length ? <div className="finder-result-list">{results.map((item) => <Link href={`/tours/${item.slug}`} key={item.slug}><span><strong>{item.title}</strong><small>{item.destination} · {item.duration}</small></span><ArrowUpRight aria-hidden="true" /></Link>)}</div> : <p>Try another combination or <Link href="/contact">tell us what you have in mind</Link>.</p>}</div>}
  </div>
}
