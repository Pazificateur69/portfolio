/* ═══════════════════════════════════════════════════════════════════════════
   SERVICE WORKER — Cache-first static, network-first HTML
   ═══════════════════════════════════════════════════════════════════════════ */
var CACHE_NAME = 'portfolio-v3.4';

var STATIC_ASSETS = [
  '/css/main.css',
  '/css/project.css',
  '/css/command-palette.css',
  '/css/print.css',
  '/css/404.css',
  '/css/changelog.css',
  '/css/veille.css',
  '/css/ctf.css',
  '/css/uses.css',
  '/css/blog.css',
  '/css/stats.css',
  '/css/now.css',
  '/js/globals.js',
  '/js/i18n-data.js',
  '/js/sound-engine.js',
  '/js/command-palette.js',
  '/js/easter-eggs.js',
  '/js/404.js',
  '/js/changelog.js',
  '/js/veille.js',
  '/js/ctf.js',
  '/js/uses.js',
  '/js/blog.js',
  '/js/stats.js',
  '/js/now.js',
  '/js/publications.js',
  '/manifest.json'
];

/* ─── Install: pre-cache static assets ─── */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* ─── Activate: clean old caches ─── */
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* ─── Fetch: network-first for HTML, cache-first for static ─── */
self.addEventListener('fetch', function (e) {
  var request = e.request;

  if (request.method !== 'GET') return;

  /* HTML pages → network-first with cache fallback */
  if (request.headers.get('accept') && request.headers.get('accept').indexOf('text/html') !== -1) {
    e.respondWith(
      fetch(request).then(function (response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(request, clone);
        });
        return response;
      }).catch(function () {
        return caches.match(request).then(function (cached) {
          return cached || caches.match('/index.html');
        });
      })
    );
    return;
  }

  /* Static assets → cache-first with network fallback */
  e.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, clone);
          });
        }
        return response;
      });
    })
  );
});
