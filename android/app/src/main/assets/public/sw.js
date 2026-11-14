/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "0dfe41c7018ac1b32c7cbdaac38c12c3"
  }, {
    "url": "pwa-512x512.png",
    "revision": "2a25bec9a01f56accdee2a9856ffae22"
  }, {
    "url": "pwa-192x192.png",
    "revision": "400095acc42f925b4e96c1276dbb8fa6"
  }, {
    "url": "index.html",
    "revision": "7799efeb7baacd22714194ac687dc6a1"
  }, {
    "url": "icon.svg",
    "revision": "017b26473c38fb5e869791ec0861a8a7"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "546d6ae59070758d59dca8866b2c0245"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/nursing_services_banner_1794645928896-DvykuWg9.jpg",
    "revision": null
  }, {
    "url": "assets/nursing_hero_care_1794645929283-CZjJY-kY.jpg",
    "revision": null
  }, {
    "url": "assets/index-DU3aZqJl.css",
    "revision": null
  }, {
    "url": "assets/index-C5hESG5U.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "546d6ae59070758d59dca8866b2c0245"
  }, {
    "url": "icon.svg",
    "revision": "017b26473c38fb5e869791ec0861a8a7"
  }, {
    "url": "pwa-192x192.png",
    "revision": "400095acc42f925b4e96c1276dbb8fa6"
  }, {
    "url": "pwa-512x512.png",
    "revision": "2a25bec9a01f56accdee2a9856ffae22"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "0dfe41c7018ac1b32c7cbdaac38c12c3"
  }, {
    "url": "manifest.webmanifest",
    "revision": "c6658f7125adca2cf4903a7fcc4a66d1"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
