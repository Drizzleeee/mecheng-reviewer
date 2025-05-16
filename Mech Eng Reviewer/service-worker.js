const CACHE_NAME = 'me-reviewer-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/industrial-plant.html',
  '/power-plant.html',
  '/courses.html',
  '/quiz.html',
  '/quiz-fans-blowers.html',
  '/styles/main.css',
  '/scripts/navigation.js',
  '/scripts/app.js',
  '/scripts/quiz.js',
  '/images/NBFavicon.png',
  '/images/NBGear.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  // Claim clients immediately
  event.waitUntil(clients.claim());
  
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
