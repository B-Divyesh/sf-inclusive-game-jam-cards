const CACHE = 'shape-workshop-v1';
const SHELL = ['/art/shape-workshop-hero-640.webp', '/art/shape-workshop-hero-960.webp', '/privacy/', '/terms/', '/favicon.svg'];
self.addEventListener('install', (event) => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  const response = await fetch('/');
  await cache.put('/', response.clone());
  const html = await response.text();
  const builtAssets = [...html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)].map((match) => match[1]);
  await cache.addAll([...new Set([...SHELL, ...builtAssets])]);
  await self.skipWaiting();
})()));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith(caches.match(url.pathname).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(event.request, copy)); return response;
  }).catch(() => event.request.mode === 'navigate' ? caches.match('/') : new Response('Offline', { status: 503 }))));
});
