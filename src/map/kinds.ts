/** The kinds of place the map can show, in the order the Filters panel lists them. */
export const MAP_KINDS: { id: string; label: string }[] = [
  { id: "town", label: "Villages & towns" }, { id: "pass", label: "Passes" }, { id: "peak", label: "Peaks" }, { id: "lake", label: "Lakes" },
  { id: "poi", label: "Landmarks" }, { id: "monastery", label: "Monasteries" }, { id: "fuel", label: "Petrol pumps" },
];
export const allKinds = () => new Set(MAP_KINDS.map((k) => k.id));
/** true when the map is narrowed to this one kind */
export const onlyKind = (kinds: Set<string>, id: string) => kinds.size === 1 && kinds.has(id);
