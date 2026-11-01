import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Clock3, MapPin } from 'lucide-react'
import { PhotoCredit } from '@/components/photo-credit'
import { TravelGallery } from '@/components/travel-gallery'
import { DestinationHero } from '@/components/cinematic/DestinationHero';
import { DestinationCard, PackageCard } from '@/components/travel-cards'
import type { Article, BrowseItem, Destination, DestinationImage, TravelPackage } from '@/lib/travel-data'

export function PageHero({ eyebrow, title, description, image, crumbs = [] }: { eyebrow: string; title: string; description: string; image: DestinationImage; crumbs?: { label: string; href: string }[] }) {
  return (
    <section className="page-hero">
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" quality={85} />
      <div className="page-hero-content">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          {crumbs.map((item) => <span className="breadcrumb-item" key={item.href}><Link href={item.href}>{item.label}</Link><span aria-hidden="true">/</span></span>)}
          <span aria-current="page">{eyebrow}</span>
        </nav>
        <span className="hero-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="page-hero-credit"><PhotoCredit credit={image.credit} license={image.license} sourceUrl={image.sourceUrl} /></div>
      </div>
    </section>
  )
}

export function PageIntro({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return <div className="page-intro"><span className="eyebrow">{label}</span><h2>{title}</h2><p>{children}</p></div>
}

export function JourneyCta({ title = 'Your journey can start with a conversation.' }: { title?: string }) {
  return <section className="section"><div className="container"><div className="cta-band"><div><span className="eyebrow">Let&apos;s plan together</span><h2>{title}</h2></div><Link className="button button-dark" href="/contact">Make an enquiry <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
}

export function DestinationDetail({ destination, relatedPackages = [], relatedTreks = [] }: { destination: Destination; relatedPackages?: BrowseItem[]; relatedTreks?: BrowseItem[] }) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.mapQuery)}`
  const destinationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.title,
    description: destination.description,
    image: destination.gallery.map((image) => image.src),
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: destination.planningFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationJsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }} />
      <DestinationHero destination={destination} image={destination.heroImage} />

      <section className="section destination-gallery-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">A closer look</span><h2>Explore <em>{destination.title}.</em></h2></div>
            <p>Photographs are location-specific and credited to their photographers. Open an image to view the caption and licence.</p>
          </div>
          <TravelGallery images={destination.gallery} label={`${destination.title} photo gallery`} />
        </div>
      </section>

      <section className="section section-soft">
        <div className="container detail-layout">
          <div className="detail-main">
            <section>
              <span className="eyebrow">Get to know the place</span>
              <h2>A region to experience at your own pace.</h2>
              <p>{destination.overview}</p>
            </section>
            <section>
              <h2>Places to explore</h2>
              <div className="attraction-grid">
                {destination.attractions.map((attraction) => (
                  <article className="attraction-card" key={attraction.name}>
                    <div className="attraction-image"><Image src={attraction.image.src} alt={attraction.image.alt} fill sizes="(max-width: 520px) 100vw, (max-width: 780px) 50vw, 33vw" loading="lazy" /><PhotoCredit credit={attraction.image.credit} license={attraction.image.license} sourceUrl={attraction.image.sourceUrl} /></div>
                    <div className="attraction-body"><h3>{attraction.name}</h3><p>{attraction.description}</p></div>
                  </article>
                ))}
              </div>
            </section>
            <section>
              <h2>Ways to explore</h2>
              <ul className="detail-list">{destination.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul>
            </section>
            <section>
              <h2>Getting there</h2>
              <p>{destination.accessNotes}</p>
              <a className="text-link" href={mapUrl} target="_blank" rel="noreferrer">Explore {destination.title} on Google Maps <ArrowUpRight aria-hidden="true" /></a>
            </section>
            <section>
              <h2>Permits and local requirements</h2>
              <p>{destination.permitNotes}</p>
              <p className="trek-disclaimer">Permit rules, fees and access arrangements can change. Confirm current requirements for your route, nationality and travel dates before departure.</p>
            </section>
            <section>
              <h2>Planning questions</h2>
              <div className="destination-faq-list">
                {destination.planningFaqs.map((faq) => (
                  <article key={faq.question}>
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </article>
                ))}
              </div>
            </section>
            <section aria-labelledby="destination-notes-heading">
              <h2 className="sr-only" id="destination-notes-heading">Destination notes</h2>
              <div className="destination-notes-grid">
                <article className="destination-notes"><h3>Highlights to explore</h3><ul>{destination.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></article>
                <article className="destination-notes"><h3>Practical notes</h3><ul>{destination.practicalTips.map((tip) => <li key={tip}>{tip}</li>)}</ul></article>
              </div>
            </section>
            {destination.contentSources && <section>
              <h2>Further reading</h2>
              <p>Use current local guidance for opening hours, access and seasonal conditions.</p>
              <div className="content-source-links">{destination.contentSources.map((source) => <a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label} <ArrowUpRight aria-hidden="true" /></a>)}</div>
            </section>}
          </div>
          <aside className="detail-aside">
            <span className="eyebrow">Plan your visit</span>
            <h3>{destination.title}</h3>
            <div className="detail-facts">
              <span>Region <strong>{destination.region}</strong></span>
              <span>Experience <strong>{destination.category}</strong></span>
              <span>Best time <strong>{destination.bestTime}</strong></span>
            </div>
            <p>Conditions, access and opening details change. Ask the team for current information before confirming travel.</p>
            <a className="text-link" href={mapUrl} target="_blank" rel="noreferrer">Open map <ArrowUpRight aria-hidden="true" /></a>
            <Link className="button button-dark" href={`/contact?destination=${destination.slug}`}>Ask about this place <ArrowUpRight aria-hidden="true" /></Link>
          </aside>
        </div>
      </section>

      {(relatedPackages.length > 0 || relatedTreks.length > 0) && <section className="section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Continue planning</span><h2>Journeys that include<br /><em>{destination.title}.</em></h2></div><p>Sample routes are starting points only. Confirm current availability, details and conditions directly with the team.</p></div>
          {relatedPackages.length > 0 && <div className="package-grid">{relatedPackages.slice(0, 3).map((item) => <PackageCard item={item} key={item.slug} />)}</div>}
          {relatedTreks.length > 0 && <div className="related-treks">{relatedTreks.map((trek) => <Link className="related-trek-link" href={trek.href} key={trek.slug}><span><small>{trek.location} · {trek.duration}</small><strong>{trek.title}</strong></span><ArrowUpRight aria-hidden="true" /></Link>)}</div>}
        </div>
      </section>}

      <JourneyCta title={`Let’s make ${destination.title} part of your journey.`} />
    </>
  )
}

function packageHeroImage(travelPackage: TravelPackage): DestinationImage {
  return { src: travelPackage.image, alt: travelPackage.imageAlt, downloadUrl: '', caption: travelPackage.title, credit: travelPackage.imageCredit, license: travelPackage.imageLicense, sourceUrl: travelPackage.imageSource }
}

function browseHeroImage(item: BrowseItem): DestinationImage {
  return { src: item.image, alt: item.imageAlt, downloadUrl: '', caption: item.title, credit: item.imageCredit, license: item.imageLicense, sourceUrl: item.imageSource }
}

export function PackageDetail({ travelPackage, relatedDestinations = [], relatedTreks = [] }: { travelPackage: TravelPackage; relatedDestinations?: BrowseItem[]; relatedTreks?: BrowseItem[] }) {
  const tripJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: travelPackage.title,
    description: travelPackage.description,
    itinerary: travelPackage.itinerary.map((day) => ({ '@type': 'ItemList', name: `${day.day}: ${day.title}`, description: day.detail })),
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: travelPackage.planningFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tripJsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }} />
      <PageHero eyebrow={travelPackage.category} title={travelPackage.title} description={travelPackage.description} image={packageHeroImage(travelPackage)} crumbs={[{ label: 'Journeys', href: '/tours' }]} />
      <section className="section section-soft"><div className="container detail-layout">
        <div className="detail-main">
          <section><span className="eyebrow">A sample journey</span><h2>Thoughtfully paced, ready to make your own.</h2><p>{travelPackage.description} This itinerary is an editable sample, not a confirmed departure. Route details, timing and inclusions should be confirmed before travel.</p></section>
          <section><h2>Journey highlights</h2><ul className="detail-list">{travelPackage.highlights.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h2>Day-by-day outline</h2><p>The stages below are a planning outline. Exact walking times, transport schedules, overnight stops and meal arrangements are confirmed in the final proposal.</p><div className="itinerary">{travelPackage.itinerary.map((item) => <div className="itinerary-row" key={item.day}><span>{item.day}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div></div>)}</div></section>
          <section><h2>Included in this outline</h2><ul className="detail-list">{travelPackage.inclusions.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h2>Not included</h2><ul className="detail-list">{travelPackage.exclusions.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h2>What to confirm before your quote</h2><p>To make the proposal operationally clear, ask the team to confirm each of these details in writing.</p><ul className="detail-list">{travelPackage.preQuoteChecklist.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h2>Common questions</h2><div className="destination-faq-list">{travelPackage.planningFaqs.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}</div></section>
        </div>
        <aside className="detail-aside"><span className="eyebrow">Journey details</span><h3>{travelPackage.title}</h3><div className="detail-facts"><span><MapPin aria-hidden="true" />Places <strong>{travelPackage.destination}</strong></span><span><Clock3 aria-hidden="true" />Sample duration <strong>{travelPackage.duration}</strong></span><span>Experience <strong>{travelPackage.category}</strong></span><span>Price <strong>On request</strong></span></div><p>No live availability or fixed pricing is shown. Send preferred dates to discuss the options.</p><Link className="button button-dark" href={`/contact?tour=${travelPackage.slug}`}>Enquire about this journey <ArrowUpRight aria-hidden="true" /></Link></aside>
      </div></section>
      {(relatedDestinations.length > 0 || relatedTreks.length > 0) && <section className="section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Continue exploring</span><h2>Places and trails<br /><em>along the way.</em></h2></div><p>These links are tied to the sample route by explicit catalogue references, not title matching.</p></div>
          {relatedDestinations.length > 0 && <div className="destination-grid">{relatedDestinations.map((item) => <DestinationCard item={item} key={item.slug} />)}</div>}
          {relatedTreks.length > 0 && <div className="related-treks">{relatedTreks.map((trek) => <Link className="related-trek-link" href={trek.href} key={trek.slug}><span><small>{trek.location} · {trek.duration}</small><strong>{trek.title}</strong></span><ArrowUpRight aria-hidden="true" /></Link>)}</div>}
        </div>
      </section>}
      <JourneyCta title="Have a different route in mind? Let’s talk." />
    </>
  )
}

export function TrekDetail({ trek }: { trek: BrowseItem }) {
  return (
    <>
      <PageHero eyebrow={`${trek.category} · Trekking`} title={trek.title} description={trek.description} image={browseHeroImage(trek)} crumbs={[{ label: 'Trekking', href: '/trekking' }]} />
      <section className="section section-soft"><div className="container detail-layout">
        <div className="detail-main"><section><span className="eyebrow">On the trail</span><h2>A trek shaped by the landscape.</h2><p>{trek.description} Routes are subject to local conditions, weather and individual pace. Discuss the route and level of support with the team before making plans.</p></section><section><h2>What to expect</h2><ul className="detail-list"><li>Route planning with acclimatization and rest in mind</li><li>Local guide and ground support coordination</li><li>Flexible timing based on season and conditions</li><li>Pre-trek conversation about fitness and preparation</li></ul></section><section><h2>Travel notes</h2><p>Difficulty descriptions are indicative only. Fitness, altitude and weather affect every trek differently. Ask for current route information and discuss your experience before confirming travel.</p></section></div>
        <aside className="detail-aside"><span className="eyebrow">Trek overview</span><h3>{trek.title}</h3><div className="detail-facts"><span>Region <strong>{trek.location}</strong></span><span>Duration <strong>{trek.duration}</strong></span><span>Difficulty <strong>{trek.category}</strong></span><span>Pricing <strong>On request</strong></span></div><p>Route, services and availability are discussed directly with the team.</p><Link className="button button-dark" href={`/contact?trek=${trek.slug}`}>Enquire about this trek <ArrowUpRight aria-hidden="true" /></Link></aside>
      </div></section>
      <JourneyCta title="Let’s find the right trail for you." />
    </>
  )
}

export function ArticleDetail({ article }: { article: Article }) {
  const image = { src: article.image, alt: article.imageAlt, downloadUrl: '', caption: article.title, credit: article.imageCredit, license: article.imageLicense, sourceUrl: article.imageSource }
  return (
    <>
      <PageHero eyebrow={`${article.category} · ${article.readingTime}`} title={article.title} description={article.excerpt} image={image} crumbs={[{ label: 'Travel journal', href: '/blog' }]} />
      <article className="section section-soft"><div className="container article-reading"><Link className="text-link" href="/blog"><ArrowLeft aria-hidden="true" /> Back to the journal</Link><div className="article-content">{article.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><p className="article-note">This is sample editorial content. Teenkanya should review it against current local guidance before publication.</p></div></article>
      <JourneyCta title="Need help planning your Nepal trip?" />
    </>
  )
}
