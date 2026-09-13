"""Mede o centro horizontal real de cada linha de conteúdo de um story.
Uso: python3 measure_axis.py arquivo.png [y0 y1]"""
import sys
from PIL import Image

img = Image.open(sys.argv[1]).convert('L')
W, H = img.size
y0 = int(sys.argv[2]) if len(sys.argv) > 2 else 280
y1 = int(sys.argv[3]) if len(sys.argv) > 3 else 1640
px = img.load()
TH = 205  # papel ~245; tinta 3 = 158 → conta como tinta

bands, cur = [], None
for y in range(y0, y1):
    xs = [x for x in range(60, W - 60) if px[x, y] < TH]
    if xs:
        if cur is None:
            cur = [y, y, min(xs), max(xs)]
        else:
            cur[1] = y; cur[2] = min(cur[2], min(xs)); cur[3] = max(cur[3], max(xs))
    elif cur is not None:
        bands.append(cur); cur = None
if cur:
    bands.append(cur)

# junta faixas separadas por menos de 8 px (acentos, descendentes)
merged = []
for b in bands:
    if merged and b[0] - merged[-1][1] < 8:
        m = merged[-1]; m[1] = b[1]; m[2] = min(m[2], b[2]); m[3] = max(m[3], b[3])
    else:
        merged.append(b)

print(f'{"y":>11} {"x":>11} {"largura":>7} {"centro":>7} {"desvio":>6}')
for a, b, l, r in merged:
    c = (l + r + 1) / 2
    print(f'{a:>5}–{b:<5} {l:>5}–{r:<5} {r - l + 1:>7} {c:>7.1f} {c - W / 2:>+6.1f}')
