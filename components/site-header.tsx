'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TrackedLink } from '@/components/tracked-link'

const links = [
  { label: 'About', href: '/about' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Nepal tours', href: '/tours' },
  { label: 'Trekking', href: '/trekking' },
  { label: 'Services', href: '/services' },
  { label: 'Journal', href: '/blog' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12)
    updateScrolled()
    window.addEventListener('scroll', updateScrolled, { passive: true })
    return () => window.removeEventListener('scroll', updateScrolled)
  }, [])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <>
      <div className="topline">
        <div className="container topline-inner">
          <span>Thoughtful journeys, rooted in Nepal</span>
          <TrackedLink href="tel:+9779851248173" eventName="contact_click" eventProperties={{ channel: 'phone', location: 'header' }}>Kathmandu · +977 985 124 8173</TrackedLink>
        </div>
      </div>
      <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="Teenkanya Travel & Trek home" onClick={() => setOpen(false)}>
            <Image src="/teenkanya-logo.png" width={1613} height={924} alt="" priority className="brand-image" />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </nav>
          <TrackedLink className="header-cta" href="/contact" eventName="contact_click" eventProperties={{ channel: 'enquiry', location: 'header' }}>Plan your trip <ArrowUpRight aria-hidden="true" /></TrackedLink>
          <button className="mobile-menu-button" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        {open && <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight aria-hidden="true" /></Link>)}
          <TrackedLink className="mobile-cta" href="/contact" onClick={() => setOpen(false)} eventName="contact_click" eventProperties={{ channel: 'enquiry', location: 'mobile_header' }}>Plan your trip <ArrowUpRight aria-hidden="true" /></TrackedLink>
        </nav>}
      </header>
    </>
  )
}
