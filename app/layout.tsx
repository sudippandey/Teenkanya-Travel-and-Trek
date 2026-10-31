import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://3kanyatravel.com.np'),
  title: {
    default: 'Teenkanya Travel & Trek | Discover Nepal',
    template: '%s | Teenkanya Travel & Trek',
  },
  description: 'Discover Nepal with Teenkanya Travel & Trek. Explore thoughtfully planned holidays, Himalayan trekking, cultural journeys and travel services from Kathmandu.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Teenkanya Travel & Trek Pvt. Ltd.',
    title: 'Teenkanya Travel & Trek | Discover Nepal',
    description: 'Thoughtfully planned journeys through Nepal, from Kathmandu to the Himalaya.',
    images: [{ url: '/images/nepal-hero.png', width: 1536, height: 1024, alt: 'Sunrise over the Nepal Himalaya' }],
  },
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#201548',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body className="antialiased"><SiteHeader /><main>{children}</main><SiteFooter />{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
