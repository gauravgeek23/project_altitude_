import { useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "altitude-theme";
const media = typeof matchMedia !== "undefined" ? matchMedia("(prefers-color-scheme: dark)") : null;

function stored(): Theme | null {
  try { const v = localStorage.getItem(KEY); return v === "light" || v === "dark" ? v : null; } catch { return null; }
}

/** The theme in force: the reader's pick if they made one, else the system's. */
export function useTheme(): [Theme, () => void] {
  const [pick, setPick] = useState<Theme | null>(stored);
  const [system, setSystem] = useState<Theme>(media?.matches ? "dark" : "light");
  useEffect(() => {
    const f = (e: MediaQueryListEvent) => setSystem(e.matches ? "dark" : "light");
    media?.addEventListener("change", f);
    return () => media?.removeEventListener("change", f);
  }, []);
  const theme = pick ?? system;
  useEffect(() => {
    const root = document.documentElement;
    if (pick) root.dataset.theme = pick; else delete root.dataset.theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", theme === "dark" ? "#0d0f12" : "#ffffff");
  }, [pick, theme]);
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 350);
    setPick(next);
    try { localStorage.setItem(KEY, next); } catch { /* storage unavailable */ }
  };
  return [theme, toggle];
}

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle(): void }) {
  const dark = theme === "dark";
  return (
    <button type="button" className="theme-btn" onClick={onToggle} aria-pressed={dark} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dark
          ? <><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></>
          : <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />}
      </svg>
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
