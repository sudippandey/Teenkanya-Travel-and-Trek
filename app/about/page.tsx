import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { JourneyCta, PageHero } from '@/components/page-templates'
import { PhotoCredit } from '@/components/photo-credit'
import { destinationPhotos } from '@/lib/travel-data'

export const metadata: Metadata = {
  title: 'About Teenkanya',
  description: 'Teenkanya Travel & Trek is based in Kathmandu and helps travelers plan thoughtful journeys through Nepal.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Teenkanya Travel & Trek',
    description: 'A Kathmandu-based starting point for thoughtful journeys through Nepal.',
    images: [destinationPhotos.kathmandu[7].src],
  },
}

const approach = [
  ['01', 'Start with your interests', 'Choose the places, pace and experiences that matter most to you.'],
  ['02', 'Plan with local context', 'Talk through routes and practical details with a team based in Kathmandu.'],
  ['03', 'Leave room for the journey', 'Keep plans flexible where weather, access and local conditions can change.'],
]

export default function AboutPage() {
  const storyImage = destinationPhotos.kathmandu[6]

  return <>
    <PageHero eyebrow="ABOUT TEENKANYA" title="Travel, with a little more meaning." description="A Kathmandu-based travel company helping you discover Nepal at your own pace." image={destinationPhotos.kathmandu[7]} />
    <section className="section">
      <div className="container editorial-section">
        <figure className="editorial-image">
          <Image src={storyImage.src} alt={storyImage.alt} fill sizes="(max-width: 780px) 100vw, 52vw" />
          <figcaption><PhotoCredit credit={storyImage.credit} license={storyImage.license} sourceUrl={storyImage.sourceUrl} /></figcaption>
        </figure>
        <div className="editorial-copy">
          <span className="eyebrow">A Kathmandu starting point</span>
          <h2>Rooted in Nepal. <em>Open to your way.</em></h2>
          <p>Teenkanya Travel &amp; Trek Pvt. Ltd. is based in Kathmandu, Nepal. We help travelers explore the country through cultural visits, holiday itineraries and trekking journeys.</p>
          <p>Every good plan begins with a conversation about what you hope to see, the time you have and how you like to travel.</p>
          <div className="editorial-points"><span>Thoughtful route ideas</span><span>Clear practical details</span><span>Room to ask questions</span><span>Flexible travel planning</span></div>
          <Link className="text-link" href="/contact">Start a conversation</Link>
        </div>
      </div>
    </section>
    <section className="section section-forest">
      <div className="container">
        <div className="section-heading section-heading-inverse"><div><span className="eyebrow eyebrow-light">OUR APPROACH</span><h2>A journey shaped<br /><em>around you.</em></h2></div><p>We want planning to feel as thoughtful as the journey itself: grounded in real places, clear about practical details and open to what matters most to you.</p></div>
        <div className="principles-grid">
          {approach.map(([number, title, description]) => <article className="principle-item" key={number}>
            <span className="principle-number">{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>)}
        </div>
      </div>
    </section>
    <JourneyCta title="Tell us what brings you to Nepal." />
  </>
}
