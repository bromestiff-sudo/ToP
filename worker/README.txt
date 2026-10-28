TOWER OF POOP — app + online co-op + stats (Cloudflare Worker)
===============================================================

This folder contains:
  www/           the game (installable app: page, service worker, manifest, fonts, icons)
  worker.js      the small server: serves the game, links the two co-op players, keeps anonymous stats
The Cloudflare configuration (wrangler.toml) is in the repository root.

AUTOMATIC DEPLOY (no terminal)
   Cloudflare dashboard -> Workers & Pages -> Create -> Import a repository -> this repo.
   Root directory: empty.  Build command: empty.  Deploy command: npx wrangler deploy
   Every push to main goes live in a couple of minutes.

FIRST TIME (about 10 minutes)
1) Install Node.js (LTS) from nodejs.org.
2) Open Terminal (Mac) or PowerShell (Windows) in the repository root (the folder with wrangler.toml).
3) Link your Cloudflare account:
       npx wrangler login
   (the browser opens: accept)
4) Publish:
       npx wrangler deploy
   The Worker is called "tower-of-poop", so it replaces the existing one and the
   address stays the same (tower-of-poop.<your-account>.workers.dev).
   If your Worker has another name, change the name line in wrangler.toml.

LATER UPDATES
   Rebuild with ./build.sh <version> from the repository root (it refreshes worker/www), then:
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

   Open  https://tower-of-poop.<your-subdomain>.workers.dev/stats
   The first time, the page asks you to CREATE a password (at least 8 characters).
   After that it asks you to sign in; the browser stays signed in for 30 days.
   Only a salted hash of the password is stored. 10 wrong passwords lock sign-in for 10 minutes.
   Forgot it? Add a secret named STATS_KEY in the dashboard (Settings -> Variables and Secrets,
   type Secret): it replaces the browser-made password.
   Raw data: /stats?format=json

   Protections: at most 40 events per minute per connection, only known values accepted,
   tables capped in rows, payloads over 4 KB dropped, only from the game's own page.
   Co-op cuts messages over 512 KB and anyone sending more than 300 per second.
