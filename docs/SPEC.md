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
- **Desktop:** three columns. The nav rail is 214 px, the reading panel takes what is left, and the map takes 50% of the width. Defined in `.app` in `src/styles/app.css`.
- **Below 900 px:** a top bar (logo, title, theme toggle, menu) shows one view at a time. A floating **Guide / Map** switch sits at the bottom, and the menu opens as a drawer.

### Content rules
These come from the content blueprint and are not negotiable:
- **Never invent facts.** That covers current road status, pass elevations, fuel availability, business names, contact numbers, prices, permit rules, medical facilities and journey times.
- **Unknown fields stay unknown.** They display "Not verified" and are never filled with assumptions.
- **Every factual field carries a status and sources.** The statuses are `verified`, `sourced`, `editorial` and `needs_verification`.
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
├── docs/SPEC.md          this file
├── src/
│   ├── App.tsx           layout, tab routing (#hash), selected place / circuit state, theme
│   ├── nav.ts            tab ids, nav groups and labels (Circuits first, then Map legend…)
│   ├── components/
│   │   ├── Sidebar.tsx       nav rail and mobile drawer, theme toggle in the footer
│   │   ├── Tabs.tsx          every guide page, including the Map legend
│   │   ├── MapPanel.tsx      map overlays: search, circuit filter, layers, place card, SOS
│   │   ├── icons.tsx         the icon language (one SVG path per kind of place)
│   │   ├── PlacePhoto.tsx    a place's photo; click opens the gallery
│   │   ├── Lightbox.tsx      full-screen gallery: arrows, swipe, thumbnails, Esc
│   │   ├── ThemeToggle.tsx   light/dark: system default, reader's pick saved
│   │   └── Logo.tsx
│   ├── content/          everything the guide says, as data
│   │   ├── types.ts      PlaceRecord, Practical, Verification, ContactRecord
│   │   ├── places.ts     PLACES, PASSES, PEAKS, CIRCUIT_META, labels
│   │   ├── facts.ts      sourced practical facts (fuel, medical, network, stay) with links
│   │   ├── guide.ts      all page copy: story, food, dishes, stays, emergency, packing…
│   │   └── images.ts     photo sources (own photos, Wikipedia, Commons, Openverse, Google)
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
- **Optional environment variables** (Vercel → Project Settings → Environment Variables):
  - `VITE_GOOGLE_CSE_KEY` and `VITE_GOOGLE_CSE_CX` turn on Google image results; see §7.
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
- **`locations`:** each entry has `id`, `name`, `kind` (`town | pass | peak | lake | poi | via`), an optional `tier` (1–3), an optional `hub`, and a `source`. The `source.dataset` value is one of:

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
  - `PASSES`: passes.
  - `PEAKS`: peaks.
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
| Projection | `MapCanvas.tsx` | Mercator. At zoom 1, every tier-1 stop fits the panel; the relief always covers the panel. |
| Zoom range | `MapCanvas.tsx` | From `minK` (the whole northern crown, 72.3–80.6° E, 32–37.2° N) up to 28×. Panning stops at the relief's edge. |
| Zoom tiers | `LocationMarkers.tsx` `TIER_ZOOM = [0, 1, 2.2, 4]` | Tier 1 always shows; tier 2 appears from 2.2×, tier 3 from 4×. The selected place always shows. |
| Labels | `LocationMarkers.tsx` | Screen-space pills with the type icon. Placed by priority (selected, then hub, then highlight, then on the active circuit). Hidden when they collide, or fall under the search box, filter bar, controls or scale bar. |
| Circuit filter | `MapPanel.tsx` | All · Zanskar · Nubra · Changthang · Spiti. Picking a circuit, or clicking its line, shows it alone and frames it. A click on empty map, "All", the same circuit again, or Reset shows all four. |
| Layers | `MapPanel.tsx` | Show or hide villages and towns, passes, peaks, lakes and landmarks. |
| States | `MapCanvas.tsx` `.region-area` | Hovering Ladakh or Himachal tints it 10% and darkens its name. |
| Satellite | `MapCanvas.tsx` `SatelliteTiles` | Hybrid view, like Google's: Esri World Imagery, the relief multiplied on top for mountain shading, Esri's road overlay (roads only, no boundaries), city names, and India's official boundaries in white. Tiles load in the reader's browser; attribution switches with it. |
| Orientation cities | `MapCanvas.tsx` `CITIES` | Srinagar, Jammu, Gilgit, Skardu, Dharamshala, Amritsar, Lahore and others, as plain labels for orientation. Not stops, not clickable. |
| Compass | `MapCanvas.tsx` `Compass` | Fixed; north is always up. |
| Search | `MapPanel.tsx` | Names that start with the query, then names containing it, then region matches. Enter picks the first result. |
| Place card | `MapPanel.tsx` | Type icon, photo, terrain-model height (m and ft), circuits, summary, access warning, "Open the full entry". |

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

## 7. Photos (`src/content/images.ts`)

**Order of preference for the card photo:**
1. **Your own photos:** `PHOTOS[id]`.
2. **The Wikipedia lead image** for the titles in `WIKI[id]`.
3. **The first search hit:** Google (if configured), then Wikimedia Commons, then Openverse.

**Gallery:** clicking any photo opens the full-screen gallery. It shows the lead image, then the article's other images, then Google, Commons and Openverse results for the place's name and region. Duplicates are removed, up to 30 images.

**Google images** need two values, then a rebuild:
1. Create a Programmable Search Engine with image search turned on, and note its engine id (the CX).
2. Create a Custom Search JSON API key.
3. Set `VITE_GOOGLE_CSE_KEY` and `VITE_GOOGLE_CSE_CX` in Vercel and rebuild.

**Licensing:**
- Every photo shows its source and a "preview image" note.
- Google and Openverse results can be copyrighted or need attribution.
- **Before release,** replace previews with your own photos (`PHOTOS`), or check each licence.
- The browser caches results in `localStorage` (`altitude-photo-cache-v3`); change the key to refresh.

---

## 8. Design system

### Tokens (`src/styles/app.css` `:root`, `dark.css`)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--ink` | `#2d2d2d` | `#eceef2` | Text, active states |
| `--grey` | `#6f7883` | `#9aa3ae` | Secondary text |
| `--paper` / `--panel` | `#fff` / `#fbfbfb` | `#0d0f12` / `#13161a` | Nav rail / reading panel |
| `--card` / `--soft` | `#fff` / `#f2f4f6` | `#1a1e24` / `#20252c` | Cards / quiet fills |
| `--rule` | `#e4e7eb` | `#272c33` | Borders |
| `--accent` | `#e3241b` | `#ff4b3e` | Umling La, SOS, compass north |
| `--float` | white 95% | near-black 92% | Floating map controls |
| `--on-ink` | `#fff` | `#0d0f12` | Text on an `--ink` surface |

**Map-only tokens** (on `.map-col` and `.legend`): `--town #ffe03a`, `--pass #17181a`, `--lake #4fe3ef`, `--boundary`, `--road`, `--river`, and `--tag-ink`. The tag ink stays dark in both themes, because tags keep their colours.

### Dark mode
- **Toggle:** in the nav footer, and in the mobile top bar.
- **Default:** follows the system until the reader picks a theme. The pick is saved in `localStorage` (`altitude-theme`), and `index.html` applies it before the first paint.
- **Map in dark mode:** the relief image is inverted and darkened with a CSS filter, and boundaries, casings and halos flip.

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
| About | A note, Story, How to use, Credits |
| Guide | **Circuits**, **Map legend**, Villages, Passes & Peaks, Eat & Drink, Stays, Emergency, Packing, Commute, Gems |
| Shop | Swags |
| Footer | Meet the Creator, T&C |

- **Place cards:**
  - Type icon and circuit dots in the header.
  - The photo loads only when a card is opened.
  - **"Practical details"** is folded away by default, with a count of filled fields.
  - Sources and the verification badge at the foot.
- **Storage:** packing lists, trip plan and km/day are kept in `localStorage`, with every access wrapped in try/catch.

---

## 10. Known gaps and next steps

- **Positions still to verify:** Nurbula, Hamta Pass, Stok Kangri, Kang Yatse, Deo Tibba, the Kinnaur Kailash range, Hikkim, Chicham, Losar, Batal, Rumtse and Tsaga La are approximate, and marked "verify" in their source text. Parkachik and Bogdang have no position yet.
- **Approximate geometry:** the Nimmu–Padum road and the Nubra valley legs follow valley floors on the terrain model, not surveyed road lines. Replace them when road data is available.
- **Practical fields:** about 35 places have sourced fuel, medical, network or stay facts; the rest show "Not verified".
- **Restaurants:** "Handpicked places" on Eat & Drink is waiting for the creator's picks.
- **Photos:** previews only; see §7 before release.

---

## 11. Sources and attribution

- AWS Terrain Tiles (SRTM, GMTED and others): relief and elevations.
- OpenStreetMap contributors (ODbL): roads and settlements.
- scroll-route-demo by Aditya Sharma (MIT): route lines and checkpoints.
- Natural Earth (public domain): India point-of-view boundary, states and lakes.
- GeoNames (CC BY 4.0).
- Esri World Imagery: the satellite view (Esri, Maxar, Earthstar Geographics).
- Wikipedia and Wikimedia Commons, Openverse, and Google Programmable Search: preview images. Each shows its credit.
- Place coordinates: each location's `source` text cites its origin (Wikipedia articles, route checkpoints, the ASI list of monuments, Wikivoyage, PeakVisor).
