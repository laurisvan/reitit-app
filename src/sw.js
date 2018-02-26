importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0-beta.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.precaching.precacheAndRoute([]);

// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: 'Untitled', options: {}};
  console.log('Received PUSH notification with data', JSON.stringify(data));

  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and body 'Alea iacta est'.
    self.registration.showNotification(data.title, data.options)
  );
});