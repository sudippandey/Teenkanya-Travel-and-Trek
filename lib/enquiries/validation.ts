export const enquiryInterests = ['tour', 'trekking', 'travel_service', 'other'] as const
export const contactChannels = ['email', 'phone', 'whatsapp'] as const

export type EnquiryInterest = (typeof enquiryInterests)[number]
export type ContactChannel = (typeof contactChannels)[number]

export interface ValidatedEnquiry {
  submissionId: string
  fullName: string
  email: string | null
  phone: string | null
  countryOfResidence: string | null
  preferredContactChannel: ContactChannel
  interest: EnquiryInterest
  message: string
  travelStartDate: string | null
  datesFlexible: boolean
  travellerCount: number | null
}

export type EnquiryValidationResult =
  | { success: true; value: ValidatedEnquiry }
  | { success: false; fieldErrors: Record<string, string> }

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u
const phonePattern = /^[+0-9().\-\s]+$/u

function normalizeSingleLine(value: string) {
  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u001f\u007f]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
}

function normalizeMessage(value: string) {
  return value
    .normalize('NFKC')
    .replace(/\r\n?/gu, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/gu, '')
    .trim()
}

function optionalText(source: Record<string, unknown>, field: string, fieldErrors: Record<string, string>) {
  const value = source[field]
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string') {
    fieldErrors[field] = 'Enter valid text.'
    return null
  }
  return normalizeSingleLine(value) || null
}

export function validateEnquiry(input: unknown): EnquiryValidationResult {
  const fieldErrors: Record<string, string> = {}
  const source = typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : {}

  const submissionId = typeof source.submissionId === 'string' ? source.submissionId.trim().toLowerCase() : ''
  if (!uuidPattern.test(submissionId)) fieldErrors.submissionId = 'Refresh the form and try again.'

  const fullName = typeof source.fullName === 'string' ? normalizeSingleLine(source.fullName) : ''
  if (fullName.length < 2 || fullName.length > 120) {
    fieldErrors.fullName = 'Enter your name using 2 to 120 characters.'
  }

  const emailValue = optionalText(source, 'email', fieldErrors)
  const email = emailValue?.toLowerCase() ?? null
  if (email && (email.length > 254 || !emailPattern.test(email))) {
    fieldErrors.email = 'Enter a valid email address.'
  }

  const phone = optionalText(source, 'phone', fieldErrors)
  if (phone) {
    const digitCount = phone.replace(/\D/gu, '').length
    if (!phonePattern.test(phone) || digitCount < 7 || digitCount > 15 || phone.length > 30) {
      fieldErrors.phone = 'Enter a valid phone number.'
    }
  }
  if (!email && !phone) fieldErrors.contact = 'Add a phone number or email address so our team can reply.'

  const interest = source.interest
  if (!enquiryInterests.includes(interest as EnquiryInterest)) {
    fieldErrors.interest = 'Choose what you are planning.'
  }

  const message = typeof source.message === 'string' ? normalizeMessage(source.message) : ''
  if (message.length > 3000) fieldErrors.message = 'Keep your message under 3,000 characters.'

  if (Object.keys(fieldErrors).length > 0) return { success: false, fieldErrors }

  return {
    success: true,
    value: {
      submissionId,
      fullName,
      email,
      phone,
      countryOfResidence: null,
      preferredContactChannel: phone && !email ? 'phone' : 'email',
      interest: interest as EnquiryInterest,
      message,
      travelStartDate: null,
      datesFlexible: false,
      travellerCount: null,
    },
  }
}
