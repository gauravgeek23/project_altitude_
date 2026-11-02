import { useEffect, useMemo, useRef, useState } from "react";
import { MapCanvas, type MapHandle } from "../map/MapCanvas";
import { MapControls } from "../map/MapControls";
import { DEFAULT_REGION, REGIONS } from "../map/data/regions";
import { ALL_PLACES, BY_ID, CIRCUIT_META, CIRCUIT_ORDER, TYPE_LABEL } from "../content/places";
import { FilterIcon, PlaceIcon } from "./icons";
import { FUEL_AT } from "../content/fuel";
import { BASEMAPS, BASEMAP_BY_ID, googleSessionToken, type BasemapId } from "../map/basemaps";
import { PlacePhoto } from "./PlacePhoto";
import type { CircuitId } from "../content/types";
import "../map/map.css";

interface Props {
  selected: string | null;
  circuit: CircuitId | null;
  onCircuit(id: CircuitId | null): void;
  onSelect(id: string | null): void;
  onOpenPlace(id: string): void;
  onEmergency(): void;
}

const region = REGIONS[DEFAULT_REGION];
const terrain = Object.fromEntries(region.data.locations.filter((l) => l.elev != null).map((l) => [l.id, l.elev as number]));
const placed = new Set(region.data.locations.filter((l) => l.lon != null).map((l) => l.id));
const searchable = ALL_PLACES.filter((p) => p.mapId && placed.has(p.mapId));
const CATEGORIES: { id: string; label: string }[] = [
  { id: "town", label: "Villages & towns" }, { id: "pass", label: "Passes" }, { id: "peak", label: "Peaks" }, { id: "lake", label: "Lakes" }, { id: "poi", label: "Landmarks" }, { id: "monastery", label: "Monasteries" },
];
const fmt = (n: number) => n.toLocaleString("en-IN");
const ALL_CIRCUITS = new Set(region.data.circuits.map((c) => c.id));
// each circuit's extent, for zooming to it when it is picked
const CIRCUIT_BOUNDS = Object.fromEntries(region.data.circuits.map((c) => {
  const pts = c.legs.flatMap((l) => l.segments.flatMap((s) => s.coords ?? []));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return [c.id, [[Math.min(...xs), Math.min(...ys)], [Math.max(...xs), Math.max(...ys)]] as [[number, number], [number, number]]];
}));

/** The route map in the right panel, with search, circuit toggles, category filters and a place card. */
export function MapPanel({ selected, circuit, onCircuit, onSelect, onOpenPlace, onEmergency }: Props) {
  const map = useRef<MapHandle>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [kmPerPx, setKmPerPx] = useState(1);
  const [kinds, setKinds] = useState<Set<string>>(() => new Set(CATEGORIES.map((c) => c.id)));
  const [q, setQ] = useState("");
  const [panel, setPanel] = useState(false);
  const [fuel, setFuel] = useState(false);
  const [base, setBase] = useState<BasemapId>("terrain");
  const [lastSat, setLastSat] = useState<BasemapId>("esri");
  const [session, setSession] = useState<string | null>(null);
  const satellite = base !== "terrain";
  const chooseBase = (id: BasemapId) => { setBase(id); if (id !== "terrain") setLastSat(id); };
  useEffect(() => { if (base === "google" && !session) googleSessionToken().then(setSession); }, [base]);
  const bm = BASEMAP_BY_ID[base];
  const imagery = useMemo(() => {
    if (!satellite || !bm.tile || (base === "google" && !session)) return undefined;
    // Google's labels already include roads; the others get Esri's road overlay
    return { tile: (z: number, x: number, y: number) => bm.tile!(z, x, y, session ?? undefined), maxZoom: bm.maxZoom, roads: base !== "google" };
  }, [base, session]);

  // zoom to a place picked anywhere in the guide
  useEffect(() => {
    if (!selected) return;
    const l = region.data.locations.find((x) => x.id === selected);
    if (l?.lon == null || l.lat == null) return;
    const d = 0.4;
    map.current?.fitTo([[l.lon - d, l.lat - d], [l.lon + d, l.lat + d]], 10);
  }, [selected]);
  // a picked circuit (here or in the guide) is shown on its own and framed; none picked shows all four
  useEffect(() => {
    if (circuit) map.current?.fitTo(CIRCUIT_BOUNDS[circuit], 6);
  }, [circuit]);
  const visible = useMemo(() => (circuit ? new Set<string>([circuit]) : ALL_CIRCUITS), [circuit]);
  const pick = (id: CircuitId | null) => {
    if (id === circuit) id = null;
    onCircuit(id);
    if (!id) map.current?.reset();
  };

  // names that start with the query first, then names containing it, then region matches
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    const score = (p: (typeof searchable)[number]) => {
      const n = (p.name + " " + (p.aka ?? "")).toLowerCase();
      return n.startsWith(t) || n.includes(" " + t) ? 0 : n.includes(t) ? 1 : p.region.toLowerCase().includes(t) ? 2 : 9;
    };
    return searchable.map((p) => [score(p), p] as const).filter(([s]) => s < 9).sort((a, b) => a[0] - b[0]).map(([, p]) => p).slice(0, 7);
  }, [q]);
  const toggle = (set: Set<string>, id: string, f: (s: Set<string>) => void) => { const n = new Set(set); n.has(id) ? n.delete(id) : n.add(id); f(n); };

  const sel = selected ? BY_ID[selected] : null;
  const elev = selected ? terrain[selected] : undefined;
  return (
    <div className={"map-area" + (satellite ? " sat" : "")}>
      <MapCanvas ref={map} region={region} visible={visible} activeCircuit={circuit ?? hover} selectedLocation={selected}
        showClaims={false} onHoverCircuit={setHover} onSelectCircuit={(id) => { if (id !== circuit) pick(id as CircuitId); }} kinds={kinds} fuel={fuel}
        onSelectLocation={onSelect} onScale={setKmPerPx}
        onBackground={() => { if (circuit) pick(null); }} basemap={satellite && (base !== "google" || session) ? "satellite" : "terrain"} imagery={imagery} />

      <div className="circuit-filter" role="toolbar" aria-label="Show circuits" onPointerDown={(e) => e.stopPropagation()}>
        <button type="button" className={"cf" + (!circuit ? " on" : "")} aria-pressed={!circuit} onClick={() => pick(null)}>All</button>
        {CIRCUIT_ORDER.map((c) => (
          <button key={c} type="button" className={"cf" + (circuit === c ? " on" : "")} aria-pressed={circuit === c}
            style={{ ["--c" as string]: CIRCUIT_META[c].color }} onClick={() => pick(c)}
            onPointerEnter={() => setHover(c)} onPointerLeave={() => setHover(null)}>
            <span className="dot" />{CIRCUIT_META[c].name}
          </button>
        ))}
      </div>

      <div className="map-search" onPointerDown={(e) => e.stopPropagation()}>
        <div className="search-row">
          <input id="map-search" type="search" placeholder="Search villages, passes, lakes" value={q} onChange={(e) => setQ(e.target.value)}
            aria-label="Search the map" autoComplete="off"
            onKeyDown={(e) => { if (e.key === "Enter" && results[0]) { onSelect(results[0].mapId); setQ(""); } }} />
          <button type="button" className={"sq-btn" + (panel ? " on" : "")} aria-expanded={panel} aria-label="Filters" title="Filters" onClick={() => setPanel(!panel)}><FilterIcon size={17} /></button>
          <button type="button" className={"sq-btn" + (fuel ? " on" : "")} aria-pressed={fuel} aria-label="Petrol pumps" title={fuel ? "Hide petrol pumps" : "Show petrol pumps"} onClick={() => setFuel(!fuel)}><PlaceIcon kind="fuel" size={17} /></button>
        </div>
        {results.length > 0 && (
          <ul className="search-results" role="listbox" aria-label="Places">
            {results.map((p) => (
              <li key={p.id}><button type="button" onClick={() => { onSelect(p.mapId); setQ(""); }}>
                <span className={`type-icon ${p.type}`}><PlaceIcon kind={p.type} size={14} /></span>
                <span className="sr-name">{p.name}<small>{TYPE_LABEL[p.type]} · {p.region}</small></span>
              </button></li>
            ))}
          </ul>
        )}
        {panel && (
          <div className="layers">
            <p className="layers-title">Map</p>
            <div className="chips">{BASEMAPS.filter((b) => b.available).map((b) => (
              <button key={b.id} type="button" className={"chip" + (base === b.id ? " on" : "")} aria-pressed={base === b.id} onClick={() => chooseBase(b.id)}>{b.label}</button>
            ))}</div>
            <p className="layers-note">{bm.note}{BASEMAPS.some((b) => !b.available) && " More sources (MapTiler, Mapbox, Google) appear once their keys are set; see docs/SPEC.md."}</p>
            <p className="layers-title">Show</p>
            <div className="chips">{CATEGORIES.map((c) => (
              <button key={c.id} type="button" className={"chip" + (kinds.has(c.id) ? " on" : "")} aria-pressed={kinds.has(c.id)}
                onClick={() => toggle(kinds, c.id, setKinds)}>{c.label}</button>
            ))}</div>
            <p className="layers-note">The pump button beside Filters shows the petrol pumps. Food, stays and medical layers will appear once listings are verified.</p>
          </div>
        )}
      </div>

      <MapControls kmPerPx={kmPerPx} satellite={satellite} onSatellite={() => chooseBase(satellite ? "terrain" : lastSat)} onZoomIn={() => map.current?.zoomIn()} onZoomOut={() => map.current?.zoomOut()}
        onReset={() => { map.current?.reset(); onSelect(null); onCircuit(null); }} />
      <button type="button" className="sos" onClick={onEmergency} aria-label="Emergency information">SOS</button>

      {sel && (
        <div className="map-card docked" role="dialog" aria-label={sel.name}>
          <div className="map-card-top">
            <p className="map-card-kind"><span className={`type-icon ${sel.type}`}><PlaceIcon kind={sel.type} size={13} /></span>{TYPE_LABEL[sel.type]} · {sel.region}</p>
            <button type="button" className="close" onClick={() => onSelect(null)} aria-label="Close">✕</button>
          </div>
          <PlacePhoto id={sel.id} alt={sel.name} className="place-photo map-photo" />
          <p className="map-card-name">{sel.name}{sel.aka && <small> {sel.aka}</small>}</p>
          <p className="map-card-meta">
            {elev != null ? <>≈ {fmt(elev)} m · {fmt(Math.round(elev * 3.28084))} ft <small>terrain model</small></> : "Elevation not verified"}
          </p>
          <p className="map-card-circuits">{sel.circuits.map((c) => <span key={c} className="chip mini" style={{ ["--c" as string]: CIRCUIT_META[c].color }}><span className="dot" />{CIRCUIT_META[c].name}</span>)}</p>
          <p className="map-card-text">{sel.summary}</p>
          {(sel.practical.fuel || FUEL_AT.has(sel.id)) && (
            <p className="map-card-fuel"><span className="type-icon fuel"><PlaceIcon kind="fuel" size={13} /></span><span>{sel.practical.fuel ?? FUEL_AT.get(sel.id)!.note}</span></p>
          )}
          {sel.access && <p className="map-card-warn">Access restrictions apply. Check before planning.</p>}
          <button type="button" className="text-btn" onClick={() => onOpenPlace(sel.id)}>Open the full entry →</button>
        </div>
      )}
      <p className="route-note">Routes are drawn for planning, not live road status.</p>
      <p className="attribution">{bm.attribution} · Roads © OpenStreetMap contributors · Boundaries: Natural Earth</p>
    </div>
  );
}
