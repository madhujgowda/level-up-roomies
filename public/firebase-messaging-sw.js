importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: 'AIzaSyC7sQdkesqEQvl3e2KY8khUe2eDPF-xNGU',
  authDomain: 'level-up-roomies.firebaseapp.com',
  projectId: 'level-up-roomies',
  storageBucket: 'level-up-roomies.firebasestorage.app',
  messagingSenderId: '655924300985',
  appId: '1:655924300985:web:790bd8af923e19e290df68',
  measurementId: 'G-measurement-id',
});

const messaging = firebase.messaging();

console.log('Service Worker Loaded Successfully!');

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Use payload data if available, or fall back to defaults
  const notificationTitle = payload.notification?.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.notification?.body || 'Background Message body.',
    icon: '/favicon.ico', 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});