// HSC Tracker - Background Alarm & Notification Handler for Service Worker

self.addEventListener('message', (event) => {
  if (!event.data) return;

  // Immediate System Alarm Notification
  if (event.data.type === 'SHOW_SYSTEM_ALARM') {
    const { title, body, routineId, subjectId } = event.data;
    if (self.registration && self.registration.showNotification) {
      self.registration.showNotification(title || '🔔 পড়ার সময় হয়েছে!', {
        body: body || 'তোমার পড়ার রুটিন অনুযায়ী এখনই পড়তে বসো।',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'hsc-study-alarm-' + (routineId || Date.now()),
        renotify: true,
        requireInteraction: true, // Keep notification on Android lock screen until user interacts
        vibrate: [500, 200, 500, 200, 500, 200, 500, 200, 1000],
        data: {
          url: '/',
          routineId: routineId,
          subjectId: subjectId,
          timestamp: Date.now(),
        },
        actions: [
          { action: 'start', title: 'পড়তে বসুন 📖' },
          { action: 'dismiss', title: 'বন্ধ করুন ✕' },
        ],
      });
    }
  }

  // Scheduled Background Alarm (e.g. for testing or precise delayed trigger when app is closed)
  if (event.data.type === 'SCHEDULE_BACKGROUND_ALARM') {
    const { title, body, delayMs, routineId, subjectId } = event.data;
    if (delayMs && delayMs > 0) {
      setTimeout(() => {
        if (self.registration && self.registration.showNotification) {
          self.registration.showNotification(title || '🔔 পড়ার অ্যালার্ম বাজছে!', {
            body: body || 'এইচএসসি পড়ার সময় শুরু হয়েছে।',
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            tag: 'hsc-study-alarm-' + (routineId || Date.now()),
            renotify: true,
            requireInteraction: true,
            vibrate: [600, 250, 600, 250, 600, 250, 1000],
            data: {
              url: '/',
              routineId: routineId,
              subjectId: subjectId,
            },
            actions: [
              { action: 'start', title: 'পড়তে বসুন 📖' },
              { action: 'dismiss', title: 'বন্ধ করুন ✕' },
            ],
          });
        }
      }, delayMs);
    }
  }
});

// Handle clicking on the background notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const notificationData = event.notification.data || {};

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app window is already open in background, bring to front and focus
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.postMessage({
            type: 'ALARM_NOTIFICATION_CLICKED',
            routineId: notificationData.routineId,
            subjectId: notificationData.subjectId,
          });
          return client.focus();
        }
      }
      // If app was completely closed, open a new window with alarm trigger param
      if (self.clients.openWindow) {
        const targetUrl = '/?alarmTrigger=true&routineId=' + (notificationData.routineId || '');
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
