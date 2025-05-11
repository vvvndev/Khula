// Basic Service Worker for Khula Financial PWA

const CACHE_NAME = 'khula-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - Network First with Cache Fallback strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response as it can only be used once
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            // Don't cache API requests
            if (!event.request.url.includes('/api/')) {
              cache.put(event.request, responseToCache);
            }
          });

        return response;
      })
      .catch(() => {
        // If network request fails, try to get from cache
        return caches.match(event.request);
      })
  );
});

// Background sync for pending transactions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  } else if (event.tag === 'sync-payments') {
    event.waitUntil(syncPayments());
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Mock function for syncing transactions
async function syncTransactions() {
  // In a real implementation, this would access IndexedDB
  // and send pending transactions to the server
  console.log('Syncing transactions...');
  
  // Simulate successful sync
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

// Mock function for syncing payments
async function syncPayments() {
  // In a real implementation, this would access IndexedDB
  // and process pending payments
  console.log('Syncing payments...');
  
  // Simulate successful sync
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}