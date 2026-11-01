'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { RevealList } from '@/components/cinematic';
import { RouteLine } from '@/components/cinematic/RouteLine';
import type { TravelPackage } from '@/lib/travel-data';

/**
 * ItineraryJourney — scrollytelling day-by-day outline for a journey detail
 * page. Each day reveals in sequence as you scroll, with a route line that
 * draws itself alongside the days, evoking the path being traced on a map.
 *
 * Wrapped in RevealList so the whole section only animates when it enters the
 * viewport, and each day staggers in with a slight delay.
 *
 * Respects prefers-reduced-motion via RevealList.
 */
export function ItineraryJourney({
  itinerary,
  className = '',
}: {
  itinerary: TravelPackage['itinerary'];
  className?: string;
}) {
  // Points tracing a gentle "journey" curve across the line container
  const points: [number, number][] = [
    [10, 90],
    [30, 70],
    [50, 55],
    [70, 40],
    [90, 20],
  ];

  return (
    <section className={`itinerary-section ${className}`}>
      <h2>Day-by-day outline</h2>
      <p>
        The stages below are a planning outline. Exact walking times, transport
        schedules, overnight stops and meal arrangements are confirmed in the
        final proposal.
      </p>
      <div className="itinerary-wrapper">
        <RouteLine points={points} className="itinerary-route-line" />
        <RevealList
          items={itinerary.map((item) => (
            <div key={item.day} className="itinerary-row">
              <span className="itinerary-day">{item.day}</span>
              <div className="itinerary-content">
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
          className="itinerary-reveal-list"
          y={40}
        />
      </div>
    </section>
  );
}
