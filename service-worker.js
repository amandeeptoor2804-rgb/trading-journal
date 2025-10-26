/* v7 */
const CACHE_VERSION = 'tj-cache-v7';
const ASSETS = [
  '/',
  '/trading-journal/',
  '/trading-journal/index.html',
  '/trading-journal/manifest.json?v=7',
  '/trading-journal/icons/icon-192.png',
  '/trading-journal/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_VERSION && caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  e.respondWith(
    caches.match(request).then(cached => 
      cached || fetch(request).then(res => {
        // only cache GET same-origin
        try {
          const url = new URL(request.url);
          if (request.method === 'GET' && url.origin === location.origin) {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(request, clone));
          }
        } catch {}
        return res;
      }).catch(() => cached)
    )
  );
});
