'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { galleryImages } from '@/lib/travel-data'

export function TravelGallery() {
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    if (active === null) return
    function onKeyDown(event: KeyboardEvent) { if (event.key === 'Escape') setActive(null) }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = '' }
  }, [active])

  return <>
    <div className="gallery-grid">
      {galleryImages.map((image, index) => <button className={`gallery-item gallery-item-${index + 1}`} type="button" key={image.src} onClick={() => setActive(index)} aria-label={`Open photo: ${image.alt}`}><img src={image.src} alt={image.alt} loading="lazy" /><span className="gallery-caption">Nepal, through our lens</span></button>)}
    </div>
    {active !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Travel photo gallery" onClick={() => setActive(null)}><button className="lightbox-close" type="button" aria-label="Close photo" onClick={() => setActive(null)}><X aria-hidden="true" /></button><figure onClick={(event) => event.stopPropagation()}><img src={galleryImages[active].src} alt={galleryImages[active].alt} /><figcaption>{galleryImages[active].alt}</figcaption></figure></div>}
  </>
}
