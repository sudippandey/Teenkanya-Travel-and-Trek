import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { JourneyCta, PageHero, PageIntro } from '@/components/page-templates'
import { services } from '@/lib/travel-data'

export const metadata: Metadata = { title: 'Travel Services', description: 'Explore planned and enquiry-based travel services from Teenkanya Travel & Trek in Kathmandu, Nepal.' }

export default function ServicesPage() {
  return <><PageHero eyebrow="TRAVEL SERVICES" title="The practical parts, made simpler." description="Travel support for the details around your journey. Service availability is confirmed directly with our team." image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85" /><section className="section"><div className="container"><PageIntro label="HERE TO HELP YOU PLAN" title="Support for more of the journey.">These service categories describe planned and enquiry-based support. They are not confirmation of a live reservation system or guaranteed availability.</PageIntro><div className="service-grid">{services.map((service) => <article className="service-card" key={service.title}><div className="service-icon" aria-hidden="true">{service.icon}</div><span className="service-status">{service.status}</span><h3>{service.title}</h3><p>{service.description}</p><Link href="/contact">{service.status === 'Coming soon' ? 'Ask about future updates' : 'Make an enquiry'} <ArrowUpRight aria-hidden="true" /></Link></article>)}</div></div></section><section className="section section-soft"><div className="container"><PageIntro label="PLANNING AHEAD" title="Not a booking engine—yet.">Online ticketing, reservations, payment and customer accounts are planned for future development. For now, our team can discuss your needs directly and confirm what support is available.</PageIntro><div className="testimonial-note"><p>Service details, costs and availability should be confirmed with Teenkanya before making travel arrangements.</p><span>Enquiry-based support</span></div></div></section><JourneyCta title="Have a travel detail you’d like help with?" /></>
}
