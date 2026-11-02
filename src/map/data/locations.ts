import type { Circuit, MapLocation, RegionData } from "./types";

export const isPlaced = (l: MapLocation): l is MapLocation & { lon: number; lat: number } => l.lon !== null && l.lat !== null;

/** Places shown on the map: sourced coordinates only, routing via-points hidden. */
export function mapLocations(region: RegionData) {
  return region.locations.filter((l) => isPlaced(l) && l.kind !== "via");
}

/** Places named in the circuits or the reference map that no dataset could place. */
export function missingLocations(region: RegionData) {
  return region.locations.filter((l) => !isPlaced(l));
}

export function circuitsAt(region: RegionData, id: string): Circuit[] {
  const near = region.locations.find((l) => l.id === id)?.near ?? [];
  return region.circuits.filter((c) => near.includes(c.id) || c.legs.some((leg) => leg.waypoints.includes(id)));
}

export const KIND_LABEL: Record<MapLocation["kind"], string> = {
  town: "Town or village",
  pass: "Mountain pass",
  peak: "Peak",
  monastery: "Monastery",
  lake: "Lake",
  poi: "Landmark",
  via: "Routing point",
};
