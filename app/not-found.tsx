import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="section section-soft">
      <div className="container not-found-content">
        <span className="eyebrow">404 · PAGE NOT FOUND</span>
        <h1>Looks like this path has wandered.</h1>
        <p>The page may have moved or the link may be out of date. Find your way back to the journeys and places we can help you plan.</p>
        <div className="not-found-actions">
          <Link className="button button-dark" href="/"><ArrowLeft aria-hidden="true" /> Back to home</Link>
          <Link className="text-link" href="/contact">Ask us for help <ArrowUpRight aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  )
}
