'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Lenis smooth-scroll provider, mounted in the root layout.
 * Drives Lenis from the GSAP ticker so ScrollTrigger and Lenis share one clock.
 * Disabled automatically for visitors who set prefers-reduced-motion.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, t),
      smoothWheel: true,
    });

    const ticker = gsap.ticker;
    const tick = (time: number) => {
      // GSAP ticker time is seconds; Lenis.raf expects milliseconds.
      lenis.raf(time * 1000);
      ScrollTrigger.update();
    };

    ticker.add(tick);

    return () => {
      ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
