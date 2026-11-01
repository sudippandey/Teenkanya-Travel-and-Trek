'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { RevealList } from '@/components/cinematic';
import { RouteLine } from '@/components/cinematic/RouteLine';
import type { TravelPackage } from '@/lib/travel-data';

/**
 * ItineraryGallery — scrollytelling gallery for tour detail pages.
 * Combines a route line that draws itself on scroll with day-by-day reveals.
 * Responds to prefers-reduced-motion by drawing instantly.
 */
export function ItineraryGallery({
  itinerary,
  className = '',
}: {
  itinerary: TravelPackage['itinerary'];
  className?: string;
}) {
  // Points tracing a gentle journey curve
  const points: [number, number][] = [
    [10, 90],
    [30, 70],
    [50, 55],
    [70, 40],
    [90, 20],
  ];

  return (
    <section className="itinerary-gallery" aria-label="Itinerary scrollytelling">
      <h2>Day-by-day outline</h2>
      <p>
        The stages below are a planning outline. Exact walking times, transport
        schedules, overnight stops and meal arrangements are confirmed in the
        final proposal.
      </p>
      <div className="itinerary-wrapper">
        <RouteLine points={points} className="itinerary-route-line" /
        <RevealList
          items={itinerary.map((item) => (
            <div key={item.day} className="itinerary-row">
              <span className="itinerary-day Magnetic">{item.day}</span>
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
