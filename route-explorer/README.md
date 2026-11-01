# Route explorer

An interactive map of riding circuits: grayscale shaded relief, thin roads, coloured circuits,
restrained labels. React + TypeScript, SVG, D3 zoom. First region: Ladakh and Himachal Pradesh.

## Run

```
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/route-explorer.html, one self-contained page
```

## How it is put together

```
src/
  components/
    MapCanvas.tsx        projection (Mercator fitted to the region), D3 zoom, base layers
    RouteLayer.tsx       circuits: casing + line + wide hit path, hover/select highlight
    LocationMarkers.tsx  markers and labels in screen space, priority + collision culling
    MapControls.tsx      zoom in / out / reset, true scale bar
    RoutePanel.tsx       circuit toggles, leg list with gaps, place details, layers, missing data, sources
  data/
    regions/ladakh-himachal.json   hand-written region config: bbox, locations + their source, circuits as waypoint legs
    generated/                     output of scripts/prepare_region.py (do not edit)
    regions.ts                     region registry; the renderer only sees a Region
    locations.ts circuits.ts boundaries.ts types.ts
  styles/map.css
scripts/
  fetch_dem.py           downloads Terrain Tiles for the region bbox
  prepare_region.py      builds terrain image, rivers, roads, boundaries, resolves locations, routes circuits
  inline.mjs             inlines the build into one HTML page
```

## Geographic rules

* No coordinate is typed by hand. Each location in the config names its dataset
  (route checkpoint, OpenStreetMap node id, GeoNames record, OSM road, or a pass derived
  as the summit of a mapped road on the terrain model). A location with `"source": null`
  is listed as missing and never placed.
* Circuits are routed along real road geometry between waypoints. A leg is not drawn when
  an end has no coordinate, when no road lies within 3 km (8 km for lakes), or when the
  only connection is a detour longer than 2.2 x the straight distance + 25 km.
* Boundaries are Natural Earth 1:10m lines drawn with Natural Earth's own classes.

## Circuits from the reference map

`data/raw/reference/circuits-map-original.webp` is the circuit map the routes come from.
`scripts/trace_reference.py` extracts each colour's line; `scripts/reference_points.py` holds the
hand-read stop positions, the drawn legs (`DRAWN`) and the warp control points; `scripts/reference_trace.py`
warps the drawing onto the map (thin-plate spline on the basemap's city dots plus known places) and,
leg by leg, uses a real road where one links the two stops, otherwise the drawn line.
Run `python3 scripts/trace_reference.py` before `npm run data` after changing the image.

## Missing data in this build (before the reference map)

Siachen Base Camp, Panamik, Turtuk, Lamayuru, Wari La, Durbuk, Satso Lake, Hemis, Maan,
Zangla, Tso Kar, Photi La, Gombo Ranjan, Suraj Tal, Demchok, Nurbula, Komik have no
coordinate in the datasets this build could reach. Roads missing from the data: Sankoo to
Rangdum, Taglang La to Nyoma, Nyoma to Mahe, the Karzok shore road, Tabo to Gue.
To fill a gap, add the dataset (for example an OpenStreetMap extract for Ladakh) to
`data/raw`, point the location's `source` at it, and run `npm run data`.

## Adding a region

1. Write `src/data/regions/<id>.json` (bbox, locations with sources, circuits).
2. `python3 scripts/fetch_dem.py` (reads the bbox), then `npm run data -- <id>`.
3. Register the generated JSON and terrain image in `src/data/regions.ts`.
The region selector appears in the panel once there are two regions.
