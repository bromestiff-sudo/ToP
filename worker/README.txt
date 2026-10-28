TOWER OF POOP — app + online co-op + stats (Cloudflare Worker)
===============================================================

This folder contains:
  www/           the game (installable app: page, service worker, manifest, fonts, icons)
  worker.js      the small server: serves the game, links the two co-op players, keeps anonymous stats
  wrangler.toml  the Cloudflare configuration

FIRST TIME (about 10 minutes)
1) Install Node.js (LTS) from nodejs.org.
2) Open Terminal (Mac) or PowerShell (Windows) inside this folder.
3) Link your Cloudflare account:
       npx wrangler login
   (the browser opens: accept)
4) Publish:
       npx wrangler deploy
   The Worker is called "tower-of-poop", so it replaces the existing one and the
   address stays the same (tower-of-poop.<your-account>.workers.dev).
   If your Worker has another name, change it on the first line of wrangler.toml.

LATER UPDATES
   Rebuild with ../build.sh <version> (it refreshes www/), then:
       npx wrangler deploy

PLAYING CO-OP
   - Both players open the game from the Worker link (or the installed app).
   - Player 1: Bastion -> START gate -> ONLINE CO-OP -> CREATE GAME. A 4-letter code appears.
   - Player 2: same path -> JOIN -> types the code.
   - As soon as the second player joins, the run starts from floor 1.

ANONYMOUS STATS (since version 159, hardened in 161)
   The game sends anonymous events to the Worker: run start and end (mode, character,
   floor reached, what killed you, bosses beaten, length, act, language) and game errors
   (message and code line only). No names, no ids, no IPs.

   The page is CLOSED until you set a password (once):
       npx wrangler secret put STATS_KEY
   Then open:   https://tower-of-poop.<your-account>.workers.dev/stats?k=<your-password>
   The password moves into a cookie and leaves the address bar; for 30 days just open
   /stats.   Raw data: /stats?format=json

   Protections: at most 40 events per minute per connection, only known values accepted,
   tables capped in rows, payloads over 4 KB dropped, only from the game's own page.
   Co-op cuts messages over 512 KB and anyone sending more than 300 per second.
