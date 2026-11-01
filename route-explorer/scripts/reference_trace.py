"""Circuits from the user's reference map, with real road geometry wherever it agrees.

1. Warp: image pixels -> lon/lat with a thin-plate spline pinned to the basemap's own city
   dots (GeoNames) and to known places where the drawn line passes their label.
2. Graph: each colour's traced pixels become a graph (junctions joined, short gaps under
   labels bridged).
3. Stops: every place of the circuit sits at the point of its colour nearest its label.
4. Legs: consecutive stops along the drawing. A leg uses the road network's path when one
   exists with about the drawn length; otherwise the drawn line itself is used.
"""
import csv, heapq, json, math, os, sys
import numpy as np
from scipy.interpolate import RBFInterpolator

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from georef import merc, ROOT                       # noqa: E402
from reference_points import BASEMAP_DOTS, LABELS, PX, CONTROL, DRAWN   # noqa: E402

TRACED = f"{ROOT}/data/raw/reference/traced_px.json"


def unmerc(x, y):
    return x / 20037508.34 * 180, math.degrees(2 * math.atan(math.exp(y / 6378137)) - math.pi / 2)


# ------------------------------------------------------------------ pixel graph per colour
def pixel_graph(lines, join=7.0):
    nodes, adj = [], {}
    def add(p):
        nodes.append(p); adj[len(nodes) - 1] = set(); return len(nodes) - 1
    ends = []
    for l in lines:
        ids = [add(tuple(p)) for p in l]
        for a, b in zip(ids, ids[1:]): adj[a].add(b); adj[b].add(a)
        ends += [ids[0], ids[-1]]
    P = np.array(nodes)
    for e in ends:                                   # T-junctions and touching ends
        d = np.hypot(*(P - P[e]).T)
        for j in np.nonzero(d < join)[0]:
            if j != e: adj[e].add(int(j)); adj[int(j)].add(e)
    return P, adj


def dijkstra(P, adj, src, stop):
    dist = {src: 0.0}; prev = {}; pq = [(0.0, src)]; found = []
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        if u != src and u in stop: found.append(u); continue   # do not pass through another stop
        for v in adj[u]:
            nd = d + math.dist(P[u], P[v])
            if nd < dist.get(v, 1e18): dist[v] = nd; prev[v] = u; heapq.heappush(pq, (nd, v))
    return dist, prev, found


def path_to(prev, src, dst):
    out = [dst]
    while out[-1] != src: out.append(prev[out[-1]])
    return out[::-1]


# ------------------------------------------------------------------ warp
def snapper(traced):
    graphs = {cid: pixel_graph(ls) for cid, ls in traced.items()}
    def snap(cid, px, max_px=40):
        P, _ = graphs[cid]
        d = np.hypot(*(P - np.array(px, float)).T); i = int(np.argmin(d))
        return (i if d[i] <= max_px else None), tuple(P[i])
    return graphs, snap


def build_warp(locs, traced, snap):
    gn = {r["name"]: (float(r["lon"]), float(r["lat"])) for r in csv.DictReader(open(f"{ROOT}/data/raw/geonames/rg_cities1000.csv")) if r["cc"] in ("IN", "PK")}
    by = {l["id"]: l for l in locs}
    src, dst, names = [], [], []
    for n, px in BASEMAP_DOTS.items():
        src.append(px); dst.append(merc(*gn[n])); names.append(n + " (basemap dot)")
    for pid in CONTROL:
        l = by[pid]
        if l["lon"] is None: continue
        best = None
        for cid in traced:
            i, q = snap(cid, PX[pid], 25)
            if i is not None and (best is None or math.dist(q, PX[pid]) < math.dist(best, PX[pid])): best = q
        src.append(best or PX[pid]); dst.append(merc(l["lon"], l["lat"])); names.append(l["name"])
    S, D = np.array(src, float), np.array(dst, float)
    f = RBFInterpolator(S, D, kernel="thin_plate_spline", smoothing=0.5)
    loo = []
    for i in range(len(S)):
        m = np.ones(len(S), bool); m[i] = False
        g = RBFInterpolator(S[m], D[m], kernel="thin_plate_spline", smoothing=0.5)
        loo.append(np.hypot(*(g(S[i:i + 1])[0] - D[i])) / 1000 * math.cos(math.radians(33)))
    for n, e in zip(names, loo): print(f"   control {n:24s} leave-one-out {e:5.1f} km")
    print(f"warp: {len(S)} control points; leave-one-out error median {np.median(loo):.1f} km, max {max(loo):.1f} km")
    def to_ll(pts):
        return [unmerc(x, y) for x, y in f(np.asarray(pts, float))]
    return to_ll, {"controls": names, "looMedianKm": round(float(np.median(loo)), 1), "looMaxKm": round(float(max(loo)), 1)}


# ------------------------------------------------------------------ circuits
def trace_circuits(cfg, locs, road, hav, dp):
    """road: (pos, adj, nearest_node, shortest) from the main script."""
    pos, gadj, nearest_node, shortest = road
    traced = json.load(open(TRACED))
    graphs, snap = snapper(traced)
    warp, warp_info = build_warp(locs, traced, snap)
    by = {l["id"]: l for l in locs}
    colour_of = {}
    for cid, runs in DRAWN.items():
        for run in runs:
            for w in run: colour_of.setdefault(w, cid)

    # places no dataset has: read off the drawing
    for l in locs:
        if l["lon"] is not None: continue
        if l["id"] in PX:
            i, q = snap(colour_of.get(l["id"], "zanskar" if l["id"] == "lamayuru" else next(iter(traced))), PX[l["id"]])
            px, how = q, "the point on the drawn route where its label sits"
        elif l["id"] in LABELS:
            px, how = LABELS[l["id"]], "the centre of its label (it is not on a route line)"
        else:
            continue
        lon, lat = warp([px])[0]
        note = f"Read from your reference map: {how}; placement error about {warp_info['looMedianKm']} km"
        if l["kind"] not in ("lake",):
            n, dkm = nearest_node(pos, (lon, lat), 8.0)
            if n is not None:
                lon, lat = pos[n]; note += f"; moved {dkm:.1f} km onto the nearest mapped road"
        l.update({"lon": round(lon, 5), "lat": round(lat, 5), "traced": True, "source": note})
        l.pop("missing", None)

    def coord(pid, px):
        if pid.startswith("@"):
            ll = warp([px])[0]
            n, _ = nearest_node(pos, ll, 8.0)          # junctions of the drawing sit on roads
            return pos[n] if n is not None else ll
        return (by[pid]["lon"], by[pid]["lat"])

    circuits = []
    for c in cfg["circuits"]:
        P, adj = graphs[c["id"]]
        segs = []
        for run in DRAWN[c["id"]]:
            for a, b in zip(run, run[1:]):
                ia, pa = snap(c["id"], PX[a]); ib, pb = snap(c["id"], PX[b])
                A, B = coord(a, pa), coord(b, pb)
                px_path = None
                if ia is not None and ib is not None:
                    dist, prev, _ = dijkstra(P, adj, ia, set())
                    if ib in dist: px_path = [tuple(P[k]) for k in path_to(prev, ia, ib)]
                if px_path:
                    sm = dp_px(px_path, 1.2)
                    ll = warp(sm); ll[0], ll[-1] = A, B
                else:
                    ll = [A, B]
                drawn_km = sum(hav(p, q) for p, q in zip(ll, ll[1:]))
                geom, source, km = None, "traced", drawn_km
                ra = 8.0 if not a.startswith("@") and by[a]["kind"] == "lake" else 3.0
                rb = 8.0 if not b.startswith("@") and by[b]["kind"] == "lake" else 3.0
                na, da = nearest_node(pos, A, ra); nb_, db = nearest_node(pos, B, rb)
                if na is not None and nb_ is not None and na != nb_:
                    rp, rkm = shortest(pos, gadj, na, nb_)
                    # the drawing says these two places are linked; a real road that links them
                    # without a long detour is the better geometry for that link
                    if rp and rkm <= 2.0 * hav(A, B) + 15:
                        # a lake off the road: the route stops where the road passes it
                        head = [A] if da < 1.0 else []; tail = [B] if db < 1.0 else []
                        geom, source, km = head + rp + tail, "road", rkm
                if geom is None:
                    geom = dp(ll, 0.05)
                    if not px_path: source = "gap"
                segs.append({"from": "" if a.startswith("@") else a, "to": "" if b.startswith("@") else b,
                             "status": "ok", "source": source, "km": round(km, 1),
                             "coords": [[round(x, 5), round(y, 5)] for x, y in geom]})
        km = sum(s["km"] for s in segs)
        road_km = sum(s["km"] for s in segs if s["source"] == "road")
        print(f"circuit {c['id']}: {len(segs)} legs, {round(km)} km, {round(road_km)} km on mapped roads, "
              + ", ".join(f"{s['from'] or '*'}-{s['to'] or '*'}:{s['source'][0]}" for s in segs))
        circuits.append({k: v for k, v in c.items() if k != "legs"} | {"legs": [{"waypoints": sorted({w for run in DRAWN[c["id"]] for w in run if not w.startswith("@")}), "unplaced": [], "segments": segs}], "km": round(km), "roadKm": round(road_km)})
    return circuits, warp_info


def dp_px(pts, tol):
    if len(pts) < 3: return pts
    keep = [False] * len(pts); keep[0] = keep[-1] = True; st = [(0, len(pts) - 1)]
    while st:
        i, j = st.pop(); (ax, ay), (bx, by) = pts[i], pts[j]; dx, dy = bx - ax, by - ay; L = math.hypot(dx, dy) or 1e-9
        best, k = 0, -1
        for m in range(i + 1, j):
            d = abs(dy * (pts[m][0] - ax) - dx * (pts[m][1] - ay)) / L
            if d > best: best, k = d, m
        if best > tol: keep[k] = True; st += [(i, k), (k, j)]
    return [p for p, f in zip(pts, keep) if f]
