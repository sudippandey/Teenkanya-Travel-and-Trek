'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@/lib/gsap';

gsap.registerPlugin(ScrollTrigger);

/**
 * RouteLine — an SVG path that "draws itself" as the user scrolls, evoking a
 * journey being traced on a map. Used on tour/journey detail pages to create
 * scrollytelling momentum.
 *
 * `points` are [x, y] percentages (0-100) describing the route. The path is
 * drawn with a stroke-dashoffset reveal tied to scroll position, so the line
 * only animates when the visitor actually scrolls to it.
 *
 * Respects prefers-reduced-motion: draws instantly without animation.
 */
export function RouteLine({
  points,
  className = '',
  stroke = 'var(--clay)',
  strokeWidth = 2,
}: {
  points: [number, number][];
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}) {
  const ref = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const path = ref.current;
    if (!path) return;

    const totalLength = path.getTotalLength();
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      path.style.strokeDasharray = totalLength.toString();
      path.style.strokeDashoffset = '0';
      return;
    }

    path.style.strokeDasharray = totalLength.toString();
    path.style.strokeDashoffset = totalLength.toString();

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: path,
        start: 'top 86%',
        end: 'bottom 60%',
        scrub: 1.4,
      },
    });

    return () => {
      path.style.strokeDashoffset = '';
      path.style.strokeDasharray = '';
    };
  }, []);

  // Build the SVG path data from percentage points
  const d = points
    .map(([x, y], i) => (i === 0 ? `M${x} ${y}` : `L${x} ${y}`))
    .join(' ');

  return (
    <svg
      className={`route-line ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    >
      <path
        ref={ref}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
