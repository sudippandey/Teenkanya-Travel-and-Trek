'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { PhotoCredit } from '@/components/photo-credit'
import type { DestinationImage } from '@/lib/travel-data'

export function TravelGallery({ images, label = 'Travel photo gallery' }: { images: DestinationImage[]; label?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const activeIndexRef = useRef(activeIndex)
  const isOpen = activeIndex !== null
  activeIndexRef.current = activeIndex

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      const currentIndex = activeIndexRef.current
      if (currentIndex === null) return

      if (event.key === 'Escape') {
        event.preventDefault()
        setActiveIndex(null)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        setActiveIndex((currentIndex + 1) % images.length)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActiveIndex((currentIndex - 1 + images.length) % images.length)
      } else if (event.key === 'Tab') {
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])')
        if (!controls?.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      triggerRef.current?.focus()
    }
  }, [isOpen, images.length])

  function closeGallery() {
    setActiveIndex(null)
  }

  return (
    <>
      <div className="gallery-grid" aria-label={label}>
        {images.map((image, index) => (
          <figure className={`gallery-item gallery-item-${index + 1}`} key={image.src}>
            <button
              className="gallery-open"
              type="button"
              onClick={(event) => { triggerRef.current = event.currentTarget; setActiveIndex(index) }}
              aria-label={`Open photo: ${image.alt}`}
              data-cursor-label="VIEW"
            >
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 520px) 50vw, (max-width: 780px) 40vw, 25vw" loading="lazy" />
              <span className="gallery-caption">{image.caption}</span>
            </button>
            <PhotoCredit credit={image.credit} license={image.license} sourceUrl={image.sourceUrl} />
          </figure>
        ))}
      </div>
      {activeIndex !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={label} ref={dialogRef} onClick={closeGallery} tabIndex={-1}>
          <button className="lightbox-close" ref={closeButtonRef} type="button" aria-label="Close photo gallery" onClick={closeGallery}><X aria-hidden="true" /></button>
          <div className="lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <div className="lightbox-image-wrap">
              <Image src={images[activeIndex].src} alt={images[activeIndex].alt} fill sizes="100vw" quality={90} />
              <button className="lightbox-step lightbox-previous" type="button" aria-label="Previous photo" onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}><ChevronLeft aria-hidden="true" /></button>
              <button className="lightbox-step lightbox-next" type="button" aria-label="Next photo" onClick={() => setActiveIndex((activeIndex + 1) % images.length)}><ChevronRight aria-hidden="true" /></button>
            </div>
            <div className="lightbox-caption">
              <div><p>{images[activeIndex].caption}</p><PhotoCredit credit={images[activeIndex].credit} license={images[activeIndex].license} sourceUrl={images[activeIndex].sourceUrl} /></div>
              <span aria-live="polite">{activeIndex + 1} / {images.length}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
