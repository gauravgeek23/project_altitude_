import type { CircuitId, ContactRecord } from "./types";

/* ------------------------------------------------------------------ expedition facts (creator-supplied) */
export const EXPEDITION = { km: "5,200 km", passes: "20+", circuits: "4", summit: "Umling La" };

/* ------------------------------------------------------------------ A note */
export const NOTE = {
  title: "A note from the road",
  kicker: "20+ passes · 4 circuits · 5,200 km",
  salute: "Dear rider,",
  body: [
    "In the summer of 2026 I rode about 5,200 km through Zanskar, Nubra, Changthang and Spiti: seven weeks from India Gate in Delhi to the top of Umling La and back down to Delhi by night. A week in Manali and the Hamta Pass trek first, then the bike. Rain in Lahaul, snow on Khardung La, dust in Spiti, and twenty-odd passes in between.",
    "This guide is everything I wished I had before I left: the four circuits as I actually rode them, the villages, passes and lakes along them, where I slept and ate, what the roads were like, and the small places that made the trip. A kitchen three hundred metres past a footbridge. A hot spring in the middle of a cold desert. A cabin by Tso Moriri with a family of three.",
    "Nothing here is a live report. Roads close, bridges shut, seasons turn, and a village that had a room in August may not in October. Treat these pages as a friend's notes: check the current state of every pass before you set out, carry your permits, and ask the people who live along these roads. They know more than any map.",
  ],
  signoff: "Ride prepared. Stay curious. Leave the mountains better than you found them.",
  signature: "Gaurav",
};

/* ------------------------------------------------------------------ Story */
export const STORY = {
  title: "The story behind Project Altitude",
  lead: "5,200 km across Himachal and Ladakh. More than 20 high-altitude mountain passes. Four circuits through Zanskar, Nubra, Changthang, and Spiti. And a ride to the summit of Umling La.",
  body: [
    "It started in Bangalore with a packed bag: home for a while, then Delhi, where the bike got a service and a wash. The ride itself began at India Gate.",
    "A week in Manali first, and the Hamta Pass trek: six days with a crew that made it fun, heavy rain all the way to the summit. Then Chandratal, and after that I was on my own.",
    "The first circuit went over Shinku La into Zanskar: a night under Gonbo Rangjon with a couple of houses for company, Phuktal in its cliff, Padum, then Pensi La and the Drang-Drung glacier down the Suru Valley to Kargil. Three days there, with a ride out to Hunderman where Gilgit-Baltistan is in view; then Lamayuru's moonland and the small villages along the Indus into Leh. From Leh, the new Zanskar highway up to Zangla and back.",
    "Khardung La was under snow, my first snowfall. Four days on foot in Turtuk, where no vehicle crosses the bridge, with Thang and the peaks across the border twenty kilometres on. Diskit and its monastery, the long empty road to Siachen Base Camp, the hot spring at Panamik on the way back, and Wari La home to Leh.",
    "The third circuit was the one I had come for. Chang La, a night in Maan village on Pangong, Hanle and its sky. Then the summit day: seventy-five kilometres without a road up the Nurbula route, Umling La, and instead of turning back, down the new road to Demchok and the border, and along the Indus to Nyoma on a hundred kilometres of straight, empty highway. That road was the highlight of the whole ride. Two days in a cabin at Karzok, by Tso Moriri, with a family of three. Then Taglang La, the Gata Loops, Suraj Tal and the Atal Tunnel to Manali.",
    "The last circuit turned south: Jibhi to dry out, Jalori Pass, four days at Kalpa under Kinnaur Kailash, then Nako, Gue and its mummy, Tabo, and Kaza. A letter posted from Hikkim, Langza, Komic, Key. The Chandratal road was under construction, so back the way I had come to Chitkul, the last village on this side; then Narkanda, Shimla and Mashobra, the four-lane cruise to Chandigarh, and Delhi by ten at night.",
    "Around 5,200 km and four valleys. This guide is what I brought back: a map you can explore, the routes as I rode them, the places worth stopping at, and what I wish I had known before heading out.",
  ],
  signoff: "20+ passes. 4 circuits. 5,200 km. One obsession with altitude.",
};

/* ------------------------------------------------------------------ How to use */
export const HOW_TO = {
  title: "Ride it in three moves",
  lead: "This is a field guide, not a brochure. Pick a circuit, follow its stops, gear up and go. Everything else on the site hangs off those three.",
  moves: [
    { n: "01", title: "Pick a circuit", photo: "shinku-la", tab: "circuits", body: "Four loops, each ridden end to end: Zanskar, Nubra, Changthang, Spiti. Open one for the route as it was ridden, the day plan and what to watch for. Hover it and it lights up on the map." },
    { n: "02", title: "Follow the stops", photo: "turtuk", tab: "villages", body: "Every village, pass and lake on the circuit has a card: a photo, the terrain height, fuel and the practical facts we have, and a Show on map button. The hidden gems are the places that made the ride." },
    { n: "03", title: "Gear up and go", photo: "creator", tab: "gear", body: "What to pack, how to get yourself and the bike to the mountains, where to sleep and eat, what to do when it goes wrong. Read Emergency before you need it." },
  ],
  card: "Every place card looks like this one. The dots are the circuits it sits on, the icon is what kind of place it is, the thumbnail opens the photo, and the header opens the card. Try it.",
  tip: "Nothing on this site is live. Road status, permits, fuel and rooms change by the week: confirm them before you leave, and ask locally as you go.",
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
  project: "Route curation, interface, writing, photography, and product direction: Project Altitude. All photographs are from the ride.",
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
  { id: "zanskar", idea: "Ride from Manali over Shinku La into Zanskar, out through the Suru Valley to Kargil, and on to Leh; then the new Zanskar highway from Leh to Zangla and back.", base: "Manali / Leh", window: "7–9 days, as ridden",
    sequence: "Manali → Darcha → Shinku La → Gonbo Rangjon → Phuktal → Padum → Pensi La → Rangdum → Suru Valley → Kargil (and Hunderman) → Mulbekh → Fotu La → Lamayuru → Likir, Basgo → Leh; then Leh → Zangla → Leh on the new highway via Nimmu and Chilling",
    stops: ["manali", "darcha", "shinku-la", "gombo-ranjan", "phuktal", "padum", "pensi-la", "rangdum", "kargil", "hunderman", "lamayuru", "leh", "zangla"],
    days: [
      { day: "1", plan: "Manali → Darcha → Shinku La → Gonbo Rangjon", objective: "Cross the pass with daylight in hand; stay below Gonbo Rangjon, a couple of houses and the mountain" },
      { day: "2", plan: "Gonbo Rangjon → Phuktal Monastery → Padum", objective: "The monastery in the cliff on the way in; arrive in Padum with time to spare" },
      { day: "3", plan: "Padum and the monasteries around it", objective: "Karsha, Stongdey, Sani, Bardan; supplies and fuel for the Suru Valley" },
      { day: "4", plan: "Padum → Pensi La → Rangdum → Suru Valley → Kargil", objective: "Drang-Drung glacier from the pass, Nun Kun along the valley; a long day, start early" },
      { day: "5–6", plan: "Kargil, with a ride out to Hunderman", objective: "The last village, Gilgit-Baltistan in view; the Aryan and Suru valleys; rest the bike" },
      { day: "7", plan: "Kargil → Mulbekh → Fotu La → Lamayuru", objective: "The highest point of the Srinagar–Leh road, then the moonland; stay the night" },
      { day: "8", plan: "Lamayuru → Likir, Basgo → Leh", objective: "Monasteries and the old capitals on the way; the first circuit ends in Leh" },
      { day: "+1", plan: "Leh → Zangla → Leh on the new Zanskar highway", objective: "A one-way taste of the new road to Zangla Palace and back, without repeating Padum" },
    ],
    highlights: ["Shinku La and the descent to Gonbo Rangjon", "Phuktal Monastery before Padum", "Drang-Drung glacier from Pensi La", "Hunderman, the last village", "Lamayuru's moonland", "The new Zanskar highway to Zangla"],
    caution: "Shinku La and Pensi La are seasonal; confirm both are open before you set out. The itinerary follows the ride as it happened, not a guarantee that every road is open today." },
  { id: "nubra", idea: "Over Khardung La into Nubra: four days on foot in Turtuk on the Pakistan border, Diskit and its monastery, a day's run to Siachen Base Camp and the hot spring at Panamik, and back to Leh over Wari La.", base: "Leh", window: "7–8 days, as ridden",
    sequence: "Leh → Khardung La → Diskit (passing through) → Turtuk, with Thang 20 km on → Diskit → day ride to Siachen Base Camp and the Panamik hot spring → Diskit → Wari La → Hemis → Leh",
    stops: ["leh", "khardung-la", "diskit", "turtuk", "thang", "panamik", "siachen-bc", "wari-la", "hemis"],
    days: [
      { day: "1", plan: "Leh → Khardung La → Diskit → Turtuk", objective: "The pass can be full of snow; ride on past Diskit and reach Turtuk with daylight" },
      { day: "2–5", plan: "Turtuk, on foot", objective: "Park before the footbridge: no vehicle enters the village. The Balti Kitchen, the Balti Museum, the old houses, and Thang, the border village, 20 km on" },
      { day: "6", plan: "Turtuk → Diskit", objective: "The monastery and the great statue; an off-season stay with meals cooked to order" },
      { day: "7", plan: "Diskit → Siachen Base Camp → Panamik hot spring → Diskit", objective: "About 120 km each way, 3–4 hours out through empty country; the hot spring on the way back. Start early: a late start meant riding back after dark in rain" },
      { day: "8", plan: "Diskit → Wari La → Hemis → Leh", objective: "Wari La instead of Khardung La again (the Shyok bridge towards Pangong was closed); Hemis, then home to Leh" },
    ],
    highlights: ["Snow on Khardung La", "Turtuk: a village reached on foot, four days without the bike", "Thang and the peaks across the border", "The Balti Kitchen", "The hot spring at Panamik", "The empty road to Siachen Base Camp", "Wari La back to Hemis"],
    caution: "As ridden in early August, off season. Turtuk is a border area and Thang is the last village: carry your permit and papers. The Shyok road to Pangong was closed at the bridge; check before counting on it. The Siachen Base Camp road is long and empty: start early and carry fuel." },
  { id: "changthang", idea: "The one the ride was for: over Chang La to Pangong and Hanle, the summit day up the Nurbula route to Umling La, down the new road to Demchok and along the Indus to Nyoma, two days at Tso Moriri, and the long road south to Manali.", base: "Leh / Manali", window: "6–7 days, as ridden",
    sequence: "Leh → Chemrey → Chang La → Pangong Tso (night in Maan) → Hanle → Nurbula top → Umling La → Demchok → Nyoma → Mahe Bridge → Kyagar Tso → Karzok, Tso Moriri → Tso Kar → Taglang La → Gata Loops → Nakee La → Baralacha La, Suraj Tal → Jispa → Sissu → Atal Tunnel → Manali",
    stops: ["leh", "chemrey", "chang-la", "pangong-tso", "maan", "hanle", "nurbula", "umling-la", "demchok", "nyoma", "kyagar-tso", "karzok", "tso-moriri", "tso-kar", "taglang-la", "suraj-tal", "jispa", "sissu", "atal-tunnel", "manali"],
    days: [
      { day: "1", plan: "Leh → Chemrey → Chang La → Pangong Tso → Maan", objective: "Chemrey instead of Hemis again; the top of Chang La; a night in Maan village by the lake" },
      { day: "2", plan: "Maan → along Pangong → Chushul → Hanle", objective: "One of the most beautiful roads of the ride; the observatory and a night under Hanle's sky" },
      { day: "3", plan: "Hanle → Nurbula top → Umling La → Demchok → Nyoma → Mahe Bridge → Karzok", objective: "The summit day: 75 km without a road up to about 5,200 m at Nurbula top, 50–60 km more to Umling La; down the new road to Demchok and the border; the 100 km Indus road to Nyoma; fuel; then on to Karzok while the light lasts" },
      { day: "4", plan: "Karzok and Tso Moriri", objective: "A day by the lake; Kyagar Tso a few kilometres back up the road" },
      { day: "5–6", plan: "Karzok → Tso Kar → Taglang La and back → Pang → Gata Loops → Nakee La → Baralacha La, Suraj Tal → Jispa → Sissu → Atal Tunnel → Manali", objective: "The high passes of the Manali–Leh road in one long run south, with a night on the way; the circuit ends in Manali" },
    ],
    highlights: ["Chang La top", "A night in Maan village", "Pangong to Hanle", "The Nurbula top route: 75 km off-road", "Umling La, the summit", "Demchok and the border camp", "Demchok to Nyoma along the Indus: the highlight of the whole ride", "Kyagar Tso's three pyramids", "The cabin in Karzok", "Gata Loops and Suraj Tal"],
    caution: "As ridden in mid August. Nurbula is 75 km without a road; carry fuel, water and warm layers, and don't attempt it unacclimatised. Umling La is high: don't linger. Mig La was closed and army-restricted when ridden. The Demchok–Nyoma road was not on Google Maps yet (Mappls had it); fuel at Nyoma. Permits for the whole circuit." },
  { id: "spiti", idea: "South from Manali through Jibhi and over Jalori Pass to Kinnaur, up the Sutlej and the Spiti to Kaza, and back down through Chitkul, Narkanda and Shimla to Chandigarh and Delhi.", base: "Manali / Chandigarh", window: "10–11 days, as ridden",
    sequence: "Manali → Jibhi → Jalori Pass → the Sutlej road → Kalpa → Nako → Gue → Tabo → Kaza (Hikkim, Langza, Komic, Key) → back down the valley → Chitkul → Narkanda → Shimla and Mashobra → Chandigarh → Delhi",
    stops: ["manali", "jibhi", "jalori-pass", "kalpa", "kinnaur-kailash", "nako", "gue", "tabo", "kaza", "hikkim", "langza", "komik", "ki-monastery", "chitkul", "narkanda", "shimla", "chandigarh"],
    days: [
      { day: "1", plan: "Manali → the Delhi highway → the inner road → Jibhi", objective: "A short day into the Tirthan side; rain can catch you in the last ten minutes" },
      { day: "2", plan: "Jibhi", objective: "Dry out, wash everything, eat well; the fruit drinks" },
      { day: "3", plan: "Jibhi → Jalori Pass → down to the Sutlej → Kalpa", objective: "Over the pass through the forest, down to the Shimla highway and up the Sutlej to Kinnaur" },
      { day: "4–6", plan: "Kalpa", objective: "A village you can walk in half an hour, and four days of it under Kinnaur Kailash; a night at Zostel for the view" },
      { day: "7", plan: "Kalpa → Nako → Gue → Tabo → Kaza", objective: "Nako's lake; Gue is 10 km off the road on a rough track, worth the 25 minutes for the mummy; Tabo's mud monastery; Kaza by evening" },
      { day: "8", plan: "Kaza: Hikkim, Langza, Komic, Key and back", objective: "Post a letter from the highest post office, the Buddha at Langza, India's highest village, Key; expect dust, wind and cold sun together" },
      { day: "9", plan: "Kaza → back down the valley → Chitkul", objective: "The Kunzum–Chandratal road to the tunnel was under construction, so back the way you came, skipping the villages already seen; the last village on this side" },
      { day: "10", plan: "Chitkul → Narkanda", objective: "A night in the orchards; one more day would not be wasted" },
      { day: "11", plan: "Narkanda → Shimla and Mashobra → Chandigarh → Delhi", objective: "The four-lane cruise to Chandigarh; an evening run to Delhi and the end of the ride" },
    ],
    highlights: ["Drying out in Jibhi", "Jalori Pass through the forest", "Four days at Kalpa under Kinnaur Kailash", "Gue and its mummy", "Tabo's mud monastery", "A letter from Hikkim", "Langza, Komic, Key", "Chitkul, the last village", "Narkanda", "Mashobra and the four-lane to Chandigarh"],
    caution: "As ridden in late August. The Kaza–Kunzum–Chandratal road to the Atal Tunnel was under construction and skipped; ask before counting on it. Gue is a rough 10 km detour. Hikkim's post is a gamble: a share of letters never arrive. The Kaza day loop can be dust and wind in cold sun; cover up." },
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
/** One hidden gem: a place, a restaurant, a stay, a route, an experience… `category` is free text and becomes a filter;
 *  `place` links the nearest guide entry; `summary` is the card's text (without it the card says "To research");
 *  `id` keys a photo in the photo selection (defaults to the title's slug). */
export interface Gem { id?: string; title: string; category: string; circuit: CircuitId; place?: string; summary?: string }
export const GEMS = {
  title: "The places between the destinations",
  body: [
    "Not every memorable moment on a Himalayan ride happens at a famous pass or a well-known lake.",
    "Sometimes it's a small village you hadn't planned to visit, a road that opens up into an incredible landscape, a conversation over tea, or a viewpoint you stumble upon just before sunset.",
    "Gems is a collection of places and experiences worth making time for. Some are easy detours. Others need a little more planning.",
  ],
  rule: "Some of the best discoveries happen when you leave a little room in the itinerary.",
  categories: ["Hidden viewpoints", "Village life", "Monasteries and heritage", "Lakes and landscapes", "Short walks", "Photography spots", "Stargazing", "Food discoveries", "Quiet detours", "Rider stories"],
  list: <Gem[]>[
    { circuit: "zanskar" as CircuitId, place: "zangla", title: "Zangla's historic settlement", category: "Monasteries and heritage" },
    { circuit: "zanskar" as CircuitId, place: "rangdum", title: "The landscapes around Rangdum", category: "Lakes and landscapes" },
    { circuit: "zanskar" as CircuitId, place: "parkachik", title: "Nun–Kun views from public viewpoints", category: "Hidden viewpoints" },
    { circuit: "zanskar" as CircuitId, place: "padum", title: "Village experiences around Padum", category: "Village life" },
    { circuit: "nubra" as CircuitId, place: "turtuk", id: "turtuk", title: "Turtuk, on foot", category: "Village life", summary: "No road into the village: park before the footbridge and walk in. Four days here without the bike, and the most peaceful place on the whole ride." },
    { circuit: "nubra" as CircuitId, place: "turtuk", title: "The Balti Kitchen, Turtuk", category: "Restaurant", summary: "A ten-year-old kitchen 200–300 m into the village from the footbridge. Balti food, and the walk in is part of it." },
    { circuit: "nubra" as CircuitId, place: "turtuk", title: "The Balti Museum and the old Balti houses", category: "Heritage", summary: "Protected old houses, built under the earth against the winters, and a museum of how people lived; Balti culture kept well." },
    { circuit: "nubra" as CircuitId, place: "thang", id: "thang", title: "Thang, the last village", category: "Border", summary: "About 20 km beyond Turtuk, the international border village. The peaks across the line are Pakistan's, and the posts are in the mountains: you can't see them, they can see you." },
    { circuit: "nubra" as CircuitId, place: "khardung-la", id: "khardung-la", title: "Snow on Khardung La", category: "Experience", summary: "The pass was full of snow on the way into Nubra: the first snowfall of the ride." },
    { circuit: "nubra" as CircuitId, place: "diskit", id: "diskit", title: "Diskit Monastery and the great statue", category: "Monasteries and heritage", summary: "A really beautiful monastery above the valley, and the big statue beside it." },
    { circuit: "nubra" as CircuitId, place: "diskit", title: "Hotel Karakoram, Diskit", category: "Stay", summary: "Off season, a room with dinner and breakfast for about ₹1,500, a full-course meal cooked to order, veg or non-veg, and a beautiful garden." },
    { circuit: "nubra" as CircuitId, place: "turtuk", title: "Maha Guest House, Turtuk", category: "Stay", summary: "The stay in Turtuk. Don't stay near the road: walk up the stream and into the village." },
    { circuit: "nubra" as CircuitId, place: "turtuk", title: "The rooftop at Duktuk Hotel", category: "Hidden viewpoints", summary: "Go up for sunset; the rooftop is worth the visit on its own." },
    { circuit: "nubra" as CircuitId, place: "turtuk", title: "The upper village, above the stream", category: "Village life", summary: "Cross the Razabe Turtuk bridge, then keep walking up the stream: the upper village is the beautiful part." },
    { circuit: "nubra" as CircuitId, place: "siachen-bc", id: "siachen-bc", title: "The empty road to Siachen Base Camp", category: "Best route", summary: "About 120 km one way from Diskit, three to four hours, barely a soul off season; the stillness is the point. Start early." },
    { circuit: "nubra" as CircuitId, place: "panamik", id: "panamik", title: "The hot spring at Panamik", category: "Experience", summary: "Crazy hot water in the middle of an icy desert, about 50 km from Diskit; built and kept by the locals for ₹50. There are hidden hot streams off the route too, but alone and off season the built one was the sensible choice. A half-hour soak before the ride back." },
    { circuit: "nubra" as CircuitId, place: "hunder", id: "hunder", title: "Dunes and landscapes near Hunder", category: "Lakes and landscapes" },
    { circuit: "zanskar" as CircuitId, place: "leh", id: "leh", title: "Rainbow Hostel, Leh", category: "Stay", summary: "Of several stays tried over five days in Leh, the one that was really amazing." },
    { circuit: "zanskar" as CircuitId, place: "leh", title: "Leh Palace", category: "Heritage", summary: "Really great; the walk up from the old town." },
    { circuit: "zanskar" as CircuitId, place: "lamayuru", id: "lamayuru", title: "Lamayuru Monastery and the art installations", category: "Monasteries and heritage", summary: "A really great monastery. The Sa Biennale was on at the time, with artists' installations around the village." },
    { circuit: "zanskar" as CircuitId, place: "mulbekh", id: "mulbekh", title: "Mulbekh", category: "Quiet detours", summary: "One of the small villages between Lamayuru and Leh: sweet hidden gems, all of them." },
    { circuit: "zanskar" as CircuitId, place: "likir", id: "likir", title: "Likir", category: "Quiet detours", summary: "A few kilometres off the road into Leh; the monastery on its hill." },
    { circuit: "zanskar" as CircuitId, place: "basgo", id: "basgo", title: "Basgo", category: "Quiet detours", summary: "The old capital's ruins above the road, between Likir and Nimmu." },
    { circuit: "zanskar" as CircuitId, place: "alchi", title: "Alchi", category: "Quiet detours", summary: "A short way off the road; the old murals of the Choskor." },
    { circuit: "changthang" as CircuitId, place: "chemrey", id: "chemrey", title: "Chemrey Monastery", category: "Monasteries and heritage", summary: "On the way out of Leh towards Chang La, instead of Hemis a second time." },
    { circuit: "changthang" as CircuitId, place: "chang-la", id: "chang-la", title: "Chang La top", category: "Experience", summary: "Two years after a first visit in summer, the same top: a marker of how much had changed in between, and around whom." },
    { circuit: "changthang" as CircuitId, place: "maan", id: "maan", title: "A night in Maan village, Pangong", category: "Stay", summary: "Said to be one of the most beautiful villages. A little snow outside, Pangong at the door, and the ride along the lake." },
    { circuit: "changthang" as CircuitId, place: "hanle", id: "hanle", title: "The road from Pangong to Hanle", category: "Best route", summary: "One of the most beautiful roads of the ride, along the far end of the lake and over the plateau." },
    { circuit: "changthang" as CircuitId, place: "hanle", title: "Hanle's observatory", category: "Stargazing", summary: "The astronomical site above the village; an overnight stop under the dark sky." },
    { circuit: "changthang" as CircuitId, place: "nurbula", id: "nurbula", title: "The Nurbula top route", category: "Best off-road route", summary: "75 km without a road, climbing from Hanle to about 5,200 m at the top, then 50–60 km more to Umling La." },
    { circuit: "changthang" as CircuitId, place: "umling-la", id: "umling-la", title: "Umling La, the summit day", category: "Experience", summary: "The highest motorable road in the world. Every metre up, the thought that only a few thousand people on the planet are higher right now, and it isn't summit season. Mig La next door was closed and army-restricted when ridden; said to open to the public around 2028." },
    { circuit: "changthang" as CircuitId, place: "demchok", id: "demchok", title: "Demchok and the border camp", category: "Border", summary: "Down the new road from Umling La instead of back to Hanle. The Chinese village is about 100 m away; you can watch their officials move between the bunkers." },
    { circuit: "changthang" as CircuitId, place: "nyoma", id: "nyoma", title: "Demchok to Nyoma: the highlight of the whole ride", category: "Best route", summary: "A new highway along the Indus, about 100 km with hardly a turn: China's mountains on the right, India's on the left, rivers kilometres wide and nobody at all. From base to summit you finally see the scale of the mountains. If you ask which was the most beautiful place to ride, this." },
    { circuit: "changthang" as CircuitId, place: "nyoma", title: "Fuel at Nyoma", category: "Rider tip", summary: "The pump at Nyoma, with the tank near empty after Demchok; the people there knew which roads were good." },
    { circuit: "changthang" as CircuitId, place: "leh", title: "A local SIM, and Mappls", category: "Rider tip", summary: "Airtel worked almost everywhere; buy a local SIM in Leh (or in Padum if you come in from Himachal). Mappls had the new roads that Google Maps did not." },
    { circuit: "changthang" as CircuitId, place: "kyagar-tso", id: "kyagar-tso", title: "Kyagar Tso and the three pyramids", category: "Lakes and landscapes", summary: "Off the Mahe Bridge cut on the way to Karzok. With the snow just right, three peaks across the water stand like three pyramids. Not a soul by the lake." },
    { circuit: "changthang" as CircuitId, place: "karzok", id: "karzok", title: "A cabin in Karzok", category: "Stay", summary: "The most beautiful stay of the whole ride (Turtuk second, Kalpa third): a small cabin with an uncle, an aunt and their grandson, two days of eating and sleeping with them, Tso Moriri and the snow outside, Mentok Kangri above. The hotels are expensive and there are only 10–15 homestays." },
    { circuit: "changthang" as CircuitId, place: "taglang-la", id: "taglang-la", title: "Taglang La, up and back", category: "Experience", summary: "A run up to the pass from the Tso Kar side and back the same way, before the long road south." },
    { circuit: "changthang" as CircuitId, place: "nakee-la", title: "The Gata Loops", category: "Best route", summary: "The stack of hairpins up from the Sarchu plain towards Nakee La. Phenomenal." },
    { circuit: "changthang" as CircuitId, place: "suraj-tal", id: "suraj-tal", title: "Suraj Tal", category: "Lakes and landscapes", summary: "Just below Baralacha La on the way down to Jispa. Incredible." },
    { circuit: "changthang" as CircuitId, place: "jispa", id: "jispa", title: "Jispa and Sissu", category: "Quiet detours", summary: "Great villages on the way down the Bhaga and the Chandra to the tunnel." },
    { circuit: "spiti" as CircuitId, place: "jibhi", id: "jibhi", title: "Two days in Jibhi", category: "Stay", summary: "Rain in the last ten minutes of the ride in, so an extra day: everything washed and dried, good food, and the local fruit drinks, passion fruit among them." },
    { circuit: "spiti" as CircuitId, place: "kalpa", id: "kalpa", title: "The B&B in Kalpa", category: "Stay", summary: "The third-best stay of the ride: a small B&B with the owner away and a key locker for the door. A village you can walk in half an hour, and four days of it under Kinnaur Kailash." },
    { circuit: "spiti" as CircuitId, place: "kalpa", title: "Zostel Kalpa", category: "Stay", summary: "One of the best views in Kalpa. If you go, stay a week." },
    { circuit: "spiti" as CircuitId, place: "kinnaur-kailash", id: "kinnaur-kailash", title: "Kinnaur Kailash from Kalpa", category: "Hidden viewpoints", summary: "The mountain fills the view from the village; four days of it was not too many." },
    { circuit: "spiti" as CircuitId, place: "nako-lake", id: "nako", title: "Nako and its lake", category: "Lakes and landscapes", summary: "The small lake at the heart of the village, a short walk from the road." },
    { circuit: "spiti" as CircuitId, place: "gue", id: "gue", title: "Gue Monastery and the mummy", category: "Heritage", summary: "About 10 km off the Kaza road on a rough, on-and-off track, 20–25 minutes each way; the old mummy is worth it. Your phone may pick up China's time here." },
    { circuit: "spiti" as CircuitId, place: "tabo", id: "tabo", title: "Tabo Monastery", category: "Monasteries and heritage", summary: "Unlike any other monastery on the ride: a different architecture, different deities, and every building covered in mud, brown against the valley." },
    { circuit: "spiti" as CircuitId, place: "hikkim", id: "hikkim", title: "A letter from Hikkim", category: "Experience", summary: "The highest post office in the world. Post a letter home and be ready for it not to arrive: a fair share never do. Mine didn't." },
    { circuit: "spiti" as CircuitId, place: "langza", id: "langza", title: "The Buddha at Langza", category: "Photography spots", summary: "The iconic statue above the village, with the valley behind." },
    { circuit: "spiti" as CircuitId, place: "komik", id: "komik", title: "Komic, India's highest village", category: "Village life", summary: "The top of the Kaza day loop." },
    { circuit: "spiti" as CircuitId, place: "ki-monastery", id: "ki-monastery", title: "Key Monastery", category: "Monasteries and heritage", summary: "The monastery on its hill above the Spiti, on the way back to Kaza." },
    { circuit: "spiti" as CircuitId, place: "kaza", id: "kaza", title: "The Kaza day loop", category: "Best route", summary: "Hikkim, Langza, Komic and Key in a day from Kaza. A fun ride in foul weather: dust, wind and sun at once, in the cold." },
    { circuit: "spiti" as CircuitId, place: "chandratal", title: "The Chandratal road, skipped", category: "Rider tip", summary: "The Kaza–Kunzum–Chandratal road to the Atal Tunnel was the only bad patch left in Spiti, under construction and said to be ready around 2028. Chandratal itself had already been seen after the Hamta trek, so the ride went back the way it came." },
    { circuit: "spiti" as CircuitId, place: "chitkul", id: "chitkul", title: "Chitkul, the last village", category: "Village life", summary: "The last village of India on the Himachal side. A day or so; really peaceful, really beautiful." },
    { circuit: "spiti" as CircuitId, place: "narkanda", id: "narkanda", title: "A night in Narkanda", category: "Stay", summary: "Not top three, but for sure top five. One day was not enough: stay two." },
    { circuit: "spiti" as CircuitId, place: "shimla", id: "shimla", title: "Mashobra", category: "Quiet detours", summary: "A village just outside Shimla, close to the heart." },
    { circuit: "spiti" as CircuitId, place: "chandigarh", id: "chandigarh", title: "The four-lane to Chandigarh", category: "Best route", summary: "From Shimla the four-lane highway starts, and it is a joy to cruise on a bike." },
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
