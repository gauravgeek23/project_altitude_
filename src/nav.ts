export type TabId =
  | "note" | "how" | "legend" | "credits"
  | "circuits" | "villages" | "passes" | "essentials" | "gear" | "gems" | "emergency"
  | "swags" | "creator" | "terms";

export const NAV: { group: string; items: { id: TabId; label: string }[] }[] = [
  // the note carries the story too (#story still opens it)
  { group: "About", items: [{ id: "note", label: "A note" }, { id: "how", label: "How to use" }, { id: "legend", label: "Map legend" }] },
  // Essentials = getting there, where to stay, what to eat; Gear = packing and the motorcycle
  { group: "Guide", items: [
    { id: "circuits", label: "Circuits" }, { id: "villages", label: "Villages" }, { id: "passes", label: "Passes" }, { id: "essentials", label: "Essentials" },
    { id: "gear", label: "Gear" }, { id: "gems", label: "Hidden gems" }, { id: "emergency", label: "Emergency" }] },
  { group: "Shop", items: [{ id: "swags", label: "Swags" }] },
];
/** old addresses that still open a page; the hash names the section to scroll to */
export const ALIASES: Record<string, TabId> = { story: "note", commute: "essentials", stays: "essentials", food: "essentials", packing: "gear" };
export const FOOTER_NAV: { id: TabId; label: string }[] = [{ id: "creator", label: "Meet the Creator" }];
/** shown on one line at the very bottom: T&C · Credits */
export const FOOTER_PAIR: { id: TabId; label: string }[] = [{ id: "terms", label: "T&C" }, { id: "credits", label: "Credits" }];

export const ALL_TABS = [...NAV.flatMap((g) => g.items), ...FOOTER_NAV, ...FOOTER_PAIR];
export const labelOf = (id: TabId) => ALL_TABS.find((t) => t.id === id)?.label ?? "";
export const isTab = (s: string): s is TabId => ALL_TABS.some((t) => t.id === s);
