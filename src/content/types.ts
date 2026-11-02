/**
 * Content records for Project Altitude. Content lives here as data, not inside components,
 * so places can be corrected or added without touching the interface.
 *
 * Rule: unknown stays unknown. A field the project has not verified is `null` and the
 * interface shows "Not verified" for it.
 */
export type CircuitId = "zanskar" | "nubra" | "changthang" | "spiti";

/** verified: field-checked · sourced: found in published sources, not field-checked · editorial: our own description, not a factual claim · needs_verification: not checked yet */
export type Verification = "verified" | "sourced" | "editorial" | "needs_verification";

export type PlaceType = "village" | "town" | "pass" | "lake" | "landmark";

export interface Practical {
  fuel: string | null;
  food: string | null;
  stay: string | null;
  network: string | null;
  medical: string | null;
  bestTime: string | null;
  riderNotes: string | null;
}

export interface PlaceRecord {
  id: string;
  name: string;
  aka?: string;
  type: PlaceType;
  circuits: CircuitId[];
  region: string;
  /** shown in the card */
  summary: string;
  why: string;
  practical: Practical;
  /** access restrictions or warnings, shown prominently */
  access: string | null;
  /** an official elevation figure, once verified; terrain-model readings are shown separately */
  elevation_m: number | null;
  /** id of the pin on the map, when the place has a sourced position */
  mapId: string | null;
  neighbours: string[];
  status: Verification;
  sources: { label: string; url: string }[];
  last_verified: string | null;
}

export interface ContactRecord {
  service: string;
  contact: string;
  /** dialable number, when it is a phone number */
  tel: string | null;
  notes: string;
  source: string;
  status: Verification;
  last_verified: string | null;
}
