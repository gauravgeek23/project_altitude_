import type { ReactNode } from "react";
import { FOOTER_NAV, NAV, type TabId } from "../nav";
import { Logo } from "./Logo";

interface Props {
  tab: TabId;
  onTab(id: TabId): void;
  /** the mobile drawer shows group titles and a close button */
  variant?: "rail" | "drawer";
  onClose?(): void;
  footer?: ReactNode;
}

export function Sidebar({ tab, onTab, variant = "rail", onClose, footer }: Props) {
  const Item = ({ id, label }: { id: TabId; label: string }) => (
    <li>
      <a href={`#${id}`} className={"nav-item" + (tab === id ? " active" : "")} aria-current={tab === id ? "page" : undefined}
        onClick={(e) => { e.preventDefault(); onTab(id); }}>{label}</a>
    </li>
  );
  return (
    <nav className={`sidebar ${variant}`} aria-label="Sections">
      <div className="sidebar-top">
        <div className="sidebar-head">
          <a href="#note" onClick={(e) => { e.preventDefault(); onTab("note"); }} aria-label="Project Altitude, home"><Logo /></a>
          {variant === "drawer" && <button type="button" className="icon-btn" onClick={onClose} aria-label="Close menu">✕</button>}
        </div>
        {NAV.map((g) => (
          <div key={g.group} className="nav-group">
            <hr className="divider" />
            {variant === "drawer" && <p className="nav-title">{g.group}</p>}
            <ul>{g.items.map((i) => <Item key={i.id} {...i} />)}</ul>
          </div>
        ))}
      </div>
      <div className="nav-bottom">
        <ul className="nav-footer">{FOOTER_NAV.map((i) => <Item key={i.id} {...i} />)}</ul>
        {footer && <div className="nav-theme">{footer}</div>}
      </div>
    </nav>
  );
}
