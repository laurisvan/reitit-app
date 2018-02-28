importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0-beta.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
  new RegExp('/api/(.*)'),

  // Have a short-lived cache for APIs
  workbox.strategies.networkFirst({
    cacheName: 'apis',
    networkTimetoutSeconds: 3,
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 24 * 60 * 60 // One day
      }),
    ],
  }),
);