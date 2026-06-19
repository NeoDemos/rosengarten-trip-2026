const CACHE_NAME = "rosengarten-trip-shell-v5";
const RUNTIME_CACHE = "rosengarten-trip-runtime-v1";
const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg"
];
const CACHEABLE_HOSTS = new Set([
  location.host,
  "unpkg.com",
  "commons.wikimedia.org",
  "api.open-meteo.com",
  "geoservices.buergernetz.bz.it",
  "tile.openstreetmap.org",
  "a.tile.openstreetmap.org",
  "b.tile.openstreetmap.org",
  "c.tile.openstreetmap.org",
  "places.googleapis.com"
]);

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key !== CACHE_NAME && key !== RUNTIME_CACHE)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || !CACHEABLE_HOSTS.has(url.host)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        const copy = response.clone();
        caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
