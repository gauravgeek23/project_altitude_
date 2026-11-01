import type { Circuit, Coord } from "./types";

export const routedSegments = (c: Circuit) => c.legs.flatMap((l) => l.segments).filter((s) => s.status === "ok" && s.coords);
export const gaps = (c: Circuit) => c.legs.flatMap((l) => l.segments).filter((s) => s.status !== "ok");

export function circuitBounds(c: Circuit): [Coord, Coord] | null {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  for (const seg of routedSegments(c)) for (const [x, y] of seg.coords!) { w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y); }
  return isFinite(w) ? [[w, s], [e, n]] : null;
}
