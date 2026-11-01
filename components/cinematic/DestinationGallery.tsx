import { DestinationCard3D } from '@/components/cinematic/DestinationCard3D';
import type { BrowseItem } from '@/lib/travel-data';

export function DestinationGallery({ featured, supporting }: { featured: BrowseItem | undefined; supporting: BrowseItem[] }) {
  return (
    <div className="home-destination-layout destination-gallery">
      {featured && <div className="home-destination-feature"><DestinationCard3D item={featured} featured /></div>}
      <div className="home-destination-list">
        {supporting.map((item) => <DestinationCard3D key={item.slug} item={item} />)}
      </div>
    </div>
  );
}
