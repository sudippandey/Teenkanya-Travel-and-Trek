import Link from 'next/link'
import { ArrowUpRight, Compass, HeartHandshake, Map, Mountain, Sparkles } from 'lucide-react'
import { JourneyFinder } from '@/components/journey-finder'
import { TravelGallery } from '@/components/travel-gallery'
import { DestinationCard, PackageCard } from '@/components/travel-cards'
import type { Article, BrowseItem, TravelPackage } from '@/lib/travel-data'

const experiences = [
  { icon: Compass, number: '01', title: 'Nepal, your way', text: 'Culture, nature and local encounters shaped around the way you like to travel.' },
  { icon: Mountain, number: '02', title: 'Trails less hurried', text: 'Thoughtful trekking journeys with time for the places and people along the way.' },
  { icon: HeartHandshake, number: '03', title: 'Here when you need us', text: 'A Kathmandu-based team to help make planning feel simple and personal.' },
  { icon: Map, number: '04', title: 'More than a checklist', text: 'Flexible itineraries that leave space for discovery, rest and unexpected moments.' },
  { icon: Sparkles, number: '05', title: 'The details matter', text: 'Clear communication and practical support before you set out.' },
  { icon: ArrowUpRight, number: '06', title: 'A journey that fits', text: 'Start with an idea and work together to find the right route and rhythm.' },
]

export function HomePage({ destinationItems, packageItems, articles, packages }: { destinationItems: BrowseItem[]; packageItems: BrowseItem[]; articles: Article[]; packages: TravelPackage[] }) {
  return <>
    <section className="hero">
      <img className="hero-image" src="/images/nepal-hero.png" alt="Early morning light over the Nepal Himalaya" fetchPriority="high" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="hero-kicker">Journeys from Kathmandu, Nepal</span>
        <h1>Discover Nepal.<br /><em>Experience beyond</em><br />the journey.</h1>
        <p className="hero-copy">From ancient city lanes to Himalayan horizons, find a more thoughtful way to experience Nepal.</p>
        <div className="hero-actions"><Link className="button button-primary" href="/destinations">Explore destinations <ArrowUpRight aria-hidden="true" /></Link><Link className="button button-ghost" href="/contact">Plan your trip <ArrowUpRight aria-hidden="true" /></Link></div>
      </div>
      <div className="hero-caption">A view worth taking your time for</div>
    </section>

    <section className="discovery-wrap container" aria-label="Find a journey"><JourneyFinder packages={packages} /></section>

    <section className="section">
      <div className="container">
        <div className="section-heading"><div><span className="eyebrow">A COUNTRY OF MANY WORLDS</span><h2>Find your way <em>into Nepal.</em></h2></div><div><p>Each region has its own rhythm. Start with the places that call to you, and we’ll help shape the journey around them.</p><Link className="text-link" href="/destinations">All destinations</Link></div></div>
        <div className="destination-grid">{destinationItems.slice(0, 4).map((item, index) => <DestinationCard item={item} index={index} key={item.slug} />)}</div>
      </div>
    </section>

    <section className="section section-dark">
      <div className="container">
        <div className="section-heading"><div><span className="eyebrow eyebrow-light">MAKE IT YOURS</span><h2>Travel that feels <em>like you.</em></h2></div><p>There is no one way to see Nepal. Choose a starting point, then let the details come together at your pace.</p></div>
        <div className="experience-grid">{experiences.map(({ icon: Icon, number, title, text }) => <article className="experience-card" key={number}><span className="experience-number">{number}</span><h3>{title}</h3><p>{text}</p><Icon className="experience-arrow" aria-hidden="true" size={19} /></article>)}</div>
      </div>
    </section>

    <section className="section section-soft">
      <div className="container">
        <div className="section-heading"><div><span className="eyebrow">IDEAS FOR YOUR NEXT JOURNEY</span><h2>A few ways to <em>begin.</em></h2></div><div><p>These sample journeys are a starting point. Each itinerary can be discussed and adapted to your interests.</p><Link className="text-link" href="/tours">Browse tours &amp; packages</Link></div></div>
        <div className="package-grid">{packageItems.slice(0, 3).map((item, index) => <PackageCard item={item} index={index} key={item.slug} />)}</div>
      </div>
    </section>

    <section className="section">
      <div className="container editorial-section">
        <div className="editorial-image"><img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1300&q=85" alt="A quiet mountain landscape in Nepal" loading="lazy" /></div>
        <div className="editorial-copy"><span className="eyebrow">A LITTLE MORE HUMAN</span><h2>Make room for the <em>unexpected.</em></h2><p>Travel is more than the places you reach. It’s the morning tea before a walk, the conversation you didn’t plan, and the feeling of being welcomed somewhere new.</p><p>Teenkanya Travel &amp; Trek is based in Kathmandu. We help travelers bring their Nepal plans together with local context and practical care.</p><div className="editorial-points"><span>Personal travel planning</span><span>Local destination knowledge</span><span>Helpful, clear communication</span><span>Flexible journey ideas</span></div><Link className="text-link" href="/about">Get to know Teenkanya</Link></div>
      </div>
    </section>

    <section className="section section-soft">
      <div className="container"><div className="section-heading"><div><span className="eyebrow">SMALL MOMENTS, BIG LANDSCAPES</span><h2>Nepal, in <em>frames.</em></h2></div><p>A glimpse of the landscapes, living heritage and everyday moments you might find along the way.</p></div><TravelGallery /></div>
    </section>

    <section className="section section-dark"><div className="container"><div className="section-heading"><div><span className="eyebrow eyebrow-light">A NOTE ON REVIEWS</span><h2>Stories are best <em>told honestly.</em></h2></div><p>We’re building this space for real traveler stories. No reviews are published here until customers choose to share theirs.</p></div><div className="testimonial-note"><p>Traveler testimonials will appear here after genuine reviews have been collected and approved for publication.</p><span>Customer stories · coming later</span></div></div></section>

    <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">THE FIELD NOTES</span><h2>Read before <em>you go.</em></h2></div><Link className="text-link" href="/blog">Visit the journal</Link></div><div className="article-grid">{articles.slice(0, 3).map((article) => <article className="article-card" key={article.slug}><Link className="article-image" href={`/blog/${article.slug}`}><img src={article.image} alt={article.title} loading="lazy" /></Link><div className="article-body"><span>{article.category} · {article.readingTime}</span><h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2><p>{article.excerpt}</p><Link className="text-link" href={`/blog/${article.slug}`}>Read the guide</Link></div></article>)}</div></div></section>

    <section className="section"><div className="container"><div className="cta-band"><div><span className="eyebrow">YOUR NEPAL STORY STARTS HERE</span><h2>Let’s plan your next journey.</h2></div><Link className="button" href="/contact">Talk to our team <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
  </>
}
