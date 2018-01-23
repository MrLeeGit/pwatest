var precacheConfig = [
  // ['/',"2aa50e79b1ade03e9e8d454156575f094"],
  ['https://mjs.sinaimg.cn/wap/online/component/lib/js/manifest.json',"2aa50e79b1ade03e9e8d454156575f091"],
  ['https://mjs.sinaimg.cn/wap/project/channelv4/1.2.42/channel/static/css/channel.min.css',"2aa50e79b1ade03e9e8d454156575f091"],
  ['https://mjs.sinaimg.cn/wap/project/channelv4/1.2.21/channel/fonts/SinaHomeFont.3eeedcb.ttf',"2aa50e79b1ade03e9e8d454156575f091"],
  ['https://mjs.sinaimg.cn/wap/project/channelv4/1.2.21/channel/img/bg.png',"2aa50e79b1ade03e9e8d454156575f091"],
  ['https://mjs.sinaimg.cn/umd/base-tools-SUDA/0.0.26/index.all.min.js',"2aa50e79b1ade03e9e8d454156575f091"],
  ['https://mjs.sinaimg.cn/wap/public/suda/201704271600/suda_map.min.js',"2aa50e79b1ade03e9e8d454156575f091"],
  ['https://mjs.sinaimg.cn/wap/online/public/qusetMobile/201705221616/js/quset_mobile.min.js',"2aa50e79b1ade03e9e8d454156575f091"],
  ['https://mjs.sinaimg.cn/wap/project/channelv4/1.2.42/channel/static/js/channel.min.js',"2aa50e79b1ade03e9e8d454156575f092"],
  ['https://mjs.sinaimg.cn/wap/online/public/addHistoryUrl/addHistoryUrl.min.js',"2aa50e79b1ade03e9e8d454156575f091"],
  ];
  var cacheName = 'sina-tech-v2' + (self.registration ? self.registration.scope : '');
  var pwaState = {
    isInstall : false,
    isActivate : false,
    isMessageSucc:false
  }
 
  var ignoreUrlParametersMatching = [/./];
  
  var addDirectoryIndex = function (originalUrl, index) {
      var url = new URL(originalUrl);
      if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
      }
      return url.toString();
    };
  
  var cleanResponse = function (originalResponse) {
      // If this is not a redirected response, then we don't have to do anything.
      if (!originalResponse.redirected) {
        return Promise.resolve(originalResponse);
      }
  
      // Firefox 50 and below doesn't support the Response.body stream, so we may
      // need to read the entire body to memory as a Blob.
      var bodyPromise = 'body' in originalResponse ?
        Promise.resolve(originalResponse.body) :
        originalResponse.blob();
  
      return bodyPromise.then(function(body) {
        // new Response() is happy when passed either a stream or a Blob.
        return new Response(body, {
          headers: originalResponse.headers,
          status: originalResponse.status,
          statusText: originalResponse.statusText
        });
      });
    };
  
  var createCacheKey = function (originalUrl, paramName, paramValue,
                             dontCacheBustUrlsMatching) {
      // Create a new URL object to avoid modifying originalUrl.
      var url = new URL(originalUrl);
  
      // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
      // then add in the extra cache-busting URL parameter.
      if (!dontCacheBustUrlsMatching ||
          !(url.pathname.match(dontCacheBustUrlsMatching))) {
        url.search += (url.search ? '&' : '') +
          encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
      }
  
      return url.toString();
    };
  
  var isPathWhitelisted = function (whitelist, absoluteUrlString) {
      // If the whitelist is empty, then consider all URLs to be whitelisted.
      if (whitelist.length === 0) {
        return true;
      }
  
      // Otherwise compare each path regex to the path of the URL passed in.
      var path = (new URL(absoluteUrlString)).pathname;
      return whitelist.some(function(whitelistedPathRegex) {
        return path.match(whitelistedPathRegex);
      });
    };
  
  var stripIgnoredUrlParameters = function (originalUrl,
      ignoreUrlParametersMatching) {
      var url = new URL(originalUrl);
      // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
      url.hash = '';
  
      url.search = url.search.slice(1) // Exclude initial '?'
        .split('&') // Split into an array of 'key=value' strings
        .map(function(kv) {
          return kv.split('='); // Split each 'key=value' string into a [key, value] array
        })
        .filter(function(kv) {
          return ignoreUrlParametersMatching.every(function(ignoredRegex) {
            return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
          });
        })
        .map(function(kv) {
          return kv.join('='); // Join each [key, value] array into a 'key=value' string
        })
        .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each
  
      return url.toString();
    };
  
  
  var hashParamName = '_sw-precache';
  var urlsToCacheKeys = new Map(
    precacheConfig.map(function(item) {
      var relativeUrl = item[0];
      var hash = item[1];
      var absoluteUrl = new URL(relativeUrl, self.location);
      var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
      return [absoluteUrl.toString(), cacheKey];
    })
  );
  
  function setOfCachedUrls(cache) {
    return cache.keys().then(function(requests) {
      return requests.map(function(request) {
        return request.url;
      });
    }).then(function(urls) {
      return new Set(urls);
    });
  }
  
  self.addEventListener('install', function(event) {
    pwaState.isInstall = true;
    event.waitUntil(
      caches.open(cacheName).then(function(cache) {
        return setOfCachedUrls(cache).then(function(cachedUrls) {
          return Promise.all(
            Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
              // If we don't have a key matching url in the cache already, add it.
              if (!cachedUrls.has(cacheKey)) {
                var request = new Request(cacheKey, {credentials: 'same-origin'});
                
                return fetch(request).then(function(response) {
                  // Bail out of installation unless we get back a 200 OK for
                  // every request.
                  if (!response.ok) {
                    throw new Error('Request for ' + cacheKey + ' returned a ' +
                      'response with status ' + response.status);
                  }
  
                  return cleanResponse(response).then(function(responseToCache) {
                    
                    return cache.put(cacheKey, responseToCache);
                  });
                });
              }
            })
          );
        });
      }).then(function() {
        
        // Force the SW to transition from installing -> active state
        return self.skipWaiting();
        
      })
    );
  });
  
  self.addEventListener('activate', function(event) {
    pwaState.isActivate = true;
    self.clients && self.clients.claim && self.clients.claim()
    var setOfExpectedUrls = new Set(urlsToCacheKeys.values());
    event.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== cacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      }),
      caches.open(cacheName).then(function(cache) {
        return cache.keys().then(function(existingRequests) {
          return Promise.all(
            existingRequests.map(function(existingRequest) {
              if (!setOfExpectedUrls.has(existingRequest.url)) {
                return cache.delete(existingRequest);
              }
            })
          );
        });
      }).then(function() {
        
        return self.clients.claim();
        
      })
    );
  });
  
  
  self.addEventListener('fetch', function(event) {
    if (event.request.method === 'GET') {
      // Should we call event.respondWith() inside this fetch event handler?
      // This needs to be determined synchronously, which will give other fetch
      // handlers a chance to handle the request if need be.
      var shouldRespond;
  
      // First, remove all the ignored parameters and hash fragment, and see if we
      // have that URL in our cache. If so, great! shouldRespond will be true.
      var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
      shouldRespond = urlsToCacheKeys.has(url);
  
      // If shouldRespond is false, check again, this time with 'index.html'
      // (or whatever the directoryIndex option is set to) at the end.
      var directoryIndex = 'index.html';
      if (!shouldRespond && directoryIndex) {
        url = addDirectoryIndex(url, directoryIndex);
        shouldRespond = urlsToCacheKeys.has(url);
      }
  
      // If shouldRespond is still false, check to see if this is a navigation
      // request, and if so, whether the URL matches navigateFallbackWhitelist.
      var navigateFallback = '';
      if (!shouldRespond &&
          navigateFallback &&
          (event.request.mode === 'navigate') &&
          isPathWhitelisted([], event.request.url)) {
        url = new URL(navigateFallback, self.location).toString();
        shouldRespond = urlsToCacheKeys.has(url);
      }
  
      // If shouldRespond was set to true at any point, then call
      // event.respondWith(), using the appropriate cache key.
      if (shouldRespond) {
        event.respondWith(
          caches.open(cacheName).then(function(cache) {
            
            return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
              if (response) {
                return response;
              }
              throw Error('The cached response that was expected is missing.');
            });
            
          })
          .catch(function(e) {
            // Fall back to just fetch()ing the request if some unexpected error
            // prevented the cached response from being valid.
            console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
            return fetch(event.request);
          })
        );
      }
    }
  });

  if(self.location.search.indexOf("pwa=0") != -1 && self.registration){
    self.registration.unregister()
  }


  self.addEventListener('message', function(event) {
    console.log(event.data,"来自html的问候");
    self.clients.matchAll().then(function(clients) {
      clients.forEach(function(client) {
        pwaState.isMessageSucc = true;
        client.postMessage(pwaState);
      })
    });
  });
  
 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  