/* ==================================================================
   VOTIFY DIAMOND — SERVICE WORKER
   Offline support + installability for GitHub Pages / any static host.
   ================================================================== */
const CACHE = "votify-diamond-v10";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./maskable-512.png",
  "./apple-touch-icon.png",
  "./favicon-32.png",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) {
          return k !== CACHE;
        }).map(function (k) {
          return caches.delete(k);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return (
        hit ||
        fetch(e.request)
          .then(function (res) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) {
              try {
                c.put(e.request, copy);
              } catch (err) {}
            });
            return res;
          })
          .catch(function () {
            return caches.match("./");
          })
      );
    })
  );
});
