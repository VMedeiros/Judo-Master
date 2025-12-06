const CACHE_NAME = "judo-master-v1";
const urlsToCache = ["/Judo-Master/", "/Judo-Master/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(urlsToCache.map((url) => cache.add(url))).then(
        () => self.skipWaiting()
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => {
        // Retorna uma resposta de fallback se o fetch falhar
        return new Response("Offline - Página não disponível", {
          status: 503,
          statusText: "Service Unavailable",
        });
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});
