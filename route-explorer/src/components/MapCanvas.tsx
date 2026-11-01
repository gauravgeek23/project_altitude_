import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import type { Coord, Region } from "../data/types";
import { styleOf } from "../data/boundaries";
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
  onScale?(kmPerPx: number): void;
}

const reduceMotion = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const ms = (t: number) => (reduceMotion ? 0 : t);

/** Static layers: terrain, rivers, roads, boundaries. Re-rendered only on resize. */
const BaseLayers = memo(function BaseLayers({ region, path, project, showClaims }: {
  region: Region; path: d3.GeoPath; project: d3.GeoProjection; showClaims: boolean;
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
    const by: Record<string, Coord[][]> = { international: [], contested: [], claim: [] };
    for (const b of data.boundaries) by[styleOf(b)].push(b.c);
    return { international: line(by.international), contested: line(by.contested), claim: line(by.claim) };
  }, [path]);
  return (
    <g className="base">
      <image href={region.terrainUrl} x={tl[0]} y={tl[1]} width={br[0] - tl[0]} height={br[1] - tl[1]} preserveAspectRatio="none" />
      {rivers.map((d, w) => <path key={w} className={`river w${w}`} d={d} />)}
      <path className="road primary" d={roads.primary} />
      <path className="road trunk" d={roads.trunk} />
      <path className="road route" d={roads.route} />
      {showClaims && <path className="boundary claim" d={bounds.claim} />}
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
    const pts = region.data.locations.filter((l) => l.lon != null && l.lat != null && l.kind !== "via").map((l) => [l.lon!, l.lat!] as [number, number]);
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

  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 28])          // 1 = every dot in view; no zooming out past it
      .translateExtent(reliefBox)    // never pan past the shaded relief
      .extent([[0, 0], [size.w, size.h]])
      .clickDistance(5)
      .on("zoom", (e) => setT(e.transform));
    zoomRef.current = zoom;
    svg.call(zoom).on("dblclick.zoom", null);
    return () => { svg.on(".zoom", null); };
  }, [size.w, size.h, reliefBox]);

  // the map is in km; report the scale so the bar stays true at any zoom
  useEffect(() => {
    if (!props.onScale) return;
    const cx = size.w / 2, cy = size.h / 2;
    const a = project.invert!(t.invert([cx, cy])), b = project.invert!(t.invert([cx + 100, cy]));
    if (a && b) props.onScale((d3.geoDistance(a, b) * 6371) / 100);
  }, [t, project]);

  const svgSel = () => d3.select(svgRef.current!);
  useImperativeHandle(ref, () => ({
    zoomIn: () => svgSel().transition().duration(ms(300)).call(zoomRef.current!.scaleBy, 1.6),
    zoomOut: () => svgSel().transition().duration(ms(300)).call(zoomRef.current!.scaleBy, 1 / 1.6),
    reset: () => svgSel().transition().duration(ms(450)).call(zoomRef.current!.transform, d3.zoomIdentity),
    fitTo: ([[w, s], [e, n]], maxScale = 10) => {
      const [x0, y1] = project([w, s])!, [x1, y0] = project([e, n])!;
      const k = Math.max(1, Math.min(maxScale, 0.8 / Math.max((x1 - x0) / size.w, (y1 - y0) / size.h)));
      const next = d3.zoomIdentity.translate(size.w / 2, size.h / 2).scale(k).translate(-(x0 + x1) / 2, -(y0 + y1) / 2);
      svgSel().transition().duration(ms(550)).call(zoomRef.current!.transform, next);
    },
  }), [project, size]);

  return (
    <div className="map-canvas" ref={wrap}>
      <svg ref={svgRef} width={size.w} height={size.h} role="img"
        aria-label={`Map of ${region.data.name} with riding circuits`}
        onClick={(e) => { if (e.target === svgRef.current || (e.target as Element).tagName === "image") props.onSelectLocation(null); }}>
        <g transform={t.toString()}>
          <BaseLayers region={region} path={path} project={project} showClaims={props.showClaims} />
          <RouteLayer circuits={region.data.circuits} path={path} visible={props.visible} active={props.activeCircuit}
            onHover={props.onHoverCircuit} onSelect={props.onSelectCircuit} />
        </g>
        <LocationMarkers region={region.data} project={project} transform={t} size={size}
          selected={props.selectedLocation} activeCircuit={props.activeCircuit} visible={props.visible}
          onSelect={props.onSelectLocation} />
      </svg>
    </div>
  );
});
