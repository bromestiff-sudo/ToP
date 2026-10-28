# Tower of Poop

Roguelike dall'alto in pixel art: un rotolo di carta igienica contro una torre di cacca e le sue galline.
Sembra un gioco per bambini. Non lo è.

## Come è fatto
Il gioco è **un solo file HTML** (`build/tower-of-poop.html`), generato dai sorgenti in `src/`:

| Cartella | Cosa c'è |
|---|---|
| `src/base/base-v150.html` | il gioco alla versione 150, da cui parte ogni build |
| `src/story.py`, `src/imz1-6.py`, `src/mem.py`, `src/endx.py` | storia, capitoli, intermezzi e ricordi (EN/IT/ES) |
| `src/*.js` | i moduli aggiunti dopo la 150: motore della storia, ricordi, progressione, regole dei boss, personaggi, minigiochi, attacchi nuovi, statistiche |
| `src/build_imz.py`, `src/patch_v152.py` … `patch_v161.py` | applicano storia e moduli sopra la base, una versione alla volta |
| `tools/mktw.py` | crea `build/tw.html`, la build per i test automatici |
| `tools/release.py` | copia il gioco nella app (`worker/www`) e alza la versione della cache |
| `worker/` | il server Cloudflare: serve il gioco, la co-op online e le statistiche anonime |
| `tests/` | test automatici con Playwright |

Ogni patch cerca un pezzo di codice preciso e controlla di trovarlo il numero giusto di volte: se qualcosa non torna, la build si ferma invece di produrre un gioco rotto.

## Costruire il gioco
Servono Python 3 e Node.js.

```bash
./build.sh          # build/tower-of-poop.html + build/tw.html
./build.sh 162      # in più aggiorna worker/www alla versione 162
```

## Pubblicare
```bash
cd worker
npx wrangler deploy
```
La prima volta: `npx wrangler login`. Le statistiche sono chiuse finché non imposti una password con `npx wrangler secret put STATS_KEY` (poi `/stats?k=<password>`). Dettagli in `worker/LEGGIMI.txt`.

## Test
```bash
npm i -D playwright && npx playwright install chromium
./build.sh
node tests/chr.js        # personaggi
node tests/act.js        # atti della storia
node tests/memt.js       # ricordi al fuoco
node tests/tr.js         # traduzioni
node tests/atk2.js 0,1,2,21   # attacchi dei boss (indici dei boss)
node tests/worker.test.mjs    # protezioni del Worker
```
Gli screenshot finiscono in `tests/out/`.

## Aggiungere una versione
1. Crea `src/patch_v162.py` sul modello delle precedenti (`rep(vecchio, nuovo, quante_volte)`).
2. `./build.sh 162`, prova, poi `cd worker && npx wrangler deploy`.
3. Commit.

La storia completa e le regole del mondo sono nella Lore Bible (documento separato su Claude).
