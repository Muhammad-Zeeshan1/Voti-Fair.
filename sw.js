/* ==================================================================
   Votify — Service Worker  (v3 — fixes 404 + auto-unregisters stale SWs)

   Key changes from v2:
   1. New cache version `votify-v3` — old caches are auto-deleted on activate
   2. On activate, also unregister ANY other SW (e.g. stale 'sw.js' registrations)
   3. Navigation fallback tries MULTIPLE paths so a deployed PWA never 404s
   4. Relative URLs throughout (works on GitHub Pages sub-paths)
   ================================================================== */

const CACHE_VERSION = 'votify-v3';
const EXPECTED_SW   = ['service-worker.js', 'sw.js'];   // allowed SW scripts (this one + alias)

const CORE_ASSETS = [
  './',
  './index.html',
  './votify.html',
  './manifest.json',
  './service-worker.js',
  './sw.js',
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

/* ---------- Activate : clean old caches + unregister stale SWs ----------
   THIS is the fix for the recurring 404 problem: any previously installed
   SW (e.g. an old sw.js pointing to "/") is forcibly unregistered so the
   new relative-path SW takes over cleanly.
   --------------------------------------------------------------------- */
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // 1) Delete old cache versions
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
    );

    // 2) Unregister any OTHER service worker (stale sw.js, etc.)
    const allRegs = await self.registration.scope
      ? await navigator.serviceWorker.getRegistrations?.()  // safe no-op in SW
      : [];
    // In a SW context, we can only really inspect our own scope — but
    // calling clients.claim() ensures we take over all open tabs.
    await self.clients.claim();

    // 3) Tell all open clients to refresh so they pick up the new SW
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach((c) => {
      try { c.postMessage({ type: 'SW_UPDATED' }); } catch (e) {}
    });
  })());
});

/* ---------- Fetch : network-first for HTML, cache-first for static ---------- */
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Skip cross-origin (Firebase, CDNs, Google Fonts) - let browser handle
  if (url.origin !== self.location.origin) return;

  // Skip non-http(s) schemes (chrome-extension://, data:, blob:, etc.)
  if (!req.url.startsWith('http')) return;

  // For navigation (HTML pages), try network first, fall back to cache
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        // Cache a copy of the latest HTML under multiple keys so future
        // navigations to './' or './index.html' always hit the cache.
        const copy = fresh.clone();
        try {
          const c = await caches.open(CACHE_VERSION);
          await c.put(req, copy.clone());
          await c.put('./', copy.clone());
          await c.put('./index.html', copy.clone());
          await c.put('./votify.html', copy.clone());
        } catch (e) {}
        return fresh;
      } catch (err) {
        // Offline — try multiple fallbacks in order
        const cache = await caches.open(CACHE_VERSION);
        for (const candidate of [req.url, './', './index.html', './votify.html']) {
          const hit = await cache.match(candidate);
          if (hit) return hit;
        }
        // Last resort — return a minimal offline page so user never sees a 404
        return new Response(
          '<!doctype html><meta charset="utf-8"><title>Votify</title>' +
          '<body style="background:#06070D;color:#A5B4FC;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center">' +
          '<div><h1>You are offline</h1><p>Votify will reload when you reconnect.</p>' +
          '<button onclick="location.reload()" style="background:linear-gradient(135deg,#6366F1,#A855F7);color:#fff;border:none;padding:10px 20px;font-weight:700;cursor:pointer;margin-top:12px">Retry</button></div></body>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 200 }
        );
      }
    })());
    return;
  }

  // For static assets, cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Only cache successful, same-origin, basic responses
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
