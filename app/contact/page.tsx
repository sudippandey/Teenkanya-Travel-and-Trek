import type { Metadata } from 'next'
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { PageHero } from '@/components/page-templates'
import { destinationPhotos } from '@/lib/travel-data'
import { getWhatsAppHref } from '@/lib/contact-links'
import { TrackedLink } from '@/components/tracked-link'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Teenkanya Travel & Trek Pvt. Ltd. in Kathmandu to discuss Nepal tours, trekking, domestic journeys or international travel plans.',
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact Teenkanya Travel & Trek', description: 'Start a conversation about Nepal tours, trekking, domestic or international travel.' },
}

export default function ContactPage() {
  return <><PageHero eyebrow="CONTACT TEENKANYA" title="Let’s start with a conversation." description="Share what you have in mind. Our Kathmandu-based team can discuss Nepal tours, trekking, domestic travel and international plans." image={destinationPhotos.kathmandu[2]} /><section className="section"><div className="container contact-layout"><div className="contact-intro"><span className="eyebrow">WE’RE IN KATHMANDU</span><h2>We’d love to hear from you.</h2><p>Planning a trip within Nepal, visiting from abroad, or looking further afield? Tell us about your destination, dates and interests. We’ll confirm what can be arranged and who will operate the trip before you commit.</p><div className="contact-details"><TrackedLink className="contact-detail" href="tel:+9779851248173" eventName="contact_click" eventProperties={{ channel: 'phone', location: 'contact_page' }}><Phone aria-hidden="true" /><span><small>Call us</small>+977 9851248173</span></TrackedLink><TrackedLink className="contact-detail" href={getWhatsAppHref('Hello Teenkanya, I would like to discuss a travel enquiry.')} target="_blank" rel="noreferrer" eventName="whatsapp_click" eventProperties={{ location: 'contact_page' }}><MessageCircle aria-hidden="true" /><span><small>WhatsApp</small>Chat with our team</span></TrackedLink><TrackedLink className="contact-detail" href="mailto:3kanya2018@gmail.com" eventName="contact_click" eventProperties={{ channel: 'email', location: 'contact_page' }}><Mail aria-hidden="true" /><span><small>Email</small>3kanya2018@gmail.com</span></TrackedLink><span className="contact-detail"><MapPin aria-hidden="true" /><span><small>Location</small>Kathmandu, Nepal</span></span><a className="contact-detail" href="https://www.facebook.com/teenkanyatravel/" target="_blank" rel="noreferrer"><ArrowUpRight aria-hidden="true" /><span><small>Follow along</small>Facebook</span></a></div></div><ContactForm /></div></section><section className="section section-soft"><div className="container"><a className="map-placeholder" href="https://maps.google.com/?q=Kathmandu,Nepal" target="_blank" rel="noreferrer"><MapPin aria-hidden="true" /><strong>Find us in Kathmandu, Nepal</strong><span>Open map directions ↗</span></a></div></section></>
}
