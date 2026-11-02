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
                    ll = bend_to(warp(sm), A, B, hav)
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
                    matched = map_match(ll, pos, gadj, nearest_node, shortest, hav)
                    if matched:
                        geom, km = matched
                        if hav(geom[0], A) < 2.5: geom = [A] + geom
                        if hav(geom[-1], B) < 2.5: geom = geom + [B]
                        source = "road"
                    else:
                        geom = dp(chaikin(ll, 3), 0.03)
                        if not px_path: source = "gap"
                geom = straighten(geom, hav, dp)
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


def chaikin(pts, n=2):
    """Corner-cutting smoothing that keeps both ends."""
    for _ in range(n):
        if len(pts) < 3: break
        out = [pts[0]]
        for (ax, ay), (bx, by) in zip(pts, pts[1:]):
            out += [(0.75 * ax + 0.25 * bx, 0.75 * ay + 0.25 * by), (0.25 * ax + 0.75 * bx, 0.25 * ay + 0.75 * by)]
        out.append(pts[-1]); pts = out
    return pts


def map_match(ll, pos, gadj, nearest_node, shortest, hav, step=1.5, radius=10.0, min_share=0.25):
    """Snap a hand-drawn line onto the road network, piece by piece.

    The line is sampled every `step` km and each sample snaps to the nearest road node within
    `radius` km. Runs of snapped samples are joined along the roads (a join that detours is
    refused and treated as unsnapped); between runs the drawing itself is kept, smoothed.
    Loops created by back-and-forth snapping are cut. Returns (coords, km), or None when
    less than `min_share` of the line found a road.
    """
    dense = [ll[0]]
    for a, b in zip(ll, ll[1:]):
        n = max(1, int(hav(a, b) / step))
        dense += [(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n) for i in range(1, n + 1)]
    snaps = [nearest_node(pos, p, radius)[0] for p in dense]
    if len(dense) < 2 or sum(s_ is not None for s_ in snaps) < max(2, min_share * len(dense)):
        return None
    out, prev_node, loose = [], None, []        # loose: drawn points waiting between road runs
    def flush_loose():
        if loose: out.extend(chaikin(loose, 2))
        loose.clear()
    for p, s_ in zip(dense, snaps):
        if s_ is None:
            prev_node = None; loose.append(p); continue
        if prev_node is None:
            if loose: loose.append(pos[s_])
            flush_loose(); out.append(pos[s_]); prev_node = s_; continue
        if s_ == prev_node: continue
        path, km = shortest(pos, gadj, prev_node, s_)
        if not path or km > 3 * hav(pos[prev_node], pos[s_]) + 3:
            out.append(p); prev_node = None; continue
        out.extend(path[1:]); prev_node = s_
    flush_loose()
    # cut loops: when a point comes back, drop everything since its first visit
    res, where = [], {}
    for q in out:
        key = (round(q[0], 5), round(q[1], 5))
        if key in where:
            del res[where[key] + 1:]
            where = {(round(r[0], 5), round(r[1], 5)): i for i, r in enumerate(res)}
            continue
        where[key] = len(res); res.append(q)
    km = sum(hav(a, b) for a, b in zip(res, res[1:]))
    return res, km


def _path_keys(pos, path):
    # shortest() returns coordinates; map them back to node keys
    inv = _path_keys.inv if hasattr(_path_keys, "inv") and _path_keys.n == len(pos) else None
    if inv is None:
        inv = {v: k for k, v in pos.items()}; _path_keys.inv = inv; _path_keys.n = len(pos)
    return [inv[p] for p in path]


def bend_to(ll, A, B, hav, reach=0.35):
    """Move the ends of a warped line onto its true end points smoothly: the correction fades
    out over the first and last `reach` of the line instead of a straight jump."""
    if len(ll) < 2: return [A, B]
    cum = [0.0]
    for a, b in zip(ll, ll[1:]): cum.append(cum[-1] + hav(a, b))
    L = cum[-1] or 1.0
    da = (A[0] - ll[0][0], A[1] - ll[0][1]); db = (B[0] - ll[-1][0], B[1] - ll[-1][1])
    out = []
    for (x, y), c in zip(ll, cum):
        t = c / L
        wa = max(0.0, 1 - t / reach) ** 2; wb = max(0.0, 1 - (1 - t) / reach) ** 2
        out.append((x + da[0] * wa + db[0] * wb, y + da[1] * wa + db[1] * wb))
    out[0], out[-1] = A, B
    return out


def straighten(pts, hav, dp, spike_km=1.5, tol_km=0.3):
    """Calmer lines: remove short hooks where the line doubles back on itself, then simplify so
    the line stays within `tol_km` of the road but drops the grid-snapping wiggle."""
    pts = list(pts)
    changed = True
    while changed and len(pts) > 2:
        changed = False
        out = [pts[0]]
        for i in range(1, len(pts) - 1):
            a, b, c = out[-1], pts[i], pts[i + 1]
            v1 = (b[0] - a[0], b[1] - a[1]); v2 = (c[0] - b[0], c[1] - b[1])
            n1 = (v1[0] ** 2 + v1[1] ** 2) ** .5; n2 = (v2[0] ** 2 + v2[1] ** 2) ** .5
            if n1 and n2:
                cos = (v1[0] * v2[0] + v1[1] * v2[1]) / (n1 * n2)
                # a sharp reversal on a short arm is a snapping artefact, not a hairpin road
                if cos < -0.5 and min(hav(a, b), hav(b, c)) < spike_km:
                    changed = True; continue
            out.append(b)
        out.append(pts[-1]); pts = out
    return dp(pts, tol_km)
