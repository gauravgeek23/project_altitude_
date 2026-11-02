import type { CircuitId, PlaceRecord, PlaceType, Practical } from "./types";
import { CHECKED_ON, FACTS } from "./facts";
export type { CircuitId } from "./types";

export const CIRCUIT_META: Record<CircuitId, { name: string; short: string; color: string; character: string }> = {
  zanskar: { name: "Zanskar", short: "Zanskar", color: "#1f3fe0", character: "Deep valleys, remote settlements, mountain passes, and the journey towards Padum." },
  nubra: { name: "Nubra", short: "Nubra", color: "#9b2fd1", character: "High passes, broad valleys, villages, dunes, and the upper Shyok and Nubra landscapes." },
  changthang: { name: "Changthang", short: "Changthang", color: "#e3241b", character: "High-altitude lakes, wide open plains, remote settlements, wildlife, and long distances between services." },
  spiti: { name: "Spiti", short: "Spiti", color: "#1e9a4b", character: "Cold-desert landscapes, monasteries, high villages, mountain roads, and the long approach through Kinnaur or Lahaul." },
};
export const CIRCUIT_ORDER: CircuitId[] = ["zanskar", "nubra", "changthang", "spiti"];

const NONE: Practical = { fuel: null, food: null, stay: null, network: null, medical: null, bestTime: null, riderNotes: null };
const PERMIT = "Permit area. Inner Line Permit rules apply to many places in this region; verify the current requirement for your nationality and this destination.";

/** compact constructor: everything not given stays unknown */
function P(id: string, name: string, type: PlaceType, circuits: CircuitId[], region: string, summary: string, why: string,
  o: { aka?: string; notes?: string; access?: string; map?: string | null; near?: string[] } = {}): PlaceRecord {
  return {
    id, name, aka: o.aka, type, circuits, region, summary, why,
    practical: { ...NONE, riderNotes: o.notes ?? null },
    access: o.access ?? null, elevation_m: null,
    mapId: o.map === undefined ? id : o.map, neighbours: o.near ?? [],
    status: "editorial", sources: [], last_verified: null,
  };
}

export const PLACES: PlaceRecord[] = [
  // ------------------------------------------------------------ Zanskar
  P("kargil", "Kargil", "town", ["zanskar"], "Suru valley", "Regional staging point at the meeting of the Suru and Drass rivers, and the start of the road to Zanskar.",
    "Supplies, accommodation and onward routes; the last large town before the Suru Valley.", { notes: "Confirm the road situation towards Padum here before setting off.", near: ["sankoo", "lamayuru"] }),
  P("sankoo", "Sankoo", "village", ["zanskar"], "Suru valley", "Gateway towards the Suru Valley and its surrounding settlements.",
    "The first green stretch of the Suru Valley after Kargil.", { near: ["kargil", "panikhar"], map: null }),
  P("panikhar", "Panikhar", "village", ["zanskar"], "Suru valley", "A village in the upper Suru Valley with wide mountain views.",
    "A useful route-planning stop before the long, remote stretch to Rangdum.", { near: ["sankoo", "parkachik"], map: null }),
  P("parkachik", "Parkachik", "village", ["zanskar"], "Suru valley", "A small settlement facing the Nun–Kun massif.",
    "Some of the best roadside views of the Nun–Kun peaks and glaciers.", { near: ["panikhar", "rangdum"], map: null }),
  P("rangdum", "Rangdum", "village", ["zanskar"], "Suru valley", "A remote stop on the Suru Valley route below Pensi La, known for its monastery on a hillock in the valley.",
    "Open, high landscape and the last settlement before the pass.", { near: ["parkachik", "pensi-la"], map: null }),
  P("satso-lake", "Satso Lake", "lake", ["zanskar"], "Suru valley", "A stop marked on the Project Altitude circuit map in the Suru Valley.",
    "Part of the route as ridden; details to be documented.", { near: ["kargil", "pensi-la"] }),
  P("padum", "Padum", "town", ["zanskar"], "Zanskar", "The main settlement of Zanskar and the practical base for exploring the valley and its monasteries.",
    "Zanskar is remote even by Ladakh standards; Padum is where you plan the next days.", { notes: "An important place to plan supplies and accommodation, but confirm current availability before departure.", near: ["pensi-la", "zangla", "shinku-la"] }),
  P("zangla", "Zangla", "village", ["zanskar"], "Zanskar", "A historic settlement with the ruins of an old royal palace and fort.",
    "An easy side trip from Padum into Zanskar's history.", { near: ["padum"] }),
  P("gombo-ranjan", "Gombo Ranjan", "landmark", ["zanskar"], "Zanskar–Lahaul", "A striking, sacred rock peak beside the road between Padum and Shinku La.",
    "One of the most dramatic mountains you can see from the saddle.", { notes: "The road here is new and can be soft in places.", near: ["padum", "shinku-la"] }),
  P("lamayuru", "Lamayuru", "village", ["zanskar"], "Srinagar–Leh road", "One of Ladakh's oldest monasteries, above eroded 'moonland' formations.",
    "The moonland view at dusk is unlike anything else on the road.", { near: ["kargil", "leh"] }),
  P("darcha", "Darcha", "village", ["zanskar", "changthang"], "Lahaul", "The village on the Bhaga river where the Shinku La road leaves the Manali–Leh highway.",
    "A checkpoint and crossroads for the Leh and Zanskar roads.", { notes: "Keep documents handy for the check post.", near: ["shinku-la", "baralacha-la", "atal-tunnel"] }),

  // ------------------------------------------------------------ Nubra
  P("leh", "Leh", "town", ["nubra", "changthang", "zanskar"], "Indus valley", "The old capital of the Ladakh kingdom and the main staging point for Nubra and Changthang.",
    "Acclimatise here, check the motorcycle, and gather supplies before going higher.", { notes: "The Ladakh Tourism advisory recommends at least 48 hours of acclimatisation in Leh before higher destinations.", near: ["khardung-la", "karu", "hemis"] }),
  P("khalsar", "Khalsar", "village", ["nubra"], "Shyok valley", "A village on the Shyok below Khardung La where the roads to Diskit and to the upper Nubra branch apart.",
    "The first settlement after the descent from the pass.", { near: ["khardung-la", "diskit"], map: null }),
  P("diskit", "Diskit", "town", ["nubra"], "Nubra valley", "The main settlement of Nubra, under Diskit Monastery and its large Maitreya Buddha.",
    "A practical base for the valley, with the Hunder dunes a short ride away.", { near: ["khalsar", "hunder"] }),
  P("hunder", "Hunder", "village", ["nubra"], "Nubra valley", "A village of sand dunes, orchards and village stays near Diskit.",
    "The dunes and their double-humped camels at golden hour.", { near: ["diskit", "turtuk"], map: null }),
  P("turtuk", "Turtuk", "village", ["nubra"], "Shyok valley, Baltistan", "A Balti village of apricot orchards and stone houses, opened to travellers in 2010.",
    "Balti culture, village walks and local food, unlike anywhere else on the circuit.", { access: PERMIT, notes: "Ask before photographing people.", near: ["hunder", "bogdang"] }),
  P("bogdang", "Bogdang", "village", ["nubra"], "Shyok valley", "A Balti village on the road to Turtuk.",
    "Village life and regional cultural context on the way down the Shyok.", { access: PERMIT, near: ["turtuk"], map: null }),
  P("thang", "Thang", "village", ["nubra"], "Shyok valley", "A remote border-area settlement beyond Turtuk.",
    "The end of the road down the Shyok.", { access: "Border area. Access rules must be verified before planning a visit.", near: ["turtuk"], map: null }),
  P("sumur", "Sumur", "village", ["nubra"], "Nubra valley", "A village in the upper Nubra Valley near Samstanling Monastery.",
    "Monasteries, village stays and quieter exploration.", { near: ["panamik"], map: null }),
  P("panamik", "Panamik", "village", ["nubra"], "Upper Nubra", "A village known for its hot springs and access towards the upper valley.",
    "A quiet detour with a soak after the passes.", { near: ["sumur", "siachen-bc"] }),
  P("siachen-bc", "Siachen Base Camp", "landmark", ["nubra"], "Upper Nubra", "The military base camp at the head of the Nubra Valley.",
    "Shown because it is on the circuit map, not as a tourist destination.", { access: "Restricted military area. Not an ordinary tourist destination; do not plan a visit without official permission.", near: ["panamik"] }),

  // ------------------------------------------------------------ Changthang
  P("karu", "Karu", "village", ["changthang"], "Indus valley", "An important junction east of Leh where the Pangong road leaves the Indus valley.",
    "A resupply-planning point before Chang La.", { near: ["leh", "sakti"], map: null }),
  P("hemis", "Hemis", "village", ["changthang", "nubra"], "Indus valley", "Home of Hemis Monastery and gateway to Hemis National Park.",
    "One of the great monasteries of Ladakh, a short detour from the highway.", { near: ["karu", "leh"] }),
  P("sakti", "Sakti", "village", ["changthang"], "Chang La route", "A village on the climb towards Chang La.",
    "A last village stop before the pass.", { near: ["karu", "chang-la"], map: null }),
  P("tangtse", "Tangtse", "village", ["changthang"], "Changthang", "An important settlement below Chang La on the way to Pangong.",
    "A potential overnight stop that breaks the climb to the lake.", { access: PERMIT, near: ["chang-la", "lukung"], map: null }),
  P("durbuk", "Durbuk", "village", ["changthang"], "Changthang", "A village below Chang La where the road divides for Pangong and the Shyok.",
    "A natural break after the pass.", { access: PERMIT, near: ["chang-la", "tangtse"] }),
  P("lukung", "Lukung", "village", ["changthang"], "Pangong", "The gateway settlement at the western end of Pangong Tso.",
    "Your first sight of the lake.", { access: PERMIT, near: ["tangtse", "spangmik"], map: null }),
  P("spangmik", "Spangmik", "village", ["changthang"], "Pangong", "A village on the shore of Pangong Tso.",
    "Lakeside stays and the lake at sunrise.", { access: PERMIT, near: ["lukung", "maan"], map: null }),
  P("pangong-tso", "Pangong Tso", "lake", ["changthang"], "Changthang", "A long, high, brackish lake whose colour shifts through the day; much of it lies across the border.",
    "Sunrise and sunset on the shore.", { access: PERMIT, notes: "Nights are cold even in summer.", near: ["spangmik", "maan"] }),
  P("maan", "Man", "village", ["changthang"], "Pangong", "A settlement on Pangong's southern shore, beyond Spangmik.", "Quieter than the busier lakeside stops.",
    { aka: "Maan", access: PERMIT, near: ["spangmik", "merak"] }),
  P("merak", "Merak", "village", ["changthang"], "Pangong", "A remote lakeside village further along Pangong.",
    "Space and silence on the lake.", { access: "Remote border-area village. Verify accommodation and access before planning.", near: ["maan", "chushul"], map: null }),
  P("chushul", "Chushul", "village", ["changthang"], "Changthang", "An important remote settlement south of Pangong.",
    "A link between the Pangong region and the Indus.", { access: "Border area. Confirm the access restrictions that apply before travelling.", near: ["merak", "nyoma"], map: null }),
  P("nyoma", "Nyoma", "village", ["changthang"], "Upper Indus", "A key settlement on the upper Indus between the Tso Moriri road and Hanle.",
    "The place to plan supplies and the onward ride to Hanle.", { access: PERMIT, near: ["hanle", "chushul"] }),
  P("hanle", "Hanle", "village", ["changthang"], "Changthang", "A remote village known for its astronomical observatory and India's first dark sky reserve.",
    "The night sky. Plan around the new moon.", { access: PERMIT, notes: "Reach Hanle with daylight and a confirmed place to stay. Keep lights low after dark.", near: ["nyoma", "umling-la"] }),
  P("demchok", "Demchok", "village", ["changthang"], "Changthang", "A border village at the far south-east of Ladakh.",
    "The end of the road beyond Umling La.", { access: "Border area with strict and changing rules. Verify before planning.", near: ["umling-la"] }),
  P("tso-moriri", "Tso Moriri", "lake", ["changthang"], "Rupshu", "A high-altitude lake in a protected wetland, quieter than Pangong.",
    "Stillness, birds and mirror-flat mornings.", { access: PERMIT, notes: "A protected wetland: follow the local rules.", near: ["karzok"] }),
  P("karzok", "Korzok", "village", ["changthang"], "Tso Moriri", "The settlement and monastery on the shore of Tso Moriri, home to Changpa herders.",
    "A potential overnight stop by the lake.", { aka: "Karzok", access: PERMIT, near: ["tso-moriri", "tso-kar"] }),
  P("tso-kar", "Tso Kar", "lake", ["changthang"], "Rupshu", "A salt lake ringed with white flats on the Rupshu plateau.",
    "A high-altitude lake and wildlife landscape a short detour off the highway.", { notes: "Wind picks up sharply in the afternoon.", near: ["taglang-la", "karzok"] }),

  // ------------------------------------------------------------ Spiti
  P("shimla", "Shimla", "town", ["spiti"], "Shimla hills", "The gateway for the Kinnaur approach to Spiti.", "A good overnight to break the climb from the plains.", { near: ["narkanda"] }),
  P("narkanda", "Narkanda", "town", ["spiti"], "Shimla hills", "A ridge town of orchards and deodar forest on the road to Kinnaur.", "A mountain stop with Hatu Peak above.", { near: ["shimla", "sarahan"] }),
  P("sarahan", "Sarahan", "village", ["spiti"], "Kinnaur gateway", "Home of the Bhimakali temple, in Himachal's wood-and-stone style.", "A cultural stop and possible overnight halt.", { near: ["narkanda", "sangla"] }),
  P("sangla", "Sangla", "village", ["spiti"], "Baspa valley", "The base for exploring the Baspa Valley.", "Orchards, river and the road to Chitkul.", { near: ["sarahan", "rakchham"], map: null }),
  P("rakchham", "Rakchham", "village", ["spiti"], "Baspa valley", "A village of wooden houses in the upper Baspa Valley.", "Village scenery and short walks.", { near: ["sangla", "chitkul"], map: null }),
  P("chitkul", "Chitkul", "village", ["spiti"], "Baspa valley", "The end-of-road village in the Baspa Valley.", "Wooden houses, a temple and the river in a green valley.", { notes: "Subject to current access.", near: ["rakchham"] }),
  P("kalpa", "Kalpa", "village", ["spiti"], "Kinnaur", "Orchards above Reckong Peo facing the Kinnaur Kailash range.", "Sunrise on the peaks and village stays.", { near: ["reckong-peo"] }),
  P("reckong-peo", "Reckong Peo", "town", ["spiti"], "Kinnaur", "The district headquarters of Kinnaur and a major service centre.", "An onward-planning stop before the high desert.", { near: ["kalpa", "nako"], map: null }),
  P("nako", "Nako", "village", ["spiti"], "Kinnaur", "A high stone village around a small lake.", "A gentle halt between Kinnaur's gorges and Spiti.", { near: ["reckong-peo", "tabo"] }),
  P("gue", "Gue", "village", ["spiti"], "Spiti", "A village known for the naturally preserved mummy of a meditating monk.", "A strange, quiet place off the main road.", { near: ["tabo"] }),
  P("tabo", "Tabo", "village", ["spiti"], "Spiti", "A historic monastery founded in 996 CE, with remarkable murals.", "Over a thousand years of continuous practice.", { notes: "Photography is not allowed inside the old halls.", near: ["nako", "dhankar"] }),
  P("dhankar", "Dhankar", "village", ["spiti"], "Spiti", "A monastery and village on a ridge above the Spiti and Pin confluence.", "The setting is as remarkable as the architecture.", { near: ["tabo", "kaza"], map: null }),
  P("kaza", "Kaza", "town", ["spiti"], "Spiti", "The main settlement and practical base for Spiti.", "The base for the high villages around it.", { near: ["dhankar", "kibber", "langza"] }),
  P("kibber", "Kibber", "village", ["spiti"], "Spiti", "A high village above Kaza, a base for wildlife-oriented excursions.", "High-altitude village life.", { near: ["kaza", "chicham"], map: null }),
  P("chicham", "Chicham", "village", ["spiti"], "Spiti", "A village across a high bridge over a deep gorge near Kibber.", "The bridge viewpoint.", { near: ["kibber"], map: null }),
  P("langza", "Langza", "village", ["spiti"], "Spiti", "A high village known for fossils and a large Buddha statue facing the valley.", "Fossils, mountain scenery and village life.", { near: ["kaza", "hikkim"], map: null }),
  P("hikkim", "Hikkim", "village", ["spiti"], "Spiti", "A small village with one of the world's highest post offices.", "Send a postcard from it.", { near: ["langza", "komik"], map: null }),
  P("komik", "Komic", "village", ["spiti"], "Spiti", "A high-altitude village and monastery near Langza and Hikkim.", "The surrounding high landscapes.", { aka: "Komik", near: ["hikkim"] }),
  P("mudh", "Pin Valley / Mudh", "village", ["spiti"], "Pin Valley", "The Pin Valley and its last village, Mudh.", "Valley exploration and village stays.", { near: ["dhankar"], map: null }),
  P("losar", "Losar", "village", ["spiti"], "Spiti", "The last village on the Spiti side before Kunzum Pass.", "An important stop towards the pass.", { near: ["kaza", "kunzum-la"], map: null }),
  P("batal", "Batal", "landmark", ["spiti"], "Lahaul", "A remote road junction and stop on the Kunzum approach, with the turning for Chandra Taal.", "A riders' halt between Kunzum and Lahaul.", { near: ["kunzum-la", "chandratal"], map: null }),
  P("chandratal", "Chandra Taal", "lake", ["spiti"], "Lahaul", "A crescent-shaped high-altitude lake below Kunzum Pass.", "One of the most beautiful lakes in the Himalaya.", { aka: "Chandratal", notes: "Access and camping conditions vary; use designated sites.", near: ["batal"] }),
  P("atal-tunnel", "Atal Tunnel", "landmark", ["spiti", "zanskar", "changthang"], "Manali–Lahaul", "A road tunnel of about 9 km under the Rohtang ridge, opened in 2020.", "It links Manali and Lahaul without crossing Rohtang Pass.", { notes: "Weather can be completely different at the two ends.", near: ["manali", "darcha"] }),
  P("manali", "Manali", "town", ["spiti", "zanskar", "changthang"], "Kullu valley", "A major transport, accommodation, repair and supply centre at the head of the Kullu valley.", "Get the motorcycle serviced before the high roads.", { near: ["atal-tunnel", "mandi"] }),
  P("jibhi", "Jibhi", "village", ["spiti"], "Tirthan valley", "A wooden village in the Tirthan valley below Jalori Pass.", "A green, slow break between the plains and the high desert.", { notes: "Jalori Pass is steep and narrow.", near: ["narkanda"] }),
  P("mandi", "Mandi", "town", ["zanskar"], "Beas valley", "A temple town on the Beas.", "A halt between the plains and the Kullu valley.", { near: ["manali", "chandigarh"] }),
  P("chandigarh", "Chandigarh", "town", ["zanskar", "spiti"], "Plains", "A starting point with rail and air connections for the Himachal approaches.", "Collect the motorcycle and last supplies here.", { near: ["solan", "mandi"] }),
  P("solan", "Solan", "town", ["spiti"], "Shimla hills", "A hill town between Chandigarh and Shimla.", "A quick stop on the way up.", { near: ["chandigarh", "shimla"] }),
];

/** Passes are records too; their official elevations stay null until verified. */
const pass = (id: string, name: string, circuits: CircuitId[], region: string, summary: string, near: string[], o: { aka?: string; access?: string; map?: string | null; notes?: string } = {}) =>
  P(id, name, "pass", circuits, region, summary, "", { ...o, near });

export const PASSES: PlaceRecord[] = [
  pass("khardung-la", "Khardung La", ["nubra"], "Ladakh Range", "The high pass on the route from Leh towards Nubra.", ["leh", "khalsar"], { notes: "Road conditions near the top change through the day; check before crossing." }),
  pass("wari-la", "Wari La", ["nubra"], "Ladakh Range", "A quieter, high pass between the Nubra side and Sakti in the Indus valley.", ["sakti", "diskit"]),
  pass("chang-la", "Chang La", ["changthang"], "Ladakh Range", "The high pass on the Pangong route, between Sakti and Tangtse.", ["sakti", "tangtse"]),
  pass("taglang-la", "Tanglang La", ["changthang"], "Zanskar Range", "The highest pass on the Manali–Leh highway, between the More plains and Upshi.", ["hemis", "tso-kar"], { aka: "Taglang La" }),
  pass("lachalung-la", "Lachulung La", ["changthang"], "Manali–Leh highway", "The second of two passes after the Gata Loops.", ["nakee-la", "tso-kar"], { aka: "Lachalung La" }),
  pass("nakee-la", "Nakee La", ["changthang"], "Manali–Leh highway", "The pass at the top of the Gata Loops above Sarchu.", ["baralacha-la", "lachalung-la"]),
  pass("baralacha-la", "Baralacha La", ["changthang"], "Lahaul", "A broad pass where Lahaul gives way to Ladakh, with Suraj Tal below.", ["darcha", "nakee-la"]),
  pass("photi-la", "Photi La", ["changthang"], "Hanle side", "A remote pass on the high roads around Hanle.", ["hanle", "umling-la"], { access: PERMIT }),
  pass("umling-la", "Umling La", ["changthang"], "Changthang", "A high-altitude riding objective south-east of Hanle, publicised as the world's highest motorable road.", ["hanle", "demchok"],
    { access: "Not a normal sightseeing stop. Verify current access, permits, road status and weather; plan a conservative turnaround and know the nearest medical help." }),
  pass("nurbula", "Nurbula", ["changthang"], "Hanle side", "A pass on the alternative road between Hanle and Demchok, as marked on the circuit map.", ["hanle", "demchok"], { access: PERMIT }),
  pass("fotu-la", "Fotu La", ["zanskar"], "Srinagar–Leh road", "The highest pass on the Srinagar–Leh highway, between Lamayuru and Kargil.", ["lamayuru", "kargil"]),
  pass("pensi-la", "Pensi La", ["zanskar"], "Zanskar", "The high pass connecting the Suru and Zanskar regions, overlooking the Drang-Drung glacier.", ["rangdum", "padum"], { notes: "The descent towards Padum is rough." }),
  pass("shinku-la", "Shinku La", ["zanskar"], "Zanskar–Lahaul", "The pass between Lahaul and Zanskar, crossed by the newer road from Darcha.", ["darcha", "padum"], { aka: "Sinchu La", notes: "Snow can linger into summer." }),
  pass("kunzum-la", "Kunzum Pass", ["spiti"], "Spiti–Lahaul", "The seasonal high-altitude connection between Spiti and Lahaul.", ["losar", "batal"], { aka: "Kunzum La", map: null, notes: "Seasonal: check whether the pass is open before planning the Kaza–Manali connection." }),
];

// merge published-source facts into the records
for (const r of [...PLACES, ...PASSES]) {
  const f = FACTS[r.id];
  if (!f) continue;
  const { sources, ...fields } = f;
  for (const [k, v] of Object.entries(fields)) if (v) (r.practical as unknown as Record<string, string>)[k] = v as string;
  r.sources = sources; r.status = "sourced"; r.last_verified = CHECKED_ON;
}

export const ALL_PLACES = [...PLACES, ...PASSES];
export const BY_ID: Record<string, PlaceRecord> = Object.fromEntries(ALL_PLACES.map((p) => [p.id, p]));

export const TYPE_LABEL: Record<PlaceType, string> = { village: "Village", town: "Town", pass: "Pass", lake: "Lake", landmark: "Landmark" };
export const PRACTICAL_LABEL: Record<keyof Practical, string> = {
  fuel: "Fuel", food: "Food", stay: "Stay", network: "Network", medical: "Medical help", bestTime: "Best time", riderNotes: "Rider notes",
};
