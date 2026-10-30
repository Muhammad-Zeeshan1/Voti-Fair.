/* Votify PWA service worker — offline shell + instant repeat loads (v11: privacy sync + boot flash fix) */
var CACHE = 'votify-pwa-v12';
var CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      /* cache each core asset independently — one failure never blocks install */
      return Promise.all(CORE.map(function (u) {
        return c.add(new Request(u, { cache: 'reload' })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  /* page navigations: network first, fall back to cached shell (offline-ready) */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (r) {
        var cp = r.clone();
        caches.open(CACHE).then(function (c) { c.put('./index.html', cp); });
        return r;
      }).catch(function () {
        return caches.match('./index.html').then(function (hit) {
          return hit || caches.match('./');
        });
      })
    );
    return;
  }

  /* same-origin assets: cache first, refresh in background */
  if (req.url.indexOf(self.location.origin) === 0) {
    e.respondWith(
      caches.match(req).then(function (hit) {
        var net = fetch(req).then(function (r) {
          if (r && r.status === 200) {
            var cp = r.clone();
            caches.open(CACHE).then(function (c) { c.put(req, cp); });
          }
          return r;
        }).catch(function () { return hit; });
        return hit || net;
      })
    );
  }
  /* cross-origin (Firebase, streams, CDNs) — browser default, never intercepted */
});
