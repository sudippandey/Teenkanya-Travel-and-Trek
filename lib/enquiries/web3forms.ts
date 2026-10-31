import type { EnquiryDeliverySnapshot } from './submission-workflow'

const web3FormsEndpoint = 'https://api.web3forms.com/submit'

export type Web3FormsFailureReason = 'configuration' | 'unavailable' | 'rejected'

export type Web3FormsResult =
  | { success: true }
  | { success: false; reason: Web3FormsFailureReason }

interface Web3FormsOptions {
  accessKey: string | undefined
  fetcher?: typeof fetch
  timeoutMs?: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function createWeb3FormsNotifier({
  accessKey,
  fetcher = fetch,
  timeoutMs = 3_000,
}: Web3FormsOptions) {
  return async (enquiry: EnquiryDeliverySnapshot): Promise<Web3FormsResult> => {
    const configuredAccessKey = accessKey?.trim()

    if (!configuredAccessKey) {
      return { success: false, reason: 'configuration' }
    }

    const message = [
      `Reference: ${enquiry.reference}`,
      `Name: ${enquiry.fullName}`,
      enquiry.email ? `Email: ${enquiry.email}` : null,
      enquiry.phone ? `Phone: ${enquiry.phone}` : null,
      enquiry.countryOfResidence ? `Country of residence: ${enquiry.countryOfResidence}` : null,
      `Preferred contact: ${enquiry.preferredContactChannel}`,
      `Interest: ${enquiry.interest}`,
      enquiry.catalogueItemType && enquiry.catalogueItemSlug
        ? `Trip: ${enquiry.catalogueItemType} / ${enquiry.catalogueItemSlug}`
        : null,
      enquiry.travelStartDate ? `Travel date: ${enquiry.travelStartDate}` : null,
      `Dates flexible: ${enquiry.datesFlexible ? 'Yes' : 'No'}`,
      enquiry.travellerCount ? `Travellers: ${enquiry.travellerCount}` : null,
      `Source page: ${enquiry.sourcePage}`,
      '',
      'Message:',
      enquiry.message,
      ...(enquiry.specialRequirements ? ['', 'Special requirements:', enquiry.specialRequirements] : []),
    ].filter((line): line is string => line !== null).join('\n')

    const payload: Record<string, string> = {
      access_key: configuredAccessKey,
      subject: `New ${enquiry.interest.replaceAll('_', ' ')} enquiry ${enquiry.reference}`,
      from_name: 'Teenkanya Travel & Trek website',
      name: enquiry.fullName,
      message,
    }

    if (enquiry.email) {
      payload.email = enquiry.email
      payload.replyto = enquiry.email
    }
    if (enquiry.phone) payload.phone = enquiry.phone

    try {
      const response = await fetcher(web3FormsEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(timeoutMs),
      })

      let result: unknown
      try {
        result = await response.json()
      } catch {
        return { success: false, reason: 'rejected' }
      }

      if (response.ok && isRecord(result) && result.success === true) {
        return { success: true }
      }

      return { success: false, reason: 'rejected' }
    } catch {
      return { success: false, reason: 'unavailable' }
    }
  }
}
