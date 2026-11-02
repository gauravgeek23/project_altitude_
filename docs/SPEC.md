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
├── scripts/icons.cjs     renders public/icon.svg to the PNG icons and the social-preview image public/og.png
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
| Projection | `MapCanvas.tsx` | Mercator. At zoom 1, every tier-1 stop fits the panel; the relief always covers the panel. Tier-0 places (K2, Nanga Parbat) are drawn but not part of the fit. |
| Zoom range | `MapCanvas.tsx` | From `minK` (the whole northern crown, 72.3–80.6° E, 32–37.2° N) up to 28×. Panning stops at the relief's edge. |
| Zoom tiers | `LocationMarkers.tsx` `TIER_ZOOM = [0, 0, 2.2, 4]` | Tiers 0 and 1 always show; tier 2 appears from 2.2×, tier 3 from 4×. The selected place always shows. |
| Labels | `LocationMarkers.tsx` | Screen-space pills with the type icon. Placed by priority (selected, then hub, then highlight, then on the active circuit). Hidden when they collide, or fall under the search box, filter bar, controls or scale bar. |
| Circuit filter | `MapPanel.tsx` | All · Zanskar · Nubra · Changthang · Spiti. Picking a circuit, or clicking its line, shows it alone and frames it. A click on empty map, "All", the same circuit again, or Reset shows all four. |
| Circuit hover | `RouteLayer.tsx`, `MapCanvas.tsx` | Hovering a line (or a circuit card) lifts that circuit and fades the others; leaving it restores every circuit. The lines keep their DOM order (the active one is redrawn on top as a copy without pointer events), and the SVG clears the hover on any move off a line, so the faded state can't stick. |
| Search row | `MapPanel.tsx` | Left to right: the search box, the petrol-pump toggle, then **Filters**, the dark primary button (it carries the most weight: the map source and which kinds of place to show, so it reads as the main control). The row and the circuit bar share one grid column (`.map-top`): the bar's natural width sets the column, the search box stretches to it, so Filters ends flush with the bar. The results list and the Filters panel drop down over the bar. |
| Filters | `MapPanel.tsx` | The panel under the Filters button: the map source (terrain, satellite sources), and which kinds of place to show (villages and towns, passes, peaks, lakes, landmarks, monasteries). |
| Petrol pumps | `MapPanel.tsx`, `content/fuel.ts` | The pump button between the search box and Filters marks every pump in `FUEL_STOPS` with a green badge under the place's dot (amber where reports disagree). The card shows the fuel note. |
| Monasteries | `LocationMarkers.tsx` | Map kind `monastery`: an icon on its own, no tag; the name appears on hover, the card on a click. Shown at every zoom (they ignore the zoom tiers): an icon only waits for a closer zoom where it would sit under a tag, on a dot or on another monastery icon. |
| Peaks | `LocationMarkers.tsx` | Map kind `peak`: the name in plain text (▲ Name) with no marker, placed where it does not collide; clickable. 59 summits across the riding area and the ranges around it (Ladakh, Zanskar, Nubra and the Saser and Rimo groups, the Karakoram giants, Nanga Parbat, the Kashmir, Lahaul, Kullu, Chamba and Kinnaur summits). Tier 0 for K2 and Nanga Parbat (always on, outside the default frame), tier 1 for Nun, Saser Kangri, Stok Kangri and Reo Purgyil, tier 2 for the other famous summits, 3 for the rest. Published positions may lie outside the location `bbox` as long as they fall on the relief (`on_relief` in `prepare_region.py`). |
| States | `MapCanvas.tsx` `.region-area` | Hovering Ladakh or Himachal tints it 18% and darkens its name. |
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
| `--paper` / `--panel` | `#fff` / `#f3f4f6` | `#0d0f12` / `#13161a` | Nav rail / reading panel |
| `--card` / `--soft` | `#fff` / `#e9ebef` | `#1a1e24` / `#262c34` | Cards / quiet fills inside a card (practical details, card footers, alternate table rows) |
| `--card-selected` | `#fff3c4` | `#33301f` | The selected card (the map's yellow, softened) |
| `--rule` | `#e4e7eb` | `#272c33` | Kept for the odd hairline on the map and the legend; the reading panel itself uses no borders (see Surfaces) |
| `--accent` | `#e3241b` | `#ff4b3e` | Umling La, SOS, compass north |
| `--float` | white 95% | near-black 92% | Floating map controls |
| `--on-ink` | `#fff` | `#0d0f12` | Text on an `--ink` surface |

**Map-only tokens** (on `.map-col` and `.legend`): `--town #ffe03a`, `--pass #17181a`, `--lake #4fe3ef`, `--boundary`, `--road`, `--river`, and `--tag-ink`. These are the same in both themes: the map is not themed (see Dark mode).

### Surfaces, not strokes
The reading panel separates things by colour, not by lines: the panel is `--panel` grey, cards are white `--card` on it, and anything quieter inside a card (the practical block, the card footer, stats, alternate rows of a table or itinerary, legend samples) is `--soft`. There are no borders on cards, chips, inputs, callouts or dividers; the selected card turns `--card-selected`, and a circuit card that is on takes a 12% tint of its circuit colour. Keep it that way when adding components: reach for a background tone before a stroke.

### Icons and metadata
- `public/icon.svg` is the site mark (redrawn as vector from the original icon). `node scripts/icons.cjs` renders `icon-512.png`, `icon-192.png`, `icon-32.png`, `apple-touch-icon.png` and the 1200×630 social preview `og.png`.
- `index.html` links the icons and sets Open Graph tags; `og:image` needs an absolute URL: `vite.config.ts` fills in `VITE_SITE_URL`, which defaults to `https://project-altitude.vercel.app`; set it in Vercel to the real domain.

### Dark mode
- **Toggle:** in the nav footer, and in the mobile top bar.
- **Default:** follows the system until the reader picks a theme. The pick is saved in `localStorage` (`altitude-theme`), and `index.html` applies it before the first paint.
- **The map is universal:** it is not themed. The relief, every satellite source (Esri, Sentinel-2, NASA Blue Marble, MapTiler, Mapbox, Google), the boundaries, the tags and the peak names look the same in dark mode as in light. Only the floating controls, the search row, the legend swatches and the place card follow the theme.

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
  - Type icon, circuit dots and a chevron (the hint that the card opens; it turns when it does) in the header.
  - A card with a photo shows the photo while closed (the 640 px version, lazy-loaded) instead of its context line; the context appears at the top of the body once the card is open. A click on the closed card, photo included, opens it; on an open card a click on the photo opens the full-screen view. A card without a photo shows its context line while closed, as before.
  - **"Practical details"** is folded away by default, with a count of filled fields.
  - "Show on map →" at the foot (or a note that the place has no sourced position yet). Status and sources stay in the record but are not displayed.
- **Storage:** packing lists, trip plan and km/day are kept in `localStorage`, with every access wrapped in try/catch.

---

## 10. Known gaps and next steps

- **Positions still to verify:** Nurbula, Hamta Pass, Stok Kangri, Kang Yatse, Deo Tibba, Hikkim, Chicham, Losar, Batal, Rumtse and Tsaga La are approximate, and marked "verify" in their source text; so are the summits Matho Kangri, Gangstang, Indrasan, Mentok Kangri and Friendship Peak, and the monastery at Sani. The published peak positions come from Wikipedia, GeoNames, PeakVisor, Mapcarta and DBpedia and have not been checked against a survey sheet. Parkachik and Bogdang have no position yet.
- **Peaks beyond the riding area:** K2, Broad Peak, the Gasherbrums, Masherbrum, Rakaposhi, Haramosh and Nanga Parbat are shown for the skyline on the crown view. Drop them from the region config if the map should stay with the ridable ranges.
- **Approximate geometry:** the Nimmu–Padum road and the Nubra valley legs follow valley floors on the terrain model, not surveyed road lines. Replace them when road data is available.
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
