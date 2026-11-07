import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import type { Coord, Region } from "./data/types";
import { styleOf } from "./data/boundaries";
import { RouteLayer } from "./RouteLayer";
import { LocationMarkers } from "./LocationMarkers";

export interface MapHandle {
  zoomIn(): void;
  zoomOut(): void;
  reset(): void;
  fitTo(bounds: [Coord, Coord], maxScale?: number): void;
}

interface Props {
  region: Region;
  visible: Set<string>;
  activeCircuit: string | null;
  selectedLocation: string | null;
  showClaims: boolean;
  onHoverCircuit(id: string | null): void;
  onSelectCircuit(id: string): void;
  onSelectLocation(id: string | null): void;
  /** a click on empty map */
  onBackground?(): void;
  onScale?(kmPerPx: number): void;
  kinds?: Set<string>;
  /** a single kind is shown: every place of it appears at every zoom */
  showAll?: boolean;
  /** show the petrol pumps */
  fuel?: boolean;
  /** terrain: the shaded relief; satellite: Esri World Imagery tiles */
  basemap?: "terrain" | "satellite";
  /** which imagery to use in satellite mode (default Esri) */
  imagery?: { tile: (z: number, x: number, y: number) => string; maxZoom: number; roads: boolean };
}

/** Esri World Imagery (free to display with attribution). Tiles are fetched by the reader's browser. */
const TILE = (z: number, x: number, y: number) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
/** Esri's road overlay: roads and road names only (no boundaries, so India's official lines stay ours). */
const ROADS_TILE = (z: number, x: number, y: number) => `https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/${z}/${y}/${x}`;

/** Cities around the circuits, for orientation (as on Google's map). Not stops; not clickable.
 *  Positions: route checkpoints (scroll-route-demo) where available, else Wikipedia. */
const CITIES: { name: string; at: [number, number]; rank: 1 | 2 }[] = [
  { name: "Srinagar", at: [74.7973, 34.0837], rank: 1 }, { name: "Jammu", at: [74.857, 32.7266], rank: 1 },
  { name: "Gilgit", at: [74.3144, 35.9208], rank: 1 }, { name: "Skardu", at: [75.6333, 35.2971], rank: 1 },
  { name: "Muzaffarabad", at: [73.4711, 34.37], rank: 2 }, { name: "Baramulla", at: [74.3636, 34.198], rank: 2 },
  { name: "Gulmarg", at: [74.3805, 34.0484], rank: 2 }, { name: "Pahalgam", at: [75.315, 34.0161], rank: 2 },
  { name: "Sonamarg", at: [75.2931, 34.3032], rank: 2 }, { name: "Anantnag", at: [75.1487, 33.7311], rank: 2 },
  { name: "Dras", at: [75.7587, 34.4319], rank: 2 }, { name: "Kishtwar", at: [75.7662, 33.3116], rank: 2 },
  { name: "Kathua", at: [75.5254, 32.3693], rank: 2 }, { name: "Pathankot", at: [75.6421, 32.2643], rank: 1 },
  { name: "Chamba", at: [76.1258, 32.5534], rank: 2 }, { name: "Dharamshala", at: [76.3234, 32.219], rank: 1 },
  { name: "Kullu", at: [77.1095, 31.9578], rank: 2 }, { name: "Mandi", at: [76.932, 31.7087], rank: 2 },
  { name: "Hamirpur", at: [76.5213, 31.6862], rank: 2 }, { name: "Amritsar", at: [74.8723, 31.634], rank: 1 },
  { name: "Lahore", at: [74.3587, 31.5204], rank: 1 }, { name: "Sialkot", at: [74.5229, 32.4945], rank: 2 },
  { name: "Jalandhar", at: [75.5762, 31.326], rank: 2 }, { name: "Ludhiana", at: [75.8573, 30.901], rank: 1 },
  { name: "Dehradun", at: [78.0322, 30.3165], rank: 1 }, { name: "Uttarkashi", at: [78.4437, 30.7306], rank: 2 },
];

/** Web Mercator tiles covering the panel at the current zoom, placed in screen space. */
function SatelliteTiles({ project, t, size, url = TILE, className = "sat-tiles", maxZoom = 17 }: { project: d3.GeoProjection; t: d3.ZoomTransform; size: { w: number; h: number }; url?: (z: number, x: number, y: number) => string; className?: string; maxZoom?: number }) {
  // the projection's world is 2*pi*scale px wide; a tile zoom z world is 256 * 2^z px
  const world = 2 * Math.PI * project.scale() * t.k;
  // beyond a provider's deepest level, its last level is stretched
  const z = Math.max(1, Math.min(maxZoom, 17, Math.ceil(Math.log2(world / 256) + 0.3)));
  const n = 2 ** z;
  const inv = (sx: number, sy: number) => project.invert!(t.invert([sx, sy]))!;
  const [w0, n0] = inv(0, 0), [e0, s0] = inv(size.w, size.h);
  const tx = (lon: number) => Math.floor(((lon + 180) / 360) * n);
  const ty = (lat: number) => { const r = (lat * Math.PI) / 180; return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n); };
  const lonOf = (x: number) => (x / n) * 360 - 180;
  const latOf = (y: number) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI;
  const tiles: JSX.Element[] = [];
  const x0 = Math.max(0, tx(w0)), x1 = Math.min(n - 1, tx(e0)), y0 = Math.max(0, ty(n0)), y1 = Math.min(n - 1, ty(s0));
  if ((x1 - x0 + 1) * (y1 - y0 + 1) > 120) return null;
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
    const [ax, ay] = t.apply(project([lonOf(x), latOf(y)])!), [bx, by] = t.apply(project([lonOf(x + 1), latOf(y + 1)])!);
    // half a pixel of overlap hides seams between tiles
    tiles.push(<image key={`${z}/${x}/${y}`} href={url(z, x, y)} x={ax - 0.25} y={ay - 0.25} width={bx - ax + 0.5} height={by - ay + 0.5} preserveAspectRatio="none" />);
  }
  return <g className={className}>{tiles}</g>;
}

/** A fixed compass: the map is never rotated, so north is always up. */
/**
 * A small compass rose in the engraved manner: a four-point star, each point split into a lit and a
 * shaded half, with short points between, one ring with eight ticks, and N E S W. Monochrome ink on a
 * faint disc, so it reads on relief and on imagery alike. About the size of a map control.
 */
export function Compass({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  // one point of the star: tip at r = L, shoulders at r = s and half-width w; the right half is shaded
  const point = (L: number, w: number, s: number, a: number, cls: string) => (
    <g key={a} transform={`rotate(${a})`} className={cls}>
      <path className="lit" d={`M0 ${-L} L${-w} ${-s} L0 0 Z`} />
      <path className="dark" d={`M0 ${-L} L${w} ${-s} L0 0 Z`} />
    </g>
  );
  return (
    <g className="compass" transform={`translate(${x} ${y}) scale(${scale})`} aria-label="Compass: north is up" role="img">
      <circle r={28} className="compass-disc" />
      <circle r={16} className="ring outer" />
      <g className="ticks">{[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((a) => <line key={a} transform={`rotate(${a})`} y1={-16} y2={-13.6} />)}</g>
      {[45, 135, 225, 315].map((a) => point(11, 2, 3.6, a, "minor"))}
      {[0, 90, 180, 270].map((a) => point(19.5, 3, 5.2, a, "major"))}
      <circle r={1.6} className="hub" />
      <text y={-23} className="card">N</text><text x={23.5} y={0.5} className="card">E</text>
      <text y={23.5} className="card">S</text><text x={-23.5} y={0.5} className="card">W</text>
    </g>
  );
}

/** Country names, each set well inside territory that is not in dispute. */
/** the places come out once per page load, a couple of seconds after the routes */
let revealedOnce = false;
/**
 * The reveal plays once per page load, but not for someone who keeps reopening or refreshing the page:
 * the last few opening times are kept in localStorage, and a third open within a minute skips it.
 */
function skipReveal(): boolean {
  try {
    const key = "altitude-opens", now = Date.now();
    const opens = (JSON.parse(localStorage.getItem(key) ?? "[]") as number[]).filter((t) => now - t < 60_000);
    opens.push(now);
    localStorage.setItem(key, JSON.stringify(opens.slice(-5)));
    return opens.length > 2;
  } catch { return false; }
}

const COUNTRIES: { id: string; name: string; at: [number, number] }[] = [
  { id: "india", name: "INDIA", at: [76.2, 31.5] },        // Kangra and Hamirpur hills
  { id: "pakistan", name: "PAKISTAN", at: [73.9, 31.95] },    // Pakistani Punjab, near Gujranwala
  { id: "china", name: "CHINA", at: [79.95, 32.2] },       // Ngari, Tibet
  { id: "afghanistan", name: "AFGHANISTAN", at: [73.3, 37.15] },   // the Wakhan corridor
  { id: "nepal", name: "NEPAL", at: [80.7, 29.45] },         // Baitadi, far-western Nepal
];

/** State and union-territory names, on either side of the Ladakh | Himachal Pradesh line. */
const STATES: { id: string; name: string; at: [number, number] }[] = [
  { id: "ladakh", name: "LADAKH", at: [78.2, 34.4] },               // the Shyok valley east of Diskit
  { id: "himachal", name: "HIMACHAL PRADESH", at: [77.55, 31.93] }, // Pin valley and the Great Himalayan park, clear of the routes
];

const reduceMotion = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const ms = (t: number) => (reduceMotion ? 0 : t);

/** Static layers: terrain, rivers, roads, boundaries. Re-rendered only on resize. */
const BaseLayers = memo(function BaseLayers({ region, path, project, showClaims, satellite, onRegion }: {
  region: Region; path: d3.GeoPath; project: d3.GeoProjection; showClaims: boolean; satellite: boolean; onRegion(id: string | null): void;
}) {
  const { data } = region;
  const [b0, b1, b2, b3] = data.terrain.bounds;
  const tl = project([b0, b3])!, br = project([b2, b1])!;
  const line = (coords: Coord[][]) => path({ type: "MultiLineString", coordinates: coords }) ?? "";
  const roads = useMemo(() => ({
    primary: line(data.roads.primary), trunk: line(data.roads.trunk), route: line(data.roads.route),
  }), [path]);
  const rivers = useMemo(() => [0, 1, 2, 3].map((w) => line(data.rivers.filter((r) => r.w === w).map((r) => r.c))), [path]);
  const bounds = useMemo(() => {
    const by: Record<string, Coord[][]> = { international: [], contested: [], claim: [], state: [] };
    for (const b of data.boundaries) by[styleOf(b)].push(b.c);
    return { international: line(by.international), contested: line(by.contested), claim: line(by.claim), state: line(by.state) };
  }, [path]);
  const areas = useMemo(() => (data.regions ?? []).map((r) => ({ id: r.id, d: path({ type: "MultiPolygon", coordinates: r.c }) ?? "" })), [path]);
  return (
    <g className="base">
      {/* on satellite, the relief is laid over the imagery (multiply) for Google-like mountain shading */}
      <image className={satellite ? "relief-overlay" : undefined} href={region.terrainUrl} x={tl[0]} y={tl[1]} width={br[0] - tl[0]} height={br[1] - tl[1]} preserveAspectRatio="none" />
      {!satellite && rivers.map((d, w) => <path key={w} className={`river w${w}`} d={d} />)}
      <path className="road primary" d={roads.primary} />
      <path className="road trunk" d={roads.trunk} />
      <path className="road route" d={roads.route} />
      {showClaims && <path className="boundary claim" d={bounds.claim} />}
      {areas.map((a) => <path key={a.id} className={`region-area ${a.id}`} d={a.d} onPointerEnter={() => onRegion(a.id)} onPointerLeave={() => onRegion(null)} />)}
      <path className="boundary state" d={bounds.state} />
      <path className="boundary contested casing" d={bounds.contested} />
      <path className="boundary contested" d={bounds.contested} />
      <path className="boundary international casing" d={bounds.international} />
      <path className="boundary international" d={bounds.international} />
    </g>
  );
});

export const MapCanvas = forwardRef<MapHandle, Props>(function MapCanvas(props, ref) {
  const { region } = props;
  const wrap = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();
  const [size, setSize] = useState({ w: 800, h: 1000 });
  const [t, setT] = useState(d3.zoomIdentity);
  const [hoverRegion, setHoverRegion] = useState<string | null>(null);
  // first the relief and the routes; the places follow after a beat, each a moment after the last
  const [revealed, setRevealed] = useState(() => revealedOnce || (revealedOnce = skipReveal()));
  const [settled, setSettled] = useState(revealed);
  useEffect(() => {
    if (revealedOnce) return;
    const a = setTimeout(() => { revealedOnce = true; setRevealed(true); }, 2200);
    const b = setTimeout(() => setSettled(true), 2200 + 1600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  useEffect(() => {
    const el = wrap.current!;
    const ro = new ResizeObserver(([e]) => setSize({ w: Math.max(200, e.contentRect.width), h: Math.max(200, e.contentRect.height) }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mercator fitted so every placed dot (with room for its label) is in view at the widest zoom.
  // The shaded relief reaches well beyond the dots; if a panel is so wide or tall that it would
  // still show past the relief, the projection is scaled up until the relief covers the panel.
  const project = useMemo(() => {
    const pts = region.data.locations.filter((l) => l.lon != null && l.lat != null && l.kind !== "via" && (l.tier ?? 1) === 1).map((l) => [l.lon!, l.lat!] as [number, number]);
    // room for labels (they sit right of a dot, or flip left when tight) and the scale bar
    const pad = { t: 30, r: Math.min(120, size.w * 0.12), b: 64, l: Math.min(36, size.w * 0.06) };
    const p = d3.geoMercator().fitExtent([[pad.l, pad.t], [Math.max(pad.l + 10, size.w - pad.r), Math.max(pad.t + 10, size.h - pad.b)]], { type: "MultiPoint", coordinates: pts });
    const [b0, b1, b2, b3] = region.data.terrain.bounds;
    const tl = p([b0, b3])!, br = p([b2, b1])!;
    const grow = Math.max(1, size.w / (br[0] - tl[0]), size.h / (br[1] - tl[1]));
    if (grow > 1) p.scale(p.scale() * grow * 1.001);
    // keep the relief over the whole panel
    const t2 = p([b0, b3])!, b2p = p([b2, b1])!;
    const [tx, ty] = p.translate();
    const dx = t2[0] > 0 ? -t2[0] : b2p[0] < size.w ? size.w - b2p[0] : 0;
    const dy = t2[1] > 0 ? -t2[1] : b2p[1] < size.h ? size.h - b2p[1] : 0;
    return p.translate([tx + dx, ty + dy]);
  }, [region, size.w, size.h]);
  // the relief's edges, in screen space at zoom 1: panning stops there
  const reliefBox = useMemo(() => {
    const [b0, b1, b2, b3] = region.data.terrain.bounds;
    return [project([b0, b3])!, project([b2, b1])!] as [[number, number], [number, number]];
  }, [project, region]);
  const path = useMemo(() => d3.geoPath(project), [project]);
  // the widest view: the whole northern crown of India, Gilgit-Baltistan to Aksai Chin
  const minK = useMemo(() => {
    const [x0, y0] = project([72.3, 37.2])!, [x1, y1] = project([80.6, 32.0])!;
    // leave room for the search box and filter bar on top and the scale bar below
    const crown = 0.92 * Math.min(size.w / (x1 - x0), Math.max(200, size.h - 180) / (y1 - y0));
    // but never past the relief: at the widest zoom the relief still lies under every pixel of the panel
    const [[rx0, ry0], [rx1, ry1]] = reliefBox;
    const cover = Math.max(size.w / (rx1 - rx0), size.h / (ry1 - ry0));
    return Math.min(1, Math.max(crown, cover));
  }, [project, size.w, size.h, reliefBox]);

  // the default view: the whole northern crown of India, centred a little below the middle but never past
  // the relief's edges. The map opens on it, Reset returns to it, and the last step out lands on it.
  const crown = useMemo(() => {
    const [x0, y0] = project([72.3, 37.2])!, [x1, y1] = project([80.6, 32.0])!;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const [[rx0, ry0], [rx1, ry1]] = reliefBox;
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
    const tx = clamp(size.w / 2 - minK * cx, size.w - minK * rx1, -minK * rx0);
    const ty = clamp(size.h / 2 + 45 - minK * cy, size.h - minK * ry1, -minK * ry0);
    return d3.zoomIdentity.translate(tx, ty).scale(minK);
  }, [project, size.w, size.h, minK, reliefBox]);
  // true once the reader has zoomed or panned; until then the panel keeps its opening view while it settles to its size
  const touched = useRef(false);

  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([minK, 28])       // 1 = every dot in view; zoom out further to see the whole crown
      .translateExtent(reliefBox)    // never pan past the shaded relief
      .extent([[0, 0], [size.w, size.h]])
      .clickDistance(5)
      .on("zoom", (e) => { if (e.sourceEvent) touched.current = true; setT(e.transform); });
    zoomRef.current = zoom;
    svg.call(zoom).on("dblclick.zoom", null);
    if (size.w > 200) {
      if (!touched.current) svg.call(zoom.transform, crown);   // the opening view, framed again whenever the panel's size settles
      else { const cur = d3.zoomTransform(svg.node()!); svg.call(zoom.scaleTo, Math.max(cur.k, minK)); }   // a resized panel: never past the relief
    }
    return () => { svg.on(".zoom", null); };
  }, [size.w, size.h, reliefBox, minK, crown]);

  // the map is in km; report the scale so the bar stays true at any zoom
  useEffect(() => {
    if (!props.onScale) return;
    const cx = size.w / 2, cy = size.h / 2;
    const a = project.invert!(t.invert([cx, cy])), b = project.invert!(t.invert([cx + 100, cy]));
    if (a && b) props.onScale((d3.geoDistance(a, b) * 6371) / 100);
  }, [t, project]);

  const svgSel = () => d3.select(svgRef.current!);
  useImperativeHandle(ref, () => ({
    zoomIn: () => { touched.current = true; svgSel().transition().duration(ms(300)).call(zoomRef.current!.scaleBy, 1.6); },
    zoomOut: () => {
      touched.current = true;
      // the last step out frames the whole crown, below the search box and filter bar
      if (t.k / 1.6 <= minK * 1.02) svgSel().transition().duration(ms(400)).call(zoomRef.current!.transform, crown);
      else svgSel().transition().duration(ms(300)).call(zoomRef.current!.scaleBy, 1 / 1.6);
    },
    reset: () => { touched.current = true; svgSel().transition().duration(ms(450)).call(zoomRef.current!.transform, crown); },
    fitTo: ([[w, s], [e, n]], maxScale = 10) => {
      touched.current = true;
      const [x0, y1] = project([w, s])!, [x1, y0] = project([e, n])!;
      const k = Math.max(1, Math.min(maxScale, 0.8 / Math.max((x1 - x0) / size.w, (y1 - y0) / size.h)));
      const next = d3.zoomIdentity.translate(size.w / 2, size.h / 2).scale(k).translate(-(x0 + x1) / 2, -(y0 + y1) / 2);
      svgSel().transition().duration(ms(550)).call(zoomRef.current!.transform, next);
    },
  }), [project, size, t, minK, reliefBox, crown]);

  return (
    <div className="map-canvas" ref={wrap}>
      <svg ref={svgRef} width={size.w} height={size.h} role="img"
        aria-label={`Map of ${region.data.name} with riding circuits`}
        onPointerMove={(e) => { if (props.activeCircuit && !(e.target as Element).closest(".routes .hit")) props.onHoverCircuit(null); }}
        onPointerLeave={() => props.onHoverCircuit(null)}
        onClick={(e) => {
          const el = e.target as Element;
          if (el === svgRef.current || el.tagName === "image" || el.closest(".base") || el.closest(".sat-tiles")) { props.onSelectLocation(null); props.onBackground?.(); }
        }}>
        {props.basemap === "satellite" && <SatelliteTiles key={props.imagery?.tile(1, 0, 0) ?? "esri"} project={project} t={t} size={size}
          url={props.imagery?.tile} maxZoom={props.imagery?.maxZoom} />}
        <g transform={t.toString()} className={props.basemap === "satellite" ? "on-satellite" : undefined}>
          <BaseLayers region={region} path={path} project={project} showClaims={props.showClaims} satellite={props.basemap === "satellite"} onRegion={setHoverRegion} />
          <RouteLayer circuits={region.data.circuits} path={path} visible={props.visible} active={props.activeCircuit}
            onHover={props.onHoverCircuit} onSelect={props.onSelectCircuit} />
        </g>
        {props.basemap === "satellite" && (props.imagery?.roads ?? true) && <SatelliteTiles project={project} t={t} size={size} url={ROADS_TILE} className="sat-tiles sat-roads" />}
        <g className={"cities" + (revealed ? "" : " veiled")} aria-hidden="true">
          {(() => {
            const boxes: number[][] = [];
            return CITIES.filter((c) => c.rank === 1 || t.k >= 0.9).map((c) => {
              const [x, y] = t.apply(project(c.at)!);
              const w = c.name.length * 6.4 + 10;
              if (x < 8 || x > size.w - w - 8 || y < 110 || y > size.h - 60) return null;
              if (boxes.some((b) => x < b[0] + b[2] && x + w > b[0] && Math.abs(y - b[1]) < 14)) return null;
              boxes.push([x, y, w]);
              return <g key={c.name}><circle cx={x} cy={y} r={2.4} /><text x={x + 6} y={y + 0.5}>{c.name}</text></g>;
            });
          })()}
        </g>
        <g className={"states" + (revealed ? "" : " veiled")} aria-hidden="true">
          {STATES.map((c) => {
            const [x, y] = t.apply(project(c.at)!);
            if (x < 40 || x > size.w - 40 || y < 70 || y > size.h - 50) return null;
            return <text key={c.name} x={x} y={y} className={hoverRegion === c.id ? "on" : undefined}>{c.name}</text>;
          })}
        </g>
        <g className={"countries" + (revealed ? "" : " veiled")} aria-hidden="true">
          {COUNTRIES.map((c) => {
            const [x, y] = t.apply(project(c.at)!);
            // slide a little to stay inside the panel; never far from the country itself
            const half = c.name.length * 6.8, cx = Math.min(Math.max(x, half + 10), size.w - half - 10);
            if (Math.abs(cx - x) > 70 || y < 20 || y > size.h - 50) return null;
            return <text key={c.name} x={cx} y={y} className={hoverRegion === c.id ? "on" : undefined}>{c.name}</text>;
          })}
        </g>
        <Compass x={size.w - 38} y={236} />
        <LocationMarkers region={region.data} project={project} transform={t} size={size}
          selected={props.selectedLocation} activeCircuit={props.activeCircuit} visible={props.visible}
          onSelect={props.onSelectLocation} kinds={props.kinds} showAll={props.showAll} fuel={props.fuel} revealed={revealed} stagger={!settled} />
      </svg>
    </div>
  );
});
