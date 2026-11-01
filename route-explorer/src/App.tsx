import { useMemo, useRef, useState } from "react";
import { MapCanvas, type MapHandle } from "./components/MapCanvas";
import { MapControls } from "./components/MapControls";
import { RoutePanel } from "./components/RoutePanel";
import { DEFAULT_REGION, REGIONS } from "./data/regions";
import { circuitBounds } from "./data/circuits";

export default function App() {
  const [regionId, setRegionId] = useState(DEFAULT_REGION);
  const region = REGIONS[regionId];
  const [visible, setVisible] = useState(() => new Set(region.data.circuits.map((c) => c.id)));
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [place, setPlace] = useState<string | null>(null);
  const [showClaims, setShowClaims] = useState(false);
  const [kmPerPx, setKmPerPx] = useState(1);
  const map = useRef<MapHandle>(null);
  const regionIds = useMemo(() => Object.entries(REGIONS).map(([id, r]) => ({ id, name: r.data.name })), []);

  const active = (hovered && visible.has(hovered) ? hovered : null) ?? selected;
  const toggle = (id: string) => setVisible((v) => {
    const n = new Set(v);
    if (n.has(id)) { n.delete(id); if (selected === id) setSelected(null); if (hovered === id) setHovered(null); } else n.add(id);
    return n;
  });
  const selectCircuit = (id: string) => {
    if (selected === id) { setSelected(null); return; }
    setSelected(id);
    setVisible((v) => new Set(v).add(id));
    const c = region.data.circuits.find((x) => x.id === id)!;
    const b = circuitBounds(c);
    if (b) map.current?.fitTo(b, 6);
  };
  const focusPlace = (id: string) => {
    const l = region.data.locations.find((x) => x.id === id);
    if (l?.lon == null || l.lat == null) return;
    const d = 0.35;
    map.current?.fitTo([[l.lon - d, l.lat - d], [l.lon + d, l.lat + d]], 14);
  };
  const changeRegion = (id: string) => {
    setRegionId(id); setSelected(null); setPlace(null);
    setVisible(new Set(REGIONS[id].data.circuits.map((c) => c.id)));
  };

  return (
    <div className="app">
      <main className="map-area">
        <MapCanvas ref={map} region={region} visible={visible} activeCircuit={active} selectedLocation={place}
          showClaims={showClaims} onHoverCircuit={setHovered} onSelectCircuit={selectCircuit}
          onSelectLocation={setPlace} onScale={setKmPerPx} />
        <MapControls kmPerPx={kmPerPx} onZoomIn={() => map.current?.zoomIn()} onZoomOut={() => map.current?.zoomOut()}
          onReset={() => { map.current?.reset(); setSelected(null); }} />
        <p className="attribution">Terrain: AWS Terrain Tiles · Roads © OpenStreetMap contributors, scroll-route-demo · Boundaries: Natural Earth</p>
      </main>
      <RoutePanel region={region.data} regionIds={regionIds} visible={visible} activeCircuit={active}
        selectedCircuit={selected} selectedLocation={place} showClaims={showClaims}
        onRegion={changeRegion} onToggle={toggle} onHoverCircuit={setHovered} onSelectCircuit={selectCircuit}
        onSelectLocation={setPlace} onFocusLocation={focusPlace} onShowClaims={setShowClaims} />
    </div>
  );
}
