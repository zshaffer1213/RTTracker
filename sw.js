const CACHE_NAME = 'rt-tracker-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.css',      // Update with your actual CSS path
  '/script.js',         // Your JS file
  '/sw.js',
  '/favicon.ico',    // Optional
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css' // Example of external dependency
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached file OR fetch it from the network
      return response || fetch(event.request);
    })
  );
});

// Activate event (for version updates)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});
