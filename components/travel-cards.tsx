import Link from 'next/link'
import { ArrowUpRight, Clock3, MapPin } from 'lucide-react'
import type { BrowseItem } from '@/lib/travel-data'

export function DestinationCard({ item, index = 0 }: { item: BrowseItem; index?: number }) {
  return <Link href={item.href} className={`destination-card reveal reveal-delay-${(index % 4) + 1}`}>
    <img src={item.image} alt={item.title} loading="lazy" />
    <span className="card-shade" />
    <span className="destination-topline"><span>{item.category}</span><ArrowUpRight aria-hidden="true" /></span>
    <span className="destination-content"><span className="card-location"><MapPin aria-hidden="true" />{item.location}</span><strong>{item.title}</strong><span className="card-description">{item.description}</span></span>
  </Link>
}

export function PackageCard({ item, index = 0 }: { item: BrowseItem; index?: number }) {
  return <article className={`package-card reveal reveal-delay-${(index % 4) + 1}`}>
    <Link className="package-image" href={item.href} aria-label={`View ${item.title}`}>
      <img src={item.image} alt={item.title} loading="lazy" />
      <span className="package-label">{item.label ?? item.category}</span>
    </Link>
    <div className="package-body">
      <div className="package-meta"><span><MapPin aria-hidden="true" />{item.location}</span>{item.duration && <span><Clock3 aria-hidden="true" />{item.duration}</span>}</div>
      <h3><Link href={item.href}>{item.title}</Link></h3>
      <p>{item.description}</p>
      <div className="package-footer"><span>Price on request</span><Link href={item.href} aria-label={`View details for ${item.title}`}><ArrowUpRight aria-hidden="true" /></Link></div>
    </div>
  </article>
}
