import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { JourneyCta, PageHero, PageIntro } from '@/components/page-templates'
import { services, destinationPhotos } from '@/lib/travel-data'
import { getWhatsAppHref } from '@/lib/contact-links'

export const metadata: Metadata = {
  title: 'Travel Services',
  description: 'Explore planned and enquiry-based travel services from Teenkanya Travel & Trek in Kathmandu, Nepal.',
  alternates: { canonical: '/services' },
  openGraph: { title: 'Travel Services | Teenkanya Travel & Trek', description: 'Travel support for the details around your journey through Nepal.', images: [destinationPhotos.pokhara[3].src] },
}

export default function ServicesPage() {
  return <><PageHero eyebrow="TRAVEL SERVICES" title="The practical parts, made simpler." description="Travel support for the details around your journey. Service availability is confirmed directly with our team." image={destinationPhotos.pokhara[3]} /><section className="section"><div className="container"><PageIntro label="HERE TO HELP YOU PLAN" title="Support for more of the journey.">These service categories describe planned and enquiry-based support. They are not confirmation of a live reservation system or guaranteed availability.</PageIntro><div className="service-grid">{services.map((service) => <article className="service-card" key={service.slug}><span className="service-number" aria-hidden="true">{service.number}</span><span className="service-status">{service.status}</span><h3>{service.title}</h3><p>{service.description}</p><div className="service-actions"><Link href={`/contact?service=${service.slug}`}>{service.status === 'Coming soon' ? 'Ask about future updates' : 'Make an enquiry'} <ArrowUpRight aria-hidden="true" /></Link><a href={getWhatsAppHref(service.status === 'Coming soon' ? `Hello, I would like to ask about future updates for ${service.title.toLowerCase()}.` : `Hello, I would like to enquire about ${service.title.toLowerCase()}.`)} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> WhatsApp</a></div></article>)}</div></div></section><section className="section section-soft"><div className="container"><PageIntro label="PLANNING AHEAD" title="Not a booking engine—yet.">Online ticketing, reservations, payment and customer accounts are planned for future development. For now, our team can discuss your needs directly and confirm what support is available.</PageIntro><div className="detail-note"><p>Service details, costs and availability should be confirmed with Teenkanya before making travel arrangements.</p><span>Enquiry-based support</span></div></div></section><JourneyCta title="Have a travel detail you’d like help with?" /></>
}
