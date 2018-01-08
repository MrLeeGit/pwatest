
var dataCacheName = 'sinaHome-v1';
var cacheName = 'sinaHome-static-v1';
var filesToCache = [
  './index.html',
  './manifest.json',
  'https://mjs.sinaimg.cn/wap/project/homev8/8.2.78/homeinte/homeinte.min.js',
  'https://mjs.sinaimg.cn/wap/project/homev8/8.2.75/homev8/homev8.min.css',
];

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

















