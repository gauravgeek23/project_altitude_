import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ALL_PLACES, BY_ID, CIRCUIT_META, CIRCUIT_ORDER, PASSES, PEAKS, PLACES, PRACTICAL_LABEL, TYPE_LABEL } from "../content/places";
import { PlaceIcon } from "./icons";
import { PlacePhoto } from "./PlacePhoto";
import type { CircuitId, PlaceRecord, Practical } from "../content/types";
import * as G from "../content/guide";
import { REGIONS, DEFAULT_REGION } from "../map/data/regions";
import type { TabId } from "../nav";

export interface TabProps {
  selected: string | null;
  onPlace(id: string): void;
  onCircuit(id: CircuitId | null): void;
  onTab(id: TabId): void;
}

/* ------------------------------------------------------------------ shared helpers */
const region = REGIONS[DEFAULT_REGION].data;
const terrain = Object.fromEntries(region.locations.filter((l) => l.elev != null).map((l) => [l.id, l.elev as number]));
const onMap = new Set(region.locations.filter((l) => l.lon != null).map((l) => l.id));
const circuitKm = Object.fromEntries(region.circuits.map((c) => [c.id, c.km]));
const fmt = (n: number) => n.toLocaleString("en-IN");
const ft = (m: number) => Math.round(m * 3.28084);
const store = {
  get<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

function Head({ eyebrow = "TL;DR", title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="tldr">
      <p className="eyebrow-sm">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      {children}
    </header>
  );
}
const Paras = ({ items }: { items: string[] }) => <>{items.map((t) => <p key={t} className="para">{t}</p>)}</>;
const Rule = ({ children }: { children: ReactNode }) => <p className="rule-line">{children}</p>;
const Section = ({ title, children, id }: { title: string; children: ReactNode; id?: string }) => (
  <section className="block" id={id}><h2>{title}</h2>{children}</section>
);
const Badge = ({ kind, children }: { kind: "verify" | "editorial" | "warn" | "ok"; children: ReactNode }) => <span className={`badge ${kind}`}>{children}</span>;
const Dots = ({ ids }: { ids: CircuitId[] }) => (
  <span className="circuit-dots" aria-label={"On " + ids.map((x) => CIRCUIT_META[x].name).join(", ")}>
    {ids.map((x) => <span key={x} className="dot" style={{ ["--c" as string]: CIRCUIT_META[x].color }} />)}
  </span>
);
const PlaceLink = ({ id, onPlace }: { id: string; onPlace(id: string): void }) => {
  const p = BY_ID[id];
  if (!p) return null;
  return p.mapId ? <button type="button" className="place-link" onClick={() => onPlace(p.mapId!)}>{p.name}</button> : <span className="place-plain">{p.name}</span>;
};
function Elevation({ p }: { p: PlaceRecord }) {
  if (p.elevation_m) return <>{fmt(p.elevation_m)} m · {fmt(ft(p.elevation_m))} ft</>;
  const t = p.mapId ? terrain[p.mapId] : undefined;
  return t ? <>≈ {fmt(t)} m · {fmt(ft(t))} ft <small className="muted">terrain model, official figure not verified</small></> : <span className="unknown">Not verified</span>;
}
function CircuitChips({ value, onChange, all = true }: { value: CircuitId | "all"; onChange(v: CircuitId | "all"): void; all?: boolean }) {
  return (
    <div className="chips" role="group" aria-label="Filter by circuit">
      {all && <button type="button" className={"chip" + (value === "all" ? " on" : "")} aria-pressed={value === "all"} onClick={() => onChange("all")}>All circuits</button>}
      {CIRCUIT_ORDER.map((id) => (
        <button key={id} type="button" className={"chip" + (value === id ? " on" : "")} aria-pressed={value === id} style={{ ["--c" as string]: CIRCUIT_META[id].color }} onClick={() => onChange(id)}>
          <span className="dot" />{CIRCUIT_META[id].name}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ About */
function Note({ onTab }: TabProps) {
  return (
    <>
      <Head eyebrow="A note" title={G.NOTE.title} />
      <Paras items={G.NOTE.body} />
      <Rule>{G.NOTE.signoff}</Rule>
      <div className="next-links">
        <button type="button" className="text-btn" onClick={() => onTab("circuits")}>Pick a circuit →</button>
        <button type="button" className="text-btn" onClick={() => onTab("how")}>How to use this guide →</button>
        <button type="button" className="text-btn" onClick={() => onTab("emergency")}>Read Emergency first →</button>
      </div>
    </>
  );
}
function Stats() {
  return (
    <dl className="stats">
      <div><dt>Distance</dt><dd>{G.EXPEDITION.km}</dd></div>
      <div><dt>Passes</dt><dd>{G.EXPEDITION.passes}</dd></div>
      <div><dt>Circuits</dt><dd>{G.EXPEDITION.circuits}</dd></div>
      <div><dt>Summit</dt><dd>{G.EXPEDITION.summit}</dd></div>
    </dl>
  );
}
function Story() {
  return (
    <>
      <Head eyebrow="Story" title={G.STORY.title}><p className="lead">{G.STORY.lead}</p></Head>
      <Stats />
      <Paras items={G.STORY.body} />
      <Rule>{G.STORY.signoff}</Rule>
    </>
  );
}
function HowTo() {
  return (
    <>
      <Head eyebrow="How to use" title={G.HOW_TO.title}><p className="lead">{G.HOW_TO.lead}</p></Head>
      <ol className="numbered">
        {G.HOW_TO.steps.map((s) => <li key={s.n}><span className="num">{s.n}</span><div><h3>{s.title}</h3><p>{s.body}</p></div></li>)}
      </ol>
      <p className="callout"><b>A quick tip.</b> {G.HOW_TO.tip}</p>
      <Section title="What the map shows">
        <p className="para">The coloured lines show the circuits as drawn for exploration. Where a road exists in the map data, the line follows it; elsewhere it follows the circuit map by hand. A line on the map is not a statement that a road is open, safe or permitted today.</p>
      </Section>
    </>
  );
}
function Credits() {
  return (
    <>
      <Head eyebrow="Credits" title={G.CREDITS.title}><p className="lead">{G.CREDITS.lead}</p></Head>
      <Section title="Map and terrain data">
        <div className="table">
          {G.CREDITS.data.map((d) => (
            <div key={d.name}><dt>{d.name}</dt><dd>{d.use}. <span className="muted">Licence: {d.licence}.</span> <a href={d.link} target="_blank" rel="noreferrer">Source</a></dd></div>
          ))}
        </div>
      </Section>
      <Section title="Research and travel information"><ul className="bullets">{G.CREDITS.research.map((r) => <li key={r}>{r}</li>)}</ul></Section>
      <Section title="The project"><p className="para">{G.CREDITS.project}</p></Section>
      <p className="callout">{G.CREDITS.disclaimer}</p>
    </>
  );
}

/* ------------------------------------------------------------------ Villages & passes */
function Practicals({ p }: { p: PlaceRecord }) {
  const keys = Object.keys(PRACTICAL_LABEL) as (keyof Practical)[];
  const known = keys.filter((k) => p.practical[k]).length;
  return (
    <details className="practicals">
      <summary>
        <span>Practical details</span>
        <span className="practicals-count">{known ? `${known} of ${keys.length} filled` : "Not verified yet"}</span>
      </summary>
      <dl className="facts-grid">
        <div><dt>Elevation</dt><dd><Elevation p={p} /></dd></div>
        {keys.map((k) => <div key={k}><dt>{PRACTICAL_LABEL[k]}</dt><dd>{p.practical[k] ?? <span className="unknown">Not verified</span>}</dd></div>)}
      </dl>
    </details>
  );
}
const STATUS = {
  verified: { kind: "ok", label: "Verified" }, sourced: { kind: "ok", label: "From published sources" },
  editorial: { kind: "editorial", label: "Editorial" }, needs_verification: { kind: "verify", label: "Needs verification" },
} as const;
function PlaceCard({ p, open, onPlace, innerRef }: { p: PlaceRecord; open: boolean; onPlace(id: string): void; innerRef?: (el: HTMLDetailsElement | null) => void }) {
  const [isOpen, setOpen] = useState(open);
  useEffect(() => { if (open) setOpen(true); }, [open]);
  return (
    <details ref={innerRef} className={"card place" + (open ? " selected" : "")} id={`place-${p.id}`} open={open || undefined}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
      <summary>
        <span className="card-title">{p.name}{p.aka && <small className="muted"> {p.aka}</small>}</span>
        <span className="card-marks"><span className={`type-icon ${p.type}`} title={TYPE_LABEL[p.type]}><PlaceIcon kind={p.type} size={15} title={TYPE_LABEL[p.type]} /></span><Dots ids={p.circuits} /></span>
        <span className="meta">{TYPE_LABEL[p.type]} · {p.region}</span>
        <span className="summary-text">{p.summary}</span>
        {p.access && <span className="access-flag"><Badge kind="warn">Access</Badge> Restrictions apply</span>}
      </summary>
      <div className="card-body">
        {isOpen && <PlacePhoto id={p.id} alt={p.name} />}
        {p.why && <p><b>Why stop.</b> {p.why}</p>}
        {p.access && <p className="warn-text"><b>Access.</b> {p.access}</p>}
        <Practicals p={p} />
        {p.neighbours.length > 0 && <p className="near"><b>Nearby stops.</b> {p.neighbours.map((n, i) => <span key={n}>{i > 0 && " · "}<PlaceLink id={n} onPlace={onPlace} /></span>)}</p>}
        <div className="card-foot">
          {p.mapId && onMap.has(p.mapId) ? <button type="button" className="text-btn" onClick={() => onPlace(p.mapId!)}>Show on map →</button> : <span className="muted">Not on the map yet: position to be sourced</span>}
          <span className="verify-line"><Badge kind={STATUS[p.status].kind}>{STATUS[p.status].label}</Badge> {p.status === "sourced" ? `Checked online ${p.last_verified}` : `Last verified: ${p.last_verified ?? "not yet"}`}</span>
        </div>
        {p.sources.length > 0 && (
          <p className="sources-line">Sources: {p.sources.map((s, i) => <span key={s.url}>{i > 0 && " · "}<a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></span>)}. Not field-verified; confirm locally.</p>
        )}
      </div>
    </details>
  );
}
function Directory({ records, selected, onPlace, label }: { records: PlaceRecord[]; selected: string | null; onPlace(id: string): void; label: string }) {
  const [q, setQ] = useState("");
  const [c, setC] = useState<CircuitId | "all">("all");
  const refs = useRef<Record<string, HTMLDetailsElement | null>>({});
  useEffect(() => {
    if (!selected || !records.some((r) => r.id === selected)) return;
    setQ(""); setC("all");
    requestAnimationFrame(() => {
      const el = refs.current[selected];
      if (el) { el.open = true; el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }
    });
  }, [selected]);
  const list = records.filter((p) => (c === "all" || p.circuits.includes(c)) &&
    (!q || (p.name + " " + (p.aka ?? "") + " " + p.region + " " + p.summary).toLowerCase().includes(q.toLowerCase())));
  const groups = c === "all" ? CIRCUIT_ORDER.map((id) => ({ id, items: list.filter((p) => p.circuits[0] === id) })) : [{ id: c, items: list }];
  return (
    <>
      <div className="filters">
        <input id={`search-${label}`} type="search" placeholder={`Search ${label} by name or valley`} value={q} onChange={(e) => setQ(e.target.value)} aria-label={`Search ${label}`} />
        <CircuitChips value={c} onChange={setC} />
      </div>
      <p className="count-line">{list.length} {label}</p>
      {groups.map((g) => g.items.length > 0 && (
        <section key={g.id} className="dir-group">
          <h2 className="group-title" style={{ ["--c" as string]: CIRCUIT_META[g.id].color }}><span className="bar" />{CIRCUIT_META[g.id].name}</h2>
          <div className="cards">{g.items.map((p) => <PlaceCard key={p.id} p={p} open={p.id === selected} onPlace={onPlace} innerRef={(el) => (refs.current[p.id] = el)} />)}</div>
        </section>
      ))}
      {!list.length && <p className="empty">Nothing matches. Clear the search or pick another circuit.</p>}
    </>
  );
}
function Villages({ selected, onPlace }: TabProps) {
  const [circuitNotes, setCircuitNotes] = useState<CircuitId>("zanskar");
  return (
    <>
      <Head eyebrow="Villages" title="Settlements along the circuits">
        <p className="lead">A searchable index of the villages, towns, lakes and landmarks along the four circuits. Each card keeps the same fields; anything not yet checked says "Not verified" instead of guessing.</p>
      </Head>
      <Directory records={PLACES} selected={selected} onPlace={onPlace} label="places" />
      <Section title="Route notes">
        <CircuitChips value={circuitNotes} onChange={(v) => v !== "all" && setCircuitNotes(v)} all={false} />
        <p className="para muted">{CIRCUIT_META[circuitNotes].character}</p>
        <ul className="bullets">{G.ROUTE_NOTES[circuitNotes].map((n) => <li key={n}>{n}</li>)}</ul>
      </Section>
    </>
  );
}
function Passes({ selected, onPlace }: TabProps) {
  return (
    <>
      <Head eyebrow="Passes & peaks" title="The passes that define the ride">
        <p className="lead">High passes are the backbone of Project Altitude. Official elevations are shown only once verified; until then, the card gives the terrain model's reading, in metres and feet, clearly marked.</p>
      </Head>
      <p className="callout"><b>Road status: unknown here.</b> Nothing on this page is live. Check official advisories for the current status of every pass before you ride it.</p>
      <Directory records={PASSES} selected={selected} onPlace={onPlace} label="passes" />
      <Section title="Peaks">
        <p className="para muted">The big summits you see from the road. Not riding objectives: they are here so you can name what's on the skyline. Heights are the terrain model's reading; positions are approximate.</p>
        <Directory records={PEAKS} selected={selected} onPlace={onPlace} label="peaks" />
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ Food & stays */
function Food() {
  return (
    <>
      <Head eyebrow="Eat & drink" title={G.FOOD.title} />
      <Paras items={G.FOOD.body} />
      <Rule>{G.FOOD.rule}</Rule>
      <Section title="Dishes of the region">
        <div className="dishes">{G.DISHES.map((d) => (
          <article key={d.id} className="card dish">
            <PlacePhoto id={d.id} alt={d.name} className="place-photo dish-photo" />
            <p className="card-title"><span className="type-icon food"><PlaceIcon kind="food" size={14} /></span>{d.name}</p>
            <p className="muted">{d.where}</p>
            <p>{d.body}</p>
          </article>
        ))}</div>
      </Section>
      <Section title="What to look for">
        <div className="cards grid">{G.FOOD.categories.map((c) => <article key={c.name} className="card"><p className="card-title">{c.name}</p><p>{c.body}</p></article>)}</div>
      </Section>
      <Section title="Food planning by circuit">
        <div className="table">{G.FOOD.byCircuit.map((r) => <div key={r.circuit}><dt><Dots ids={[r.circuit]} /> {CIRCUIT_META[r.circuit].name}</dt><dd><b>{r.base}.</b> {r.advice}</dd></div>)}</div>
        <p className="fine">Planning guidelines, not guarantees of food availability.</p>
      </Section>
      <Section title="Handpicked places">
        <p className="empty-state">Restaurants, cafés and dhabas picked from the rides will appear here, with their location, what to order, opening season and when they were last confirmed open. None are listed yet: Project Altitude doesn't publish places it hasn't eaten at.</p>
      </Section>
    </>
  );
}
function Stays() {
  return (
    <>
      <Head eyebrow="Stays" title={G.STAYS.title} />
      <Paras items={G.STAYS.body} />
      <Rule>{G.STAYS.rule}</Rule>
      <Section title="Kinds of stay">
        <div className="table">{G.STAYS.categories.map((c) => <div key={c.type}><dt>{c.type}</dt><dd><b>{c.ideal}.</b> <span className="muted">Ask about: {c.capture}.</span></dd></div>)}</div>
      </Section>
      <Section title="Accommodation hubs">
        <div className="table">{G.STAYS.hubs.map((h) => <div key={h.circuit}><dt><Dots ids={[h.circuit]} /> {CIRCUIT_META[h.circuit].name}</dt><dd>{h.places}</dd></div>)}</div>
      </Section>
      <Section title="Listings">
        <p className="empty-state">Verified properties will appear here with type, season, meals, hot water, heating, bike parking and a last-verified date. No property names, prices or contacts are published until they are confirmed.</p>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ Emergency */
function Emergency() {
  return (
    <>
      <Head eyebrow="Emergency" title={G.EMERGENCY.title} />
      <div className="numbers">
        {G.CONTACTS.map((c) => {
          const inner = (<><span className={c.tel ? "num" : "num text"}>{c.contact}</span><span className="who"><b>{c.service}</b><small>{c.notes}. Source: {c.source}.</small>
            {c.status !== "verified" && <Badge kind="verify">Re-verify before relying on it</Badge>}</span></>);
          return c.tel ? <a key={c.service} className="number" href={`tel:${c.tel}`}>{inner}</a> : <div key={c.service} className="number">{inner}</div>;
        })}
      </div>
      <p className="fine">These are starting contacts, not a complete rescue directory. A police station or hospital is not a mountain rescue service unless that is confirmed.</p>
      <Paras items={G.EMERGENCY.body} />
      <Rule>{G.EMERGENCY.rule}</Rule>
      <Section title="Altitude sickness">
        <div className="two-col">
          <div><h3>Warning signs</h3><ul className="bullets">{G.EMERGENCY.altitudeSigns.map((s) => <li key={s}>{s}</li>)}</ul><p className="warn-text">Symptoms can worsen rapidly. Serious altitude illness can be life-threatening.</p></div>
          <div className="danger"><h3>What to do</h3><ol className="steps">{G.EMERGENCY.altitudeSteps.map((s) => <li key={s}>{s}</li>)}</ol></div>
        </div>
        <p className="fine">{G.EMERGENCY.altitudeNote}</p>
      </Section>
      <Section title="If the bike stops working"><ol className="steps">{G.EMERGENCY.breakdown.map((s) => <li key={s}>{s}</li>)}</ol></Section>
      <Section title="Weather and road emergencies"><ul className="bullets">{G.EMERGENCY.weather.map((s) => <li key={s}>{s}</li>)}</ul>
        <p className="para">Official road-status sources: {G.EMERGENCY.roadStatus.map((r, i) => <span key={r.link}>{i > 0 && " · "}<a href={r.link} target="_blank" rel="noreferrer">{r.name}</a></span>)}</p>
      </Section>
      <p className="callout">{G.EMERGENCY.disclaimer}</p>
    </>
  );
}

/* ------------------------------------------------------------------ Packing */
const LISTS: { id: string; label: string }[] = [{ id: "expedition", label: "Full expedition" }, ...CIRCUIT_ORDER.map((c) => ({ id: c, label: CIRCUIT_META[c].name }))];
function Packing() {
  const [list, setList] = useState<string>(() => store.get("altitude-packing-list", "expedition"));
  const key = `altitude-packing-v2-${list}`;
  const [done, setDone] = useState<string[]>(() => store.get(key, []));
  useEffect(() => { setDone(store.get(`altitude-packing-v2-${list}`, [])); store.set("altitude-packing-list", list); }, [list]);
  useEffect(() => store.set(key, done), [done, key]);
  const total = G.PACKING.reduce((n, g) => n + g.items.length, 0);
  const has = new Set(done);
  const toggle = (k: string) => setDone((d) => (d.includes(k) ? d.filter((x) => x !== k) : [...d, k]));
  return (
    <>
      <Head eyebrow="Packing" title={G.PACKING_INTRO.title} />
      <Paras items={G.PACKING_INTRO.body} />
      <Rule>{G.PACKING_INTRO.rule}</Rule>
      <div className="seg" role="tablist" aria-label="Packing list">
        {LISTS.map((l) => <button key={l.id} role="tab" aria-selected={list === l.id} onClick={() => setList(l.id)}>{l.label}</button>)}
      </div>
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={has.size} aria-label="Packed"><span style={{ width: `${(has.size / total) * 100}%` }} /></div>
      <p className="count-line">{has.size} of {total} packed for {LISTS.find((l) => l.id === list)?.label} {has.size > 0 && <button type="button" className="text-btn" onClick={() => setDone([])}>Reset this list</button>}</p>
      <div className="pack-groups">
        {G.PACKING.map((g) => (
          <fieldset key={g.id} className="card">
            <legend className="card-title">{g.title} <span className="meta">{g.items.filter((i) => has.has(g.id + i)).length}/{g.items.length}</span></legend>
            {g.items.map((i) => {
              const k = g.id + i, id = "pk-" + k.replace(/\W+/g, "-").toLowerCase();
              return <label key={k} htmlFor={id} className="check"><input id={id} type="checkbox" checked={has.has(k)} onChange={() => toggle(k)} /><span>{i}</span></label>;
            })}
          </fieldset>
        ))}
      </div>
      <p className="fine">A clinician should advise on altitude medication and personal medical preparation. Adjust the motorcycle list to your machine, for example tubeless or tube-type tyres.</p>
    </>
  );
}

/* ------------------------------------------------------------------ Commute */
function Commute() {
  const [perDay, setPerDay] = useState<number>(() => store.get("altitude-km-per-day", 150));
  useEffect(() => store.set("altitude-km-per-day", perDay), [perDay]);
  return (
    <>
      <Head eyebrow="Commute" title={G.COMMUTE.title} />
      <Paras items={G.COMMUTE.body} />
      <Rule>{G.COMMUTE.rule}</Rule>
      <Section title="Starting points">
        <div className="table">{G.COMMUTE.starts.map((s) => <div key={s.place}><dt>{s.place}</dt><dd><b>{s.best}.</b> <span className="muted">Plan: {s.plan}.</span></dd></div>)}</div>
        <p className="fine">Possible logistical bases, not guarantees that every route is currently accessible.</p>
      </Section>
      <Section title="Getting your motorcycle there">
        <div className="cards grid">{G.COMMUTE.bike.map((b) => <article key={b.title} className="card"><p className="card-title">{b.title}</p><ul className="bullets">{b.points.map((p) => <li key={p}>{p}</li>)}</ul></article>)}</div>
      </Section>
      <Section title="Before departure"><ul className="bullets">{G.COMMUTE.checklist.map((c) => <li key={c}>{c}</li>)}</ul></Section>
      <Section title="Distance and time planning">
        <p className="para">Don't calculate riding days from kilometres alone. {G.COMMUTE.factors.join(", ")} all matter.</p>
        <label className="range" htmlFor="km-per-day"><span>Your daily riding limit: <b>{perDay} km</b></span>
          <input id="km-per-day" type="range" min={60} max={300} step={10} value={perDay} onChange={(e) => setPerDay(+e.target.value)} /></label>
        <div className="table">
          {CIRCUIT_ORDER.map((c) => <div key={c}><dt><Dots ids={[c]} /> {CIRCUIT_META[c].name}</dt><dd>≈ {fmt(circuitKm[c])} km of drawn route → at least {Math.ceil(circuitKm[c] / perDay)} riding days <span className="muted">before rest, weather and exploration days</span></dd></div>)}
        </div>
        <p className="fine">Distances are measured along the drawn circuit lines, so they are approximate. These are planning preferences, not journey times.</p>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ Circuits */
const PLAN_KEY = "altitude-trip-plan-v1";
function Circuits({ onPlace, onCircuit }: TabProps) {
  const [open, setOpen] = useState<CircuitId | null>(null);
  const [plan, setPlan] = useState<CircuitId[]>(() => store.get(PLAN_KEY, []));
  useEffect(() => store.set(PLAN_KEY, plan), [plan]);
  useEffect(() => () => onCircuit(null), []);
  const shared = useMemo(() => {
    if (plan.length < 2) return [];
    return ALL_PLACES.filter((p) => plan.filter((c) => p.circuits.includes(c)).length > 1).map((p) => p.name);
  }, [plan]);
  return (
    <>
      <Head eyebrow="Circuits" title="Four circuits, each its own journey">
        <p className="lead">Each circuit can be ridden on its own. Open one to see its route, a suggested itinerary and what to watch for; selecting it lights it up on the map.</p>
      </Head>
      <div className="table compact">
        {G.CIRCUITS.map((c) => <div key={c.id}><dt><Dots ids={[c.id]} /> {CIRCUIT_META[c.id].name}</dt><dd>{CIRCUIT_META[c.id].character} <span className="muted">Base: {c.base} · planning window {c.window}</span></dd></div>)}
      </div>
      <p className="fine">Planning windows are initial itinerary targets, not validated trip durations.</p>
      <div className="cards">
        {G.CIRCUITS.map((c) => {
          const m = CIRCUIT_META[c.id], on = open === c.id, inPlan = plan.includes(c.id);
          return (
            <article key={c.id} className={"card circuit" + (on ? " on" : "")} style={{ ["--c" as string]: m.color }}
              onMouseEnter={() => onCircuit(c.id)} onMouseLeave={() => onCircuit(open)}>
              <button type="button" className="circuit-head" aria-expanded={on} onClick={() => { const n = on ? null : c.id; setOpen(n); onCircuit(n); }}>
                <span className="bar" />
                <span><span className="card-title">{m.name}</span><span className="meta">{c.window} · ≈ {fmt(circuitKm[c.id])} km drawn · base {c.base}</span></span>
                <span className="chev" aria-hidden="true">{on ? "−" : "+"}</span>
              </button>
              {on && (
                <div className="card-body">
                  <p><b>The idea.</b> {c.idea}</p>
                  <p className="sequence"><b>Suggested route.</b> {c.sequence}</p>
                  <div className="itinerary">
                    {c.days.map((d) => <div key={d.day}><span className="day">Day {d.day}</span><span><b>{d.plan}</b><small>{d.objective}</small></span></div>)}
                  </div>
                  <p><b>What to watch for.</b> {c.highlights.join(" · ")}</p>
                  <p className="warn-text">{c.caution}</p>
                  <p className="near"><b>Stops.</b> {c.stops.map((s, i) => <span key={s}>{i > 0 && " → "}<PlaceLink id={s} onPlace={onPlace} /></span>)}</p>
                  <button type="button" className={inPlan ? "ghost on" : "ghost"} aria-pressed={inPlan}
                    onClick={() => setPlan((p) => (inPlan ? p.filter((x) => x !== c.id) : [...p, c.id]))}>{inPlan ? "✓ In your trip plan" : "Add to trip plan"}</button>
                </div>
              )}
            </article>
          );
        })}
      </div>
      <Section title="Complete expedition" id="expedition">
        <p className="lead-sm">{G.EXPEDITION_PAGE.title}</p>
        <p className="para">{G.EXPEDITION_PAGE.body}</p>
        <div className="card plan">
          <p className="card-title">Your trip plan</p>
          <CircuitPicker plan={plan} setPlan={setPlan} />
          {plan.length ? (
            <>
              <p>≈ <b>{fmt(plan.reduce((s, c) => s + circuitKm[c], 0))} km</b> of drawn route across {plan.length} circuit{plan.length > 1 ? "s" : ""}.</p>
              {shared.length > 0 && <p className="muted">Shared sections: {shared.join(", ")} appear on more than one selected circuit, so the total counts some roads twice.</p>}
              <ul className="bullets">{G.EXPEDITION_PAGE.conditional.filter((x) => x.circuits.some((c) => plan.includes(c))).map((x) => <li key={x.note} className="warn-text">{x.note}</li>)}</ul>
              <p className="fine">The circuits are not assumed to connect as a continuous loop. Add rest, weather-buffer and service days to any plan.</p>
            </>
          ) : <p className="muted">Pick one or more circuits to combine them.</p>}
        </div>
      </Section>
    </>
  );
}
function CircuitPicker({ plan, setPlan }: { plan: CircuitId[]; setPlan(f: (p: CircuitId[]) => CircuitId[]): void }) {
  return (
    <div className="chips">
      {CIRCUIT_ORDER.map((c) => {
        const on = plan.includes(c);
        return <button key={c} type="button" className={"chip" + (on ? " on" : "")} aria-pressed={on} style={{ ["--c" as string]: CIRCUIT_META[c].color }}
          onClick={() => setPlan((p) => (on ? p.filter((x) => x !== c) : [...p, c]))}><span className="dot" />{CIRCUIT_META[c].name}</button>;
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ Gems, swags, creator, terms */
function Gems({ onPlace }: TabProps) {
  const [c, setC] = useState<CircuitId | "all">("all");
  return (
    <>
      <Head eyebrow="Gems" title={G.GEMS.title} />
      <Paras items={G.GEMS.body} />
      <Rule>{G.GEMS.rule}</Rule>
      <CircuitChips value={c} onChange={setC} />
      <div className="cards grid">
        {G.GEMS.list.filter((g) => c === "all" || g.circuit === c).map((g) => (
          <article key={g.title} className="card gem">
            <p className="meta"><Dots ids={[g.circuit]} /> {g.category}</p>
            <p className="card-title">{g.title}</p>
            <p className="muted">Near <PlaceLink id={g.place} onPlace={onPlace} /> · <Badge kind="verify">To research</Badge></p>
          </article>
        ))}
      </div>
      <p className="fine">{G.GEMS.note}</p>
      <Section title="Categories"><p className="para muted">{G.GEMS.categories.join(" · ")}</p></Section>
    </>
  );
}
function Swags() {
  return (
    <>
      <Head eyebrow="Swags" title={G.SWAGS.title} />
      <Paras items={G.SWAGS.body} />
      <Rule>{G.SWAGS.rule}</Rule>
      <div className="cards grid">{G.SWAGS.items.map((i) => <article key={i.name} className="card"><p className="card-title">{i.name}</p><p>{i.body}</p><p className="meta">Coming soon</p></article>)}</div>
    </>
  );
}
function Creator() {
  return (
    <>
      <Head eyebrow="Meet the Creator" title={G.CREATOR.title} />
      <Stats />
      <Paras items={G.CREATOR.body} />
      <Rule>{G.CREATOR.signoff}</Rule>
      <p className="draft-note">To add: a photo with the motorcycle, one from Umling La, a portfolio link and a contact address.</p>
    </>
  );
}
function Terms() {
  return (
    <>
      <Head eyebrow="T&C" title={G.TERMS.title}><p className="lead">{G.TERMS.lead}</p></Head>
      {G.TERMS.sections.map((s) => <Section key={s.h} title={s.h}><Paras items={s.p} /></Section>)}
      <Rule>{G.TERMS.signoff}</Rule>
      <p className="draft-note">Have these terms reviewed for applicable legal requirements before publishing.</p>
    </>
  );
}

export const TABS: Record<TabId, (p: TabProps) => JSX.Element> = {
  note: Note, story: Story, how: HowTo, credits: Credits,
  villages: Villages, passes: Passes, food: Food, stays: Stays, emergency: Emergency, packing: Packing, commute: Commute, circuits: Circuits, gems: Gems,
  swags: Swags, creator: Creator, terms: Terms,
};
