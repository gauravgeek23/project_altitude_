export type TabId =
  | "note" | "how" | "credits"
  | "legend" | "villages" | "passes" | "food" | "stays" | "emergency" | "packing" | "commute" | "circuits" | "gems"
  | "swags" | "creator" | "terms";

export const NAV: { group: string; items: { id: TabId; label: string }[] }[] = [
  // the note carries the story too (#story still opens it)
  { group: "About", items: [{ id: "note", label: "A note" }, { id: "how", label: "How to use" }] },
  { group: "Guide", items: [
    { id: "circuits", label: "Circuits" }, { id: "legend", label: "Map legend" }, { id: "villages", label: "Villages" }, { id: "passes", label: "Passes" }, { id: "gems", label: "Gems" }] },
  { group: "On the road", items: [
    { id: "commute", label: "Commute" }, { id: "stays", label: "Stays" }, { id: "food", label: "Eat & Drink" }, { id: "packing", label: "Packing" }, { id: "emergency", label: "Emergency" }] },
  { group: "Shop", items: [{ id: "swags", label: "Swags" }] },
];
export const FOOTER_NAV: { id: TabId; label: string }[] = [{ id: "creator", label: "Meet the Creator" }];
/** shown on one line at the very bottom: T&C · Credits */
export const FOOTER_PAIR: { id: TabId; label: string }[] = [{ id: "terms", label: "T&C" }, { id: "credits", label: "Credits" }];

export const ALL_TABS = [...NAV.flatMap((g) => g.items), ...FOOTER_NAV, ...FOOTER_PAIR];
export const labelOf = (id: TabId) => ALL_TABS.find((t) => t.id === id)?.label ?? "";
export const isTab = (s: string): s is TabId => ALL_TABS.some((t) => t.id === s);
