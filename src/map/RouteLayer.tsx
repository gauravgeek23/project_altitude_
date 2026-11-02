import { memo, useMemo } from "react";
import type * as d3 from "d3";
import type { Circuit } from "./data/types";
import { routedSegments } from "./data/circuits";

interface Props {
  circuits: Circuit[];
  path: d3.GeoPath;
  visible: Set<string>;
  active: string | null;
  onHover(id: string | null): void;
  onSelect(id: string): void;
}

/** Circuits drawn from routed road geometry only; gaps in the data stay gaps. */
export const RouteLayer = memo(function RouteLayer({ circuits, path, visible, active, onHover, onSelect }: Props) {
  const ds = useMemo(() => circuits.map((c) => ({
    c, d: path({ type: "MultiLineString", coordinates: routedSegments(c).map((s) => s.coords!) }) ?? "",
  })), [circuits, path]);
  // the hit paths keep their place in the DOM (moving one under the pointer loses its leave event);
  // the active circuit is drawn again on top, without pointer events, where circuits share a road
  const shown = ds.filter(({ c }) => visible.has(c.id));
  const top = active ? shown.find(({ c }) => c.id === active) : undefined;
  return (
    <g className={"routes" + (active ? " has-active" : "")}>
      {shown.map(({ c, d }) => (
        <g key={c.id} className={"circuit" + (c.id === active ? " active" : "")} style={{ ["--c" as string]: c.color }}>
          <path className="casing" d={d} />
          <path className="line" d={d} />
          <path className="hit" d={d}
            onPointerEnter={() => onHover(c.id)} onPointerLeave={() => onHover(null)}
            onClick={(e) => { e.stopPropagation(); onSelect(c.id); }}>
            <title>{c.name}</title>
          </path>
        </g>
      ))}
      {top && (
        <g className="circuit active top" style={{ ["--c" as string]: top.c.color }}>
          <path className="casing" d={top.d} />
          <path className="line" d={top.d} />
        </g>
      )}
    </g>
  );
});
