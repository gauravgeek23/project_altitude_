"""Trace the four coloured circuits out of the reference map, in image pixels.

Colour mask -> remove thick blobs (label boxes) -> bridge markers -> skeleton -> polylines.
Output: data/raw/reference/traced_px.json  {color_id: [[[x, y], ...], ...]}
"""
import colorsys, json, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage.morphology import skeletonize, remove_small_objects
from georef import markers, ROOT
IMG = f"{ROOT}/data/raw/reference/circuits-map-original.webp"

HUES = {"nubra": (265, 300), "changthang": (-18, 15), "zanskar": (218, 245), "spiti": (125, 160)}


def masks():
    im = np.asarray(Image.open(IMG).convert("RGB")).astype(np.float32) / 255
    mx, mn = im.max(-1), im.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1e-6)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    # hue in degrees
    h = np.zeros_like(mx)
    d = np.maximum(mx - mn, 1e-6)
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    h = np.where(h > 180 + 150, h - 360, h)            # red wraps to negative
    out = {}
    marks = []                                  # the original has no place markers
    for cid, (lo, hi) in HUES.items():
        m = (sat > 0.5) & (mx > 0.25) & (h >= lo) & (h <= hi)
        m[:165, :] = False                      # app header over the screenshot
        m[:320, 1080:] = False                  # compass rose
        # label boxes and other solid fills: anything thicker than ~7 px
        thick = ndi.binary_opening(m, structure=np.ones((7, 7)))
        m &= ~ndi.binary_dilation(thick, iterations=2)
        m = remove_small_objects(m, max_size=40)
        # markers are white discs drawn over the line: fill those the line runs into
        yy, xx = np.mgrid[0:m.shape[0], 0:m.shape[1]]
        for (cx, cy) in marks:
            ring = (np.hypot(xx[int(cy)-9:int(cy)+10, int(cx)-9:int(cx)+10] - cx, yy[int(cy)-9:int(cy)+10, int(cx)-9:int(cx)+10] - cy))
            win = m[int(cy)-9:int(cy)+10, int(cx)-9:int(cx)+10]
            if win.shape == ring.shape and (win & (ring > 5.5)).sum() >= 3:
                win |= ring <= 7.5
        m = ndi.binary_closing(m, structure=np.ones((3, 3)))
        out[cid] = m
    return out


def polylines(m):
    sk = skeletonize(m)
    pts = set(zip(*np.nonzero(sk)))
    nb = lambda p: [(p[0] + dy, p[1] + dx) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if (dy or dx) and (p[0] + dy, p[1] + dx) in pts]
    deg = {p: len(nb(p)) for p in pts}
    nodes = {p for p, k in deg.items() if k != 2}
    seen_edges = set(); lines = []
    for s in nodes:
        for n in nb(s):
            if (s, n) in seen_edges: continue
            path = [s, n]; seen_edges.add((s, n)); seen_edges.add((n, s))
            prev, cur = s, n
            while cur not in nodes:
                nxt = [q for q in nb(cur) if q != prev and (cur, q) not in seen_edges]
                if not nxt: break
                q = nxt[0]; seen_edges.add((cur, q)); seen_edges.add((q, cur)); path.append(q); prev, cur = cur, q
            lines.append(path)
    # loops with no node
    rest = pts - {p for l in lines for p in l}
    while rest:
        s = rest.pop(); path = [s]; cur = s
        while True:
            nxt = [q for q in nb(cur) if q in rest]
            if not nxt: break
            cur = nxt[0]; rest.discard(cur); path.append(cur)
        if len(path) > 3: lines.append(path)
    lines = [[(float(x), float(y)) for y, x in l] for l in lines if len(l) >= 4]
    return lines


def length(l): return sum(math.dist(a, b) for a, b in zip(l, l[1:]))


def bridge(lines, gap=90):
    """Join loose ends of the same colour that point at each other across a short gap (labels on top)."""
    ends = []
    for i, l in enumerate(lines):
        for side in (0, -1):
            p = l[side]; q = l[min(len(l) - 1, 6)] if side == 0 else l[max(0, len(l) - 7)]
            v = (p[0] - q[0], p[1] - q[1]); n = math.hypot(*v) or 1
            ends.append((i, side, p, (v[0] / n, v[1] / n)))
    # endpoints that touch another line are junctions, not loose
    def touches(p, i):
        return any(j != i and min(math.dist(p, r) for r in l[::2]) < 2.5 for j, l in enumerate(lines))
    loose = [e for e in ends if not touches(e[2], e[0])]
    used, bridges = set(), []
    cands = []
    for a in range(len(loose)):
        for b in range(a + 1, len(loose)):
            i, _, p, v = loose[a]; j, _, q, w = loose[b]
            d = math.dist(p, q)
            if d < 3 or d > gap: continue
            u = ((q[0] - p[0]) / d, (q[1] - p[1]) / d)
            align = (v[0] * u[0] + v[1] * u[1]) + (-(w[0] * u[0] + w[1] * u[1]))
            need = 1.0 if d < 34 else 1.55          # long jumps (under labels) must point at each other
            if align > need: cands.append((d - 25 * align, a, b))
    for _, a, b in sorted(cands):
        if a in used or b in used: continue
        used |= {a, b}; bridges.append([loose[a][2], loose[b][2]])
    return lines + bridges, len(bridges)


def main():
    out = {}
    for cid, m in masks().items():
        lines = [l for l in polylines(m)]
        lines = [l for l in lines if length(l) >= 6]
        lines, nb = bridge(lines)
        out[cid] = [[[round(x, 1), round(y, 1)] for x, y in l] for l in lines]
        print(cid, len(lines), "lines,", nb, "bridges,", round(sum(length(l) for l in lines)), "px")
    json.dump(out, open(f"{ROOT}/data/raw/reference/traced_px.json", "w"))
    # overlay preview
    im = Image.open(IMG).convert("RGB").copy()
    from PIL import ImageDraw
    dr = ImageDraw.Draw(im)
    col = {"nubra": (0, 0, 0), "changthang": (0, 0, 0), "zanskar": (0, 0, 0), "spiti": (0, 0, 0)}
    for cid, ls in out.items():
        for l in ls: dr.line([tuple(p) for p in l], fill=(255, 0, 255) if cid == "spiti" else (0, 255, 0), width=1)
    im.save(f"{ROOT}/shots/traced_px.png")


if __name__ == "__main__":
    main()
