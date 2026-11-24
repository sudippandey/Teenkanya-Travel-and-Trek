import type { Metadata } from 'next'
import Link from 'next/link'
import { business } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: 'How Teenkanya Travel & Trek handles travel enquiries, contact details and website analytics.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Notice | Teenkanya Travel & Trek',
    description: 'How we use travel enquiry information and website analytics.',
  },
}

export default function PrivacyPage() {
  return (
    <article className="privacy-page">
      <div className="container privacy-content">
        <span className="eyebrow">TEENKANYA TRAVEL &amp; TREK PVT. LTD.</span>
        <h1>Privacy <em>notice.</em></h1>
        <p className="privacy-updated">Last updated: 24 November 2026</p>
        <p>When you contact us, we use the information you choose to share to respond to your enquiry and discuss possible travel arrangements. Sending an enquiry is not a booking confirmation or an opt-in to unrelated marketing.</p>

        <h2>Information you may provide</h2>
        <p>This can include your name, email address or phone number, country of residence, preferred travel dates, travel focus, destination or package, budget range and the message you send. Please do not include passport numbers, payment card details, medical records or other sensitive information in the enquiry form.</p>

        <h2>How we use and store it</h2>
        <p>Enquiry details are stored to help the Teenkanya team respond and coordinate the requested travel discussion. The site uses Supabase for enquiry storage and Web3Forms for email notifications when that service is configured. Vercel provides the website hosting and page analytics. Custom analytics events contain only non-identifying categories such as enquiry type, contact channel and page location—not names, contact details or message text.</p>
        <p>We do not sell enquiry details or use them to create advertising profiles. If an itinerary involves a partner operator, we will identify the relevant operator and information sharing before you commit to that trip.</p>

        <h2>Retention and service providers</h2>
        <p><strong>Retention period: [Business owner to confirm and publish the enquiry retention schedule.]</strong> Supabase, Vercel and Web3Forms may process information in locations outside Nepal. The business owner should confirm applicable data-location, transfer and local-consent requirements before launch. Service-provider privacy terms also apply to their processing.</p>

        <h2>Your choices and requests</h2>
        <p>You can ask us to access, correct or delete enquiry information by contacting us. We will handle requests subject to applicable legal and record-keeping requirements. The website does not ask for payment or account information.</p>

        <h2>Contact the business</h2>
        <address className="privacy-contact">
          {business.name}<br />
          Kathmandu, Nepal<br />
          <a href={`mailto:${business.email}`}>{business.email}</a><br />
          <a href={`tel:${business.telephone}`}>{business.telephone}</a>
        </address>
        <p className="privacy-owner-note">Owner follow-up before publication: confirm the data retention period, full registered address, and jurisdiction-specific privacy and analytics consent requirements.</p>
        <Link className="text-link" href="/contact">Return to contact <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  )
}
