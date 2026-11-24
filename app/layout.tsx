import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AmbientSoundPlayer } from '@/components/ambient-sound-player'
import { serializeJsonLd } from '@/lib/article-structured-data'
import { business, siteUrl } from '@/lib/site-config'
import './globals.css'

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  '@id': `${siteUrl}/#organization`,
  name: business.name,
  alternateName: business.shortName,
  url: siteUrl,
  logo: new URL(business.logo, siteUrl).toString(),
  telephone: business.telephone,
  email: business.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: business.city,
    addressCountry: business.country,
  },
  sameAs: [business.facebook],
  knowsAbout: ['Nepal tour packages', 'Trekking and hiking', 'Domestic tours', 'International travel planning', 'Adventure activities', 'Travel arrangements', 'Hotel and accommodation bookings'],
}

const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: business.shortName,
  url: siteUrl,
  publisher: { '@id': `${siteUrl}/#organization` },
  inLanguage: 'en',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Teenkanya Travel & Trek | Thoughtful Journeys Through Nepal',
    template: '%s | Teenkanya Travel & Trek',
  },
  description: 'Plan Nepal tours, treks, domestic journeys and international travel with Teenkanya, a Kathmandu-based agency serving travellers in Nepal and abroad.',
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Teenkanya Travel & Trek Pvt. Ltd.',
    title: 'Teenkanya Travel & Trek | Thoughtful Journeys Through Nepal',
    description: 'Thoughtful journeys through Nepal, from Kathmandu Valley to the high Himalaya.',
    images: [{ url: '/images/destinations/everest-region/01.jpg', width: 1200, height: 800, alt: 'Khumbu Glacier and Himalayan peaks in Sagarmatha National Park' }],
  },
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#2C1A3D',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationStructuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteStructuredData) }} />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <AmbientSoundPlayer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
