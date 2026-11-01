'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { PhotoCredit } from '@/components/photo-credit';
import { gsap, useGSAP } from '@/lib/gsap';
import { destinationPhotos } from '@/lib/travel-data';
import type { BrowseItem } from '@/lib/travel-data';

export function DestinationCard3D({ item, featured = false }: { item: BrowseItem; featured?: boolean }) {
  const cardRef = useRef<HTMLElement>(null);
  const backImage = destinationPhotos[item.slug]?.[1] ?? destinationPhotos[item.slug]?.[0];
  const tilt = featured ? 9 : 6;

  useGSAP(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.48, ease: 'power3.out' });
    const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.48, ease: 'power3.out' });
    const move = (event: PointerEvent) => {
      const bounds = card.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty('--shine-x', `${x * 100}%`);
      card.style.setProperty('--shine-y', `${y * 100}%`);
      card.style.setProperty('--image-x', `${(0.5 - x) * 14}px`);
      card.style.setProperty('--image-y', `${(0.5 - y) * 14}px`);
      rotateX((0.5 - y) * tilt);
      rotateY((x - 0.5) * tilt * 1.35);
    };
    const reset = () => {
      card.style.setProperty('--image-x', '0px');
      card.style.setProperty('--image-y', '0px');
      rotateX(0);
      rotateY(0);
    };

    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', reset);
    return () => {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', reset);
      gsap.set(card, { rotationX: 0, rotationY: 0 });
    };
  }, { scope: cardRef });

  return (
    <article ref={cardRef} className={`destination-3d-card${featured ? ' is-featured' : ''}`}>
      <Link
        className="destination-3d-link"
        href={item.href}
        aria-label={`Explore ${item.title}: ${item.description}`}
        data-cursor-label="EXPLORE"
      >
        <span className="destination-3d-inner">
          <span className="destination-face destination-front">
            <span className="destination-face-image">
              <Image src={item.image} alt="" fill sizes={featured ? '(max-width: 780px) 100vw, 55vw' : '(max-width: 780px) 100vw, 30vw'} loading="lazy" />
            </span>
            <span className="destination-overlay" aria-hidden="true" />
            <span className="destination-topline"><span>{item.category}</span><ArrowUpRight aria-hidden="true" /></span>
            <span className="destination-title">
              <span className="card-location"><MapPin aria-hidden="true" />{item.location}</span>
              <strong>{item.title}</strong>
              <span className="card-description">{item.description}</span>
            </span>
          </span>
          <span className="destination-face destination-back" aria-hidden="true">
            <span className="destination-face-image destination-back-image">
              <Image src={backImage?.src ?? item.image} alt="" fill sizes={featured ? '(max-width: 780px) 100vw, 55vw' : '(max-width: 780px) 100vw, 30vw'} loading="lazy" />
            </span>
            <span className="destination-back-shade" />
            <span className="destination-back-content">
              <span className="destination-back-label">{item.location} / NEPAL</span>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
              <span className="destination-back-link">Explore this place <ArrowUpRight aria-hidden="true" /></span>
            </span>
          </span>
        </span>
      </Link>
      <PhotoCredit className="destination-photo-credit destination-front-credit" credit={item.imageCredit} license={item.imageLicense} sourceUrl={item.imageSource} />
      {backImage && <PhotoCredit className="destination-photo-credit destination-back-credit" credit={backImage.credit} license={backImage.license} sourceUrl={backImage.sourceUrl} />}
    </article>
  );
}
