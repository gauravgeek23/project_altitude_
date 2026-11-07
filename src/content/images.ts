/**
 * Photographs from the ride, by place.
 *
 * `photos.json` is written by `python3 scripts/photos.py build` from `scripts/photo-selection.json`
 * (which album items belong to which place, with captions). The image files live in
 * `public/photos/`, at 1600 px and 640 px on the long side, and are served from the site itself.
 * The single-file page cannot carry the images, so it loads the same pictures from the shared
 * Google Photos album instead.
 *
 * A place without a photo shows no image: nothing is borrowed from other sites.
 */
import manifest from "./photos.json";

export interface Photo {
  src: string;
  thumb: string;
  w: number;
  h: number;
  caption: string;
  /** YYYY-MM-DD, local time of the ride */
  taken: string;
  credit: string;
  /** where the subject sits, as a CSS object-position, so a crop keeps it */
  focus: string;
}

interface Entry { f: string; t: string; r: string; w: number; h: number; d: string; c: string; fx?: number; fy?: number }
const M = manifest as Record<string, Entry[]>;
const BASE = import.meta.env.BASE_URL;
export const PHOTO_CREDIT = "Gaurav Kumar, Project Altitude";

/** every photo of a place (or of `story`, `creator`, a dish), lead photo first; empty when there is none */
export function photosFor(id: string): Photo[] {
  return (M[id] ?? []).map((e) => ({
    // a photo that is not in the album (the creator's portrait) carries its own data URI in `r`
    src: e.r.startsWith("data:") ? (__SINGLE__ ? e.r : BASE + e.f) : __SINGLE__ ? `${e.r}=w1600-h1600-no` : BASE + e.f,
    thumb: e.r.startsWith("data:") ? (__SINGLE__ ? e.r : BASE + e.t) : __SINGLE__ ? `${e.r}=w640-h640-no` : BASE + e.t,
    w: e.w, h: e.h, caption: e.c, taken: e.d, credit: PHOTO_CREDIT,
    focus: `${e.fx ?? 50}% ${e.fy ?? 50}%`,
  }));
}

export const hasPhotos = (id: string) => (M[id]?.length ?? 0) > 0;
export const PHOTO_COUNT = Object.values(M).reduce((n, v) => n + v.length, 0);

/** "16 August 2026" */
export function photoDate(p: Photo): string {
  const [y, m, d] = p.taken.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
