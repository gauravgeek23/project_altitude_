/**
 * One icon language for the whole guide: the same glyph marks a kind of place on the map,
 * in search results, on the map card and on every card in the left panel.
 * Drawn on a 24 px grid with 2 px round strokes so they read at 12–20 px.
 */
export type IconKind = "village" | "town" | "pass" | "peak" | "lake" | "landmark" | "monastery" | "fuel" | "food";

export const ICON_PATHS: Record<IconKind, string> = {
  // a house
  village: "M4 11.5 12 5l8 6.5M6.5 10v9.5h11V10M10.5 19.5v-5h3v5",
  // a gabled town hall with a door
  town: "M3.5 20.5h17M5.5 20.5V10L12 5l6.5 5v10.5M10 20.5v-4.5h4v4.5M9 11.5h6",
  // a saddle between two summits, with a flag on the crossing
  pass: "M2.5 19.5 8 10l4 5 4-6.5 5.5 11H2.5ZM12 15V7.5l3.5 1.6L12 10.6",
  // a single summit with its snow line
  peak: "M3 20 12 4.5 21 20H3ZM8.4 12.2l2 1.6 1.6-1.6 1.6 1.6 2-1.6",
  // water
  lake: "M3 8.5c1.5-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0M3 13.5c1.5-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0M3 18.5c1.5-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0",
  // a map pin with a star point: monasteries, tunnels, camps and other landmarks
  landmark: "M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11ZM12 7.2l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3 1-2Z",
  // a chorten: dome on a stepped base, with its spire
  monastery: "M12 2.5v2.3M9.6 6h4.8l-.7 3.2h-3.4L9.6 6ZM8.2 13.7c0-2.6 1.7-4.2 3.8-4.2s3.8 1.6 3.8 4.2M6.3 13.7h11.4v2.5H6.3zM4.5 20.5h15v-4.3h-15z",
  // a petrol pump
  fuel: "M5.5 20.5v-15a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v15M3.5 20.5h12M7.5 6.5h5v4h-5zM14.5 10h1.6a1.6 1.6 0 0 1 1.6 1.6v5.4a1.4 1.4 0 0 0 2.8 0V9.8L18 7.3",
  // fork and knife
  food: "M7 3v18M4.5 3v5c0 1.6 1.1 2.7 2.5 2.7S9.5 9.6 9.5 8V3M17 21V3c-2 1.2-3 3.6-3 7v3h3",
};

export const ICON_LABEL: Record<IconKind, string> = {
  village: "Village", town: "Town", pass: "Pass", peak: "Peak", lake: "Lake", landmark: "Landmark", monastery: "Monastery", fuel: "Fuel", food: "Food",
};

/** For HTML: an inline SVG that takes the current text colour. */
export function PlaceIcon({ kind, size = 16, title, className }: { kind: IconKind; size?: number; title?: string; className?: string }) {
  return (
    <svg className={"place-icon " + (className ?? "")} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path d={ICON_PATHS[kind]} />
    </svg>
  );
}

/** For the map's SVG: the same path, placed at (x, y) with its top-left corner, at `size` px. */
export function MapIcon({ kind, x, y, size = 12 }: { kind: IconKind; x: number; y: number; size?: number }) {
  return <path className="map-icon" d={ICON_PATHS[kind]} transform={`translate(${x} ${y}) scale(${size / 24})`} />;
}

export function RefreshIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4.5V11h-6.5" />
    </svg>
  );
}

export function SatelliteIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}

export function FilterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5.5h16l-6.2 7.2v5.3l-3.6 1.7v-7z" />
    </svg>
  );
}
