// ---------- title screen menu: STORY and FRENZY, the unlockable modes, a big trembling COOP OF DESPAIR ----------
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
  const cx = Math.round(W * .3), top = Math.round(H * .03);
  // the longest word must fit in the left part of the screen
  let TS = Math.max(24, Math.min(36, Math.round(H * .112)));
  ctx.font = TS + 'px Silkscreen, ui-monospace, monospace'; const ww = ctx.measureText('OF DESPAIR').width;
  if (ww > W * .56) TS = Math.max(16, Math.floor(TS * W * .56 / ww));
  const shud = !reduced && (t % 4.6) < .22, amt = shud ? 4 : 1.6, jx = shud ? ri(-2, 2) : 0;
  NOTR = true;
  shakeText('COOP', cx + jx, top, TS, QS >= 3 && QS < 5 ? '#efe4ff' : '#e8e2d8', '#2a0610', t, 0, amt);
  shakeText('OF DESPAIR', cx - jx, top + TS + 1, TS, '#b8202e', '#1a0206', t, 1, amt);
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
  // the modes bought at the Bastion: visible from the start, locked until paid for.
  // A column at the bottom left, on the dark cliff: every name has room to be read in full.
  const fs = 8, ps = 7, rh = 15, pad = 6;
  ctx.font = (fs * FONTK) + 'px Silkscreen, ui-monospace, monospace';
  const nameW = Math.max(...MODES.map(md => ctx.measureText(tr(md.name)).width));
  ctx.font = (ps * FONTK) + 'px Silkscreen, ui-monospace, monospace';
  const priceW = Math.max(...MODES.map(md => ctx.measureText(md.price + L3(' CORN', ' MAIS', ' MAÍZ')).width), ctx.measureText(L3('PLAY', 'GIOCA', 'JUGAR') + ' ▶').width);
  const colW = Math.ceil(14 + nameW + 10 + priceW + pad), bx = 8, by0 = Math.round(H) - 8 - MODES.length * (rh + 3);
  txt(L3('MORE MODES', 'ALTRE MODALITÀ', 'MÁS MODOS'), bx + 2, by0 - 11, '#c8b090', 'left', 7, '#000');
  MODES.forEach((md, i) => {
    const own = (SV.modes || []).includes(md.id), yy = by0 + i * (rh + 3);
    rect(ctx, bx, yy, colW, rh, own ? 'rgba(90,40,20,.92)' : 'rgba(14,8,12,.88)'); rect(ctx, bx, yy, 2, rh, own ? '#ffb27a' : '#5a4a50');
    if (!own) lockIcon(bx + 6, yy + 4, '#9a8a8a');
    txt(tr(md.name), bx + 16, yy + 4, own ? '#ffe8c8' : '#c8b8b8', 'left', fs, '#000');
    txt(own ? TTX(L3('PLAY', 'GIOCA', 'JUGAR') + ' ▶') : TTX(md.price + L3(' CORN', ' MAIS', ' MAÍZ')), bx + colW - pad, yy + 5, own ? '#ffb27a' : '#ffd23f', 'right', ps, '#000');
    S.tBtns.push({
      r: devRect(bx, yy, colW, rh), act: () => {
        if (own) { au(); startMode(md.id); return; }
        SFX.tink(); S.tMsg = { s: TTX(L3('Unlock it at the Bastion: ', 'Si sblocca al Baluardo: ', 'Se desbloquea en el Baluarte: ') + md.price + L3(' corn (you have ', ' mais (ne hai ', ' maíz (tienes ') + (SV.credits || 0) + ')'), t: S.t };
      }
    });
  });
  if (S.tMsg && S.t - S.tMsg.t < 3.2) txt(S.tMsg.s, cx, y + 2, '#ffe14a', 'center', 7, '#000');
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
