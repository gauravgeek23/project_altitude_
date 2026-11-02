import { RefreshIcon, SatelliteIcon } from "../components/icons";

interface Props {
  satellite: boolean;
  onSatellite(): void;
  onZoomIn(): void;
  onZoomOut(): void;
  onReset(): void;
  kmPerPx: number;
}

/** Zoom buttons and a scale bar that stays true at every zoom level. */
export function MapControls({ onZoomIn, onZoomOut, onReset, kmPerPx, satellite, onSatellite }: Props) {
  const nice = [1, 2, 5, 10, 20, 25, 50, 100, 200];
  const km = nice.find((n) => n / kmPerPx >= 70) ?? 200;
  return (
    <>
      <div className="map-controls" role="group" aria-label="Map zoom">
        <button type="button" onClick={onZoomIn} aria-label="Zoom in">+</button>
        <button type="button" onClick={onZoomOut} aria-label="Zoom out">−</button>
        <button type="button" onClick={onReset} aria-label="Reset view" title="Reset view" className="reset"><RefreshIcon size={17} /></button>
        <button type="button" onClick={onSatellite} aria-pressed={satellite} title={satellite ? "Show terrain" : "Show satellite view"}
          aria-label={satellite ? "Show terrain" : "Show satellite view"} className={"sat" + (satellite ? " on" : "")}><SatelliteIcon size={17} /></button>
      </div>
      <div className="scale-bar" aria-label={`Scale: bar is ${km} km`}>
        <span style={{ width: `${km / kmPerPx}px` }} />
        <b>{km} km</b>
      </div>
    </>
  );
}
