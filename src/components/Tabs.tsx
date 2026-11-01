import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CIRCUIT_META, KIND_LABEL, PLACES, type CircuitId, type Place } from "../content/places";
import { AMS, CIRCUITS, COMMUTE, EMERGENCY_NUMBERS, FOOD, GEMS, HOSPITALS, PACKING, STAYS } from "../content/guide";
import type { TabId } from "../nav";

export interface TabProps {
  selected: string | null;
  onPlace(id: string): void;
  onCircuit(id: CircuitId | null): void;
  onTab(id: TabId): void;
}

const byId = Object.fromEntries(PLACES.map((p) => [p.id, p])) as Record<string, Place>;
const fmt = (n: number) => n.toLocaleString("en-IN");

function TLDR({ title = "TL;DR", children }: { title?: string; children: ReactNode }) {
  return (
    <header className="tldr">
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}
const Section = ({ title, children, id }: { title: string; children: ReactNode; id?: string }) => (
  <section className="block" id={id}><h2>{title}</h2>{children}</section>
);
const PlaceLink = ({ id, onPlace }: { id: string; onPlace(id: string): void }) =>
  byId[id] ? <button type="button" className="place-link" onClick={() => onPlace(id)}>{byId[id].name}</button> : null;

/* ------------------------------------------------------------------ about */
function Note({ onTab }: TabProps) {
  return (
    <>
      <TLDR>Project Altitude is a rider's field guide to Ladakh and Himachal: four circuits, the villages between them, and what you need to know to ride them well. Everything here comes from the road.</TLDR>
      <Section title="Why this exists">
        <p>Most guides to the Himalaya stop at the famous names. The best parts of these rides happen between them: a Balti homestay in Turtuk, butter tea at a dhaba below a pass, a sky full of stars in Hanle. This guide is a map of those places, arranged the way a rider actually moves through them.</p>
      </Section>
      <Section title="Where to start">
        <ul className="link-list">
          <li><button type="button" className="text-btn" onClick={() => onTab("circuits")}>Pick a circuit →</button> four routes, from a short Nubra loop to the big Changthang ride.</li>
          <li><button type="button" className="text-btn" onClick={() => onTab("villages")}>Browse villages →</button> what each stop is, and why it is worth stopping.</li>
          <li><button type="button" className="text-btn" onClick={() => onTab("emergency")}>Read Emergency →</button> before you leave, not after.</li>
        </ul>
      </Section>
      <p className="draft-note">Draft: rewrite this note in your own words.</p>
    </>
  );
}

function Story() {
  return (
    <>
      <TLDR>One rider, two regions, four circuits. The story of how a bike trip through Ladakh and Himachal turned into this guide.</TLDR>
      <Section title="The ride">
        <p>It started with a line drawn on a map: Chandigarh to Manali, over the Lahaul passes to Leh, out to Nubra and Pangong, south through Changthang to Umling La, then back through Zanskar and Spiti. Thousands of kilometres, most of them above 3,000 metres.</p>
      </Section>
      <Section title="What changed along the way">
        <p>The plan kept changing. Roads closed with snowmelt, permits took a day longer, a homestay turned into three nights. The circuits on this map are the version that worked, drawn after the fact.</p>
      </Section>
      <p className="draft-note">Draft: add your dates, your bike, and the moments that stayed with you.</p>
    </>
  );
}

function HowTo({ onTab }: TabProps) {
  return (
    <>
      <TLDR>The map on the right is your index. Tap any place on it to read about that place; tap a circuit to see its stops. The menu on the left holds everything you need before and during the ride.</TLDR>
      <Section title="On the map">
        <ol className="steps">
          <li><b>Tap a place</b> to see what it is, then open its full entry.</li>
          <li><b>Pinch or scroll</b> to zoom, and drag to move around.</li>
          <li><b>Pick a circuit</b> in <button type="button" className="text-btn" onClick={() => onTab("circuits")}>Circuits</button> and its stops light up.</li>
        </ol>
      </Section>
      <Section title="On your phone">
        <p>Use the Guide and Map switch at the bottom of the screen to move between reading and the map. The menu button at the top opens every section.</p>
      </Section>
      <Section title="Before you leave">
        <p>Work through <button type="button" className="text-btn" onClick={() => onTab("packing")}>Packing</button> (it remembers what you tick on this device) and read <button type="button" className="text-btn" onClick={() => onTab("commute")}>Commute</button> for permits, road seasons and fuel.</p>
      </Section>
    </>
  );
}

function Credits() {
  const rows = [
    ["Route design", "Proj Altitude, from rides across Ladakh and Himachal"],
    ["Terrain", "Terrain Tiles on AWS Open Data (SRTM and others)"],
    ["Roads and places", "OpenStreetMap contributors (ODbL), GeoNames"],
    ["Boundaries", "Natural Earth"],
    ["Interface and writing", "Draft for Project Altitude"],
  ];
  return (
    <>
      <TLDR>This guide stands on open data and on everyone who answered a question at a dhaba, a check post or a homestay kitchen.</TLDR>
      <dl className="table">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    </>
  );
}

/* ------------------------------------------------------------------ guide */
function Villages({ selected, onPlace }: TabProps) {
  const [q, setQ] = useState("");
  const [c, setC] = useState<CircuitId | "all">("all");
  const [kind, setKind] = useState<"stops" | "passes">("stops");
  const refs = useRef<Record<string, HTMLDetailsElement | null>>({});
  const list = useMemo(() => PLACES.filter((p) =>
    (kind === "passes" ? p.kind === "pass" : p.kind !== "pass") &&
    (c === "all" || p.circuits.includes(c)) &&
    (!q || (p.name + p.region + p.summary).toLowerCase().includes(q.toLowerCase()))), [q, c, kind]);

  useEffect(() => {
    if (!selected) return;
    const p = byId[selected];
    if (!p) return;
    setKind(p.kind === "pass" ? "passes" : "stops"); setC("all"); setQ("");
    requestAnimationFrame(() => {
      const el = refs.current[selected];
      if (el) { el.open = true; el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }
    });
  }, [selected]);

  return (
    <>
      <TLDR>{PLACES.filter((p) => p.kind !== "pass").length} villages, towns and lakes, and {PLACES.filter((p) => p.kind === "pass").length} passes, across the four circuits. Each entry says what the place is, why it is worth the stop, and one tip from the road.</TLDR>
      <div className="filters">
        <div className="seg" role="tablist" aria-label="Show">
          <button role="tab" aria-selected={kind === "stops"} onClick={() => setKind("stops")}>Places</button>
          <button role="tab" aria-selected={kind === "passes"} onClick={() => setKind("passes")}>Passes</button>
        </div>
        <input id="village-search" type="search" placeholder="Search by name or valley" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search places" />
        <div className="chips" role="group" aria-label="Filter by circuit">
          <button className={"chip" + (c === "all" ? " on" : "")} onClick={() => setC("all")}>All</button>
          {(Object.keys(CIRCUIT_META) as CircuitId[]).map((id) => (
            <button key={id} className={"chip" + (c === id ? " on" : "")} style={{ ["--c" as string]: CIRCUIT_META[id].color }} onClick={() => setC(id)}>
              <span className="dot" />{CIRCUIT_META[id].short}
            </button>
          ))}
        </div>
      </div>
      <p className="count-line">{list.length} {kind === "passes" ? "passes" : "places"}</p>
      <div className="cards">
        {list.map((p) => (
          <details key={p.id} ref={(el) => (refs.current[p.id] = el)} className={"card place" + (p.id === selected ? " selected" : "")} id={`place-${p.id}`}>
            <summary>
              <span className="card-title">{p.name}</span>
              <span className="meta">{KIND_LABEL[p.kind]} · {p.region}{p.alt ? ` · about ${fmt(p.alt)} m` : ""}</span>
              <span className="circuit-dots" aria-label={"On " + p.circuits.map((x) => CIRCUIT_META[x].short).join(", ")}>
                {p.circuits.map((x) => <span key={x} className="dot" style={{ ["--c" as string]: CIRCUIT_META[x].color }} />)}
              </span>
              <span className="summary-text">{p.summary}</span>
            </summary>
            <div className="card-body">
              <p><b>Why stop.</b> {p.why}</p>
              {p.tip && <p><b>Tip.</b> {p.tip}</p>}
              <button type="button" className="text-btn" onClick={() => onPlace(p.id)}>Show on map →</button>
            </div>
          </details>
        ))}
        {!list.length && <p className="empty">No places match. Clear the search or pick another circuit.</p>}
      </div>
    </>
  );
}

function Food() {
  return (
    <>
      <TLDR>Eat what the valley eats. Ladakhi kitchens run on barley, wheat, butter tea and soups; Himachal adds rajma, siddu and orchard fruit. A hot bowl at a dhaba below a pass is part of the ride.</TLDR>
      <div className="cards grid">
        {FOOD.map((d) => (
          <article key={d.name} className="card">
            <p className="card-title">{d.name}</p>
            <p className="meta">{d.region}</p>
            <p>{d.what}</p>
            <p className="where"><b>Where:</b> {d.where}</p>
          </article>
        ))}
      </div>
      <Section title="Eating well at altitude">
        <ul className="bullets">
          <li>Eat small and often. Appetite drops above 3,500 m.</li>
          <li>Drink more water than feels necessary. Butter tea counts, alcohol does not.</li>
          <li>Carry dry fruit, chikki and biscuits for the long gaps between dhabas.</li>
        </ul>
      </Section>
    </>
  );
}

function Stays({ onPlace }: TabProps) {
  const names = Object.fromEntries(PLACES.map((p) => [p.name, p.id]));
  return (
    <>
      <TLDR>Four kinds of stay cover the whole trip: homestays in the villages, camps on the high road, guesthouses in the towns, and dhabas for the nights the road decides for you.</TLDR>
      <div className="cards">
        {STAYS.map((s) => (
          <article key={s.type} className="card">
            <p className="card-title">{s.type}</p>
            <p>{s.what}</p>
            <p className="where"><b>Best in:</b> {s.best.map((b, i) => (
              <span key={b}>{i > 0 && ", "}{names[b] ? <PlaceLink id={names[b]} onPlace={onPlace} /> : b}</span>
            ))}</p>
            <p className="tip"><b>Tip.</b> {s.tip}</p>
          </article>
        ))}
      </div>
    </>
  );
}

function Emergency() {
  return (
    <>
      <TLDR>Dial 112 for any emergency in India. Above 3,000 m the most common danger is altitude sickness: learn its signs, never climb with symptoms, and go down if they get worse.</TLDR>
      <div className="numbers">
        {EMERGENCY_NUMBERS.map((n) => (
          <a key={n.number} className="number" href={`tel:${n.number}`}>
            <span className="num">{n.number}</span>
            <span><b>{n.label}</b>{n.note && <small>{n.note}</small>}</span>
          </a>
        ))}
      </div>
      <p className="fine">Mobile coverage is patchy. Note the nearest army camp or village before long empty stretches.</p>
      <Section title="Altitude sickness (AMS)">
        <div className="two-col">
          <div><h3>Early signs</h3><ul className="bullets">{AMS.signs.map((s) => <li key={s}>{s}</li>)}</ul></div>
          <div className="danger"><h3>Go down now if</h3><ul className="bullets">{AMS.danger.map((s) => <li key={s}>{s}</li>)}</ul></div>
        </div>
        <h3>Five rules</h3>
        <ol className="steps">{AMS.rules.map((r) => <li key={r}>{r}</li>)}</ol>
      </Section>
      <Section title="Hospitals on the way">
        <dl className="table">{HOSPITALS.map((h) => <div key={h.name}><dt>{h.place}</dt><dd>{h.name}{h.note && <small> {h.note}</small>}</dd></div>)}</dl>
      </Section>
      <p className="fine">This is general guidance, not medical advice. See a doctor before a high-altitude trip.</p>
    </>
  );
}

const PACK_KEY = "altitude-packing-v1";
function Packing() {
  const [done, setDone] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(PACK_KEY) || "[]")); } catch { return new Set(); }
  });
  useEffect(() => { try { localStorage.setItem(PACK_KEY, JSON.stringify([...done])); } catch { /* storage unavailable */ } }, [done]);
  const total = PACKING.reduce((n, g) => n + g.items.length, 0);
  const toggle = (k: string) => setDone((d) => { const n = new Set(d); n.has(k) ? n.delete(k) : n.add(k); return n; });
  return (
    <>
      <TLDR>Pack for four seasons in one day: sun at noon, sleet on the pass, frost at night. Keep documents in one waterproof pouch and spares where you can reach them without unpacking.</TLDR>
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done.size} aria-label="Packed">
        <span style={{ width: `${(done.size / total) * 100}%` }} />
      </div>
      <p className="count-line">{done.size} of {total} packed {done.size > 0 && <button type="button" className="text-btn" onClick={() => setDone(new Set())}>Reset</button>}</p>
      <div className="pack-groups">
        {PACKING.map((g) => (
          <fieldset key={g.id} className="card">
            <legend className="card-title">{g.title} <span className="meta">{g.items.filter((i) => done.has(g.id + i)).length}/{g.items.length}</span></legend>
            {g.items.map((i) => {
              const k = g.id + i, id = "pk-" + k.replace(/\W+/g, "-").toLowerCase();
              return <label key={k} htmlFor={id} className="check"><input id={id} type="checkbox" checked={done.has(k)} onChange={() => toggle(k)} /><span>{i}</span></label>;
            })}
          </fieldset>
        ))}
      </div>
    </>
  );
}

function Commute() {
  return (
    <>
      <TLDR>Fly into Leh or ride up from Chandigarh. The high roads open for a few summer months, Ladakh's border areas need an Inner Line Permit, and fuel is the thing you will plan around most.</TLDR>
      <Section title="Getting there">
        <div className="cards grid">{COMMUTE.getThere.map((g) => <article key={g.title} className="card"><p className="card-title">{g.title}</p><p>{g.body}</p></article>)}</div>
      </Section>
      <Section title="When the roads are open">
        <dl className="table">{COMMUTE.seasons.map((s) => <div key={s.road}><dt>{s.road}</dt><dd><b>{s.when}</b><small> {s.note}</small></dd></div>)}</dl>
        <p className="fine">Dates shift every year with snowfall. Check the latest status before you set out.</p>
      </Section>
      <Section title="Permits"><ul className="bullets">{COMMUTE.permits.map((p) => <li key={p}>{p}</li>)}</ul></Section>
      <Section title="Fuel"><ul className="bullets">{COMMUTE.fuel.map((p) => <li key={p}>{p}</li>)}</ul></Section>
      <Section title="Phone network"><p>{COMMUTE.network}</p></Section>
    </>
  );
}

function Circuits({ onPlace, onCircuit }: TabProps) {
  const [open, setOpen] = useState<CircuitId | null>(null);
  useEffect(() => () => onCircuit(null), []);
  return (
    <>
      <TLDR>Four circuits, each a few days to a couple of weeks. Choose one or join them up. Select a circuit to light up its stops on the map.</TLDR>
      <div className="cards">
        {CIRCUITS.map((c) => {
          const m = CIRCUIT_META[c.id], on = open === c.id;
          return (
            <article key={c.id} className={"card circuit" + (on ? " on" : "")} style={{ ["--c" as string]: m.color }}
              onMouseEnter={() => onCircuit(c.id)} onMouseLeave={() => onCircuit(open)}>
              <button type="button" className="circuit-head" aria-expanded={on} onClick={() => { const n = on ? null : c.id; setOpen(n); onCircuit(n); }}>
                <span className="bar" />
                <span><span className="card-title">{m.name}</span><span className="meta">{c.days} · {c.season}</span></span>
                <span className="chev" aria-hidden="true">{on ? "−" : "+"}</span>
              </button>
              {on && (
                <div className="card-body">
                  <p><b>Highlights.</b> {c.highlights.join(" · ")}</p>
                  <p><b>Difficulty.</b> {c.difficulty}</p>
                  <ol className="stops">{c.stops.map((s) => <li key={s}><PlaceLink id={s} onPlace={onPlace} /></li>)}</ol>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}

function Gems({ onPlace }: TabProps) {
  return (
    <>
      <TLDR>Small things worth planning around: a post office, a dark sky, a monk, a lake full of cranes. Most take an hour or a detour; all of them stay with you.</TLDR>
      <div className="cards grid">
        {GEMS.map((g) => (
          <article key={g.title} className="card gem">
            <p className="card-title">{g.title}</p>
            <p>{g.body}</p>
            <button type="button" className="text-btn" onClick={() => onPlace(g.place)}>{byId[g.place]?.name} on the map →</button>
          </article>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ shop & footer */
function Swags() {
  const items = [
    { name: "Circuit map poster", body: "The four circuits printed on heavy matte paper, A2." },
    { name: "Pass sticker set", body: "Weatherproof stickers for the passes you crossed, sized for a helmet or a pannier." },
    { name: "Embroidered patch", body: "The Project Altitude badge for your riding jacket." },
  ];
  return (
    <>
      <TLDR>Things to remember the ride by. Coming soon.</TLDR>
      <div className="cards grid">{items.map((i) => <article key={i.name} className="card"><p className="card-title">{i.name}</p><p>{i.body}</p><p className="meta">Coming soon</p></article>)}</div>
      <p className="draft-note">Draft: placeholder products until the shop is ready.</p>
    </>
  );
}

function Creator() {
  return (
    <>
      <TLDR>Made by the rider behind Proj Altitude, who drew these circuits after riding them.</TLDR>
      <Section title="About">
        <p>A designer who rides. These circuits started as a sketch on a map for friends planning their own trips, and grew into this guide.</p>
      </Section>
      <p className="draft-note">Draft: add your name, a photo and your links.</p>
    </>
  );
}

function Terms() {
  return (
    <>
      <TLDR>This is a planning guide, not a guarantee. Mountain roads, permits and weather change every season; check current conditions and ride within your limits.</TLDR>
      <Section title="Use of this guide">
        <ul className="bullets">
          <li>Information is gathered from personal rides and open data and may be out of date.</li>
          <li>Map positions of routes and some places are approximate. Do not use this map for navigation.</li>
          <li>Boundaries shown are for illustration only.</li>
          <li>You are responsible for your own safety, permits and compliance with local rules.</li>
        </ul>
      </Section>
      <p className="draft-note">Draft: have these terms reviewed before publishing.</p>
    </>
  );
}

export const TABS: Record<TabId, (p: TabProps) => JSX.Element> = {
  note: Note, story: Story, how: HowTo, credits: Credits,
  villages: Villages, food: Food, stays: Stays, emergency: Emergency, packing: Packing, commute: Commute, circuits: Circuits, gems: Gems,
  swags: Swags, creator: Creator, terms: Terms,
};
