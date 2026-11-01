'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';

gsap.registerPlugin(ScrollTrigger);

/**
 * DestinationReveal — cinematic destination hero reveal.
 * Animates the selected destination image into a larger visual with staggered typography.
 * Uses scroll-triggered entrance and preserves reduced-motion preferences.
 */
export function DestinationReveal({
  image,
  onPlan,
}: {
  image: { src: string; alt: string; credit: string; license: string; sourceUrl: string };
  onPlan?: () => void;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useGSAP(() => {
    const prefersReduced =
      typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReduced);

    if (prefersReduced) return;

    const trigger = heroRef.current;
    if (!trigger) return;

    const q = (sel: string) =>
      Array.from(trigger.querySelectorAll<HTMLElement>(sel));

    // Image fade + scale entrance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    tl.from(q('.dest-name'), { y: 40, autoAlpha: 0, duration: 0.6, ease: 'power2.out' },
      '<');
    tl.from(q('.dest-description'), { y: 30, autoAlpha: 0, duration: 0.5, ease: 'power2.out' },
      '<');
    tl.from(q('.dest-cta'), { y: 30, autoAlpha: 0, duration: 0.5, ease: 'power2.out' },
      '<');

    return () => tl.scrollTrigger?.kill();
  });

  const nameChars = image.alt.split('').map((char, i) => (
    <span key={i} className="reveal-char" style={{ animationDelay: `${i * 0.05}s` }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  );

  const planHref = onPlan ? undefined : `/contact?destination=${image.alt}`;

  return (
    <section
      ref={heroRef}
      className="dest-reveal"
      style={{ '--hero-image': `url(${image.src})` }}
    >
      <div className="dest-reveal-content">
        <span className="dest-reveal-eyebrow">Discover new horizons</span>
        <h1 className="dest-reveal-title">{nameChars}</h1>
        <p className="dest-reveal-description">{image.alt}</p>
        {onPlan ? null : (
          <Link
            href={planHref}
            className="dest-reveal-cta"
            aria-label="Plan a trip to this destination"
          >
            Plan your journey <ArrowUpRight aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="dest-reveal-bottomline">
        <span>Photo credit: {image.credit}</span>
        <a
          href={image.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="dest-reveal-credit"
        >
          View source
        </a>
      </div>
    </section>
  );
}
