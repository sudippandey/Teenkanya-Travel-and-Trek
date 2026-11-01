export type TrekRouteStage = {
  name: string
  detail: string
}

export type TrekProfile = {
  routeSummary: string
  routeStages: TrekRouteStage[]
  altitudeNote: string
  permits: string[]
  accommodation: string[]
  bestSeason: string
  preparation: string[]
  safetyNotes: string[]
  contentSources: { label: string; url: string }[]
}

/**
 * Public-facing trek facts are deliberately separated from the brochure cards.
 * Keep route-specific details sourced and review them with the operations team
 * before describing them as a confirmed Teenkanya departure.
 */
export const trekProfiles: Record<string, TrekProfile> = {
  'everest-trail-highlights': {
    routeSummary:
      'The classic Khumbu approach follows the Dudh Koshi valley through Phakding and Monjo to Namche Bazaar, then continues towards Tengboche and the upper Imja and Khumbu valleys. The exact overnight plan and any extension must be confirmed for the traveller.',
    routeStages: [
      { name: 'Lukla to the Dudh Koshi valley', detail: 'The usual approach begins at Lukla, with early trail stops around Phakding and Monjo.' },
      { name: 'Namche Bazaar', detail: 'A key Sherpa settlement and an important place to pause for acclimatisation.' },
      { name: 'Tengboche and the upper valleys', detail: 'The route continues through the monastery area towards Pheriche or Dingboche, depending on the itinerary.' },
      { name: 'Lobuche and Gorak Shep', detail: 'The higher trail approaches the Khumbu Glacier and the final settlements used for Everest Base Camp and Kala Patthar visits.' },
    ],
    altitudeNote:
      'This is a high-altitude itinerary. The highest point depends on whether the agreed route includes Everest Base Camp, Kala Patthar or another extension. Confirm the final elevation profile before travel.',
    permits: [
      'Sagarmatha National Park entry permit is required for entry to the protected area.',
      'Nepal Tourism Board lists Everest Base Camp routes among routes requiring a licensed guide and agency-issued TIMS card under its revised TIMS provision.',
      'Carry the required permits and follow current checkpoint instructions. Confirm the latest rules before departure.',
    ],
    accommodation: ['Teahouses and lodges are established along the main route; availability and facilities vary by village and season.'],
    bestSeason:
      'Nepal Tourism Board identifies October–November and March–May as the main trekking seasons for Sagarmatha National Park. Weather, flights and trail conditions remain variable.',
    preparation: [
      'Build a conservative acclimatisation schedule into the agreed itinerary.',
      'Use broken-in trekking footwear and layered clothing suitable for changing temperatures.',
      'Confirm the current packing list with the local team after the route and season are agreed.',
    ],
    safetyNotes: [
      'Altitude illness can be life-threatening. Do not treat a sample itinerary as medical or acclimatisation advice.',
      'Nepal Tourism Board advises gradual sleeping-altitude gains above 2,500 m and rest days as elevation increases. Discuss personal health and a safe ascent profile with a qualified professional and the trekking operator.',
      'Weather, trail conditions and flights can change quickly in the Khumbu. Keep contingency time in the plan.',
    ],
    contentSources: [
      { label: 'Nepal Tourism Board — Everest Base Camp route', url: 'https://ntb.gov.np/everest-base-camp' },
      { label: 'Nepal Tourism Board — Sagarmatha National Park', url: 'https://ntb.gov.np/en/sagarmatha-national-park' },
      { label: 'Nepal Tourism Board — TIMS card provision', url: 'https://ntb.gov.np/plan-your-trip/before-you-come/tims-card' },
      { label: 'Nepal Tourism Board — Safety in the mountains', url: 'https://ntb.gov.np/en/plan-your-trip/before-you-come/safety-in-the-mountains' },
      { label: 'Nepal Tourism Board — Park entry fees and permits', url: 'https://ntb.gov.np/en/plan-your-trip/before-you-come/park-entry-fees' },
    ],
  },
  'annapurna-foothills-walk': {
    routeSummary:
      'The current brochure describes village and forest trails beneath the Annapurna range, but it does not yet define a single operating route or overnight sequence. The precise trail, highest overnight point and walking stages must be agreed before publication as a fixed itinerary.',
    routeStages: [],
    altitudeNote:
      'No maximum altitude is published for this sample route because the exact trail has not yet been selected. Do not infer an elevation from the broader Annapurna region.',
    permits: [
      'Annapurna Conservation Area entry requirements apply to routes entering the conservation area.',
      'Nepal Tourism Board also lists an agency-issued TIMS card and licensed guide requirement for many protected trekking routes. Confirm the current rule for the exact route and traveller category.',
    ],
    accommodation: [
      'Lodges, teahouses and camping options exist in the wider Annapurna region. The actual overnight style must be confirmed for the selected trail.',
    ],
    bestSeason:
      'Nepal Tourism Board identifies March–May and September–November as the main trekking seasons for the Annapurna Conservation Area. Conditions vary by elevation and route.',
    preparation: [
      'Choose the exact trail and daily walking plan before finalising a packing list.',
      'Use comfortable, broken-in footwear and clothing suited to the selected elevation and season.',
      'Ask the operator to confirm accommodation, meals, porter arrangements and daily walking expectations in writing.',
    ],
    safetyNotes: [
      'Difficulty labels are indicative, not a fitness or medical assessment.',
      'The route should be planned around the traveller’s experience, health, pace and current trail conditions.',
      'Confirm current permits, guide arrangements and local conditions before departure.',
    ],
    contentSources: [
      { label: 'Nepal Tourism Board — Annapurna Region', url: 'https://trade.ntb.gov.np/tourist-destination/annapurna-region/' },
      { label: 'Nepal Tourism Board — Annapurna Conservation Area', url: 'https://ntb.gov.np/en/annapurna-conservation-area' },
      { label: 'Nepal Tourism Board — TIMS card provision', url: 'https://ntb.gov.np/plan-your-trip/before-you-come/tims-card' },
    ],
  },
  'langtang-valley-trail': {
    routeSummary:
      'The Langtang Valley route follows the valley north from the roadhead at Syabrubesi through forest and mountain settlements towards Langtang Village and Kyanjin Gompa. Side trips above Kyanjin are optional and change the elevation and difficulty of the plan.',
    routeStages: [
      { name: 'Syabrubesi', detail: 'The common road access point for the Langtang Valley route.' },
      { name: 'Lama Hotel and forest trail', detail: 'The trail climbs through forested sections and riverside settlements towards the upper valley.' },
      { name: 'Langtang Village', detail: 'A mountain settlement on the approach to the upper valley.' },
      { name: 'Kyanjin Gompa', detail: 'A high-valley base for local exploration and optional viewpoint walks, subject to conditions and acclimatisation.' },
    ],
    altitudeNote:
      'Nepal Tourism Board material places Kyanjin at approximately 3,800 m. Optional walks to nearby viewpoints climb higher; the chosen high point must be stated in the final itinerary.',
    permits: [
      'Langtang National Park entry permit is required for entry to the protected area.',
      'Nepal Tourism Board’s Langtang guidance also refers to a TIMS card. Confirm the latest documentation and guide requirements for the exact route before departure.',
    ],
    accommodation: [
      'Nepal Tourism Board describes teahouses and lodges along the main Langtang routes, with camping also available in the region. Facilities vary by settlement.',
    ],
    bestSeason:
      'Nepal Tourism Board identifies October–November and March–May as the main seasons for Langtang National Park. Higher elevations can be cold; monsoon and winter conditions need separate planning.',
    preparation: [
      'Allow time for gradual ascent and acclimatisation before optional high viewpoint walks.',
      'Pack layers and weather protection for changing temperatures between forest and alpine elevations.',
      'Confirm the final route, overnight stops and current trail access before departure.',
    ],
    safetyNotes: [
      'Altitude illness can be life-threatening. Optional viewpoint hikes should not be treated as compulsory itinerary stops.',
      'Follow a conservative ascent plan and seek qualified medical advice about altitude risk where appropriate.',
      'Road access, weather and trail conditions can change; confirm locally before departure.',
    ],
    contentSources: [
      { label: 'Nepal Tourism Board — Langtang Region', url: 'https://trade.ntb.gov.np/tourist-destination/langtang-region/' },
      { label: 'Nepal Tourism Board — Langtang National Park', url: 'https://ntb.gov.np/langtang' },
      { label: 'Nepal Tourism Board — Safety in the mountains', url: 'https://ntb.gov.np/en/plan-your-trip/before-you-come/safety-in-the-mountains' },
      { label: 'Nepal Tourism Board — Park entry fees and permits', url: 'https://ntb.gov.np/en/plan-your-trip/before-you-come/park-entry-fees' },
    ],
  },
}
