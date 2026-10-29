// ---------- title screen menu: STORY and FRENZY, the unlockable modes, a big trembling title ----------
// Buttons remember where they were drawn in device pixels, so taps match whatever transform the canvas uses.
function devRect(x, y, w, h) { const m = ctx.getTransform(); return [x * m.a + m.e, y * m.d + m.f, w * m.a, h * m.d]; }
function hitDev(e, r) {
  const c = cv.getBoundingClientRect(), k = cv.width / c.width, px = (e.clientX - c.left) * k, py = (e.clientY - c.top) * (cv.height / c.height), pad = 4 * k;
  return px >= r[0] - pad && px <= r[0] + r[2] + pad && py >= r[1] - pad && py <= r[1] + r[3] + pad;
}
// every letter trembles on its own, and every few seconds the whole word shudders
function shakeText(str, cx, y, size, col, shadow, t, seed, amt) {
  ctx.font = size + 'px Silkscreen, ui-monospace, monospace'; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
  const w = ctx.measureText(str).width; let x = cx - w / 2; const fr = Math.floor(t * 16);
  for (let i = 0; i < str.length; i++) {
    const ch = str[i], cw = ctx.measureText(ch).width; let dx = 0, dy = 0;
    if (!reduced) { const h = Math.sin((fr + 1) * 12.9898 + i * 78.233 + seed * 31.7) * 43758.5453, r = h - Math.floor(h), r2 = (r * 7.31) % 1; dx = Math.round((r - .5) * amt); dy = Math.round((r2 - .5) * amt); }
    ctx.fillStyle = shadow; ctx.fillText(ch, Math.round(x) + dx + 2, y + dy + 3); ctx.fillStyle = col; ctx.fillText(ch, Math.round(x) + dx, y + dy); x += cw;
  }
}
function lockIcon(x, y, col) { rect(ctx, x + 1, y, 4, 1, col); rect(ctx, x, y + 1, 1, 2, col); rect(ctx, x + 5, y + 1, 1, 2, col); rect(ctx, x - 1, y + 3, 8, 5, col); rect(ctx, x + 2, y + 5, 2, 1, '#120808'); }
function titleMenu(t, QS) {
  const cx = Math.round(W * .3), TS = Math.max(24, Math.min(36, Math.round(H * .112))), top = Math.round(H * .03);
  const shud = !reduced && (t % 4.6) < .22, amt = shud ? 4 : 1.6, jx = shud ? ri(-2, 2) : 0;
  NOTR = true;
  shakeText('TOWER', cx + jx, top, TS, QS >= 3 && QS < 5 ? '#efe4ff' : '#f6f4ee', '#3a1020', t, 0, amt);
  shakeText('OF POOP', cx - jx, top + TS + 1, TS, '#ecd078', '#3a1a08', t, 1, amt);
  NOTR = false;
  let y = top + 2 * TS + 5;
  txt('STARRING  SGT. TWO-PLY', cx, y, '#ffb0a0', 'center', 8, '#2a0a14'); y += 12;
  // the act: there is always a sequel
  const A = storyAct(), lab = TTX(L3('ACT ', 'ATTO ', 'ACTO ') + (A >= 3 ? 'III' : A >= 2 ? 'II' : 'I'));
  const sub = A >= 3 ? L3('THE HEART OF THE TOWER', 'IL CUORE DELLA TORRE', 'EL CORAZÓN DE LA TORRE') : A >= 2 ? L3("THE QUEEN'S DIARY", 'IL DIARIO DELLA REGINA', 'EL DIARIO DE LA REINA') : L3("THE GENERAL'S DIARY", 'IL DIARIO DEL GENERALE', 'EL DIARIO DEL GENERAL');
  rect(ctx, cx - 66, y, 132, 26, 'rgba(16,3,8,.78)'); rect(ctx, cx - 66, y, 132, 1, '#a01f2f'); rect(ctx, cx - 66, y + 25, 132, 1, '#a01f2f');
  txt(lab, cx, y + 2, A >= 3 ? '#ffd23f' : A >= 2 ? '#c8a0ff' : '#ff5a4a', 'center', 13, '#2a0a14'); txt(sub, cx, y + 17, '#ecd078', 'center', 7, '#1a0a10'); y += 31;
  S.tBtns = [];
  const pl = .8 + .2 * Math.sin(t * 4);
  const big = (x, w, label, base, hi, act) => {
    rect(ctx, x - 1, y - 1, w + 2, 20, '#120408'); rect(ctx, x, y, w, 18, base); rect(ctx, x, y, w, 2, hi); rect(ctx, x, y + 16, w, 2, 'rgba(0,0,0,.35)');
    ctx.globalAlpha = pl; txt(label, x + w / 2, y + 4, '#fff4e8', 'center', 9, '#1a0408'); ctx.globalAlpha = 1;
    S.tBtns.push({ r: devRect(x, y, w, 18), act });
  };
  big(cx - 90, 86, TTX('▶ ' + L3('STORY', 'STORIA', 'HISTORIA')), '#3a2a12', '#8a6a2a', () => newGame());
  big(cx + 4, 86, TTX('▶ ' + L3('FRENZY', 'FRENESIA', 'FRENESÍ')), '#7a1020', '#c8343e', () => startFrenzy());
  y += 23;
  // the modes bought at the Bastion: visible from the start, locked until paid for
  ctx.font = '7px Silkscreen, ui-monospace, monospace';
  const ws = MODES.map(md => Math.ceil(ctx.measureText(tr(md.name)).width) + 22), gap = 4, tot = ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1);
  let xx = Math.round(cx - tot / 2);
  MODES.forEach((md, i) => {
    const own = (SV.modes || []).includes(md.id), cw = ws[i], x = xx; xx += cw + gap;
    rect(ctx, x, y, cw, 15, own ? 'rgba(90,40,20,.9)' : 'rgba(20,12,16,.85)'); rect(ctx, x, y, cw, 1, own ? '#ffb27a' : '#4a3a40');
    if (!own) lockIcon(x + 4, y + 4, '#8a7a7a');
    txt(tr(md.name), x + cw / 2 + (own ? 0 : 5), y + 4, own ? '#ffd8b0' : '#8a7a7a', 'center', 7, '#000');
    S.tBtns.push({
      r: devRect(x, y, cw, 15), act: () => {
        if (own) { au(); startMode(md.id); return; }
        SFX.tink(); S.tMsg = { s: TTX(L3('Unlock it at the Bastion: ', 'Si sblocca al Baluardo: ', 'Se desbloquea en el Baluarte: ') + md.price + L3(' corn (you have ', ' mais (ne hai ', ' maíz (tienes ') + (SV.credits || 0) + ')'), t: S.t };
      }
    });
  });
  y += 19;
  if (S.tMsg && S.t - S.tMsg.t < 3.2) txt(S.tMsg.s, cx, y, '#ffe14a', 'center', 7, '#000');
}
function titleTap(e) { for (const b of S.tBtns || []) if (hitDev(e, b.r)) { b.act(); return true; } return false; }
// after a frenzy: play again or go to the Bastion
function frenzyOverButtons(cx, y) {
  S.oBtns = [];
  const one = (x, w, label, base, act) => { rect(ctx, x - 1, y - 1, w + 2, 18, '#120408'); rect(ctx, x, y, w, 16, base); txt(label, x + w / 2, y + 4, '#fff4e8', 'center', 8, '#1a0408'); S.oBtns.push({ r: devRect(x, y, w, 16), act }); };
  one(cx - 96, 92, TTX('▶ ' + L3('PLAY AGAIN', 'RIGIOCA', 'OTRA VEZ')), '#7a1020', () => startFrenzy());
  one(cx + 4, 92, TTX(L3('BASTION', 'BALUARDO', 'BALUARTE')), '#3a2a12', () => { FADE = .8; enterHub(); });
}
function overTap(e) { if (!(G && G.frenzy) || performance.now() - (S.overT0 || 0) < 1500) return false; for (const b of S.oBtns || []) if (hitDev(e, b.r)) { b.act(); return true; } return false; }
