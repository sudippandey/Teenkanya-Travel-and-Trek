'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@/lib/gsap';

// Register plugins once so bundlers don't tree-shake them.
gsap.registerPlugin(ScrollTrigger);

/**
 * Pinch/mouse-following transform used for magnetic buttons and pull cues.
 * Values are unitless fractions of the viewport, so the feel is the same on
 * mobile and desktop.
 */
export function useMouse() {
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const update = (event: MouseEvent) => {
      setPosition({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', update);
    return () => window.removeEventListener('mousemove', update);
  }, []);

  return position;
}

/**
 * A magnetic "pull" on a pointer device. translateX/translateY are the
 * multipliers applied to the mouse offset from centre.
 */
export function Magnetic({
  children,
  translateX = 6,
  translateY = -10,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
  translateX?: number;
  translateY?: number;
}) {
  const { x, y } = useMouse();
  const pullX = Math.round((x - 0.5) * translateX);
  const pullY = Math.round((y - 0.5) * translateY);

  return (
    <span
      className={`magnetic ${className}`}
      style={{
        transform: `translate(${pullX}px, ${pullY}px)`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </span>
  );
}

/**
 * Animations the moment a section begins to enter the viewport, then lets it
 * settle. `start` / `end` define the trigger range; `scrub` ties the animation
 * to the scroll position for buttery follow-through.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  start = 'top 86%',
  end = 'bottom 16%',
  y = 72,
  opacity = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  start?: string;
  end?: string;
  y?: number;
  opacity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const target = ref.current;
    if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.fromTo(target, { autoAlpha: opacity, y },
      autoAlpha: 1,
      y: 0,
      duration: 1.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: target,
        start,
        end,
        scrub: 1.5,
      },
    });
  }, [delay, start, end, y, opacity]);

  return (
    <div
      ref={ref}
      className={`reveal${className ? ` ${className}` : ''}`}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </div>
  );
}

/**
 * Staggered entrance for a list of related items (for example the day-by-day
 * itinerary). Each item is timed to the scroll position, so the list "opens"
 * as you scroll through a journey.
 */
export function RevealList({
  items,
  className = '',
  delay = 0,
  start = 'top 86%',
  end = 'bottom 16%',
  y = 56,
}: {
  items: React.ReactNode[];
  className?: string;
  delay?: number;
  start?: string;
  end?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = ref.current;
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const children = gsap.utils.toArray(container.querySelectorAll(':scope > *'));
    if (!children.length) return;

    gsap.fromTo(children, { autoAlpha: 0, y }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start,
        end,
        scrub: 1.3,
      },
      stagger: { each: 0.14, from: 'start' },
    });
  }, [delay, start, end, y]);

  return (
    <div
      ref={ref}
      className={`reveal-list${className ? ` ${className}` : ''}`}
      style={{ willChange: 'transform, opacity' }}
    >
      {items}
    </div>
  );
}
