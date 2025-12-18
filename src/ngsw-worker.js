// Versão do cache — altere a cada deploy para forçar atualização
const CACHE_PREFIX = "judo-master";
const CACHE_VERSION = "v3";
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;
const ASSET_CACHE = `${CACHE_PREFIX}-assets-${CACHE_VERSION}`;

// Helper: identifica navegação/HTML
function isNavigationRequest(request) {
  return (
    request.mode === "navigate" ||
    (request.method === "GET" &&
      request.headers.get("accept")?.includes("text/html"))
  );
}

// Helper: identifica assets estáticos
function isStaticAsset(url) {
  try {
    const u = new URL(url, self.location.origin);
    return /\.(?:png|jpg|jpeg|webp|svg|gif|ico|css|js|json|woff2?|ttf|otf)$/i.test(
      u.pathname
    );
  } catch {
    return false;
  }
}

// Helper: tenta fallback para assets com nome-base igual quando o hash mudou
async function assetHashedFallback(request) {
  try {
    const reqUrl = new URL(request.url);
    const match = reqUrl.pathname.match(/^(.*)\-([A-Za-z0-9]+)(\.[a-z]+)$/);
    if (!match) return null;
    const base = match[1];
    const ext = match[3];
    const cache = await caches.open(ASSET_CACHE);
    const keys = await cache.keys();
    for (const key of keys) {
      const keyUrl = new URL(key.url);
      if (keyUrl.pathname.startsWith(base) && keyUrl.pathname.endsWith(ext)) {
        const cached = await cache.match(key);
        if (cached) return cached;
      }
    }
    return null;
  } catch {
    return null;
  }
}

self.addEventListener("install", (event) => {
  // Não faz precache agressivo do index; usa network-first para HTML
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name !== ASSET_CACHE) {
            return caches.delete(name);
          }
        })
      );
      await self.clients.claim();

      // Notifica clientes para atualizarem caso necessário
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.postMessage({ type: "SW_ACTIVATED", version: CACHE_VERSION });
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // HTML: network-first para evitar index.html desatualizado
  if (isNavigationRequest(request)) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          // Cacheia o index/html navegado para fallback offline
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (err) {
          const cached = await caches.match(request);
          if (cached) return cached;
          // Fallback simples quando offline e sem cache
          return new Response("Offline — tente novamente mais tarde", {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
      })()
    );
    return;
  }

  // Assets: cache-first com revalidação
  if (isStaticAsset(request.url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSET_CACHE);
        const cached = await cache.match(request);
        if (cached) {
          // Revalida em background
          try {
            fetch(request)
              .then((res) => {
                if (res && res.ok) cache.put(request, res.clone());
              })
              .catch(() => {});
          } catch {}
          return cached;
        }
        // Sem cache: busca e armazena
        try {
          const res = await fetch(request);
          if (res && res.ok) {
            await cache.put(request, res.clone());
            return res;
          }
          // Se 404/erro, tenta fallback por nome-base
          const fallback = await assetHashedFallback(request);
          if (fallback) return fallback;
          return res;
        } catch {
          const fallback = await assetHashedFallback(request);
          if (fallback) return fallback;
          throw new Error("Network error and no fallback available");
        }
      })()
    );
    return;
  }

  // Outros: network-first com fallback ao cache
  event.respondWith(
    (async () => {
      try {
        const res = await fetch(request);
        return res;
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        return new Response("Offline", { status: 503 });
      }
    })()
  );
});
