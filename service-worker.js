const CACHE = 'tj-cache-v7';
const ASSETS = [
  '/', '/index.html',
  '/manifest.json?v=7',
  '/assets/icons/favicon-16.png?v=7',
  '/assets/icons/favicon-32.png?v=7',
  '/assets/icons/apple-touch-icon.png?v=7',
  '/assets/icons/app-192.png?v=7',
  '/assets/icons/app-512.png?v=7'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
