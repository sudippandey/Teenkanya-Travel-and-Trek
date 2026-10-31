import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Clock3, MapPin } from 'lucide-react'
import type { Article, Destination, TravelPackage, BrowseItem } from '@/lib/travel-data'

export function PageHero({ eyebrow, title, description, image, crumbs = [] }: { eyebrow: string; title: string; description: string; image: string; crumbs?: { label: string; href: string }[] }) {
  return <section className="page-hero"><img src={image} alt="" fetchPriority="high" /><div className="page-hero-content"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span>{crumbs.map((item) => <span key={item.href}><Link href={item.href}>{item.label}</Link><span> / </span></span>)}<span>{eyebrow}</span></div><span className="hero-kicker">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></section>
}

export function PageIntro({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return <div className="page-intro"><span className="eyebrow">{label}</span><h2>{title}</h2><p>{children}</p></div>
}

export function JourneyCta({ title = 'Your journey can start with a conversation.' }: { title?: string }) {
  return <section className="section"><div className="container"><div className="cta-band"><div><span className="eyebrow">LET’S PLAN TOGETHER</span><h2>{title}</h2></div><Link className="button" href="/contact">Make an enquiry <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
}

export function DestinationDetail({ destination }: { destination: Destination }) {
  return <>
    <PageHero eyebrow={destination.region} title={destination.title} description={destination.description} image={destination.image} crumbs={[{ label: 'Destinations', href: '/destinations' }]} />
    <section className="section"><div className="container detail-layout"><div className="detail-main"><section><span className="eyebrow">GET TO KNOW THE REGION</span><h2>A place to experience at your own pace.</h2><p>{destination.overview}</p></section><section><h2>Highlights</h2><ul className="detail-list">{destination.highlights.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h2>Ways to explore</h2><ul className="detail-list">{destination.activities.map((item) => <li key={item}>{item}</li>)}</ul></section></div><aside className="detail-aside"><h3>Plan your visit</h3><div className="detail-facts"><span>Region <strong>{destination.region}</strong></span><span>Best time <strong>{destination.bestTime}</strong></span><span>Experience <strong>{destination.category}</strong></span></div><p>Timing and conditions vary by route and season. Ask our team about a journey that fits your plans.</p><Link className="button" href={`/contact?destination=${destination.slug}`}>Ask about this place <ArrowUpRight aria-hidden="true" /></Link></aside></div></section>
    <JourneyCta title={`Let’s make ${destination.title} part of your journey.`} />
  </>
}

export function PackageDetail({ travelPackage }: { travelPackage: TravelPackage }) {
  return <>
    <PageHero eyebrow={travelPackage.category} title={travelPackage.title} description={travelPackage.description} image={travelPackage.image} crumbs={[{ label: 'Tours & packages', href: '/tours' }]} />
    <section className="section"><div className="container detail-layout"><div className="detail-main"><section><span className="eyebrow">A SAMPLE JOURNEY</span><h2>Thoughtfully paced, ready to make your own.</h2><p>{travelPackage.description} This itinerary is an editable sample and can be discussed with our team. Route details, timing and inclusions should be confirmed before travel.</p></section><section><h2>Journey highlights</h2><ul className="detail-list">{travelPackage.highlights.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h2>Itinerary overview</h2><div className="itinerary">{travelPackage.itinerary.map((item) => <div className="itinerary-row" key={item.day}><span>{item.day}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div></div>)}</div></section><section><h2>What’s included in this outline</h2><ul className="detail-list">{travelPackage.inclusions.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h2>Not included</h2><ul className="detail-list">{travelPackage.exclusions.map((item) => <li key={item}>{item}</li>)}</ul></section></div><aside className="detail-aside"><h3>Journey details</h3><div className="detail-facts"><span><MapPin aria-hidden="true" />Places <strong>{travelPackage.destination}</strong></span><span><Clock3 aria-hidden="true" />Duration <strong>{travelPackage.duration}</strong></span><span>Activity <strong>{travelPackage.category}</strong></span><span>Price <strong>On request</strong></span></div><p>No live availability or fixed pricing is shown. Send us your preferred dates and we’ll discuss the options.</p><Link className="button" href={`/contact?tour=${travelPackage.slug}`}>Enquire about this tour <ArrowUpRight aria-hidden="true" /></Link></aside></div></section>
    <JourneyCta title="Have a different route in mind? Let’s talk." />
  </>
}

export function TrekDetail({ trek }: { trek: BrowseItem }) {
  return <>
    <PageHero eyebrow={`${trek.category} · Trekking`} title={trek.title} description={trek.description} image={trek.image} crumbs={[{ label: 'Trekking', href: '/trekking' }]} />
    <section className="section"><div className="container detail-layout"><div className="detail-main"><section><span className="eyebrow">ON THE TRAIL</span><h2>A trek shaped by the landscape.</h2><p>{trek.description} Trekking routes are subject to local conditions, weather and individual pace. We’ll help you understand the route and plan the right level of support.</p></section><section><h2>What to expect</h2><ul className="detail-list"><li>Route planning with acclimatization and rest in mind</li><li>Local guide and ground support coordination</li><li>Flexible timing based on season and conditions</li><li>Pre-trek conversation about fitness, packing and preparation</li></ul></section><section><h2>Travel notes</h2><p>Difficulty descriptions are indicative only. Fitness, altitude and weather affect every trek differently. Ask for current route information and discuss your experience with the team before confirming travel.</p></section></div><aside className="detail-aside"><h3>Trek overview</h3><div className="detail-facts"><span>Region <strong>{trek.location}</strong></span><span>Duration <strong>{trek.duration}</strong></span><span>Difficulty <strong>{trek.category}</strong></span><span>Pricing <strong>On request</strong></span></div><p>Route, services and availability are discussed directly with our team.</p><Link className="button" href={`/contact?trek=${trek.slug}`}>Enquire about this trek <ArrowUpRight aria-hidden="true" /></Link></aside></div></section>
    <JourneyCta title="Let’s find the right trail for you." />
  </>
}

export function ArticleDetail({ article }: { article: Article }) {
  return <>
    <PageHero eyebrow={`${article.category} · ${article.readingTime}`} title={article.title} description={article.excerpt} image={article.image} crumbs={[{ label: 'Travel journal', href: '/blog' }]} />
    <article className="section"><div className="container article-reading"><Link className="text-link" href="/blog"><ArrowLeft aria-hidden="true" /> Back to the journal</Link><div className="article-content">{article.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><p className="article-note">This guide is sample editorial content and should be reviewed and updated by Teenkanya before publication.</p></div></article>
    <JourneyCta title="Need help planning your Nepal trip?" />
  </>
}
