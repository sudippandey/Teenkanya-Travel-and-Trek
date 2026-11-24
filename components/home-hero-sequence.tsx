'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { PhotoCredit } from '@/components/photo-credit';
import { destinationPhotos, type DestinationImage } from '@/lib/travel-data';

type HeroSlide = {
  photo: DestinationImage;
  location: string;
};

const slides: HeroSlide[] = [
  { photo: destinationPhotos['everest-region'][1], location: 'Khumbu, Everest Region' },
  { photo: destinationPhotos.pokhara[0], location: 'Pokhara, Nepal' },
  { photo: destinationPhotos.kathmandu[1], location: 'Kathmandu Valley' },
  { photo: destinationPhotos.mustang[1], location: 'Mustang, Nepal' },
];

export function HomeHeroSequence() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const changeSlide = useCallback((direction: number) => {
    const currentIndex = activeIndexRef.current;
    const nextIndex = (currentIndex + direction + slides.length) % slides.length;
    if (nextIndex === currentIndex) return;
    if (!reducedMotion) setOutgoingIndex(currentIndex);
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  }, [reducedMotion]);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches);
    const updateVisibility = () => setPageHidden(document.visibilityState !== 'visible');

    updateMotionPreference();
    updateVisibility();
    motionPreference.addEventListener('change', updateMotionPreference);
    document.addEventListener('visibilitychange', updateVisibility);

    return () => {
      motionPreference.removeEventListener('change', updateMotionPreference);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (paused || pageHidden || reducedMotion) return;
    const timer = window.setTimeout(() => changeSlide(1), 7000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, changeSlide, pageHidden, paused, reducedMotion]);

  useEffect(() => {
    if (outgoingIndex === null) return;
    const timer = window.setTimeout(() => setOutgoingIndex(null), 1400);
    return () => window.clearTimeout(timer);
  }, [activeIndex, outgoingIndex]);

  const activeSlide = slides[activeIndex];
  const visibleIndices = outgoingIndex === null ? [activeIndex] : [outgoingIndex, activeIndex];

  return (
    <>
      <div className="hero-image-frame" aria-hidden="true">
        {visibleIndices.map((index) => (
          <div
            className={`hero-image-layer ${index === activeIndex ? 'is-active' : 'is-outgoing'}${reducedMotion ? ' is-static' : ''}`}
            key={index}
          >
            <Image
              className="hero-image"
              src={slides[index].photo.src}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              quality={85}
            />
          </div>
        ))}
      </div>

      <div className="hero-atmosphere" aria-hidden="true" />

      <div className="hero-bottomline">
        <span>Based in Kathmandu · Serving travellers in Nepal and abroad</span>
        <div className="hero-photo-details" aria-live="polite" aria-atomic="true">
          <span className="hero-destination-label">{activeSlide.location}</span>
          <PhotoCredit
            credit={activeSlide.photo.credit}
            license={activeSlide.photo.license}
            sourceUrl={activeSlide.photo.sourceUrl}
          />
        </div>
      </div>

      <div className="hero-sequence-controls" role="group" aria-label="Hero photograph controls">
        <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous photograph">
          <ChevronLeft aria-hidden="true" />
        </button>
        <span className="hero-slide-count" aria-live="off">0{activeIndex + 1} <span aria-hidden="true">/</span> 0{slides.length}</span>
        <button type="button" onClick={() => changeSlide(1)} aria-label="Next photograph">
          <ChevronRight aria-hidden="true" />
        </button>
        <span className="hero-controls-divider" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setPaused((current) => !current)}
          aria-label={paused ? 'Play automatic photographs' : 'Pause automatic photographs'}
          aria-pressed={paused}
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
      </div>
    </>
  );
}
