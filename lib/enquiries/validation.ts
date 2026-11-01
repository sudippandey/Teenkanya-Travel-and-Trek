export const enquiryInterests = ['tour', 'trekking', 'travel_service', 'other'] as const
export const contactChannels = ['email', 'phone', 'whatsapp'] as const
export const catalogueItemTypes = ['destination', 'package', 'trek'] as const

export type EnquiryInterest = (typeof enquiryInterests)[number]
export type ContactChannel = (typeof contactChannels)[number]
export type CatalogueItemType = (typeof catalogueItemTypes)[number]
export type CatalogueLookup = (type: CatalogueItemType, slug: string) => boolean

export interface EnquiryValidationOptions {
  /** Catalogue selections must be verified against the current catalogue. */
  isKnownCatalogueItem?: CatalogueLookup
}

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
  catalogueItemType: CatalogueItemType | null
  catalogueItemSlug: string | null
  specialRequirements: string | null
}

export type EnquiryValidationResult =
  | { success: true; value: ValidatedEnquiry }
  | { success: false; fieldErrors: Record<string, string> }

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u
const phonePattern = /^[+0-9().\-\s]+$/u
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u

function isPresent(value: unknown) {
  return value !== undefined && value !== null && value !== ''
}

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

function optionalText(
  source: Record<string, unknown>,
  field: string,
  fieldErrors: Record<string, string>,
) {
  const value = source[field]

  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string') {
    fieldErrors[field] = 'Enter valid text.'
    return null
  }

  return normalizeSingleLine(value) || null
}

function isValidDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) return false

  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export function validateEnquiry(
  input: unknown,
  options: EnquiryValidationOptions = {},
): EnquiryValidationResult {
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

  const countryOfResidence = optionalText(source, 'countryOfResidence', fieldErrors)
  if (countryOfResidence && countryOfResidence.length > 100) {
    fieldErrors.countryOfResidence = 'Keep the country name under 100 characters.'
  }

  const preferredContactChannel = source.preferredContactChannel
  if (!contactChannels.includes(preferredContactChannel as ContactChannel)) {
    fieldErrors.preferredContactChannel = 'Choose a preferred contact method.'
  }

  const interest = source.interest
  if (!enquiryInterests.includes(interest as EnquiryInterest)) {
    fieldErrors.interest = 'Choose what you are planning.'
  }

  if (!email && !phone) fieldErrors.contact = 'Provide an email address or phone number.'
  if (preferredContactChannel === 'email' && !email) {
    fieldErrors.preferredContactChannel = 'Provide an email address or choose another contact method.'
  }
  if ((preferredContactChannel === 'phone' || preferredContactChannel === 'whatsapp') && !phone) {
    fieldErrors.preferredContactChannel = 'Provide a phone number for your selected contact method.'
  }

  const message = typeof source.message === 'string' ? normalizeMessage(source.message) : ''
  if (message.length < 10 || message.length > 4000) {
    fieldErrors.message = 'Write a message using 10 to 4,000 characters.'
  }

  let travelStartDate: string | null = null
  if (source.travelStartDate !== undefined && source.travelStartDate !== null && source.travelStartDate !== '') {
    if (typeof source.travelStartDate !== 'string' || !isValidDate(source.travelStartDate)) {
      fieldErrors.travelStartDate = 'Enter a valid travel date.'
    } else {
      travelStartDate = source.travelStartDate
    }
  }

  let datesFlexible = false
  if (source.datesFlexible !== undefined) {
    if (typeof source.datesFlexible !== 'boolean') {
      fieldErrors.datesFlexible = 'Choose whether your travel dates are flexible.'
    } else {
      datesFlexible = source.datesFlexible
    }
  }

  let travellerCount: number | null = null
  if (source.travellerCount !== undefined && source.travellerCount !== null && source.travellerCount !== '') {
    const parsedCount = typeof source.travellerCount === 'number'
      ? source.travellerCount
      : typeof source.travellerCount === 'string' && /^\d+$/u.test(source.travellerCount)
        ? Number(source.travellerCount)
        : Number.NaN

    if (!Number.isInteger(parsedCount) || parsedCount < 1 || parsedCount > 50) {
      fieldErrors.travellerCount = 'Enter a whole number from 1 to 50.'
    } else {
      travellerCount = parsedCount
    }
  }

  let catalogueItemType: CatalogueItemType | null = null
  let catalogueItemSlug: string | null = null
  if (isPresent(source.catalogueItemType) || isPresent(source.catalogueItemSlug)) {
    const rawType = source.catalogueItemType
    const rawSlug = source.catalogueItemSlug
    const wellFormed = catalogueItemTypes.includes(rawType as CatalogueItemType)
      && typeof rawSlug === 'string'
      && rawSlug.length <= 120
      && slugPattern.test(rawSlug)

    if (!wellFormed) {
      fieldErrors.catalogueItem = 'The selected trip could not be read. Refresh the page and try again.'
    } else if (!options.isKnownCatalogueItem || !options.isKnownCatalogueItem(rawType as CatalogueItemType, rawSlug)) {
      fieldErrors.catalogueItem = 'The selected trip is no longer available. Choose another trip and try again.'
    } else {
      catalogueItemType = rawType as CatalogueItemType
      catalogueItemSlug = rawSlug
    }
  }

  let specialRequirements: string | null = null
  if (isPresent(source.specialRequirements)) {
    if (typeof source.specialRequirements !== 'string') {
      fieldErrors.specialRequirements = 'Enter valid text.'
    } else {
      specialRequirements = normalizeMessage(source.specialRequirements) || null
      if (specialRequirements && specialRequirements.length > 1000) {
        fieldErrors.specialRequirements = 'Keep special requirements under 1,000 characters.'
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) return { success: false, fieldErrors }

  return {
    success: true,
    value: {
      submissionId,
      fullName,
      email,
      phone,
      countryOfResidence,
      preferredContactChannel: preferredContactChannel as ContactChannel,
      interest: interest as EnquiryInterest,
      message,
      travelStartDate,
      datesFlexible,
      travellerCount,
      catalogueItemType,
      catalogueItemSlug,
      specialRequirements,
    },
  }
}
