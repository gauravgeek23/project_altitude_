import math, os, urllib.request, concurrent.futures as cf
W,E,S,N = 75.35,79.6,30.35,35.7
Z=9
def tx(lon): return int((lon+180)/360*2**Z)
def ty(lat):
    r=math.radians(lat); return int((1-math.log(math.tan(r)+1/math.cos(r))/math.pi)/2*2**Z)
jobs=[(x,y) for x in range(tx(W),tx(E)+1) for y in range(ty(N),ty(S)+1)]
def get(t):
    x,y=t; p=f'data/dem/{Z}_{x}_{y}.png'
    if not os.path.exists(p): urllib.request.urlretrieve(f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{x}/{y}.png',p)
    return p
with cf.ThreadPoolExecutor(8) as ex: print(len(list(ex.map(get,jobs))),'tiles', tx(W),tx(E),ty(N),ty(S))
