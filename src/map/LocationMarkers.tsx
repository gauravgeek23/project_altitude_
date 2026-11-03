import { useMemo, useState } from "react";
import type * as d3 from "d3";
import type { MapLocation, RegionData } from "./data/types";
import { circuitsAt, mapLocations } from "./data/locations";
import { ALL_PLACES } from "../content/places";
import { FUEL_AT } from "../content/fuel";
import { MapIcon, type IconKind } from "../components/icons";

/** the guide's type of each place decides its icon; map-only places fall back on their map kind */
const TYPE_OF: Record<string, IconKind> = Object.fromEntries(ALL_PLACES.filter((p) => p.mapId).map((p) => [p.mapId!, p.type]));
export const iconOf = (l: MapLocation): IconKind =>
  TYPE_OF[l.id] ?? ({ town: "village", pass: "pass", peak: "peak", lake: "lake", poi: "landmark", monastery: "monastery", via: "landmark" } as const)[l.kind];
/** zoom at which each tier of places appears */
const TIER_ZOOM = [0, 0, 2.2, 4];

interface Props {
  region: RegionData;
  project: d3.GeoProjection;
  transform: d3.ZoomTransform;
  size: { w: number; h: number };
  selected: string | null;
  activeCircuit: string | null;
  visible: Set<string>;
  onSelect(id: string): void;
  /** kinds of place to show; all when omitted */
  kinds?: Set<string>;
  /** show the petrol pumps: a badge under a shown town, or a pump marker of its own where the town is filtered out */
  fuel?: boolean;
  /** a single kind is shown: every place of it appears at every zoom, tiers aside */
  showAll?: boolean;
  /** false while the map is still showing only the routes */
  revealed?: boolean;
  /** true during the reveal: each marker waits a moment longer than the last */
  stagger?: boolean;
}

const CHAR_W = 6.5, LABEL_H = 20, ICON = 12, ICON_GAP = 15, BADGE = 9, PEAK_H = 16, PEAK_CHAR = 6.3;
type Box = [number, number, number, number];
interface Item { l: MapLocation; x: number; y: number; onVisible: boolean; onActive: boolean; priority: number; fuelOnly: boolean; box?: Box }

/**
 * Markers and labels live in screen space so they keep one size at every zoom.
 * Towns, passes, lakes and landmarks: a dot and a name tag, placed by priority and dropped where
 * it would collide (the dot stays). Peaks: a name in plain text, nothing else. Monasteries: a small
 * icon only, at every zoom; the name appears on hover and the card on a click. Fuel: a badge under the dot.
 */
export function LocationMarkers({ region, project, transform, size, selected, activeCircuit, visible, onSelect, kinds, fuel, showAll = false, revealed = true, stagger = false }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const locs = useMemo(() => mapLocations(region).filter((l) => !kinds || kinds.has(l.kind) || l.id === selected || (fuel && FUEL_AT.has(l.id))).map((l) => ({
    l, xy: project([l.lon!, l.lat!])!, on: circuitsAt(region, l.id).map((c) => c.id),
    // a pump whose town is filtered out stands as a pump marker on its own
    fuelOnly: !!kinds && !kinds.has(l.kind) && l.id !== selected && !!fuel && FUEL_AT.has(l.id),
  })), [region, project, kinds, selected, fuel]);

  // the tiers thin the map out (a few main monasteries, the smaller villages as you zoom in); with a single kind
  // ticked, every place of that kind is on the map at every zoom
  const items: Item[] = locs.filter(({ l, fuelOnly }) => l.id === selected || fuelOnly || showAll || transform.k >= TIER_ZOOM[l.tier ?? 1]).map(({ l, xy, on, fuelOnly }) => {
    const [x, y] = transform.apply(xy);
    const onVisible = on.some((id) => visible.has(id));
    const onActive = activeCircuit ? on.includes(activeCircuit) : false;
    // the hubs (Leh, Manali, Chandigarh) and the highlight (Umling La) are pinned: placed first and never dropped
    const priority = (l.id === selected ? 100 : 0) + (l.hub || l.accent ? 200 : 0) + (onActive ? 30 : 0) + (onVisible ? 10 : 0)
      + (l.kind === "town" ? 4 : l.kind === "pass" ? 3 : l.kind === "peak" ? 1 : 2);
    return { l, x, y, onVisible, onActive, priority, fuelOnly };
  }).filter((i) => i.x > -40 && i.y > -40 && i.x < size.w + 40 && i.y < size.h + 40);

  // monastery icons never stack: where two would overlap, or one would sit on a dot, they are eased apart.
  // At zoom 1 an icon spans ten kilometres, so the few pixels of easing stay within its own footprint.
  const isIcon = (i: Item) => i.l.kind === "monastery" || i.fuelOnly;
  const mons = items.filter(isIcon), dots = items.filter((i) => !isIcon(i) && i.l.kind !== "peak");
  const apart = (m: Item, o: Item, d: number, share: number) => {
    let dx = m.x - o.x, dy = m.y - o.y, dist = Math.hypot(dx, dy);
    if (dist >= d) return;
    if (dist < 0.01) { dx = 0; dy = -1; dist = 1; }
    const k = (d - dist) / dist;
    m.x += dx * k * share; m.y += dy * k * share; o.x -= dx * k * (1 - share); o.y -= dy * k * (1 - share);
  };
  for (let pass = 0; pass < 3; pass++) for (const m of mons) {
    for (const o of dots) apart(m, o, BADGE + 10, 1);
    for (const o of mons) if (o !== m) apart(m, o, 2 * BADGE + 2, 0.5);
  }

  // keep labels clear of the scale bar (bottom left), the zoom buttons (top right), the search box and the circuit bar
  const reserved: Box[] = [[0, size.h - 62, 190, size.h], [size.w - 72, 0, size.w, 270], [0, 0, Math.min(425, size.w - 64), 104]];
  const placed: Box[] = [...reserved];
  for (const i of [...items].sort((a, b) => b.priority - a.priority)) {
    if (isIcon(i) && i.l.id !== selected) continue;   // icon only: the name shows on hover
    const peak = i.l.kind === "peak";
    const w = peak ? i.l.name.length * PEAK_CHAR + 16 : i.l.name.length * (i.l.hub ? 7.6 : CHAR_W) + 20 + ICON_GAP;
    const h = peak ? PEAK_H : LABEL_H;
    // tags: right, left, above, below the dot; peak names: centred above or below the summit
    const spots = peak ? [[-w / 2, -h - 3], [-w / 2, 3], [5, -h / 2], [-w - 5, -h / 2]] : [[8, -h / 2], [-8 - w, -h / 2], [-w / 2, -h - 8], [-w / 2, 8]];
    const pinned = !!(i.l.hub || i.l.accent);
    for (const [dx, dy] of spots) {
      const box: Box = [i.x + dx, i.y + dy, i.x + dx + w, i.y + dy + h];
      const clear = box[0] > 2 && box[2] < size.w - 2 && box[1] > 2 && box[3] < size.h - 2 &&
        !placed.some((b) => box[0] < b[2] + 2 && box[2] > b[0] - 2 && box[1] < b[3] + 1 && box[3] > b[1] - 1) &&
        (pinned || !items.some((o) => o !== i && o.l.kind !== "peak" && !isIcon(o) && o.x > box[0] - 3 && o.x < box[2] + 3 && o.y > box[1] - 3 && o.y < box[3] + 3));
      if (clear) { placed.push(box); i.box = box; break; }
    }
    if (pinned && !i.box) {   // nowhere clear: it still shows, at its first spot
      const [dx, dy] = spots[0]; const box: Box = [i.x + dx, i.y + dy, i.x + dx + w, i.y + dy + h]; placed.push(box); i.box = box;
    }
  }

  // tags come first: an icon under one is moved out through the nearest side, then eased clear of its neighbours again
  const tags = placed.slice(reserved.length), pad = BADGE + 2;
  const outOfTags = (m: Item) => {
    for (const b of tags) {
      if (!(m.x > b[0] - pad && m.x < b[2] + pad && m.y > b[1] - pad && m.y < b[3] + pad)) continue;
      const out = [m.x - (b[0] - pad), (b[2] + pad) - m.x, m.y - (b[1] - pad), (b[3] + pad) - m.y];
      const side = out.indexOf(Math.min(...out));
      if (side === 0) m.x = b[0] - pad; else if (side === 1) m.x = b[2] + pad; else if (side === 2) m.y = b[1] - pad; else m.y = b[3] + pad;
    }
  };
  for (let pass = 0; pass < 4; pass++) for (const m of mons) {
    for (const o of dots) apart(m, o, BADGE + 10, 1);
    for (const o of mons) if (o !== m) apart(m, o, 2 * BADGE + 2, 0.5);
    outOfTags(m);   // the tags have the last word
  }
  // an icon under the search box or the controls could not be clicked, so it is left out there
  const drawn = items.filter((i) => !isIcon(i) || i.l.id === selected ||
    !reserved.some((b) => i.x > b[0] - BADGE && i.x < b[2] + BADGE && i.y > b[1] - BADGE && i.y < b[3] + BADGE))
    .sort((a, b) => Number(!!(a.l.hub || a.l.accent)) - Number(!!(b.l.hub || b.l.accent)));

  const label = (i: Item, box: Box) => (
    <g className="label">
      <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={LABEL_H} rx={LABEL_H / 2} />
      <MapIcon kind={iconOf(i.l)} x={box[0] + 7} y={box[1] + (LABEL_H - ICON) / 2} size={ICON} />
      <text x={box[0] + ICON_GAP + (box[2] - box[0] - ICON_GAP) / 2} y={box[1] + LABEL_H / 2 + 0.5}>{i.l.name}</text>
    </g>
  );
  const hovered = hover ? drawn.find((i) => i.l.id === hover && isIcon(i) && !i.box) : undefined;

  return (
    <g className={"locations" + (activeCircuit ? " has-active" : "") + (revealed ? "" : " veiled")}>
      <defs>
        <filter id="tag-shadow" x="-20%" y="-40%" width="140%" height="190%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000" floodOpacity="0.22" />
        </filter>
        <filter id="tag-shadow-lift" x="-20%" y="-60%" width="140%" height="230%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.28" />
        </filter>
      </defs>
      {drawn.map((i, k) => {
        const sel = i.l.id === selected;
        const delay = stagger ? { animationDelay: `${Math.min(k * 14, 900)}ms` } : undefined;
        const cls = `loc ${i.l.kind} t-${iconOf(i.l)}` + (i.l.accent ? " accent" : "") + (i.l.hub ? " hub" : "") + (sel ? " selected" : "") +
          (i.onActive ? " on-active" : "") + (i.onVisible ? "" : " off");
        const press = {
          role: "button" as const, tabIndex: 0, "aria-label": `${i.l.name}, ${i.fuelOnly ? "petrol pump" : kindWord(i.l)}`, "aria-pressed": sel, style: delay,
          onClick: (e: React.MouseEvent) => { e.stopPropagation(); onSelect(i.l.id); },
          onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(i.l.id); } },
        };
        if (i.l.kind === "peak") {
          if (!i.box) return null;
          const [x0, y0, x1, y1] = i.box;
          return (
            <g key={i.l.id} className={cls} {...press}>
              <rect className="target" x={x0} y={y0} width={x1 - x0} height={y1 - y0} />
              <text className="peak-name" x={(x0 + x1) / 2} y={y0 + PEAK_H / 2 + 0.5}>▲ {i.l.name}</text>
            </g>
          );
        }
        if (i.fuelOnly) {
          const pump = FUEL_AT.get(i.l.id)!;
          return (
            <g key={i.l.id} className={cls + " fuel-only" + (pump.status === "needs_verification" ? " unsure" : "")} {...press} onPointerEnter={() => setHover(i.l.id)} onPointerLeave={() => setHover(null)}>
              <title>{`Fuel at ${pump.name}: ${pump.note}`}</title>
              {sel && <circle className="pulse" cx={i.x} cy={i.y} r={7} />}
              <circle className="badge" cx={i.x} cy={i.y} r={BADGE} />
              <MapIcon kind="fuel" x={i.x - 6} y={i.y - 6} size={12} />
              {i.box && label(i, i.box)}
              <circle className="target" cx={i.x} cy={i.y} r={12} />
            </g>
          );
        }
        if (i.l.kind === "monastery") {
          return (
            <g key={i.l.id} className={cls} {...press} onPointerEnter={() => setHover(i.l.id)} onPointerLeave={() => setHover(null)}>
              {sel && <circle className="pulse" cx={i.x} cy={i.y} r={7} />}
              <circle className="badge" cx={i.x} cy={i.y} r={BADGE} />
              <MapIcon kind="monastery" x={i.x - 6} y={i.y - 6} size={12} />
              {i.box && label(i, i.box)}
              <circle className="target" cx={i.x} cy={i.y} r={12} />
            </g>
          );
        }
        const pump = fuel ? FUEL_AT.get(i.l.id) : undefined;
        return (
          <g key={i.l.id} className={cls} {...press}>
            {sel && <circle className="pulse" cx={i.x} cy={i.y} r={6} />}
            <circle className="ring" cx={i.x} cy={i.y} r={8} />
            <circle className="dot" cx={i.x} cy={i.y} r={4} />
            {i.box && label(i, i.box)}
            {pump && (
              <g className={"fuel-badge" + (pump.status === "needs_verification" ? " unsure" : "")}>
                <title>{`Fuel at ${pump.name}: ${pump.note}`}</title>
                <circle cx={i.x} cy={i.y + 18} r={BADGE} />
                <MapIcon kind="fuel" x={i.x - 6} y={i.y + 12} size={12} />
              </g>
            )}
            <circle className="target" cx={i.x} cy={i.y} r={12} />
          </g>
        );
      })}
      {hovered && (() => {
        const w = hovered.l.name.length * CHAR_W + 20 + ICON_GAP;
        const box: Box = hovered.x + 12 + w < size.w ? [hovered.x + 12, hovered.y - LABEL_H / 2, hovered.x + 12 + w, hovered.y + LABEL_H / 2]
          : [hovered.x - 12 - w, hovered.y - LABEL_H / 2, hovered.x - 12, hovered.y + LABEL_H / 2];
        return <g className={"loc hover-label " + (hovered.fuelOnly ? "fuel-only" : "monastery")}>{label(hovered, box)}</g>;
      })()}
    </g>
  );
}

const kindWord = (l: MapLocation) => ({ town: "town", pass: "pass", peak: "peak", lake: "lake", poi: "landmark", monastery: "monastery", via: "point" })[l.kind];
