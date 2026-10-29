// ---------- the title sky follows the story: high sun in act I, halfway in act II, sunset and a violet aura in act III ----------
function titleSun(g, act, w, h, hz, tx) {
  if (act >= 3) return false; // act III keeps the original sunset
  const sr = Math.round(h * (act === 1 ? .085 : .11)), sx = tx + Math.round(h * (act === 1 ? .1 : .13)), sy = act === 1 ? Math.round(h * .2) : Math.round(hz - h * .26);
  // halo
  for (let r = sr * 3; r > sr; r -= 2) { g.globalAlpha = .05 * (1 - (r - sr) / (sr * 2)); g.fillStyle = act === 1 ? '#fff0b0' : '#ffc070'; g.beginPath(); g.arc(sx, sy, r, 0, Math.PI * 2); g.fill(); }
  g.globalAlpha = 1;
  for (let y = -sr; y <= sr; y++) for (let x = -sr; x <= sr; x++) if (x * x + y * y <= sr * sr) {
    g.fillStyle = act === 1 ? (y < -sr * .3 ? '#fffbe0' : y < sr * .3 ? '#fff0b0' : '#ffd890') : (y < -sr * .3 ? '#ffe0a0' : y < sr * .2 ? '#ffc070' : '#ff9a50'); g.fillRect(sx + x, sy + y, 1, 1);
  }
  return true;
}
function titleSky(act) {
  if (act === 1) return ['#1c2048', '#262c5a', '#38386a', '#544470', '#7a5474', '#a26872', '#c8806e', '#e2a070', '#f0c080', '#f6d898'];
  if (act === 2) return ['#18102a', '#24163a', '#341c44', '#4c2448', '#6a2e48', '#8e3a44', '#b44e3a', '#d86c36', '#ea8e40', '#f4ae58'];
  return null;
}
// sunlight on the side of the tower that faces the sun
function titleTowerLight(g, act, h, B) {
  if (act >= 3) return; const base = B.hz + 2, th = (base - B.top) / 7, n = act === 1 ? 4 : 2;
  for (let i = 7 - n; i < 7; i++) {
    const y0 = Math.round(base - (i + 1) * th), y1 = Math.round(base - i * th), hw = Math.round((26 - i * 2.4) * h / 288), k = (i - (7 - n) + 1) / n;
    g.globalAlpha = (act === 1 ? .85 : .55) * k; g.fillStyle = act === 1 ? '#ffd890' : '#ffb060'; g.fillRect(B.tx + hw - 3, y0, 3, y1 - y0); g.fillRect(B.tx - hw, y0, hw * 2, 1);
  }
  g.globalAlpha = act === 1 ? .9 : .6; g.fillStyle = act === 1 ? '#ffe8b0' : '#ffc070'; g.fillRect(B.tx - 5, B.top - 10, 10, 1); g.fillRect(B.tx + 3, B.top - 10, 2, 10); g.globalAlpha = 1;
}
// act III: the tower breathes a violet aura
function titleAura(B, t, h) {
  const tx = B.tx, top = B.top - 14, base = B.hz + 2, mid = (top + base) / 2, p = .65 + .35 * Math.sin(t * 1.6);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const gr = ctx.createRadialGradient(tx, mid, h * .04, tx, mid, h * .46); gr.addColorStop(0, 'rgba(170,70,230,' + (.3 * p) + ')'); gr.addColorStop(.6, 'rgba(130,40,200,' + (.12 * p) + ')'); gr.addColorStop(1, 'rgba(120,40,180,0)');
  ctx.fillStyle = gr; ctx.fillRect(tx - h * .5, top - h * .2, h, base - top + h * .3);
  titleTower(B, h, (i, y0, y1, hw) => { ctx.globalAlpha = .45 * p; ctx.fillStyle = '#c070ff'; ctx.fillRect(tx - hw - 2, y0, 2, y1 - y0); ctx.fillRect(tx + hw, y0, 2, y1 - y0); });
  if (!reduced) for (let k = 0; k < 18; k++) {
    const per = 4 + k % 5, u = ((t + k * 1.37) % per) / per, x = tx + Math.sin(k * 2.1 + t * .7) * (h * .05 + (k % 4) * 3), y = base - u * (base - top + h * .12);
    ctx.globalAlpha = (1 - u) * .85; ctx.fillStyle = k % 3 ? '#d8a0ff' : '#ffffff'; ctx.fillRect(Math.round(x), Math.round(y), 1 + (k % 5 === 0), 1 + (k % 5 === 0));
  }
  ctx.restore();
}
