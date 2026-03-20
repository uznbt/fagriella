const CACHE_NAME = 'fagriella-pwa-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/logo.webp'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Optimized logic for external API calls
    const isGoogleSheets = url.hostname === 'docs.google.com' && url.pathname.includes('/pub');
    const isExternalApi = url.hostname.includes('google') || url.hostname.includes('vercel');

    // Skip external APIs EXCEPT Google Sheets Published CSVs (for offline data)
    if (isExternalApi && !isGoogleSheets) {
        return;
    }

    // Stale-While-Revalidate for other assets
    event.respondWith(
        caches.match(request).then((cached) => {
            const networked = fetch(request)
                .then((response) => {
                    if (response.ok && url.origin === self.location.origin) {
                        const cacheCopy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
                    }
                    return response;
                })
                .catch(() => cached || caches.match('/index.html'));

            return cached || networked;
        })
    );
});

// Push Notification Support
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: data.icon || '/icons/logo.webp',
            badge: '/icons/logo.webp',
            vibrate: [100, 50, 100],
            data: { url: data.data?.url || '/' }
        };

        event.waitUntil(self.registration.showNotification(data.title, options));
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
});
