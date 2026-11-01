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
  // draw the active circuit last so it sits on top where circuits share a road
  const order = [...ds].sort((a, b) => Number(a.c.id === active) - Number(b.c.id === active));
  return (
    <g className={"routes" + (active ? " has-active" : "")}>
      {order.filter(({ c }) => visible.has(c.id)).map(({ c, d }) => (
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
    </g>
  );
});
