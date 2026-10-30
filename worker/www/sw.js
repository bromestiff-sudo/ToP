const V='top-v169';const FILES=['./','manifest.webmanifest','fonts/silkscreen-latin-400-normal.woff2','fonts/silkscreen-latin-700-normal.woff2','icons/icon-192.png','icons/icon-512.png','music/opening.mp3'];
// a response that went through a redirect must never answer a page load (Android refuses to open the app)
const clean=r=>r&&r.redirected?r.blob().then(b=>new Response(b,{status:200,headers:r.headers})):r;
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(FILES.map(f=>fetch(f,{cache:'reload'}).then(clean).then(r=>r&&r.ok?c.put(f,r):null).catch(()=>null)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// network first (so updates arrive), cache fallback (so it works offline); co-op traffic and other sites are left alone
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;const u=new URL(q.url);if(u.origin!==location.origin||u.pathname.startsWith('/ws'))return;
  const nav=q.mode==='navigate';
  e.respondWith(fetch(q).then(clean).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(V).then(ca=>ca.put(nav?'./':q,c)).catch(()=>{});}return r;})
    .catch(()=>caches.match(nav?'./':q,{ignoreSearch:true}).then(m=>m||caches.match('./')).then(clean)));});
