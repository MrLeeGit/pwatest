
importScripts('https://mjs.sinaimg.cn/wap/project/channelv4/1.2.43.8/channel/workbox-sw.prod.v2.1.2.js');
const workboxSW = new WorkboxSW({clientsClaim: true});
let precacheConfig = [
  // {
  //   url: 'https://mjs.sinaimg.cn/wap/project/channelv4/1.2.43/channel/static/css/channel.min.css',
  //   revision: '43011922c2aef5ed5ee3731b11d3c2cb',
  // },
  // {
  //   url: 'https://mjs.sinaimg.cn/wap/project/channelv4/1.2.43/channel/static/img/bg.png',
  //   revision: '43011922c2aef5ed5ee3731b11d3c2cb',
  // },
  // {
  //   url: 'https://mjs.sinaimg.cn/wap/project/channelv4/1.2.43/channel/static/fonts/SinaHomeFont.ttf',
  //   revision: '43011922c2aef5ed5ee3731b11d3c2cb',
  // },
  // {
  //   url: 'http://127.0.0.1:8887/',
  //   revision: '43011922c2aef5ed5ee3731b11d3c2cb',
  // },
  {
    url: 'https://mjs.sinaimg.cn/umd/base-tools-SUDA/0.0.26/index.all.min.js',
    revision: '43011922c2aef5ed5ee3731b11d3c2cb',
  },
  {
    url: 'https://mjs.sinaimg.cn/wap/online/public/qusetMobile/201705221616/js/quset_mobile.min.js',
    revision: '43011922c2aef5ed5ee3731b11d3c2cb',
  },
  // {
  //   url: 'https://mjs.sinaimg.cn/wap/project/channelv4/1.2.44/channel/static/js/channel.min.js',
  //   revision: '43011922c2aef5ed5ee3731b11d3c2cb',
  // },
  {
    url: 'https://mjs.sinaimg.cn/wap/online/public/addHistoryUrl/addHistoryUrl.min.js',
    revision: '43011922c2aef5ed5ee3731b11d3c2cb',
  },
];

// 页面静态资源
workboxSW.precache(precacheConfig)

// 页面主js和css资源
workboxSW.router.registerRoute(
  'https://mjs.sinaimg.cn/wap/project/channelv4/(.*)',
  workboxSW.strategies.cacheFirst()
);

// 页面图片资源
workboxSW.router.registerRoute(
  'http://k.sinaimg.cn/(.*)',
  workboxSW.strategies.networkFirst({
    cacheName:"imageResource"
  })
);

console.log(workboxSW,"workboxSW对象")

   
    
    
    
    
    