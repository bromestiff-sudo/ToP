// ---------- FRENZY: three minutes of chaos in the arena, a different run every time ----------
// Reuses the Endless Coop arena (G.surv) but replaces its waves with a non-stop stream:
// a random arena, a random starting gun, a shuffled deck of enemy squads (no squad repeats
// until the deck runs out), a random twist every 30 seconds, and pickups raining down.
const FRENZY_LEN = 180;
const FRENZY_TWISTS = [
  { id: 'bouncy', n: ['BOUNCY CASTLE', 'CASTELLO GONFIABILE', 'CASTILLO HINCHABLE'], d: ['Every shot bounces', 'Ogni colpo rimbalza', 'Todos los disparos rebotan'] },
  { id: 'supersize', n: ['SUPER-SIZED', 'FORMATO GIGANTE', 'TAMAÑO GIGANTE'], d: ['Huge slow poop', 'Cacche enormi e lente', 'Caca enorme y lenta'] },
  { id: 'shrink', n: ['SHRINK RAY', 'RAGGIO RIMPICCIOLENTE', 'RAYO MENGUANTE'], d: ['Tiny fast poop', 'Cacche minuscole e veloci', 'Caca diminuta y rápida'] },
  { id: 'happy', n: ['HAPPY HOUR', 'HAPPY HOUR', 'HORA FELIZ'], d: ['Faster spraying', 'Spruzzi più veloci', 'Disparas más rápido'] },
  { id: 'goldrush', n: ['GOLD RUSH', 'CORSA ALL\'ORO', 'FIEBRE DEL ORO'], d: ['Golden elites everywhere', 'Élite d\'oro ovunque', 'Élites doradas por todas partes'] },
  { id: 'elite', n: ['ELITE SQUAD', 'SQUADRA ÉLITE', 'ESCUADRA DE ÉLITE'], d: ['Every poop is an elite', 'Ogni cacca è un\'élite', 'Cada caca es de élite'] },
  { id: 'swarm', n: ['SWARM', 'SCIAME', 'ENJAMBRE'], d: ['Twice as many, half as tough', 'Il doppio, ma più fragili', 'El doble, pero más frágiles'] },
  { id: 'calm', n: ['DEEP BREATH', 'RESPIRO', 'RESPIRO'], d: ['Fewer poops, more pickups', 'Meno cacche, più bonus', 'Menos cacas, más premios'] }];
function frShuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = ri(0, i);[a[i], a[j]] = [a[j], a[i]]; } return a; }
function frenzyDeck() {
  // squads of 3-4 enemy types, built from a shuffled list so each run mixes them differently
  const types = frShuffle(SURV_TYPES.map(t => t[0])), deck = [];
  for (let i = 0; i + 2 < types.length;) { const n = ri(3, 4); deck.push(types.slice(i, i + n)); i += n; }
  return frShuffle(deck);
}
function startFrenzy() {
  au(); FADE = .8; startSurv(); G.t0 = Date.now(); G.frenzy = { t: FRENZY_LEN, el: 0, ph: -1, sp: 1.2, pk: 5, deck: frenzyDeck(), cast: [], twist: null, used: [] };
  G.hpMax = Math.max(G.hpMax, 4); G.hp = G.hpMax; G.soap += 1;
  try { // a random gun on top of the spray, so the run starts different every time
    const pool = WEAPONS.filter(w => w.id !== 'spray' && w.id !== 'golden' && !w.secret && !w.boss), w = pool[ri(0, pool.length - 1)];
    if (w && !G.owned.includes(w.id)) { G.owned.push(w.id); if (w.ammo || w.cap) G.ammo[w.id] = ammoMax(w); G.wpn = w; G.frenzy.gun = w.name; }
  } catch (e) { }
  S.banner = null; banner(L3('FRENZY', 'FRENESIA', 'FRENESÍ'), L3('3 minutes. Survive. Score.', '3 minuti. Sopravvivi. Fai punti.', '3 minutos. Sobrevive. Puntúa.'), 2.2, '#ff5a4a');
  try { statStart(); } catch (e) { }
}
function frenzyPhase(ph) {
  const F = G.frenzy;
  if (!F.deck.length) F.deck = frenzyDeck();
  F.cast = F.deck.pop();
  G.floor = Math.min(7, 1 + ph); G.cad = 1 / (1 + ph * .12); G.sm = 1 + ph * .05; G.df = 1 + ph * .06; G.zoneMus = 1 + (ph % 7);
  // a twist for this half-minute, never the same one twice in a row
  G.event = null; F.twist = null;
  if (ph > 0) {
    const pool = FRENZY_TWISTS.filter(x => x.id !== F.lastTwist), tw = pool[ri(0, pool.length - 1)];
    F.twist = tw.id; F.lastTwist = tw.id; if (['bouncy', 'supersize', 'shrink', 'happy', 'goldrush'].includes(tw.id)) G.event = tw.id;
    banner(TTX(L3('LEVEL ', 'LIVELLO ', 'NIVEL ') + (ph + 1) + ' · ' + T3(tw.n)), T3(tw.d), 1.8, ph >= 4 ? '#ff4a5a' : '#ffb27a');
  } else banner(TTX(L3('LEVEL 1', 'LIVELLO 1', 'NIVEL 1')), F.gun ? TTX(L3('You got: ', 'Hai: ', 'Tienes: ') + tr(F.gun)) : '', 1.6, '#ffe14a');
  SFX.gate();
}
function frenzyTick(dt) {
  const F = G.frenzy; if (!F || F.done) return;
  F.t -= dt; F.el += dt;
  if (F.t <= 0) { // made it: bonus for every sheet left
    F.done = 1; F.win = 1; F.t = 0; const bonus = 500 + G.hp * 250; G.score += bonus;
    for (const e of G.enemies) if (!e.dead) { e.hp = 0; }
    banner(L3('TIME!', 'TEMPO!', '¡TIEMPO!'), TTX('+' + bonus + L3(' points', ' punti', ' puntos')), 2.4, '#ffe14a'); SFX.win();
    setTimeout(() => { if (G && G.frenzy === F && S.mode === 'play') { G.recap = makeRecap(true); gameOver(); } }, 2200);
    return;
  }
  const ph = Math.floor(F.el / 30); if (ph !== F.ph) { F.ph = ph; frenzyPhase(ph); }
  const alive = G.enemies.filter(e => !e.dead).length, sw = F.twist === 'swarm', calm = F.twist === 'calm';
  const cap = Math.round(Math.min(28, 7 + ph * 3 + F.el / 15) * (sw ? 1.6 : calm ? .6 : 1));
  F.sp -= dt;
  if (F.sp <= 0) {
    F.sp = Math.max(.3, 1.3 - ph * .15) * rnd(.7, 1.3) * (sw ? .6 : calm ? 1.6 : 1);
    if (alive + G.queue.length < cap) {
      const n = ri(1, 2 + Math.min(ph, 4)) * (sw ? 2 : 1);
      for (let i = 0; i < n; i++) G.queue.push({ type: F.cast[ri(0, F.cast.length - 1)], at: G.ft + i * .14 });
    }
  }
  G.active.kind = F.twist === 'elite' || (ph >= 3 && Math.random() < .002) ? 'elite' : null;
  if (sw) for (const e of G.enemies) if (!e.dead && !e.frSw) { e.frSw = 1; e.hp = Math.max(1, Math.ceil(e.hp * .5)); }
  // pickups rain from the sky
  F.pk -= dt;
  if (F.pk <= 0) {
    F.pk = rnd(5, 9) * (calm ? .5 : 1); const R = G.active.R;
    const t = G.hp < G.hpMax && Math.random() < .35 ? 'coffee' : ['soapbomb', 'triple', 'rapid', 'ammo', 'corn'][ri(0, 4)];
    G.picks.push({ x: rnd(R.x0 + 24, R.x1 - 24), y: rnd(R.y0 + 24, R.y1 - 24), t, v: 1, life: 12 });
  }
}
function frenzyHud() {
  const F = G.frenzy, s = Math.ceil(F.t);
  return TTX(L3('FRENZY ', 'FRENESIA ', 'FRENESÍ ') + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + ' · ' + L3('LV ', 'LV ', 'NV ') + (Math.max(0, F.ph) + 1));
}
function frenzyEnd() { // corn and best score, once per run
  const F = G.frenzy; if (!F || F.paid) return; F.paid = 1;
  SV.best = SV.best || {}; G.frRec = G.score > (SV.best.frenzy || 0); if (G.frRec) SV.best.frenzy = G.score;
  const c = Math.min(20, Math.floor(F.el / 15) + (F.win ? 5 : 0)); if (c) addCredits(c); G.frCorn = c; saveSV();
}
function frenzyTitleButton(cx, y) {
  const w = 112, h = 20, x = Math.round(cx - w / 2), p = .75 + .25 * Math.sin(S.t * 4);
  rect(ctx, x - 1, y - 1, w + 2, h + 2, '#1a0408'); rect(ctx, x, y, w, h, '#7a1020'); rect(ctx, x, y, w, 2, '#c8343e'); rect(ctx, x, y + h - 2, w, 2, '#4a0610');
  ctx.globalAlpha = p; txt(TTX('▶ ' + L3('FRENZY', 'FRENESIA', 'FRENESÍ')), cx, y + 4, '#fff4e8', 'center', 10, '#3a0610'); ctx.globalAlpha = 1;
  txt(TTX(L3('3 MIN · RANDOM RUN', '3 MIN · RUN CASUALE', '3 MIN · PARTIDA ALEATORIA') + (isTouch ? '' : '  [F]')), cx, y + h + 3, '#ffb0a0', 'center', 7, '#1a0408');
  if (SV.best && SV.best.frenzy) txt(TTX(L3('BEST ', 'RECORD ', 'RÉCORD ') + SV.best.frenzy), cx, y + h + 12, '#ecd078', 'center', 7, '#1a0408');
  S.frBtn = [x, y, w, h];
}
function frenzyHit(e) { const b = S.frBtn; if (!b) return false; const [x, y] = canvasXY(e); return x >= b[0] - 6 && x <= b[0] + b[2] + 6 && y >= b[1] - 6 && y <= b[1] + b[3] + 14; }
