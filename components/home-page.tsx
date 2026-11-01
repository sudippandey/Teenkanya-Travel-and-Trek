import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, Compass, HeartHandshake, MapPinned } from 'lucide-react'
import { JourneyFinder } from '@/components/journey-finder'
import { TravelGallery } from '@/components/travel-gallery'
import { ArticleCard, DestinationCard, PackageCard } from '@/components/travel-cards'
import { PhotoCredit } from '@/components/photo-credit'
import { ScrollReveal } from '@/components/scroll-reveal'
import { destinationPhotos, galleryImages } from '@/lib/travel-data'
import type { Article, BrowseItem, TravelPackage } from '@/lib/travel-data'

const principles = [
  { icon: Compass, title: 'Made around your pace', text: 'Start with the places and experiences that matter to you.' },
  { icon: MapPinned, title: 'Grounded in place', text: 'Plan from Kathmandu with local context and practical detail.' },
  { icon: HeartHandshake, title: 'Thought through together', text: 'Use each conversation to shape a route that feels right.' },
]

export function HomePage({ destinationItems, packageItems, articles, packages, treks }: { destinationItems: BrowseItem[]; packageItems: BrowseItem[]; articles: Article[]; packages: TravelPackage[]; treks: BrowseItem[] }) {
  const heroImage = destinationPhotos['everest-region'][0]
  const featuredDestination = destinationItems.find((item) => item.slug === 'pokhara')
  const supportingDestinations = destinationItems.filter((item) => ['kathmandu', 'mustang', 'chitwan'].includes(item.slug))

  return (
    <>
      <section className="hero home-hero">
        <Image className="hero-image" src={heroImage.src} alt={heroImage.alt} fill priority sizes="100vw" quality={85} />
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-kicker">Journeys from Kathmandu, Nepal</span>
            <h1>Find your way<br />into <em>Nepal.</em></h1>
            <p className="hero-copy">From Kathmandu&apos;s living courtyards to the high trails of the Khumbu, plan a journey at your own pace.</p>
            <div className="hero-actions">
              <Link className="button button-light" href="/destinations">Explore destinations <ArrowUpRight aria-hidden="true" /></Link>
              <Link className="button button-outline-light" href="/contact">Plan with us <ArrowUpRight aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="hero-bottomline">
            <span>Thoughtful travel, rooted in Nepal</span>
            <PhotoCredit credit={heroImage.credit} license={heroImage.license} sourceUrl={heroImage.sourceUrl} />
          </div>
        </div>
        <a className="hero-scroll" href="#discover" aria-label="Scroll to discover Nepal"><ArrowDownRight aria-hidden="true" /></a>
      </section>

      <section className="discovery-wrap container" id="discover" aria-label="Find a journey">
        <JourneyFinder packages={packages} destinations={destinationItems} treks={treks} />
      </section>

      <section className="section section-destinations">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">Eight ways into one country</span><h2>Where would you<br /><em>like to begin?</em></h2></div>
            <div className="section-heading-aside"><p>Each region has its own rhythm. Choose a starting point and give the details room to take shape.</p><Link className="text-link" href="/destinations">Explore all destinations</Link></div>
          </div>
          <div className="home-destination-layout">
            {featuredDestination && <ScrollReveal className="home-destination-feature"><DestinationCard item={featuredDestination} featured /></ScrollReveal>}
            <div className="home-destination-list">
              {supportingDestinations.map((item, index) => (
                <ScrollReveal key={item.slug} delay={index * 80}>
                  <DestinationCard item={item} compact />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-forest">
        <div className="container">
          <div className="section-heading section-heading-inverse">
            <div><span className="eyebrow eyebrow-light">A good journey starts with good questions</span><h2>Travel that leaves<br /><em>room to notice.</em></h2></div>
            <p>We are a Kathmandu-based team. Begin with what you hope to see, how you like to move and the time you have.</p>
          </div>
          <div className="principles-grid">
            {principles.map(({ icon: Icon, title, text }, index) => (
              <ScrollReveal key={title} delay={index * 80}>
                <article className="principle-item">
                  <span className="principle-number">0{index + 1}</span>
                  <Icon aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">Journey ideas</span><h2>A few ways<br /><em>to set out.</em></h2></div>
            <div className="section-heading-aside"><p>These sample itineraries are starting points, not fixed departures. Every detail can be discussed before you travel.</p><Link className="text-link" href="/tours">Browse journeys</Link></div>
          </div>
          <div className="package-grid">
            {packageItems.slice(0, 3).map((item, index) => <ScrollReveal key={item.slug} delay={index * 90}><PackageCard item={item} /></ScrollReveal>)}
          </div>
        </div>
      </section>

      <section className="section section-editorial">
        <div className="container editorial-section">
          <figure className="editorial-image">
            <Image src={destinationPhotos.mustang[2].src} alt={destinationPhotos.mustang[2].alt} fill sizes="(max-width: 780px) 100vw, 52vw" loading="lazy" />
            <figcaption><PhotoCredit credit={destinationPhotos.mustang[2].credit} license={destinationPhotos.mustang[2].license} sourceUrl={destinationPhotos.mustang[2].sourceUrl} /></figcaption>
          </figure>
          <div className="editorial-copy">
            <span className="eyebrow">A little more human</span>
            <h2>Make space for<br /><em>the unexpected.</em></h2>
            <p>Travel is more than the places you reach. It is the morning tea before a walk, a conversation you did not plan and the feeling of being welcomed somewhere new.</p>
            <p>Teenkanya Travel &amp; Trek is based in Kathmandu. We help travelers bring Nepal plans together with local context and practical care.</p>
            <div className="editorial-points"><span>Personal travel planning</span><span>Destination-specific ideas</span><span>Clear, practical conversations</span><span>Flexible sample journeys</span></div>
            <Link className="text-link" href="/about">Get to know Teenkanya</Link>
          </div>
        </div>
      </section>

      <section className="section section-soft section-gallery-home">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">Small moments, big landscapes</span><h2>Nepal, in <em>frames.</em></h2></div>
            <p>A glimpse of the places and details you might encounter along the way.</p>
          </div>
          <TravelGallery images={galleryImages} label="Nepal travel photography" />
        </div>
      </section>

      <section className="section section-journal">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">The field notes</span><h2>Read before<br /><em>you go.</em></h2></div>
            <Link className="text-link" href="/blog">Visit the journal</Link>
          </div>
          <div className="article-grid">
            {articles.slice(0, 3).map((article, index) => <ScrollReveal key={article.slug} delay={index * 90}><ArticleCard article={article} /></ScrollReveal>)}
          </div>
        </div>
      </section>

      <section className="section section-last-cta">
        <div className="container"><div className="cta-band"><div><span className="eyebrow">Your Nepal story starts here</span><h2>Let&apos;s plan your next journey.</h2></div><Link className="button button-dark" href="/contact">Talk to our team <ArrowUpRight aria-hidden="true" /></Link></div></div>
      </section>
    </>
  )
}
