export type Destination = {
  slug: string
  title: string
  region: string
  category: string
  description: string
  image: string
  bestTime: string
  highlights: string[]
  activities: string[]
  overview: string
}

export type TravelPackage = {
  slug: string
  title: string
  destination: string
  duration: string
  days: number
  category: string
  description: string
  image: string
  highlights: string[]
  itinerary: { day: string; title: string; detail: string }[]
  inclusions: string[]
  exclusions: string[]
}

export type Article = {
  slug: string
  title: string
  category: string
  date: string
  excerpt: string
  image: string
  readingTime: string
  content: string[]
}

export type BrowseItem = {
  slug: string
  title: string
  location: string
  category: string
  duration?: string
  description: string
  image: string
  href: string
  label?: string
}

const photo = (id: string, width = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const destinations: Destination[] = [
  {
    slug: 'kathmandu', title: 'Kathmandu Valley', region: 'Central Nepal', category: 'Culture',
    description: 'Ancient courtyards, living temples and a city that rewards a slower look.',
    image: photo('photo-1605640840605-14ac1855827b'), bestTime: 'September – November · March – May',
    highlights: ['Durbar Square heritage', 'Swayambhunath at sunset', 'Patan’s artisan lanes'],
    activities: ['Heritage walks', 'Local food tours', 'Temple visits'],
    overview: 'Kathmandu is a vivid meeting place of old and new. Across the valley, intricate temples, quiet courtyards and lively neighborhoods offer a close-up view of Nepal’s layered cultural life.'
  },
  {
    slug: 'pokhara', title: 'Pokhara', region: 'Western Nepal', category: 'Nature',
    description: 'A lakeside escape framed by the snow-bright Annapurna range.',
    image: photo('photo-1544735716-392fe2489ffa'), bestTime: 'October – April',
    highlights: ['Phewa Lake', 'Sarangkot sunrise', 'World Peace Pagoda'],
    activities: ['Boating', 'Paragliding', 'Day hikes'],
    overview: 'Pokhara pairs easy lakeside days with close access to the Himalaya. It is a welcoming base for short walks, mountain views and the trails of the Annapurna region.'
  },
  {
    slug: 'everest-region', title: 'Everest Region', region: 'Eastern Nepal', category: 'Trekking',
    description: 'High mountain trails, Sherpa hospitality and the world’s tallest peaks.',
    image: photo('photo-1464822759023-fed622ff2c3b'), bestTime: 'March – May · October – November',
    highlights: ['Namche Bazaar', 'Tengboche Monastery', 'Everest viewpoints'],
    activities: ['High-altitude trekking', 'Village visits', 'Mountain photography'],
    overview: 'The Khumbu is a place of immense scale and generous hospitality. Trails thread through Sherpa villages, prayer-flagged ridges and remarkable mountain scenery.'
  },
  {
    slug: 'annapurna-region', title: 'Annapurna Region', region: 'Western Nepal', category: 'Trekking',
    description: 'A classic Himalayan landscape of forest paths, villages and high passes.',
    image: photo('photo-1519681393784-d120267933ba'), bestTime: 'March – May · October – November',
    highlights: ['Annapurna Base Camp', 'Ghorepani viewpoints', 'Traditional hill villages'],
    activities: ['Trekking', 'Hot springs', 'Cultural encounters'],
    overview: 'The Annapurna region offers an extraordinary range of landscapes and experiences, from subtropical valleys to high alpine terrain, connected by well-loved walking routes.'
  },
  {
    slug: 'chitwan', title: 'Chitwan', region: 'Southern Nepal', category: 'Wildlife',
    description: 'Warm lowland forests, grasslands and wildlife along the Rapti River.',
    image: photo('photo-1549366021-9f761d450615'), bestTime: 'October – March',
    highlights: ['Chitwan National Park', 'Rapti River', 'Tharu culture'],
    activities: ['Nature walks', 'Birdwatching', 'Cultural visits'],
    overview: 'In Nepal’s southern plains, Chitwan brings a gentler pace and a rich natural setting. Explore with local naturalists and learn about the communities connected to this landscape.'
  },
  {
    slug: 'mustang', title: 'Mustang', region: 'Western Nepal', category: 'Culture',
    description: 'Wind-carved desert valleys and a distinctive Himalayan culture.',
    image: photo('photo-1500530855697-b586d89ba3ee'), bestTime: 'March – November',
    highlights: ['Lo Manthang', 'Ancient cave landscapes', 'Trans-Himalayan scenery'],
    activities: ['Jeep journeys', 'Village walks', 'Monastery visits'],
    overview: 'Mustang sits in the rain shadow of the Himalaya. Its wide valleys, red cliffs and historic settlements reveal a distinctive culture shaped by mountain trade routes.'
  },
  {
    slug: 'langtang', title: 'Langtang Valley', region: 'Northern Nepal', category: 'Trekking',
    description: 'A beautiful alpine valley close to Kathmandu and rich in Tamang culture.',
    image: photo('photo-1464278533981-50106e6176b1'), bestTime: 'March – May · October – November',
    highlights: ['Kyanjin Gompa', 'Langtang Lirung', 'Yak pastures'],
    activities: ['Trekking', 'Cheese-farm visits', 'Viewpoint hikes'],
    overview: 'Langtang is an accessible Himalayan trekking region where high ridgelines, alpine pastures and Tamang communities shape a memorable journey.'
  },
  {
    slug: 'lumbini', title: 'Lumbini', region: 'Southern Nepal', category: 'Pilgrimage',
    description: 'A serene pilgrimage landscape and the birthplace of the Buddha.',
    image: photo('photo-1518005020951-eccb494ad742'), bestTime: 'October – March',
    highlights: ['Sacred Garden', 'Maya Devi Temple', 'Monastic zone'],
    activities: ['Pilgrimage', 'Cycling', 'Meditation'],
    overview: 'Lumbini is a place for reflection and discovery. The Sacred Garden and international monasteries welcome visitors from across the world.'
  },
]

export const packages: TravelPackage[] = [
  {
    slug: 'kathmandu-pokhara-discovery', title: 'Kathmandu & Pokhara Discovery', destination: 'Kathmandu · Pokhara', duration: '7 days', days: 7, category: 'Culture & nature',
    description: 'A considered introduction to Nepal, from historic valley squares to quiet lakeside mornings.',
    image: photo('photo-1544735716-392fe2489ffa'),
    highlights: ['Guided heritage walk in Kathmandu', 'Scenic journey to Pokhara', 'Sunrise from Sarangkot'],
    itinerary: [
      { day: 'Day 01', title: 'Arrive in Kathmandu', detail: 'Arrive in the valley and settle in. Your day is kept open for rest and an initial orientation.' },
      { day: 'Day 02', title: 'Kathmandu heritage', detail: 'Explore a selection of historic squares, temples and local neighborhoods with a guide.' },
      { day: 'Day 03', title: 'Valley at your pace', detail: 'Choose a local experience or enjoy a relaxed day before traveling west.' },
      { day: 'Day 04', title: 'Journey to Pokhara', detail: 'Travel through changing landscapes to the lakeside city of Pokhara.' },
      { day: 'Day 05', title: 'Lakeside and mountain views', detail: 'Enjoy time by the lake and a memorable sunrise viewpoint, weather permitting.' },
      { day: 'Day 06–07', title: 'Return and departure', detail: 'Return to Kathmandu and connect with your onward journey.' },
    ],
    inclusions: ['Accommodation planning', 'Local ground transfers', 'Guided visits as listed'], exclusions: ['International airfare', 'Travel insurance', 'Personal expenses']
  },
  {
    slug: 'annapurna-foothills-walk', title: 'Annapurna Foothills Walk', destination: 'Pokhara · Annapurna', duration: '8 days', days: 8, category: 'Trekking',
    description: 'Walk village trails and forest paths beneath the Annapurna range, with time to settle into the rhythm of the hills.',
    image: photo('photo-1519681393784-d120267933ba'),
    highlights: ['Panoramic Himalayan views', 'Village and forest trails', 'Flexible private itinerary'],
    itinerary: [
      { day: 'Day 01', title: 'Arrive in Kathmandu', detail: 'Welcome and orientation in Nepal’s capital.' },
      { day: 'Day 02', title: 'Travel to Pokhara', detail: 'Journey west to the foothills and prepare for the walk.' },
      { day: 'Day 03–06', title: 'On the trail', detail: 'Walk between villages and forested ridges with a local trekking team.' },
      { day: 'Day 07–08', title: 'Return to Pokhara', detail: 'Come back to Pokhara and connect onward via Kathmandu.' },
    ],
    inclusions: ['Trek planning', 'Local guide coordination', 'Ground transport planning'], exclusions: ['International flights', 'Personal trekking equipment', 'Travel insurance']
  },
  {
    slug: 'everest-trail-highlights', title: 'Everest Trail Highlights', destination: 'Khumbu · Everest Region', duration: '12 days', days: 12, category: 'Trekking',
    description: 'A high-altitude journey through Sherpa settlements and the iconic landscapes of the Khumbu.',
    image: photo('photo-1464822759023-fed622ff2c3b'),
    highlights: ['Namche Bazaar acclimatization', 'Tengboche visit', 'Expert local trekking support'],
    itinerary: [
      { day: 'Day 01–02', title: 'Kathmandu and Lukla', detail: 'Prepare in Kathmandu, then travel to the Khumbu when conditions allow.' },
      { day: 'Day 03–05', title: 'Namche and acclimatization', detail: 'Follow the Dudh Koshi valley and take time to acclimatize around Namche.' },
      { day: 'Day 06–09', title: 'Into the high country', detail: 'Continue through the high villages and viewpoints of the Everest region.' },
      { day: 'Day 10–12', title: 'Return journey', detail: 'Retrace the trail and return to Kathmandu, with travel subject to conditions.' },
    ],
    inclusions: ['Trek planning and briefing', 'Local guide coordination', 'Route and acclimatization guidance'], exclusions: ['Flights to Lukla', 'Travel insurance', 'Personal equipment and expenses']
  },
  {
    slug: 'wild-nepal-chitwan', title: 'Wild Nepal: Chitwan Escape', destination: 'Kathmandu · Chitwan', duration: '5 days', days: 5, category: 'Wildlife',
    description: 'A gentle journey from the capital to the subtropical landscape of Nepal’s southern plains.',
    image: photo('photo-1549366021-9f761d450615'),
    highlights: ['Time in Chitwan National Park', 'Local naturalist-led experiences', 'Tharu community introduction'],
    itinerary: [
      { day: 'Day 01', title: 'Arrive in Kathmandu', detail: 'Settle into the valley and prepare for the journey south.' },
      { day: 'Day 02', title: 'Travel to Chitwan', detail: 'Journey to the lowlands and meet your local host.' },
      { day: 'Day 03', title: 'Explore the landscape', detail: 'Choose from guided nature experiences based on season and local conditions.' },
      { day: 'Day 04–05', title: 'Return to Kathmandu', detail: 'Enjoy a final morning before traveling back for your onward connection.' },
    ],
    inclusions: ['Ground travel planning', 'Local experience coordination', 'Accommodation suggestions'], exclusions: ['International airfare', 'Park fees unless agreed', 'Personal expenses']
  },
]

export const treks: BrowseItem[] = [
  { slug: 'everest-trail-highlights', title: 'Everest Trail Highlights', location: 'Everest Region', category: 'Challenging', duration: '12 days', description: 'A Himalayan journey through Sherpa villages and the high country of the Khumbu.', image: photo('photo-1464822759023-fed622ff2c3b'), href: '/trekking/everest-trail-highlights', label: 'High altitude' },
  { slug: 'annapurna-foothills-walk', title: 'Annapurna Foothills Walk', location: 'Annapurna Region', category: 'Moderate', duration: '8 days', description: 'Forest trails and welcoming villages beneath the Annapurna range.', image: photo('photo-1519681393784-d120267933ba'), href: '/trekking/annapurna-foothills-walk', label: 'Village trails' },
  { slug: 'langtang-valley-trail', title: 'Langtang Valley Trail', location: 'Langtang Region', category: 'Moderate', duration: '9 days', description: 'An alpine valley trek with mountain views and rich Tamang culture.', image: photo('photo-1464278533981-50106e6176b1'), href: '/trekking/langtang-valley-trail', label: 'Alpine valley' },
]

export const destinationItems: BrowseItem[] = destinations.map(({ slug, title, region, category, description, image }) => ({
  slug, title, location: region, category, description, image, href: `/destinations/${slug}`,
}))

export const packageItems: BrowseItem[] = packages.map(({ slug, title, destination, category, duration, description, image }) => ({
  slug, title, location: destination, category, duration, description, image, href: `/tours/${slug}`,
}))

export const articles: Article[] = [
  {
    slug: 'first-time-in-nepal', title: 'A thoughtful first journey through Nepal', category: 'Travel guide', date: 'A field guide',
    excerpt: 'A few practical ideas for finding your pace, choosing a route and making room for the unexpected.', image: photo('photo-1605640840605-14ac1855827b'), readingTime: '6 min read',
    content: ['Nepal rewards curiosity. A first visit does not need to cover every region; a thoughtful route leaves room for the places and people that stay with you.', 'Begin with the season and the time you have. The Kathmandu Valley offers layered history, while Pokhara is a natural pause before a trek or a journey into the hills.', 'For mountain travel, build in flexibility. Weather and road conditions can change, so a little breathing room can make the whole journey more comfortable.']
  },
  {
    slug: 'what-to-pack-for-a-himalayan-walk', title: 'What to pack for a Himalayan walk', category: 'Trekking', date: 'A practical checklist',
    excerpt: 'Layering, footwear and the small essentials that make a day on the trail more comfortable.', image: photo('photo-1454496522488-7a8e488e8606'), readingTime: '5 min read',
    content: ['A good packing list starts with the route, season and altitude. Ask your local team for a current list before you travel.', 'Layers are more useful than one heavy garment. A breathable base, warm mid-layer and weather-resistant outer layer let you adapt to changing conditions.', 'Comfortable broken-in footwear, sun protection, a refillable water bottle and personal medication are everyday essentials. Keep your pack light and carry what you can manage comfortably.']
  },
  {
    slug: 'culture-and-care-in-nepal', title: 'Travel with care: a few cultural notes', category: 'Culture', date: 'Before you go',
    excerpt: 'Small gestures that help make visits to temples, villages and homes more respectful.', image: photo('photo-1518005020951-eccb494ad742'), readingTime: '4 min read',
    content: ['A warm greeting and a little patience go a long way. When visiting a home or place of worship, look for local guidance and follow the customs shared with you.', 'Ask before photographing people, remove shoes where requested and dress with consideration in sacred spaces.', 'Choosing local guides and locally run businesses can make a visit more meaningful while supporting the communities that welcome travelers.']
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

export const galleryImages = [
  { src: photo('photo-1464822759023-fed622ff2c3b', 1000), alt: 'Snow-covered Himalayan peaks under a clear sky' },
  { src: photo('photo-1605640840605-14ac1855827b', 900), alt: 'Traditional architecture in Kathmandu Valley' },
  { src: photo('photo-1544735716-392fe2489ffa', 900), alt: 'Lakeside scenery in Pokhara' },
  { src: photo('photo-1519681393784-d120267933ba', 900), alt: 'Mountain landscape in the Annapurna region' },
  { src: photo('photo-1549366021-9f761d450615', 900), alt: 'Green forest in Nepal’s southern plains' },
  { src: photo('photo-1464278533981-50106e6176b1', 900), alt: 'Alpine landscape in the Langtang region' },
]
