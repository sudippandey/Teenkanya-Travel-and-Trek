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
    ticker.lagSmoothing(0);

    const tick = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
    };

    const subId = ticker.add(tick);

    return () => {
      ticker.remove(subId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
