import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { siteUrl } from '@/lib/site-url'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Teenkanya Travel & Trek | Thoughtful Journeys Through Nepal',
    template: '%s | Teenkanya Travel & Trek',
  },
  description: 'Plan thoughtful holidays, cultural journeys and Himalayan treks through Nepal with a Kathmandu-based travel team.',
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
  themeColor: '#26382f',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
