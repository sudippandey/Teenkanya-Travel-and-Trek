import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { JourneyCta, PageHero } from '@/components/page-templates'
import { PhotoCredit } from '@/components/photo-credit'
import { TrackedLink } from '@/components/tracked-link'
import { business } from '@/lib/site-config'
import { destinationPhotos } from '@/lib/travel-data'

export const metadata: Metadata = {
  title: 'About Teenkanya',
  description: 'Meet Teenkanya Travel & Trek Pvt. Ltd., a Kathmandu-based travel company planning Nepal journeys, domestic trips and international travel enquiries.',
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
          <p>Teenkanya Travel &amp; Trek Pvt. Ltd. is based in Kathmandu, Nepal. The team helps visitors and local travellers plan Nepal tours, trekking journeys, domestic trips and international travel enquiries.</p>
          <p>Some trips are operated by Teenkanya and others may be arranged with partner operators. Before you commit, ask for the operator, inclusions, availability, cancellation terms and final price in writing.</p>
          <div className="editorial-points"><span>Thoughtful route ideas</span><span>Clear practical details</span><span>Room to ask questions</span><span>Flexible travel planning</span></div>
          <TrackedLink className="text-link" href="/contact" eventName="contact_click" eventProperties={{ channel: 'enquiry', location: 'about' }}>Start a conversation</TrackedLink>
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
    <section className="section section-soft" aria-labelledby="business-details-heading">
      <div className="container">
        <div className="section-heading"><div><span className="eyebrow">BUSINESS INFORMATION</span><h2 id="business-details-heading">The details <em>matter.</em></h2></div><p>Use these published contact details to reach the team. Items in brackets are owner follow-ups and are not claims of registration or certification.</p></div>
        <dl className="business-info-grid">
          <div><dt>Registered business name</dt><dd>{business.name}</dd></div>
          <div><dt>Office location</dt><dd>{business.city}, Nepal <span className="business-info-placeholder">[Full street address: business owner to provide]</span></dd></div>
          <div><dt>Phone and WhatsApp</dt><dd><TrackedLink href={`tel:${business.telephone}`} eventName="contact_click" eventProperties={{ channel: 'phone', location: 'business_details' }}>{business.telephone}</TrackedLink></dd></div>
          <div><dt>Customer email</dt><dd><TrackedLink href={`mailto:${business.email}`} eventName="contact_click" eventProperties={{ channel: 'email', location: 'business_details' }}>{business.email}</TrackedLink></dd></div>
          <div><dt>Registration and applicable travel permissions</dt><dd><span className="business-info-placeholder">[Verified registration number and applicable licence details: business owner to provide]</span></dd></div>
          <div><dt>Tax registration</dt><dd><span className="business-info-placeholder">[PAN/VAT details or confirmation that they do not apply: business owner to provide]</span></dd></div>
        </dl>
        <p className="business-operator-note">For partner-operated trips, the written itinerary or quotation should identify the operating partner and the services they provide. No online booking or fixed-price confirmation is offered on this website.</p>
        <p className="business-operator-note">Read our <Link className="text-link" href="/privacy">privacy notice</Link> for information about enquiry details and website analytics.</p>
      </div>
    </section>
    <JourneyCta title="Tell us what brings you to Nepal." />
  </>
}
