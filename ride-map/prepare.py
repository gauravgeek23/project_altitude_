"""Build data.json for the Ladakh + Himachal relief map.

Sources
  terrain : Mapzen/AWS Terrain Tiles (terrarium, z9)            data/dem
  routes  : adisharma29/scroll-route-demo (MIT) route polylines  data/raw/srd/data
  roads   : OpenStreetMap trunk+primary for Himachal (ODbL)      data/raw/ffz
  lakes   : Natural Earth 10m lakes (public domain)              data/raw
  rivers  : traced from the terrain itself (D8 flow accumulation)
"""
import zlib, base64, glob, heapq, json, math, os
import numpy as np
from PIL import Image

W, E, S, N = 75.35, 79.6, 30.35, 35.7
ROWS, COLS = 900, 600
LAT0 = (S + N) / 2
KX = 111.32 * math.cos(math.radians(LAT0))   # km per degree lon
KY = 110.574                                  # km per degree lat
Z = 9
ROOT = os.path.dirname(os.path.abspath(__file__))


def km(lon, lat):
    return ((lon - (W + E) / 2) * KX, (lat - LAT0) * KY)


# ---------------------------------------------------------------- terrain
def tile_xy(lon, lat):
    n = 2 ** Z
    x = (lon + 180) / 360 * n
    r = math.radians(lat)
    y = (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * n
    return x, y


def load_dem():
    x0, y0 = tile_xy(W, N)
    x1, y1 = tile_xy(E, S)
    tx0, ty0, tx1, ty1 = int(x0), int(y0), int(x1), int(y1)
    mosaic = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256), np.float32)
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            a = np.asarray(Image.open(f"{ROOT}/data/dem/{Z}_{tx}_{ty}.png").convert("RGB"), np.float32)
            h = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
            mosaic[(ty - ty0) * 256:(ty - ty0 + 1) * 256, (tx - tx0) * 256:(tx - tx0 + 1) * 256] = h
    # sample the grid (row 0 = north) with 3x3 supersampling + bilinear
    out = np.zeros((ROWS, COLS), np.float32)
    ss = 3
    for sy in range(ss):
        for sx in range(ss):
            lats = N - (np.arange(ROWS) + (sy + 0.5) / ss - 0.5) * (N - S) / (ROWS - 1)
            lons = W + (np.arange(COLS) + (sx + 0.5) / ss - 0.5) * (E - W) / (COLS - 1)
            px = np.array([tile_xy(l, 0)[0] for l in lons]) - tx0
            py = np.array([tile_xy(W, l)[1] for l in lats]) - ty0
            px *= 256; py *= 256
            PX, PY = np.meshgrid(px - 0.5, py - 0.5)
            ix = np.clip(np.floor(PX).astype(int), 0, mosaic.shape[1] - 2)
            iy = np.clip(np.floor(PY).astype(int), 0, mosaic.shape[0] - 2)
            fx = np.clip(PX - ix, 0, 1); fy = np.clip(PY - iy, 0, 1)
            v = (mosaic[iy, ix] * (1 - fx) * (1 - fy) + mosaic[iy, ix + 1] * fx * (1 - fy)
                 + mosaic[iy + 1, ix] * (1 - fx) * fy + mosaic[iy + 1, ix + 1] * fx * fy)
            out += v
    return out / (ss * ss)


def cell_of(lon, lat):
    return (N - lat) / (N - S) * (ROWS - 1), (lon - W) / (E - W) * (COLS - 1)


def sample(H, lon, lat):
    r, c = cell_of(lon, lat)
    r = min(max(r, 0), ROWS - 1.001); c = min(max(c, 0), COLS - 1.001)
    i, j = int(r), int(c); fr, fc = r - i, c - j
    return float(H[i, j] * (1 - fr) * (1 - fc) + H[i, j + 1] * (1 - fr) * fc
                 + H[i + 1, j] * fr * (1 - fc) + H[i + 1, j + 1] * fr * fc)


# ---------------------------------------------------------------- lakes
def point_in_ring(x, y, ring):
    inside = False
    n = len(ring)
    j = n - 1
    for i in range(n):
        xi, yi = ring[i]; xj, yj = ring[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi:
            inside = not inside
        j = i
    return inside


def lakes(H):
    d = json.load(open(f"{ROOT}/data/raw/ne_10m_lakes.geojson"))
    mask = np.zeros((ROWS, COLS), np.uint8)
    found = []
    for f in d["features"]:
        g = f["geometry"]
        polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for poly in polys:
            ring = poly[0]
            xs = [p[0] for p in ring]; ys = [p[1] for p in ring]
            if max(xs) < W or min(xs) > E or max(ys) < S or min(ys) > N:
                continue
            r0, c0 = cell_of(min(xs), max(ys)); r1, c1 = cell_of(max(xs), min(ys))
            cells = []
            for r in range(max(0, int(r0)), min(ROWS, int(r1) + 2)):
                lat = N - r * (N - S) / (ROWS - 1)
                for c in range(max(0, int(c0)), min(COLS, int(c1) + 2)):
                    lon = W + c * (E - W) / (COLS - 1)
                    if point_in_ring(lon, lat, ring) and not any(point_in_ring(lon, lat, h) for h in poly[1:]):
                        cells.append((r, c))
            if not cells:
                continue
            level = float(np.median([H[r, c] for r, c in cells]))
            for r, c in cells:
                mask[r, c] = 1
                H[r, c] = level
            name = f["properties"].get("name") or f["properties"].get("name_en") or ""
            found.append((name, len(cells), round(level)))
    # lakes Natural Earth lacks: flood the flat water surface of the DEM from a seed
    for name, lat, lon in (("Tso Moriri", 32.90, 78.31), ("Tso Kar", 33.30, 78.00), ("Chandratal", 32.475, 77.617)):
        r0, c0 = (int(round(v)) for v in cell_of(lon, lat))
        # the seed's level: lowest cell nearby
        win = H[r0 - 3:r0 + 4, c0 - 3:c0 + 4]
        rr, cc = np.unravel_index(np.argmin(win), win.shape); r0 += rr - 3; c0 += cc - 3
        level = H[r0, c0]; tol = 3.0
        stack, cells, seen = [(r0, c0)], [], {(r0, c0)}
        while stack and len(cells) < 4000:
            r, c = stack.pop(); cells.append((r, c))
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                q = (r + dr, c + dc)
                if q not in seen and 0 <= q[0] < ROWS and 0 <= q[1] < COLS and abs(H[q] - level) < tol:
                    seen.add(q); stack.append(q)
        if 3 <= len(cells) < 4000:
            for r, c in cells:
                mask[r, c] = 1; H[r, c] = level
            found.append((name, len(cells), round(float(level))))
    print("lakes", found)
    return mask


# ---------------------------------------------------------------- rivers
def rivers(H, lake):
    rows, cols = H.shape
    filled = H.astype(np.float64).copy()
    done = np.zeros(H.shape, bool)
    pq = []
    for r in range(rows):
        for c in (0, cols - 1):
            heapq.heappush(pq, (filled[r, c], r, c)); done[r, c] = True
    for c in range(1, cols - 1):
        for r in (0, rows - 1):
            heapq.heappush(pq, (filled[r, c], r, c)); done[r, c] = True
    order = []
    nb = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
    while pq:
        h, r, c = heapq.heappop(pq)
        order.append((r, c))
        for dr, dc in nb:
            rr, cc = r + dr, c + dc
            if 0 <= rr < rows and 0 <= cc < cols and not done[rr, cc]:
                done[rr, cc] = True
                filled[rr, cc] = max(filled[rr, cc], h + 1e-3)
                heapq.heappush(pq, (filled[rr, cc], rr, cc))
    # flow direction: steepest descent on filled surface
    down = -np.ones((rows, cols, 2), np.int32)
    for r, c in order:
        best, bd = 0.0, None
        for dr, dc in nb:
            rr, cc = r + dr, c + dc
            if 0 <= rr < rows and 0 <= cc < cols:
                drop = (filled[r, c] - filled[rr, cc]) / (1.4142 if dr and dc else 1)
                if drop > best:
                    best, bd = drop, (rr, cc)
        if bd:
            down[r, c] = bd
    acc = np.ones((rows, cols), np.float64)
    for r, c in reversed(order):
        rr, cc = down[r, c]
        if rr >= 0:
            acc[rr, cc] += acc[r, c]
    T = 900  # cells (~ 0.42 km^2 each) -> ~380 km^2 catchment
    lines = []
    seen = np.zeros((rows, cols), bool)
    # start at stream heads: cells above T whose upstream neighbours are all below T
    heads = []
    for r in range(rows):
        for c in range(cols):
            if acc[r, c] < T:
                continue
            up = False
            for dr, dc in nb:
                rr, cc = r + dr, c + dc
                if 0 <= rr < rows and 0 <= cc < cols and acc[rr, cc] >= T and tuple(down[rr, cc]) == (r, c):
                    up = True; break
            if not up:
                heads.append((acc[r, c], r, c))
    heads.sort(reverse=True)
    for _, r, c in heads:
        pts = []
        while True:
            pts.append((r, c, acc[r, c], lake[r, c]))
            if seen[r, c]:
                break
            seen[r, c] = True
            rr, cc = down[r, c]
            if rr < 0:
                break
            r, c = rr, cc
        # split into runs outside lakes
        run = []
        for p in pts:
            if p[3]:
                if len(run) > 2: lines.append(run)
                run = []
            else:
                run.append(p)
        if len(run) > 2:
            lines.append(run)
    out = []
    for run in lines:
        xy = [(W + c * (E - W) / (COLS - 1), N - r * (N - S) / (ROWS - 1)) for r, c, a, _ in run]
        for _ in range(2):  # chaikin, keep ends
            nxt = [xy[0]]
            for (a, b), (c2, d2) in zip(xy, xy[1:]):
                nxt += [(0.75 * a + 0.25 * c2, 0.75 * b + 0.25 * d2), (0.25 * a + 0.75 * c2, 0.25 * b + 0.75 * d2)]
            nxt.append(xy[-1]); xy = nxt
        a = [p[2] for p in run]
        # width class by catchment (km^2): grows with log
        wcls = [min(4, max(0, int(math.log2(v / T)))) for v in a]
        out.append({"p": xy, "w": [wcls[min(len(wcls) - 1, i // 4)] for i in range(len(xy))]})
    print("rivers", len(out), sum(len(o["p"]) for o in out))
    return out


# ---------------------------------------------------------------- roads
def hav(a, b):
    (x1, y1), (x2, y2) = a, b
    p1, p2 = math.radians(y1), math.radians(y2)
    dp, dl = p2 - p1, math.radians(x2 - x1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * 6371.0 * math.asin(math.sqrt(h))


def dp_simplify(pts, tol_km):
    if len(pts) < 3:
        return pts
    P = [km(*p) for p in pts]
    keep = [False] * len(pts); keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        (ax, ay), (bx, by) = P[i], P[j]
        dx, dy = bx - ax, by - ay; L = math.hypot(dx, dy) or 1e-9
        best, k = 0, -1
        for m in range(i + 1, j):
            px, py = P[m]
            d = abs(dy * (px - ax) - dx * (py - ay)) / L
            if d > best: best, k = d, m
        if best > tol_km:
            keep[k] = True; stack += [(i, k), (k, j)]
    return [p for p, f in zip(pts, keep) if f]


def densify(pts, step=0.1):
    out = [pts[0]]
    for a, b in zip(pts, pts[1:]):
        d = hav(a, b); n = max(1, int(d / step))
        for i in range(1, n + 1):
            t = i / n; out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    return out


def clip_runs(pts):
    runs, cur = [], []
    for p in pts:
        if W <= p[0] <= E and S <= p[1] <= N:
            cur.append(p)
        else:
            if len(cur) > 1: runs.append(cur)
            cur = []
    if len(cur) > 1: runs.append(cur)
    return runs


class Cover:
    def __init__(self, r_km=0.18):
        self.r = r_km; self.cell = 0.004; self.g = {}

    def key(self, p): return (int(p[0] / self.cell), int(p[1] / self.cell))

    def add_line(self, pts):
        for p in densify(pts, 0.08):
            self.g.setdefault(self.key(p), []).append(p)

    def covered(self, p):
        kx, ky = self.key(p)
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                for q in self.g.get((kx + dx, ky + dy), ()):
                    if hav(p, q) < self.r: return True
        return False


EXTRA_CP = {"zanskar-valley": [{"name": "Pensi La", "lat": 33.865, "lon": 76.36}, {"name": "Darcha", "lat": 32.678, "lon": 77.195}, {"name": "Padum", "lat": 33.4628, "lon": 76.8786, "range": [2881, 3640]}, {"name": "Rangdum", "lat": 34.0368, "lon": 76.3729}]}

ROUTES = [
    ("manali-leh", "Manali – Leh Highway"),
    ("srinagar-leh", "Srinagar – Leh Highway"),
    ("leh-nubra", "Leh – Nubra via Khardung La"),
    ("leh-pangong-umling", "Leh – Pangong – Hanle – Umling La"),
    ("leh-tso-moriri", "Leh – Tso Moriri – Chumur"),
    ("spiti-circuit", "Spiti circuit"),
    ("zanskar-valley", "Zanskar via Shinku La"),
    ("kasol-parvati", "Parvati valley"),
    ("jibhi-tirthan", "Tirthan valley · Jalori Pass"),
    ("shimla-kalka", "Kalka – Shimla"),
]


def road_lines():
    """Return candidate lines in priority order: (pts, name, group, cat)."""
    out = []
    for slug, title in ROUTES:
        d = json.load(open(f"{ROOT}/data/raw/srd/data/{slug}.json"))
        pl = [tuple(p) for p in d["polyline"]]
        cps = d.get("checkpoints", [])
        # split into legs at checkpoints
        cum = [0.0]
        for a_, b_ in zip(pl, pl[1:]): cum.append(cum[-1] + hav(a_, b_))
        cps = list(cps) + [c for c in EXTRA_CP.get(slug, []) if c["name"] not in {x["name"] for x in cps}]
        extra = {c["name"]: c for c in EXTRA_CP.get(slug, [])}
        cps = [extra.get(c["name"], c) for c in cps]
        def near(c):
            lo, hi = c.get("range", (0, len(pl)))
            return min(range(lo, hi), key=lambda i: (pl[i][0] - c["lon"]) ** 2 + (pl[i][1] - c["lat"]) ** 2)
        marks = sorted((near(c), c["name"]) for c in cps)
        if marks[0][0] > 5: marks.insert(0, (0, d.get("from", "").split(" ")[0]))
        else: marks[0] = (0, marks[0][1])
        if cum[-1] - cum[marks[-1][0]] >= 3: marks.append((len(pl) - 1, d.get("to", "").split(" ")[0]))
        else: marks[-1] = (len(pl) - 1, marks[-1][1])
        kept = [marks[0]]
        for i, n in marks[1:]:  # legs shorter than 3 km merge forward
            if cum[i] - cum[kept[-1][0]] < 3:
                if (i, n) == marks[-1]: kept[-1] = (i, n) if len(kept) > 1 else kept[-1]
                continue
            kept.append((i, n))
        for (i0, n0), (i1, n1) in zip(kept, kept[1:]):
            leg = pl[i0:i1 + 1]
            if len(leg) >= 2:
                out.append((leg, f"{n0} – {n1}", title, 1, cum[i1] - cum[i0]))
    d = json.load(open(f"{ROOT}/data/raw/ffz/data/raw/infrastructure/osm_roads.geojson"))
    feats = []
    for f in d["features"]:
        g = f["geometry"]; p = f["properties"]
        lines = [g["coordinates"]] if g["type"] == "LineString" else g["coordinates"]
        nm = p.get("name") or ""
        ref = p.get("ref") or ""
        label = " · ".join(x for x in (ref, nm) if x) or ("Highway" if p.get("highway") == "trunk" else "Main road")
        for l in lines:
            feats.append(([tuple(q[:2]) for q in l], label, "Himachal road network", 2 if p.get("highway") == "trunk" else 3, 0))
    feats.sort(key=lambda t: t[3])
    return out + feats


def build_roads():
    cover = Cover()
    pieces = []
    legkm = {}
    for pts, name, group, cat, full in road_lines():
        legkm[(group, name)] = full
        for run in clip_runs(pts):
            dens = densify(run, 0.1)
            flags = [cover.covered(p) for p in dens]
            segs, cur = [], []
            for i, (p, f) in enumerate(zip(dens, flags)):
                if not f:
                    if not cur and i > 0: cur.append(dens[i - 1])  # join to the road it leaves
                    cur.append(p)
                elif cur:
                    cur.append(p); segs.append(cur); cur = []
            if cur: segs.append(cur)
            for s in segs:
                L = sum(hav(a, b) for a, b in zip(s, s[1:]))
                if L < 0.4: continue
                cover.add_line(s)
                # chunk to <= 8 km
                n = max(1, math.ceil(L / 8)); target = L / n
                acc, start = 0, 0
                for i in range(1, len(s)):
                    acc += hav(s[i - 1], s[i])
                    if acc >= target and len(pieces) >= 0 and i < len(s) - 1 and n > 1:
                        pieces.append((s[start:i + 1], name, group, cat)); start = i; acc = 0; n -= 1
                pieces.append((s[start:], name, group, cat))
    out = []
    for i, (p, name, group, cat) in enumerate(pieces):
        p = dp_simplify(p, 0.015)
        L = sum(hav(a, b) for a, b in zip(p, p[1:]))
        q = [(round((x - W) * 1e5), round((y - S) * 1e5)) for x, y in p]
        flat = [q[0][0], q[0][1]]
        for a, b in zip(q, q[1:]):
            flat += [b[0] - a[0], b[1] - a[1]]
        rid = format(zlib.crc32(json.dumps([name, flat[:2], flat[-2:], len(flat)]).encode()), "x")
        out.append({"i": rid, "n": name, "g": group, "c": cat, "k": round(L, 2), "p": flat})
    # a leg whose road is mostly another route's (the line doubled back) is hidden from the leg list
    kept_km = {}
    for o in out: kept_km[(o["g"], o["n"])] = kept_km.get((o["g"], o["n"]), 0) + o["k"]
    for o in out:
        full = legkm.get((o["g"], o["n"]), 0)
        if o["c"] == 1 and full and kept_km[(o["g"], o["n"])] < 0.25 * full: o["x"] = 1
    assert len({o["i"] for o in out}) == len(out), "id clash"
    print("road pieces", len(out), "points", sum(len(o["p"]) // 2 for o in out), "km", round(sum(o["k"] for o in out)))
    return out


# ---------------------------------------------------------------- places
PASS_ALT = {"Khardung La": 5359, "Tanglang La": 5328, "Chang La": 5360, "Baralacha La": 4890,
            "Rohtang Pass": 3978, "Kunzum La": 4551, "Zoji La": 3528, "Umling La": 5799,
            "Shinku La": 5091, "Fotu La": 4108, "Namika La": 3700, "Pensi La": 4400, "Jalori Pass": 3120}
EXTRA = [("Chang La", 34.047, 77.932), ("Kunzum La", 32.397, 77.639), ("Pensi La", 33.865, 76.36),
         ("Pangong Tso", 33.76, 78.67), ("Turtuk", 34.847, 76.826), ("Dharamshala", 32.219, 76.323),
         ("Kullu", 31.958, 77.109), ("Mandi", 31.708, 76.932), ("Chamba", 32.553, 76.126),
         ("Jispa", 32.641, 77.188), ("Upshi", 33.83, 77.81), ("Karu", 33.93, 77.73),
         ("Drass", 34.43, 75.76), ("Lamayuru", 34.283, 76.774), ("Tso Kar", 33.31, 77.98)]
SKIP = {"Nubra Valley", "Tirthan Valley", "Pangong Lake", "Mahe Bridge", "Taradevi", "Barog", "Panikhar", "Shoja", "Pulga", "Tosh", "Aut", "Marhi"}
MAJOR = {"Leh", "Manali", "Shimla", "Kargil", "Kaza", "Keylong", "Padum", "Diskit", "Hanle", "Recong Peo", "Dharamshala", "Kullu", "Mandi", "Chandigarh", "Kalka"}


def build_places(H, roads_ll):
    seen = {}
    for f in sorted(glob.glob(f"{ROOT}/data/raw/srd/data/*.json")):
        if "fetch" in f: continue
        for c in json.load(open(f)).get("checkpoints", []):
            if W <= c["lon"] <= E and S <= c["lat"] <= N and c["name"] not in SKIP:
                seen.setdefault(c["name"], (c["lat"], c["lon"]))
    for n, la, lo in EXTRA:
        seen.setdefault(n, (la, lo))
    out = []
    for name, (lat, lon) in seen.items():
        kind = "pass" if name in PASS_ALT else ("lake" if name in ("Pangong Tso", "Tso Moriri", "Chandratal", "Tso Kar") else "town")
        if kind == "pass":
            # snap to the highest road point within 4 km
            best = None
            for p in roads_ll:
                if abs(p[1] - lat) < 0.05 and abs(p[0] - lon) < 0.06 and hav(p, (lon, lat)) < 4:
                    h = sample(H, *p)
                    if best is None or h > best[0]: best = (h, p)
            if best: lon, lat = best[1]
        out.append({"n": name, "t": kind, "lat": round(lat, 4), "lon": round(lon, 4),
                    "a": PASS_ALT.get(name), "m": 1 if (name in MAJOR or kind == "pass") else 0})
    print("places", len(out))
    return out


def main():
    H = load_dem()
    print("dem", H.min(), H.max())
    lake = lakes(H)
    riv = rivers(H, lake)
    roads = build_roads()
    roads_ll = []
    for r in roads:
        x, y = r["p"][0], r["p"][1]; roads_ll.append((W + x / 1e5, S + y / 1e5))
        for i in range(2, len(r["p"]), 2):
            x += r["p"][i]; y += r["p"][i + 1]; roads_ll.append((W + x / 1e5, S + y / 1e5))
    places = build_places(H, roads_ll)
    hq = np.clip(np.round(H), -500, 9000).astype("<i2")
    # rivers: quantise like roads
    rv = []
    for r in riv:
        q = [(round((x - W) * 1e4), round((y - S) * 1e4)) for x, y in r["p"]]
        rv.append({"w": r["w"], "p": [v for xy in q for v in xy]})
    data = {"bbox": [W, S, E, N], "rows": ROWS, "cols": COLS, "lat0": LAT0,
            "h": base64.b64encode(hq.tobytes()).decode(),
            "lake": base64.b64encode(np.packbits(lake.ravel()).tobytes()).decode(),
            "rivers": rv, "roads": roads, "places": places}
    s = json.dumps(data, separators=(",", ":"))
    open(f"{ROOT}/data.json", "w").write(s)
    print("data.json", len(s) // 1024, "KiB")


if __name__ == "__main__":
    main()
