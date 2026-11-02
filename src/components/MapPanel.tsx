import { useEffect, useMemo, useRef, useState } from "react";
import { MapCanvas, type MapHandle } from "../map/MapCanvas";
import { MapControls } from "../map/MapControls";
import { DEFAULT_REGION, REGIONS } from "../map/data/regions";
import { ALL_PLACES, BY_ID, CIRCUIT_META, CIRCUIT_ORDER, TYPE_LABEL } from "../content/places";
import type { CircuitId } from "../content/types";
import "../map/map.css";

interface Props {
  selected: string | null;
  circuit: CircuitId | null;
  onSelect(id: string | null): void;
  onOpenPlace(id: string): void;
  onEmergency(): void;
}

const region = REGIONS[DEFAULT_REGION];
const terrain = Object.fromEntries(region.data.locations.filter((l) => l.elev != null).map((l) => [l.id, l.elev as number]));
const searchable = ALL_PLACES.filter((p) => p.mapId);
const CATEGORIES: { id: string; label: string }[] = [
  { id: "town", label: "Villages & towns" }, { id: "pass", label: "Passes" }, { id: "lake", label: "Lakes" }, { id: "poi", label: "Landmarks" },
];
const fmt = (n: number) => n.toLocaleString("en-IN");

/** The route map in the right panel, with search, circuit toggles, category filters and a place card. */
export function MapPanel({ selected, circuit, onSelect, onOpenPlace, onEmergency }: Props) {
  const map = useRef<MapHandle>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [kmPerPx, setKmPerPx] = useState(1);
  const [visible, setVisible] = useState<Set<string>>(() => new Set(region.data.circuits.map((c) => c.id)));
  const [kinds, setKinds] = useState<Set<string>>(() => new Set(CATEGORIES.map((c) => c.id)));
  const [q, setQ] = useState("");
  const [panel, setPanel] = useState(false);

  // zoom to a place picked anywhere in the guide
  useEffect(() => {
    if (!selected) return;
    const l = region.data.locations.find((x) => x.id === selected);
    if (l?.lon == null || l.lat == null) return;
    const d = 0.4;
    map.current?.fitTo([[l.lon - d, l.lat - d], [l.lon + d, l.lat + d]], 10);
  }, [selected]);
  // a circuit picked in the guide is always shown
  useEffect(() => { if (circuit && !visible.has(circuit)) setVisible((v) => new Set(v).add(circuit)); }, [circuit]);

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
    <div className="map-area">
      <MapCanvas ref={map} region={region} visible={visible} activeCircuit={hover ?? circuit} selectedLocation={selected}
        showClaims={false} onHoverCircuit={setHover} onSelectCircuit={() => undefined} kinds={kinds}
        onSelectLocation={onSelect} onScale={setKmPerPx} />

      <div className="map-search" onPointerDown={(e) => e.stopPropagation()}>
        <div className="search-row">
          <input id="map-search" type="search" placeholder="Search villages, passes, lakes" value={q} onChange={(e) => setQ(e.target.value)}
            aria-label="Search the map" autoComplete="off"
            onKeyDown={(e) => { if (e.key === "Enter" && results[0]) { onSelect(results[0].mapId); setQ(""); } }} />
          <button type="button" className={"filter-btn" + (panel ? " on" : "")} aria-expanded={panel} onClick={() => setPanel(!panel)}>Layers</button>
        </div>
        {results.length > 0 && (
          <ul className="search-results" role="listbox" aria-label="Places">
            {results.map((p) => (
              <li key={p.id}><button type="button" onClick={() => { onSelect(p.mapId); setQ(""); }}>
                <span>{p.name}</span><small>{TYPE_LABEL[p.type]} · {p.region}</small>
              </button></li>
            ))}
          </ul>
        )}
        {panel && (
          <div className="layers">
            <p className="layers-title">Circuits</p>
            <div className="chips">{CIRCUIT_ORDER.map((c) => (
              <button key={c} type="button" className={"chip" + (visible.has(c) ? " on" : "")} aria-pressed={visible.has(c)} style={{ ["--c" as string]: CIRCUIT_META[c].color }}
                onClick={() => toggle(visible, c, setVisible)}><span className="dot" />{CIRCUIT_META[c].name}</button>
            ))}</div>
            <p className="layers-title">Show</p>
            <div className="chips">{CATEGORIES.map((c) => (
              <button key={c.id} type="button" className={"chip" + (kinds.has(c.id) ? " on" : "")} aria-pressed={kinds.has(c.id)}
                onClick={() => toggle(kinds, c.id, setKinds)}>{c.label}</button>
            ))}</div>
            <p className="layers-note">Food, stays, fuel and medical layers will appear once listings are verified.</p>
          </div>
        )}
      </div>

      <MapControls kmPerPx={kmPerPx} onZoomIn={() => map.current?.zoomIn()} onZoomOut={() => map.current?.zoomOut()}
        onReset={() => { map.current?.reset(); onSelect(null); }} />
      <button type="button" className="sos" onClick={onEmergency} aria-label="Emergency information">SOS</button>

      {sel && (
        <div className="map-card docked" role="dialog" aria-label={sel.name}>
          <div className="map-card-top">
            <p className="map-card-kind">{TYPE_LABEL[sel.type]} · {sel.region}</p>
            <button type="button" className="close" onClick={() => onSelect(null)} aria-label="Close">✕</button>
          </div>
          <p className="map-card-name">{sel.name}{sel.aka && <small> {sel.aka}</small>}</p>
          <p className="map-card-meta">
            {elev != null ? <>≈ {fmt(elev)} m · {fmt(Math.round(elev * 3.28084))} ft <small>terrain model</small></> : "Elevation not verified"}
          </p>
          <p className="map-card-circuits">{sel.circuits.map((c) => <span key={c} className="chip mini" style={{ ["--c" as string]: CIRCUIT_META[c].color }}><span className="dot" />{CIRCUIT_META[c].name}</span>)}</p>
          <p className="map-card-text">{sel.summary}</p>
          {sel.access && <p className="map-card-warn">Access restrictions apply. Check before planning.</p>}
          <button type="button" className="text-btn" onClick={() => onOpenPlace(sel.id)}>Open the full entry →</button>
        </div>
      )}
      <p className="route-note">Routes are drawn for planning, not live road status.</p>
      <p className="attribution">Terrain: AWS Terrain Tiles · Roads © OpenStreetMap contributors · Boundaries: Natural Earth</p>
    </div>
  );
}
