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
    "The first green stretch of the Suru Valley after Kargil.", { near: ["kargil", "panikhar"] }),
  P("panikhar", "Panikhar", "village", ["zanskar"], "Suru valley", "A village in the upper Suru Valley with wide mountain views.",
    "A useful route-planning stop before the long, remote stretch to Rangdum.", { near: ["sankoo", "parkachik"] }),
  P("parkachik", "Parkachik", "village", ["zanskar"], "Suru valley", "A small settlement facing the Nun–Kun massif.",
    "Some of the best roadside views of the Nun–Kun peaks and glaciers.", { near: ["panikhar", "rangdum"] }),
  P("rangdum", "Rangdum", "village", ["zanskar"], "Suru valley", "A remote stop on the Suru Valley route below Pensi La, known for its monastery on a hillock in the valley.",
    "Open, high landscape and the last settlement before the pass.", { near: ["parkachik", "pensi-la"] }),
  P("satso-lake", "Satso Lake", "lake", ["zanskar"], "Suru valley", "A stop marked on the Project Altitude circuit map in the Suru Valley.",
    "Part of the route as ridden; details to be documented.", { near: ["kargil", "pensi-la"] }),
  P("padum", "Padum", "town", ["zanskar"], "Zanskar", "The main settlement of Zanskar and the practical base for exploring the valley and its monasteries.",
    "Zanskar is remote even by Ladakh standards; Padum is where you plan the next days.", { notes: "An important place to plan supplies and accommodation, but confirm current availability before departure.", near: ["pensi-la", "zangla", "shinku-la"] }),
  P("zangla", "Zangla", "village", ["zanskar"], "Zanskar", "A historic settlement with the ruins of an old royal palace and fort.",
    "An easy side trip from Padum into Zanskar's history.", { near: ["padum"] }),
  P("gombo-ranjan", "Gombo Ranjan", "landmark", ["zanskar"], "Zanskar–Lahaul", "A striking, sacred rock peak beside the road between Padum and Shinku La.",
    "One of the most dramatic mountains you can see from the saddle.", { notes: "The road here is new and can be soft in places.", near: ["padum", "shinku-la"] }),
  P("lamayuru", "Lamayuru", "monastery", ["zanskar"], "Srinagar–Leh road", "One of Ladakh's oldest monasteries, above eroded 'moonland' formations.",
    "The moonland view at dusk is unlike anything else on the road.", { near: ["kargil", "leh"] }),
  P("darcha", "Darcha", "village", ["zanskar", "changthang"], "Lahaul", "The village on the Bhaga river where the Shinku La road leaves the Manali–Leh highway.",
    "A checkpoint and crossroads for the Leh and Zanskar roads.", { notes: "Keep documents handy for the check post.", near: ["shinku-la", "baralacha-la", "atal-tunnel"] }),

  // ------------------------------------------------------------ Nubra
  P("leh", "Leh", "town", ["nubra", "changthang", "zanskar"], "Indus valley", "The old capital of the Ladakh kingdom and the main staging point for Nubra and Changthang.",
    "Acclimatise here, check the motorcycle, and gather supplies before going higher.", { notes: "The Ladakh Tourism advisory recommends at least 48 hours of acclimatisation in Leh before higher destinations.", near: ["khardung-la", "karu", "hemis"] }),
  P("khalsar", "Khalsar", "village", ["nubra"], "Shyok valley", "A village on the Shyok below Khardung La where the roads to Diskit and to the upper Nubra branch apart.",
    "The first settlement after the descent from the pass.", { near: ["khardung-la", "diskit"] }),
  P("diskit", "Diskit", "town", ["nubra"], "Nubra valley", "The main settlement of Nubra, under Diskit Monastery and its large Maitreya Buddha.",
    "A practical base for the valley, with the Hunder dunes a short ride away.", { near: ["khalsar", "hunder"] }),
  P("hunder", "Hunder", "village", ["nubra"], "Nubra valley", "A village of sand dunes, orchards and village stays near Diskit.",
    "The dunes and their double-humped camels at golden hour.", { near: ["diskit", "turtuk"] }),
  P("turtuk", "Turtuk", "village", ["nubra"], "Shyok valley, Baltistan", "A Balti village of apricot orchards and stone houses, opened to travellers in 2010.",
    "Balti culture, village walks and local food, unlike anywhere else on the circuit.", { access: PERMIT, notes: "Ask before photographing people.", near: ["hunder", "bogdang"] }),
  P("bogdang", "Bogdang", "village", ["nubra"], "Shyok valley", "A Balti village on the road to Turtuk.",
    "Village life and regional cultural context on the way down the Shyok.", { access: PERMIT, near: ["turtuk"] }),
  P("thang", "Thang", "village", ["nubra"], "Shyok valley", "A remote border-area settlement beyond Turtuk.",
    "The end of the road down the Shyok.", { access: "Border area. Access rules must be verified before planning a visit.", near: ["turtuk"] }),
  P("sumur", "Sumur", "village", ["nubra"], "Nubra valley", "A village in the upper Nubra Valley near Samstanling Monastery.",
    "Monasteries, village stays and quieter exploration.", { near: ["panamik"] }),
  P("panamik", "Panamik", "village", ["nubra"], "Upper Nubra", "A village known for its hot springs and access towards the upper valley.",
    "A quiet detour with a soak after the passes.", { near: ["sumur", "siachen-bc"] }),
  P("siachen-bc", "Siachen Base Camp", "landmark", ["nubra"], "Upper Nubra", "The military base camp at the head of the Nubra Valley.",
    "Shown because it is on the circuit map, not as a tourist destination.", { access: "Restricted military area. Not an ordinary tourist destination; do not plan a visit without official permission.", near: ["panamik"] }),

  // ------------------------------------------------------------ Changthang
  P("karu", "Karu", "village", ["changthang"], "Indus valley", "An important junction east of Leh where the Pangong road leaves the Indus valley.",
    "A resupply-planning point before Chang La.", { near: ["leh", "sakti"] }),
  P("hemis", "Hemis", "monastery", ["changthang", "nubra"], "Indus valley", "Home of Hemis Monastery and gateway to Hemis National Park.",
    "One of the great monasteries of Ladakh, a short detour from the highway.", { near: ["karu", "leh"] }),
  P("sakti", "Sakti", "village", ["changthang"], "Chang La route", "A village on the climb towards Chang La.",
    "A last village stop before the pass.", { near: ["karu", "chang-la"] }),
  P("tangtse", "Tangtse", "village", ["changthang"], "Changthang", "An important settlement below Chang La on the way to Pangong.",
    "A potential overnight stop that breaks the climb to the lake.", { access: PERMIT, near: ["chang-la", "lukung"] }),
  P("durbuk", "Durbuk", "village", ["changthang"], "Changthang", "A village below Chang La where the road divides for Pangong and the Shyok.",
    "A natural break after the pass.", { access: PERMIT, near: ["chang-la", "tangtse"] }),
  P("lukung", "Lukung", "village", ["changthang"], "Pangong", "The gateway settlement at the western end of Pangong Tso.",
    "Your first sight of the lake.", { access: PERMIT, near: ["tangtse", "spangmik"] }),
  P("spangmik", "Spangmik", "village", ["changthang"], "Pangong", "A village on the shore of Pangong Tso.",
    "Lakeside stays and the lake at sunrise.", { access: PERMIT, near: ["lukung", "maan"] }),
  P("pangong-tso", "Pangong Tso", "lake", ["changthang"], "Changthang", "A long, high, brackish lake whose colour shifts through the day; much of it lies across the border.",
    "Sunrise and sunset on the shore.", { access: PERMIT, notes: "Nights are cold even in summer.", near: ["spangmik", "maan"] }),
  P("maan", "Man", "village", ["changthang"], "Pangong", "A settlement on Pangong's southern shore, beyond Spangmik.", "Quieter than the busier lakeside stops.",
    { aka: "Maan", access: PERMIT, near: ["spangmik", "merak"] }),
  P("merak", "Merak", "village", ["changthang"], "Pangong", "A remote lakeside village further along Pangong.",
    "Space and silence on the lake.", { access: "Remote border-area village. Verify accommodation and access before planning.", near: ["maan", "chushul"] }),
  P("chushul", "Chushul", "village", ["changthang"], "Changthang", "An important remote settlement south of Pangong.",
    "A link between the Pangong region and the Indus.", { access: "Border area. Confirm the access restrictions that apply before travelling.", near: ["merak", "nyoma"] }),
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
  P("sangla", "Sangla", "village", ["spiti"], "Baspa valley", "The base for exploring the Baspa Valley.", "Orchards, river and the road to Chitkul.", { near: ["sarahan", "rakchham"] }),
  P("rakchham", "Rakchham", "village", ["spiti"], "Baspa valley", "A village of wooden houses in the upper Baspa Valley.", "Village scenery and short walks.", { near: ["sangla", "chitkul"] }),
  P("chitkul", "Chitkul", "village", ["spiti"], "Baspa valley", "The end-of-road village in the Baspa Valley.", "Wooden houses, a temple and the river in a green valley.", { notes: "Subject to current access.", near: ["rakchham"] }),
  P("kalpa", "Kalpa", "village", ["spiti"], "Kinnaur", "Orchards above Reckong Peo facing the Kinnaur Kailash range.", "Sunrise on the peaks and village stays.", { near: ["reckong-peo"] }),
  P("reckong-peo", "Reckong Peo", "town", ["spiti"], "Kinnaur", "The district headquarters of Kinnaur and a major service centre.", "An onward-planning stop before the high desert.", { near: ["kalpa", "nako"] }),
  P("nako", "Nako", "village", ["spiti"], "Kinnaur", "A high stone village around a small lake.", "A gentle halt between Kinnaur's gorges and Spiti.", { near: ["reckong-peo", "tabo"] }),
  P("gue", "Gue", "village", ["spiti"], "Spiti", "A village known for the naturally preserved mummy of a meditating monk.", "A strange, quiet place off the main road.", { near: ["tabo"] }),
  P("tabo", "Tabo", "village", ["spiti"], "Spiti", "A historic monastery founded in 996 CE, with remarkable murals.", "Over a thousand years of continuous practice.", { notes: "Photography is not allowed inside the old halls.", near: ["nako", "dhankar"] }),
  P("dhankar", "Dhankar", "monastery", ["spiti"], "Spiti", "A monastery and village on a ridge above the Spiti and Pin confluence.", "The setting is as remarkable as the architecture.", { near: ["tabo", "kaza"] }),
  P("kaza", "Kaza", "town", ["spiti"], "Spiti", "The main settlement and practical base for Spiti.", "The base for the high villages around it.", { near: ["dhankar", "kibber", "langza"] }),
  P("kibber", "Kibber", "village", ["spiti"], "Spiti", "A high village above Kaza, a base for wildlife-oriented excursions.", "High-altitude village life.", { near: ["kaza", "chicham"] }),
  P("chicham", "Chicham", "village", ["spiti"], "Spiti", "A village across a high bridge over a deep gorge near Kibber.", "The bridge viewpoint.", { near: ["kibber"] }),
  P("langza", "Langza", "village", ["spiti"], "Spiti", "A high village known for fossils and a large Buddha statue facing the valley.", "Fossils, mountain scenery and village life.", { near: ["kaza", "hikkim"] }),
  P("hikkim", "Hikkim", "village", ["spiti"], "Spiti", "A small village with one of the world's highest post offices.", "Send a postcard from it.", { near: ["langza", "komik"] }),
  P("komik", "Komic", "village", ["spiti"], "Spiti", "A high-altitude village and monastery near Langza and Hikkim.", "The surrounding high landscapes.", { aka: "Komik", near: ["hikkim"] }),
  P("mudh", "Pin Valley / Mudh", "village", ["spiti"], "Pin Valley", "The Pin Valley and its last village, Mudh.", "Valley exploration and village stays.", { near: ["dhankar"] }),
  P("losar", "Losar", "village", ["spiti"], "Spiti", "The last village on the Spiti side before Kunzum Pass.", "An important stop towards the pass.", { near: ["kaza", "kunzum-la"] }),
  P("batal", "Batal", "landmark", ["spiti"], "Lahaul", "A remote road junction and stop on the Kunzum approach, with the turning for Chandra Taal.", "A riders' halt between Kunzum and Lahaul.", { near: ["kunzum-la", "chandratal"] }),
  P("chandratal", "Chandra Taal", "lake", ["spiti"], "Lahaul", "A crescent-shaped high-altitude lake below Kunzum Pass.", "One of the most beautiful lakes in the Himalaya.", { aka: "Chandratal", notes: "Access and camping conditions vary; use designated sites.", near: ["batal"] }),
  P("atal-tunnel", "Atal Tunnel", "landmark", ["spiti", "changthang"], "Manali–Lahaul", "A road tunnel of about 9 km under the Rohtang ridge, opened in 2020.", "It links Manali and Lahaul without crossing Rohtang Pass.", { notes: "Weather can be completely different at the two ends.", near: ["manali", "darcha"] }),
  P("manali", "Manali", "town", ["spiti", "changthang"], "Kullu valley", "A major transport, accommodation, repair and supply centre at the head of the Kullu valley.", "Get the motorcycle serviced before the high roads.", { near: ["atal-tunnel", "jibhi"] }),
  P("jibhi", "Jibhi", "village", ["spiti"], "Tirthan valley", "A wooden village in the Tirthan valley below Jalori Pass.", "A green, slow break between the plains and the high desert.", { notes: "Jalori Pass is steep and narrow.", near: ["narkanda"] }),
  P("chandigarh", "Chandigarh", "town", ["spiti"], "Plains", "A starting point with rail and air connections for the Himachal approaches.", "Collect the motorcycle and last supplies here.", { near: ["solan", "shimla"] }),
  P("solan", "Solan", "town", ["spiti"], "Shimla hills", "A hill town between Chandigarh and Shimla.", "A quick stop on the way up.", { near: ["chandigarh", "shimla"] }),
  // ------------------------------------------------------------ monasteries along the circuits (icon-only on the map)
  P("stakna", "Stakna Monastery", "monastery", ["changthang"], "Indus valley", "A small Drukpa monastery on a rock above the Indus opposite Thiksey, reached by a bridge from the Leh–Upshi road.", "", { near: ["thiksey", "matho"] }),
  P("matho", "Matho Monastery", "monastery", ["changthang"], "Indus valley", "The only Sakya monastery in Ladakh, above Matho village across the Indus from Stakna; known for its festival of oracles.", "", { near: ["stakna", "hemis"] }),
  P("spituk", "Spituk Monastery", "monastery", ["nubra", "changthang", "zanskar"], "Leh", "A Gelugpa monastery on a hill at the end of Leh's runway, with the Indus below.", "", { near: ["leh", "shanti-stupa"] }),
  P("shanti-stupa", "Shanti Stupa", "monastery", ["nubra", "changthang", "zanskar"], "Leh", "The white stupa on the hill above Changspa, with Leh spread out below it.", "", { near: ["leh", "spituk"] }),
  P("phyang", "Phyang Monastery", "monastery", ["zanskar"], "Srinagar–Leh road", "A Drikung Kagyu monastery in Phyang village, 16 km west of Leh.", "", { near: ["leh", "nimmu"] }),
  P("rizong", "Rizong Monastery", "monastery", ["zanskar"], "Srinagar–Leh road", "A Gelugpa monastery at the head of a side valley west of Alchi, known for its strict discipline, with a nunnery below it.", "", { near: ["alchi", "khalsi"] }),
  P("chemrey", "Chemrey Monastery", "monastery", ["changthang"], "Chang La road", "A Drukpa monastery stacked up a hill near Sakti, on the way to Chang La.", "", { near: ["sakti", "takthok"] }),
  P("takthok", "Takthok Monastery", "monastery", ["changthang"], "Chang La road", "A Nyingma monastery built around a cave at Sakti, the only one of its school in Ladakh.", "", { near: ["sakti", "chemrey"] }),
  P("samstanling", "Samstanling Monastery", "monastery", ["nubra"], "Nubra valley", "A Gelugpa monastery above Sumur, looking down the Nubra valley.", "", { near: ["sumur", "panamik"] }),
  P("karsha", "Karsha Monastery", "monastery", ["zanskar"], "Zanskar", "The largest monastery in Zanskar, climbing a hillside across the valley from Padum.", "", { near: ["padum", "stongdey"] }),
  P("stongdey", "Stongdey Monastery", "monastery", ["zanskar"], "Zanskar", "A Gelugpa monastery high above the Zangla road, 18 km from Padum, with wide views over the valley.", "", { near: ["padum", "zangla"] }),
  P("sani", "Sani Monastery", "monastery", ["zanskar"], "Zanskar", "One of the oldest religious sites in Zanskar, on the plain west of Padum beside the Kanika chorten.", "", { near: ["padum", "karsha"] }),
  P("bardan", "Bardan Monastery", "monastery", ["zanskar"], "Lungnak valley", "A Drukpa monastery on a rock above the Lungnak river, 12 km south of Padum on the Shinku La road.", "", { near: ["padum", "phuktal"] }),
  P("thukje", "Thukje Monastery", "monastery", ["changthang"], "Tso Kar", "The small monastery on a hill above Thukje, the village at Tso Kar.", "", { near: ["tso-kar"] }),
  P("kungri", "Kungri Monastery", "monastery", ["spiti"], "Pin valley", "A Nyingma monastery in the Pin valley, the oldest in Spiti after Tabo, known for its sword dance.", "", { near: ["mudh", "kaza"] }),
  P("lhalung", "Lhalung Monastery", "monastery", ["spiti"], "Lingti valley", "An early monastery of the Lingti valley above Dhankar, said to date from the 10th century.", "", { near: ["dhankar", "kaza"] }),
  P("kardang", "Kardang Monastery", "monastery", ["changthang"], "Lahaul", "The largest monastery in Lahaul, across the Bhaga from Keylong.", "", { near: ["keylong"] }),
  // ------------------------------------------------------------ more stops on the circuits
  P("phuktal", "Phuktal Monastery", "monastery", ["zanskar"], "Lungnak valley", "A monastery built into the mouth of a cave high on a cliff above the Tsarap river, reached on foot from the Padum–Shinku La road.", "One of the most remarkable buildings in Zanskar; allow a few hours for the walk.", { aka: "Phugtal", near: ["padum", "gombo-ranjan"] }),
  P("likir", "Likir", "monastery", ["zanskar"], "Srinagar–Leh road", "Likir Monastery, a large Gelugpa gompa on a hill a few kilometres off the Srinagar–Leh road between Khalsi and Nimmu, with a tall gilded Maitreya.", "An easy detour on the way into Leh.", { near: ["alchi", "basgo"] }),
  P("basgo", "Basgo", "landmark", ["zanskar"], "Srinagar–Leh road", "The mud-brick fort and temples of Basgo on crags above the highway, a capital of Ladakh in the 16th century.", "Visible from the road; a short climb to the temples.", { near: ["likir", "nimmu"] }),
  P("hunderman", "Hunderman", "landmark", ["zanskar"], "Kargil", "An abandoned village on the Line of Control 10 km north of Kargil, now kept as a museum of memories.", "A quiet half-day from Kargil.", { near: ["kargil"], notes: "Close to the Line of Control: check the current rules before visiting." }),
  P("chilling", "Chilling", "village", ["zanskar"], "Zanskar gorge", "A village in the Zanskar gorge on the new road between Nimmu and Padum.", "", { near: ["nimmu", "zangla"] }),
  P("nimmu", "Nimmu", "village", ["zanskar"], "Indus valley", "Where the Zanskar meets the Indus; the new Zanskar highway to Padum leaves the Srinagar–Leh road here.", "", { near: ["leh", "chilling"] }),
  P("thiksey", "Thiksey", "monastery", ["nubra", "changthang"], "Indus valley", "A village below Thiksey Monastery, on the road east of Leh.", "", { near: ["shey", "karu"] }),
  P("shey", "Shey", "village", ["nubra", "changthang"], "Indus valley", "The old summer capital of Ladakh, with Shey Palace above the Indus.", "", { near: ["leh", "thiksey"] }),
  P("alchi", "Alchi", "monastery", ["zanskar"], "Srinagar–Leh road", "A village a short way off the Srinagar–Leh road, known for the 11th-century murals of the Alchi Choskor.", "", { near: ["khalsi", "leh"] }),
  P("khalsi", "Khalsi", "village", ["zanskar"], "Srinagar–Leh road", "A village where the Srinagar–Leh road meets the Indus below Lamayuru.", "", { near: ["lamayuru", "alchi"] }),
  P("mulbekh", "Mulbekh", "village", ["zanskar"], "Srinagar–Leh road", "A village known for its rock-carved Maitreya, on the road between Kargil and Namika La.", "", { near: ["kargil", "namika-la"] }),
  P("upshi", "Upshi", "village", ["changthang"], "Indus valley", "Where the Manali–Leh road meets the Indus.", "", { near: ["karu", "rumtse"] }),
  P("rumtse", "Rumtse", "village", ["changthang"], "Manali–Leh road", "The first village on the Leh side after Taglang La.", "", { near: ["upshi", "taglang-la"] }),
  P("pang", "Pang", "landmark", ["changthang"], "Manali–Leh road", "A seasonal camp stop on the Manali–Leh road below the More plains.", "", { near: ["lachalung-la", "taglang-la"] }),
  P("sarchu", "Sarchu", "landmark", ["changthang"], "Manali–Leh road", "A seasonal camp area on the Manali–Leh road near the Himachal–Ladakh border.", "", { near: ["baralacha-la", "nakee-la"] }),
  P("keylong", "Keylong", "town", ["changthang"], "Lahaul", "The headquarters of Lahaul, on the Bhaga above Tandi.", "", { near: ["tandi", "jispa"] }),
  P("jispa", "Jispa", "village", ["changthang"], "Lahaul", "A riverside stop on the Bhaga between Keylong and Darcha.", "", { near: ["keylong", "darcha"] }),
  P("sissu", "Sissu", "village", ["changthang"], "Lahaul", "A village in the Chandra valley just north of the Atal Tunnel.", "", { near: ["atal-tunnel", "tandi"] }),
  P("tandi", "Tandi", "village", ["changthang"], "Lahaul", "Where the Chandra and Bhaga meet below Keylong.", "", { near: ["sissu", "keylong"] }),
  P("rampur", "Rampur", "town", ["spiti"], "Sutlej valley", "A Sutlej town on the road from Shimla into Kinnaur.", "", { near: ["narkanda", "sarahan"] }),
  P("ki-monastery", "Key Monastery", "monastery", ["spiti"], "Spiti", "Spiti's largest monastery, on a hill above the road from Kaza to Kibber.", "", { near: ["kaza", "kibber"] }),
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
  pass("namika-la", "Namika La", ["zanskar"], "Srinagar–Leh road", "A pass on the Srinagar–Leh road between Mulbekh and Fotu La.", ["mulbekh", "fotu-la"]),
  pass("zoji-la", "Zoji La", ["zanskar"], "Srinagar–Leh road", "The pass between the Kashmir valley and Drass on the Srinagar–Leh road, west of Kargil: the way into Ladakh from Srinagar.", ["kargil"],
    { notes: "A detour west from Kargil, on the Srinagar road." }),
  pass("rohtang-la", "Rohtang La", ["spiti", "changthang"], "Kullu–Lahaul", "The old pass between the Kullu valley and Lahaul above Manali, on the Pir Panjal; the Atal Tunnel now carries the through traffic beneath it.", ["manali", "atal-tunnel"],
    { aka: "Rohtang Pass", notes: "A detour from Manali: check the current rules for the road up to the pass before you ride it." }),
  pass("jalori-pass", "Jalori Pass", ["spiti"], "Tirthan–Sutlej", "The pass on the Jibhi–Narkanda road (NH 305) between the Tirthan valley and the Sutlej side, in forest all the way up.", ["jibhi", "narkanda"],
    { aka: "Jalori Jot", notes: "Closed by snow for months each winter." }),
  pass("marsimik-la", "Marsimik La", ["changthang"], "Pangong", "A very high pass above the north tip of Pangong Tso, about 20 km from Lukung, on the ridge between the lake and the Chang Chenmo valley.", ["lukung", "spangmik"],
    { access: "Restricted area near the border: entry needs permission beyond the usual Inner Line permit, and the road is often closed to visitors.", notes: "A detour from Lukung; among the highest motorable passes anywhere." }),
  pass("polokongka-la", "Polokongka La", ["changthang"], "Changthang", "The pass on the road from Tso Kar across to the Puga valley and on to Tso Moriri, climbing out of the Tso Kar basin.", ["tso-kar", "karzok"],
    { aka: "Pologongka La", notes: "On the Tso Kar–Tso Moriri road; the position here is approximate." }),
  pass("tsaga-la", "Tsaga La", ["changthang"], "Chushul–Loma road", "A pass on the road between Chushul and the upper Indus near Loma, along the eastern edge of Ladakh.", ["chushul", "nyoma"], { access: PERMIT }),
  pass("hamta-pass", "Hamta Pass", ["spiti"], "Kullu–Lahaul", "A trekking pass between the Kullu valley and the Chandra valley in Lahaul. Walked, not ridden.", ["manali", "chandratal"], { notes: "A trek, not a road: there is no riding route over it." }),
  pass("kunzum-la", "Kunzum Pass", ["spiti"], "Spiti–Lahaul", "The seasonal high-altitude connection between Spiti and Lahaul.", ["losar", "batal"], { aka: "Kunzum La", notes: "Seasonal: check whether the pass is open before planning the Kaza–Manali connection." }),
];

/** Summaries only: heights shown are the terrain model's reading until official figures are verified. */
const peak = (id: string, name: string, circuits: CircuitId[], region: string, summary: string, near: string[]) =>
  P(id, name, "peak", circuits, region, summary, "", { near });

export const PEAKS: PlaceRecord[] = [
  peak("nun", "Nun", ["zanskar"], "Nun Kun massif", "The highest summit of the Nun Kun massif, which towers over the Suru valley road towards Rangdum.", ["kun", "panikhar"]),
  peak("kun", "Kun", ["zanskar"], "Nun Kun massif", "Nun's twin across the snow plateau of the Nun Kun massif.", ["nun", "parkachik"]),
  peak("stok-kangri", "Stok Kangri", ["nubra", "changthang"], "Stok range", "A popular trekking summit across the Indus from Leh, the white peak on Leh's southern skyline.", ["leh", "shey"]),
  peak("kang-yatse", "Kang Yatse", ["changthang"], "Markha valley", "A summit above the Markha valley in Hemis National Park.", ["hemis"]),
  peak("saser-kangri", "Saser Kangri", ["nubra"], "Saser Muztagh", "The highest summit of the Saser Muztagh range, east of the Nubra valley.", ["sumur", "panamik"]),
  peak("mulkila", "Mulkila", ["changthang"], "Lahaul", "A high summit of Lahaul above the Bhaga valley, seen on the road between Keylong and Darcha.", ["keylong", "darcha"]),
  peak("deo-tibba", "Deo Tibba", ["spiti"], "Pir Panjal", "A snow summit of the Pir Panjal above the Kullu valley.", ["manali", "hamta-pass"]),
  peak("kinnaur-kailash", "Kinnaur Kailash range", ["spiti"], "Kinnaur", "The sacred range that faces Kalpa across the Sutlej.", ["kalpa", "reckong-peo"]),
  peak("cckn", "Chau Chau Kang Nilda", ["spiti"], "Spiti", "The peak that fills the view from Langza, 13 km north-east of Kaza.", ["langza", "kaza"]),
  peak("kanamo", "Kanamo", ["spiti"], "Spiti", "A trekking summit above Kibber.", ["kibber", "shilla"]),
  peak("shilla", "Shilla", ["spiti"], "Spiti", "A peak north of Kaza, once thought to be far higher than it is.", ["kibber", "langza"]),
  peak("manirang", "Manirang", ["spiti"], "Kinnaur–Spiti", "A peak on the Kinnaur–Spiti divide above the Manirang pass, seen from the road near Nako and Tabo.", ["nako", "tabo"]),
  peak("hanuman-tibba", "Hanuman Tibba", ["spiti", "changthang"], "Pir Panjal", "The highest of the Pir Panjal near Manali, above Solang.", ["manali", "friendship-peak"]),
  peak("friendship-peak", "Friendship Peak", ["spiti", "changthang"], "Pir Panjal", "A trekking summit above Beas Kund near Manali.", ["manali", "hanuman-tibba"]),
  peak("lungser-kangri", "Lungser Kangri", ["changthang"], "Rupshu", "The highest peak of the Rupshu plateau, east of Tso Moriri.", ["chamser-kangri", "karzok"]),
  peak("chamser-kangri", "Chamser Kangri", ["changthang"], "Rupshu", "A summit east of Tso Moriri, climbed from Karzok.", ["lungser-kangri", "karzok"]),
  peak("mentok-kangri", "Mentok Kangri", ["changthang"], "Rupshu", "The peaks west of Tso Moriri, above Korzok.", ["karzok", "tso-moriri"]),
  // the Karakoram and Nanga Parbat, north of Nubra
  peak("k2", "K2", ["nubra"], "Karakoram", "The second-highest mountain on Earth, at the head of the Baltoro glacier.", ["broad-peak", "gasherbrum-i"]),
  peak("nanga-parbat", "Nanga Parbat", ["nubra"], "Western Himalaya", "The western anchor of the Himalaya, above the Indus gorge.", ["rakaposhi", "haramosh"]),
  peak("gasherbrum-i", "Gasherbrum I", ["nubra"], "Karakoram", "Hidden Peak, one of the 8,000 m summits of the Baltoro.", ["gasherbrum-ii", "k2"]),
  peak("gasherbrum-ii", "Gasherbrum II", ["nubra"], "Karakoram", "An 8,000 m summit of the Gasherbrum group.", ["gasherbrum-i", "broad-peak"]),
  peak("broad-peak", "Broad Peak", ["nubra"], "Karakoram", "K2's neighbour across the Godwin-Austen glacier, with a summit ridge over a kilometre long.", ["k2", "gasherbrum-ii"]),
  peak("masherbrum", "Masherbrum", ["nubra"], "Karakoram", "The great peak of the Hushe valley, south of the Baltoro.", ["k2", "saltoro-kangri"]),
  peak("rakaposhi", "Rakaposhi", ["nubra"], "Karakoram", "The mountain that rises straight from the Hunza valley near Gilgit.", ["haramosh", "nanga-parbat"]),
  peak("haramosh", "Haramosh", ["nubra"], "Karakoram", "A summit above the Indus between Gilgit and Skardu.", ["rakaposhi", "nanga-parbat"]),
  peak("saltoro-kangri", "Saltoro Kangri", ["nubra"], "Saltoro range", "The highest of the Saltoro range, on the ridge west of the Siachen glacier.", ["singhi-kangri", "siachen-bc"]),
  peak("teram-kangri", "Teram Kangri", ["nubra"], "Siachen", "The highest peak of the Siachen Muztagh, at the head of the Siachen glacier.", ["apsarasas-kangri", "siachen-bc"]),
  peak("apsarasas-kangri", "Apsarasas Kangri", ["nubra"], "Siachen", "A summit of the Siachen Muztagh east of the glacier.", ["teram-kangri", "singhi-kangri"]),
  peak("singhi-kangri", "Singhi Kangri", ["nubra"], "Siachen", "A peak on the Siachen side of the Saltoro ridge.", ["saltoro-kangri", "teram-kangri"]),
  peak("rimo-i", "Rimo I", ["nubra"], "Rimo Muztagh", "The highest of the Rimo group, east of the Siachen glacier.", ["mamostong-kangri", "chong-kumdang-ri"]),
  peak("mamostong-kangri", "Mamostong Kangri", ["nubra"], "Rimo Muztagh", "The great peak between the Nubra and Shyok valleys, north-east of Panamik.", ["rimo-i", "panamik"]),
  peak("chong-kumdang-ri", "Chong Kumdang Ri", ["nubra"], "Rimo Muztagh", "A summit above the Chong Kumdan glacier on the upper Shyok.", ["mamostong-kangri", "rimo-i"]),
  peak("saser-kangri-ii", "Saser Kangri II", ["nubra"], "Saser Muztagh", "The second summit of the Saser group, climbed only in 2011.", ["saser-kangri", "argan-kangri"]),
  peak("argan-kangri", "Argan Kangri", ["nubra"], "Saser Muztagh", "The highest of the Arganglas group, east of the Nubra valley.", ["saser-kangri", "sumur"]),
  // Ladakh and Zanskar
  peak("pinnacle-peak", "Pinnacle Peak", ["zanskar"], "Nun Kun massif", "The third summit of the Nun Kun massif.", ["nun", "kun"]),
  peak("golep-kangri", "Golep Kangri", ["nubra", "changthang"], "Stok range", "Stok Kangri's neighbour, climbed from the same base camp.", ["stok-kangri", "matho-kangri"]),
  peak("matho-kangri", "Matho Kangri", ["changthang"], "Stok range", "The summit above Matho, across the Indus from Leh.", ["golep-kangri", "matho"]),
  peak("dzo-jongo", "Dzo Jongo", ["changthang"], "Markha valley", "A twin-summit trekking peak next to Kang Yatse.", ["kang-yatse", "hemis"]),
  peak("chakula", "Chakula", ["changthang"], "Changthang", "A peak between Chumathang and Chushul, above the Indus.", ["nyoma", "chushul"]),
  peak("spangnak-ri", "Spangnak Ri", ["changthang"], "Rupshu", "A summit south-west of the Nyoma road, above the Tso Moriri plateau.", ["kiagar-ri", "tso-moriri"]),
  peak("kiagar-ri", "Kiagar Ri", ["changthang"], "Rupshu", "A 6,000 m trekking peak above Kyagar Tso on the road to Tso Moriri.", ["spangnak-ri", "tso-moriri"]),
  // the Srinagar–Leh road and Kashmir
  peak("tiger-hill", "Tiger Hill", ["zanskar"], "Drass", "The ridge above Drass fought over in the Kargil war of 1999, above the Srinagar–Leh road.", ["tololing", "kargil"]),
  peak("tololing", "Tololing", ["zanskar"], "Drass", "The ridge above Drass whose recapture turned the Kargil war; the war memorial sits below it.", ["tiger-hill", "kargil"]),
  peak("machoi", "Machoi Peak", ["zanskar"], "Zoji La", "The peak above the Machoi glacier at Zoji La, on the road down to Sonamarg.", ["kolahoi"]),
  peak("kolahoi", "Kolahoi", ["zanskar"], "Kashmir", "The highest peak of the Kashmir valley, above Pahalgam and Sonamarg.", ["machoi", "harmukh"]),
  peak("harmukh", "Harmukh", ["zanskar"], "Kashmir", "The sacred peak above Gangabal lake, north of Srinagar.", ["kolahoi"]),
  // Lahaul, Kullu and Chamba
  peak("yunam", "Yunam", ["changthang"], "Lahaul", "The 6,000 m trekking peak above Baralacha La, climbed from the Manali–Leh road.", ["baralacha-la", "suraj-tal"]),
  peak("gepang-goh", "Gepang Goh", ["changthang"], "Lahaul", "The peak that hangs over Sissu and the Chandra valley north of the Atal Tunnel.", ["sissu", "atal-tunnel"]),
  peak("gangstang", "Gangstang", ["changthang"], "Lahaul", "A pyramid north of the Chandra, approached from Keylong.", ["keylong", "mulkila"]),
  peak("phabrang", "Phabrang", ["changthang"], "Miyar valley", "The summit at the head of the Miyar valley in Lahaul.", ["keylong"]),
  peak("kullu-pumori", "Kullu Pumori", ["spiti"], "Bara Shigri", "A peak of the Bara Shigri glacier between Kullu and Spiti.", ["chandratal", "papsura"]),
  peak("papsura", "Papsura", ["spiti"], "Kullu–Lahaul", "The Peak of Evil, twin of Dharamsura, on the Kullu–Lahaul divide.", ["kullu-pumori", "deo-tibba"]),
  peak("indrasan", "Indrasan", ["spiti"], "Pir Panjal", "Deo Tibba's higher neighbour above the Kullu valley.", ["deo-tibba", "manali"]),
  peak("manimahesh-kailash", "Manimahesh Kailash", ["spiti"], "Chamba", "The sacred peak above Manimahesh lake in Chamba, a pilgrimage every August.", ["manali"]),
  // Kinnaur and the Sutlej
  peak("jorkanden", "Jorkanden", ["spiti"], "Kinnaur", "The highest summit of the Kinnaur Kailash range, above Kalpa.", ["kinnaur-kailash", "kalpa"]),
  peak("rangrik-rang", "Rangrik Rang", ["spiti"], "Kinnaur", "A summit above the Baspa valley, east of Chitkul.", ["chitkul", "sangla"]),
  peak("leo-pargial", "Leo Pargial", ["spiti"], "Kinnaur–Spiti", "Reo Purgyil's twin, two kilometres north of it on the Tibet border.", ["reo-purgyil", "nako"]),
  peak("shrikhand-mahadev", "Shrikhand Mahadev", ["spiti"], "Kullu–Kinnaur", "The sacred rock pinnacle above the Sutlej near Rampur, a hard pilgrimage trek in July.", ["rampur", "narkanda"]),
  peak("reo-purgyil", "Reo Purgyil", ["spiti"], "Kinnaur–Spiti", "The highest peak in Himachal Pradesh, rising above Nako.", ["nako"]),
];

// merge published-source facts into the records
for (const r of [...PLACES, ...PASSES, ...PEAKS]) {
  const f = FACTS[r.id];
  if (!f) continue;
  const { sources, ...fields } = f;
  for (const [k, v] of Object.entries(fields)) if (v) (r.practical as unknown as Record<string, string>)[k] = v as string;
  r.sources = sources; r.status = "sourced"; r.last_verified = CHECKED_ON;
}

export const ALL_PLACES = [...PLACES, ...PASSES, ...PEAKS];
export const BY_ID: Record<string, PlaceRecord> = Object.fromEntries(ALL_PLACES.map((p) => [p.id, p]));

export const TYPE_LABEL: Record<PlaceType, string> = { village: "Village", town: "Town", pass: "Pass", peak: "Peak", lake: "Lake", landmark: "Landmark", monastery: "Monastery" };
export const PRACTICAL_LABEL: Record<keyof Practical, string> = {
  fuel: "Fuel", food: "Food", stay: "Stay", network: "Network", medical: "Medical help", bestTime: "Best time", riderNotes: "Rider notes",
};
