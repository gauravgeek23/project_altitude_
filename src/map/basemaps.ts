/**
 * Satellite imagery providers that allow their tiles to be shown on a website.
 * Keyless ones work out of the box; the others light up when their key is set at build time
 * (Vercel: Project Settings -> Environment Variables), and stay hidden otherwise.
 *
 * Every provider's attribution is shown on the map while it is in use.
 */
export type BasemapId = "terrain" | "esri" | "s2" | "nasa" | "maptiler" | "mapbox" | "google";

export interface Basemap {
  id: BasemapId;
  label: string;
  /** shown under the picker */
  note: string;
  attribution: string;
  maxZoom: number;
  /** tile URL; for Google it also needs the session token */
  tile?: (z: number, x: number, y: number, session?: string) => string;
  available: boolean;
}

const env = import.meta.env;
const MAPTILER = env.VITE_MAPTILER_KEY as string | undefined;
const MAPBOX = env.VITE_MAPBOX_TOKEN as string | undefined;
const GOOGLE = env.VITE_GOOGLE_MAPS_KEY as string | undefined;

export const BASEMAPS: Basemap[] = [
  { id: "terrain", label: "Terrain", note: "Shaded relief from the elevation model.", attribution: "Terrain: AWS Terrain Tiles", maxZoom: 22, available: true },
  {
    id: "esri", label: "Esri", note: "Sharpest free imagery; free to display with attribution.",
    attribution: "Imagery: Esri, Maxar, Earthstar Geographics", maxZoom: 18, available: true,
    tile: (z, x, y) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
  },
  {
    id: "s2", label: "Sentinel-2", note: "Cloud-free 10 m mosaic: the even, natural colours look best for the whole region. CC BY 4.0.",
    attribution: "Sentinel-2 cloudless (s2maps.eu) by EOX IT Services GmbH, contains modified Copernicus Sentinel data 2016", maxZoom: 14, available: true,
    tile: (z, x, y) => `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/${z}/${y}/${x}.jpg`,
  },
  {
    id: "nasa", label: "NASA Blue Marble", note: "Shaded-relief overview for the zoomed-out crown view. Low detail when zoomed in.",
    attribution: "NASA Blue Marble, via NASA GIBS", maxZoom: 8, available: true,
    tile: (z, x, y) => `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/GoogleMapsCompatible_Level8/${z}/${y}/${x}.jpeg`,
  },
  {
    id: "maptiler", label: "MapTiler", note: "Needs VITE_MAPTILER_KEY. Free plan is non-commercial.",
    attribution: "© MapTiler © OpenStreetMap contributors, satellite imagery providers", maxZoom: 20, available: Boolean(MAPTILER),
    tile: (z, x, y) => `https://api.maptiler.com/tiles/satellite-v2/${z}/${x}/${y}.jpg?key=${MAPTILER}`,
  },
  {
    id: "mapbox", label: "Mapbox", note: "Needs VITE_MAPBOX_TOKEN. Pay-as-you-go with a free tier.",
    attribution: "© Mapbox © Maxar", maxZoom: 19, available: Boolean(MAPBOX),
    tile: (z, x, y) => `https://api.mapbox.com/v4/mapbox.satellite/${z}/${x}/${y}@2x.jpg90?access_token=${MAPBOX}`,
  },
  {
    id: "google", label: "Google", note: "Google's official Map Tiles API. Needs VITE_GOOGLE_MAPS_KEY with billing enabled.",
    attribution: "Imagery ©Google", maxZoom: 20, available: Boolean(GOOGLE),
    tile: (z, x, y, session) => `https://tile.googleapis.com/v1/2dtiles/${z}/${x}/${y}?session=${session}&key=${GOOGLE}`,
  },
];

export const BASEMAP_BY_ID = Object.fromEntries(BASEMAPS.map((b) => [b.id, b])) as Record<BasemapId, Basemap>;

let googleSession: Promise<string | null> | null = null;
/** Google tiles need a session token: satellite, English labels, India as the region (so India's borders). */
export function googleSessionToken(): Promise<string | null> {
  if (!GOOGLE) return Promise.resolve(null);
  if (!googleSession) {
    googleSession = fetch(`https://tile.googleapis.com/v1/createSession?key=${GOOGLE}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mapType: "satellite", language: "en-IN", region: "IN" }),
    }).then((r) => (r.ok ? r.json() : null)).then((j) => j?.session ?? null).catch(() => null);
  }
  return googleSession;
}
