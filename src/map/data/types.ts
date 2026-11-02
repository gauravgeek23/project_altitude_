export type Coord = [number, number]; // [lon, lat]

export type LocationKind = "town" | "pass" | "peak" | "lake" | "poi" | "monastery" | "via";

export interface MapLocation {
  id: string;
  name: string;
  kind: LocationKind;
  aka?: string;
  accent?: boolean;
  /** null when no dataset available to the build has this place */
  lon: number | null;
  /** true when the position was read from the reference map */
  traced?: boolean;
  lat: number | null;
  /** metres, read from the terrain model */
  elev: number | null;
  /** where the coordinate came from */
  source: string | null;
  missing?: string;
  /** the main hubs (Leh, Manali, Chandigarh) */
  hub?: boolean;
  /** 1 (default): shown at every zoom; 2 and 3: revealed as you zoom in */
  tier?: number;
  /** circuits whose line passes within 3 km, for places that are not stops */
  near?: string[];
}

export type SegmentStatus = "ok" | "missing-location" | "missing-road";

export interface Segment {
  from: string;
  to: string;
  status: SegmentStatus;
  km?: number;
  /** road: real road geometry; traced: your reference map's line; gap: straight join where a label covers the line */
  source?: "road" | "traced" | "terrain" | "gap";
  note?: string;
  reason?: string;
  coords?: Coord[];
}

export interface Leg {
  waypoints: string[];
  unplaced: string[];
  segments: Segment[];
}

export interface Circuit {
  id: string;
  name: string;
  color: string;
  km: number;
  roadKm?: number;
  legs: Leg[];
}

export interface BoundaryLine {
  kind: "land" | "claim" | "state";
  cls: string;
  name: string;
  left: string | null;
  right: string | null;
  c: Coord[];
}

export interface RegionData {
  id: string;
  name: string;
  bbox: [number, number, number, number];
  terrain: { image: string; bounds: [number, number, number, number] };
  roads: { route: Coord[][]; trunk: Coord[][]; primary: Coord[][] };
  rivers: { w: number; c: Coord[] }[];
  boundaries: BoundaryLine[];
  /** state polygons that tint on hover: Ladakh, Himachal Pradesh */
  regions?: { id: string; name: string; c: Coord[][][] }[];
  locations: MapLocation[];
  circuits: Circuit[];
  sources: { name: string; use: string }[];
}

export interface Region {
  data: RegionData;
  /** URL of the shaded-relief image (Web Mercator, data.terrain.bounds) */
  terrainUrl: string;
}
