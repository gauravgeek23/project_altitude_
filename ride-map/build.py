import os
R=os.path.dirname(os.path.abspath(__file__))
s=open(f'{R}/page.src.html').read(); d=open(f'{R}/data.json').read()
assert '</' not in d
open(f'{R}/ride-map.html','w').write(s.replace('/*DATA*/',d))
print(os.path.getsize(f'{R}/ride-map.html')//1024,'KiB')
