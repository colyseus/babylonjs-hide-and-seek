var versionStamp = '###VERSION###';
var installFiles = ['###INSTALL###'];
// ..
// Post Service Worker Version Message
// ..
self.addEventListener('message', function(evt) {
    if (evt.data != null && evt.data === 'version' && evt.ports != null && evt.ports.length > 0) {
        var port = evt.ports[0];
        if (port && port.postMessage) {
            // console.log('WORKER: Version check: ' + versionStamp);
            port.postMessage(versionStamp);
        }
    }
 });
// ..
// Install Service Worker File System
// ..
self.addEventListener('install', function(evt) {
    // console.log('WORKER: Installing version: ' + versionStamp);
    evt.waitUntil(
        caches.open(versionStamp).then(function(cache) {
            // console.log('WORKER: Fetching cache: ' + versionStamp);
            var cachePromises = installFiles.map(function(urlToPrefetch) {
                var url = (urlToPrefetch.startsWith && urlToPrefetch.startsWith("http")) ? new URL(urlToPrefetch) : new URL(urlToPrefetch, location.href);
                url.search += (url.search ? '&' : '?') + 'time=' + new Date().getTime().toString();
                var request = new Request(url, { mode: 'no-cors' });
                return fetch(request, { cache: 'no-store' }).then(function(response) {
                    if (response.status >= 400) throw new Error('request for ' + urlToPrefetch + ' failed with status: ' + response.statusText);
                    return cache.put(urlToPrefetch, response);
                }).catch(function(error) {
                    console.warn('WORKER: Not caching ' + urlToPrefetch + ' due to error: ' + error);
                });
            });
            return Promise.all(cachePromises).then(function() {
                // console.log('WORKER: Cache updated: ' + versionStamp);
                return self.skipWaiting();
            });
        }).catch(function(error) {
            console.warn('WORKER: Installation Failed: ', error);
        })
    );
});
// ..
// Activate Service Worker File System
// ..
self.addEventListener('activate', function(evt) {
    evt.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cache) {
                    if (cache !== versionStamp) {
                        // console.log('WORKER: Cleaning cache: ' + cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    // console.log('WORKER: Activate cache: ' + versionStamp);
    return self.clients.claim();
});
// ..
// Fetch Service Worker Request Files
// ..
self.addEventListener('fetch', function(evt) {
    // Chrome Dev Tools Bug - Temporary Workaround
    // https://bugs.chromium.org/p/chromium/issues/detail?id=823392    
    if (evt.request.cache === 'only-if-cached' && evt.request.mode !== 'same-origin') {
        var oStrangeRequest = evt.request.clone();
        console.warn('Chrome Dev Tools. Request cache has only-if-cached, but not same-origin.', oStrangeRequest.cache, oStrangeRequest.mode, 'request redirect:', oStrangeRequest.redirect, oStrangeRequest.url, oStrangeRequest);
        return;
    }
    evt.respondWith(
        caches.match(evt.request).then(function(response) {
            return response || fetch(evt.request, { cache: 'no-store' });
        })
    );
});