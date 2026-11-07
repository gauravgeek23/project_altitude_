# Project Altitude: specification and handover

This is the one document to read before working on Project Altitude. It covers what the product is, how it is built, where every piece of data comes from, and how to change things safely.

Last updated: 2 November 2026.

---

## 1. Product in one page

Project Altitude is a rider's field guide to **Ladakh and Himachal Pradesh**, built around four motorcycle circuits:

| Circuit | Colour | Character | Base |
|---|---|---|---|
| Zanskar | `#1f3fe0` blue | Suru valley, Pensi La, Padum. Returns to Leh on the new Nimmu–Padum road, or goes over Shinku La to Darcha. The circuit ends at Darcha. | Kargil / Padum |
| Nubra | `#9b2fd1` purple | Khardung La, Diskit, Hunder, Turtuk, Sumur, Panamik, Siachen Base Camp, Wari La | Leh |
| Changthang | `#e3241b` red | Chang La, Pangong, Chushul, Loma, Hanle, Photi La, Umling La, Tso Moriri, Tso Kar, Manali–Leh highway | Leh |
| Spiti | `#1e9a4b` green | Atal Tunnel, Chandratal, Kaza, Tabo, Nako, Kalpa, Chitkul, Sarahan, Shimla, Chandigarh | Manali / Shimla |

**Hubs:** Leh, Manali and Chandigarh are drawn larger than other places and always shown.

### Screen layout
- **Desktop:** three columns. The nav rail is 214 px, the reading panel takes what is left, and the map takes 50% of the width. Defined in `.app` in `src/styles/app.css`. **Full map:** the "Full map view" pill in the map's bottom-right corner makes the map take the whole window; in that mode it reads "Detailed view" (`.app.full`: the nav and the reading panel are hidden, the map column fills the grid); the pill again, Escape, or opening a full entry brings the guide back. North is always up; there is no compass. The map keeps its state, since it is the same component resized.
- **Below 900 px:** a top bar (logo, title, theme toggle, menu) shows one view at a time. A floating **Guide / Map** switch sits at the bottom, and the menu opens as a drawer.

### Content rules
These come from the content blueprint and are not negotiable:
- **Never invent facts.** That covers current road status, pass elevations, fuel availability, business names, contact numbers, prices, permit rules, medical facilities and journey times.
- **Unknown fields stay unknown.** They display "Not verified" and are never filled with assumptions.
- **Every factual field carries a status and sources.** The statuses are `verified`, `sourced`, `editorial` and `needs_verification`. They live in the data (`status`, `sources`, `last_verified` on each record); the place cards no longer print the badge, the "checked online" date or the source list (removed on the creator's request). The legend keeps the Access flag and the "Re-verify" badge used by the emergency contacts and the Gems list.
- **No sensitive coordinates.** Don't publish coordinates for sensitive wildlife sites or restricted military areas.
- **Boundaries follow India's official view.** India includes Gilgit-Baltistan and Aksai Chin (as part of Ladakh), the area administered by Pakistan (as part of Jammu & Kashmir), and the Shaksgam valley.

---

## 2. Repository map

```
/                         the guide web app (React 18 + TypeScript + Vite 5)
├── index.html            sets the saved theme before the first paint (no white flash)
├── vite.config.ts        normal build for Vercel; SINGLE_FILE=1 builds one inlined page
├── vercel.json           framework vite, npm run build, output dist/
├── scripts/inline.mjs    inlines CSS and JS into dist/project-altitude.html (React from cdnjs)
├── scripts/photos.py     lists the shared album, makes contact sheets, builds public/photos and the manifest
├── scripts/icons.cjs     renders public/icon.png (the creator's icon) to the favicon sizes and the social-preview image public/og.png
├── scripts/photo-selection.json  which album photos go with which place, with captions
├── public/photos/        the photos, two sizes each (served as /photos/...)
├── docs/SPEC.md          this file
├── src/
│   ├── App.tsx           layout, tab routing (#hash), selected place / circuit state, theme
│   ├── nav.ts            tab ids, nav groups and labels (Circuits first, then Map legend…)
│   ├── components/
│   │   ├── Sidebar.tsx       nav rail and mobile drawer, theme toggle in the footer
│   │   ├── Tabs.tsx          every guide page, including the Map legend
│   │   ├── MapPanel.tsx      map overlays: search, petrol pumps, filters, circuit filter, place card, SOS
│   │   ├── icons.tsx         the icon language (one SVG path per kind of place)
│   │   ├── PlacePhoto.tsx    a place's photo with a count; click opens the gallery
│   │   ├── PrayerFlags.tsx   the prayer flags hung above the logo in the rail (canvas)
│   │   ├── Lightbox.tsx      full-screen gallery: arrows, swipe, thumbnails, Esc
│   │   ├── ThemeToggle.tsx   light/dark: system default, reader's pick saved
│   │   └── Logo.tsx
│   ├── content/          everything the guide says, as data
│   │   ├── types.ts      PlaceRecord, Practical, Verification, ContactRecord
│   │   ├── places.ts     PLACES, PASSES, PEAKS, CIRCUIT_META, labels
│   │   ├── facts.ts      sourced practical facts (fuel, medical, network, stay) with links
│   │   ├── fuel.ts       the petrol pumps on the circuits, for the fuel layer
│   │   ├── guide.ts      all page copy: story, food, dishes, stays, emergency, packing…
│   │   ├── images.ts     photos from the ride, by place (reads photos.json)
│   │   └── photos.json   generated manifest of the photos (see §7)
│   ├── map/
│   │   ├── MapCanvas.tsx       projection, zoom, terrain/satellite, boundaries, labels, compass
│   │   ├── RouteLayer.tsx      circuit lines
│   │   ├── LocationMarkers.tsx dots and name tags (screen space, collision-culled, zoom tiers)
│   │   ├── MapControls.tsx     zoom, reset, satellite toggle, scale bar
│   │   ├── map.css             map styles
│   │   └── data/               types, helpers and generated/ (copied from route-explorer)
│   └── styles/
│       ├── app.css       layout, tokens (light), components
│       └── dark.css      dark theme tokens and overrides
├── route-explorer/       the data pipeline (Python) and its standalone viewer
│   ├── scripts/          prepare_region.py, reference_trace.py, reference_points.py, fetch_dem.py
│   ├── src/data/regions/ladakh-himachal.json   the region config: places, circuits, bboxes
│   └── data/raw/         downloaded datasets (git-ignored except the reference drawing)
└── ride-map/             earlier 3D relief prototype (Three.js); not part of the guide
```

---

## 3. Run, build, deploy

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # dist/: what Vercel deploys
npm run build:single   # dist/project-altitude.html: one self-contained page
```

- **Vercel:** builds from `main` using `vercel.json`. Pushing to `main` deploys.
- **Git identity:** commit as the repository owner (`gauravgeek23 <48709686+gauravgeek23@users.noreply.github.com>`) so the work is credited on GitHub's contribution graph; GitHub counts a commit only when its author email belongs to the account. A session that commits as `Claude <noreply@anthropic.com>` leaves no mark. Co-author trailers are fine on top of that.
- **Optional environment variables** (Vercel → Project Settings → Environment Variables):
  - `VITE_MAPTILER_KEY`, `VITE_MAPBOX_TOKEN` and `VITE_GOOGLE_MAPS_KEY` add those satellite sources; see §6.1.

---

## 4. Data pipeline (map data)

The map never invents geometry. Everything in `src/map/data/generated/` is produced by:

```bash
cd route-explorer
python3 scripts/fetch_dem.py                 # terrain tiles for terrainBbox (once)
python3 -I scripts/prepare_region.py         # writes src/data/generated/*
cp src/data/generated/* ../src/map/data/generated/
```

Python needs `numpy`, `scipy`, `Pillow` and `shapely`.

### 4.1 Inputs (`route-explorer/data/raw/`)

| Folder | Dataset | Used for |
|---|---|---|
| `dem10/` | AWS Terrain Tiles (terrarium, zoom 10) | Shaded relief, elevations, rivers, lake detection, pass and peak snapping, valley routing |
| `routes/` | scroll-route-demo (MIT): road polylines and named checkpoints | The road graph; accurate checkpoint coordinates |
| `osm/` | OpenStreetMap extracts (Himachal roads, settlements) | Roads, some settlements |
| `ne/` | Natural Earth admin-0 lines and lakes | Lakes (the old boundary lines are no longer drawn) |
| `ne-admin1/` | Natural Earth **India point-of-view** countries, admin-1 polygons and lines | India's official boundary, state polygons, state lines, hover areas |
| `geonames/` | GeoNames cities1000 | Basemap control dots for the warp |
| `reference/` | The creator's circuit map and its traced pixels | Which roads each circuit takes |

### 4.2 Region config (`src/data/regions/ladakh-himachal.json`)
- **`bbox`:** the core area. **`terrainBbox`:** the relief area, `[72.0, 27.6, 81.8, 38.4]`. It covers the whole northern crown, so the map can zoom out that far.
- **`locations`:** each entry has `id`, `name`, `kind` (`town | pass | peak | lake | poi | via`), an optional `tier` (0–3; 0 = always shown but outside the default framing, used for K2 and Nanga Parbat), an optional `hub`, and a `source`. The `source.dataset` value is one of:

| `dataset` | Meaning |
|---|---|
| `route-checkpoint` | A named checkpoint in the route data |
| `osm-settlement` | An OpenStreetMap node |
| `published` | Coordinates from a cited source (`cite`). An optional `"snap": "route"` puts the place on the nearest circuit line if it is within 3 km. |
| `approx` | An approximate position, refined by `snap`: `route` (nearest road), `pass` (highest road point nearby), `peak` (summit nearby), `lake` (lowest point), `flat` (flattest ground near a pass), or `none` |
| `terrain-pass`, `terrain-lake`, `terrain-saddle` | Derived from the terrain model |
| `null` | Read off the reference drawing; avoid this, it can be about 10 km out |

### 4.3 How circuits are drawn (`reference_trace.py`, `reference_points.py`)
- **`DRAWN`** lists each circuit as runs of stops.
- **Each leg uses, in order of preference:**
  1. **The road graph's path,** if it is not a long detour.
  2. **Map-matching** of the traced line onto roads.
  3. **The traced line itself.**
- **The line always bends in to meet each stop,** within 8 km.
- **`TERRAIN_LEGS`** are legs with no road data. They follow the valley floor through a least-cost path over the terrain model. Current terrain legs:
  - Diskit → Sumur → Panamik → Siachen BC
  - Diskit → Hunder → Turtuk
  - Diskit → Wari La
  - Loma → Hanle → Photi La → Umling La
  - Zangla → Chilling → Nimmu (the new Nimmu–Padum road)
- **Places that are not stops** get a `near` list: the circuits whose line passes within 3 km.

### 4.4 Boundaries and states (`prepare_region.py`: `official_india`, `boundaries`, `regions`)
- **India outline:** Natural Earth `ne_10m_admin_0_countries_ind`, the India point of view. This becomes the international boundary.
- **State polygons:**
  - **Jammu & Kashmir:** admin-1 Jammu and Kashmir plus Azad Kashmir.
  - **Ladakh:** everything else in India's northern territory, which includes Gilgit-Baltistan, Aksai Chin and Shaksgam.
  - **Himachal, Punjab, Uttarakhand and the other states:** as published.
- **State lines:** the shared edges between neighbouring states, drawn as dashed lines.
- **Hover areas:** `regions` holds the Ladakh and Himachal polygons, which tint on hover.

### 4.5 Output (`ladakh-himachal.json`)
`terrain` (image and bounds), `roads`, `rivers`, `boundaries` (`land`: international; `state`), `regions`, `locations`, `circuits` (legs → segments with `source`: `road | traced | terrain | gap`), `sources`.

---

## 5. Content model (`src/content/`)

```ts
PlaceRecord {
  id, name, aka?, type: village | town | pass | peak | lake | landmark,
  circuits: CircuitId[], region, summary, why,
  practical: { fuel, food, stay, network, medical, bestTime, riderNotes },   // null = "Not verified"
  access,               // permit or restriction warning, shown prominently
  elevation_m,          // official figure only once verified; the UI otherwise shows the terrain model
  mapId,                // the map location id (usually = id)
  neighbours, status, sources: {label,url}[], last_verified
}
```

- **Where records live:**
  - `PLACES`: villages, towns, lakes and landmarks.
  - `PASSES`: the 22 passes, on the circuits or a detour from them (Zoji La, Rohtang La, Jalori Pass, Marsimik La and Polokongka La were added from Wikipedia, Wikidata and, for Polokongka La, an approximate position on the Tso Kar road).
  - `PEAKS`: peaks (on the map only; the Passes page lists passes alone).
  - All are created with small helpers (`P`, `pass`, `peak`).
- **`facts.ts`** merges sourced practical facts into records at load time. A merged record gets status `sourced` and the date it was checked online.
- **Page copy** lives in `guide.ts`, never inside components. `DISHES` feeds the Eat & Drink page.

### Add a place
1. **Map position:** add a location to the region config with a `published` source (with `cite`), then run the pipeline (§4).
2. **Guide entry:** add a record to `PLACES`, `PASSES` or `PEAKS` with the same id.
3. **Photo (optional):** add Wikipedia titles to `WIKI[id]` in `images.ts`, or your own photo to `PHOTOS[id]`.
4. **Facts (optional):** add sourced facts to `facts.ts`.

---

## 6. Map behaviour

| Feature | Where | Notes |
|---|---|---|
| Projection | `MapCanvas.tsx` | Mercator. At zoom 1, every tier-1 stop fits the panel; the relief always covers the panel. Tier-0 places (K2, Nanga Parbat) are drawn but not part of the fit. The map **opens on the crown view** (`crown`, scale `minK`), Reset returns to it, and the last step out lands on it. |
| Zoom range | `MapCanvas.tsx` | From `minK` up to 28×. `minK` frames the whole northern crown (72.3–80.6° E, 32–37.2° N) but is never smaller than the scale at which the relief covers the whole panel, so the map can't be zoomed out to show anything past the relief's edge, in any panel size; panning stops at the relief's edge too. |
| Zoom tiers | `LocationMarkers.tsx` `TIER_ZOOM = [0, 0, 2.2, 4]` | Tiers 0 and 1 always show; tier 2 appears from 2.2×, tier 3 from 4×. The selected place always shows. With exactly one kind ticked in Filters, every place of that kind is on the map at every zoom (`showAll`), so "Monasteries" alone shows all 17 at once; with two or more kinds ticked the tiers apply as usual. Labels still give way to each other where they collide. |
| Reveal | `MapCanvas.tsx`, `LocationMarkers.tsx` | Once per page load the map shows the relief and the routes alone for 2.2 s; then the places come out one after another (each 14 ms after the last, up to 0.9 s), rising a little as they fade in, and the city, state and country names fade in with them. |
| Labels | `LocationMarkers.tsx` | Screen-space pills with the type icon. Placed by priority (selected, then the pinned ones, then on the active circuit). Hidden when they collide, or fall under the search box, filter bar, controls or scale bar. **Pinned:** the hubs (Leh, Manali, Chandigarh) and Umling La always carry their name, at every zoom; icons move out of their way. |
| Circuit filter | `MapPanel.tsx` | All · Zanskar · Nubra · Changthang · Spiti. Picking a circuit, or clicking its line, shows it alone and frames it. A click on empty map, "All", the same circuit again, or Reset shows all four. |
| Circuit hover | `RouteLayer.tsx`, `MapCanvas.tsx` | Hovering a line (or a circuit card) lifts that circuit and fades the others; leaving it restores every circuit. The lines keep their DOM order (the active one is redrawn on top as a copy without pointer events), and the SVG clears the hover on any move off a line, so the faded state can't stick. |
| Search row | `MapPanel.tsx` | Left to right: the search box, the petrol-pump toggle, then **Filters**, the dark primary button (it carries the most weight: the map source and which kinds of place to show, so it reads as the main control). The row and the circuit bar share one grid column (`.map-top`): the bar's natural width sets the column, the search box stretches to it, so Filters ends flush with the bar. The results list and the Filters panel drop down over the bar. |
| Filters | `MapPanel.tsx`, `map/kinds.ts` | The kinds the map shows are owned by `App` and handed to both the map and the guide pages, so a page can set them: Passes has a "Passes only on the map" switch (narrows the map to passes, restored when the page is left). The panel under the Filters button: the map source as radio rows, and which kinds of place to show as checkboxes (villages and towns, passes, peaks, lakes, landmarks, monasteries, petrol pumps). No notes. It closes on a click or tap anywhere outside the search block (map, cards, the reading panel), on Escape, or on the button again. |
| Petrol pumps | `MapPanel.tsx`, `content/fuel.ts`, `LocationMarkers.tsx` | "Petrol pumps" is a kind in the Show list (the pump button beside the search box toggles the same thing). A shown town gets a green badge under its dot (amber where reports disagree); a town that is filtered out stands as a pump marker on its own, so the map can show the pumps alone. The card shows the fuel note. |
| Monasteries | `LocationMarkers.tsx` | Map kind `monastery`: an icon on its own, no tag; the name appears on hover, the card on a click. Four main ones (Karsha, Spituk, Samstanling, Kungri) are tier 1 and show at every zoom; the rest come in at 2.2× (tier 2) and 4× (tier 3), so the routes stay readable when zoomed out. Icons ease apart from each other, from dots and out of tags. |
| Peaks | `LocationMarkers.tsx` | Map kind `peak`: the name in plain text (▲ Name) with no marker, placed where it does not collide; clickable. 59 summits across the riding area and the ranges around it (Ladakh, Zanskar, Nubra and the Saser and Rimo groups, the Karakoram giants, Nanga Parbat, the Kashmir, Lahaul, Kullu, Chamba and Kinnaur summits). Tier 0 for K2 and Nanga Parbat (always on, outside the default frame), tier 1 for Nun, Saser Kangri, Stok Kangri and Reo Purgyil, tier 2 for the other famous summits, 3 for the rest. Published positions may lie outside the location `bbox` as long as they fall on the relief (`on_relief` in `prepare_region.py`). |
| States and neighbours | `MapCanvas.tsx` `.region-area` | Hovering Ladakh (amber) or Himachal (green) tints it 18% and darkens its name. The neighbours are tinted always: China flag red, Pakistan flag green, Nepal the blue of its flag's border, Afghanistan a smoky black; each is named. The country areas follow India's official map, so Gilgit-Baltistan and Aksai Chin are not part of them. |
| Satellite | `MapCanvas.tsx` `SatelliteTiles` | Hybrid view, like Google's: Esri World Imagery, the relief multiplied on top for mountain shading, Esri's road overlay (roads only, no boundaries), city names, and India's official boundaries in white. Tiles load in the reader's browser; attribution switches with it. |
| Orientation cities | `MapCanvas.tsx` `CITIES` | Srinagar, Jammu, Gilgit, Skardu, Dharamshala, Amritsar, Lahore and others, as plain labels for orientation. Not stops, not clickable. |
| Search | `MapPanel.tsx` | Names that start with the query, then names containing it, then region matches. Enter picks the first result. |
| Map footer | `MapPanel.tsx` | Only the scale bar. The SOS button, the planning note and the attribution line are gone from the map; the data sources, satellite imagery included, are credited on the Credits page, and Emergency is reached from the nav. |
| Place card | `MapPanel.tsx` | Kind line and close button on top; then the essentials on the left (name, terrain-model height in m and ft, circuit chips, fuel note, access warning) and a bare 72 × 96 thumbnail on the right that opens the photo full screen; "Open the full entry" below. No summary text. |

### 6.1 Satellite sources (`src/map/basemaps.ts`)

Pick one under **Layers → Map**. The globe button switches between Terrain and the last satellite source used.

| Source | Key | Detail | Terms |
|---|---|---|---|
| Esri World Imagery (default) | none | Sharpest free imagery, to about z18 | Free to display with attribution |
| Sentinel-2 cloudless 2016 (EOX) | none | Even, cloud-free 10 m colours; best for the whole region; to z14 | CC BY 4.0 (the 2016 edition; later editions are non-commercial) |
| NASA Blue Marble (GIBS) | none | Shaded-relief overview for the crown view; to z8 | NASA imagery, credit NASA |
| MapTiler satellite-v2 | `VITE_MAPTILER_KEY` | High-resolution | Free plan is non-commercial; paid plans for commercial use |
| Mapbox Satellite | `VITE_MAPBOX_TOKEN` | High-resolution (Maxar Vivid at z13–16) | Free tier, then pay per tile |
| Google (Map Tiles API) | `VITE_GOOGLE_MAPS_KEY`, billing on | Google's own satellite imagery, with India as the region for borders | Google Maps Platform terms; Google's labels replace the road overlay |

Keyed sources stay hidden until their key is set. Each source shows its attribution in the map footer while in use. Do not use unofficial Google tile URLs (`mt*.google.com`): they break Google's terms.

---

## 7. Photos (`scripts/photos.py`, `scripts/photo-selection.json`, `src/content/images.ts`)

All photographs are the creator's own, from the ride: the shared Google Photos album "Project Altitude" (1,544 items, 23 June to 31 August 2026).

- **Files:** `public/photos/<place>-<n>.jpg` (1,600 px on the long side) and `<place>-<n>-s.jpg` (640 px), served by the site itself. 66 photos: one per place, three for the story page and two for the creator's. (`<n>` is the photo's number in the original selection, so the numbers have gaps.)
- **Manifest:** `src/content/photos.json`, generated. For each place id: file paths, the album URL, size, date and caption.
- **Selection:** `scripts/photo-selection.json`. For each key, the album items (Google media id, URL, size, time) with captions. Keys are place ids, dish ids (`dish-momo`…), and `story` and `creator` for those pages.
- **In the app:** `photosFor(id)` returns a place's photos. `PlacePhoto` shows the lead photo (or the one at `index`); a click opens `Lightbox` (full screen; with several photos it has arrows, swipe, thumbnails, Esc). A place without a photo shows no image: nothing is borrowed from other sites.
- **One photo per place.** The creator's rule: a place gets one picture, two at most. First choice is a landscape of the place, or the creator in riding gear in front of it; only when neither exists, something else (a sign, a statue, a building). The card crops to 16:9 (centre), so prefer photos that survive that crop; portrait rider shots work when the helmet and flag sit in the middle third.
- **Single-file page:** it cannot carry the images, so it loads the same pictures from the album (`=w1600-h1600-no`). That needs the album to stay shared by link.

### Adding or changing photos
1. `python3 scripts/photos.py list <share link>` lists the album into `scripts/album-items.json`. The album must be shared by link.
2. `python3 scripts/photos.py sheets` makes numbered contact sheets in `/tmp/altitude-sheets` to choose from.
3. Edit `scripts/photo-selection.json`: under the place id, put the entry copied from `album-items.json` (`id`, `url`, `w`, `h`, `ts`, `tz`) with a `caption`. One per place (see above); replacing a photo means replacing the entry.
4. `python3 scripts/photos.py build` downloads both sizes and rewrites the manifest. Commit `public/photos/` and `src/content/photos.json`.

Google strips location data from photos shared by link, so the first selection was matched by time and by recognising the places. The creator should check the captions, and the few placements made by inference (listed in the commit that added them).

---

## 8. Design system

### Tokens (`src/styles/app.css` `:root`, `dark.css`)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--ink` | `#2d2d2d` | `#eceef2` | Text, active states |
| `--grey` | `#6f7883` | `#9aa3ae` | Secondary text |
| `--paper` / `--panel` | `#fff` / `#fbfbfc` | `#0d0f12` / `#13161a` | Nav rail / reading panel |
| `--card` / `--soft` | `#fff` / `#e9ebef` | `#1a1e24` / `#262c34` | Cards / quiet fills inside a card (practical details, card footers, alternate table rows) |
| `--card-selected` | `#fff3c4` | `#33301f` | The flash of a card just opened from the map (the map's yellow, softened); the card settles back to white |
| `--rule` | `#e4e7eb` | `#272c33` | Kept for the odd hairline on the map and the legend; the reading panel itself uses no borders (see Surfaces) |
| `--accent` | `#e3241b` | `#ff4b3e` | Umling La, SOS, compass north |
| `--float` | white 95% | near-black 92% | Floating map controls |
| `--on-ink` | `#fff` | `#0d0f12` | Text on an `--ink` surface |

**Map-only tokens** (on `.map-col` and `.legend`): `--town #ffe03a`, `--pass #17181a`, `--lake #4fe3ef`, `--boundary`, `--road`, `--river`, and `--tag-ink`. These are the same in both themes: the map is not themed (see Dark mode).

### Surfaces, not strokes
The reading panel separates things by colour, not by lines: the panel is `--panel` grey, cards are white `--card` on it, and anything quieter inside a card (the practical block, the card footer, stats, alternate rows of a table or itinerary, legend samples) is `--soft`. There are no borders on cards, chips, inputs, callouts or dividers; a card just opened from the map blinks `--card-selected` twice (2.2 s) and settles back to `--card`, and a circuit card that is on takes a 12% tint of its circuit colour. Keep it that way when adding components: reach for a background tone before a stroke.

### Icons and metadata
- `public/icon.png` is the creator's own icon (82 × 84), used as is for the favicon. `node scripts/icons.cjs` renders `icon-32.png`, `apple-touch-icon.png` (180, upscaled) and the 1200×630 social preview `og.png` from it. No redrawn version is used.
- `index.html` links the icons and sets Open Graph tags; `og:image` needs an absolute URL: `vite.config.ts` fills in `VITE_SITE_URL`, which defaults to `https://project-altitude.vercel.app`; set it in Vercel to the real domain.

### Dark mode
- **Toggle:** in the nav footer, and in the mobile top bar.
- **Default:** follows the system until the reader picks a theme. The pick is saved in `localStorage` (`altitude-theme`), and `index.html` applies it before the first paint.
- **Only the terrain map is themed.** In dark mode the relief is inverted and darkened, with boundaries, roads, rivers, city, state and country names, peak names and tags adjusted (`dark.css`, scoped to `.map-area:not(.sat)`). Every satellite source (Esri, Sentinel-2, NASA Blue Marble, MapTiler, Mapbox, Google) looks the same in both themes. The floating controls, the search row and the place card follow the theme in either case.

### Icon language (`src/components/icons.tsx`)
- **Glyphs:** village (house), town (gabled hall), pass (saddle with flag), peak (summit with snow line), lake (waves), landmark (pin with star), food (fork and knife).
- **Grid:** 24 px, 2 px round strokes.
- **One path per kind,** used for map tags (`MapIcon`) and in HTML (`PlaceIcon`).
- **In HTML,** icons sit in tinted 24 px tiles (`.type-icon.<kind>`).

### Map tag styles (`src/map/map.css`)
- Town or village: yellow.
- Pass: black with white text.
- Highlight: red.
- Lake: cyan.
- Peak: white.
- Hub: black with a yellow border and yellow bold text.
- Selected: inverted, lifted, and the dot pulses.

### Typography
- **Font:** Helvetica Neue / system sans throughout.
- **Reading panel: size follows colour.** Black (`--ink`) text is **16 px** (26 px line height) and grey (`--grey`) text is **14 px** (22 px line height).
  - **How it works:** every element in the panel inherits its size. The rules at the end of `app.css` give each ink-coloured or grey-coloured class its matching size; they were generated from the colour rules in the same file.
  - **Adding a class with a new text colour:** add it to the matching list.
  - **Unchanged:** small uppercase labels, badges, chips and toggle buttons, photo captions and legend samples keep their own sizes. Page titles are 16 px.
- **Nav:** 14 px items, 7 px apart, with 22 px between groups.

---

## 9. Guide pages (`src/nav.ts`, `src/components/Tabs.tsx`)

| Group | Pages |
|---|---|
| About | A note (one photo, a letter, the numbers), Start here (three moves, a real card, the one rule), Map legend |
| Guide | **Circuits** (the four circuit cards; no summary table), Villages, Passes, **On the Road** (getting there, where to stay, what to eat, as three sections; `#commute`, `#stays` and `#food` open it at the section), **Gear Up** (the packing lists, motorcycle essentials included; `#packing` opens it), **Hidden gems**, Emergency |
| Shop | Swags |
| Footer | Meet the Creator (who he is, and the story of the ride: `#story` opens it); then T&C · Credits on one line |

- **Place cards:**
  - Circuit dots, then the type icon, at the right of the header. No open/close indicator: the whole header is the toggle.
  - The header is two columns: name, kind and two lines of context on the left; on the right, a portrait thumbnail of the place's photo (72 × 96 px, centre-cropped, no caption; the 640 px version, lazy-loaded). The left side adds up to the same 96 px (26 + 26 + 44), so the two sides match. A card without a photo has the left column alone.
  - A click on the thumbnail opens the full-screen view (with the caption), whether the card is open or closed; a click anywhere else on the header opens or closes the card. Open, the context shows in full and the body follows.
  - The practical facts are listed plainly (elevation, then each practical field that has a value); a field with nothing known is left out, and a place with nothing known shows no list.
  - A filled **Show on map** button at the foot, the full width of the card (no block around it; no icon). Status, sources and neighbours stay in the record but are not displayed.
- **Directory filter:** the search box and the circuit bar above a list look like the map's own (white search field, the same circuit bar with its dots); the bar fills the column and scrolls sideways when the column is narrower than its buttons.
- **Hidden gems:** `GEMS.list` in `guide.ts` is a list of `Gem` entries (title, free-text category, circuit, nearest place, summary, optional photo id). The page filters by category and by circuit with the same bars; a card shows title, category, the nearest place as a link, the summary (or "To research" until one is written) and a thumbnail when a photo exists under the gem's id.
- **Storage:** packing lists, trip plan and km/day are kept in `localStorage`, with every access wrapped in try/catch.

---

## 10. Known gaps and next steps

- **Positions still to verify:** Nurbula, Hamta Pass, Polokongka La, Stok Kangri, Kang Yatse, Deo Tibba, Hikkim, Chicham, Losar, Batal, Rumtse and Tsaga La are approximate, and marked "verify" in their source text; so are the summits Matho Kangri, Gangstang, Indrasan, Mentok Kangri and Friendship Peak, and the monastery at Sani. The published peak positions come from Wikipedia, GeoNames, PeakVisor, Mapcarta and DBpedia and have not been checked against a survey sheet. Parkachik uses the position of a guesthouse in the village (Mapcarta, OSM node 763056584), village-level accuracy; Bogdang has Wikipedia's position.
- **Lakes:** Kyagar Tso, Startsapuk Tso, Mirpal Tso, Dashair Lake, Dhankar Lake and Nako Lake have published positions (Wikipedia, Wikidata, OpenStreetMap via Mapcarta); Deepak Tal has OpenStreetMap's position (Dozam Tso, by Patseo); Sissu Lake is placed at the village it adjoins. Yaye Tso, Lang Tso (beside Stat Tso at Pensi La) and Yarab Tso (above Panamik) have no published coordinate yet and are not on the map.
- **Peaks beyond the riding area:** K2, Broad Peak, the Gasherbrums, Masherbrum, Rakaposhi, Haramosh and Nanga Parbat are shown for the skyline on the crown view. Drop them from the region config if the map should stay with the ridable ranges.
- **Approximate geometry:** the Nimmu–Padum road, the Nubra valley legs and the Indus road from Demchok back to Loma via Koyul and Dungti follow valley floors on the terrain model, not surveyed road lines. Replace them when road data is available.
- **Practical fields:** about 35 places have sourced fuel, medical, network or stay facts; the rest show "Not verified".
- **Restaurants:** "Handpicked places" on Eat & Drink is waiting for the creator's picks.
- **Photos:** places without a photo from the ride show none. Captions and a few inferred placements are for the creator to check (§7).

---

## 11. Sources and attribution

- AWS Terrain Tiles (SRTM, GMTED and others): relief and elevations.
- OpenStreetMap contributors (ODbL): roads and settlements.
- scroll-route-demo by Aditya Sharma (MIT): route lines and checkpoints.
- Natural Earth (public domain): India point-of-view boundary, states and lakes.
- GeoNames (CC BY 4.0).
- Esri World Imagery: the satellite view (Esri, Maxar, Earthstar Geographics).
- Photographs: Gaurav Kumar, from the ride (§7).
- Place coordinates: each location's `source` text cites its origin (Wikipedia articles, route checkpoints, the ASI list of monuments, Wikivoyage, PeakVisor).
