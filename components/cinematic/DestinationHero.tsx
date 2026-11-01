'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Compass, MapPin } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Magnetic } from '@/components/cinematic';
import type { CSSProperties } from 'react';
import type { Destination, DestinationImage } from '@/lib/travel-data';

export function DestinationHero({
  destination,
  image,
  onPlan,
}: {
  destination: Pick<Destination, 'title' | 'region' | 'slug' | 'description'>;
  image: DestinationImage;
  onPlan?: () => void;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hero = heroRef.current;
    if (!hero) return;

    const layers = (selector: string) => Array.from(hero.querySelectorAll<HTMLElement>(selector));
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.4,
      },
    });

    timeline
      .to(layers('.hero-layer-sky'), { yPercent: -12 }, 0)
      .to(layers('.hero-layer-image'), { yPercent: -6 }, 0)
      .to(layers('.hero-layer-haze'), { yPercent: 20 }, 0);

    const breathing = imageRef.current
      ? gsap.to(imageRef.current, {
          scale: 1.035,
          duration: 7,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      : null;

    return () => {
      timeline.scrollTrigger?.kill();
      breathing?.kill();
    };
  }, { scope: heroRef });

  const planHref = `/contact?destination=${encodeURIComponent(destination.slug)}`;

  return (
    <section ref={heroRef} className="cinematic-hero">
      <div className="hero-layer hero-layer-sky" aria-hidden="true" />
      <div
        ref={imageRef}
        className="hero-layer hero-layer-image"
        role="img"
        aria-label={image.alt}
        style={{ '--hero-image': `url("${image.src}")` } as CSSProperties}
      />
      <div className="hero-layer hero-layer-haze" aria-hidden="true" />

      <div className="container cinematic-hero-content">
        <nav className="breadcrumb cinematic-hero-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/destinations">Destinations</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{destination.title}</span>
        </nav>

        <div className="cinematic-hero-eyebrow">
          <span className="compass-marker"><Compass size={16} strokeWidth={2} aria-hidden="true" /></span>
          <span>{destination.region}</span>
        </div>

        <h1 className="cinematic-hero-title">
          {destination.title.split('').map((char, index) => (
            <span key={index} className="hero-char" style={{ animationDelay: `${index * 0.055}s` }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <p className="cinematic-hero-copy">{destination.description}</p>

        <div className="cinematic-hero-actions">
          <Magnetic>
            {onPlan ? (
              <button className="button button-light" onClick={onPlan} aria-label="Plan this journey">
                Start planning <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            ) : (
              <Link className="button button-light" href={planHref} aria-label={`Plan a journey to ${destination.title}`}>
                Start planning <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            )}
          </Magnetic>
          <Magnetic>
            <Link className="button button-outline-light" href={`${planHref}&source=detail`} aria-label={`Ask about ${destination.title}`}>
              Ask about this place <MapPin size={18} aria-hidden="true" />
            </Link>
          </Magnetic>
        </div>
      </div>

      <div className="cinematic-hero-bottomline">
        <span>Photo credit: {image.credit}</span>
        <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-link">
          View source
        </a>
      </div>
    </section>
  );
}
