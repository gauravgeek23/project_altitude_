"""Download Terrain Tiles (terrarium encoding, AWS Open Data) covering the region bbox."""
import json, math, os, sys, urllib.request, concurrent.futures as cf
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cfg = json.load(open(f"{ROOT}/src/data/regions/{sys.argv[1] if len(sys.argv) > 1 else 'ladakh-himachal'}.json"))
W, S, E, N = cfg["bbox"]; Z = cfg["terrainZoom"]
def tx(lon): return int((lon + 180) / 360 * 2 ** Z)
def ty(lat):
    r = math.radians(lat); return int((1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * 2 ** Z)
jobs = [(x, y) for x in range(tx(W), tx(E) + 1) for y in range(ty(N), ty(S) + 1)]
os.makedirs(f"{ROOT}/data/raw/dem{Z}", exist_ok=True)
def get(t):
    x, y = t; p = f"{ROOT}/data/raw/dem{Z}/{x}_{y}.png"
    if not os.path.exists(p):
        urllib.request.urlretrieve(f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{x}/{y}.png", p)
with cf.ThreadPoolExecutor(12) as ex: list(ex.map(get, jobs))
print(len(jobs), "tiles at z", Z)
