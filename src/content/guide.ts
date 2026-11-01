import type { CircuitId } from "./places";

export interface Dish { name: string; region: string; what: string; where: string }
export const FOOD: Dish[] = [
  { name: "Thukpa", region: "Ladakh & Spiti", what: "A noodle soup with vegetables or meat. The standard warm-up after a cold pass.", where: "Dhabas across every circuit" },
  { name: "Skyu", region: "Ladakh", what: "Hand-pressed wheat dough cooked with vegetables in a thick stew. Home food, rarely on menus.", where: "Ask at homestays in Leh, Nubra and Zanskar" },
  { name: "Chhutagi", region: "Ladakh", what: "Bow-shaped pasta in a broth with vegetables, Ladakh's comfort food.", where: "Homestays and small Ladakhi kitchens in Leh" },
  { name: "Khambir with butter tea", region: "Ladakh", what: "Thick round local bread with salted butter tea (gur gur cha). Strange the first time, perfect at 4,000 m.", where: "Breakfast in homestays" },
  { name: "Momos & tingmo", region: "Ladakh & Spiti", what: "Steamed dumplings and soft steamed bread. Fast, filling and everywhere.", where: "Every town" },
  { name: "Apricots", region: "Turtuk & Kargil", what: "Fresh in late summer, dried the rest of the year. Turtuk's orchards are famous.", where: "Turtuk, Kargil and the Leh bazaar" },
  { name: "Seabuckthorn juice", region: "Ladakh & Spiti", what: "A tart orange berry juice that grows wild in the high valleys.", where: "Leh bazaar, Kaza" },
  { name: "Siddu", region: "Kullu valley", what: "A steamed wheat bun stuffed with walnut or poppy-seed paste, served with ghee.", where: "Manali, Jibhi and the Kullu valley" },
  { name: "Himachali dham", region: "Himachal", what: "A festive set meal of rice, rajma, madra and sweet rice, traditionally served on leaf plates.", where: "Dhabas around Mandi and Kullu, and at festivals" },
  { name: "Kinnauri apples", region: "Kinnaur & Narkanda", what: "Crisp apples from the high orchards, harvested from August to October.", where: "Kalpa, Sangla, Narkanda" },
  { name: "Maggi at the pass", region: "Everywhere", what: "Instant noodles from a tea shack at 5,000 m. Every rider has a story about one.", where: "Pang, Sarchu, Khardung La and Chang La" },
];

export interface StayType { type: string; best: string[]; what: string; tip: string }
export const STAYS: StayType[] = [
  { type: "Homestays", best: ["Turtuk", "Maan", "Hanle", "Karzok", "Komik", "Langza", "Nako"],
    what: "A room in a family house, with dinner and breakfast cooked by the family. The best way to understand a village.",
    tip: "Carry some cash. Many homestays cannot take cards or UPI when the network is down." },
  { type: "Camps", best: ["Sarchu", "Pang", "Hunder", "Pangong", "Chandratal"],
    what: "Tented camps with beds and blankets, usually with a shared dining tent. Basic, warm and social.",
    tip: "Nights in camps on the Manali–Leh highway are the coldest of the trip. Sleep in your thermals." },
  { type: "Guesthouses & hotels", best: ["Leh", "Kargil", "Kaza", "Manali", "Padum", "Diskit"],
    what: "Proper rooms with hot water in the towns, where you rest, wash gear and repair the bike.",
    tip: "Book ahead in Leh and Manali from June to August." },
  { type: "Dhaba stops", best: ["Pang", "Sarchu", "Zingzingbar", "Batal"],
    what: "Roadside shacks with mattresses and food. They exist for when weather or a breakdown stops you.",
    tip: "Batal's dhaba below Kunzum La is a riders' legend. Stop for tea even if you are not staying." },
];

export const EMERGENCY_NUMBERS = [
  { label: "All emergencies", number: "112", note: "National emergency line: police, fire and ambulance." },
  { label: "Ambulance", number: "108", note: "Free ambulance service in most states." },
  { label: "Police", number: "100", note: "Being merged into 112 in many states; still works." },
  { label: "Fire", number: "101", note: "" },
  { label: "Women's helpline", number: "1091", note: "" },
];

export const AMS = {
  signs: ["Headache that does not go with rest and water", "Nausea or loss of appetite", "Dizziness or unusual tiredness", "Trouble sleeping"],
  danger: ["Breathless even at rest", "Confusion, clumsiness or unsteady walking", "A wet cough or gurgling breath"],
  rules: [
    "Spend two full days in Leh or Manali before going higher.",
    "Climb high, sleep low. Do not sleep at Pangong or Sarchu on your first high night if you can avoid it.",
    "Drink 3–4 litres of water a day. Skip alcohol for the first days.",
    "Never go higher with symptoms. If they get worse, go down. Descent is the treatment.",
    "Ask a doctor before the trip about medicines such as acetazolamide.",
  ],
};

export const HOSPITALS = [
  { place: "Leh", name: "Sonam Norboo Memorial (SNM) Hospital", note: "Main hospital in Ladakh." },
  { place: "Kargil", name: "District Hospital Kargil", note: "" },
  { place: "Keylong", name: "Regional Hospital Keylong", note: "Lahaul, on the Manali–Leh road." },
  { place: "Manali", name: "Mission Hospital & Civil Hospital", note: "" },
  { place: "Army camps", name: "Medical posts along the highways", note: "The army has helped many stranded riders. Ask at any camp in an emergency." },
];

export interface PackGroup { id: string; title: string; items: string[] }
export const PACKING: PackGroup[] = [
  { id: "docs", title: "Documents", items: ["Driving licence", "Bike RC, insurance and PUC (originals and copies)", "Inner Line Permit printouts", "Photo ID with several photocopies", "Rental agreement and NOC, if the bike is rented", "Some cash in small notes"] },
  { id: "gear", title: "Riding gear", items: ["Full-face helmet with a clear visor", "Riding jacket and pants with armour", "Waterproof riding gloves and a thin inner pair", "Riding boots, waterproofed", "Rain cover for you and the luggage", "Knee guards"] },
  { id: "layers", title: "Layers", items: ["Thermal base layers (two sets)", "Fleece mid layer", "Down or synthetic insulated jacket", "Woollen socks", "Balaclava or neck warmer", "Sunglasses with UV protection"] },
  { id: "bike", title: "Bike spares & tools", items: ["Puncture kit and a mini pump or inflator", "Spare tubes (front and rear)", "Clutch and accelerator cables", "Chain lube and a spare chain link", "Tool kit for your bike", "Bungee cords and cable ties", "Fuel can, 5–10 litres"] },
  { id: "health", title: "Health", items: ["Personal medicines, plus prescriptions", "Painkillers, ORS and anti-diarrhoea tablets", "Sunscreen SPF 50 and lip balm", "First-aid kit with crepe bandage", "Water bottles, 2–3 litres total"] },
  { id: "tech", title: "Electronics", items: ["Postpaid SIM (prepaid SIMs from other states do not work in Ladakh)", "Power bank", "Offline maps downloaded", "Head torch", "USB charger on the bike"] },
];

export const COMMUTE = {
  getThere: [
    { title: "Fly", body: "Leh has direct flights from Delhi and other cities. For Himachal, Bhuntar (Kullu) and Shimla have small airports, and Chandigarh is a major one." },
    { title: "Train", body: "Chandigarh and Kalka are the nearest major railheads. Kalka is the start of the toy train to Shimla." },
    { title: "Road", body: "Two classic roads reach Leh: Manali–Leh over the Lahaul passes, and Srinagar–Leh through Kargil. Spiti is reached through Kinnaur from Shimla, or over Kunzum La from Manali." },
  ],
  seasons: [
    { road: "Manali–Leh", when: "Usually June to October", note: "Opens when BRO clears Baralacha La and Taglang La." },
    { road: "Srinagar–Leh", when: "Usually April or May to November", note: "Zoji La sets the dates." },
    { road: "Atal Tunnel", when: "Open all year", note: "Can close briefly after heavy snow." },
    { road: "Kunzum La (Manali–Kaza)", when: "Usually June to October", note: "Kinnaur side stays open longer." },
    { road: "Shinku La & Zanskar", when: "Usually July to September", note: "New road; check status in Darcha." },
  ],
  permits: [
    "Indian nationals need an Inner Line Permit for Nubra, Turtuk, Pangong, Tso Moriri, Hanle and other areas near the border. Apply online through the Leh administration's permit portal and carry printouts.",
    "Rohtang Pass needs a separate online permit for vehicles. The Atal Tunnel does not.",
    "Foreign nationals need a Protected Area Permit for many of these areas, arranged through a registered agent.",
  ],
  fuel: [
    "Between Tandi (near Keylong) and Karu (near Leh) there is no regular fuel pump for about 365 km. Carry spare fuel.",
    "Fill up at Kargil before Zanskar, and in Leh before Changthang. Changthang distances are long.",
    "Kaza has fuel in Spiti. The next reliable pumps are in Reckong Peo and Tandi.",
  ],
  network: "Only postpaid SIMs from outside the region work in Ladakh. BSNL, Jio and Airtel have the widest coverage. Expect long dead zones on every circuit.",
};

export interface CircuitGuide { id: CircuitId; days: string; season: string; highlights: string[]; difficulty: string; stops: string[] }
export const CIRCUITS: CircuitGuide[] = [
  { id: "nubra", days: "4–5 days from Leh", season: "June to September",
    stops: ["leh", "khardung-la", "diskit", "turtuk", "panamik", "siachen-bc", "wari-la", "hemis"],
    highlights: ["Khardung La", "Hunder dunes", "Balti culture in Turtuk", "Panamik hot springs"],
    difficulty: "Moderate. Good roads with broken stretches near the passes; the Wari La side is rougher." },
  { id: "changthang", days: "8–10 days, Manali to Leh plus the Changthang loop", season: "July to September",
    stops: ["darcha", "baralacha-la", "nakee-la", "lachalung-la", "taglang-la", "leh", "chang-la", "durbuk", "pangong-tso", "maan", "hanle", "umling-la", "demchok", "nyoma", "tso-kar", "karzok"],
    highlights: ["Gata Loops", "Pangong at dawn", "Hanle's dark sky", "Umling La, the highest motorable road", "Tso Moriri"],
    difficulty: "Hard. Long days above 4,500 m, water crossings and few services in Changthang." },
  { id: "zanskar", days: "7–9 days, Leh to Chandigarh", season: "July to September",
    stops: ["leh", "lamayuru", "fotu-la", "kargil", "satso-lake", "pensi-la", "padum", "zangla", "gombo-ranjan", "shinku-la", "darcha", "atal-tunnel", "manali", "mandi", "chandigarh"],
    highlights: ["Lamayuru moonland", "Drang-Drung glacier from Pensi La", "Padum's monasteries", "Gombo Ranjan"],
    difficulty: "Hard. Rough roads in Zanskar and the new Shinku La road; long gaps between fuel." },
  { id: "spiti", days: "8–10 days, Chandigarh round trip", season: "June to October",
    stops: ["chandigarh", "solan", "shimla", "narkanda", "sarahan", "kalpa", "chitkul", "nako", "tabo", "gue", "kaza", "komik", "chandratal", "atal-tunnel", "jibhi"],
    highlights: ["Kinnaur's cliff roads", "Tabo's thousand-year-old murals", "Komik and Hikkim", "Chandratal", "Jalori Pass"],
    difficulty: "Moderate to hard. Narrow cliff roads in Kinnaur; the Kunzum side is rough with water crossings." },
];

export interface Gem { title: string; place: string; body: string }
export const GEMS: Gem[] = [
  { title: "A postcard from Hikkim", place: "komik", body: "Hikkim, near Komik, has one of the world's highest post offices. Write a postcard to yourself and see when it arrives." },
  { title: "Milky Way over Hanle", place: "hanle", body: "India's first dark sky reserve. Go around the new moon and switch off every light." },
  { title: "The monk of Gue", place: "gue", body: "A naturally preserved mummy of a meditating monk, centuries old, in a small shrine above the village." },
  { title: "Moonland at dusk", place: "lamayuru", body: "The eroded hills below Lamayuru Monastery turn gold, then grey, in the last half-hour of light." },
  { title: "Apricot season in Turtuk", place: "turtuk", body: "Come in late July or August and the village is full of drying apricots on every roof." },
  { title: "Tea at Batal", place: "chandratal", body: "The dhaba at Batal below Kunzum La has fed and sheltered riders for decades." },
  { title: "Black-necked cranes at Tso Kar", place: "tso-kar", body: "A salt lake where rare cranes nest in summer. Keep your distance and stay quiet." },
  { title: "Sunrise on Kinner Kailash", place: "kalpa", body: "From Kalpa, the first light hits the Kinner Kailash peaks across the valley." },
];
