import type { Verification } from "./types";
import { SOURCES as S } from "./facts";

/**
 * Petrol pumps on the circuits, for the fuel layer of the map. Each sits at a mapped place.
 * `sourced` means reported in a published source (linked); `needs_verification` means the
 * reports disagree; `editorial` is a plain fact about a city. Fuel is never assumed: a
 * place that is not in this list has no pump that we know of.
 */
export interface FuelStop {
  place: string;
  name: string;
  note: string;
  status: Verification;
  source?: { label: string; url: string };
}

export const FUEL_STOPS: FuelStop[] = [
  { place: "leh", name: "Leh", note: "Several fuel stations in and around Leh.", status: "sourced", source: S.fuel },
  { place: "karu", name: "Karu", note: "About 35 km from Leh: the last pump for Pangong, Tso Moriri and the Manali road.", status: "sourced", source: S.fuel },
  { place: "diskit", name: "Diskit", note: "Reported as the only pump in the Nubra valley.", status: "sourced", source: S.fuel },
  { place: "tangtse", name: "Tangtse", note: "A newer pump (around 2023), about 34 km before Pangong.", status: "sourced", source: S.fuel },
  { place: "nyoma", name: "Nyoma", note: "A newer pump (around 2024); useful for Tso Moriri and Hanle.", status: "sourced", source: S.fuel },
  { place: "kargil", name: "Kargil", note: "Fuel stations in Kargil.", status: "sourced", source: S.fuel },
  { place: "khalsi", name: "Khalsi", note: "On the Srinagar–Leh road; the nearest pump to Lamayuru.", status: "sourced", source: S.fuel },
  { place: "padum", name: "Padum", note: "A pump is reported, but sources disagree on whether it works. Carry enough fuel from Kargil.", status: "needs_verification", source: S.spareFuel },
  { place: "tandi", name: "Tandi", note: "The last pump before Karu on the Manali–Leh road: about 320 km without fuel.", status: "sourced", source: S.fuel },
  { place: "manali", name: "Manali", note: "A town with fuel stations; fill up before Lahaul.", status: "editorial" },
  { place: "kaza", name: "Kaza", note: "Indian Oil pump, one of the highest in the world. Queues and stock-outs are reported, and it is said to close around 8 pm.", status: "sourced", source: S.kazaPump },
  { place: "reckong-peo", name: "Powari, below Reckong Peo", note: "The last dependable pump before Spiti; one rider found it closed and advises filling at Rampur too.", status: "sourced", source: S.spitiFuel },
  { place: "rampur", name: "Rampur", note: "Fill up here as well before Kinnaur.", status: "sourced", source: S.spitiFuel },
  { place: "shimla", name: "Shimla", note: "A city with many fuel stations.", status: "editorial" },
  { place: "chandigarh", name: "Chandigarh", note: "A city with many fuel stations.", status: "editorial" },
];

export const FUEL_AT = new Map(FUEL_STOPS.map((f) => [f.place, f]));
