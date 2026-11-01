'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Compass, MapPin } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Magnetic } from '@/components/cinematic';
import type { DestinationImage } from '@/lib/travel-data';

gsap.registerPlugin(ScrollTrigger);

/**
 * DestinationHero — cinematic, story-driven hero for destination detail pages.
 *
 * Layers of parallax (sky → landscape → foreground haze) give depth as the user
 * scrolls. The destination name assembles with a staggered character reveal,
 * evoking arrival. A subtle atmospheric drift keeps the hero alive without
 * competing with the content.
 *
 * Respects prefers-reduced-motion: skips all scroll-scrubbed animation.
 */
export function DestinationHero({
  destination,
  image,
  onPlan,
}: {
  destination: { title: string; region: string; slug: string };
  image: DestinationImage;
  onPlan?: () => void;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const trigger = heroRef.current;
    if (!trigger) return;

    const q = (sel: string) =>
      Array.from(trigger.querySelectorAll<HTMLElement>(sel));

    // Multi-layer parallax: sky (slowest), image (mid), haze (fastest)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.4,
      },
    });

    tl.to(q('.hero-layer-sky'), { yPercent: -12 }, '<')
      .to(q('.hero-layer-image'), { yPercent: -6 }, '<')
      .to(q('.hero-layer-haze'), { yPercent: 20 }, '<');

    // Gentle breathing drift on the hero image layer (time-based, not scroll-linked)
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.04,
        duration: 6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    }

    // useGSAP reverts its context on unmount, including the infinite image tween
    // and the timeline's ScrollTrigger.
  }, []);

  // Cinematic character-by-character reveal of the destination name
  const nameChars = destination.title.split('').map((char, i) => (
    <span key={i} className="hero-char" style={{ animationDelay: `${i * 0.06}s` }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  const planHref = `/contact?destination=${destination.slug}`;

  return (
    <section
      ref={heroRef}
      className="cinematic-hero"
    >
      {/* Sky layer — slowest parallax */}
      <div className="hero-layer hero-layer-sky" />

      {/* Main image layer — mid parallax, breathing drift */}
      <div
        ref={imageRef}
        className="hero-layer hero-layer-image"
        style={{ '--hero-image': `url(${image.src})` } as React.CSSProperties}
      />

      {/* Foreground haze layer — fastest parallax, adds depth */}
      <div className="hero-layer hero-layer-haze" />

      <div className="container cinematic-hero-content">
        <div className="cinematic-hero-eyebrow">
          <span className="compass-marker"><Compass size={16} strokeWidth={2} /></span>
          <span>{destination.region}</span>
        </div>

        <h1 className="cinematic-hero-title">
          {nameChars}
        </h1>

        <p className="cinematic-hero-copy">
          Explore {destination.title}. Grounded in local context, shaped around your pace.
        </p>

        <div className="cinematic-hero-actions">
          {onPlan ? (
            <button
              className="button button-light magnetic"
              onClick={onPlan}
              aria-label="Plan this journey"
            >
              Start planning <ArrowUpRight size={18} strokeWidth={2} />
            </button>
          ) : (
            <Link
              className="button button-light magnetic"
              href={planHref}
              aria-label={`Plan a journey to ${destination.title}`}
            >
              Start planning <ArrowUpRight size={18} strokeWidth={2} />
            </Link>
          )}
          <Link
            className="button button-outline-light magnetic"
            href={`${planHref}&source=detail`}
            aria-label={`Ask about ${destination.title}`}
          >
            Ask about this place <MapPin size={18} strokeWidth={2} />
          </Link>
        </div>
      </div>

      <div className="cinematic-hero-bottomline">
        <span>Photo credit: {image.credit}</span>
        <a
          href={image.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="text-link"
        >
          View source
        </a>
      </div>
    </section>
  );
}
