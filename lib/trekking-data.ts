export type TrekRouteStage = {
  name: string
  detail: string
}

export type TrekSeason = {
  season: string
  conditions: string
  planning: string
}

export type TrekFaq = {
  question: string
  answer: string
}

export type TrekProfile = {
  routeSummary: string
  routeStages: TrekRouteStage[]
  altitudeNote: string
  permits: string[]
  accommodation: string[]
  bestSeason: string
  seasonCalendar: TrekSeason[]
  faqs: TrekFaq[]
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
    seasonCalendar: [
      { season: 'Spring · March–May', conditions: 'A commonly chosen trekking window in Sagarmatha National Park. Conditions still change with altitude and weather.', planning: 'Confirm flight operations, trail conditions and the final acclimatisation schedule.' },
      { season: 'Autumn · October–November', conditions: 'Another main trekking window identified by Nepal Tourism Board for Sagarmatha National Park.', planning: 'Book and confirm logistics with flexibility for weather-related changes.' },
      { season: 'Monsoon · June–September', conditions: 'Rain, cloud and access disruption can affect lower approaches and flights.', planning: 'Seek current local advice before considering this period.' },
      { season: 'Winter · December–February', conditions: 'Cold and snow can affect higher sections and accommodation availability.', planning: 'A route-specific assessment is essential; no standard itinerary is assumed.' },
    ],
    faqs: [
      { question: 'Is Everest Base Camp included in this sample trek?', answer: 'The current sample listing is called Everest Trail Highlights. Everest Base Camp and Kala Patthar are route options, not guaranteed inclusions. The exact endpoint and overnight plan must be stated in the written itinerary.' },
      { question: 'What is the highest altitude?', answer: 'There is no single maximum for this sample listing. The high point depends on the agreed route, including whether it reaches Everest Base Camp, Kala Patthar or another extension.' },
      { question: 'What permits should I expect?', answer: 'The route enters Sagarmatha National Park. Nepal Tourism Board currently lists Everest Base Camp routes among those requiring a licensed guide and agency-issued TIMS card. The team should confirm current requirements for the exact route and traveller.' },
      { question: 'Can the itinerary be changed?', answer: 'The published outline is a starting point. Ask the team to confirm the walking stages, acclimatisation days, overnight stops and services before treating it as an operating itinerary.' },
    ],
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
    seasonCalendar: [
      { season: 'Spring · March–May', conditions: 'Nepal Tourism Board identifies this as one of the main trekking seasons in the Annapurna Conservation Area.', planning: 'The exact route and elevation determine temperatures, trail conditions and visibility.' },
      { season: 'Autumn · September–November', conditions: 'A main trekking window for the Annapurna Conservation Area, with local conditions varying by valley.', planning: 'Confirm the chosen trail, accommodation and current access with the local team.' },
      { season: 'Monsoon · June–August', conditions: 'Rain can affect trails, road access and visibility; conditions vary across the region.', planning: 'Do not assume all Annapurna routes have the same monsoon suitability.' },
      { season: 'Winter · December–February', conditions: 'Higher elevations can be cold and some routes may experience snow or disruption.', planning: 'Select a lower route only after checking current conditions and access.' },
    ],
    faqs: [
      { question: 'Which exact Annapurna trail is included?', answer: 'The current brochure describes foothill village and forest walking but does not yet define one operating trail. The route, overnight stops and daily stages must be confirmed before a fixed itinerary is published.' },
      { question: 'What is the highest altitude?', answer: 'A maximum altitude is not published for this sample walk because the exact route has not been selected. The team should confirm the highest point and sleeping elevations in the proposed itinerary.' },
      { question: 'Which permits are needed?', answer: 'Routes entering the Annapurna Conservation Area require the relevant conservation-area entry permit. Other requirements depend on the precise route and current government rules; confirm before departure.' },
      { question: 'Is this suitable for first-time trekkers?', answer: 'The current “Moderate” label is indicative only. Suitability depends on the actual route, daily walking, elevation, health and previous experience, so discuss these with the team before choosing.' },
    ],
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
    seasonCalendar: [
      { season: 'Spring · March–May', conditions: 'A main trekking season identified by Nepal Tourism Board for Langtang National Park.', planning: 'Expect colder conditions as the route gains elevation and confirm current trail access.' },
      { season: 'Autumn · October–November', conditions: 'A main trekking season for Langtang National Park; visibility and weather remain variable.', planning: 'Confirm road access to the trailhead and overnight stops before travel.' },
      { season: 'Monsoon · June–September', conditions: 'Rain can affect trails and road access; landslide and weather disruption are possible.', planning: 'Check current local conditions rather than relying on a fixed seasonal promise.' },
      { season: 'Winter · December–February', conditions: 'Nepal Tourism Board notes snow and cold conditions in the park during winter.', planning: 'Higher sections need a route-specific assessment and suitable equipment.' },
    ],
    faqs: [
      { question: 'Where does the Langtang Valley route go?', answer: 'The common valley route starts from Syabrubesi and follows the valley through forest and mountain settlements towards Langtang Village and Kyanjin Gompa. The final daily stages and side trips must be confirmed.' },
      { question: 'How high is Kyanjin Gompa?', answer: 'Nepal Tourism Board material places Kyanjin at approximately 3,800 m. Optional walks to nearby viewpoints go higher, so the proposed high point should be clearly stated.' },
      { question: 'Are permits required?', answer: 'Langtang National Park entry requirements apply. Nepal Tourism Board also lists Langtang routes in its revised TIMS provision. Confirm the latest permit and guide requirements for the exact itinerary.' },
      { question: 'Can I add a viewpoint hike?', answer: 'Optional viewpoints can add elevation and difficulty. They should be discussed with the guide and included only when the conditions, acclimatisation and traveller’s pace make them appropriate.' },
    ],
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
