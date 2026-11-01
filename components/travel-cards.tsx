import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Clock3, MapPin } from 'lucide-react'
import { PhotoCredit } from '@/components/photo-credit'
import { Magnetic } from '@/components/cinematic'
import type { Article, BrowseItem } from '@/lib/travel-data'

export function DestinationCard({ item, featured = false, compact = false }: { item: BrowseItem; featured?: boolean; compact?: boolean }) {
  const layoutClass = featured ? ' destination-card-featured' : compact ? ' destination-card-compact' : ''

  return (
    <article className={`destination-card${layoutClass}`}>
      <Link href={item.href} className="destination-card-link">
        <Image src={item.image} alt={item.imageAlt} fill sizes={featured ? '(max-width: 780px) 100vw, 55vw' : '(max-width: 780px) 100vw, 30vw'} loading="lazy" />
        <span className="card-shade" aria-hidden="true" />
        <span className="destination-topline"><span>{item.category}</span><ArrowUpRight aria-hidden="true" /></span>
        <span className="destination-content"><span className="card-location"><MapPin aria-hidden="true" />{item.location}</span><strong>{item.title}</strong><span className="card-description">{item.description}</span></span>
      </Link>
      <PhotoCredit className="destination-photo-credit" credit={item.imageCredit} license={item.imageLicense} sourceUrl={item.imageSource} />
    </article>
  )
}

export function PackageCard({ item }: { item: BrowseItem }) {
  return (
    <article className="package-card">
      <div className="package-image-frame">
        <Link className="package-image" href={item.href} aria-label={`View ${item.title}`}>
          <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 780px) 100vw, 33vw" loading="lazy" />
          <span className="package-label">{item.label ?? item.category}</span>
        </Link>
        <PhotoCredit className="package-photo-credit" credit={item.imageCredit} license={item.imageLicense} sourceUrl={item.imageSource} />
      </div>
      <div className="package-body">
        <div className="package-meta"><span><MapPin aria-hidden="true" />{item.location}</span>{item.duration && <span><Clock3 aria-hidden="true" />{item.duration}</span>}</div>
        <h3><Link href={item.href}>{item.title}</Link></h3>
        <p>{item.description}</p>
        <div className="package-footer"><span>Price on request</span><Magnetic translateX={4} translateY={4}><Link href={item.href} aria-label={`View details for ${item.title}`} data-cursor-label="MOVE"><ArrowUpRight aria-hidden="true" /></Link></Magnetic></div>
      </div>
    </article>
  )
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="article-card">
      <div className="article-image-frame">
        <Link className="article-image" href={`/blog/${article.slug}`} aria-label={`Read ${article.title}`}>
          <Image src={article.image} alt={article.imageAlt} fill sizes="(max-width: 780px) 100vw, 33vw" loading="lazy" />
        </Link>
        <PhotoCredit className="article-photo-credit" credit={article.imageCredit} license={article.imageLicense} sourceUrl={article.imageSource} />
      </div>
      <div className="article-body">
        <span>{article.category} · {article.readingTime}</span>
        <h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2>
        <p>{article.excerpt}</p>
        <Link className="text-link" href={`/blog/${article.slug}`}>Read the guide <ArrowUpRight aria-hidden="true" /></Link>
      </div>
    </article>
  )
}
