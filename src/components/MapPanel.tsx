import { useEffect, useRef, useState } from "react";
import { MapCanvas, type MapHandle } from "../map/MapCanvas";
import { MapControls } from "../map/MapControls";
import { DEFAULT_REGION, REGIONS } from "../map/data/regions";
import { PLACES, type CircuitId } from "../content/places";
import "../map/map.css";

interface Props {
  selected: string | null;
  circuit: CircuitId | null;
  onSelect(id: string | null): void;
  onOpenPlace(id: string): void;
}

const region = REGIONS[DEFAULT_REGION];
const ALL = new Set(region.data.circuits.map((c) => c.id));
const byId = Object.fromEntries(PLACES.map((p) => [p.id, p]));

/** The interactive route map built earlier (terrain, roads, four circuits), in the right panel. */
export function MapPanel({ selected, circuit, onSelect, onOpenPlace }: Props) {
  const map = useRef<MapHandle>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [kmPerPx, setKmPerPx] = useState(1);

  // zoom to a place picked anywhere in the guide
  useEffect(() => {
    if (!selected) return;
    const l = region.data.locations.find((x) => x.id === selected);
    if (l?.lon == null || l.lat == null) return;
    const d = 0.4;
    map.current?.fitTo([[l.lon - d, l.lat - d], [l.lon + d, l.lat + d]], 10);
  }, [selected]);

  const sel = selected ? byId[selected] : null;
  return (
    <div className="map-area">
      <MapCanvas ref={map} region={region} visible={ALL} activeCircuit={hover ?? circuit} selectedLocation={selected}
        showClaims={false} onHoverCircuit={setHover} onSelectCircuit={() => undefined}
        onSelectLocation={onSelect} onScale={setKmPerPx} />
      <MapControls kmPerPx={kmPerPx} onZoomIn={() => map.current?.zoomIn()} onZoomOut={() => map.current?.zoomOut()}
        onReset={() => { map.current?.reset(); onSelect(null); }} />
      {sel && (
        <div className="map-card docked">
          <p className="map-card-kind">{sel.kind} · {sel.region}</p>
          <p className="map-card-name">{sel.name}</p>
          <button type="button" className="text-btn" onClick={() => onOpenPlace(sel.id)}>Read about {sel.name} →</button>
        </div>
      )}
      <p className="attribution">Terrain: AWS Terrain Tiles · Roads © OpenStreetMap contributors · Boundaries: Natural Earth</p>
    </div>
  );
}
