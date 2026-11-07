import type { ReactNode } from "react";
import { FOOTER_PAIR, NAV, type TabId } from "../nav";
import { Logo } from "./Logo";
import { NavIcon } from "./icons";
import { PrayerFlags } from "./PrayerFlags";
import { photosFor } from "../content/images";

interface Props {
  tab: TabId;
  onTab(id: TabId): void;
  /** the mobile drawer shows a close button */
  variant?: "rail" | "drawer";
  onClose?(): void;
  /** the theme toggle, shown in the brand row */
  footer?: ReactNode;
}

/**
 * The left panel: the flags on the top edge, the brand row with the theme toggle, then the sections,
 * each with a small label and icon-and-word rows (the open page sits on a soft pill), and at the
 * bottom the creator's own row and the small print.
 */
export function Sidebar({ tab, onTab, variant = "rail", onClose, footer }: Props) {
  const portrait = photosFor("portrait")[0];
  const Row = ({ id, label }: { id: TabId; label: string }) => (
    <li>
      <a href={`#${id}`} className={"nav-item" + (tab === id ? " active" : "")} aria-current={tab === id ? "page" : undefined}
        onClick={(e) => { e.preventDefault(); onTab(id); }}><NavIcon id={id} />{label}</a>
    </li>
  );
  return (
    <nav className={`sidebar ${variant}`} aria-label="Sections">
      <div className="sidebar-top">
        <div className="flags-rail" aria-hidden="true"><PrayerFlags /></div>
        <div className="sidebar-head">
          <a href="#note" onClick={(e) => { e.preventDefault(); onTab("note"); }} aria-label="Project Altitude, home"><Logo /></a>
          <span className="head-tools">
            {footer}
            {variant === "drawer" && <button type="button" className="icon-btn" onClick={onClose} aria-label="Close menu">✕</button>}
          </span>
        </div>
        {NAV.map((g) => (
          <div key={g.group} className="nav-group">
            <p className="nav-title">{g.group}</p>
            <ul>{g.items.map((i) => <Row key={i.id} {...i} />)}</ul>
          </div>
        ))}
      </div>
      <div className="nav-bottom">
        <a href="#creator" className={"nav-creator" + (tab === "creator" ? " active" : "")} aria-current={tab === "creator" ? "page" : undefined}
          onClick={(e) => { e.preventDefault(); onTab("creator"); }}>
          {portrait ? <img src={portrait.thumb} alt="" style={{ objectPosition: portrait.focus }} /> : <span className="nav-avatar"><NavIcon id="creator" /></span>}
          <span><b>Gaurav Kumar</b><small>Meet the creator</small></span>
        </a>
        <p className="nav-small">{FOOTER_PAIR.map((i, k) => (
          <span key={i.id}>{k > 0 && <span className="nav-dot" aria-hidden="true">·</span>}
            <a href={`#${i.id}`} className={"nav-link" + (tab === i.id ? " active" : "")} onClick={(e) => { e.preventDefault(); onTab(i.id); }}>{i.label}</a></span>
        ))}</p>
      </div>
    </nav>
  );
}
