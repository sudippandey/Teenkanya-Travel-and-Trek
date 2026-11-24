const temporarySiteUrl = 'https://3kanyatravel.vercel.app'

function getSiteUrl(value: string | undefined) {
  if (!value?.trim()) return temporarySiteUrl

  try {
    return new URL(value).origin
  } catch {
    return temporarySiteUrl
  }
}

export const siteUrl = getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

export const business = {
  name: 'Teenkanya Travel & Trek Pvt. Ltd.',
  shortName: 'Teenkanya Travel & Trek',
  phone: '+977 985 124 8173',
  telephone: '+9779851248173',
  email: '3kanya2018@gmail.com',
  city: 'Kathmandu',
  country: 'NP',
  facebook: 'https://www.facebook.com/teenkanyatravel/',
  logo: '/teenkanya-logo.png',
} as const
