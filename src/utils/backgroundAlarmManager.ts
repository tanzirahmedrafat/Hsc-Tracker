import { RoutineItem } from '../types';
import { startRoutineAlarm } from './audioAlarm';

// Send notification via Service Worker (Ensures Android System Lockscreen & Background Alerts work)
export async function triggerBackgroundAlarm(
  routine: RoutineItem,
  subjectName: string
): Promise<void> {
  const title = `🔔 পড়ার সময় হয়েছে: ${subjectName}`;
  const body = `${routine.activityType} • ${routine.startTime} (${routine.durationMinutes} মিনিট)`;

  // 1. Play in-app audio chime & vibration if page is alive
  try {
    startRoutineAlarm();
  } catch (e) {
    console.warn('In-app audio trigger warning:', e);
  }

  // 2. Hardware vibration
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([600, 250, 600, 250, 600, 250, 1000]);
    } catch {}
  }

  // 3. Post to Service Worker for background / lockscreen notification
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;

      // Method A: Post message to active SW
      if (reg.active) {
        reg.active.postMessage({
          type: 'SHOW_SYSTEM_ALARM',
          title,
          body,
          routineId: routine.id,
          subjectId: routine.subjectId,
        });
      }

      // Method B: Direct ServiceWorkerRegistration.showNotification (standard on mobile Android)
      if ('Notification' in window && Notification.permission === 'granted') {
        await reg.showNotification(title, {
          body,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: `hsc-alarm-${routine.id}`,
          renotify: true,
          requireInteraction: true, // Crucial: Keeps notification persistent on phone lock screen
          vibrate: [600, 250, 600, 250, 600, 250, 1000],
          data: {
            url: '/',
            routineId: routine.id,
            subjectId: routine.subjectId,
          },
          actions: [
            { action: 'start', title: 'পড়তে বসুন 📖' },
            { action: 'dismiss', title: 'বন্ধ করুন ✕' },
          ],
        });
        return;
      }
    } catch (swErr) {
      console.warn('ServiceWorker notification error:', swErr);
    }
  }

  // Fallback: Window Notification API
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.png',
        requireInteraction: true,
      });
    } catch {}
  }
}

// Schedule a test background alarm that rings after X seconds (Great for user verification)
export async function scheduleTestBackgroundAlarm(
  delaySeconds: number,
  routine: RoutineItem,
  subjectName: string
): Promise<boolean> {
  const perm = await requestNotificationPermission();
  if (!perm) return false;

  const title = `🔔 টেস্ট অ্যালার্ম বাজছে: ${subjectName}`;
  const body = `তুমি অ্যাপের বাইরে থাকলেও অ্যালার্ম সফলভাবে কাজ করেছে! 🎉`;
  const delayMs = delaySeconds * 1000;

  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg.active) {
        reg.active.postMessage({
          type: 'SCHEDULE_BACKGROUND_ALARM',
          title,
          body,
          delayMs,
          routineId: routine.id,
          subjectId: routine.subjectId,
        });
        return true;
      }
    } catch (e) {
      console.warn('Schedule background alarm error:', e);
    }
  }

  // Window setTimeout fallback
  setTimeout(() => {
    triggerBackgroundAlarm(routine, subjectName);
  }, delayMs);

  return true;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  try {
    const res = await Notification.requestPermission();
    return res === 'granted';
  } catch {
    return false;
  }
}

export function isNotificationPermissionGranted(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
}
