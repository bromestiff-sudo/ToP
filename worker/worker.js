// Tower of Poop — Cloudflare Worker: serves the game, relays co-op rooms and keeps anonymous play stats.

// ---------- co-op: each 4-letter room code is one Durable Object that relays messages between the two players ----------
const MSG_MAX = 512 * 1024;   // one message (the host sends whole floors, so not tiny)
const MSG_RATE = 300;         // messages per second per player before the line is cut
export class Room {
  constructor(state) { this.state = state; this.rate = new Map(); }
  async fetch(req) {
    const url = new URL(req.url);
    const role = url.searchParams.get('role') === 'host' ? 'host' : 'guest';
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    const others = this.state.getWebSockets();
    if (others.length >= 2) {
      server.accept(); server.send(JSON.stringify({ t: 'full' })); server.close(4000, 'full');
      return new Response(null, { status: 101, webSocket: client });
    }
    if (role === 'guest' && !others.length) {
      server.accept(); server.send(JSON.stringify({ t: 'noroom' })); server.close(4001, 'no room');
      return new Response(null, { status: 101, webSocket: client });
    }
    this.state.acceptWebSocket(server, [role]);
    if (others.length) {
      const msg = JSON.stringify({ t: 'peer', on: true });
      for (const o of others) { try { o.send(msg); } catch (e) {} }
      try { server.send(msg); } catch (e) {}
    }
    return new Response(null, { status: 101, webSocket: client });
  }
  webSocketMessage(ws, msg) {
    const size = typeof msg === 'string' ? msg.length : msg.byteLength;
    if (size > MSG_MAX) { try { ws.close(1009, 'too big'); } catch (e) {} return; }
    const now = Date.now(), r = this.rate.get(ws) || { t: now, n: 0 };
    if (now - r.t > 1000) { r.t = now; r.n = 0; }
    if (++r.n > MSG_RATE) { try { ws.close(1008, 'too fast'); } catch (e) {} return; }
    this.rate.set(ws, r);
    for (const o of this.state.getWebSockets()) if (o !== ws) { try { o.send(msg); } catch (e) {} }
  }
  webSocketClose(ws) {
    this.rate.delete(ws);
    for (const o of this.state.getWebSockets()) if (o !== ws) { try { o.send('{"t":"peer","on":false}'); } catch (e) {} }
  }
  webSocketError(ws) { this.webSocketClose(ws); }
}

// ---------- anonymous play stats: one Durable Object keeps the totals. No ids, no IPs, nothing personal is stored ----------
const clip = (v, n) => String(v == null ? '' : v).slice(0, n);
const MODES = new Set(['normal', 'daily', 'rush', 'surv', 'qm', 'coop']);
const CHARS = new Set(['two', 'bristle', 'duck', 'wipe', 'chick']);
const LANGS = new Set(['en', 'it', 'es']);
const NAME_RE = /^[A-Z0-9 .,'!?&()\-]{1,40}$/;    // boss names are written in capitals
const MAP_MAX = 150;                               // a table never grows past this many rows
const PER_IP_MIN = 40;                             // events per minute from one connection
const num = (v, lo, hi) => { v = Number(v); return Number.isFinite(v) ? Math.max(lo, Math.min(hi, Math.round(v))) : lo; };
async function readCapped(req, max) {
  const r = req.body && req.body.getReader(); if (!r) return '';
  let n = 0; const parts = [];
  for (;;) { const { done, value } = await r.read(); if (done) break; n += value.byteLength; if (n > max) { try { r.cancel(); } catch (e) {} return null; } parts.push(value); }
  const all = new Uint8Array(n); let o = 0; for (const p of parts) { all.set(p, o); o += p.byteLength; }
  return new TextDecoder().decode(all);
}
export class Stats {
  constructor(state) { this.state = state; this.hits = new Map(); }
  async fetch(req) {
    const url = new URL(req.url);
    let S = (await this.state.storage.get('s')) || { since: Date.now(), starts: 0, ends: 0, wins: 0, secs: 0, floors: {}, chars: {}, causes: {}, bosses: {}, modes: {}, langs: {}, acts: {}, vers: {}, days: {}, touch: 0, last: [], errs: {}, rejected: 0 };
    S.errs = S.errs || {}; S.rejected = S.rejected || 0;
    if (req.method === 'POST') {
      // a short memory of who sent what, only in RAM and only as a hash: enough to stop one sender flooding the totals
      const who = req.headers.get('x-who') || '?', now = Date.now(), h = this.hits.get(who) || { t: now, n: 0 };
      if (now - h.t > 60000) { h.t = now; h.n = 0; }
      h.n++; this.hits.set(who, h); if (this.hits.size > 5000) this.hits.clear();
      if (h.n > PER_IP_MIN) return new Response('slow down', { status: 429 });
      const txt = await readCapped(req, 4096); if (txt == null) return new Response('too big', { status: 413 });
      let o; try { o = JSON.parse(txt); } catch (e) { return new Response('bad', { status: 400 }); }
      if (!o || typeof o !== 'object') return new Response('bad', { status: 400 });
      const inc = (m, k, n = 1) => { if (!(k in m) && Object.keys(m).length >= MAP_MAX) return; m[k] = (m[k] || 0) + n; };
      const okName = s => typeof s === 'string' && NAME_RE.test(s);
      const mode = MODES.has(o.mode) ? o.mode : null, ch = CHARS.has(o.char) ? o.char : null, lang = LANGS.has(o.lang) ? o.lang : null;
      const act = num(o.act, 0, 3), v = num(o.v, 100, 999);
      const day = new Date().toISOString().slice(0, 10);
      S.days[day] = S.days[day] || { s: 0, e: 0 };
      if (o.t === 'start') {
        if (!mode || !lang) { S.rejected++; } else {
          S.starts++; S.days[day].s++; inc(S.modes, mode); if (ch) inc(S.chars, ch); inc(S.langs, lang); inc(S.acts, act); inc(S.vers, v); if (o.touch === true) S.touch++;
        }
      } else if (o.t === 'end') {
        const f = num(o.floor, 0, 8), secs = num(o.secs, 0, 7200), win = o.win === true;
        const bosses = Array.isArray(o.bosses) ? o.bosses.slice(0, 20).filter(okName) : [];
        if (!mode || bosses.length > f * 4 + 4) { S.rejected++; } else {
          S.ends++; S.days[day].e++; inc(S.floors, f); if (win) S.wins++;
          else inc(S.causes, o.cause === 'room' ? 'room' : okName(o.cause) ? o.cause : '?');
          S.secs += secs; for (const b of bosses) inc(S.bosses, b);
          S.last.unshift({ d: day, m: mode, c: ch || '?', f, w: win, k: win ? '' : (okName(o.cause) || o.cause === 'room' ? o.cause : '?'), s: secs, a: act, l: lang || '?' });
          S.last.length = Math.min(S.last.length, 60);
        }
      } else if (o.t === 'err') {
        const msg = clip(o.msg, 90).replace(/[^\x20-\x7EÀ-ſ]/g, '?'), at = clip(o.at, 40).replace(/[^\w.:@ -]/g, '');
        inc(S.errs, msg + (at ? ' @' + at : '') + ' (v' + v + ')');
      } else return new Response('bad', { status: 400 });
      const ks = Object.keys(S.days).sort(); while (ks.length > 60) delete S.days[ks.shift()];
      await this.state.storage.put('s', S);
      return new Response('ok');
    }
    if (url.searchParams.get('format') === 'json') return new Response(JSON.stringify(S, null, 1), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
    return new Response(statsPage(S), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
}

function statsPage(S) {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const tbl = (title, m, lim = 30) => { const r = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, lim), mx = Math.max(1, ...r.map(x => x[1]));
    return `<section><h2>${title}</h2>` + (r.length ? r.map(([k, v]) => `<div class=row><span>${esc(k)}</span><i style="width:${Math.round(v / mx * 100)}%"></i><b>${v}</b></div>`).join('') : '<p class=m>—</p>') + '</section>'; };
  const fl = {}; for (let i = 0; i <= 8; i++) if (S.floors[i]) fl['piano ' + i] = S.floors[i];
  const days = Object.entries(S.days).sort().reverse().slice(0, 14).map(([d, v]) => `<tr><td>${d}</td><td>${v.s}</td><td>${v.e}</td></tr>`).join('');
  const last = S.last.slice(0, 30).map(r => `<tr><td>${r.d}</td><td>${esc(r.m)}</td><td>${esc(r.c)}</td><td>${r.f}</td><td>${r.w ? 'vittoria' : esc(r.k)}</td><td>${Math.round(r.s / 60)} min</td><td>${r.a}</td><td>${esc(r.l)}</td></tr>`).join('');
  const errs = Object.entries(S.errs || {}).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, v]) => `<div class=row><span title="${esc(k)}">${esc(k)}</span><i style="width:${Math.round(v / Math.max(1, ...Object.values(S.errs)) * 100)}%"></i><b>${v}</b></div>`).join('') || '<p class=m>nessun errore</p>';
  const avg = S.ends ? Math.round(S.secs / S.ends / 60) : 0;
  return `<!doctype html><html lang=it><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Tower of Poop · statistiche</title>
<style>body{margin:0;background:#140a0c;color:#efe6d8;font:15px/1.4 system-ui,sans-serif}main{max-width:900px;margin:auto;padding:20px 16px}h1{color:#ecd078;margin:0 0 4px}h2{font-size:14px;color:#ff8a7a;text-transform:uppercase;letter-spacing:.08em;margin:0 0 8px}
.k{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:16px 0}.k div{background:#24121a;border-radius:8px;padding:10px}.k b{display:block;font-size:24px;color:#ecd078}.k span{font-size:12px;color:#b8a898}
.g{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}section{background:#1e0f15;border-radius:8px;padding:12px}.row{display:grid;grid-template-columns:minmax(0,1fr) 90px 40px;gap:8px;align-items:center;font-size:13px;margin:3px 0}.row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.row i{display:block;height:8px;background:#a01f2f;border-radius:4px}.row b{text-align:right}
table{width:100%;border-collapse:collapse;font-size:12px}td,th{padding:4px 6px;border-bottom:1px solid #33202a;text-align:left}.m,.n{color:#b8a898;font-size:12px}.w{overflow-x:auto}</style>
<main><h1>Tower of Poop</h1><p class=n>Statistiche anonime dal ${new Date(S.since).toISOString().slice(0, 10)}. Nessun dato personale: solo partite, piani, personaggi e boss. JSON: <a style="color:#7fd8ff" href="?format=json">?format=json</a></p>
<div class=k><div><b>${S.starts}</b><span>partite iniziate</span></div><div><b>${S.ends}</b><span>partite finite</span></div><div><b>${S.wins}</b><span>vittorie</span></div><div><b>${avg} min</b><span>durata media</span></div><div><b>${S.starts ? Math.round(S.touch / S.starts * 100) : 0}%</b><span>da touch</span></div></div>
<div class=g>${tbl('Piano raggiunto', fl)}${tbl('Ucciso da', S.causes, 15)}${tbl('Personaggio', S.chars)}${tbl('Boss battuti', S.bosses, 40)}${tbl('Modalità', S.modes)}${tbl('Atto', S.acts)}${tbl('Lingua', S.langs)}${tbl('Versione', S.vers)}</div>
<section style="margin-top:14px"><h2>Errori dei giocatori</h2>${errs}</section>
<section style="margin-top:14px"><h2>Ultimi giorni</h2><div class=w><table><tr><th>giorno</th><th>iniziate</th><th>finite</th></tr>${days}</table></div></section>
<section style="margin-top:14px"><h2>Ultime partite</h2><div class=w><table><tr><th>giorno</th><th>modo</th><th>pers.</th><th>piano</th><th>esito</th><th>durata</th><th>atto</th><th>lingua</th></tr>${last}</table></div></section></main></html>`;
}

// ---------- security headers on every page the Worker serves ----------
function secure(res, url) {
  const r = new Response(res.body, res), h = r.headers;
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  if ((h.get('Content-Type') || '').includes('text/html'))
    h.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; media-src 'self' data: blob:; connect-src 'self' wss://" + url.host + (url.protocol === 'http:' ? ' ws://' + url.host : '') + "; worker-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; object-src 'none'");
  return r;
}
async function sha(s) { const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(d)].slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join(''); }
function same(a, b) { if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false; let x = 0; for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i); return x === 0; }
const plain = (t, s) => new Response(t, { status: s, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/ws') {
      if (req.headers.get('Upgrade') !== 'websocket') return plain('Expected a WebSocket', 426);
      const code = (url.searchParams.get('room') || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
      if (code.length < 4) return plain('Bad room code', 400);
      return env.ROOMS.get(env.ROOMS.idFromName(code)).fetch(req);
    }
    if (url.pathname === '/api/stats') {
      if (req.method !== 'POST') return plain('POST only', 405);
      const o = req.headers.get('Origin'); if (o && o !== url.origin) return plain('wrong origin', 403);
      // the sender is reduced to a short hash that never leaves memory; it only feeds the flood limit
      const who = await sha((req.headers.get('CF-Connecting-IP') || '') + (env.STATS_SALT || 'tower-of-poop'));
      const fwd = new Request(req, { headers: new Headers({ 'x-who': who, 'Content-Type': 'application/json' }) });
      return env.STATS.get(env.STATS.idFromName('all')).fetch(fwd);
    }
    if (url.pathname === '/stats') {
      // the page is closed until a password exists:  npx wrangler secret put STATS_KEY
      if (!env.STATS_KEY) return plain('Le statistiche sono chiuse. Imposta una password con:  npx wrangler secret put STATS_KEY  e poi apri /stats?k=<password>', 403);
      const k = url.searchParams.get('k');
      if (k != null) {   // the password goes into a cookie and leaves the address bar
        if (!same(k, env.STATS_KEY)) return plain('Password sbagliata.', 403);
        return new Response(null, { status: 303, headers: { Location: '/stats' + (url.searchParams.get('format') === 'json' ? '?format=json' : ''), 'Set-Cookie': 'tops=' + (await sha('stats:' + env.STATS_KEY)) + '; Path=/stats; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000', 'Cache-Control': 'no-store' } });
      }
      const ck = (req.headers.get('Cookie') || '').match(/(?:^|;\s*)tops=([0-9a-f]+)/);
      if (!ck || !same(ck[1], await sha('stats:' + env.STATS_KEY))) return plain('Apri /stats?k=<password> per entrare.', 403);
      const r = await env.STATS.get(env.STATS.idFromName('all')).fetch(new Request(url.toString(), { method: 'GET' }));
      return secure(r, url);
    }
    return secure(await env.ASSETS.fetch(req), url);
  }
};
