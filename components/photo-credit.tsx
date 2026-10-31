type PhotoCreditProps = {
  credit: string
  license: string
  sourceUrl: string
  className?: string
}

function licenseUrl(license: string) {
  if (license === 'CC0') return 'https://creativecommons.org/publicdomain/zero/1.0/'
  if (license === 'Public domain') return 'https://creativecommons.org/publicdomain/mark/1.0/'
  return `https://creativecommons.org/licenses/${license.toLowerCase().replaceAll(' ', '-')}/`
}

export function PhotoCredit({ credit, license, sourceUrl, className = '' }: PhotoCreditProps) {
  return (
    <span className={`photo-credit ${className}`}>
      <a href={sourceUrl} target="_blank" rel="noreferrer" aria-label={`Photo by ${credit}; view source attribution`}>
        Photo: {credit}
      </a>
      <span aria-hidden="true">·</span>
      <a href={licenseUrl(license)} target="_blank" rel="noreferrer">{license}</a>
    </span>
  )
}
