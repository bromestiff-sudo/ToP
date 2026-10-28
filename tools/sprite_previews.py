# Contact sheets (x4) + README for the exported sprite pack. Usage: python3 sprite_previews.py <pack folder>
import os, glob, sys
from PIL import Image, ImageDraw
os.chdir(sys.argv[1] if len(sys.argv) > 1 else '.')
os.makedirs('preview-x4', exist_ok=True)
for d in sorted(x for x in os.listdir('.') if os.path.isdir(x) and x != 'preview-x4'):
    files = sorted(glob.glob(d + '/*_f1.png') + [f for f in glob.glob(d + '/*.png') if '_f' not in f])
    ims = [(os.path.basename(f), Image.open(f).convert('RGBA')) for f in files]
    if not ims: continue
    S = 4; cell = max(max(i.width, i.height) for _, i in ims) * S + 16; cols = max(1, min(8, 1600 // cell)); rows = (len(ims) + cols - 1) // cols
    sheet = Image.new('RGBA', (cols * cell, rows * (cell + 14)), (26, 14, 20, 255)); dr = ImageDraw.Draw(sheet)
    for k, (n, i) in enumerate(ims):
        x = (k % cols) * cell; y = (k // cols) * (cell + 14); b = i.resize((i.width * S, i.height * S), Image.NEAREST)
        sheet.alpha_composite(b, (x + (cell - b.width) // 2, y + (cell - b.height) // 2)); dr.text((x + 4, y + cell), n.replace('_f1.png', '').replace('.png', '')[:22], fill=(236, 208, 120, 255))
    sheet.save(f'preview-x4/{d}.png')
open('README.txt', 'w').write("""TOWER OF POOP - sprite references for PixelLab
================================================
Every sprite currently in the game, exported at its NATIVE size (1 game pixel = 1 image pixel),
with transparent background. Animated sprites have one file per frame (_f1, _f2, ...).

  characters/       the 5 playable characters (roll soldier 20x24, others their own size)
  hens/             the 7 hens, one per floor (52x48)
  bosses/           the other floor bosses (52x48)
  final/            the Heart of the Tower and the primordial egg
  fallen-brothers/  the 12 fallen brothers (mini-bosses)
  enemies/          the poops and their friends
  npcs/ items/ weapons/ pickups/ props/ fx/
  preview-x4/       one contact sheet per folder, enlarged 4x, just to look at
  manifest.csv      every sprite with its size and number of frames

HOW TO USE THEM IN PIXELLAB
  - Keep the same canvas size as the original (see manifest.csv): the game expects it.
  - "Create S-XL image (Pro)": up to 4 reference images + 1 style image -> new versions.
  - "Create images from style references (Pro)": feed several sprites of one family
    (e.g. all hens) to keep one consistent style across the set.
  - "Edit image" / "Edit image (Pro)": start from the original and ask for changes.
  - "Animate with text": give the new sprite as reference to get walk/attack frames.
  - Export as PNG with transparent background, same file names, and send them back:
    they will be wired into the game in place of the drawn ones.
""")
print('previews done')
