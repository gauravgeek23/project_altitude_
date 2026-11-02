export type TabId =
  | "note" | "story" | "how" | "credits"
  | "legend" | "villages" | "passes" | "food" | "stays" | "emergency" | "packing" | "commute" | "circuits" | "gems"
  | "swags" | "creator" | "terms";

export const NAV: { group: string; items: { id: TabId; label: string }[] }[] = [
  { group: "About", items: [{ id: "note", label: "A note" }, { id: "story", label: "Story" }, { id: "how", label: "How to use" }, { id: "credits", label: "Credits" }] },
  { group: "Guide", items: [
    { id: "circuits", label: "Circuits" }, { id: "legend", label: "Map legend" }, { id: "villages", label: "Villages" }, { id: "passes", label: "Passes & Peaks" }, { id: "food", label: "Eat & Drink" }, { id: "stays", label: "Stays" }, { id: "emergency", label: "Emergency" },
    { id: "packing", label: "Packing" }, { id: "commute", label: "Commute" }, { id: "gems", label: "Gems" }] },
  { group: "Shop", items: [{ id: "swags", label: "Swags" }] },
];
export const FOOTER_NAV: { id: TabId; label: string }[] = [{ id: "creator", label: "Meet the Creator" }, { id: "terms", label: "T&C" }];

export const ALL_TABS = [...NAV.flatMap((g) => g.items), ...FOOTER_NAV];
export const labelOf = (id: TabId) => ALL_TABS.find((t) => t.id === id)?.label ?? "";
export const isTab = (s: string): s is TabId => ALL_TABS.some((t) => t.id === s);
