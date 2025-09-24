import {clientsClaim} from 'workbox-core'
import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching'
import {registerRoute, setDefaultHandler} from 'workbox-routing'
import {CacheFirst, StaleWhileRevalidate} from 'workbox-strategies'
import {ExpirationPlugin} from 'workbox-expiration'

self.skipWaiting()
clientsClaim()

// Injected at build time by vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST || [])
cleanupOutdatedCaches()

// App shell (HTML, JS, CSS)
setDefaultHandler(new StaleWhileRevalidate({cacheName: 'app-shell'}))

// Book assets: images & PDFs
registerRoute(
    ({url}) => /\/books\/.*\.(?:pdf|jpg|jpeg|png|webp|avif)$/i.test(url.pathname),
    new CacheFirst({
        cacheName: 'book-assets',
        plugins: [
            new ExpirationPlugin({maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30}) // 30 days
        ]
    })
)

// Backgrounds / icons / bio images
registerRoute(
    ({url}) => /\/(backgrounds|icons|bio)\/.*\.(?:png|jpg|jpeg|webp|avif|svg)$/i.test(url.pathname),
    new CacheFirst({
        cacheName: 'static-images',
        plugins: [
            new ExpirationPlugin({maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 365}) // 1 year
        ]
    })
)

// Optional: allow immediate takeover after update
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})
