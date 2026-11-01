import type { Metadata } from 'next'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { PageHero } from '@/components/page-templates'
import { destinationPhotos } from '@/lib/travel-data'
import { resolveEnquiryCatalogueQuery } from '@/lib/enquiries/catalogue-context'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Teenkanya Travel & Trek Pvt. Ltd. in Kathmandu, Nepal, to discuss a journey or travel enquiry.',
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact Teenkanya Travel & Trek', description: 'Start a conversation about your journey through Nepal.' },
}

type ContactSearchParams = Record<string, string | string[] | undefined>

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<ContactSearchParams>
}) {
  const catalogueContext = resolveEnquiryCatalogueQuery(await searchParams)
  return <><PageHero eyebrow="CONTACT TEENKANYA" title="Let’s start with a conversation." description="Share what you have in mind. Our Kathmandu-based team will help you explore the next steps." image={destinationPhotos.kathmandu[2]} /><section className="section"><div className="container contact-layout"><div className="contact-intro"><span className="eyebrow">WE’RE IN KATHMANDU</span><h2>We’d love to hear from you.</h2><p>Have a question about a destination, trek or travel service? Get in touch by phone or email, or leave a note below.</p><div className="contact-details"><a className="contact-detail" href="tel:+9779851248173"><Phone aria-hidden="true" /><span><small>Call us</small>+977 9851248173</span></a><a className="contact-detail" href="mailto:3kanya2018@gmail.com"><Mail aria-hidden="true" /><span><small>Email</small>3kanya2018@gmail.com</span></a><span className="contact-detail"><MapPin aria-hidden="true" /><span><small>Location</small>Kathmandu, Nepal</span></span><a className="contact-detail" href="https://www.facebook.com/teenkanyatravel/" target="_blank" rel="noreferrer"><ArrowUpRight aria-hidden="true" /><span><small>Follow along</small>Facebook</span></a></div></div><ContactForm catalogueContext={catalogueContext} /></div></section><section className="section section-soft"><div className="container"><a className="map-placeholder" href="https://maps.google.com/?q=Kathmandu,Nepal" target="_blank" rel="noreferrer"><MapPin aria-hidden="true" /><strong>Find us in Kathmandu, Nepal</strong><span>Open map directions ↗</span></a></div></section></>
}
