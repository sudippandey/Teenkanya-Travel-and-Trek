'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Compass, Heart, MapPin } from 'lucide-react';
import { JourneyFinder } from '@/components/journey-finder';
import { TravelGallery } from '@/components/travel-gallery';
import { ArticleCard, PackageCard } from '@/components/travel-cards';
import { PhotoCredit } from '@/components/photo-credit';
import { ScrollReveal } from '@/components/scroll-reveal';
import { CustomCursor } from '@/components/cinematic/CustomCursor';
import { DestinationGallery } from '@/components/cinematic/DestinationGallery';
import { ScrollExperience } from '@/components/cinematic/ScrollExperience';
import { Magnetic } from '@/components/cinematic';
import { destinationPhotos, galleryImages } from '@/lib/travel-data';
import { gsap, useGSAP } from '@/lib/gsap';
import type { Article, BrowseItem, TravelPackage } from '@/lib/travel-data';

const approach = [
  { icon: Compass, title: 'Start with your interests', description: 'Choose the places, pace and experiences that matter most to you.' },
  { icon: MapPin, title: 'Plan with local context', description: 'Talk through routes and practical details with a team based in Kathmandu.' },
  { icon: Heart, title: 'Leave room for the journey', description: 'Keep plans flexible where weather, access and local conditions can change.' },
];

export function HomePage({ destinationItems, packageItems, articles, packages, treks }: { destinationItems: BrowseItem[]; packageItems: BrowseItem[]; articles: Article[]; packages: TravelPackage[]; treks: BrowseItem[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const trigger = heroRef.current;
      if (!trigger) return;

      const q = (selector: string) => Array.from(trigger.querySelectorAll(selector));
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });

      entrance
        .from(q('.hero-kicker'), { y: 18, autoAlpha: 0, duration: 0.55 })
        .from(q('.hero h1'), { y: 34, autoAlpha: 0, duration: 0.8 }, '-=0.3')
        .from(q('.hero-copy'), { y: 22, autoAlpha: 0, duration: 0.65 }, '-=0.4')
        .from(q('.hero-actions'), { y: 18, autoAlpha: 0, duration: 0.6 }, '-=0.35')
        .from(q('.hero-bottomline'), { y: 14, autoAlpha: 0, duration: 0.55 }, '-=0.3');

      return () => entrance.revert();
    });

    return () => mm.revert();
  }, { scope: heroRef });

  useGSAP(() => {
    const page = homeRef.current;
    const hero = heroRef.current;
    if (!page || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const heroImage = hero.querySelector('.hero-image');
    if (heroImage) {
      gsap.to(heroImage, {
        yPercent: 9,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.2 },
      });
    }

    const editorialImage = page.querySelector('.editorial-image img');
    const editorialFrame = page.querySelector('.editorial-image');
    if (editorialImage && editorialFrame) {
      gsap.to(editorialImage, {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: editorialFrame, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      });
    }

    const ctaImage = page.querySelector('.cta-band-image');
    const ctaBand = page.querySelector('.cta-band');
    if (ctaImage && ctaBand) {
      gsap.to(ctaImage, {
        yPercent: 8,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: { trigger: ctaBand, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      });
    }

    const gallery = page.querySelector('.gallery-grid');
    const galleryItems = gallery ? Array.from(gallery.querySelectorAll('.gallery-item')) : [];
    if (gallery && galleryItems.length) {
      gsap.fromTo(galleryItems, { clipPath: 'inset(0 0 10% 0)' }, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: gallery, start: 'top 82%', once: true },
      });
    }

    const principleGrid = page.querySelector('.principles-grid');
    const principles = principleGrid ? Array.from(principleGrid.querySelectorAll('.principle-item')) : [];
    if (principleGrid && principles.length) {
      gsap.from(principles, {
        y: 22,
        duration: 0.75,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: principleGrid, start: 'top 82%', once: true },
      });
      gsap.from(principleGrid.querySelectorAll('.principle-item > svg'), {
        scale: 0.65,
        rotation: -12,
        duration: 0.7,
        stagger: 0.14,
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: principleGrid, start: 'top 82%', once: true },
      });
    }
  }, { scope: homeRef });

  const heroImage = destinationPhotos['everest-region'][0];
  const featuredDestination = destinationItems.find((item) => item.slug === 'pokhara');
  const supportingDestinations = ['kathmandu', 'mustang', 'chitwan'].flatMap((slug) => {
    const item = destinationItems.find((destination) => destination.slug === slug);
    return item ? [item] : [];
  });

  return (
    <div ref={homeRef} className="home-experience">
      <ScrollExperience />
      <CustomCursor />
      <section className="hero home-hero" ref={heroRef}>
        <div className="hero-glow" aria-hidden="true" />
        <Image className="hero-image" src={heroImage.src} alt={heroImage.alt} fill priority sizes="100vw" quality={85} />
        <div className="hero-overlay" />

        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-kicker">Journeys from Kathmandu, Nepal</span>
            <h1>Find your way<br />into <em>Nepal.</em></h1>
            <p className="hero-copy">From Kathmandu&apos;s living courtyards to the high trails of the Khumbu, plan a journey at your own pace.</p>
            <div className="hero-actions">
              <Magnetic><Link className="button button-light" href="/destinations" data-cursor-label="MOVE">Explore destinations <ArrowUpRight aria-hidden="true" /></Link></Magnetic>
              <Magnetic><Link className="button button-outline-light" href="/contact" data-cursor-label="MOVE">Plan with us <ArrowUpRight aria-hidden="true" /></Link></Magnetic>
            </div>
          </div>

          <div className="hero-bottomline">
            <span>Thoughtful travel, rooted in Nepal</span>
            <PhotoCredit credit={heroImage.credit} license={heroImage.license} sourceUrl={heroImage.sourceUrl} />
          </div>
        </div>

        <a className="hero-scroll" href="#discover" aria-label="Scroll to discover Nepal"><ArrowDownRight aria-hidden="true" /></a>
      </section>

      <section className="discovery-wrap container" id="discover" aria-label="Find a journey">
        <JourneyFinder packages={packages} destinations={destinationItems} treks={treks} />
      </section>

      <section className="section section-destinations">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">Eight ways into one country</span><h2>Where would you<br /><em>like to begin?</em></h2></div>
            <div className="section-heading-aside"><p>Each region has its own rhythm. Choose a starting point and give the details room to take shape.</p><Link className="text-link" href="/destinations">Explore all destinations</Link></div>
          </div>

          <ScrollReveal className="destination-gallery-reveal">
            <DestinationGallery featured={featuredDestination} supporting={supportingDestinations} />
          </ScrollReveal>
        </div>
      </section>

      <section className="section section-forest section-home-principles">
        <div className="container">
          <div className="section-heading section-heading-inverse">
            <div><span className="eyebrow eyebrow-light">THE CRAFT OF TRAVEL</span><h2>Travel that leaves<br /><em>room to notice.</em></h2></div>
            <p>We want planning to feel as thoughtful as the journey itself: grounded in real places, clear about practical details and open to what matters most to you.</p>
          </div>
          <div className="principles-grid">
            {approach.map(({ icon: Icon, title, description }, index) => (
              <article className="principle-item" key={title}>
                <span className="principle-number">0{index + 1}</span>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">The craft of travel</span><h2>A few ways<br /><em>to set out.</em></h2></div>
            <div className="section-heading-aside"><p>Every journey begins with a quiet decision. These sample itineraries show what a Teenkanya plan can feel like.</p><Link className="text-link" href="/tours">Browse journeys</Link></div>
          </div>

          <div className="package-grid">
            {packageItems.slice(0, 3).map((item, index) => <ScrollReveal key={item.slug} delay={index * 90}><PackageCard item={item} /></ScrollReveal>)}
          </div>
        </div>
      </section>

      <section className="section section-editorial">
        <div className="container editorial-section">
          <figure className="editorial-image">
            <Image src={destinationPhotos.mustang[2].src} alt={destinationPhotos.mustang[2].alt} fill sizes="(max-width: 780px) 100vw, 52vw" loading="lazy" />
            <figcaption><PhotoCredit credit={destinationPhotos.mustang[2].credit} license={destinationPhotos.mustang[2].license} sourceUrl={destinationPhotos.mustang[2].sourceUrl} /></figcaption>
          </figure>

          <div className="editorial-copy">
            <span className="eyebrow">A little more human</span><h2>Make space for<br /><em>the unexpected.</em></h2>
            <p>Travel is more than the places you reach. It is the morning tea before a walk, a conversation you did not plan and the feeling of being welcomed somewhere new.</p>
            <p>Teenkanya Travel &amp; Trek is based in Kathmandu. We help travelers bring Nepal plans together with local context and practical care.</p>
            <div className="editorial-points"><span>Personal travel planning</span><span>Destination-specific ideas</span><span>Clear, practical conversations</span><span>Flexible sample journeys</span></div>
            <Link className="text-link" href="/about">Get to know Teenkanya</Link>
          </div>
        </div>
      </section>

      <section className="section section-soft section-gallery-home">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">Small moments, big landscapes</span><h2>Nepal, in <em>frames.</em></h2></div>
            <p>A glimpse of the places and details you might encounter along the way.</p>
          </div>
          <TravelGallery images={galleryImages} label="Nepal travel photography" />
        </div>
      </section>

      <section className="section section-journal">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">The field notes</span><h2>Read before<br /><em>you go.</em></h2></div>
            <Link className="text-link" href="/blog">Visit the journal</Link>
          </div>

          <div className="article-grid">
            {articles.slice(0, 3).map((article, index) => <ScrollReveal key={article.slug} delay={index * 90}><ArticleCard article={article} /></ScrollReveal>)}
          </div>
        </div>
      </section>

      <section className="section section-last-cta">
        <div className="container">
          <div className="cta-band">
            <Image className="cta-band-image" src={destinationPhotos.pokhara[2].src} alt="" fill sizes="(max-width: 780px) 100vw, 1240px" loading="lazy" />
            <div className="cta-band-content"><span className="eyebrow">Your Nepal story starts here</span><h2>Let&apos;s plan your next journey.</h2></div>
            <Magnetic><Link className="button button-dark" href="/contact" data-cursor-label="MOVE">Talk to our team <ArrowUpRight aria-hidden="true" /></Link></Magnetic>
            <PhotoCredit className="cta-photo-credit" credit={destinationPhotos.pokhara[2].credit} license={destinationPhotos.pokhara[2].license} sourceUrl={destinationPhotos.pokhara[2].sourceUrl} />
          </div>
        </div>
      </section>
    </div>
  );
}

