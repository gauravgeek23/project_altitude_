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
const KEY = "altitude-photo-cache-v3";
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

/* ------------------------------------------------------------------ more sources
 * Wikimedia Commons search and Openverse (Flickr and other open collections) need no key.
 * Google image results come from Google's Custom Search JSON API, which needs your own key and
 * search engine id: set VITE_GOOGLE_CSE_KEY and VITE_GOOGLE_CSE_CX (in Vercel: Project Settings ->
 * Environment Variables) and rebuild. Google results are often copyrighted: preview only.
 */
const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_CSE_KEY as string | undefined;
const GOOGLE_CX = import.meta.env.VITE_GOOGLE_CSE_CX as string | undefined;
export const GOOGLE_ENABLED = Boolean(GOOGLE_KEY && GOOGLE_CX);

const strip = (h?: string) => (h ?? "").replace(/<[^>]+>/g, "").trim();

async function fromCommons(q: string, n = 10): Promise<Photo[]> {
  const u = "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6" +
    `&gsrlimit=${n}&gsrsearch=${encodeURIComponent("filetype:bitmap " + q)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1280`;
  const r = await fetch(u);
  if (!r.ok) return [];
  const j = await r.json();
  return Object.values(j.query?.pages ?? {})
    .sort((a: any, b: any) => (a.index ?? 0) - (b.index ?? 0))
    .map((pg: any) => pg.imageinfo?.[0])
    .filter((ii: any) => ii?.thumburl)
    .map((ii: any) => ({
      src: ii.thumburl as string,
      credit: `Wikimedia Commons: ${strip(ii.extmetadata?.Artist?.value) || "unknown author"}${ii.extmetadata?.LicenseShortName?.value ? ", " + ii.extmetadata.LicenseShortName.value : ""}`,
      link: ii.descriptionurl as string,
    }));
}

async function fromOpenverse(q: string, n = 10): Promise<Photo[]> {
  const r = await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=${n}&mature=false`);
  if (!r.ok) return [];
  const j = await r.json();
  return (j.results ?? []).filter((x: any) => x.url).map((x: any) => ({
    src: x.url as string,
    credit: `${x.source ?? "Openverse"}: ${x.creator || "unknown author"}${x.license ? ", CC " + String(x.license).toUpperCase() : ""}`,
    link: (x.foreign_landing_url ?? x.url) as string,
  }));
}

async function fromGoogle(q: string, n = 8): Promise<Photo[]> {
  if (!GOOGLE_ENABLED) return [];
  const r = await fetch(`https://www.googleapis.com/customsearch/v1?key=${GOOGLE_KEY}&cx=${GOOGLE_CX}&searchType=image&imgSize=large&safe=active&num=${n}&q=${encodeURIComponent(q)}`);
  if (!r.ok) return [];
  const j = await r.json();
  return (j.items ?? []).map((x: any) => ({ src: x.link as string, credit: `Google Images: ${x.displayLink ?? ""}`, link: (x.image?.contextLink ?? x.link) as string }));
}

const safe = <T,>(p: Promise<T[]>) => p.catch(() => [] as T[]);

/** The photo for a place: your own if set, else the Wikipedia lead image, else the first search hit. */
export function photoFor(id: string, query?: string): Promise<Photo | null> {
  if (PHOTOS[id]) return Promise.resolve({ src: PHOTOS[id], credit: "Project Altitude", link: "" });
  if (saved[id]) return Promise.resolve(saved[id]);
  if (!cache.has(id)) {
    cache.set(id, (async () => {
      for (const t of WIKI[id] ?? []) {
        try { const p = await fromWikipedia(t); if (p) { remember(id, p); return p; } } catch { break; }
      }
      if (query) {
        const hit = (await safe(fromGoogle(query, 1)))[0] ?? (await safe(fromCommons(query, 1)))[0] ?? (await safe(fromOpenverse(query, 1)))[0];
        if (hit) { remember(id, hit); return hit; }
      }
      return null;
    })());
  }
  return cache.get(id)!;
}

const galleries = new Map<string, Promise<Photo[]>>();

/** Everything we can find for the place: its Wikipedia article's images, then Google (when configured),
 *  Wikimedia Commons and Openverse search results. Lead photo first, duplicates removed. */
export function galleryFor(id: string, lead: Photo, query?: string): Promise<Photo[]> {
  if (!galleries.has(id)) {
    galleries.set(id, (async () => {
      const q = query ?? "";
      const [wiki, google, commons, openverse] = await Promise.all([
        lead.title ? safe(fromWikiMedia(lead)) : Promise.resolve([] as Photo[]),
        q ? safe(fromGoogle(q)) : Promise.resolve([] as Photo[]),
        q ? safe(fromCommons(q, 10)) : Promise.resolve([] as Photo[]),
        q ? safe(fromOpenverse(q, 8)) : Promise.resolve([] as Photo[]),
      ]);
      const seen = new Set<string>(), out: Photo[] = [];
      const key = (u: string) => decodeURIComponent(u.split("/").slice(-1)[0]).replace(/^\d+px-/, "").toLowerCase();
      for (const p of [lead, ...wiki, ...google, ...commons, ...openverse]) {
        const k = key(p.src);
        if (seen.has(k)) continue;
        seen.add(k); out.push(p);
      }
      return out.slice(0, 30);
    })());
  }
  return galleries.get(id)!;
}

/** All images of a Wikipedia article. */
async function fromWikiMedia(lead: Photo): Promise<Photo[]> {
  const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(lead.title!.replace(/ /g, "_"))}`);
  if (!r.ok) return [];
  const j = await r.json();
  const more: Photo[] = [];
  for (const it of j.items ?? []) {
    if (it.type !== "image" || !it.srcset?.length || /\.(svg|gif)$/i.test(it.title ?? "")) continue;
    const best = it.srcset[it.srcset.length - 1].src as string;
    const src = best.startsWith("//") ? "https:" + best : best;   // never ask for more than the file has
    more.push({ src, credit: (it.caption?.text as string | undefined)?.slice(0, 140) || lead.credit, link: `https://en.wikipedia.org/wiki/${encodeURIComponent(it.title)}` });
  }
  return more.slice(0, 14);
}
