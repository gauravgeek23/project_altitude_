interface Props {
  onZoomIn(): void;
  onZoomOut(): void;
  onReset(): void;
  kmPerPx: number;
}

/** Zoom buttons and a scale bar that stays true at every zoom level. */
export function MapControls({ onZoomIn, onZoomOut, onReset, kmPerPx }: Props) {
  const nice = [1, 2, 5, 10, 20, 25, 50, 100, 200];
  const km = nice.find((n) => n / kmPerPx >= 70) ?? 200;
  return (
    <>
      <div className="map-controls" role="group" aria-label="Map zoom">
        <button type="button" onClick={onZoomIn} aria-label="Zoom in">+</button>
        <button type="button" onClick={onZoomOut} aria-label="Zoom out">−</button>
        <button type="button" onClick={onReset} aria-label="Reset view" className="reset">Reset</button>
      </div>
      <div className="scale-bar" aria-label={`Scale: bar is ${km} km`}>
        <span style={{ width: `${km / kmPerPx}px` }} />
        <b>{km} km</b>
      </div>
    </>
  );
}
