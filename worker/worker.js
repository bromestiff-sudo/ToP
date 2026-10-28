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
  constructor(state) { this.state = state; this.hits = new Map(); this.fails = { t: 0, n: 0 }; }
  // the stats password chosen from the browser: only a salted PBKDF2 hash is stored
  async auth(req, op) {
    const pw = await this.state.storage.get('pw');
    if (op === 'state') return Response.json({ set: !!pw, mat: pw ? pw.hash : '' });
    const body = await req.json().catch(() => ({}));
    if (op === 'set') {
      if (pw) return Response.json({ ok: false, why: 'already set' });
      const p = String(body.pw || ''); if (p.length < 8 || p.length > 200) return Response.json({ ok: false, why: 'length' });
      const salt = [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
      const rec = { salt, hash: await pbkdf2(p, salt) }; await this.state.storage.put('pw', rec);
      return Response.json({ ok: true, mat: rec.hash });
    }
    if (op === 'verify') {
      const now = Date.now(); if (now - this.fails.t > 600000) this.fails = { t: now, n: 0 };
      if (this.fails.n >= 10) return Response.json({ ok: false, why: 'locked' });
      if (pw && same(await pbkdf2(String(body.pw || ''), pw.salt), pw.hash)) return Response.json({ ok: true, mat: pw.hash });
      this.fails.n++; return Response.json({ ok: false, why: 'wrong' });
    }
    return new Response('bad', { status: 400 });
  }
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/auth/')) return this.auth(req, url.pathname.slice(6));
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
  const fl = {}; for (let i = 0; i <= 8; i++) if (S.floors[i]) fl['floor ' + i] = S.floors[i];
  const days = Object.entries(S.days).sort().reverse().slice(0, 14).map(([d, v]) => `<tr><td>${d}</td><td>${v.s}</td><td>${v.e}</td></tr>`).join('');
  const last = S.last.slice(0, 30).map(r => `<tr><td>${r.d}</td><td>${esc(r.m)}</td><td>${esc(r.c)}</td><td>${r.f}</td><td>${r.w ? 'win' : esc(r.k)}</td><td>${Math.round(r.s / 60)} min</td><td>${r.a}</td><td>${esc(r.l)}</td></tr>`).join('');
  const errs = Object.entries(S.errs || {}).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, v]) => `<div class=row><span title="${esc(k)}">${esc(k)}</span><i style="width:${Math.round(v / Math.max(1, ...Object.values(S.errs)) * 100)}%"></i><b>${v}</b></div>`).join('') || '<p class=m>no errors</p>';
  const avg = S.ends ? Math.round(S.secs / S.ends / 60) : 0;
  return `<!doctype html><html lang=en><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Tower of Poop · stats</title>
<style>body{margin:0;background:#140a0c;color:#efe6d8;font:15px/1.4 system-ui,sans-serif}main{max-width:900px;margin:auto;padding:20px 16px}h1{color:#ecd078;margin:0 0 4px}h2{font-size:14px;color:#ff8a7a;text-transform:uppercase;letter-spacing:.08em;margin:0 0 8px}
.k{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:16px 0}.k div{background:#24121a;border-radius:8px;padding:10px}.k b{display:block;font-size:24px;color:#ecd078}.k span{font-size:12px;color:#b8a898}
.g{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}section{background:#1e0f15;border-radius:8px;padding:12px}.row{display:grid;grid-template-columns:minmax(0,1fr) 90px 40px;gap:8px;align-items:center;font-size:13px;margin:3px 0}.row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.row i{display:block;height:8px;background:#a01f2f;border-radius:4px}.row b{text-align:right}
table{width:100%;border-collapse:collapse;font-size:12px}td,th{padding:4px 6px;border-bottom:1px solid #33202a;text-align:left}.m,.n{color:#b8a898;font-size:12px}.w{overflow-x:auto}</style>
<main><h1>Tower of Poop</h1><p class=n>Anonymous stats since ${new Date(S.since).toISOString().slice(0, 10)}. No personal data: only runs, floors, characters and bosses. JSON: <a style="color:#7fd8ff" href="?format=json">?format=json</a></p>
<div class=k><div><b>${S.starts}</b><span>runs started</span></div><div><b>${S.ends}</b><span>runs finished</span></div><div><b>${S.wins}</b><span>wins</span></div><div><b>${avg} min</b><span>average length</span></div><div><b>${S.starts ? Math.round(S.touch / S.starts * 100) : 0}%</b><span>on touch</span></div></div>
<div class=g>${tbl('Floor reached', fl)}${tbl('Killed by', S.causes, 15)}${tbl('Character', S.chars)}${tbl('Bosses beaten', S.bosses, 40)}${tbl('Mode', S.modes)}${tbl('Act', S.acts)}${tbl('Language', S.langs)}${tbl('Version', S.vers)}</div>
<section style="margin-top:14px"><h2>Player errors</h2>${errs}</section>
<section style="margin-top:14px"><h2>Last days</h2><div class=w><table><tr><th>day</th><th>started</th><th>finished</th></tr>${days}</table></div></section>
<section style="margin-top:14px"><h2>Last runs</h2><div class=w><table><tr><th>day</th><th>mode</th><th>char</th><th>floor</th><th>result</th><th>length</th><th>act</th><th>lang</th></tr>${last}</table></div></section></main></html>`;
}

// ---------- security headers on every page the Worker serves ----------
// link previews (WhatsApp, X, Telegram...) need absolute addresses: fill them in from the address the page is served on
function absolutize(res, url) {
  if (!(res.headers.get('Content-Type') || '').includes('text/html') || typeof HTMLRewriter === 'undefined') return res;
  const fix = { element(e) { const c = e.getAttribute('content'); if (c && c.startsWith('/')) e.setAttribute('content', url.origin + c); } };
  return new HTMLRewriter().on('meta[property^="og:"]', fix).on('meta[name^="twitter:"]', fix).transform(res);
}
function secure(res, url) {
  res = absolutize(res, url);
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
async function pbkdf2(pw, salt) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
  const b = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 100000 }, k, 256);
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
function formPage(title, text, action, fields, err, status = 200) {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const body = `<!doctype html><html lang=en><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Tower of Poop · ${esc(title)}</title>
<style>body{margin:0;background:#140a0c;color:#efe6d8;font:16px/1.45 system-ui,sans-serif}main{max-width:420px;margin:12vh auto;padding:0 16px}h1{color:#ecd078;font-size:24px;margin:0 0 8px}p{color:#c8b8a8}label{display:block;margin:14px 0 4px;font-size:14px}input{width:100%;box-sizing:border-box;padding:10px;border-radius:6px;border:1px solid #5a3a40;background:#24121a;color:#efe6d8;font-size:16px}button{margin-top:18px;width:100%;padding:11px;border:0;border-radius:6px;background:#a01f2f;color:#fff;font-size:16px;cursor:pointer}.e{color:#ff8a7a}</style>
<main><h1>${esc(title)}</h1><p>${esc(text)}</p>${err ? `<p class=e>${esc(err)}</p>` : ''}<form method=post action="${action}">${fields.map(f => `<label for=${f[0]}>${esc(f[1])}</label><input id=${f[0]} name=${f[0]} type=password autocomplete=${f[2]} minlength=8 required>`).join('')}<button type=submit>${esc(title)}</button></form></main></html>`;
  return new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'" } });
}
const signedIn = (mat, to) => async () => new Response(null, { status: 303, headers: { Location: to, 'Set-Cookie': 'tops=' + (await sha('stats:' + mat)) + '; Path=/stats; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000', 'Cache-Control': 'no-store' } });
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
    if (url.pathname === '/stats' || url.pathname === '/stats/login' || url.pathname === '/stats/setup') {
      // password: either the STATS_KEY secret from the Cloudflare dashboard, or one chosen the first time /stats is opened
      const DO = env.STATS.get(env.STATS.idFromName('all'));
      const st = env.STATS_KEY ? { set: true, mat: 'env:' + env.STATS_KEY } : await (await DO.fetch('https://stats/auth/state')).json();
      const back = '/stats' + (url.searchParams.get('format') === 'json' ? '?format=json' : '');
      const check = async pw => {
        if (env.STATS_KEY) return same(pw, env.STATS_KEY) ? { ok: true } : { ok: false, why: 'wrong' };
        return (await DO.fetch('https://stats/auth/verify', { method: 'POST', body: JSON.stringify({ pw }) })).json();
      };
      const why = r => r.why === 'locked' ? 'Too many wrong passwords. Try again in 10 minutes.' : 'Wrong password.';
      if (!st.set) {
        if (url.pathname === '/stats/setup' && req.method === 'POST') {
          const f = await req.formData(), a = String(f.get('pw') || ''), b = String(f.get('pw2') || '');
          if (a.length < 8) return formPage('Create password', 'Choose the password for your stats page.', '/stats/setup', [['pw', 'Password (at least 8 characters)', 'new-password'], ['pw2', 'Repeat password', 'new-password']], 'At least 8 characters.', 400);
          if (a !== b) return formPage('Create password', 'Choose the password for your stats page.', '/stats/setup', [['pw', 'Password (at least 8 characters)', 'new-password'], ['pw2', 'Repeat password', 'new-password']], 'The two passwords are different.', 400);
          const r = await (await DO.fetch('https://stats/auth/set', { method: 'POST', body: JSON.stringify({ pw: a }) })).json();
          if (!r.ok) return plain('A password already exists: open /stats to sign in.', 409);
          return signedIn('h:' + r.mat, '/stats')();
        }
        return formPage('Create password', 'First visit: choose the password for your stats page. Only you will need it.', '/stats/setup', [['pw', 'Password (at least 8 characters)', 'new-password'], ['pw2', 'Repeat password', 'new-password']]);
      }
      const mat = env.STATS_KEY ? st.mat : 'h:' + st.mat;
      if (url.pathname === '/stats/login' && req.method === 'POST') {
        const f = await req.formData(), r = await check(String(f.get('pw') || ''));
        if (!r.ok) return formPage('Sign in', 'Tower of Poop stats.', '/stats/login', [['pw', 'Password', 'current-password']], why(r), 403);
        return signedIn(mat, '/stats')();
      }
      const k = url.searchParams.get('k');
      if (k != null) { const r = await check(k); if (!r.ok) return plain(why(r), 403); return signedIn(mat, back)(); }
      const ck = (req.headers.get('Cookie') || '').match(/(?:^|;\s*)tops=([0-9a-f]+)/);
      if (!ck || !same(ck[1], await sha('stats:' + mat))) return formPage('Sign in', 'Tower of Poop stats.', '/stats/login', [['pw', 'Password', 'current-password']]);
      const r = await DO.fetch(new Request(url.origin + '/stats' + url.search, { method: 'GET' }));
      return secure(r, url);
    }
    return secure(await env.ASSETS.fetch(req), url);
  }
};
