/**
 * PREVIEW IMAGES: replace before release.
 *
 * Until the creator's own photographs are added, each place borrows the lead image of a
 * Wikipedia article, loaded in the reader's browser at run time (nothing is copied into
 * this repository). Wikipedia images are mostly freely licensed, but the credit shown on
 * the card is the only attribution here: check the licence of each before publishing,
 * or replace them with your own photos by setting `PHOTOS[id]` to an image URL or an
 * imported file.
 */

/** Your own photos, by place id. These win over the Wikipedia previews. */
export const PHOTOS: Record<string, string> = {};

/** Wikipedia article titles to try, in order, for each place id. */
export const WIKI: Record<string, string[]> = {
  // Zanskar and Kargil
  kargil: ["Kargil"], sankoo: ["Sankoo", "Suru Valley"], panikhar: ["Panikhar", "Suru Valley"], parkachik: ["Parkachik", "Nun Kun"],
  rangdum: ["Rangdum Monastery", "Rangdum"], "satso-lake": ["Suru Valley"], padum: ["Padum", "Zanskar"], zangla: ["Zangla", "Zanskar"],
  "gombo-ranjan": ["Gumbok Rangan", "Shinku La"], lamayuru: ["Lamayuru Monastery"], darcha: ["Darcha"], "pensi-la": ["Pensi La", "Drang-Drung Glacier"],
  "shinku-la": ["Shinku La"], "fotu-la": ["Fotu La"], "namika-la": ["Namika La"], mulbekh: ["Mulbekh Monastery", "Mulbekh"], khalsi: ["Khalsi"],
  alchi: ["Alchi Monastery"],
  // Leh and Nubra
  leh: ["Leh", "Leh Palace"], thiksey: ["Thiksey Monastery"], shey: ["Shey Palace", "Shey"], khalsar: ["Khalsar", "Nubra Valley"],
  diskit: ["Diskit Monastery", "Diskit"], hunder: ["Hunder"], turtuk: ["Turtuk"], bogdang: ["Bogdang", "Turtuk"], thang: ["Thang, Ladakh", "Turtuk"],
  sumur: ["Sumur", "Nubra Valley"], panamik: ["Panamik"], "siachen-bc": ["Siachen Glacier"], "khardung-la": ["Khardung La"], "wari-la": ["Wari La"],
  "saser-kangri": ["Saser Kangri"], "stok-kangri": ["Stok Kangri"], "kang-yatse": ["Kang Yatze"],
  // Changthang
  karu: ["Karu, Ladakh", "Hemis Monastery"], hemis: ["Hemis Monastery"], sakti: ["Sakti, Ladakh", "Chang La"], "chang-la": ["Chang La"],
  tangtse: ["Tangtse"], durbuk: ["Durbuk"], lukung: ["Pangong Tso"], spangmik: ["Spangmik", "Pangong Tso"], "pangong-tso": ["Pangong Tso"],
  maan: ["Pangong Tso"], merak: ["Merak, Ladakh", "Pangong Tso"], chushul: ["Chushul"], "tsaga-la": ["Tsaga La", "Chushul"], nyoma: ["Nyoma"],
  hanle: ["Hanle (village)", "Hanle Monastery", "Indian Astronomical Observatory"], demchok: ["Demchok, Ladakh", "Demchok"],
  "tso-moriri": ["Tso Moriri"], karzok: ["Korzok", "Tso Moriri"], "tso-kar": ["Tso Kar"], "photi-la": ["Photi La", "Hanle (village)"],
  "umling-la": ["Umling La"], nurbula: ["Hanle (village)"], "taglang-la": ["Taglang La"], "lachalung-la": ["Lachulung La"], "nakee-la": ["Nakee La", "Gata Loops"],
  "baralacha-la": ["Baralacha La"], upshi: ["Upshi"], rumtse: ["Rumtse"], pang: ["Pang, Ladakh", "Leh–Manali Highway"], sarchu: ["Sarchu"],
  mahe: ["Nyoma"], "suraj-tal": ["Suraj Tal"],
  // Lahaul, Spiti and Kinnaur
  shimla: ["Shimla"], narkanda: ["Narkanda"], sarahan: ["Bhimakali Temple", "Sarahan"], rampur: ["Rampur Bushahr"], sangla: ["Sangla"],
  rakchham: ["Rakchham"], chitkul: ["Chitkul"], kalpa: ["Kalpa, Himachal Pradesh", "Kalpa"], "reckong-peo": ["Reckong Peo"],
  "kinnaur-kailash": ["Kinnaur Kailash"], "reo-purgyil": ["Reo Purgyil"], nako: ["Nako, Himachal Pradesh", "Nako Lake"], gue: ["Gue Monastery", "Spiti Valley"],
  tabo: ["Tabo Monastery"], dhankar: ["Dhankar Monastery"], kaza: ["Kaza, Himachal Pradesh"], kibber: ["Kibber"], chicham: ["Chicham Bridge", "Kibber"],
  langza: ["Langza"], hikkim: ["Hikkim"], komik: ["Komic"], mudh: ["Pin Valley National Park"], losar: ["Losar, Himachal Pradesh", "Spiti Valley"],
  batal: ["Batal, Himachal Pradesh", "Chandra Taal"], "kunzum-la": ["Kunzum Pass"], chandratal: ["Chandra Taal"], "ki-monastery": ["Key Monastery"],
  "atal-tunnel": ["Atal Tunnel"], manali: ["Manali, Himachal Pradesh"], "hamta-pass": ["Hamta Pass"], "deo-tibba": ["Deo Tibba"],
  mulkila: ["Mulkila"], keylong: ["Keylong"], jispa: ["Jispa"], sissu: ["Sissu"], tandi: ["Tandi, Himachal Pradesh", "Keylong"],
  jibhi: ["Jibhi", "Tirthan Valley"], mandi: ["Mandi, Himachal Pradesh"], chandigarh: ["Chandigarh"], solan: ["Solan"],
  nun: ["Nun Kun"], kun: ["Nun Kun"],
  // dishes
  "dish-thukpa": ["Thukpa"], "dish-momo": ["Momo (food)"], "dish-thenthuk": ["Thenthuk"], "dish-skyu": ["Skyu"], "dish-tingmo": ["Tingmo"],
  "dish-butter-tea": ["Butter tea"], "dish-chhurpi": ["Chhurpi"], "dish-siddu": ["Siddu"], "dish-khambir": ["Khambir"], "dish-apricot": ["Apricot"],
};

export interface Photo { src: string; credit: string; link: string; title?: string }

const cache = new Map<string, Promise<Photo | null>>();
const KEY = "altitude-photo-cache-v2";
let saved: Record<string, Photo | null> = {};
try { saved = JSON.parse(localStorage.getItem(KEY) ?? "{}"); } catch { saved = {}; }
const remember = (id: string, p: Photo | null) => {
  saved[id] = p;
  try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* storage unavailable */ }
};

async function fromWikipedia(title: string): Promise<Photo | null> {
  const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`);
  if (!r.ok) return null;
  const j = await r.json();
  const t: string | undefined = j.thumbnail?.source;
  if (!t || j.type === "disambiguation") return null;
  // ask for a wider rendition of the same file
  const src = t.replace(/\/(\d+)px-/, "/960px-");
  return { src, credit: `Wikipedia: ${j.title}`, link: j.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`, title: j.title };
}

/** The photo for a place: your own if set, else the first Wikipedia preview that exists. */
export function photoFor(id: string): Promise<Photo | null> {
  if (PHOTOS[id]) return Promise.resolve({ src: PHOTOS[id], credit: "Project Altitude", link: "" });
  if (id in saved) return Promise.resolve(saved[id]);
  if (!cache.has(id)) {
    cache.set(id, (async () => {
      for (const t of WIKI[id] ?? []) {
        try { const p = await fromWikipedia(t); if (p) { remember(id, p); return p; } } catch { return null; }
      }
      remember(id, null);
      return null;
    })());
  }
  return cache.get(id)!;
}

const galleries = new Map<string, Promise<Photo[]>>();

/** Every photo of the place's Wikipedia article (lead photo first), for the full-screen gallery. */
export function galleryFor(id: string, lead: Photo): Promise<Photo[]> {
  if (!lead.title) return Promise.resolve([lead]);
  if (!galleries.has(id)) {
    galleries.set(id, (async () => {
      try {
        const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(lead.title!.replace(/ /g, "_"))}`);
        if (!r.ok) return [lead];
        const j = await r.json();
        const more: Photo[] = [];
        for (const it of j.items ?? []) {
          if (it.type !== "image" || !it.srcset?.length || /\.(svg|gif)$/i.test(it.title ?? "")) continue;
          const best = it.srcset[it.srcset.length - 1].src as string;
          const src = best.startsWith("//") ? "https:" + best : best;   // never ask for more than the file has
          more.push({ src, credit: (it.caption?.text as string | undefined)?.slice(0, 140) || lead.credit, link: `https://en.wikipedia.org/wiki/${encodeURIComponent(it.title)}` });
        }
        const leadFile = lead.src.split("/").slice(-1)[0].replace(/^\d+px-/, "");
        const rest = more.filter((m) => !m.src.endsWith(leadFile)).slice(0, 14);
        return [lead, ...rest];
      } catch { return [lead]; }
    })());
  }
  return galleries.get(id)!;
}
