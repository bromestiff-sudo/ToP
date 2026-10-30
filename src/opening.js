// ---------- the opening song on the title screen (music/opening.mp3) ----------
// Decoded once into the Web Audio graph, so the Sound button (master gain) mutes it like everything else.
// While it is not loaded (offline first visit, file:// builds) the synthesized title tune keeps playing.
const OPEN = { buf: null, src: null, g: null, load: 0 };
function openLoad() {
  if (OPEN.load || !AC) return; OPEN.load = 1;
  fetch('music/opening.mp3').then(r => { if (!r.ok) throw new Error('no opening'); return r.arrayBuffer(); })
    .then(a => new Promise((ok, ko) => AC.decodeAudioData(a, ok, ko)))
    .then(b => { OPEN.buf = b; })
    .catch(() => { OPEN.load = 2; });
}
function openWant() { return !!OPEN.buf && S.mode === 'title'; }
function openTick() {
  if (!AC || !master) return;
  openLoad();
  const want = openWant(), t = AC.currentTime;
  if (want && !OPEN.src) {
    const g = AC.createGain(), src = AC.createBufferSource();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.9, t + 1.2);
    src.buffer = OPEN.buf; src.loop = true; src.connect(g); g.connect(master); src.start(t);
    OPEN.src = src; OPEN.g = g;
  } else if (!want && OPEN.src) {
    const src = OPEN.src, g = OPEN.g; OPEN.src = OPEN.g = null;
    try { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + .6); src.stop(t + .7); } catch (e) { }
  }
}
