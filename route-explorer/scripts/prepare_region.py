"""Build the generated data for one region from free, citable datasets.

Inputs (data/raw):
  dem10/      Terrain Tiles, terrarium encoding, zoom 10 (AWS Open Data; Mapzen/SRTM and others)
  routes/     Road-following route polylines + named checkpoints, scroll-route-demo (MIT)
  osm/        OpenStreetMap extracts for Himachal: trunk/primary roads, settlements (ODbL)
  ne/         Natural Earth 1:10m boundary lines, disputed-area claim lines, lakes (public domain)
  geonames/   GeoNames cities1000 via reverse_geocoder (CC BY 4.0)

Outputs:
  src/data/generated/<region>-terrain.jpg   shaded relief, Web Mercator, exact bounds in the JSON
  src/data/generated/<region>.json     roads, rivers, boundaries, resolved locations, routed circuits

Rule: no coordinate is typed by hand. A location without a dataset entry stays missing,
and a circuit leg whose ends are missing, or which the road data cannot connect, is
reported as missing instead of being drawn.
"""
import csv, glob, heapq, json, math, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REGION = sys.argv[1] if len(sys.argv) > 1 else "ladakh-himachal"
CFG = json.load(open(f"{ROOT}/src/data/regions/{REGION}.json"))
W, S, E, N = CFG["bbox"]
Z = CFG["terrainZoom"]
RAW = f"{ROOT}/data/raw"


def hav(a, b):
    (x1, y1), (x2, y2) = a, b
    p1, p2 = math.radians(y1), math.radians(y2)
    h = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(math.radians(x2 - x1) / 2) ** 2
    return 2 * 6371.0 * math.asin(math.sqrt(min(1, h)))


def inside(p, pad=0.0):
    return W - pad <= p[0] <= E + pad and S - pad <= p[1] <= N + pad


# ------------------------------------------------------------------ terrain (Web Mercator)
def mx(lon): return (lon + 180) / 360 * 2 ** Z * 256
def my(lat):
    r = math.radians(lat)
    return (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * 2 ** Z * 256
def lat_of(py):
    n = math.pi - 2 * math.pi * py / (2 ** Z * 256)
    return math.degrees(math.atan(math.sinh(n)))


def load_mosaic():
    tiles = glob.glob(f"{RAW}/dem{Z}/*_*.png")
    xs = sorted({int(os.path.basename(t).split("_")[0]) for t in tiles})
    ys = sorted({int(os.path.basename(t).split("_")[1][:-4]) for t in tiles})
    x0, y0 = xs[0], ys[0]
    M = np.zeros(((ys[-1] - y0 + 1) * 256, (xs[-1] - x0 + 1) * 256), np.float32)
    for t in tiles:
        x, y = int(os.path.basename(t).split("_")[0]), int(os.path.basename(t).split("_")[1][:-4])
        a = np.asarray(Image.open(t).convert("RGB"), np.float32)
        M[(y - y0) * 256:(y - y0 + 1) * 256, (x - x0) * 256:(x - x0 + 1) * 256] = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
    return M, x0 * 256, y0 * 256


M, MX0, MY0 = load_mosaic()


def elev(lon, lat):
    px, py = mx(lon) - MX0 - 0.5, my(lat) - MY0 - 0.5
    i, j = int(py), int(px)
    if not (0 <= i < M.shape[0] - 1 and 0 <= j < M.shape[1] - 1): return float("nan")
    fy, fx = py - i, px - j
    return float(M[i, j] * (1 - fx) * (1 - fy) + M[i, j + 1] * fx * (1 - fy) + M[i + 1, j] * (1 - fx) * fy + M[i + 1, j + 1] * fx * fy)


def crop_box():
    x0, x1 = int(math.floor(mx(W))) - MX0, int(math.ceil(mx(E))) - MX0
    y0, y1 = int(math.floor(my(N))) - MY0, int(math.ceil(my(S))) - MY0
    return x0, x1, y0, y1


# ------------------------------------------------------------------ lakes, from the terrain and Natural Earth
def point_in_ring(x, y, ring):
    c = False; j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i]; xj, yj = ring[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi: c = not c
        j = i
    return c


def water_mask(C):
    """Flat water in SRTM-derived DEMs is a plateau of one value. Connected plateaus of
    >= 40 cells (about 1.5 km2 at z10) above 2500 m are lakes; below that, reservoirs
    come from Natural Earth polygons."""
    H, Wd = C.shape
    mask = np.zeros(C.shape, bool)
    seen = np.zeros(C.shape, bool)
    flat = np.zeros(C.shape, bool)
    d = np.abs(np.diff(C, axis=1)); flat[:, :-1] |= d < 0.6; flat[:, 1:] &= True
    f2 = (np.abs(C[:, 1:-1] - C[:, :-2]) < 0.6) & (np.abs(C[:, 1:-1] - C[:, 2:]) < 0.6)
    f3 = (np.abs(C[1:-1, :] - C[:-2, :]) < 0.6) & (np.abs(C[1:-1, :] - C[2:, :]) < 0.6)
    flat = np.zeros(C.shape, bool); flat[1:-1, 1:-1] = f2[1:-1, :] & f3[:, 1:-1]
    lakes = []
    for i0, j0 in zip(*np.nonzero(flat & (C > 2500))):
        if seen[i0, j0]: continue
        lvl = C[i0, j0]; stack = [(i0, j0)]; seen[i0, j0] = True; cells = []
        while stack:
            i, j = stack.pop(); cells.append((i, j))
            for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                a, b = i + di, j + dj
                if 0 <= a < H and 0 <= b < Wd and not seen[a, b] and abs(C[a, b] - lvl) < 0.6:
                    seen[a, b] = True; stack.append((a, b))
        if len(cells) >= 40:
            ii = np.array([c[0] for c in cells]); jj = np.array([c[1] for c in cells])
            mask[ii, jj] = True
            lakes.append({"cells": len(cells), "level": float(lvl), "ci": float(ii.mean()), "cj": float(jj.mean())})
    return mask, lakes


def ne_lakes_mask(shape, x0, y0):
    d = json.load(open(f"{RAW}/ne/ne_10m_lakes.geojson"))
    mask = np.zeros(shape, bool); names = []
    for f in d["features"]:
        g = f["geometry"]
        for poly in (g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]):
            ring = poly[0]
            if not any(inside(p) for p in ring): continue
            pr = [(mx(x) - MX0 - x0, my(y) - MY0 - y0) for x, y in ring]
            img = Image.new("L", (shape[1], shape[0]), 0)
            from PIL import ImageDraw
            ImageDraw.Draw(img).polygon(pr, fill=255)
            for h in poly[1:]:
                ImageDraw.Draw(img).polygon([(mx(x) - MX0 - x0, my(y) - MY0 - y0) for x, y in h], fill=0)
            mask |= np.asarray(img) > 0
            names.append(f["properties"].get("name") or "(unnamed)")
    return mask, names


def build_terrain():
    x0, x1, y0, y1 = crop_box()
    C = M[y0:y1, x0:x1].astype(np.float32)
    wm, lakes = water_mask(C)
    nm, ne_names = ne_lakes_mask(C.shape, x0, y0)
    water = wm | nm
    # multidirectional hillshade, soft and light like a printed topo map
    lat_mid = math.radians((S + N) / 2)
    cell = 40075016.7 * math.cos(lat_mid) / (2 ** Z * 256)       # metres per pixel
    gy, gx = np.gradient(C, cell)
    slope = np.arctan(np.hypot(gx, gy) * 1.6)
    aspect = np.arctan2(-gx, gy)
    shade = np.zeros_like(C)
    for az, wgt in ((315, 0.5), (270, 0.2), (360, 0.2), (225, 0.1)):
        a = math.radians(az); alt = math.radians(42)
        shade += wgt * (math.sin(alt) * np.cos(slope) + math.cos(alt) * np.sin(slope) * np.cos(a - aspect - math.pi / 2))
    shade = np.clip(shade, 0, 1)
    flatness = np.cos(slope)
    v = 253 - (1 - shade) * 92 - (1 - flatness) * 10
    v = np.clip(v, 150, 253)
    v[water] = 178
    img = Image.fromarray(v.astype(np.uint8), "L")
    scale = 0.72
    img = img.resize((int(img.width * scale), int(img.height * scale)), Image.LANCZOS)
    out = f"{ROOT}/src/data/generated/{REGION}-terrain.jpg"
    img.save(out, quality=78, optimize=True, progressive=True)
    # exact geographic bounds of the cropped pixels
    bounds = [(x0 + MX0) / (2 ** Z * 256) * 360 - 180, lat_of(y1 + MY0), (x1 + MX0) / (2 ** Z * 256) * 360 - 180, lat_of(y0 + MY0)]
    lake_pts = []
    for l in lakes:
        lake_pts.append({"lon": (l["cj"] + x0 + MX0) / (2 ** Z * 256) * 360 - 180, "lat": lat_of(l["ci"] + y0 + MY0),
                         "cells": l["cells"], "level": l["level"]})
    print("terrain", img.size, os.path.getsize(out) // 1024, "KiB", "terrain lakes", len(lakes), "NE lakes", ne_names)
    return bounds, lake_pts


# ------------------------------------------------------------------ rivers (D8 on a coarse lon/lat grid)
def build_rivers():
    R, Cn = 700, 560
    lats = np.linspace(N, S, R); lons = np.linspace(W, E, Cn)
    G = np.array([[elev(lo, la) for lo in lons] for la in lats], np.float64)
    G = np.nan_to_num(G, nan=0)
    rows, cols = G.shape
    filled = G.copy(); done = np.zeros(G.shape, bool); pq = []
    for r in range(rows):
        for c in (0, cols - 1): heapq.heappush(pq, (filled[r, c], r, c)); done[r, c] = True
    for c in range(1, cols - 1):
        for r in (0, rows - 1): heapq.heappush(pq, (filled[r, c], r, c)); done[r, c] = True
    order = []; nb = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
    while pq:
        h, r, c = heapq.heappop(pq); order.append((r, c))
        for dr, dc in nb:
            a, b = r + dr, c + dc
            if 0 <= a < rows and 0 <= b < cols and not done[a, b]:
                done[a, b] = True; filled[a, b] = max(filled[a, b], h + 1e-3); heapq.heappush(pq, (filled[a, b], a, b))
    down = {}
    for r, c in order:
        best, bd = 0.0, None
        for dr, dc in nb:
            a, b = r + dr, c + dc
            if 0 <= a < rows and 0 <= b < cols:
                drop = (filled[r, c] - filled[a, b]) / (1.4142 if dr and dc else 1)
                if drop > best: best, bd = drop, (a, b)
        if bd: down[(r, c)] = bd
    acc = np.ones(G.shape)
    for r, c in reversed(order):
        if (r, c) in down: a, b = down[(r, c)]; acc[a, b] += acc[r, c]
    T = 1100
    heads = [(acc[r, c], r, c) for r in range(rows) for c in range(cols) if acc[r, c] >= T and
             not any((r + dr, c + dc) in down and down[(r + dr, c + dc)] == (r, c) and acc[r + dr, c + dc] >= T for dr, dc in nb)]
    heads.sort(reverse=True)
    seen = set(); out = []
    for _, r, c in heads:
        pts = []
        while True:
            pts.append((r, c));
            if (r, c) in seen or (r, c) not in down: break
            seen.add((r, c)); r, c = down[(r, c)]
        if len(pts) < 3: continue
        xy = [(float(lons[c]), float(lats[r])) for r, c in pts]
        for _ in range(2):
            n = [xy[0]]
            for (a, b), (c2, d2) in zip(xy, xy[1:]): n += [(0.75 * a + 0.25 * c2, 0.75 * b + 0.25 * d2), (0.25 * a + 0.75 * c2, 0.25 * b + 0.75 * d2)]
            n.append(xy[-1]); xy = n
        w = min(3, max(0, int(math.log2(acc[pts[-2]] / T))))
        out.append({"w": w, "c": [[round(x, 4), round(y, 4)] for x, y in xy[::2] + [xy[-1]]]})
    print("rivers", len(out))
    return out


# ------------------------------------------------------------------ roads and the routing graph
ROUTE_FILES = sorted(glob.glob(f"{RAW}/routes/*.json"))
ROUTES = {}
for f in ROUTE_FILES:
    try: d = json.load(open(f))
    except Exception: continue
    if isinstance(d, dict) and d.get("polyline"):
        ROUTES[os.path.basename(f)[:-5]] = d


def dp(pts, tol_km):
    if len(pts) < 3: return pts
    k = 111.32 * math.cos(math.radians((S + N) / 2))
    P = [(x * k, y * 110.57) for x, y in pts]
    keep = [False] * len(pts); keep[0] = keep[-1] = True; st = [(0, len(pts) - 1)]
    while st:
        i, j = st.pop(); (ax, ay), (bx, by) = P[i], P[j]; dx, dy = bx - ax, by - ay; L = math.hypot(dx, dy) or 1e-9
        best, kk = 0, -1
        for m in range(i + 1, j):
            dd = abs(dy * (P[m][0] - ax) - dx * (P[m][1] - ay)) / L
            if dd > best: best, kk = dd, m
        if best > tol_km: keep[kk] = True; st += [(i, kk), (kk, j)]
    return [p for p, f in zip(pts, keep) if f]


def runs_inside(pts, pad=0.05):
    out, cur = [], []
    for p in pts:
        if inside(p, pad): cur.append(tuple(p[:2]))
        else:
            if len(cur) > 1: out.append(cur)
            cur = []
    if len(cur) > 1: out.append(cur)
    return out


def all_road_lines():
    lines = []
    for slug, d in ROUTES.items():
        for run in runs_inside(d["polyline"]): lines.append((run, "route"))
    osm = json.load(open(f"{RAW}/osm/osm_roads.geojson"))
    for f in osm["features"]:
        g = f["geometry"]; cls = "trunk" if f["properties"].get("highway") == "trunk" else "primary"
        for l in ([g["coordinates"]] if g["type"] == "LineString" else g["coordinates"]):
            for run in runs_inside(l): lines.append((run, cls))
    return lines


CELL = 0.0015


def build_graph(lines):
    key = lambda p: (round(p[0] / CELL), round(p[1] / CELL))
    acc, adj = {}, {}
    for pts, _ in lines:
        dense = [pts[0]]
        for a, b in zip(pts, pts[1:]):
            n = max(1, int(hav(a, b) / 0.12))
            dense += [(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n) for i in range(1, n + 1)]
        prev = None
        for p in dense:
            k = key(p); s = acc.setdefault(k, [0.0, 0.0, 0]); s[0] += p[0]; s[1] += p[1]; s[2] += 1
            if prev is not None and prev != k:
                adj.setdefault(prev, set()).add(k); adj.setdefault(k, set()).add(prev)
            prev = k
    pos = {k: (v[0] / v[2], v[1] / v[2]) for k, v in acc.items()}
    print("graph nodes", len(pos))
    return pos, adj


def nearest_node(pos, p, max_km):
    best, bd = None, max_km
    k0 = (round(p[0] / CELL), round(p[1] / CELL)); r = int(max_km / 0.14) + 1
    for dx in range(-r, r + 1):
        for dy in range(-r, r + 1):
            k = (k0[0] + dx, k0[1] + dy)
            if k in pos:
                d = hav(p, pos[k])
                if d < bd: bd, best = d, k
    return best, bd


def shortest(pos, adj, a, b):
    dist = {a: 0.0}; prev = {}; pq = [(0.0, a)]; tgt = pos[b]
    while pq:
        d, u = heapq.heappop(pq)
        if u == b: break
        if d > dist.get(u, 1e18): continue
        for v in adj.get(u, ()):
            nd = d + hav(pos[u], pos[v])
            if nd < dist.get(v, 1e18):
                dist[v] = nd; prev[v] = u; heapq.heappush(pq, (nd + 0 * hav(pos[v], tgt), v))
    if b not in dist: return None, None
    path = [b]
    while path[-1] != a: path.append(prev[path[-1]])
    path.reverse()
    return [pos[k] for k in path], dist[b]


# ------------------------------------------------------------------ locations
def checkpoint(name):
    for slug, d in ROUTES.items():
        for c in d.get("checkpoints", []):
            if c["name"] == name: return (c["lon"], c["lat"]), f"Route checkpoint “{name}”, scroll-route-demo/{slug}"
    return None, None


def osm_settlement(osm_id):
    for f in OSM_SETTLEMENTS["features"]:
        if f["properties"].get("osm_id") == osm_id:
            c = f["geometry"]["coordinates"]; return (c[0], c[1]), f"OpenStreetMap node {osm_id} ({f['properties'].get('place')})"
    return None, None


def osm_road(name):
    for f in OSM_ROADS["features"]:
        if f["properties"].get("name") == name:
            g = f["geometry"]; c = g["coordinates"] if g["type"] == "LineString" else g["coordinates"][0]
            mid = c[len(c) // 2]; return (mid[0], mid[1]), f"OpenStreetMap way {f['properties'].get('osm_id')} “{name}” (midpoint)"
    return None, None


def geonames(name, admin1):
    for r in csv.DictReader(open(f"{RAW}/geonames/rg_cities1000.csv")):
        if r["name"] == name and r["admin1"] == admin1 and r["cc"] == "IN":
            return (float(r["lon"]), float(r["lat"])), f"GeoNames cities1000 “{name}”, {admin1}"
    return None, None


def terrain_pass(src):
    d = ROUTES[src["route"]]; pl = d["polyline"]
    a_name, b_name = src["between"]
    def idx(name):
        c = next(c for c in d["checkpoints"] if c["name"] == name)
        return min(range(len(pl)), key=lambda i: (pl[i][0] - c["lon"]) ** 2 + (pl[i][1] - c["lat"]) ** 2)
    i0, i1 = sorted((idx(a_name), idx(b_name)))
    seg = pl[i0:i1 + 1]
    cum = [0.0]
    for a, b in zip(seg, seg[1:]): cum.append(cum[-1] + hav(a, b))
    skip = src.get("skipKm", 0)
    prof = [elev(*p) for p in seg]
    # smooth over ~1 km, then find summits with >= 150 m prominence on both sides
    sm = []
    for i in range(len(seg)):
        js = [j for j in range(max(0, i - 15), min(len(seg), i + 16)) if abs(cum[j] - cum[i]) <= 0.6]
        sm.append(sum(prof[j] for j in js) / len(js))
    peaks = []
    for i in range(len(seg)):
        if cum[i] < skip or cum[-1] - cum[i] < max(1, src.get("skipEndKm", 0)): continue
        win = [j for j in range(len(seg)) if abs(cum[j] - cum[i]) <= 3]
        if sm[i] < max(sm[j] for j in win): continue
        left = min(sm[j] for j in range(0, i + 1)) ; right = min(sm[j] for j in range(i, len(seg)))
        if sm[i] - max(left, right) >= 80: peaks.append((sm[i], i))
    peaks.sort(reverse=True)
    top = sorted(peaks[:src.get("of", 1)], key=lambda t: t[1])
    if "order" in src: pick = top[src["order"] - 1] if len(top) >= src["order"] else None
    else: pick = top[src.get("rank", 1) - 1] if top else None
    if not pick: return None, None
    p = seg[pick[1]]
    label = (f"Derived: summit of the road between {a_name} and {b_name} on the terrain model"
             + (f" ({src['order']} of {src.get('of', 1)} along the road)" if "order" in src else " (highest point)"))
    return (p[0], p[1]), label


def terrain_lake(name, lake_pts, near_ll):
    best = None
    for l in lake_pts:
        if l["cells"] < 80: continue
        dd = hav(near_ll, (l["lon"], l["lat"]))
        if best is None or dd < best[0]: best = (dd, l)
    if not best or best[0] > 40: return None, None
    l = best[1]
    return (l["lon"], l["lat"]), f"Derived: centre of the flat water body nearest Puga (OSM) on the terrain model; identified as {name}, verify"


def resolve_locations(lake_pts):
    out = []
    for L in CFG["locations"]:
        s = L.get("source"); coord, label = None, None
        if s:
            ds = s["dataset"]
            if ds == "route-checkpoint": coord, label = checkpoint(s["key"])
            elif ds == "osm-settlement": coord, label = osm_settlement(s["osm_id"])
            elif ds == "osm-road": coord, label = osm_road(s["key"])
            elif ds == "geonames": coord, label = geonames(s["key"], s["admin1"])
            elif ds == "terrain-pass": coord, label = terrain_pass(s)
            elif ds == "terrain-lake":
                puga, _ = osm_settlement(342114939)
                coord, label = terrain_lake(L["name"], lake_pts, puga)
        rec = {k: v for k, v in L.items() if k != "source"}
        if coord and inside(coord):
            rec.update({"lon": round(coord[0], 5), "lat": round(coord[1], 5), "elev": round(elev(*coord)), "source": label})
        else:
            rec.update({"lon": None, "lat": None, "elev": None,
                        "source": None, "missing": "No coordinate in the datasets available to this build" if not s else "Source lookup failed"})
        out.append(rec)
    print("locations", sum(1 for r in out if r["lon"] is not None), "placed,", sum(1 for r in out if r["lon"] is None), "missing")
    return out


# ------------------------------------------------------------------ circuits
def route_circuits(locs, pos, adj):
    by = {l["id"]: l for l in locs}
    circuits = []
    for c in CFG["circuits"]:
        legs = []
        for wp in c["legs"]:
            known = [w for w in wp if by[w]["lon"] is not None]
            unplaced = [w for w in wp if by[w]["lon"] is None]
            segs = []
            ends_ok = by[wp[0]]["lon"] is not None and by[wp[-1]]["lon"] is not None
            if not ends_ok:
                segs.append({"from": wp[0], "to": wp[-1], "status": "missing-location",
                             "reason": "Leg ends at a place with no sourced coordinate: " + ", ".join(by[w]["name"] for w in (wp[0], wp[-1]) if by[w]["lon"] is None)})
            else:
                for a, b in zip(known, known[1:]):
                    pa, pb = (by[a]["lon"], by[a]["lat"]), (by[b]["lon"], by[b]["lat"])
                    ra = 8.0 if by[a]["kind"] == "lake" else 3.0; rb = 8.0 if by[b]["kind"] == "lake" else 3.0
                    na, da = nearest_node(pos, pa, ra); nb_, db = nearest_node(pos, pb, rb)
                    if na is None or nb_ is None:
                        far = [by[x]["name"] for x, n in ((a, na), (b, nb_)) if n is None]
                        segs.append({"from": a, "to": b, "status": "missing-road", "reason": "No road geometry within 3 km of " + ", ".join(far)}); continue
                    path, km = shortest(pos, adj, na, nb_)
                    if not path:
                        segs.append({"from": a, "to": b, "status": "missing-road", "reason": "The road datasets do not connect these two places"}); continue
                    straight = hav(pa, pb)
                    if km > 2.2 * straight + 25:
                        segs.append({"from": a, "to": b, "status": "missing-road",
                                     "reason": f"The road data only links these by a {round(km)} km detour; the direct road ({round(straight)} km apart) is missing"}); continue
                    path = dp(path, 0.02)
                    if da < 0.3: path = [pa] + path
                    if db < 0.3: path = path + [pb]
                    note = "; ".join(f"road ends {d:.1f} km from {by[x]['name']}" for x, d in ((a, da), (b, db)) if d >= 1.0)
                    segs.append({"from": a, "to": b, "status": "ok", "km": round(km, 1), "note": note,
                                 "coords": [[round(x, 5), round(y, 5)] for x, y in path]})
            legs.append({"waypoints": wp, "unplaced": unplaced, "segments": segs})
        km = sum(s.get("km", 0) for l in legs for s in l["segments"])
        circuits.append({k: v for k, v in c.items() if k != "legs"} | {"legs": legs, "km": round(km)})
        miss = sum(1 for l in legs for s in l["segments"] if s["status"] != "ok")
        print(f"circuit {c['id']}: {round(km)} km routed, {miss} missing segments")
    return circuits


# ------------------------------------------------------------------ boundaries
def boundaries():
    out = []
    for f, kind in (("ne_10m_admin_0_boundary_lines_land", "land"), ("ne_10m_admin_0_boundary_lines_disputed_areas", "claim")):
        d = json.load(open(f"{RAW}/ne/{f}.geojson"))
        for ft in d["features"]:
            p = ft["properties"]; g = ft["geometry"]
            cls = (p.get("FEATURECLA") or p.get("featurecla") or "").replace(" (please verify)", "").replace(" (verify)", "")
            note = p.get("NOTE") or p.get("note") or p.get("NAME") or ""
            for l in ([g["coordinates"]] if g["type"] == "LineString" else g["coordinates"]):
                for run in runs_inside(l, pad=0.4):
                    out.append({"kind": kind, "cls": cls, "name": note, "left": p.get("ADM0_LEFT") or p.get("BRK_A3"),
                                "right": p.get("ADM0_RIGHT"), "c": [[round(x, 4), round(y, 4)] for x, y in dp(run, 0.05)]})
    print("boundary lines", len(out), sorted({(o["kind"], o["cls"], o["name"]) for o in out}))
    return out


OSM_SETTLEMENTS = json.load(open(f"{RAW}/osm/osm_settlements.geojson"))
OSM_ROADS = json.load(open(f"{RAW}/osm/osm_roads.geojson"))


def main():
    tb, lake_pts = build_terrain()
    rivers = build_rivers()
    lines = all_road_lines()
    pos, adj = build_graph(lines)
    locs = resolve_locations(lake_pts)
    warp_info = None
    if CFG.get("reference"):
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from reference_trace import trace_circuits
        circuits, warp_info = trace_circuits(CFG, locs, (pos, adj, nearest_node, shortest), hav, dp)
        for l in locs:
            if l["lon"] is not None and l["elev"] is None: l["elev"] = round(elev(l["lon"], l["lat"]))
    else:
        circuits = route_circuits(locs, pos, adj)
    roads = {"route": [], "trunk": [], "primary": []}
    for pts, cls in lines:
        s = dp(pts, 0.04)
        if len(s) > 1: roads[cls].append([[round(x, 4), round(y, 4)] for x, y in s])
    out = {"id": CFG["id"], "name": CFG["name"], "bbox": CFG["bbox"],
           "terrain": {"image": f"{REGION}-terrain.jpg", "bounds": [round(v, 6) for v in tb]},
           "reference": warp_info, "roads": roads, "rivers": rivers, "boundaries": boundaries(), "locations": locs, "circuits": circuits,
           "sources": [
               {"name": "Terrain Tiles (AWS Open Data; SRTM, GMTED and others)", "use": "Shaded relief, elevations, lakes, rivers, derived passes"},
               {"name": "OpenStreetMap contributors (ODbL)", "use": "Himachal trunk and primary roads; settlements; Atal Tunnel"},
               {"name": "scroll-route-demo by Aditya Sharma (MIT)", "use": "Road-following route lines and named checkpoints"},
               {"name": "Natural Earth 1:10m (public domain)", "use": "International boundary lines as published, claim lines, reservoirs"},
               {"name": "GeoNames cities1000 (CC BY 4.0)", "use": "Mandi; basemap dots used to place your reference map"},
               {"name": "Your reference map (Proj Altitude circuits)", "use": "Which roads each circuit takes; lines where no road data exists; places no dataset has"}]}
    s = json.dumps(out, separators=(",", ":"))
    open(f"{ROOT}/src/data/generated/{REGION}.json", "w").write(s)
    print("generated json", len(s) // 1024, "KiB")


if __name__ == "__main__":
    main()
