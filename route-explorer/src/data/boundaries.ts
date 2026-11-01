import type { BoundaryLine } from "./types";

/**
 * Natural Earth publishes each line with a class. They are drawn as published:
 * the class decides the style, nothing is merged, moved or traced.
 */
export type BoundaryStyle = "international" | "contested" | "claim";

export function styleOf(b: BoundaryLine): BoundaryStyle {
  if (b.kind === "claim") return "claim";
  return b.cls === "International boundary" ? "international" : "contested";
}

export const BOUNDARY_LEGEND: { style: BoundaryStyle; label: string }[] = [
  { style: "international", label: "International boundary" },
  { style: "contested", label: "Line of control, disputed or indefinite line" },
  { style: "claim", label: "Claim lines" },
];
