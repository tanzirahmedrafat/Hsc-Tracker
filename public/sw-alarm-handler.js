// HSC Tracker - Background Alarm & Notification Engine for Service Worker

// In-memory registry of scheduled timers in Service Worker
self.activeAlarmTimers = self.activeAlarmTimers || {};

// Trigger a system-level alarm notification with high priority, lock screen persistence, and vibration
function showAlarmNotification(title, body, routineId, subjectId) {
  if (!self.registration || !self.registration.showNotification) return;

  const options = {
    body: body || 'এইচএসসি পড়ার সময় শুরু হয়েছে। এখনি বই খোলো!',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'hsc-study-alarm-' + (routineId || 'default'),
    renotify: true,
    requireInteraction: true, // Keep notification pinned on Android lock screen until user interacts
    vibrate: [600, 250, 600, 250, 600, 250, 1000],
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
  };

  return self.registration.showNotification(title || '🔔 পড়ার সময় হয়েছে!', options);
}

// Listen for messages from client (React App)
self.addEventListener('message', (event) => {
  if (!event.data) return;

  // 1. Immediate System Alarm Trigger
  if (event.data.type === 'SHOW_SYSTEM_ALARM') {
    const { title, body, routineId, subjectId } = event.data;
    showAlarmNotification(title, body, routineId, subjectId);
  }

  // 2. Schedule a Single Test Background Alarm
  if (event.data.type === 'SCHEDULE_BACKGROUND_ALARM') {
    const { title, body, delayMs, routineId, subjectId } = event.data;
    if (delayMs && delayMs > 0) {
      const timerKey = 'test-' + (routineId || Date.now());
      if (self.activeAlarmTimers[timerKey]) {
        clearTimeout(self.activeAlarmTimers[timerKey]);
      }
      self.activeAlarmTimers[timerKey] = setTimeout(() => {
        showAlarmNotification(title, body, routineId, subjectId);
        delete self.activeAlarmTimers[timerKey];
      }, delayMs);
    }
  }

  // 3. Batch Schedule All Today's Routines in Background
  if (event.data.type === 'SCHEDULE_ALL_ALARMS') {
    const alarms = event.data.alarms || [];
    // Clear existing routine timers
    Object.keys(self.activeAlarmTimers).forEach((key) => {
      if (!key.startsWith('test-')) {
        clearTimeout(self.activeAlarmTimers[key]);
        delete self.activeAlarmTimers[key];
      }
    });

    // Schedule each upcoming alarm
    alarms.forEach((alarm) => {
      if (alarm.delayMs && alarm.delayMs > 0 && alarm.delayMs < 24 * 3600 * 1000) {
        self.activeAlarmTimers[alarm.id] = setTimeout(() => {
          showAlarmNotification(alarm.title, alarm.body, alarm.id, alarm.subjectId);
          delete self.activeAlarmTimers[alarm.id];
        }, alarm.delayMs);
      }
    });
  }

  // 4. Cancel specific alarm
  if (event.data.type === 'CANCEL_ALARM') {
    const { routineId } = event.data;
    if (routineId && self.activeAlarmTimers[routineId]) {
      clearTimeout(self.activeAlarmTimers[routineId]);
      delete self.activeAlarmTimers[routineId];
    }
  }
});

// Listen for Web Push events (if push notifications are dispatched from backend/network)
self.addEventListener('push', (event) => {
  let data = {
    title: '🔔 পড়ার সময় হয়েছে!',
    body: 'এইচএসসি রুটিন অনুযায়ী পড়ার সময় শুরু হয়েছে।',
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    showAlarmNotification(data.title, data.body, data.routineId, data.subjectId)
  );
});

// Handle clicking on the background lockscreen notification
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
