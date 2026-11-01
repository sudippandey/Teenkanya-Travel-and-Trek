import Link from 'next/link'
import { ArrowUpRight, Clock3, MapPin, ShieldCheck, Mountain, CalendarDays, BedDouble } from 'lucide-react'
import { JourneyCta, PageHero } from '@/components/page-templates'
import type { BrowseItem, DestinationImage } from '@/lib/travel-data'
import type { TrekProfile } from '@/lib/trekking-data'

type Trek = BrowseItem & TrekProfile

function toHeroImage(trek: BrowseItem): DestinationImage {
  return {
    src: trek.image,
    alt: trek.imageAlt,
    downloadUrl: '',
    caption: trek.title,
    credit: trek.imageCredit,
    license: trek.imageLicense,
    sourceUrl: trek.imageSource,
  }
}

export function TrekDetail({ trek }: { trek: Trek }) {
  return (
    <>
      <PageHero
        eyebrow={`${trek.category} · Trekking`}
        title={trek.title}
        description={trek.description}
        image={toHeroImage(trek)}
        crumbs={[{ label: 'Trekking', href: '/trekking' }]}
      />

      <section className="section section-soft">
        <div className="container detail-layout">
          <div className="detail-main">
            <section>
              <span className="eyebrow">Route briefing</span>
              <h2>Understand the trail before you choose it.</h2>
              <p>{trek.routeSummary}</p>
              {trek.routeStages.length > 0 && (
                <ol className="trek-route-stages">
                  {trek.routeStages.map((stage, index) => (
                    <li key={stage.name}>
                      <span className="trek-stage-number">{String(index + 1).padStart(2, '0')}</span>
                      <div><h3>{stage.name}</h3><p>{stage.detail}</p></div>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section>
              <h2>Permits and entry requirements</h2>
              <ul className="detail-list">{trek.permits.map((permit) => <li key={permit}>{permit}</li>)}</ul>
              <p className="trek-disclaimer">Permit rules and fees can change. We will confirm the current requirements for your nationality and route before travel.</p>
            </section>

            <section>
              <h2>Accommodation on the trail</h2>
              <ul className="detail-list">{trek.accommodation.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>

            <section>
              <h2>Preparation checklist</h2>
              <ul className="detail-list">{trek.preparation.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>

            <section>
              <h2>Altitude and safety</h2>
              <p>{trek.altitudeNote}</p>
              <ul className="detail-list">{trek.safetyNotes.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>

            <section>
              <h2>Sources and further guidance</h2>
              <p>These official references support the general route and planning notes. Final itineraries and current local conditions should be confirmed before departure.</p>
              <div className="content-source-links">
                {trek.contentSources.map((source) => (
                  <a href={source.url} key={source.url} target="_blank" rel="noreferrer">
                    {source.label} <ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          </div>

          <aside className="detail-aside">
            <span className="eyebrow">Trek overview</span>
            <h3>{trek.title}</h3>
            <div className="detail-facts">
              <span><MapPin aria-hidden="true" />Region <strong>{trek.location}</strong></span>
              <span><Clock3 aria-hidden="true" />Sample duration <strong>{trek.duration}</strong></span>
              <span><Mountain aria-hidden="true" />Indicative level <strong>{trek.category}</strong></span>
              <span><CalendarDays aria-hidden="true" />Typical season <strong>{trek.bestSeason}</strong></span>
              <span><BedDouble aria-hidden="true" />Accommodation <strong>{trek.accommodation.length ? 'Teahouses / lodges; confirm route' : 'Confirm with team'}</strong></span>
              <span><ShieldCheck aria-hidden="true" />Price <strong>On request</strong></span>
            </div>
            <p>Duration and difficulty are starting points, not a confirmed departure. We will discuss the route, overnight stops, services and current conditions with you.</p>
            <Link className="button button-dark" href={`/contact?trek=${encodeURIComponent(trek.slug)}`}>
              Enquire about this trek <ArrowUpRight aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      <JourneyCta title="Let’s plan a trek that matches your pace." />
    </>
  )
}
