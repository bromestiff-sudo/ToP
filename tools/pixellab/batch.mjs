// Redraws a group of game sprites with PixelLab (Bitforge: the original sprite guides the shape,
// an optional style image guides the look). Results go to art/generated/<group>/ at the ORIGINAL size.
// Env: PIXELLAB_SECRET (required), GROUP, STYLE_PROMPT, STRENGTH (0-1000), LIMIT, ONLY, DRY_RUN, STYLE_IMAGE
import fs from 'fs'; import path from 'path'; import { PixelLabClient, Base64Image } from '@pixellab-code/pixellab'; import { PNG } from 'pngjs';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const ref = path.join(root, 'art/reference'), out = path.join(root, 'art/generated');
const GROUP = process.env.GROUP || 'hens', LIMIT = +(process.env.LIMIT || 50), DRY = process.env.DRY_RUN === 'true';
const STRENGTH = +(process.env.STRENGTH || 300), ONLY = (process.env.ONLY || '').split(',').map(s => s.trim()).filter(Boolean);
const STYLE = process.env.STYLE_PROMPT || 'dark, macabre, grimy pixel art for a top-down roguelike, cute shapes but creepy details, strong dark outline, limited palette';
const rows = fs.readFileSync(path.join(ref, 'manifest.csv'), 'utf8').trim().split('\n').slice(1).map(l => l.match(/"((?:[^"]|"")*)"/g).map(x => x.slice(1, -1).replace(/""/g, '"')));
let todo = rows.filter(r => r[0] === GROUP && (!ONLY.length || ONLY.some(o => r[1].includes(o)))).slice(0, LIMIT);
if (!todo.length) { console.log('Nothing to do for group', GROUP); process.exit(0); }
const client = DRY ? null : PixelLabClient.fromEnv();
if (client) { try { console.log('Balance:', JSON.stringify(await client.getBalance())); } catch (e) { console.log('Balance check failed:', e.message); } }
const styleImg = process.env.STYLE_IMAGE && fs.existsSync(path.join(root, process.env.STYLE_IMAGE)) ? await Base64Image.fromFile(path.join(root, process.env.STYLE_IMAGE)) : null;
fs.mkdirSync(path.join(out, GROUP), { recursive: true });
// PixelLab works better on canvases of at least 32px: pad small sprites onto a bigger canvas, crop back after
const padTo = (png, W, H) => { const o = new PNG({ width: W, height: H }); const x0 = (W - png.width) >> 1, y0 = (H - png.height) >> 1; PNG.bitblt(png, o, 0, 0, png.width, png.height, x0, y0); return { o, x0, y0 }; };
let spent = 0, done = 0;
for (const [folder, file, label, size, frames, note] of todo) {
  const name = file + (+frames > 1 ? '_f1' : '') + '.png', src = path.join(ref, folder, name);
  if (!fs.existsSync(src)) { console.log('missing', src); continue; }
  const png = PNG.sync.read(fs.readFileSync(src)), W = Math.max(32, png.width), H = Math.max(32, png.height), { o, x0, y0 } = padTo(png, W, H);
  const KIND = { characters: 'a small soldier character', hens: 'a giant hen boss', bosses: 'a monstrous boss', 'fallen-brothers': 'a ghostly toilet-paper soldier mini-boss', enemies: 'a small living poop monster', items: 'an item icon', weapons: 'a weapon icon', pickups: 'a pickup icon', props: 'a game prop', npcs: 'a character', fx: 'a small effect sprite', final: 'a final boss' }[GROUP] || 'a game sprite';
  const sub = (note || '').split(' — ')[1] || '', what = label.replace(/^\d+-/, '').replace(/-/g, ' ').toLowerCase();
  const description = `${what}, ${KIND}${sub ? ', ' + sub.toLowerCase() : ''}. ${STYLE}`;
  console.log(`\n▶ ${folder}/${name}  ${png.width}x${png.height}\n  "${description}"`);
  if (DRY) continue;
  try {
    const r = await client.generateImageBitforge({ description, imageSize: { width: W, height: H }, noBackground: true,
      initImage: Base64Image.fromBuffer(PNG.sync.write(o)), initImageStrength: STRENGTH, ...(styleImg ? { styleImage: styleImg, styleStrength: 30 } : {}) });
    let res = PNG.sync.read(r.image.toBuffer());
    if (res.width !== png.width || res.height !== png.height) { const c = new PNG({ width: png.width, height: png.height }); PNG.bitblt(res, c, Math.min(x0, res.width - png.width), Math.min(y0, res.height - png.height), png.width, png.height, 0, 0); res = c; }
    fs.writeFileSync(path.join(out, GROUP, name), PNG.sync.write(res)); spent += r.usage?.usd || 0; done++;
    console.log(`  ✔ saved  (cost $${(r.usage?.usd || 0).toFixed(4)})`);
  } catch (e) { console.log('  ✘', e.name || '', e.message); if (/auth/i.test(e.name + e.message)) process.exit(1); }
}
console.log(`\nDone: ${done}/${todo.length} sprites, total cost $${spent.toFixed(4)}. Files in art/generated/${GROUP}/`);
