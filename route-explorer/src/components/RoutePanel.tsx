import type { MapLocation, RegionData } from "../data/types";
import { gaps } from "../data/circuits";
import { circuitsAt, KIND_LABEL, missingLocations } from "../data/locations";
import { BOUNDARY_LEGEND } from "../data/boundaries";

interface Props {
  region: RegionData;
  regionIds: { id: string; name: string }[];
  visible: Set<string>;
  activeCircuit: string | null;
  selectedCircuit: string | null;
  selectedLocation: string | null;
  showClaims: boolean;
  onRegion(id: string): void;
  onToggle(id: string): void;
  onHoverCircuit(id: string | null): void;
  onSelectCircuit(id: string): void;
  onSelectLocation(id: string | null): void;
  onFocusLocation(id: string): void;
  onShowClaims(v: boolean): void;
}

const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const SOURCE_LABEL = { road: "mapped road", traced: "traced from your map", gap: "joined across a label on your map" } as const;

export function RoutePanel(p: Props) {
  const { region } = p;
  const byId = Object.fromEntries(region.locations.map((l) => [l.id, l])) as Record<string, MapLocation>;
  const loc = p.selectedLocation ? byId[p.selectedLocation] : null;
  const missing = missingLocations(region).filter((l) => l.kind !== "via");
  const sel = region.circuits.find((c) => c.id === p.selectedCircuit) ?? null;
  const Stop = ({ id }: { id: string }) => id && byId[id]
    ? <button type="button" className="link" onClick={() => p.onSelectLocation(id)} disabled={byId[id].lon == null}>{byId[id].name}</button>
    : <span className="junction">junction</span>;
  const traced = region.locations.filter((l) => l.traced);

  return (
    <aside className="panel" aria-label="Circuits and places">
      <header className="panel-head">
        <p className="eyebrow">Route explorer</p>
        {p.regionIds.length > 1 ? (
          <select value={region.id} onChange={(e) => p.onRegion(e.target.value)} aria-label="Region">
            {p.regionIds.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        ) : <h1>{region.name}</h1>}
      </header>

      {loc && (
        <section className="card place" aria-live="polite">
          <div className="place-head">
            <span className={`kind-chip ${loc.kind}` + (loc.accent ? " accent" : "")}>{KIND_LABEL[loc.kind]}</span>
            <button type="button" className="link" onClick={() => p.onSelectLocation(null)} aria-label="Close place details">Close</button>
          </div>
          <h2>{loc.name}{loc.aka && <small> also {loc.aka}</small>}</h2>
          <dl className="facts">
            <div><dt>Height</dt><dd>{loc.elev != null ? `≈ ${fmt(loc.elev)} m` : "–"}</dd></div>
            <div><dt>Position</dt><dd>{loc.lat?.toFixed(3)}° N, {loc.lon?.toFixed(3)}° E</dd></div>
          </dl>
          <p className="on-circuits">
            {circuitsAt(region, loc.id).map((c) => (
              <button key={c.id} type="button" className="chip" style={{ ["--c" as string]: c.color }} onClick={() => p.onSelectCircuit(c.id)}>{c.name}</button>
            ))}
          </p>
          <p className="source">{loc.traced ? "Position: " : "Source: "}{loc.source}. Height read from the terrain model.</p>
          <button type="button" className="ghost" onClick={() => p.onFocusLocation(loc.id)}>Zoom to {loc.name}</button>
        </section>
      )}

      <section>
        <h2 className="section-title">Circuits</h2>
        <ul className="circuits">
          {region.circuits.map((c) => {
            const g = gaps(c).length;
            const on = p.visible.has(c.id);
            return (
              <li key={c.id} className={(p.activeCircuit === c.id ? "active " : "") + (on ? "" : "hidden")}
                onPointerEnter={() => on && p.onHoverCircuit(c.id)} onPointerLeave={() => p.onHoverCircuit(null)}
                style={{ ["--c" as string]: c.color }}>
                <label className="toggle">
                  <input type="checkbox" checked={on} onChange={() => p.onToggle(c.id)} aria-label={`Show ${c.name}`} />
                  <span className="swatch" aria-hidden="true" />
                </label>
                <button type="button" className="circuit-name" aria-pressed={p.selectedCircuit === c.id} onClick={() => p.onSelectCircuit(c.id)}>
                  <span>{c.name}</span>
                  <small>{c.roadKm != null ? `${fmt(c.km)} km · ${Math.round((100 * c.roadKm) / Math.max(c.km, 1))}% on mapped roads` : `${fmt(c.km)} km on mapped roads${g ? ` · ${g} gap${g > 1 ? "s" : ""}` : ""}`}</small>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {sel && (
        <section className="card legs" style={{ ["--c" as string]: sel.color }}>
          <h2>{sel.name}</h2>
          <ol>
            {sel.legs.flatMap((leg) => leg.segments).map((s, i) => (
              <li key={i} className={s.status + " " + (s.source ?? "")}>
                <Stop id={s.from} />
                <span aria-hidden="true"> → </span>
                <Stop id={s.to} />
                {s.status === "ok"
                  ? <span className="km">{fmt(s.km ?? 0)} km · {SOURCE_LABEL[s.source ?? "road"]}{s.note ? ` · ${s.note}` : ""}</span>
                  : <span className="gap">Not drawn: {s.reason}</span>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section>
        <h2 className="section-title">Map layers</h2>
        <ul className="legend">
          {BOUNDARY_LEGEND.map((b) => (
            <li key={b.style}>
              <span className={`lg boundary ${b.style}`} aria-hidden="true" />
              {b.style === "claim"
                ? <label><input type="checkbox" checked={p.showClaims} onChange={(e) => p.onShowClaims(e.target.checked)} /> {b.label}</label>
                : b.label}
            </li>
          ))}
          <li><span className="lg road" aria-hidden="true" />Roads in the datasets</li>
          <li><span className="lg river" aria-hidden="true" />Rivers, traced from the terrain</li>
        </ul>
        <p className="fine">Boundary lines are drawn exactly as Natural Earth publishes them, with its own classes. They are not an official survey of India.</p>
      </section>

      {traced.length > 0 && (
        <section>
          <h2 className="section-title">Placed from your map <span className="count">{traced.length}</span></h2>
          <p className="fine">No dataset this build could reach has these places, so each sits where your reference map puts it, read off the route line beside its label. Expect them to be off by several kilometres.</p>
          <p className="missing">{traced.map((l) => l.name).join(" · ")}</p>
        </section>
      )}
      {missing.length > 0 && (
        <section>
          <h2 className="section-title">Missing data <span className="count">{missing.length}</span></h2>
          <p className="fine">These places have no position from any dataset or from your map, so they are not placed.</p>
          <p className="missing">{missing.map((l) => l.name).join(" · ")}</p>
        </section>
      )}

      <section>
        <h2 className="section-title">Sources</h2>
        <ul className="sources">{region.sources.map((s) => <li key={s.name}><b>{s.name}</b> {s.use}</li>)}</ul>
      </section>
    </aside>
  );
}
