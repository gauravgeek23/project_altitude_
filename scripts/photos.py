#!/usr/bin/env python3
"""Photos for the guide, from a shared Google Photos album.

  python3 scripts/photos.py list  <share link>   # every item of the album -> scripts/album-items.json
  python3 scripts/photos.py sheets               # contact sheets (numbered, with times) in /tmp/altitude-sheets
  python3 scripts/photos.py build                # scripts/photo-selection.json -> public/photos/ + src/content/photos.json

The selection file maps a place id (or dish-*, story, creator) to a list of album items by their
Google media id, each with a caption. `build` fetches two web sizes of each (1600 and 640 px on
the long side, EXIF stripped by Google) and writes the manifest the app reads.

Needs: Pillow (for sheets only). No Google account: the album must be shared by link.
"""
import json, os, re, sys, time, urllib.parse, urllib.request, concurrent.futures as cf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ITEMS = f"{ROOT}/scripts/album-items.json"
SELECTION = f"{ROOT}/scripts/photo-selection.json"
OUT_DIR = f"{ROOT}/public/photos"
MANIFEST = f"{ROOT}/src/content/photos.json"
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"}


def fetch(url, data=None, headers=None):
    req = urllib.request.Request(url, data=data, headers={**UA, **(headers or {})})
    return urllib.request.urlopen(req, timeout=90).read()


def norm(it):
    m = it[1]
    return {"id": it[0], "url": m[0], "w": m[1], "h": m[2], "ts": it[2], "tz": it[4],
            "video": any(isinstance(v, dict) and "146008172" in v for v in it)}


def list_album(share):
    html = fetch(share).decode("utf-8", "ignore")
    album = re.search(r'/share/(AF1Qip[\w-]+)', html).group(1)
    key = re.search(r'[?&]key=([\w-]+)', html).group(1)
    blocks = dict(re.findall(r"AF_initDataCallback\(\{key: '(ds:\d+)',[^\[]*?data:(.*?), sideChannel: \{\}\}\);</script>", html, re.S))
    first = json.loads(blocks["ds:1"])
    items, tok = [norm(i) for i in first[1]], first[2]
    while tok:
        req = json.dumps([[["snAcKc", json.dumps([album, tok, None, key]), None, "generic"]]])
        body = urllib.parse.urlencode({"f.req": req}).encode()
        t = fetch(f"https://photos.google.com/_/PhotosUi/data/batchexecute?rpcids=snAcKc&source-path=/share/{album}&hl=en&rt=c",
                  body, {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"}).decode()
        m = re.search(r'\[\["wrb\.fr","snAcKc","(.*?)",null,null,null,"generic"\]', t, re.S)
        inner = json.loads(json.loads('"' + m.group(1) + '"'))
        items += [norm(i) for i in inner[1]]
        tok = inner[2] if len(inner) > 2 else None
        print(len(items), file=sys.stderr); time.sleep(0.4)
    items.sort(key=lambda x: x["ts"])
    json.dump({"album": album, "key": key, "items": items}, open(ITEMS, "w"))
    print(f"{len(items)} items ({sum(i['video'] for i in items)} videos) -> {ITEMS}")


def sheets():
    import datetime as dt
    from PIL import Image, ImageDraw, ImageFont
    items = json.load(open(ITEMS))["items"]
    d = "/tmp/altitude-sheets"; os.makedirs(f"{d}/thumbs", exist_ok=True)
    def get(a):
        k, x = a; p = f"{d}/thumbs/{k:04d}.jpg"
        if not os.path.exists(p): open(p, "wb").write(fetch(x["url"] + "=w360-h360-no"))
    with cf.ThreadPoolExecutor(16) as ex: list(ex.map(get, enumerate(items)))
    W, H, C, R = 200, 150, 8, 5
    try: f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
    except OSError: f = ImageFont.load_default()
    for n, s in enumerate(range(0, len(items), C * R)):
        sheet = Image.new("RGB", (C * W, R * (H + 20)), "white"); dr = ImageDraw.Draw(sheet)
        for k in range(C * R):
            i = s + k
            if i >= len(items): break
            im = Image.open(f"{d}/thumbs/{i:04d}.jpg").convert("RGB"); im.thumbnail((W, H))
            x, y = (k % C) * W, (k // C) * (H + 20)
            sheet.paste(im, (x + (W - im.width) // 2, y + 20 + (H - im.height) // 2))
            t = dt.datetime.fromtimestamp((items[i]["ts"] + items[i]["tz"]) / 1000, dt.timezone.utc).strftime("%d/%m %H:%M")
            dr.text((x + 3, y + 2), f"{i} {t}{' VID' if items[i]['video'] else ''}", fill="red" if items[i]["video"] else "black", font=f)
        sheet.save(f"{d}/s{n:02d}.jpg", quality=80)
    print(f"sheets in {d}")


def build():
    import datetime as dt
    sel = json.load(open(SELECTION))
    os.makedirs(OUT_DIR, exist_ok=True)
    import io
    from PIL import Image, ImageOps
    LONG, THUMB, Q, QT = 1400, 640, 78, 76   # long side in px and JPEG quality: about 170 KB and 40 KB each
    jobs, manifest = [], {}
    for place, photos in sel.items():
        manifest[place] = []
        for n, p in enumerate(photos, 1):
            base = f"{place}-{n}"
            full, thumb = f"{OUT_DIR}/{base}.jpg", f"{OUT_DIR}/{base}-s.jpg"
            if p.get("local"):   # not from the album: the files are already in place; the thumb travels as a data URI
                import base64
                im = Image.open(full); data = "data:image/jpeg;base64," + base64.b64encode(open(thumb, "rb").read()).decode()
                manifest[place].append({"f": f"photos/{base}.jpg", "t": f"photos/{base}-s.jpg", "r": data, "w": im.width, "h": im.height, "d": p.get("date", ""), "c": p.get("caption", "")})
                continue
            jobs.append((p["url"] + f"=w{LONG}-h{LONG}-no", full, LONG, Q)); jobs.append((p["url"] + f"=w{THUMB}-h{THUMB}-no", thumb, THUMB, QT))
            w, h = p["w"], p["h"]; k = LONG / max(w, h)
            taken = dt.datetime.fromtimestamp((p["ts"] + p["tz"]) / 1000, dt.timezone.utc).strftime("%Y-%m-%d")
            manifest[place].append({"f": f"photos/{base}.jpg", "t": f"photos/{base}-s.jpg", "r": p["url"],
                                    "w": round(w * k), "h": round(h * k), "d": taken, "c": p.get("caption", "")})
    def get(j):
        url, path, long, q = j
        if os.path.exists(path) and os.path.getsize(path) > 0: return
        im = ImageOps.exif_transpose(Image.open(io.BytesIO(fetch(url)))).convert("RGB")
        im.thumbnail((long, long))
        im.save(path, "JPEG", quality=q, optimize=True, progressive=True)   # no EXIF: no location, no device
    with cf.ThreadPoolExecutor(12) as ex: list(ex.map(get, jobs))
    json.dump(manifest, open(MANIFEST, "w"), separators=(",", ":"))
    n = sum(len(v) for v in manifest.values())
    size = sum(os.path.getsize(f"{OUT_DIR}/{f}") for f in os.listdir(OUT_DIR)) // 1024 // 1024
    print(f"{n} photos for {len(manifest)} places -> {OUT_DIR} ({size} MB), manifest {MANIFEST}")


def focus_of(path):
    """Where the subject of a photo sits, as percentages of width and height: the centre of the half-width and
    half-height windows with the most edge energy (ridgelines, people, buildings score high; flat sky and
    tarmac low). Used as CSS object-position so a crop keeps the subject."""
    import numpy as np
    from PIL import Image
    im = Image.open(path).convert("L"); im.thumbnail((320, 320))
    a = np.asarray(im, dtype=np.float32)
    gy, gx = np.gradient(a); e = np.hypot(gx, gy)
    def best(profile, frac=0.5):
        n = len(profile); w = max(1, int(n * frac)); cs = np.concatenate([[0], np.cumsum(profile)])
        sums = cs[w:] - cs[:-w]; i = int(np.argmax(sums)); return round(100 * (i + w / 2) / n)
    return best(e.sum(axis=0)), best(e.sum(axis=1))


def focus():
    """Adds fx, fy (the focus point) to every manifest entry from the full-size files."""
    manifest = json.load(open(MANIFEST))
    n = 0
    for entries in manifest.values():
        for e in entries:
            path = f"{ROOT}/public/{e['f']}"
            if os.path.exists(path):
                e["fx"], e["fy"] = focus_of(path); n += 1
    json.dump(manifest, open(MANIFEST, "w"), separators=(",", ":"))
    print(f"focus points for {n} photos -> {MANIFEST}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "list": list_album(sys.argv[2])
    elif cmd == "sheets": sheets()
    elif cmd == "build": build(); focus()
    elif cmd == "focus": focus()
    else: print(__doc__)
