/* ============================================================
   Votify Grand Operation — Service Worker
   - App-shell caching: works offline after the first visit
   - Navigation requests: network-first, offline fallback to shell
   - Static assets: stale-while-revalidate
   - Cross-origin requests (Firebase RTDB, ipify, ...): untouched
   Bump CACHE_VERSION whenever you ship a new index.html so
   every installed client picks up the update.
   ============================================================ */
'use strict';

var CACHE_VERSION = 'votify-v1.0.0';

/* Resolved against the SW location, so this works at any GitHub Pages
   sub-path (username.github.io/repo/) as well as a custom domain root. */
var CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(function (cache) {
        /* Cache the shell one file at a time so a single missing
           optional file can never fail the whole install. */
        return Promise.all(CORE_ASSETS.map(function (url) {
          return cache.add(new Request(url, { cache: 'reload' })).catch(function () {
            /* ignore individual failures (e.g. renamed index) */
          });
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (key) {
          if (key !== CACHE_VERSION) return caches.delete(key);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;

  /* Only GET requests are cacheable — let everything else pass through. */
  if (req.method !== 'GET') return;

  var url = new URL(req.url);

  /* Never touch cross-origin traffic (Firebase Realtime DB, IP API, ...). */
  if (url.origin !== self.location.origin) return;

  /* Page navigations: try the network first so updates arrive instantly,
     fall back to the cached shell when offline. */
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE_VERSION).then(function (cache) { cache.put('./index.html', copy); });
          return res;
        })
        .catch(function () {
          return caches.match('./index.html')
            .then(function (hit) { return hit || caches.match('./'); })
            .then(function (hit) {
              if (hit) return hit;
              return new Response('<h1>Offline</h1><p>Votify could not be loaded — reconnect once and it will be available offline.</p>',
                { status: 503, headers: { 'Content-Type': 'text/html' } });
            });
        })
    );
    return;
  }

  /* Same-origin assets: stale-while-revalidate. */
  event.respondWith(
    caches.match(req).then(function (hit) {
      var refresh = fetch(req)
        .then(function (res) {
          if (res && res.status === 200) {
            var copy = res.clone();
            caches.open(CACHE_VERSION).then(function (cache) { cache.put(req, copy); });
          }
          return res;
        })
        .catch(function () { return hit; });
      return hit || refresh;
    })
  );
});
