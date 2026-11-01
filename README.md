# Project Altitude

A rider's field guide to Ladakh and Himachal Pradesh: four riding circuits, the villages and passes between them, and what you need to ride them.

## What is in this repository

| Folder | What it is |
|---|---|
| `/` (root) | The guide web app: nav rail, guide content (villages, food, stays, emergency, packing, commute, circuits, gems) and the interactive route map. React + TypeScript + Vite. Responsive: three panels on desktop, Guide/Map switch on phones. |
| `route-explorer/` | The data pipeline and standalone app for the route map (terrain, roads, boundaries, circuits traced from the reference map). Its generated data is copied into `src/map/data/generated/` for the guide. |
| `ride-map/` | The 3D relief ride map (Three.js) where a rider marks the roads they rode or imports GPX/KML. |

## Run the guide

```
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/project-altitude.html, one self-contained page
```

Content lives in `src/content/` (`places.ts`, `guide.ts`) and can be edited without touching layout.
Sections marked "Draft" in the app (A note, Story, Meet the Creator, Swags, T&C) are placeholders for the creator's own words.

## Known gaps

* The logo in `src/components/Logo.tsx` is a stand-in until the original asset is added to `src/assets/`.
* Route positions traced from the reference map are approximate (about 10 km); see `route-explorer/README.md`.

## Data and credits

Terrain Tiles (AWS Open Data), OpenStreetMap contributors (ODbL), Natural Earth, GeoNames (CC BY 4.0), and route lines from scroll-route-demo by Aditya Sharma (MIT).
