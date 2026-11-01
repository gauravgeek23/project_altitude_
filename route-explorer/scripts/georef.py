"""Georeference the user's reference circuit map (data/raw/reference/circuits-map.webp).

Control points: white place markers in the image whose place already has a dataset
coordinate. The fit is least-squares from Web Mercator metres to image pixels
(affine, 6 parameters). Residuals are reported; they bound how far traced features can be off.
"""
import json, math, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = f"{ROOT}/data/raw/reference/circuits-map.webp"


def merc(lon, lat):
    return lon * 20037508.34 / 180, math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) * 6378137


def markers():
    im = np.asarray(Image.open(IMG).convert("RGB")).astype(int)
    white = (im > 235).all(-1)
    lab, n = ndi.label(white)
    out = []
    for sl in ndi.find_objects(lab):
        s = (lab[sl] > 0).sum()
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if 48 <= s <= 70 and 7 <= h <= 11 and 7 <= w <= 11:
            out.append(((sl[1].start + sl[1].stop - 1) / 2, (sl[0].start + sl[0].stop - 1) / 2))
    return out


def fit(pairs):
    A = np.array([[*merc(lo, la), 1] for (lo, la), _ in pairs])
    P = np.array([px for _, px in pairs])
    M, *_ = np.linalg.lstsq(A, P, rcond=None)          # 3x2
    pred = A @ M
    res = np.hypot(*(pred - P).T)
    return M, res


def to_px(M, lon, lat):
    x, y = merc(lon, lat); return tuple(np.array([x, y, 1]) @ M)


def to_ll(M, px, py):
    L = M[:2].T; t = M[2]
    x, y = np.linalg.solve(L, np.array([px, py]) - t)
    return x / 20037508.34 * 180, math.degrees(2 * math.atan(math.exp(y / 6378137)) - math.pi / 2)
