import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            devOptions: {enabled: true},
            registerType: 'autoUpdate',      // SW updates in the background
            injectRegister: 'auto',          // auto-injects registration code
            includeAssets: [
                // static assets you already have in /public
                'icons/favicon-16x16.png',
                'icons/favicon-32x32.png',
                'icons/apple-touch-icon.png',
                'backgrounds/green.png',
            ],
            manifest: {
                name: 'Adventures in Faith',
                short_name: 'AIF',
                description: "Read Duane's books offline.",
                theme_color: '#0e5a5a',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                icons: [
                    // keep these paths relative to site root (served from /public)
                    {src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png'},
                    {src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png'},
                ]
            },
            workbox: {
                globPatterns: ['**/*.{html,js,css,svg,png,webp,avif,jpg,jpeg}'],
                navigateFallback: '/index.html',
                runtimeCaching: [
                    // cache book assets (images & pdfs)
                    {
                        urlPattern: /\/books\/.*\.(?:pdf|jpg|jpeg|png|webp|avif)$/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'book-assets',
                            expiration: {maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30}, // 30 days
                        }
                    },
                    // backgrounds, icons, misc images
                    {
                        urlPattern: /\/(backgrounds|icons|bio)\/.*\.(?:png|jpg|jpeg|webp|avif|svg)$/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'static-images',
                            expiration: {maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365}
                        }
                    },
                    // API/JSON (if any)
                    {
                        urlPattern: ({request}) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
                        handler: 'StaleWhileRevalidate',
                        options: {cacheName: 'app-shell'}
                    }
                ]
            }
        })
    ]
})
