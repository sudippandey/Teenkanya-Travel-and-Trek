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
import { TrackedLink } from '@/components/tracked-link';
import type { Article, BrowseItem, TravelPackage } from '@/lib/travel-data';

const approach = [
  { icon: Compass, title: 'Start with your interests', description: 'Share your preferred places, pace, travel dates and the experiences that matter most.' },
  { icon: MapPin, title: 'Plan with local context', description: 'Talk through practical details with a Kathmandu-based team and clarify who operates each service.' },
  { icon: Heart, title: 'Confirm before you commit', description: 'Get current availability, inclusions, prices, operator details and cancellation terms in writing before booking.' },
];

const planningPaths = [
  { label: 'Nepal tours', focus: 'nepal_tour', interest: 'tour', detail: 'Explore sample Nepal itineraries and ask about current options.' },
  { label: 'Domestic travel', focus: 'domestic_tour', interest: 'tour', detail: 'Discuss travel within Nepal, shaped around your dates.' },
  { label: 'International travel', focus: 'international_tour', interest: 'tour', detail: 'Ask about international travel planning from Nepal.' },
  { label: 'Adventure experiences', focus: 'adventure_activity', interest: 'other', detail: 'Tell us which activity or experience you have in mind.' },
] as const;

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
  const featuredTreks = treks.slice(0, 3);

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
            <span className="hero-kicker">Teenkanya Travel &amp; Trek · Kathmandu, Nepal</span>
            <h1>Journeys begin<br />with a <em>conversation.</em></h1>
            <p className="hero-copy">A Kathmandu-based team for travellers in Nepal and visitors from abroad. Explore Nepal tours and treks, domestic trips, international travel and adventure experiences through a clear, personal enquiry.</p>
            <div className="hero-actions">
              <Magnetic><TrackedLink className="button button-dark" href="/contact?interest=tour&amp;focus=nepal_tour" data-cursor-label="MOVE" eventName="contact_click" eventProperties={{ channel: 'enquiry', location: 'home_hero' }}>Plan your trip <ArrowUpRight aria-hidden="true" /></TrackedLink></Magnetic>
              <Magnetic><Link className="button button-outline-light" href="/destinations" data-cursor-label="MOVE">Explore Nepal <ArrowUpRight aria-hidden="true" /></Link></Magnetic>
            </div>
          </div>

          <div className="hero-bottomline">
            <span>Based in Kathmandu · Serving travellers in Nepal and abroad</span>
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

      <section className="section section-featured-treks" aria-labelledby="featured-treks-heading">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">On foot</span><h2 id="featured-treks-heading">Featured <em>treks.</em></h2></div>
            <div className="section-heading-aside"><p>Explore sample route pages, then ask the team to confirm current conditions, availability and support for your dates.</p><Link className="text-link" href="/trekking">View all trekking</Link></div>
          </div>
          <div className="featured-trek-grid">
            {featuredTreks.map((trek) => (
              <article className="featured-trek-card" key={trek.slug}>
                <div className="featured-trek-image-frame">
                  <Link className="featured-trek-image" href={trek.href} aria-label={`Explore the ${trek.title} trek`}>
                    <Image src={trek.image} alt={trek.imageAlt} fill sizes="(max-width: 520px) 100vw, (max-width: 780px) 50vw, 33vw" loading="lazy" />
                  </Link>
                  <PhotoCredit className="featured-trek-photo-credit" credit={trek.imageCredit} license={trek.imageLicense} sourceUrl={trek.imageSource} />
                </div>
                <div className="featured-trek-body">
                  <span className="eyebrow">{trek.category} · {trek.duration}</span>
                  <h3><Link href={trek.href}>{trek.title}</Link></h3>
                  <p>{trek.location}</p>
                  <TrackedLink className="text-link" href={`/contact?interest=trekking&focus=trekking&package=${encodeURIComponent(trek.title)}`} eventName="trek_enquiry_click" eventProperties={{ trek: trek.slug }}>Ask about this trek <ArrowUpRight aria-hidden="true" /></TrackedLink>
                </div>
              </article>
            ))}
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
            <p>Teenkanya Travel &amp; Trek is based in Kathmandu and welcomes travellers from Nepal and abroad. Ask about Nepal journeys, travel within Nepal, international plans, adventure activities or practical travel arrangements.</p>
            <p>Trips may be operated by Teenkanya or by partner operators, depending on the itinerary. Before you commit, ask us to confirm the operator, inclusions, availability, price and cancellation terms in writing.</p>
            <div className="editorial-points editorial-service-links">
              {planningPaths.map((path) => (
                <TrackedLink key={path.focus} href={`/contact?interest=${path.interest}&focus=${path.focus}&package=${encodeURIComponent(path.label)}`} eventName="service_enquiry_click" eventProperties={{ focus: path.focus }}>
                  <span>{path.label}</span><small>{path.detail}</small><ArrowUpRight aria-hidden="true" />
                </TrackedLink>
              ))}
            </div>
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
            <div className="cta-band-content"><span className="eyebrow">Your Nepal story starts here</span><h2>Let&apos;s plan <em>your next journey.</em></h2></div>
            <Magnetic><TrackedLink className="button button-dark" href="/contact" data-cursor-label="MOVE" eventName="contact_click" eventProperties={{ channel: 'enquiry', location: 'home_footer_cta' }}>Talk to our team <ArrowUpRight aria-hidden="true" /></TrackedLink></Magnetic>
            <PhotoCredit className="cta-photo-credit" credit={destinationPhotos.pokhara[2].credit} license={destinationPhotos.pokhara[2].license} sourceUrl={destinationPhotos.pokhara[2].sourceUrl} />
          </div>
        </div>
      </section>
    </div>
  );
}

