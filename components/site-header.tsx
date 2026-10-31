'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { label: 'About', href: '/about' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Journeys', href: '/tours' },
  { label: 'Trekking', href: '/trekking' },
  { label: 'Services', href: '/services' },
  { label: 'Journal', href: '/blog' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="topline">
        <div className="container topline-inner">
          <span>Thoughtful journeys, rooted in Nepal</span>
          <a href="tel:+9779851248173">Kathmandu · +977 985 124 8173</a>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="Teenkanya Travel & Trek home" onClick={() => setOpen(false)}>
            <Image src="/teenkanya-logo.jpg" width={64} height={64} alt="" priority className="brand-image" />
            <span className="brand-copy"><strong>Teenkanya</strong><small>Travel &amp; Trek</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </nav>
          <Link className="header-cta" href="/contact">Plan a journey <ArrowUpRight aria-hidden="true" /></Link>
          <button className="mobile-menu-button" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        {open && <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight aria-hidden="true" /></Link>)}
          <Link className="mobile-cta" href="/contact" onClick={() => setOpen(false)}>Plan a journey <ArrowUpRight aria-hidden="true" /></Link>
        </nav>}
      </header>
    </>
  )
}
