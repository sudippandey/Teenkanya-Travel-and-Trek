import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { JourneyCta, PageHero, PageIntro } from '@/components/page-templates'

export const metadata: Metadata = { title: 'About Us', description: 'Meet Teenkanya Travel & Trek, a Kathmandu-based company helping travelers plan thoughtful journeys through Nepal.' }

const values = [
  ['01', 'Personal planning', 'Journeys shaped around your interests, time and travel style.'],
  ['02', 'Local perspective', 'Practical context and place knowledge rooted in Kathmandu.'],
  ['03', 'Clear communication', 'Helpful guidance, realistic expectations and room for questions.'],
  ['04', 'Respectful travel', 'A considered approach to the places and communities that welcome visitors.'],
]

export default function AboutPage() {
  return <>
    <PageHero eyebrow="ABOUT TEENKANYA" title="Travel, with a little more meaning." description="A Kathmandu-based travel company helping you discover Nepal at your own pace." image="https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1800&q=85" />
    <section className="section"><div className="container editorial-section"><div className="editorial-image"><img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85" alt="Intricate traditional architecture in Nepal" loading="lazy" /></div><div className="editorial-copy"><span className="eyebrow">OUR INTRODUCTION</span><h2>Rooted in Kathmandu. <em>Open to the world.</em></h2><p>Teenkanya Travel &amp; Trek Pvt. Ltd. is based in Kathmandu, Nepal. We help travelers explore the country through cultural visits, thoughtfully planned holidays and trekking journeys.</p><p>This page is the beginning of our digital story. As the company shares more about its origins and team, this introduction can grow with verified details.</p><Link className="text-link" href="/contact">Start a conversation</Link></div></div></section>
    <section className="section section-soft"><div className="container"><PageIntro label="WHAT WE BELIEVE" title="Travel should feel considered, from the first question to the last day." >We want every journey to begin with a good conversation: what matters to you, how you like to travel, and what you hope to discover.</PageIntro><div className="value-grid">{values.map(([number, title, description]) => <article className="value-card" key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
    <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">OUR VISION &amp; MISSION</span><h2>A better way to <em>begin.</em></h2></div><p>These guiding statements are a working introduction, ready to be refined by the Teenkanya team.</p></div><div className="experience-grid about-purpose"><article className="experience-card"><span className="experience-number">OUR VISION</span><h3>Make Nepal feel closer.</h3><p>Help travelers connect with Nepal’s places and people through journeys that feel welcoming, thoughtful and personal.</p></article><article className="experience-card"><span className="experience-number">OUR MISSION</span><h3>Make planning simpler.</h3><p>Offer clear guidance and flexible travel ideas so visitors can explore Nepal with confidence and curiosity.</p></article><article className="experience-card"><span className="experience-number">OUR TEAM</span><h3>People behind the plans.</h3><p>Team profiles will be added here when Teenkanya provides verified names, roles and photographs.</p><Link className="text-link" href="/contact">Meet us through a conversation</Link></article></div></div></section>
    <section className="section"><div className="container"><div className="cta-band"><div><span className="eyebrow">KATHMANDU, NEPAL</span><h2>Tell us what brings you here.</h2></div><Link className="button" href="/contact">Get in touch <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
  </>
}
