var serviceWorkerOption = {
  "assets": ["//shadow.elemecdn.com/app/h5/tracer.87b26a4.js", "//shadow.elemecdn.com/npm/vue@2.4.2/dist/vue.runtime.min.js", "//shadow.elemecdn.com/gh/elemefe/vue-img@2.8.1/dist/vue-img.min.js", "//shadow.elemecdn.com/faas/h5/vendor.a8285d0.js"],
  "hash": "UjXSJn6",
  "webpackPublicPath": "//shadow.elemecdn.com/faas/h5/"
};

!
function(e) {
  var t = {};
  function o(s) {
      if (t[s]) return t[s].exports;
      var n = t[s] = {
          i: s,
          l: !1,
          exports: {}
      };
      return e[s].call(n.exports, n, n.exports, o),
      n.l = !0,
      n.exports
  }
  o.m = e,
  o.c = t,
  o.d = function(e, t, s) {
      o.o(e, t) || Object.defineProperty(e, t, {
          configurable: !1,
          enumerable: !0,
          get: s
      })
  },
  o.n = function(e) {
      var t = e && e.__esModule ?
      function() {
          return e.
      default
      }:
      function() {
          return e
      };
      return o.d(t, "a", t),
      t
  },
  o.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t)
  },
  o.p = "//shadow.elemecdn.com/faas/h5/",
  o(o.s = 0)
} ([function(e, t, o) {
  "use strict";
  try {
      importScripts("https://shadow.elemecdn.com/gh/eleme/perf-sw@0.1.4/dist/perf.min.js")
  } catch(e) {
      console.warn("Failed to import perf!")
  }
  self.addEventListener("install", e = >{
      e.waitUntil(caches.delete("static").
      catch(() = >{}))
  }),
  self.addEventListener("activate", () = >{
      self.clients && self.clients.claim && self.clients.claim()
  }),
  self.assets = self.serviceWorkerOption.assets,
  importScripts("/sw-toolbox.js"),
  self.toolbox.options.debug = -1 !== self.location.search.indexOf("debug=true"),
  self.toolbox.options.networkTimeoutSeconds = 3,
  self.toolbox.router.get("/sw.js", self.toolbox.networkOnly);
  let s = "/(.+/[^\\.]*)",
  n = "/(.+/)",
  r = self.location.href.indexOf("UC=true") ? n: s;
  if (self.toolbox.router.get(r, (e, t, o) = >self.toolbox.fastest(e, t, o).
  catch(() = >(console.info(`Failed to fetch $ {
      e.url
  },
  fallback to offline.`), self.toolbox.cacheOnly(new Request("/offline/"), t, o))), {
      cache: {
          name: "dynamic",
          maxEntries: 100,
          maxAgeSeconds: 86400
      }
  }), !self.location.search.match(/debug=true/)) {
      let e = self.location.search.match(/alipay=true/);
      fetch("https://crayfish.elemecdn.com/h5.ele.me@json/service-worker").then(e = >e.json()).then(t = >{ (t.downgrade || e && t.downgrade_alipay) && self.registration.unregister()
      }).
      catch(() = >{
          e && self.registration.unregister()
      })
  }
}]);