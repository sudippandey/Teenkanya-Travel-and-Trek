import photoRecords from '@/lib/destination-images.json'

export type DestinationImage = {
  src: string
  downloadUrl: string
  alt: string
  caption: string
  credit: string
  license: string
  sourceUrl: string
}

export type ContentSource = { label: string; url: string }
export type Attraction = { name: string; description: string; image: DestinationImage }

export type Destination = {
  slug: string
  title: string
  region: string
  category: string
  description: string
  heroImage: DestinationImage
  gallery: DestinationImage[]
  bestTime: string
  highlights: string[]
  activities: string[]
  overview: string
  attractions: Attraction[]
  practicalTips: string[]
  contentSources?: ContentSource[]
}

export type ImageAttribution = {
  image: string
  imageAlt: string
  imageCredit: string
  imageLicense: string
  imageSource: string
}

export type TravelPackage = ImageAttribution & {
  slug: string
  title: string
  destination: string
  duration: string
  days: number
  category: string
  description: string
  highlights: string[]
  itinerary: { day: string; title: string; detail: string }[]
  inclusions: string[]
  exclusions: string[]
}

export type Article = ImageAttribution & {
  slug: string
  title: string
  category: string
  date: string
  excerpt: string
  readingTime: string
  content: string[]
}

export type BrowseItem = ImageAttribution & {
  slug: string
  title: string
  location: string
  category: string
  duration?: string
  description: string
  href: string
  label?: string
}

const photoSets = photoRecords as unknown as Record<string, DestinationImage[]>
const imageAttribution = (photo: DestinationImage): ImageAttribution => ({
  image: photo.src,
  imageAlt: photo.alt,
  imageCredit: photo.credit,
  imageLicense: photo.license,
  imageSource: photo.sourceUrl,
})

export const destinationPhotos = photoSets

export const destinations: Destination[] = [
  {
    slug: 'kathmandu', title: 'Kathmandu Valley', region: 'Central Nepal', category: 'Culture',
    description: 'A living valley of temple squares, courtyards and everyday city life.',
    heroImage: photoSets.kathmandu[1], gallery: photoSets.kathmandu,
    bestTime: 'Autumn and spring are often comfortable for walking; weather and festival dates vary from year to year.',
    highlights: ['Kathmandu Durbar Square', 'Swayambhunath', 'Boudhanath', 'Pashupatinath', 'Patan and Bhaktapur'],
    activities: ['Heritage walks', 'Temple and stupa visits', 'Newari food experiences', 'Artisan and market visits'],
    overview: 'Kathmandu Valley brings together dense city neighborhoods, active places of worship and historic palace squares. Its seven monument zones include Kathmandu, Patan and Bhaktapur Durbar Squares, Swayambhu, Bauddhanath, Pashupati and Changu Narayan. Move between them with time for local context and changing street life.',
    attractions: [
      { name: 'Kathmandu Durbar Square', description: 'A historic palace square with temples and traditional architecture at the center of the old city.', image: photoSets.kathmandu[2] },
      { name: 'Swayambhunath', description: 'A hilltop Buddhist complex with views across the valley; access and site conditions should be checked locally.', image: photoSets.kathmandu[3] },
      { name: 'Boudhanath', description: 'An important Buddhist pilgrimage site with an active community around the stupa.', image: photoSets.kathmandu[4] },
      { name: 'Pashupatinath', description: 'A major Hindu temple complex on the Bagmati River. Some areas have access restrictions.', image: photoSets.kathmandu[5] },
      { name: 'Patan Durbar Square', description: 'A historic palace square in Lalitpur, one of the valley’s Durbar Square heritage sites.', image: photoSets.kathmandu[6] },
      { name: 'Bhaktapur Durbar Square', description: 'A historic square in Bhaktapur with temples and traditional architecture.', image: photoSets.kathmandu[7] },
    ],
    practicalTips: ['Allow extra time for road traffic between valley sites.', 'Follow posted guidance at active religious places and ask before photographing people.', 'Opening hours, access rules and festival schedules can change; confirm before visiting.'],
    contentSources: [{ label: 'UNESCO World Heritage Centre — Kathmandu Valley', url: 'https://whc.unesco.org/en/list/121/' }],
  },
  {
    slug: 'pokhara', title: 'Pokhara', region: 'Western Nepal', category: 'Nature',
    description: 'Lakeside days, hillside viewpoints and a close-up view of the Annapurna skyline.',
    heroImage: photoSets.pokhara[0], gallery: photoSets.pokhara,
    bestTime: 'Autumn and spring often offer clearer mountain views; visibility depends on weather and local conditions.',
    highlights: ['Phewa Lake', 'Sarangkot', 'World Peace Pagoda', 'Davis Falls', 'Mahendra Cave'],
    activities: ['Boating', 'Viewpoint visits', 'Short hikes', 'Paragliding with licensed local operators'],
    overview: 'Pokhara is a lakeside city and a common starting point for journeys into the Annapurna region. Phewa Lake, nearby hill viewpoints and the surrounding foothills give the city a gentler rhythm than the high trails beyond it. Mountain views are weather-dependent.',
    attractions: [
      { name: 'Phewa Lake', description: 'A freshwater lake beside the city, with boating and lakeside walks subject to local conditions.', image: photoSets.pokhara[5] },
      { name: 'Sarangkot', description: 'A hilltop viewpoint above Pokhara; mountain visibility changes with the weather.', image: photoSets.pokhara[1] },
      { name: 'World Peace Pagoda', description: 'A hilltop Buddhist monument overlooking Pokhara and the lake.', image: photoSets.pokhara[2] },
      { name: 'Davis Falls', description: 'A waterfall within Pokhara; follow on-site safety guidance around the water.', image: photoSets.pokhara[3] },
      { name: 'Mahendra Cave', description: 'A natural cave in Pokhara, Kaski. Check current access conditions before visiting.', image: photoSets.pokhara[4] },
    ],
    practicalTips: ['Leave flexibility for cloud cover if mountain views are a priority.', 'Confirm operators, safety arrangements and weather conditions before adventure activities.', 'Use local guidance for current access and transport information.'],
    contentSources: [{ label: 'Nepal Tourism Board — Pokhara', url: 'https://ntb.gov.np/pokhara' }],
  },
  {
    slug: 'everest-region', title: 'Everest Region', region: 'Eastern Nepal', category: 'Trekking',
    description: 'High mountain trails, Sherpa communities and the landscapes of Sagarmatha.',
    heroImage: photoSets['everest-region'][0], gallery: photoSets['everest-region'],
    bestTime: 'Spring and autumn are commonly chosen for trekking; high-altitude weather can change quickly.',
    highlights: ['Namche Bazaar', 'Tengboche Monastery', 'Khumbu Glacier', 'Gokyo Lakes', 'Everest viewpoints'],
    activities: ['Trekking with acclimatization days', 'Village stays', 'Monastery visits', 'Mountain photography'],
    overview: 'The Khumbu is a high-altitude region where walking routes connect Sherpa settlements, monasteries and glacial landscapes. Sagarmatha National Park protects much of the area. Route, health, weather and acclimatization planning matter at every stage.',
    attractions: [
      { name: 'Namche Bazaar', description: 'A principal settlement on popular Khumbu trekking routes and a common place to pause for acclimatization.', image: photoSets['everest-region'][6] },
      { name: 'Tengboche Monastery', description: 'A monastery in the Khumbu region; visitors should follow local guidance and respect active worship.', image: photoSets['everest-region'][7] },
      { name: 'Khumbu Glacier', description: 'A prominent glacial landscape on routes toward Everest Base Camp.', image: photoSets['everest-region'][5] },
      { name: 'Gokyo Lakes', description: 'A group of high-altitude lakes in the Khumbu region; access requires a suitable trekking itinerary.', image: photoSets['everest-region'][4] },
      { name: 'Everest viewpoints', description: 'Mountain views vary by route, visibility and weather; no particular sighting can be guaranteed.', image: photoSets['everest-region'][2] },
    ],
    practicalTips: ['Plan conservatively for altitude and build acclimatization into the route.', 'Confirm permits, flight or road arrangements and current trail conditions before departure.', 'Use a qualified local trekking team and follow health guidance for high-altitude travel.'],
    contentSources: [{ label: 'UNESCO World Heritage Centre — Sagarmatha National Park', url: 'https://whc.unesco.org/en/list/120/' }],
  },
  {
    slug: 'annapurna-region', title: 'Annapurna Region', region: 'Western Nepal', category: 'Trekking',
    description: 'A broad Himalayan region of village routes, forest paths and high mountain passes.',
    heroImage: photoSets['annapurna-region'][0], gallery: photoSets['annapurna-region'],
    bestTime: 'Spring and autumn are often selected for trekking; conditions differ across valleys and elevations.',
    highlights: ['Annapurna Base Camp', 'Ghorepani–Poon Hill', 'Manang', 'Thorong La', 'Traditional hill villages'],
    activities: ['Trekking', 'Village stays', 'Viewpoint walks', 'Hot-spring visits where open'],
    overview: 'The Annapurna region spans a wide range of elevations and landscapes. Well-known routes include the Annapurna Circuit, Ghorepani–Poon Hill and the approach to Annapurna Base Camp. Daily walking, elevation gain and weather vary substantially by itinerary.',
    attractions: [
      { name: 'Annapurna Base Camp', description: 'A high mountain destination reached by trekking routes; itineraries should account for altitude and conditions.', image: photoSets['annapurna-region'][1] },
      { name: 'Ghorepani–Poon Hill', description: 'A popular trekking route and viewpoint area; visibility depends on weather.', image: photoSets['annapurna-region'][5] },
      { name: 'Manang', description: 'A settlement and trekking area within the Annapurna region, surrounded by a high mountain landscape.', image: photoSets['annapurna-region'][0] },
      { name: 'Letdar on the Annapurna Circuit', description: 'A trail settlement on the Annapurna Circuit, shown here with a yak in the high country.', image: photoSets['annapurna-region'][2] },
      { name: 'Ghorepani viewpoints', description: 'Mountain panoramas from the foothills, with clear views never guaranteed.', image: photoSets['annapurna-region'][4] },
    ],
    practicalTips: ['Choose a route based on experience, health and the time available.', 'Confirm permits, trail conditions and seasonal closures with a local source.', 'Build in rest and flexibility; high elevations affect people differently.'],
    contentSources: [{ label: 'Nepal Tourism Board — Annapurna region', url: 'https://ntb.gov.np/annapurna-region' }],
  },
  {
    slug: 'chitwan', title: 'Chitwan', region: 'Southern Nepal', category: 'Wildlife',
    description: 'River edges, grasslands and forest habitats in Nepal’s southern lowlands.',
    heroImage: photoSets.chitwan[5], gallery: photoSets.chitwan,
    bestTime: 'Cooler months are generally more comfortable for outdoor activities; wildlife sightings are never guaranteed.',
    highlights: ['Chitwan National Park', 'Rapti River', 'Birdlife', 'Tharu culture', 'Terai landscapes'],
    activities: ['Guided nature walks', 'Birdwatching', 'Canoe trips where permitted', 'Community-led cultural visits'],
    overview: 'Chitwan National Park protects a varied lowland landscape of riverine forest and grassland. Visitors can learn about wildlife and the communities of the Terai with local guides. Animal sightings depend on nature and should never be promised.',
    attractions: [
      { name: 'Chitwan National Park', description: 'A protected landscape and UNESCO World Heritage site in Nepal’s Terai.', image: photoSets.chitwan[0] },
      { name: 'Rapti River', description: 'A river corridor beside the park; boat and canoe activities depend on local rules and conditions.', image: photoSets.chitwan[5] },
      { name: 'Birdlife', description: 'The park supports diverse bird habitats; sightings vary by season and location.', image: photoSets.chitwan[2] },
      { name: 'Wildlife habitats', description: 'The region is known for wildlife, including the one-horned rhinoceros; sightings are not guaranteed.', image: photoSets.chitwan[3] },
      { name: 'Tharu communities', description: 'Learn about local culture through respectful, community-led visits arranged with local hosts.', image: photoSets.chitwan[6] },
    ],
    practicalTips: ['Choose licensed local operators and follow park rules.', 'Keep a respectful distance from wildlife and do not feed animals.', 'Ask before photographing people and confirm current activity options locally.'],
    contentSources: [{ label: 'UNESCO World Heritage Centre — Chitwan National Park', url: 'https://whc.unesco.org/en/list/284/' }],
  },
  {
    slug: 'mustang', title: 'Mustang', region: 'Western Nepal', category: 'Culture',
    description: 'A trans-Himalayan landscape of broad valleys, dry cliffs and old settlements.',
    heroImage: photoSets.mustang[0], gallery: photoSets.mustang,
    bestTime: 'The dry season is often preferred, but access, weather and permit requirements vary by route.',
    highlights: ['Lo Manthang', 'Kagbeni', 'Jomsom', 'Kali Gandaki Valley', 'Jharkot'],
    activities: ['Village walks', 'Monastery visits', 'Scenic road journeys', 'Trekking with current permit guidance'],
    overview: 'Mustang lies in the rain shadow of the Himalaya and includes landscapes shaped by the Kali Gandaki valley and historic settlements. Upper Mustang has distinct access and permit requirements; confirm current rules before planning a visit.',
    attractions: [
      { name: 'Lo Manthang', description: 'A historic walled settlement in Upper Mustang; access and permit requirements must be checked before travel.', image: photoSets.mustang[6] },
      { name: 'Kagbeni', description: 'A settlement in the Kali Gandaki valley and a common stop on journeys through Mustang.', image: photoSets.mustang[4] },
      { name: 'Jomsom', description: 'A town and travel hub in Mustang; transport is affected by weather and local conditions.', image: photoSets.mustang[7] },
      { name: 'Kali Gandaki Valley', description: 'A broad river valley cutting through the Mustang landscape.', image: photoSets.mustang[1] },
      { name: 'Jharkot', description: 'A village in Mustang District with mountain views and local architecture.', image: photoSets.mustang[2] },
    ],
    practicalTips: ['Check current Upper Mustang permit rules and route access before booking.', 'Build flexibility into travel plans because road and weather conditions can change.', 'Ask before photographing residents or entering religious spaces.'],
  },
  {
    slug: 'langtang', title: 'Langtang Valley', region: 'Northern Nepal', category: 'Trekking',
    description: 'An alpine valley shaped by mountain trails, Tamang culture and high pastures.',
    heroImage: photoSets.langtang[0], gallery: photoSets.langtang,
    bestTime: 'Spring and autumn are commonly chosen for trekking; snow, weather and trail conditions vary.',
    highlights: ['Langtang National Park', 'Kyanjin Gompa', 'Langtang Lirung', 'Tamang communities', 'Alpine landscapes'],
    activities: ['Trekking', 'Village visits', 'Viewpoint walks', 'Local food and culture experiences'],
    overview: 'Langtang Valley is a Himalayan trekking area within Langtang National Park. The route passes through mountain communities and changing alpine terrain. Local guidance, current trail conditions and a considered pace are important to a comfortable journey.',
    attractions: [
      { name: 'Langtang Valley', description: 'A high Himalayan valley with trekking routes and mountain settlements.', image: photoSets.langtang[3] },
      { name: 'Kyanjin Gompa', description: 'A settlement and trekking waypoint in the upper valley; current access should be confirmed locally.', image: photoSets.langtang[6] },
      { name: 'Langtang Lirung', description: 'A prominent mountain in the region; visibility depends on weather and route.', image: photoSets.langtang[7] },
      { name: 'Langtang National Park', description: 'A protected area with mountain habitats and wildlife; follow park guidance.', image: photoSets.langtang[4] },
      { name: 'Tamang communities', description: 'Meet local hosts respectfully and follow their guidance on customs and photography.', image: photoSets.langtang[0] },
    ],
    practicalTips: ['Plan for altitude and changing weather, and allow a flexible schedule.', 'Confirm trail access and current local conditions before departure.', 'Choose local services respectfully and carry out all waste.'],
  },
  {
    slug: 'lumbini', title: 'Lumbini', region: 'Southern Nepal', category: 'Pilgrimage',
    description: 'A contemplative heritage landscape and an important Buddhist pilgrimage site.',
    heroImage: photoSets.lumbini[0], gallery: photoSets.lumbini,
    bestTime: 'Cooler months are generally more comfortable for time outdoors; check local weather and site hours.',
    highlights: ['Maya Devi Temple', 'Ashoka Pillar', 'Sacred Garden', 'Monastic zone', 'Pilgrimage paths'],
    activities: ['Pilgrimage', 'Walking and cycling', 'Monastery visits', 'Quiet time in the Sacred Garden'],
    overview: 'Lumbini is recognized by UNESCO as the birthplace of the Buddha and is a place of pilgrimage and reflection. The Sacred Garden, Maya Devi Temple, Ashoka Pillar and international monasteries invite a slower visit and respectful attention to religious practice.',
    attractions: [
      { name: 'Maya Devi Temple', description: 'The central sacred site within Lumbini’s Sacred Garden.', image: photoSets.lumbini[1] },
      { name: 'Ashoka Pillar', description: 'A historic pillar within the Sacred Garden, near the Maya Devi Temple.', image: photoSets.lumbini[2] },
      { name: 'Sacred Garden', description: 'A peaceful landscaped area around the principal archaeological and religious sites.', image: photoSets.lumbini[3] },
      { name: 'International monasteries', description: 'Monasteries built by Buddhist communities from different countries; observe local visiting guidance.', image: photoSets.lumbini[4] },
      { name: 'Maitreya Temple', description: 'One of the temples within the broader Lumbini pilgrimage landscape.', image: photoSets.lumbini[0] },
    ],
    practicalTips: ['Dress modestly and follow signs at sacred and archaeological areas.', 'Allow time to move between the Sacred Garden and monastic zone.', 'Check current opening hours and transport options before visiting.'],
    contentSources: [{ label: 'UNESCO World Heritage Centre — Lumbini', url: 'https://whc.unesco.org/en/list/666/' }],
  },
]

export const packages: TravelPackage[] = [
  {
    slug: 'kathmandu-pokhara-discovery', title: 'Kathmandu & Pokhara Discovery', destination: 'Kathmandu · Pokhara', duration: '7 days', days: 7, category: 'Culture & nature',
    description: 'A considered introduction to Nepal, from historic valley squares to quiet lakeside mornings.',
    ...imageAttribution(photoSets.pokhara[5]),
    highlights: ['Guided heritage walk in Kathmandu', 'Scenic journey to Pokhara', 'Sunrise from Sarangkot'],
    itinerary: [
      { day: 'Day 01', title: 'Arrive in Kathmandu', detail: 'Arrive in the valley and settle in. Your day is kept open for rest and an initial orientation.' },
      { day: 'Day 02', title: 'Kathmandu heritage', detail: 'Explore a selection of historic squares, temples and local neighborhoods with a guide.' },
      { day: 'Day 03', title: 'Valley at your pace', detail: 'Choose a local experience or enjoy a relaxed day before traveling west.' },
      { day: 'Day 04', title: 'Journey to Pokhara', detail: 'Travel through changing landscapes to the lakeside city of Pokhara.' },
      { day: 'Day 05', title: 'Lakeside and mountain views', detail: 'Enjoy time by the lake and a memorable sunrise viewpoint, weather permitting.' },
      { day: 'Day 06–07', title: 'Return and departure', detail: 'Return to Kathmandu and connect with your onward journey.' },
    ],
    inclusions: ['Accommodation planning', 'Local ground transfers', 'Guided visits as listed'], exclusions: ['International airfare', 'Travel insurance', 'Personal expenses'],
  },
  {
    slug: 'annapurna-foothills-walk', title: 'Annapurna Foothills Walk', destination: 'Pokhara · Annapurna', duration: '8 days', days: 8, category: 'Trekking',
    description: 'Walk village trails and forest paths beneath the Annapurna range, with time to settle into the rhythm of the hills.',
    ...imageAttribution(photoSets['annapurna-region'][4]),
    highlights: ['Panoramic Himalayan views', 'Village and forest trails', 'Flexible private itinerary'],
    itinerary: [
      { day: 'Day 01', title: 'Arrive in Kathmandu', detail: 'Welcome and orientation in Nepal’s capital.' },
      { day: 'Day 02', title: 'Travel to Pokhara', detail: 'Journey west to the foothills and prepare for the walk.' },
      { day: 'Day 03–06', title: 'On the trail', detail: 'Walk between villages and forested ridges with a local trekking team.' },
      { day: 'Day 07–08', title: 'Return to Pokhara', detail: 'Come back to Pokhara and connect onward via Kathmandu.' },
    ],
    inclusions: ['Trek planning', 'Local guide coordination', 'Ground transport planning'], exclusions: ['International flights', 'Personal trekking equipment', 'Travel insurance'],
  },
  {
    slug: 'everest-trail-highlights', title: 'Everest Trail Highlights', destination: 'Khumbu · Everest Region', duration: '12 days', days: 12, category: 'Trekking',
    description: 'A high-altitude journey through Sherpa settlements and the iconic landscapes of the Khumbu.',
    ...imageAttribution(photoSets['everest-region'][1]),
    highlights: ['Namche Bazaar acclimatization', 'Tengboche visit', 'Expert local trekking support'],
    itinerary: [
      { day: 'Day 01–02', title: 'Kathmandu and Lukla', detail: 'Prepare in Kathmandu, then travel to the Khumbu when conditions allow.' },
      { day: 'Day 03–05', title: 'Namche and acclimatization', detail: 'Follow the Dudh Koshi valley and take time to acclimatize around Namche.' },
      { day: 'Day 06–09', title: 'Into the high country', detail: 'Continue through the high villages and viewpoints of the Everest region.' },
      { day: 'Day 10–12', title: 'Return journey', detail: 'Retrace the trail and return to Kathmandu, with travel subject to conditions.' },
    ],
    inclusions: ['Trek planning and briefing', 'Local guide coordination', 'Route and acclimatization guidance'], exclusions: ['Flights to Lukla', 'Travel insurance', 'Personal equipment and expenses'],
  },
  {
    slug: 'wild-nepal-chitwan', title: 'Wild Nepal: Chitwan Escape', destination: 'Kathmandu · Chitwan', duration: '5 days', days: 5, category: 'Wildlife',
    description: 'A gentle journey from the capital to the subtropical landscape of Nepal’s southern plains.',
    ...imageAttribution(photoSets.chitwan[5]),
    highlights: ['Time in Chitwan National Park', 'Local naturalist-led experiences', 'Tharu community introduction'],
    itinerary: [
      { day: 'Day 01', title: 'Arrive in Kathmandu', detail: 'Settle into the valley and prepare for the journey south.' },
      { day: 'Day 02', title: 'Travel to Chitwan', detail: 'Journey to the lowlands and meet your local host.' },
      { day: 'Day 03', title: 'Explore the landscape', detail: 'Choose from guided nature experiences based on season and local conditions.' },
      { day: 'Day 04–05', title: 'Return to Kathmandu', detail: 'Enjoy a final morning before traveling back for your onward connection.' },
    ],
    inclusions: ['Ground travel planning', 'Local experience coordination', 'Accommodation suggestions'], exclusions: ['International airfare', 'Park fees unless agreed', 'Personal expenses'],
  },
]

export const treks: BrowseItem[] = [
  { slug: 'everest-trail-highlights', title: 'Everest Trail Highlights', location: 'Everest Region', category: 'Challenging', duration: '12 days', description: 'A Himalayan journey through Sherpa villages and the high country of the Khumbu.', href: '/trekking/everest-trail-highlights', label: 'High altitude', ...imageAttribution(photoSets['everest-region'][0]) },
  { slug: 'annapurna-foothills-walk', title: 'Annapurna Foothills Walk', location: 'Annapurna Region', category: 'Moderate', duration: '8 days', description: 'Forest trails and welcoming villages beneath the Annapurna range.', href: '/trekking/annapurna-foothills-walk', label: 'Village trails', ...imageAttribution(photoSets['annapurna-region'][5]) },
  { slug: 'langtang-valley-trail', title: 'Langtang Valley Trail', location: 'Langtang Region', category: 'Moderate', duration: '9 days', description: 'An alpine valley trek with mountain views and rich Tamang culture.', href: '/trekking/langtang-valley-trail', label: 'Alpine valley', ...imageAttribution(photoSets.langtang[1]) },
]

export const destinationItems: BrowseItem[] = destinations.map((destination) => ({
  slug: destination.slug,
  title: destination.title,
  location: destination.region,
  category: destination.category,
  description: destination.description,
  href: `/destinations/${destination.slug}`,
  ...imageAttribution(destination.heroImage),
}))

export const packageItems: BrowseItem[] = packages.map((travelPackage) => ({
  slug: travelPackage.slug,
  title: travelPackage.title,
  location: travelPackage.destination,
  category: travelPackage.category,
  duration: travelPackage.duration,
  description: travelPackage.description,
  href: `/tours/${travelPackage.slug}`,
  image: travelPackage.image,
  imageAlt: travelPackage.imageAlt,
  imageCredit: travelPackage.imageCredit,
  imageLicense: travelPackage.imageLicense,
  imageSource: travelPackage.imageSource,
}))

export const articles: Article[] = [
  {
    slug: 'first-time-in-nepal', title: 'A thoughtful first journey through Nepal', category: 'Travel guide', date: 'A field guide',
    excerpt: 'A few practical ideas for finding your pace, choosing a route and making room for the unexpected.', readingTime: '6 min read',
    ...imageAttribution(photoSets.kathmandu[3]),
    content: ['Nepal rewards curiosity. A first visit does not need to cover every region; a thoughtful route leaves room for the places and people that stay with you.', 'Begin with the season and the time you have. The Kathmandu Valley offers layered heritage, while Pokhara is a natural pause before a trek or a journey into the hills.', 'For mountain travel, build in flexibility. Weather and road conditions can change, so a little breathing room can make the whole journey more comfortable.'],
  },
  {
    slug: 'what-to-pack-for-a-himalayan-walk', title: 'What to pack for a Himalayan walk', category: 'Trekking', date: 'A practical checklist',
    excerpt: 'Layering, footwear and the small essentials that make a day on the trail more comfortable.', readingTime: '5 min read',
    ...imageAttribution(photoSets['annapurna-region'][3]),
    content: ['A good packing list starts with the route, season and altitude. Ask your local team for a current list before you travel.', 'Layers are more useful than one heavy garment. A breathable base, warm mid-layer and weather-resistant outer layer let you adapt to changing conditions.', 'Comfortable broken-in footwear, sun protection, a refillable water bottle and personal medication are everyday essentials. Keep your pack light and carry what you can manage comfortably.'],
  },
  {
    slug: 'culture-and-care-in-nepal', title: 'Travel with care: a few cultural notes', category: 'Culture', date: 'Before you go',
    excerpt: 'Small gestures that help make visits to temples, villages and homes more respectful.', readingTime: '4 min read',
    ...imageAttribution(photoSets.lumbini[1]),
    content: ['A warm greeting and a little patience go a long way. When visiting a home or place of worship, look for local guidance and follow the customs shared with you.', 'Ask before photographing people, remove shoes where requested and dress with consideration in sacred spaces.', 'Choosing local guides and locally run businesses can make a visit more meaningful while supporting the communities that welcome travelers.'],
  },
]

export const services = [
  { title: 'Flights & air tickets', status: 'Enquire', description: 'Ask our team about domestic or international flight planning.', icon: '✈' },
  { title: 'Bus tickets', status: 'Coming soon', description: 'Intercity bus reservation support is planned for a future phase.', icon: '↗' },
  { title: 'Hotel reservations', status: 'Enquire', description: 'Share your route and preferences for accommodation suggestions.', icon: '⌂' },
  { title: 'Vehicles & transfers', status: 'Enquire', description: 'Plan private ground transport for your Nepal journey.', icon: '↔' },
  { title: 'Tours & trekking', status: 'Enquire', description: 'Explore a sample journey or start with a custom itinerary.', icon: '⌁' },
  { title: 'Travel assistance', status: 'Enquire', description: 'Talk through your travel plans with our Kathmandu-based team.', icon: '＋' },
]

export const galleryImages: DestinationImage[] = [
  photoSets.pokhara[5],
  photoSets.kathmandu[3],
  photoSets['everest-region'][1],
  photoSets.chitwan[5],
  photoSets.mustang[2],
  photoSets.lumbini[1],
]
