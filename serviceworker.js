
var CACHE_NAME = 'my-site-cache-v1';
// urls to cache, relative to server root
// note that if a single one of these is not correctly able to be cached, an error will be thrown.
var urlsToCache = [
  '/index.html',
  '/serviceworker.js',
  '/manifest.json',
  // 'https://jsonplaceholder.typicode.com/todos/1'

];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {

        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
// this will only use the cache declared in CACHE_NAME
// self.addEventListener('fetch', function(event) {
//   console.log(event);
//     event.respondWith(
//       caches.match(event.request)
//         .then(function(response) {
//           // Cache hit - return response
//           if (response) {
//             console.log('response exists');
//             return response;
//           }
//           return fetch(event.request);
//         }
//       )
//     );
//   });

// this will basically cache everything that the client comes across
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

  // add an event listener for the notification click
  self.addEventListener('notificationclick', function(event) {
    if (!event.action) {
      // Was a normal notification click
      console.log('Notification Click.');
      return;
    }
  
    switch (event.action) {
      case 'coffee-action':
        console.log('User ❤️️\'s coffee.');
        break;
      case 'doughnut-action':
        console.log('User ❤️️\'s doughnuts.');
        break;
      case 'gramophone-action':
        console.log('User ❤️️\'s music.');
        break;
      case 'atom-action':
        console.log('User ❤️️\'s science.');
        break;
      default:
        console.log(`Unknown action clicked: '${event.action}'`);
        break;
    }
  });
  // this is triggered when a push event comes from the server.
  self.addEventListener('push', function(event) {

    if (event.data) {
      // console log only works within a eventListener in a serviceWorker. The console method sits on the ServiceWorkerObject (this)
      console.log('This push event has data: ', event.data.text());
      const promiseChain = self.registration.showNotification('Hello, World.');

      event.waitUntil(promiseChain);


    } else {
      console.log('This push event has no data.');
    }
  });