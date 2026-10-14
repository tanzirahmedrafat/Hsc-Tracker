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
        const swOptions: any = {
          body,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: `hsc-alarm-${routine.id}`,
          renotify: true,
          requireInteraction: true, // Keeps notification persistent on phone lock screen
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
        };
        await reg.showNotification(title, swOptions);
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

// Synchronize all today's upcoming routine alarms to the Service Worker for background triggering
export async function syncAlarmsToServiceWorker(
  routines: RoutineItem[],
  subjects: Array<{ id: string; name: string }>
): Promise<void> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const nowTotalMinutes = currentHour * 60 + currentMinute;

  const BENGALI_DAY_MAP: Record<number, string> = {
    0: 'রবি',
    1: 'সোম',
    2: 'মঙ্গল',
    3: 'বুধ',
    4: 'বৃহঃ',
    5: 'শুক্র',
    6: 'শনি',
  };
  const todayDay = BENGALI_DAY_MAP[now.getDay()];

  const alarmsToSchedule: Array<{
    id: string;
    delayMs: number;
    title: string;
    body: string;
    subjectId: string;
  }> = [];

  for (const r of routines) {
    if (r.alarmEnabled === false || r.completed) continue;
    if (r.dayOfWeek !== todayDay && r.dayOfWeek !== 'প্রতিদিন') continue;

    let targetHour: number | null = null;
    let targetMinute: number | null = null;

    if (r.rawTime) {
      const [hStr, mStr] = r.rawTime.split(':');
      targetHour = parseInt(hStr, 10);
      targetMinute = parseInt(mStr, 10);
    }

    if (targetHour !== null && targetMinute !== null && !isNaN(targetHour) && !isNaN(targetMinute)) {
      const targetTotalMinutes = targetHour * 60 + targetMinute;
      const diffMinutes = targetTotalMinutes - nowTotalMinutes;

      // Only schedule if it's in the future today
      if (diffMinutes > 0) {
        const delayMs = diffMinutes * 60 * 1000 - now.getSeconds() * 1000;
        const matchedSub = subjects.find((s) => s.id === r.subjectId);
        alarmsToSchedule.push({
          id: r.id,
          delayMs: Math.max(1000, delayMs),
          title: `🔔 পড়ার সময় হয়েছে: ${matchedSub?.name || 'বিষয়'}`,
          body: `${r.activityType} • ${r.startTime} (${r.durationMinutes} মিনিট)`,
          subjectId: r.subjectId,
        });
      }
    }
  }

  try {
    const reg = await navigator.serviceWorker.ready;
    if (reg.active) {
      reg.active.postMessage({
        type: 'SCHEDULE_ALL_ALARMS',
        alarms: alarmsToSchedule,
      });
    }
  } catch (e) {
    console.warn('Failed to sync alarms to Service Worker:', e);
  }
}
