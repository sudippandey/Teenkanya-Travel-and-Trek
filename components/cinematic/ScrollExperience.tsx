'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function ScrollExperience() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      lerp: 0.085,
      respectReducedMotion: true,
      smoothWheel: true,
      syncTouch: false,
    });
    const updateScroll = (time: number) => lenis.raf(time * 1000);
    const removeScrollListener = lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(updateScroll);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateScroll);
      removeScrollListener();
      lenis.destroy();
      gsap.ticker.lagSmoothing(500, 33);
      ScrollTrigger.refresh();
    };
  }, []);

  return null;
}
