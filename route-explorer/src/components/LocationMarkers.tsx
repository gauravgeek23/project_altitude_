import { useMemo } from "react";
import type * as d3 from "d3";
import type { MapLocation, RegionData } from "../data/types";
import { circuitsAt, mapLocations } from "../data/locations";

interface Props {
  region: RegionData;
  project: d3.GeoProjection;
  transform: d3.ZoomTransform;
  size: { w: number; h: number };
  selected: string | null;
  activeCircuit: string | null;
  visible: Set<string>;
  onSelect(id: string): void;
}

const CHAR_W = 6.6, LABEL_H = 17;

/**
 * Markers and labels live in screen space so they keep one size at every zoom.
 * Labels are placed by priority and dropped where they would collide; the marker stays.
 */
export function LocationMarkers({ region, project, transform, size, selected, activeCircuit, visible, onSelect }: Props) {
  const locs = useMemo(() => mapLocations(region).map((l) => ({
    l, xy: project([l.lon!, l.lat!])!, on: circuitsAt(region, l.id).map((c) => c.id),
  })), [region, project]);

  const items = locs.map(({ l, xy, on }) => {
    const [x, y] = transform.apply(xy);
    const onVisible = on.some((id) => visible.has(id));
    const onActive = activeCircuit ? on.includes(activeCircuit) : false;
    const priority = (l.id === selected ? 100 : 0) + (l.accent ? 50 : 0) + (onActive ? 30 : 0) + (onVisible ? 10 : 0)
      + (l.kind === "town" ? 4 : l.kind === "pass" ? 3 : 2);
    return { l, x, y, onVisible, onActive, priority };
  }).filter((i) => i.x > -40 && i.y > -40 && i.x < size.w + 40 && i.y < size.h + 40);

  // keep labels clear of the scale bar (bottom left) and the zoom buttons (top right)
  const placed: [number, number, number, number][] = [[0, size.h - 62, 190, size.h], [size.w - 64, 0, size.w, 150]];
  const shown = new Set<string>();
  for (const i of [...items].sort((a, b) => b.priority - a.priority)) {
    const w = i.l.name.length * CHAR_W + 14;
    // try right, then left, then above
    for (const [dx, dy] of [[8, -LABEL_H / 2], [-8 - w, -LABEL_H / 2], [-w / 2, -LABEL_H - 8], [-w / 2, 8]]) {
      const box: [number, number, number, number] = [i.x + dx, i.y + dy, i.x + dx + w, i.y + dy + LABEL_H];
      const clear = box[0] > 2 && box[2] < size.w - 2 && box[1] > 2 && box[3] < size.h - 2 &&
        !placed.some((b) => box[0] < b[2] + 2 && box[2] > b[0] - 2 && box[1] < b[3] + 1 && box[3] > b[1] - 1) &&
        !items.some((o) => o !== i && o.x > box[0] - 3 && o.x < box[2] + 3 && o.y > box[1] - 3 && o.y < box[3] + 3);
      if (clear) { placed.push(box); shown.add(i.l.id); (i as typeof i & { box?: number[] }).box = [box[0], box[1], w]; break; }
    }
  }

  return (
    <g className={"locations" + (activeCircuit ? " has-active" : "")}>
      {items.map((i) => {
        const box = (i as typeof i & { box?: number[] }).box;
        const sel = i.l.id === selected;
        return (
          <g key={i.l.id} className={`loc ${i.l.kind}` + (i.l.accent ? " accent" : "") + (sel ? " selected" : "") +
            (i.onActive ? " on-active" : "") + (i.onVisible ? "" : " off")}
            role="button" tabIndex={0} aria-label={`${i.l.name}, ${kindWord(i.l)}`} aria-pressed={sel}
            onClick={(e) => { e.stopPropagation(); onSelect(i.l.id); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(i.l.id); } }}>
            {sel && <circle className="halo" cx={i.x} cy={i.y} r={11} />}
            <circle className="dot" cx={i.x} cy={i.y} r={sel ? 5.5 : 4} />
            {box && (
              <g className="label">
                <rect x={box[0]} y={box[1]} width={box[2]} height={LABEL_H} rx={2.5} />
                <text x={box[0] + 7} y={box[1] + LABEL_H / 2 + 0.5}>{i.l.name}</text>
              </g>
            )}
            <circle className="target" cx={i.x} cy={i.y} r={11} />
          </g>
        );
      })}
    </g>
  );
}

const kindWord = (l: MapLocation) => ({ town: "town", pass: "pass", lake: "lake", poi: "landmark", via: "point" })[l.kind];
