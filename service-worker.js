const CACHE_NAME = 'spotify-clone-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './utility.css',
  './script.js',
  './manifest.json',
  './logo.svg',
  './home.svg',
  './search.svg',
  './button.svg',
  './play.svg',
  './pause.svg',
  './previous.svg',
  './forword.svg',
  './images.jpeg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
