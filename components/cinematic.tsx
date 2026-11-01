'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  start?: string;
  end?: string;
  y?: number;
  opacity?: number;
};

/** Scroll-linked section reveal that leaves content visible when motion is reduced. */
export function Reveal({
  children,
  className = '',
  start = 'top 86%',
  end = 'bottom 16%',
  y = 48,
  opacity = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = ref.current;
    if (!target) return;

    gsap.fromTo(target, { autoAlpha: opacity, y }, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: target, start, end, scrub: 1.2 },
    });
  }, { scope: ref });

  return <div ref={ref} className={`reveal${className ? ` ${className}` : ''}`}>{children}</div>;
}

type RevealListProps = {
  items: React.ReactNode[];
  className?: string;
  start?: string;
  end?: string;
  y?: number;
};

/** Staggered scroll reveal for a list; content remains readable without animation. */
export function RevealList({
  items,
  className = '',
  start = 'top 86%',
  end = 'bottom 16%',
  y = 40,
}: RevealListProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const container = ref.current;
    if (!container) return;
    const children = Array.from(container.children);
    if (!children.length) return;

    gsap.fromTo(children, { autoAlpha: 0, y }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.14,
      scrollTrigger: { trigger: container, start, end, scrub: 1.2 },
    });
  }, { scope: ref });

  return <div ref={ref} className={`reveal-list${className ? ` ${className}` : ''}`}>{items}</div>;
}

/** Small pointer-only magnetic movement; touch and reduced-motion users get a static control. */
export function Magnetic({
  children,
  translateX = 7,
  translateY = 7,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
  translateX?: number;
  translateY?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const element = ref.current;
    if (!element || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const move = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * translateX;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * translateY;
      gsap.to(element, { x, y, duration: 0.25, ease: 'power3.out', overwrite: 'auto' });
    };
    const reset = () => gsap.to(element, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });

    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', reset);
    return () => {
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
    };
  }, { scope: ref });

  return <span ref={ref} className={`magnetic${className ? ` ${className}` : ''}`}>{children}</span>;
}
