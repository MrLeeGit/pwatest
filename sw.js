
var dataCacheName = 'sinaInte-v1';
var cacheName = 'sinaInte-static-v1';
var filesToCache = [
  './index.html',
  'https://mjs.sinaimg.cn/wap/project/lolita/simulate/1.0.2/index/resource/manifest.json',
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

self.addEventListener('fetch', function (e) {
  // console.log('[Service Worker] Fetch', e.request.url);
  e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
      })
    );
  // var preUrl = '/nextPage/detail-';
  // if (e.request.url.indexOf(preUrl) > -1) {
  //   // 提前加载的文章    
  //   e.respondWith(
  //     caches.match(e.request).then(function (response) {
  //       return response || fetch(e.request);
  //     })
  //   );
  // } else {
    // 这个地方必须优化，否则需要检测的资源太多，fetch规则需要处理
    // e.respondWith(
    //   caches.match(e.request).then(function (response) {
    //     return response || fetch(e.request);
    //   })
    // );
  // }
});















