const CACHE_NAME = 'eletrostock-cache-v2';
const urlsToCache = [
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Ignora chamadas enviadas para o banco de dados do Supabase
  if (event.request.url.includes('supabase.co')) {
    return; // Deixa o navegador fazer a requisição HTTP real direto para a nuvem
  }

  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
