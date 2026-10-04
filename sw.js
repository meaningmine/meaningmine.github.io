// Meaning Mine service worker — v4.5 · © 2026 Veli PEKER
const CACHE = 'meaning-mine-v4.5';
const CORE = ['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png','favicon.png'];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>{ if(r.ok) return c.put(u,r); })))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('meaning-mine-') && k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(/(^|\.)cloudflareinsights\.com$/.test(url.hostname)) return;
  if(req.mode === 'navigate' && url.origin === location.origin){
    e.respondWith(caches.match('index.html').then(r=> r || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req).then(hit=>{
    if(hit) return hit;
    return fetch(req).then(res=>{
      if(res && (res.ok || res.type==='opaque') && (url.origin===location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname))){
        const copy = res.clone(); caches.open(CACHE).then(c=>c.put(req, copy));
      }
      return res;
    }).catch(()=>hit);
  }));
});
