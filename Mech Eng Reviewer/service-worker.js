const CACHE_NAME = 'me-reviewer-v1';
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
  '/images/NBGear.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
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