import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-intro">
          <span className="eyebrow eyebrow-light">TEENKANYA TRAVEL &amp; TREK PVT. LTD.</span>
          <h2>Let the journey<br />take shape.</h2>
          <Link className="footer-cta" href="/contact">Start planning <ArrowUpRight aria-hidden="true" /></Link>
        </div>
        <div className="footer-column"><h3>Explore</h3><Link href="/about">About us</Link><Link href="/destinations">Destinations</Link><Link href="/tours">Tours &amp; packages</Link><Link href="/trekking">Trekking</Link></div>
        <div className="footer-column"><h3>Discover</h3><Link href="/services">Travel services</Link><Link href="/blog">Travel journal</Link><Link href="/contact">Contact</Link></div>
        <div className="footer-column footer-contact"><h3>Say hello</h3><a href="tel:+9779851248173"><Phone aria-hidden="true" />+977 9851248173</a><a href="mailto:3kanya2018@gmail.com"><Mail aria-hidden="true" />3kanya2018@gmail.com</a><span><MapPin aria-hidden="true" />Kathmandu, Nepal</span><a href="https://www.facebook.com/teenkanyatravel/" target="_blank" rel="noreferrer">Facebook <ArrowUpRight aria-hidden="true" /></a></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Teenkanya Travel &amp; Trek Pvt. Ltd.</span><span>Thoughtfully planned journeys in Nepal.</span></div>
    </footer>
  )
}
