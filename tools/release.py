# PWA page = PWA head (from the current release) + game body (after the Google Fonts link) + PWA tail
import sys
g=open('build/tower-of-poop.html').read();p='worker/www/index.html';r=open(p).read()
k=g.find('<link href="https://fonts.googleapis.com');e=g.find('>',k)+1;gb=g[e:]
a=r.find('\n<style>\n/* Layout: one-screen');t=r.rfind('\n<script>\nif(\'serviceWorker\'')
assert a>0 and t>0 and gb.startswith('\n<style>\n/* Layout')
open(p,'w').write(r[:a]+gb.rstrip('\n')+r[t:])
sw='worker/www/sw.js';import re
w=open(sw).read();w=re.sub(r"top-v\d+","top-v"+sys.argv[1],w);open(sw,'w').write(w)
