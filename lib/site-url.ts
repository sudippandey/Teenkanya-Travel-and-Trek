const fallbackSiteUrl = 'https://3kanyatravel.vercel.app'

export function resolveSiteUrl(configuredSiteUrl?: string, vercelUrl?: string): string {
  const configured = configuredSiteUrl?.trim()
  const deployment = vercelUrl?.trim()
  const candidate = configured || (deployment ? `https://${deployment}` : fallbackSiteUrl)

  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    throw new Error('SITE_URL must be a valid absolute URL')
  }

  const isLocalHttp = parsed.protocol === 'http:'
    && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')
  if (parsed.protocol !== 'https:' && !isLocalHttp) {
    throw new Error('SITE_URL must use HTTPS outside local development')
  }
  if (parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('SITE_URL must contain only the site origin, without credentials, path, query or hash')
  }

  return parsed.origin
}

export const siteUrl = resolveSiteUrl(process.env.SITE_URL, process.env.VERCEL_URL)
