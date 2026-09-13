/* ==================================================================
   Votify — Service Worker
   Makes the app installable + works offline (after first visit)

   IMPORTANT: All URLs are RELATIVE (./) so the SW works correctly
   even when deployed to a sub-path like
   https://username.github.io/repo-name/
   ================================================================== */

const CACHE_VERSION   = 'votify-v2';
const CORE_ASSETS     = [
  './',
  './index.html',
  './votify.html',
  './manifest.json',
  './favicon-32.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

/* ---------- Install : pre-cache the app shell ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

/* ---------- Activate : clean old caches ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ---------- Fetch : network-first for HTML/JSON, cache-first for static ---------- */
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Skip cross-origin (Firebase, CDNs, Google Fonts) - let browser handle
  if (url.origin !== self.location.origin) return;

  // Skip non-http(s) schemes (chrome-extension://, data:, etc.)
  if (!req.url.startsWith('http')) return;

  // For navigation (HTML pages), try network first, fall back to cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Cache a copy of the latest HTML
          const copy = res.clone();
          caches.open(CACHE_VERSION)
            .then((c) => {
              c.put(req, copy);
              // Also cache under './' and './index.html' so future navigations work
              c.put('./', copy.clone());
              c.put('./index.html', copy.clone());
            })
            .catch(() => {});
          return res;
        })
        .catch(() => {
          // Try the original request, then fallbacks
          return caches.match(req).then((r) => {
            if (r) return r;
            return caches.match('./').then((r2) => {
              if (r2) return r2;
              return caches.match('./index.html').then((r3) => {
                if (r3) return r3;
                return caches.match('./votify.html');
              });
            });
          });
        })
    );
    return;
  }

  // For static assets, cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Only cache successful, same-origin responses
          if (res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});

/* ---------- Message handler : allow page to trigger skipWaiting ---------- */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
