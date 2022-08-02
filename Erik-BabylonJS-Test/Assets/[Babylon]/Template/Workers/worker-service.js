var versionStamp = '###VERSION###';
// ..
// Post Service Worker Version Message
// ..
self.addEventListener('message', function(evt) {
    // ..
    // Note: Query version message from index.html to compare version stamps and prompt reload if different (After 60-90 Seconds)
    // ..
    if (evt.data != null && evt.data === 'version' && evt.ports != null && evt.ports.length > 0) {
        var port = evt.ports[0];
        if (port && port.postMessage) {
            // console.log('WORKER: Version check: ' + versionStamp);
            port.postMessage(versionStamp);
        }
    }
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
        fetch(evt.request, { cache: 'no-store' })
    );
});