
importScripts('https://mjs.sinaimg.cn/wap/project/channelv4/1.2.43.8/channel/workbox-sw.prod.v2.1.2.js');
let precacheConfig = [
  {
    url: 'https://mjs.sinaimg.cn/wap/online/component/lib/js/manifest.json',
    revision: '43011922c2aef5ed5ee3731b11d3c2cb',
  },
  {
    url: 'https://mjs.sinaimg.cn/umd/base-tools-SUDA/0.0.26/index.all.min.js',
    revision: '43011922c2aef5ed5ee3731b11d3c2cb',
  },
  {
    url: 'https://mjs.sinaimg.cn/wap/online/public/qusetMobile/201705221616/js/quset_mobile.min.js',
    revision: '43011922c2aef5ed5ee3731b11d3c2cb',
  },
  {
    url: 'https://mjs.sinaimg.cn/wap/online/public/addHistoryUrl/addHistoryUrl.min.js',
    revision: '43011922c2aef5ed5ee3731b11d3c2cb',
  },
];

const workboxSW = new WorkboxSW()
// // 页面静态资源
workboxSW.precache(precacheConfig)

workboxSW.precache([
  {
    url: '/offline.html',
    revision: '11dd7d40996e6d25e0706b6840e678d8'
  }
])

// offline page
self.addEventListener('fetch', (event) => {
  if (!self.navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return caches.match('/offline.html')
      })
    )
  }
})

// gtimg cache
workboxSW.router.registerRoute(
  'https://mjs.sinaimg.cn/wap/project/channelv4/(.*).(js|css|ttf)',
  workboxSW.strategies.cacheFirst({
    cacheName: 'gtimg',
    cacheExpiration: {
      maxEntries: 50,
      maxAgeSeconds: 3 * 24 * 60 * 60
    },
    cacheableResponse: {
      statuses: [0, 200]
    }
  })
)

// self.addEventListener('message', function(event) {
//   console.log(event.data,"来自html的问候");
//   self.clients.matchAll().then(function(clients) {
//     clients.forEach(function(client) {
//       client.postMessage(1);
//     })
//   });
// });

   
    
    
    
    
    