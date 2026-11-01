'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Magnetic } from '@/components/cinematic';

gsap.registerPlugin(ScrollTrigger);

interface DestinationCard3DProps {
  image: { src: string; alt: string; credit: string; license: string; sourceUrl: string };
  title: string;
  slug: string;
  onPlan?: () => void;
}

export function DestinationCard3D({ image, title, slug, onPlan }: DestinationCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHover, setIsHover] = useState(false);

  useGSAP(() => {
    const prefersReduced = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const card = cardRef.current;
    if (!card) return;

    const tl = gsap.timeline({
      paused: true,
      onReverseComplete: () => setIsFlipped(false),
    });

    tl.to(card, {
      rotateY: isHover ? 180 : 0,
      rotateX: isHover ? -10 : 0,
      scale: isHover ? 1.02 : 1,
      duration: 0.5,
      ease: 'power2.out',
    });

    return () => tl.kill();
  });

  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);
  const handleTouchStart = () => setIsHover(!isHover);

  const q = (sel: string) =>
    cardRef.current ? Array.from(cardRef.current.querySelectorAll<HTMLElement>(sel)) : [];

  return (
    <Magnetic className="card-magnetic" translateX={8} translateY={-4}>
      <div
        ref={cardRef}
        className="destination-card-3d"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        aria-label={title}
      >
        <div className="card-inner">
          <div className="card-front">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              quality={85}
              style={{ transition: 'transform 0.5s ease-out' }}
            />
            <div className="card-overlay">
              <span className="card-title">{title}</span>
            </div>
          </div>
          <div className="card-back" style={{ transition: 'transform 0.5s ease-out' }}>
            <div className="card-back-content">
              <h3>{title}</h3>
              <p>Discover {title}</p>
              <a href={`/contact?destination={slug}`} className="view-detail">
                View details <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Magnetic>
  );
}
