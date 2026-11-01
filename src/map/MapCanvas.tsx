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

  // Mercator fitted to the region's bbox: geographically proportionate, north up.
  const project = useMemo(() => {
    const [W, S, E, N] = region.data.bbox;
    const pad = 12;
    return d3.geoMercator().fitExtent([[pad, pad], [size.w - pad, size.h - pad]], { type: "MultiPoint", coordinates: [[W, S], [E, N], [W, N], [E, S]] });
  }, [region, size.w, size.h]);
  const path = useMemo(() => d3.geoPath(project), [project]);

  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 28])
      .translateExtent([[-size.w * 0.25, -size.h * 0.25], [size.w * 1.25, size.h * 1.25]])
      .extent([[0, 0], [size.w, size.h]])
      .clickDistance(5)
      .on("zoom", (e) => setT(e.transform));
    zoomRef.current = zoom;
    svg.call(zoom).on("dblclick.zoom", null);
    return () => { svg.on(".zoom", null); };
  }, [size.w, size.h]);

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
