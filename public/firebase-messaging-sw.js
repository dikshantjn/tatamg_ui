// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "AIzaSyA4RBpkDfIFjPPoiQyP6LkHB_cILz-tekU",
  authDomain: "vedikahealthcare-59980.firebaseapp.com",
  projectId: "vedikahealthcare-59980",
  storageBucket: "vedikahealthcare-59980.firebasestorage.app",
  messagingSenderId: "1021794706756",
  appId: "1:1021794706756:web:743a02ce8dda477751e311",
  measurementId: "G-8KJ946S3EF"
});

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('📱 Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Vedika Healthcare';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || payload.data?.message || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: payload.data?.notificationId || 'fcm-notification',
    data: payload.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/favicon.ico'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/favicon.ico'
      }
    ],
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200],
    timestamp: Date.now()
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('🎯 Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    // Handle view action
    const urlToOpen = event.notification.data?.actionUrl || '/notifications';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  } else if (event.action === 'dismiss') {
    // Handle dismiss action - just close the notification
    console.log('❌ Notification dismissed');
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notification closed:', event);
});

// Handle push events (for additional customization)
self.addEventListener('push', (event) => {
  console.log('📨 Push event received:', event);
  
  if (event.data) {
    const data = event.data.json();
    console.log('📊 Push data:', data);
  }
});
