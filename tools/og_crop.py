# Crops build/og-raw.png to the 1200x630 preview and saves worker/www/og.jpg
from PIL import Image
im = Image.open('build/og-raw.png').convert('RGB'); W, H = im.size
h = 830; w = int(h * 1.905); x0 = int((W - w) / 2) + 40
im.crop((x0, 0, x0 + w, h)).resize((1200, 630), Image.LANCZOS).save('worker/www/og.jpg', quality=90, optimize=True)
print('worker/www/og.jpg')
