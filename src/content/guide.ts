import type { CircuitId, ContactRecord } from "./types";

/* ------------------------------------------------------------------ expedition facts (creator-supplied) */
export const EXPEDITION = { km: "5,200 km", passes: "20+ passes", circuits: "4 circuits", summit: "Umling La" };

/* ------------------------------------------------------------------ A note */
export const NOTE = {
  title: "A note from the road",
  body: [
    "Project Altitude started with a simple idea: what if all the useful information you usually gather from dozens of blogs, Google Maps, local conversations, and fellow riders lived in one place?",
    "The Himalayas don't always follow your plans. A pass might be closed, your fuel calculations might be wrong, a village you expected to pass through might not have a working guesthouse, and your phone might stop getting a signal just when you need it most.",
    "This guide brings together the places, routes, people, and practical information that can make a Himalayan motorcycle journey a little less uncertain.",
    "It's built around four circuits across Zanskar, Nubra, Changthang, and Spiti, connected by the idea that gives this project its name: altitude.",
    "Use it to plan an entire expedition, explore one circuit at a time, find a place to eat, or discover a village you hadn't heard of before.",
    "The map is only the beginning. The best information often comes from the people who live along these roads.",
  ],
  signoff: "Ride prepared. Stay curious. Leave the mountains better than you found them.",
};

/* ------------------------------------------------------------------ Story */
export const STORY = {
  title: "The story behind Project Altitude",
  lead: "5,200 km across Himachal and Ladakh. More than 20 high-altitude mountain passes. Four circuits through Zanskar, Nubra, Changthang, and Spiti. And a ride to the summit of Umling La.",
  body: [
    "Project Altitude grew out of a motorcycle expedition that was as much about the roads as it was about the altitude. Every pass brought a different challenge, every valley had its own character, and every long stretch of road reminded me how much preparation matters when you're riding in the mountains.",
    "The journey took me through remote villages, high-altitude deserts, mountain lakes, and roads where you can't always count on fuel, accommodation, or mobile connectivity being available when you need them.",
    "I wanted to put together something useful from that experience: a map you can explore, routes you can plan around, places worth stopping at, and practical information that helps you make better decisions before heading out.",
    "The idea isn't to prescribe one perfect itinerary. It's to help you find your own way through the mountains.",
    "Whether you're planning the entire expedition or just a few days around one valley, this is a starting point for your next ride.",
  ],
  signoff: "20+ passes. 4 circuits. 5,200 km. One obsession with altitude.",
};

/* ------------------------------------------------------------------ How to use */
export const HOW_TO = {
  title: "Your guide to the mountains",
  lead: "Project Altitude is an interactive field guide to motorcycle travel across Himachal and Ladakh.",
  steps: [
    { n: "01", title: "Start with the map", body: "Explore the four coloured circuits. Zoom into valleys, pan across the terrain, and select marked villages, mountain passes, lakes, and other stops to discover more about each location." },
    { n: "02", title: "Pick your circuit", body: "You don't have to do the entire expedition. Choose Zanskar, Nubra, Changthang, or Spiti and build a journey around the time you have." },
    { n: "03", title: "Plan your stops", body: "Use the villages, food, and stays sections to identify possible overnight stops, places to eat, and towns where you can restock." },
    { n: "04", title: "Prepare for the ride", body: "Check the packing list, road conditions, altitude considerations, fuel gaps, and emergency information before leaving." },
    { n: "05", title: "Find something unexpected", body: "Explore the Gems section for quieter places, detours, unusual landscapes, and stops that deserve more than a quick photograph." },
    { n: "06", title: "Verify before you leave", body: "This is a planning guide, not a live guarantee of road access or services. Confirm current road conditions, permits, weather, accommodation, and fuel availability before each remote section." },
  ],
  tip: "Save important information offline. Mobile data can disappear for long stretches, particularly around remote parts of Zanskar and Changthang.",
};

/* ------------------------------------------------------------------ Credits */
export const CREDITS = {
  title: "Built from the work of many",
  lead: "Project Altitude wouldn't be possible without the people who map roads, maintain geographic datasets, document places, and share local knowledge.",
  data: [
    { name: "OpenStreetMap contributors", use: "Road networks and settlements in Himachal Pradesh", licence: "Open Database License (ODbL) 1.0", link: "https://www.openstreetmap.org/copyright" },
    { name: "Natural Earth", use: "Boundary lines and lakes at 1:10m", licence: "Public domain", link: "https://www.naturalearthdata.com/about/terms-of-use/" },
    { name: "Terrain Tiles on AWS Open Data (Mapzen; SRTM, GMTED and other sources)", use: "Elevation, shaded relief, lakes and rivers traced from the terrain", licence: "Attribution required per source; see the dataset's attribution page", link: "https://github.com/tilezen/joerd/blob/master/docs/attribution.md" },
    { name: "GeoNames", use: "Place coordinates", licence: "Creative Commons Attribution 4.0", link: "https://www.geonames.org/" },
    { name: "scroll-route-demo by Aditya Sharma", use: "Road-following route lines and checkpoints", licence: "MIT", link: "https://github.com/adisharma29/scroll-route-demo" },
  ],
  research: ["Official tourism departments and district administrations.", "Local businesses and accommodation providers.", "Riders and travellers who share their experiences.", "Local residents whose knowledge makes these journeys possible."],
  project: "Route curation, interface, writing, and product direction: Project Altitude.",
  disclaimer: "This guide is an independent travel-planning project, not an official government publication. Map data, route geometry, and travel information may contain errors or become outdated. If you notice something that needs correcting, please get in touch.",
};

/* ------------------------------------------------------------------ Villages: route notes per circuit */
export const ROUTE_NOTES: Record<CircuitId, string[]> = {
  zanskar: [
    "The Kargil–Padum road runs through the Suru Valley and over Pensi La.",
    "Road conditions, construction, stream crossings, and seasonal closures can affect travel times.",
    "Padum is an important place to plan supplies and accommodation, but confirm current availability before departure.",
    "Don't assume that fuel is available in every settlement along the route.",
  ],
  nubra: [
    "The classic Nubra route from Leh uses Khardung La, but road conditions and access rules must be checked.",
    "The Turtuk and Panamik branches are different experiences, reached by separate roads from the Diskit area; they are not one simple loop.",
    "Public tourist areas and military or restricted areas are not the same. Siachen Base Camp is restricted.",
  ],
  changthang: [
    "Changthang is not a place to plan using distance alone. Fuel, weather, altitude, and daylight should determine daily stages.",
    "Pangong Tso, Hanle, Tso Moriri, and Umling La are distinct route branches with their own access and logistics requirements.",
    "Don't assume every section can be connected into a continuous loop at all times.",
    "Border-region access rules can change. Verify them for your nationality and the specific destination.",
  ],
  spiti: [
    "Spiti is reached through Kinnaur all year, and through Lahaul over Kunzum Pass when the pass is open.",
    "Kaza is the practical base for the high villages around it.",
    "Check whether Kunzum Pass is open before planning the Kaza–Manali connection.",
    "Visit monasteries and villages respectfully.",
  ],
};

/* ------------------------------------------------------------------ Food */
export const FOOD = {
  title: "Eat and drink along the way",
  body: [
    "Some of the best meals on a Himalayan ride aren't planned. They're the hot plate of momos you find after a long day, the thukpa that gets you through a cold evening, or the simple meal prepared by a family running a homestay.",
    "This guide is about finding food when you need it and discovering local dishes along the way.",
    "In remote areas, opening hours and availability can be unpredictable, so call ahead whenever possible.",
  ],
  rule: "A good rule for mountain riding: eat well, carry a few backup snacks, and never assume the next settlement will have an open kitchen.",
  categories: [
    { name: "Roadside dhabas", body: "Basic meals, tea, parathas, dal, rice and whatever is available. Best for quick stops on riding days." },
    { name: "Tibetan and Himalayan food", body: "Momos, thukpa, thenthuk, skyu, tingmo, butter tea, and chhurpi and other regional products where available. Not every dish is available in every village." },
    { name: "Local Himachali food", body: "Dishes and local meals around Shimla, Kinnaur, Kullu and Lahaul, such as siddu in the Kullu valley." },
    { name: "Cafés and bakeries", body: "Useful in larger bases and popular traveller settlements." },
    { name: "Homestay meals", body: "Often the best option in remote places. Arrange dinner in advance, particularly when arriving late." },
    { name: "Supplies and packed food", body: "Stock up in larger towns before remote stretches." },
  ],
  byCircuit: [
    { circuit: "zanskar" as CircuitId, base: "Kargil, Padum", advice: "Eat and stock up before remote sections; verify meals and supplies between larger settlements." },
    { circuit: "nubra" as CircuitId, base: "Leh, Diskit, Hunder", advice: "A wider choice in established settlements; plan ahead for remote branches." },
    { circuit: "changthang" as CircuitId, base: "Leh, Tangtse, Hanle (where available)", advice: "Carry backup food and confirm meal arrangements before leaving larger settlements." },
    { circuit: "spiti" as CircuitId, base: "Shimla, Reckong Peo, Kaza", advice: "More options in larger towns; verify availability in smaller villages and on high passes." },
  ],
};

/** Regional dishes: general descriptions, not claims about any one kitchen. Ids match the preview photos. */
export const DISHES = [
  { id: "dish-thukpa", name: "Thukpa", where: "Ladakh, Spiti, Kinnaur", body: "Noodle soup with vegetables or meat. The standard warm-up after a cold riding day." },
  { id: "dish-momo", name: "Momos", where: "Everywhere on the circuits", body: "Steamed or fried dumplings, usually with a chilli sauce. The easiest snack to find in towns." },
  { id: "dish-thenthuk", name: "Thenthuk", where: "Ladakh, Spiti", body: "A soup of hand-pulled flat noodles, heartier than thukpa." },
  { id: "dish-skyu", name: "Skyu", where: "Ladakh", body: "A Ladakhi stew of thumb-pressed wheat pasta with vegetables. Most often found in homes and homestays." },
  { id: "dish-tingmo", name: "Tingmo", where: "Ladakh, Spiti", body: "Soft steamed bread, eaten with curries or soup." },
  { id: "dish-khambir", name: "Khambir", where: "Ladakh", body: "A thick round Ladakhi bread, often with butter tea in the morning." },
  { id: "dish-butter-tea", name: "Butter tea (gur gur cha)", where: "Ladakh, Spiti", body: "Salted tea churned with butter. An acquired taste, and welcome at altitude." },
  { id: "dish-chhurpi", name: "Chhurpi", where: "Changthang, Spiti", body: "Dried cheese from yak or cow milk. Hard enough to chew for a long time on the bike." },
  { id: "dish-siddu", name: "Siddu", where: "Kullu, Manali", body: "Steamed wheat bread with a sweet or savoury filling, served with ghee." },
  { id: "dish-apricot", name: "Apricots", where: "Nubra, Kargil, Kinnaur", body: "Fresh in late summer, dried the rest of the year. Ladakh's apricots are a riding snack in themselves." },
];

/* ------------------------------------------------------------------ Stays */
export const STAYS = {
  title: "Find a place to stop",
  body: [
    "A good place to stay can change an entire riding day.",
    "Sometimes it's a basic room where you can get a hot shower and dry your gear. Sometimes it's a homestay where dinner is ready when you arrive. And sometimes it's simply the place that lets you stop riding before the weather turns.",
    "Availability changes with the season, weather, and local conditions. In remote villages, contact your host before arriving, especially if you're travelling late or outside the main season.",
  ],
  rule: "Don't plan a remote riding day around an unconfirmed bed.",
  categories: [
    { type: "Homestay", ideal: "Local experience and meals", capture: "Host contact, meals, booking confirmation, parking" },
    { type: "Guesthouse", ideal: "Practical overnight stops", capture: "Room availability, hot water, heating, parking" },
    { type: "Hotel", ideal: "Larger service centres", capture: "Price, facilities, parking, cancellation policy" },
    { type: "Campsite", ideal: "Seasonal stays in suitable areas", capture: "Operating dates, facilities, weather restrictions" },
    { type: "Dormitory / hostel", ideal: "Budget travellers", capture: "Bed availability, luggage storage, bike parking" },
    { type: "Basic village accommodation", ideal: "Remote overnight stops", capture: "Advance confirmation, meals, bedding, water, toilets" },
  ],
  hubs: [
    { circuit: "zanskar" as CircuitId, places: "Kargil, Padum, and confirmed overnight stops along the Suru Valley route." },
    { circuit: "nubra" as CircuitId, places: "Leh, Diskit, Hunder, Sumur and Panamik, subject to current availability." },
    { circuit: "changthang" as CircuitId, places: "Leh, Tangtse, and confirmed accommodation around Hanle and the Pangong region. Never assume accommodation exists at every mapped settlement." },
    { circuit: "spiti" as CircuitId, places: "Shimla, Sangla, Kalpa, Nako, Tabo, Kaza, and confirmed stops around Pin Valley." },
  ],
};

/* ------------------------------------------------------------------ Emergency */
export const EMERGENCY = {
  title: "When things don't go to plan",
  body: [
    "The mountains demand a different kind of preparation. A mechanical breakdown can become a serious problem when you're far from the nearest town. Weather can change quickly, and altitude can affect even experienced travellers.",
    "Before setting off, save emergency contacts, share your itinerary with someone, and identify the nearest places where you can get help.",
    "If something goes wrong, prioritise people over the bike. Stay warm, make your location known, and don't take unnecessary risks trying to reach the next destination.",
  ],
  rule: "If the weather, altitude, or road conditions don't feel right, stopping is a valid decision.",
  disclaimer: "This section is a starting point for emergency preparation, not a replacement for professional medical advice or local emergency services.",
  altitudeSigns: ["Headache", "Nausea or vomiting", "Dizziness", "Unusual fatigue or weakness", "Breathlessness out of proportion to activity", "Difficulty walking straight, confusion, or worsening breathing"],
  altitudeSteps: [
    "Stop ascending if symptoms develop.",
    "Do not continue to a higher pass to complete the itinerary.",
    "Seek medical advice promptly.",
    "If symptoms are severe or worsening, arrange urgent descent and emergency medical assistance.",
    "Do not leave a seriously ill rider alone.",
    "Use supplemental oxygen only as an aid while arranging proper care, not as a substitute for descent or evacuation.",
  ],
  altitudeNote: "Project Altitude does not prescribe medicines or treatment. Consult a qualified clinician before departure about altitude risks and any preventive medication. The Ladakh Tourism advisory recommends at least 48 hours of acclimatisation in Leh before higher destinations; check the current official advisory, and remember acclimatisation is not a guarantee against altitude illness.",
  breakdown: ["Move off the road if it is safe to do so.", "Make yourself visible to other traffic.", "Check for obvious issues only if you can do so safely.", "Share your coordinates with your emergency contact.", "Contact a verified mechanic, local assistance provider, or recovery service.", "Do not attempt dangerous roadside repairs on exposed mountain roads."],
  weather: ["Do not force an unsafe stream crossing.", "Avoid riding into darkness to recover lost time.", "Follow local administration and police instructions.", "Contact the appropriate local authority for current road information.", "Wait in a safe location if travel is not possible."],
  roadStatus: [
    { name: "District Lahaul and Spiti (road status and route guidance)", link: "https://hplahaulspiti.nic.in/" },
    { name: "Ladakh Tourism (advisories)", link: "https://ladakh.gov.in/tourism/" },
  ],
};

/** Starting contacts supplied for Project Altitude from official pages. Re-verify each before launch. */
export const CONTACTS: ContactRecord[] = [
  { service: "National emergency response", contact: "112", tel: "112", notes: "General emergency number in India", source: "Government of India", status: "verified", last_verified: null },
  { service: "Leh tourist information", contact: "01982-257788", tel: "+911982257788", notes: "Listed by the Leh District Permit Tracking System", source: "Leh District Permit Tracking System", status: "needs_verification", last_verified: null },
  { service: "SNM Hospital, Leh", contact: "01982-252014", tel: "+911982252014", notes: "Listed on the Ladakh Tourism advisory", source: "Ladakh Tourism advisory", status: "needs_verification", last_verified: null },
  { service: "Kaza Police Station", contact: "01906-222253", tel: "+911906222253", notes: "Listed by the Lahaul and Spiti district administration", source: "District Lahaul and Spiti", status: "needs_verification", last_verified: null },
  { service: "Keylong Police Station", contact: "01900-222223", tel: "+911900222223", notes: "Listed by the Lahaul and Spiti district administration", source: "District Lahaul and Spiti", status: "needs_verification", last_verified: null },
  { service: "Udaipur Police Station, Lahaul", contact: "01909-222253", tel: "+911909222253", notes: "Listed by the Lahaul and Spiti district administration", source: "District Lahaul and Spiti", status: "needs_verification", last_verified: null },
  { service: "Spiti Tourism Office, Kaza", contact: "01906-222202", tel: "+911906222202", notes: "District tourism information", source: "Lahaul and Spiti tourism contacts", status: "needs_verification", last_verified: null },
  { service: "Ladakh Police / tourist assistance", contact: "Official Ladakh Police channels", tel: null, notes: "Verified contact details and app links to be added", source: "Ladakh Police", status: "needs_verification", last_verified: null },
];

/* ------------------------------------------------------------------ Packing */
export const PACKING_INTRO = {
  title: "Pack for the altitude, not just the distance",
  body: [
    "A Himalayan ride can take you from warm afternoons to freezing winds, dusty roads, river crossings, and nights in remote villages.",
    "You don't need to carry your entire life on the bike, but you do need to be prepared for the things you can't buy or find easily along the way.",
  ],
  rule: "Pack light enough to ride comfortably, but never compromise on safety to save space.",
};
export const PACKING = [
  { id: "gear", title: "Riding gear", items: ["Full-face helmet", "Riding jacket with protective armour", "Riding trousers with protection", "Riding gloves for cold and wet conditions", "Protective riding boots", "Thermal base layers", "Insulating mid-layer", "Waterproof outer layer", "Warm socks", "Neck warmer or balaclava", "Sunglasses and UV-protective eyewear", "Spare gloves or glove liners"] },
  { id: "bike", title: "Motorcycle essentials", items: ["Valid driving licence and vehicle documents", "Vehicle insurance and registration documents", "Puncture repair kit", "Portable tyre inflator", "Correctly sized spare tubes, if your tyres use tubes", "Basic tool kit for your motorcycle", "Spare fuses", "Chain lubricant and cleaning supplies, if applicable", "Spare clutch or brake lever, if suitable for your motorcycle", "Tow strap", "Headlamp and small torch", "Bungee cords or luggage straps", "Manufacturer-recommended spares", "Roadside assistance and insurance contacts"] },
  { id: "nav", title: "Navigation and communication", items: ["Offline maps downloaded", "Route and overnight stops saved", "Phone charger", "Power bank", "Spare charging cables", "Emergency contact card", "Paper backup of the route", "Satellite communicator or beacon, where appropriate and legal"] },
  { id: "med", title: "Medical and personal essentials", items: ["Personal first-aid kit", "Personal prescription medicines", "Sunscreen", "Lip balm", "Hand sanitiser", "Personal hygiene supplies", "Reusable water bottles", "Water treatment suited to your use", "Basic food and energy snacks", "Any medically recommended altitude supplies"] },
  { id: "clothes", title: "Clothing and luggage", items: ["Warm sleeping layers", "Lightweight casual clothes", "Quick-drying innerwear", "Spare footwear", "Laundry bag", "Dry bags or waterproof luggage covers", "Small towel", "Earplugs and eye mask", "Reusable bags for waste"] },
  { id: "docs", title: "Documents and money", items: ["Driving licence", "Vehicle registration", "Insurance", "Identity documents", "Required permits and confirmations", "Accommodation bookings", "Emergency cash in small denominations", "Bank cards", "Emergency contact information"] },
  { id: "pass", title: "Before every major pass", items: ["Check the latest road and weather conditions", "Confirm fuel range and the next known fuel stop", "Check tyre pressure and visible tyre damage", "Check brakes, lights, chain and luggage", "Carry water and food for an unexpected delay", "Check daylight and expected arrival time", "Tell someone your route and expected arrival", "Turn back if conditions are unsafe"] },
];

/* ------------------------------------------------------------------ Commute */
export const COMMUTE = {
  title: "Getting to the mountains",
  body: [
    "Before the first pass comes the first logistical decision: how are you getting yourself and your motorcycle to the starting point?",
    "You can ride from home, transport your motorcycle, or rent a motorcycle closer to the mountains. Each option changes the cost, preparation time, and amount of riding you'll do before reaching the main circuit.",
  ],
  rule: "Plan your transport around the circuit, not the other way around.",
  starts: [
    { place: "Chandigarh", best: "Spiti via Shimla and Kinnaur; onward Himachal travel", plan: "Train or flight connections, motorcycle transport, road departure" },
    { place: "Shimla", best: "Spiti via Kinnaur", plan: "Local accommodation, fuel, road conditions" },
    { place: "Manali", best: "Lahaul and seasonal Spiti approaches", plan: "Vehicle preparation and seasonal access" },
    { place: "Srinagar", best: "Riders approaching Ladakh from the west", plan: "Current road access, overnight stops, fuel and accommodation" },
    { place: "Leh", best: "Nubra and Changthang circuits", plan: "Acclimatisation, supplies, permits, motorcycle preparation" },
    { place: "Kargil", best: "Zanskar approach", plan: "Fuel, supplies, road status, onward overnight stops" },
  ],
  bike: [
    { title: "Ride from home", points: ["Suits riders who want a continuous journey.", "Needs more time, fuel, servicing and accommodation."] },
    { title: "Transport the motorcycle", points: ["Research available rail and road transport.", "Confirm operator rules, packaging, insurance, delivery timelines and collection.", "Transport prices and schedules are not listed until verified."] },
    { title: "Rent locally", points: ["Compare providers, models, deposits, insurance, equipment and breakdown support.", "Confirm the agreement permits your route and any restricted-area destinations.", "Check the motorcycle's condition before accepting it."] },
  ],
  checklist: ["Accommodation on arrival", "Motorcycle service", "Fuel and supplies", "Acclimatisation", "Permits and local access requirements", "Weather and road checks", "Return transport and a buffer day"],
  factors: ["Surface quality", "Elevation gain and loss", "High-altitude passes", "Water crossings and roadworks", "Stops for food and photographs", "Weather exposure", "Fuel availability", "Your experience and acclimatisation"],
};

/* ------------------------------------------------------------------ Circuits */
export interface CircuitPage {
  id: CircuitId; idea: string; base: string; window: string; sequence: string;
  days: { day: string; plan: string; objective: string }[];
  highlights: string[]; caution: string; stops: string[];
}
export const CIRCUITS: CircuitPage[] = [
  { id: "zanskar", idea: "Follow the Suru Valley towards one of the more remote inhabited regions of the western Himalayas.", base: "Kargil / Padum", window: "5–7 days",
    sequence: "Kargil → Sankoo → Panikhar → Parkachik → Rangdum → Pensi La → Padum → Zangla → return via the confirmed road route",
    stops: ["kargil", "sankoo", "panikhar", "parkachik", "rangdum", "pensi-la", "padum", "zangla"],
    days: [
      { day: "1", plan: "Arrive in Kargil", objective: "Check the motorcycle, arrange supplies, and confirm the road situation" },
      { day: "2", plan: "Kargil → Suru Valley → Panikhar area", objective: "Ride into the valley and explore the landscape" },
      { day: "3", plan: "Panikhar → Rangdum", objective: "Allow time for rough sections, photographs and road conditions" },
      { day: "4", plan: "Rangdum → Pensi La → Padum", objective: "Cross the pass when open and safe; arrive with daylight remaining" },
      { day: "5", plan: "Explore Padum and nearby settlements", objective: "Local culture, monastery visits and village exploration" },
      { day: "6", plan: "Zangla and nearby areas", objective: "Explore locally, subject to access and road conditions" },
      { day: "7", plan: "Begin return, or continue on a separately verified onward route", objective: "Don't assume the circuit connects directly to the next region" },
    ],
    highlights: ["The route's remoteness", "The importance of fuel planning", "Overnight stops and meal arrangements", "The condition of the Pensi La section", "Avoid riding late into the evening"],
    caution: "This itinerary does not establish that every route connection is open. Confirm access and the return route before departure." },
  { id: "nubra", idea: "Cross a major high-altitude pass and explore a valley of villages, dunes, and distinctive local culture.", base: "Leh", window: "3–5 days",
    sequence: "Leh → Khardung La → Khalsar → Diskit → Hunder → Turtuk → back towards Diskit → Sumur / Panamik → Leh",
    stops: ["leh", "khardung-la", "khalsar", "diskit", "hunder", "turtuk", "sumur", "panamik"],
    days: [
      { day: "1", plan: "Leh", objective: "Acclimatise, service the motorcycle, and prepare supplies" },
      { day: "2", plan: "Leh → Khardung La → Diskit", objective: "Ride into Nubra and explore Diskit" },
      { day: "3", plan: "Diskit → Hunder", objective: "Visit the dunes and surrounding villages" },
      { day: "4", plan: "Hunder / Diskit → Turtuk", objective: "Explore the village and local culture" },
      { day: "5", plan: "Back towards Diskit, then Sumur / Panamik", objective: "Choose the upper-valley branch according to available time" },
      { day: "6", plan: "Explore locally or return to Leh", objective: "Don't rush the return over the pass" },
    ],
    highlights: ["Khardung La road conditions", "The Turtuk branch and the upper Nubra branch are separate", "Accommodation in confirmed settlements", "Village etiquette and local customs", "Access rules near border areas"],
    caution: "A six-day template with flexibility built in, not a promise of six riding days under every condition." },
  { id: "changthang", idea: "The most demanding of the four circuits, built around high-altitude travel, lakes, and remote settlements.", base: "Leh", window: "5–7 days",
    sequence: "Leh → Karu → Tangtse → Pangong Tso → Chushul, if permitted → Nyoma → Hanle → Umling La, if accessible → return by a separately verified route",
    stops: ["leh", "karu", "sakti", "chang-la", "tangtse", "pangong-tso", "chushul", "nyoma", "hanle", "umling-la", "tso-moriri", "karzok", "tso-kar"],
    days: [
      { day: "1", plan: "Leh", objective: "Acclimatise and check permits, fuel, weather and vehicle condition" },
      { day: "2", plan: "Leh → Tangtse / Pangong region", objective: "Take the established route only if currently accessible" },
      { day: "3", plan: "Explore the Pangong region", objective: "Village visits and landscape exploration" },
      { day: "4", plan: "Travel towards Nyoma", objective: "Confirm the road and overnight stop before departure" },
      { day: "5", plan: "Nyoma → Hanle", objective: "Reach Hanle with daylight and a confirmed place to stay" },
      { day: "6", plan: "Local exploration, or a separately verified Umling La attempt", objective: "Proceed only if access, conditions and rider readiness allow" },
      { day: "7", plan: "Begin return on the confirmed route", objective: "Keep time for delays and changing conditions" },
    ],
    highlights: ["Tso Moriri and Tso Kar are additional branches, not part of every loop", "Fuel range and confirmed resupply points", "Daylight and weather set the daily stages"],
    caution: "Umling La is not a normal sightseeing stop. Check current access and permits, road status and weather, your acclimatisation, fuel range and resupply, a conservative turnaround plan, and the nearest verified medical help. High altitude can cause serious illness even in experienced riders." },
  { id: "spiti", idea: "A longer circuit through Kinnaur and Spiti, with a choice of approach and a seasonal connection through Kunzum Pass.", base: "Shimla / Kaza", window: "7–10 days",
    sequence: "Shimla → Narkanda → Sarahan → Sangla → Chitkul → Kalpa → Reckong Peo → Nako → Tabo → Dhankar → Kaza → Kibber → Chicham → Langza → Hikkim → Komic → Pin Valley / Mudh → Losar → Kunzum Pass → Batal / Chandra Taal → Manali",
    stops: ["shimla", "narkanda", "sarahan", "sangla", "chitkul", "kalpa", "reckong-peo", "nako", "tabo", "dhankar", "kaza", "kibber", "chicham", "langza", "hikkim", "komik", "mudh", "losar", "kunzum-la", "batal", "chandratal", "manali"],
    days: [
      { day: "1", plan: "Shimla → Narkanda / Sarahan", objective: "Begin the Kinnaur approach" },
      { day: "2", plan: "Continue towards Sangla", objective: "Explore the Baspa Valley" },
      { day: "3", plan: "Sangla → Chitkul → Kalpa", objective: "Visit the valley and continue to Kalpa" },
      { day: "4", plan: "Kalpa → Nako → Tabo", objective: "Allow time for the long mountain-road day" },
      { day: "5", plan: "Tabo → Dhankar → Kaza", objective: "Explore the monastery and arrive in Kaza" },
      { day: "6", plan: "Kaza → Kibber → Chicham", objective: "Explore nearby villages" },
      { day: "7", plan: "Langza → Hikkim → Komic", objective: "Visit the high villages" },
      { day: "8", plan: "Pin Valley / Mudh", objective: "Explore the valley and return to your overnight base" },
      { day: "9", plan: "Kaza → Losar, if road conditions permit", objective: "Prepare for the Kunzum section" },
      { day: "10", plan: "Kunzum Pass → Batal / Chandra Taal / Manali", objective: "Continue only on confirmed, accessible roads" },
    ],
    highlights: ["The Kinnaur approach and the seasonal Lahaul connection", "Kaza as a base for nearby villages", "Check whether Kunzum Pass is open", "Accommodation and food in smaller settlements", "Respectful visits to monasteries and communities"],
    caution: "A ten-day template. Add time for slower riding, extra exploration, or a return to Shimla instead of exiting via Manali." },
];
export const EXPEDITION_PAGE = {
  title: "5,200 km. 20+ high-altitude passes. Four circuits. One expedition.",
  body: "Project Altitude is the full-scale version of the journey: an expedition across Himachal and Ladakh, connecting the Zanskar, Nubra, Changthang, and Spiti circuits into one larger riding experience. The four circuits can be explored individually, but together they form the bigger challenge.",
  /** connections between circuits that depend on a season or on restricted access */
  conditional: [
    { circuits: ["spiti"] as CircuitId[], note: "Kunzum Pass is seasonal: the Spiti–Lahaul connection is only open part of the year." },
    { circuits: ["zanskar"] as CircuitId[], note: "Pensi La and Shinku La are seasonal high passes; confirm both before linking Zanskar to Lahaul or the Suru Valley." },
    { circuits: ["changthang"] as CircuitId[], note: "Chushul, Hanle, Umling La and Demchok are permit and border areas; access can change." },
    { circuits: ["nubra"] as CircuitId[], note: "Turtuk and the upper Nubra branch are permit areas; Siachen Base Camp is restricted." },
  ],
};

/* ------------------------------------------------------------------ Gems */
export const GEMS = {
  title: "The places between the destinations",
  body: [
    "Not every memorable moment on a Himalayan ride happens at a famous pass or a well-known lake.",
    "Sometimes it's a small village you hadn't planned to visit, a road that opens up into an incredible landscape, a conversation over tea, or a viewpoint you stumble upon just before sunset.",
    "Gems is a collection of places and experiences worth making time for. Some are easy detours. Others need a little more planning.",
  ],
  rule: "Some of the best discoveries happen when you leave a little room in the itinerary.",
  categories: ["Hidden viewpoints", "Village life", "Monasteries and heritage", "Lakes and landscapes", "Short walks", "Photography spots", "Stargazing", "Food discoveries", "Quiet detours", "Rider stories"],
  list: [
    { circuit: "zanskar" as CircuitId, place: "zangla", title: "Zangla's historic settlement", category: "Monasteries and heritage" },
    { circuit: "zanskar" as CircuitId, place: "rangdum", title: "The landscapes around Rangdum", category: "Lakes and landscapes" },
    { circuit: "zanskar" as CircuitId, place: "parkachik", title: "Nun–Kun views from public viewpoints", category: "Hidden viewpoints" },
    { circuit: "zanskar" as CircuitId, place: "padum", title: "Village experiences around Padum", category: "Village life" },
    { circuit: "nubra" as CircuitId, place: "turtuk", title: "Village walks around Turtuk", category: "Village life" },
    { circuit: "nubra" as CircuitId, place: "hunder", title: "Dunes and landscapes near Hunder", category: "Lakes and landscapes" },
    { circuit: "nubra" as CircuitId, place: "diskit", title: "Monasteries and villages around Diskit", category: "Monasteries and heritage" },
    { circuit: "nubra" as CircuitId, place: "sumur", title: "Upper Nubra around Sumur and Panamik", category: "Quiet detours" },
    { circuit: "changthang" as CircuitId, place: "hanle", title: "Stargazing around Hanle", category: "Stargazing" },
    { circuit: "changthang" as CircuitId, place: "tso-kar", title: "The landscapes around Tso Kar", category: "Lakes and landscapes" },
    { circuit: "changthang" as CircuitId, place: "tso-moriri", title: "Public viewpoints around Tso Moriri", category: "Hidden viewpoints" },
    { circuit: "changthang" as CircuitId, place: "spangmik", title: "Village life around Pangong", category: "Village life" },
    { circuit: "spiti" as CircuitId, place: "langza", title: "Village walks in Langza, Hikkim and Komic", category: "Short walks" },
    { circuit: "spiti" as CircuitId, place: "dhankar", title: "The architecture and setting of Dhankar", category: "Monasteries and heritage" },
    { circuit: "spiti" as CircuitId, place: "mudh", title: "Pin Valley and its villages", category: "Quiet detours" },
    { circuit: "spiti" as CircuitId, place: "chicham", title: "Views around Chicham Bridge", category: "Photography spots" },
    { circuit: "spiti" as CircuitId, place: "nako", title: "The landscape around Nako Lake", category: "Lakes and landscapes" },
  ],
  note: "These are starting candidates to research, not claims that every location is hidden or uncrowded. Coordinates for sensitive wildlife locations, restricted military areas and fragile places are not published.",
};

/* ------------------------------------------------------------------ Swags */
export const SWAGS = {
  title: "Take a little altitude with you",
  body: ["Some journeys stay with you long after the bike is back in the garage.", "Swags is a small collection inspired by Project Altitude: the passes, the roads, the distance, and the feeling of being somewhere far away from everything familiar."],
  rule: "Nothing too loud. Just a reminder of the mountains.",
  items: [
    { name: "Project Altitude T-shirt", body: "Minimal logo on the front, four circuit lines on the back." },
    { name: "20+ Passes patch", body: "Embroidered patch inspired by mountain-pass markers." },
    { name: "Four Circuits poster", body: "A visual map of Zanskar, Nubra, Changthang and Spiti." },
    { name: "Umling La edition", body: "A design celebrating the summit ride." },
    { name: "Route stickers", body: "One for each circuit." },
    { name: "Rider's field notebook", body: "For kilometres, fuel stops, weather and memorable moments." },
    { name: "Route logbook", body: "A small printed travel journal for motorcycle expeditions." },
  ],
};

/* ------------------------------------------------------------------ Meet the creator */
export const CREATOR = {
  title: "Meet the creator",
  body: [
    "Hey, I'm Gaurav.",
    "I'm a product designer, a motorcycling enthusiast, and someone who has always been drawn to the mountains.",
    "Project Altitude grew out of a 5,200 km riding expedition across Himachal and Ladakh, with more than 20 high-altitude passes, four circuits, and a ride to the summit of Umling La.",
    "Along the way, I realised how much planning goes into a journey like this, and how scattered the useful information can be.",
    "So I started putting together a map and a field guide that I would have wanted before setting off. Somewhere to explore the routes, understand the stops, discover places along the way, and prepare for the practical realities of riding in the mountains.",
    "The idea is to keep building it, learning from other riders, and making it more useful with every iteration.",
    "If you've ridden these roads, found something worth adding, or spotted something that needs correcting, I'd love to hear from you.",
  ],
  signoff: "Until then, ride safe. I'll see you somewhere up the road.",
};

/* ------------------------------------------------------------------ Terms */
export const TERMS = {
  title: "Terms, conditions and a few important things",
  lead: "Project Altitude is an independent travel-planning and information project created to help people explore motorcycle routes across Himachal and Ladakh. By using this website, you acknowledge the following.",
  sections: [
    { h: "1. Travel information", p: ["Route descriptions, distances, elevation figures, village details, accommodation listings, and other information are provided for general planning purposes.", "Although reasonable care is taken to maintain the guide, information may be incomplete, inaccurate, or outdated. We do not guarantee that every road, pass, attraction, business, or service listed here will be accessible or available when you travel."] },
    { h: "2. Road conditions and access", p: ["Mountain roads are affected by weather, landslides, snowfall, construction, flooding, and other conditions.", "A route displayed on the map does not mean that it is currently open, safe, or legally accessible.", "You are responsible for checking official advisories, local instructions, permits, and current road conditions before departure."] },
    { h: "3. Personal responsibility", p: ["Motorcycling in mountainous and high-altitude environments carries inherent risks.", "You are responsible for assessing your fitness, riding experience, motorcycle condition, equipment, and ability to undertake your planned journey.", "Project Altitude does not replace professional medical advice, qualified mechanical assistance, official travel guidance, or local emergency services."] },
    { h: "4. Third-party services", p: ["Food, accommodation, rental, repair, and other service listings may be operated by third parties.", "Project Altitude does not guarantee their availability, quality, prices, safety, or performance. Confirm arrangements directly with the relevant provider."] },
    { h: "5. User contributions", p: ["If you submit a route correction, review, photograph, or recommendation, you must have the right to share that material.", "Contributions may be reviewed, edited for clarity, or removed when inaccurate, unsafe, unlawful, or inappropriate. Do not share another person's private information without permission."] },
    { h: "6. Responsible travel", p: ["Respect local communities, cultural and religious sites, wildlife, and the natural environment.", "Follow access restrictions, avoid littering, and do not enter restricted areas or unsafe terrain for photographs or other personal objectives."] },
    { h: "7. Map data and attribution", p: ["The website uses third-party geographic datasets, mapping services, and terrain data. Those resources remain subject to their respective licences, attribution requirements, and terms (see Credits)."] },
    { h: "8. Changes to this guide", p: ["Project Altitude may update, correct, or remove content as new information becomes available. We encourage travellers to report inaccuracies so the guide can improve."] },
    { h: "9. Contact", p: ["For corrections, questions, or contributions, please use the contact option provided on the website."] },
  ],
  signoff: "The mountains are bigger than any itinerary. Use this guide to prepare, not as a reason to ignore changing conditions.",
};
