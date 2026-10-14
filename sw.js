/* AVOLI service worker — offline-first for static assets, fresh HTML/data.
   Bump CACHE when shipping structural changes. */
const CACHE = 'avoli-v2';
const CORE = ['./', './index.html', './css/style.css', './js/main.js', './assets/logo.svg', './icon-192.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // HTML + JSON data: network first (always fresh), fall back to cache offline
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.json')) {
    e.respondWith(fetch(e.request).then(r => {
      const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
    return;
  }
  // CSS / JS / images / icons: cache first (fast on slow networks)
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => hit)));
});
