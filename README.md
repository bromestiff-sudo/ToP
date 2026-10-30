# Coop of Despair

Top-down pixel-art roguelike: Sgt. Two-Ply, a roll of toilet paper, climbs a living tower raised by the Golden Hen.
The tower breathes, digests whoever goes in and births its spawn; the Queen at the top is not what she seems.
The world is dark. The only light touch is the hero himself.

(Formerly *Tower of Poop*: the files and the repository keep the old name.)

## How it is built
The game is **a single HTML file** (`build/tower-of-poop.html`), generated from the sources in `src/`:

| Folder | Contents |
|---|---|
| `src/base/base-v150.html` | the game at version 150, the starting point of every build |
| `src/story.py`, `src/imz1-6.py`, `src/mem.py`, `src/endx.py` | story, chapters, interludes and memories (EN/IT/ES) |
| `src/*.js` | modules added after 150: story engine, memories, progression, boss rules, characters, minigames, new attacks, stats |
| `src/build_imz.py`, `src/patch_v152.py` … `patch_v161.py` | apply story and modules on top of the base, one version at a time |
| `tools/mktw.py` | creates `build/tw.html`, the build used by the automated tests |
| `tools/release.py` | copies the game into the app (`worker/www`) and bumps the cache version |
| `wrangler.toml` | Cloudflare configuration (name, Durable Objects, static assets) |
| `worker/` | the Cloudflare server: serves the game, online co-op and anonymous stats |
| `tests/` | automated tests with Playwright |

Every patch looks for an exact piece of code and checks it finds it the expected number of times: if something doesn't match, the build stops instead of producing a broken game.

## Building
Requires Python 3 and Node.js.

```bash
./build.sh          # build/tower-of-poop.html + build/tw.html
./build.sh 162      # also refreshes worker/www to version 162
```

## Publishing
The Cloudflare configuration (`wrangler.toml`) is at the repository root.

- **Automatic (recommended):** connect this repository to a Worker in the Cloudflare dashboard (Workers & Pages → Create → Import a repository). Leave *Root directory* empty and *Build command* empty; *Deploy command* is `npx wrangler deploy`. Every push to `main` goes live.
- **By hand:** from the repository root run `npx wrangler deploy`.
First time: `npx wrangler login`. Stats live at `/stats`: the first time you open it you choose a password (only its salted hash is stored). A `STATS_KEY` secret set in the Cloudflare dashboard, if present, replaces it. Details in `worker/README.txt`.

## Tests
```bash
npm i -D playwright && npx playwright install chromium
./build.sh
node tests/chr.js        # characters
node tests/act.js        # story acts
node tests/memt.js       # memories by the fire
node tests/tr.js         # translations
node tests/atk2.js 0,1,2,21   # boss attacks (boss indexes)
node tests/worker.test.mjs    # Worker protections
```
Screenshots go to `tests/out/`.

## Adding a version
1. Create `src/patch_v162.py` following the previous ones (`rep(old, new, expected_count)`).
2. `./build.sh 162` and test.
3. Commit and push: Cloudflare deploys it.

The full story and world rules live in the Lore Bible (separate document).

## Music
The title screen plays `worker/www/music/opening.mp3` (the opening song, made with Suno from the in-game title theme), loaded by `src/opening.js`. Until it is loaded, and everywhere else, the music is the synthesized soundtrack.

## Tone
Since v168 the texts are serious and dark (`src/tone_v168.py`, applied by `src/patch_v168.py`): the enemies are the tower's *spawn* (IT *larve*, ES *engendros*), and only Two-Ply's lines keep a dry irony. Boss, weapon, item and place names stayed as they were.

## Game modes
- **Story**: the tower, the Bastion, the acts (Prologue, I, II, III).
- **Title screen** (`src/titlemenu.js`): STORY and FRENZY buttons, plus Endless Coop, Boss Rush and Hardcore shown locked until bought at the Bastion.
- **Frenzy** (`src/frenzy.js`, button on the title screen or key F): three minutes in the arena, a random gun,
  a shuffled deck of enemy squads (no squad repeats until the deck runs out) and a random twist every 30 seconds.
- Boss Rush, Endless Coop and Hardcore, bought with corn at the Bastion.
