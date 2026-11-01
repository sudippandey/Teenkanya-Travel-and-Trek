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
export type DestinationFaq = { question: string; answer: string }
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
  mapQuery: string
  accessNotes: string
  permitNotes: string
  relatedPackageSlugs: string[]
  relatedTrekSlugs: string[]
  planningFaqs: DestinationFaq[]
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
  relatedDestinationSlugs: string[]
  relatedTrekSlugs: string[]
  planningFaqs: DestinationFaq[]
  preQuoteChecklist: string[]
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
    mapQuery: 'Kathmandu Valley, Nepal',
    accessNotes: 'The valley is served by Tribhuvan International Airport. Road travel between heritage sites can take longer than map distances suggest, especially during busy periods.',
    permitNotes: 'A standard valley visit does not use a trekking permit. Heritage sites can have separate entry arrangements, restricted areas and visitor rules; check current information for each monument.',
    relatedPackageSlugs: ['kathmandu-pokhara-discovery'],
    relatedTrekSlugs: [],
    planningFaqs: [
      { question: 'How much time should I allow for Kathmandu Valley?', answer: 'The valley has several distinct heritage areas. Travel time between them depends on traffic and site opening arrangements, so plan a flexible schedule rather than assuming every site fits into one day.' },
      { question: 'Are all heritage areas open to every visitor?', answer: 'Some religious spaces and inner areas have access restrictions. Follow signs and local guidance, and check current visitor rules before entering.' },
      { question: 'Can I combine Kathmandu with Pokhara?', answer: 'The sample Kathmandu and Pokhara journey is a starting point. Transport schedules, time at each place and the final route should be confirmed with the team.' },
    ],
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
    mapQuery: 'Pokhara, Nepal',
    accessNotes: 'Pokhara is a common gateway for the Annapurna region and is connected with Kathmandu by road and domestic air services. Schedules, road conditions and journey times can change.',
    permitNotes: 'A city visit to Pokhara does not itself require a trekking permit. Routes entering the Annapurna Conservation Area have separate entry requirements; confirm the exact route before departure.',
    relatedPackageSlugs: ['kathmandu-pokhara-discovery', 'annapurna-foothills-walk'],
    relatedTrekSlugs: ['annapurna-foothills-walk'],
    planningFaqs: [
      { question: 'Is Pokhara a starting point for Annapurna treks?', answer: 'Yes. Pokhara is a common gateway, but the actual trailhead and onward transport depend on the chosen route.' },
      { question: 'Are mountain views guaranteed?', answer: 'No. Visibility depends on weather, cloud and season. Leave flexibility if mountain views are a priority.' },
      { question: 'Can I add adventure activities?', answer: 'Activities and operators vary. Confirm licences, safety arrangements, weather conditions and current operating status before booking.' },
    ],
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
    mapQuery: 'Everest Region, Solukhumbu, Nepal',
    accessNotes: 'The Khumbu is commonly approached through Lukla or overland trailheads. The right approach depends on the route, season and current flight, road and trail conditions.',
    permitNotes: 'Sagarmatha National Park entry requirements apply. Nepal Tourism Board currently lists Everest Base Camp routes among those covered by its licensed-guide and agency-issued TIMS provision. Confirm the exact requirements for the selected route and traveller.',
    relatedPackageSlugs: ['everest-trail-highlights'],
    relatedTrekSlugs: ['everest-trail-highlights'],
    planningFaqs: [
      { question: 'Does every Everest-region trip go to Everest Base Camp?', answer: 'No. The region includes several routes and viewpoints. The proposed endpoint, overnight plan and any side trips should be stated in the itinerary.' },
      { question: 'What should I know about altitude?', answer: 'High-altitude routes require conservative ascent planning. Sleeping elevations, acclimatisation days and the highest point should be confirmed before travel.' },
      { question: 'Can flights to Lukla be delayed?', answer: 'Weather and operating conditions can affect mountain flights. Keep contingency time and confirm the latest arrangements with the operator.' },
    ],
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
    mapQuery: 'Annapurna Region, Nepal',
    accessNotes: 'Pokhara is a common gateway, but the Annapurna region has multiple trailheads and approach routes. Road transfers and walking routes depend on the selected trek.',
    permitNotes: 'Routes entering the Annapurna Conservation Area require the relevant conservation-area entry permit. Guide and TIMS requirements depend on the exact route and current government rules; verify before departure.',
    relatedPackageSlugs: ['annapurna-foothills-walk'],
    relatedTrekSlugs: ['annapurna-foothills-walk'],
    planningFaqs: [
      { question: 'Which Annapurna trek is right for me?', answer: 'The region includes routes with very different durations, elevations and difficulty. Choose after comparing the actual daily stages, highest sleeping altitude and available time.' },
      { question: 'Do all Annapurna routes have the same permit requirements?', answer: 'No. Requirements depend on the exact route and current rules. Confirm the permit checklist for the itinerary you plan to follow.' },
      { question: 'Are teahouses available?', answer: 'Accommodation varies by route and settlement. Ask for the overnight plan and expected facilities before confirming a trip.' },
    ],
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
    contentSources: [{ label: 'Nepal Tourism Board — Annapurna Region', url: 'https://ntb.gov.np/en/annapurnaregion' }],
  },
  {
    slug: 'chitwan', title: 'Chitwan', region: 'Southern Nepal', category: 'Wildlife',
    description: 'River edges, grasslands and forest habitats in Nepal’s southern lowlands.',
    heroImage: photoSets.chitwan[5], gallery: photoSets.chitwan,
    bestTime: 'Cooler months are generally more comfortable for outdoor activities; wildlife sightings are never guaranteed.',
    mapQuery: 'Chitwan National Park, Nepal',
    accessNotes: 'Park and community access points in Chitwan are reached by road from several major cities. The best arrival point and transfer depend on the chosen lodge or activity.',
    permitNotes: 'National park entry and activity rules depend on the area and activity. Confirm current park fees, permitted activities and operator arrangements before visiting.',
    relatedPackageSlugs: ['wild-nepal-chitwan'],
    relatedTrekSlugs: [],
    planningFaqs: [
      { question: 'Will I definitely see a rhinoceros or tiger?', answer: 'No wildlife sighting can be guaranteed. Animals move freely in their habitat, and sightings depend on season, conditions and chance.' },
      { question: 'Are all activities allowed inside the park?', answer: 'No. Activities are subject to park rules, designated areas and current conditions. Follow authorized guides and park instructions.' },
      { question: 'How should I behave around wildlife?', answer: 'Keep a safe distance, never feed or approach animals, and follow instructions from the guide throughout the visit.' },
    ],
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
    mapQuery: 'Mustang, Nepal',
    accessNotes: 'Jomsom and lower Mustang access can involve road or air connections, depending on the season and current conditions. Upper Mustang requires additional route-specific planning.',
    permitNotes: 'Upper Mustang is a restricted area and requires a special permit arranged under current government rules. This requirement does not apply uniformly to every place described as Mustang; confirm the exact route and permit category.',
    relatedPackageSlugs: [],
    relatedTrekSlugs: [],
    planningFaqs: [
      { question: 'Does visiting all of Mustang require a restricted-area permit?', answer: 'No. The special restricted-area permit applies to designated Upper Mustang areas, not every location in Mustang. Confirm the exact route before travel.' },
      { question: 'Can Mustang be visited during the monsoon?', answer: 'Some areas lie in a rain-shadow region, but access, weather and road conditions still vary. Check current local advice for the specific route.' },
      { question: 'Can I travel independently into Upper Mustang?', answer: 'Restricted-area rules can require permits and agency arrangements. Confirm current requirements with an authorized operator before making plans.' },
    ],
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
    contentSources: [{ label: 'Nepal Tourism Board — Annapurna Region & Mustang', url: 'https://trade.ntb.gov.np/tourist-destination/annapurna-region/' }],
  },
  {
    slug: 'langtang', title: 'Langtang Valley', region: 'Northern Nepal', category: 'Trekking',
    description: 'An alpine valley shaped by mountain trails, Tamang culture and high pastures.',
    heroImage: photoSets.langtang[0], gallery: photoSets.langtang,
    bestTime: 'Spring and autumn are commonly chosen for trekking; snow, weather and trail conditions vary.',
    mapQuery: 'Langtang Valley, Rasuwa, Nepal',
    accessNotes: 'Langtang routes are commonly approached by road from Kathmandu via Dhunche or Syabrubesi. Road conditions and travel times vary, so confirm the current access plan before departure.',
    permitNotes: 'Langtang National Park entry requirements apply. Nepal Tourism Board currently lists Langtang routes among those covered by its revised TIMS and licensed-guide provision. Confirm current requirements for the exact itinerary.',
    relatedPackageSlugs: [],
    relatedTrekSlugs: ['langtang-valley-trail'],
    planningFaqs: [
      { question: 'Where does the Langtang Valley trek begin?', answer: 'The common valley route starts from Syabrubesi and follows the valley towards Langtang Village and Kyanjin Gompa. Confirm the exact starting point and road transfer in the proposed itinerary.' },
      { question: 'How high is Kyanjin Gompa?', answer: 'Nepal Tourism Board material places Kyanjin at approximately 3,800 m. Optional viewpoint walks climb higher and should be assessed separately.' },
      { question: 'Is the road to the trailhead always reliable?', answer: 'Road conditions can change with weather and local events. Keep flexibility and confirm the latest access information before travel.' },
    ],
    highlights: ['Langtang National Park', 'Kyanjin Gompa', 'Langtang Lirung', 'Tamang communities', 'Alpine landscapes'],
    activities: ['Trekking', 'Village visits', 'Viewpoint walks', 'Local food and culture experiences'],
    overview: 'Langtang Valley is a Himalayan trekking area within Langtang National Park. The route passes through mountain communities and changing alpine terrain. Local guidance, current trail conditions and a considered pace are important to a comfortable journey.',
    attractions: [
      { name: 'Langtang Valley', description: 'A high Himalayan valley with trekking routes and mountain settlements.', image: photoSets.langtang[3] },
      { name: 'Kyanjin Gompa', description: 'A settlement and trekking waypoint in the upper valley; current access should be confirmed locally.', image: photoSets.langtang[6] },
      { name: 'Langtang Lirung', description: 'A prominent mountain in the region; visibility depends on weather and route.', image: photoSets.langtang[7] },
      { name: 'Langtang National Park', description: 'A protected area with mountain habitats and wildlife; follow park guidance.', image: photoSets.langtang[4] },
      { name: 'Langtang Village', description: 'A mountain settlement along the valley route; follow local guidance and confirm current access conditions.', image: photoSets.langtang[8] },
    ],
    practicalTips: ['Plan for altitude and changing weather, and allow a flexible schedule.', 'Confirm trail access and current local conditions before departure.', 'Choose local services respectfully and carry out all waste.'],
    contentSources: [{ label: 'Nepal Tourism Board — Langtang National Park', url: 'https://ntb.gov.np/en/langtang-national-park' }],
  },
  {
    slug: 'lumbini', title: 'Lumbini', region: 'Southern Nepal', category: 'Pilgrimage',
    description: 'A contemplative heritage landscape and an important Buddhist pilgrimage site.',
    heroImage: photoSets.lumbini[0], gallery: photoSets.lumbini,
    bestTime: 'Cooler months are generally more comfortable for time outdoors; check local weather and site hours.',
    mapQuery: 'Lumbini, Nepal',
    accessNotes: 'Lumbini can be reached by road and through regional air connections with onward transfers. Confirm current flight schedules and ground transport for the travel dates.',
    permitNotes: 'A standard Lumbini heritage visit does not imply a restricted-area trekking permit. Site entry arrangements, opening hours and visitor rules may apply; check current local guidance.',
    relatedPackageSlugs: [],
    relatedTrekSlugs: [],
    planningFaqs: [
      { question: 'Is Lumbini mainly a pilgrimage destination?', answer: 'Lumbini is an important Buddhist pilgrimage and heritage site. Visitors with different interests are welcome to explore respectfully and follow site guidance.' },
      { question: 'How should I dress and behave at religious sites?', answer: 'Choose respectful clothing, follow posted rules and ask before photographing worshippers or ceremonies.' },
      { question: 'Can Lumbini be combined with other destinations?', answer: 'It can be included in a wider Nepal journey, but travel distances and connections should be planned around the available time.' },
    ],
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
    relatedDestinationSlugs: ['kathmandu', 'pokhara'],
    relatedTrekSlugs: [],
    planningFaqs: [
      { question: 'Is this a fixed departure?', answer: 'No fixed departure date is published here. This is a sample seven-day outline; timing and arrangements are confirmed after you share your travel dates.' },
      { question: 'Are international flights included?', answer: 'International airfare and travel insurance are listed as exclusions. Any domestic transport and other inclusions should be confirmed in the written proposal.' },
      { question: 'Can I change the pace or places visited?', answer: 'The outline is a starting point. Discuss your interests, available time and preferred pace with the team before the itinerary is confirmed.' },
    ],
    preQuoteChecklist: [
      'Confirm the exact day-by-day route and overnight stops.',
      'List accommodation type, meals and any dietary arrangements.',
      'Specify transport, guide and local support arrangements.',
      'Confirm permits, entry fees, exclusions and any seasonal contingencies.',
    ],
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
    relatedDestinationSlugs: ['pokhara', 'annapurna-region'],
    relatedTrekSlugs: ['annapurna-foothills-walk'],
    planningFaqs: [
      { question: 'Which exact trail does this sample use?', answer: 'The current outline describes village and forest trails but does not identify one operating route. The precise trail, overnight stops and daily stages must be confirmed before it is treated as a fixed itinerary.' },
      { question: 'What is the highest altitude?', answer: 'A maximum altitude is not published for this sample. Ask the team to confirm the highest point and sleeping elevations for the proposed route.' },
      { question: 'Are meals and accommodation included?', answer: 'They are not specified in this sample outline. Ask for the accommodation type, meal plan and any dietary arrangements to be listed clearly in the written proposal.' },
    ],
    preQuoteChecklist: [
      'Confirm the exact day-by-day route and overnight stops.',
      'List accommodation type, meals and any dietary arrangements.',
      'Specify transport, guide and local support arrangements.',
      'Confirm permits, entry fees, exclusions and any seasonal contingencies.',
    ],
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
    relatedDestinationSlugs: ['everest-region'],
    relatedTrekSlugs: ['everest-trail-highlights'],
    planningFaqs: [
      { question: 'Does this itinerary reach Everest Base Camp?', answer: 'The sample is titled Everest Trail Highlights and does not promise Everest Base Camp or Kala Patthar. The exact endpoint, overnight plan and highest point must be confirmed in the written itinerary.' },
      { question: 'Are flights to Lukla included?', answer: 'Flights to Lukla are listed as an exclusion in this sample. Confirm the actual transport plan, fare treatment and contingency arrangements in the quote.' },
      { question: 'How are acclimatisation days handled?', answer: 'The sample mentions time around Namche for acclimatisation. The full ascent and sleeping-altitude plan should be reviewed and confirmed for the selected route and traveller.' },
    ],
    preQuoteChecklist: [
      'Confirm the exact day-by-day route and overnight stops.',
      'List accommodation type, meals and any dietary arrangements.',
      'Specify transport, guide and local support arrangements.',
      'Confirm permits, entry fees, exclusions and any seasonal contingencies.',
    ],
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
    relatedDestinationSlugs: ['chitwan'],
    relatedTrekSlugs: [],
    planningFaqs: [
      { question: 'Will I definitely see wildlife?', answer: 'No. Wildlife sightings are never guaranteed. Activities depend on season, park rules, local conditions and the movement of wild animals.' },
      { question: 'Are park fees included?', answer: 'Park fees are listed as excluded unless agreed. The written proposal should state any applicable entry fees and activity charges.' },
      { question: 'Which activities are included?', answer: 'The sample refers to locally guided nature experiences. Confirm the specific activities, permitted areas, guide arrangements and fees before travel.' },
    ],
    preQuoteChecklist: [
      'Confirm the exact day-by-day route and overnight stops.',
      'List accommodation type, meals and any dietary arrangements.',
      'Specify transport, guide and local support arrangements.',
      'Confirm permits, entry fees, exclusions and any seasonal contingencies.',
    ],
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
  { number: '01', title: 'Flights & air tickets', status: 'Enquire', description: 'Ask our team about domestic or international flight planning.' },
  { number: '02', title: 'Bus tickets', status: 'Coming soon', description: 'Intercity bus reservation support is planned for a future phase.' },
  { number: '03', title: 'Hotel reservations', status: 'Enquire', description: 'Share your route and preferences for accommodation suggestions.' },
  { number: '04', title: 'Vehicles & transfers', status: 'Enquire', description: 'Plan private ground transport for your Nepal journey.' },
  { number: '05', title: 'Tours & trekking', status: 'Enquire', description: 'Explore a sample journey or start with a custom itinerary.' },
  { number: '06', title: 'Travel assistance', status: 'Enquire', description: 'Talk through your travel plans with our Kathmandu-based team.' },
]

export const galleryImages: DestinationImage[] = [
  photoSets.pokhara[5],
  photoSets.kathmandu[3],
  photoSets['everest-region'][1],
  photoSets.chitwan[5],
  photoSets.mustang[2],
  photoSets.lumbini[1],
]
