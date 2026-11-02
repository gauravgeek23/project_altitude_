import { ThemeToggle, useTheme } from "./components/ThemeToggle";
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { MapPanel } from "./components/MapPanel";
import { BY_ID } from "./content/places";
import { TABS } from "./components/Tabs";
import { Logo } from "./components/Logo";
import { isTab, labelOf, type TabId } from "./nav";
import type { CircuitId } from "./content/places";

const fromHash = (): TabId => { const h = location.hash.slice(1); return isTab(h) ? h : "note"; };

export default function App() {
  const [tab, setTab] = useState<TabId>(fromHash);
  const [selected, setSelected] = useState<string | null>(null);
  const [circuit, setCircuit] = useState<CircuitId | null>(null);
  const [view, setView] = useState<"guide" | "map">("guide");
  const [drawer, setDrawer] = useState(false);
  const content = useRef<HTMLElement>(null);
  const mobile = () => matchMedia("(max-width: 899px)").matches;

  useEffect(() => {
    const on = () => setTab(fromHash());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  useEffect(() => { content.current?.scrollTo({ top: 0 }); if (mobile()) scrollTo({ top: 0 }); }, [tab]);
  useEffect(() => {
    if (!drawer) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [drawer]);

  const go = (id: TabId) => {
    if (location.hash.slice(1) !== id) history.pushState(null, "", `#${id}`);
    setTab(id); setDrawer(false); setView("guide");
  };
  const showOnMap = (id: string) => { setSelected(id); if (mobile()) setView("map"); };
  const openPlace = (id: string) => { setSelected(id); go(BY_ID[id]?.type === "pass" || BY_ID[id]?.type === "peak" ? "passes" : "villages"); };

  const [theme, toggleTheme] = useTheme();
  const Tab = TABS[tab];
  return (
    <div className="app" data-view={view}>
      <header className="topbar">
        <a href="#note" onClick={(e) => { e.preventDefault(); go("note"); }} aria-label="Project Altitude, home"><Logo /></a>
        <span className="topbar-title">{view === "map" ? "Map" : labelOf(tab)}</span>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <button type="button" className="icon-btn menu" onClick={() => setDrawer(true)} aria-label="Open menu" aria-expanded={drawer}>
          <span /><span /><span />
        </button>
      </header>

      <Sidebar tab={tab} onTab={go} footer={<ThemeToggle theme={theme} onToggle={toggleTheme} />} />
      {drawer && (
        <div className="drawer-wrap" onClick={() => setDrawer(false)}>
          <div className="drawer" role="dialog" aria-modal="true" aria-label="Menu" onClick={(e) => e.stopPropagation()}>
            <Sidebar tab={tab} onTab={go} variant="drawer" onClose={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <main className="content" ref={content} id="content">
        <div className="content-inner" key={tab}>
          <Tab selected={selected} onPlace={showOnMap} onCircuit={setCircuit} onTab={go} />
        </div>
      </main>

      <aside className="map-col" aria-label="Circuit map">
        <MapPanel selected={selected} circuit={circuit} onCircuit={setCircuit} onSelect={setSelected} onOpenPlace={(id) => { openPlace(id); setView("guide"); }} onEmergency={() => go("emergency")} />
      </aside>

      <div className="switcher" role="tablist" aria-label="View">
        <button role="tab" aria-selected={view === "guide"} onClick={() => setView("guide")}>Guide</button>
        <button role="tab" aria-selected={view === "map"} onClick={() => setView("map")}>Map</button>
      </div>
    </div>
  );
}
