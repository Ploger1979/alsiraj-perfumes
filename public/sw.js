// Service Worker for السراج للعطور PWA
const CACHE_NAME = 'alsiraj-v1';
const STATIC_ASSETS = [
  '/',
  '/logo-Circle.png',
  '/alsiraj-logo-new.png',
  '/manifest.json',
];

// Install: cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET and API requests (always fetch live)
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache fresh responses
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(event.request) || caches.match('/');
      })
  );
});
