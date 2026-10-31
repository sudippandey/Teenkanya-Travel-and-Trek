type PhotoCreditProps = {
  credit: string
  license: string
  sourceUrl: string
  className?: string
}

function licenseUrl(license: string) {
  if (license === 'CC0') return 'https://creativecommons.org/publicdomain/zero/1.0/'
  if (license === 'Public domain') return 'https://creativecommons.org/publicdomain/mark/1.0/'

  const match = /^CC (BY(?:-SA)?) (\d+(?:\.\d+)*)$/u.exec(license)
  if (!match) return 'https://creativecommons.org/share-your-work/cclicenses/'

  return `https://creativecommons.org/licenses/${match[1].toLowerCase()}/${match[2]}/`
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
