// Web Audio API based Study Alarm Chime with auto-unlock and mobile vibration

let audioCtx: AudioContext | null = null;
let alarmIntervalId: any = null;
let isAlarmPlaying = false;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function unlockAudio() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  } catch (e) {
    console.error(e);
  }
}

// Auto unlock audio context on first user interaction
if (typeof window !== 'undefined') {
  const handleUnlock = () => {
    unlockAudio();
    window.removeEventListener('click', handleUnlock);
    window.removeEventListener('touchstart', handleUnlock);
    window.removeEventListener('keydown', handleUnlock);
  };
  window.addEventListener('click', handleUnlock, { passive: true });
  window.addEventListener('touchstart', handleUnlock, { passive: true });
  window.addEventListener('keydown', handleUnlock, { passive: true });
}

export function playSingleStudyChime() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    // School Bell / Study Chime: 4 melodious notes (C5, E5, G5, C6) with rich harmonics
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.9 },
      { freq: 659.25, time: 0.28, dur: 0.9 },
      { freq: 783.99, time: 0.56, dur: 1.0 },
      { freq: 1046.5, time: 0.84, dur: 1.6 },
    ];

    notes.forEach(({ freq, time, dur }) => {
      // Primary sine oscillator for sweet bell tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now + time);

      // Secondary triangle oscillator for warmth & loudness
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq, now + time);

      // Bell envelope (quick attack, soft exponential decay)
      gain1.gain.setValueAtTime(0.0001, now + time);
      gain1.gain.exponentialRampToValueAtTime(0.45, now + time + 0.03);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      gain2.gain.setValueAtTime(0.0001, now + time);
      gain2.gain.exponentialRampToValueAtTime(0.2, now + time + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + time + dur * 0.7);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now + time);
      osc1.stop(now + time + dur);

      osc2.start(now + time);
      osc2.stop(now + time + dur);
    });

    // Mobile vibration alert
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([400, 200, 400, 200, 400]);
    }
  } catch (e) {
    console.error('Audio chime error:', e);
  }
}

export function startRoutineAlarm() {
  if (isAlarmPlaying) return;
  isAlarmPlaying = true;

  playSingleStudyChime();
  alarmIntervalId = setInterval(() => {
    if (isAlarmPlaying) {
      playSingleStudyChime();
    }
  }, 3200);
}

export function stopRoutineAlarm() {
  isAlarmPlaying = false;
  if (alarmIntervalId) {
    clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(0);
  }
}

export function playBadgeUnlockFanfare() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    // Victory Fanfare: Rapid ascending arpeggio C5, E5, G5, B5, C6 with triumphant sustain
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.2 },
      { freq: 659.25, time: 0.12, dur: 0.2 },
      { freq: 783.99, time: 0.24, dur: 0.25 },
      { freq: 987.77, time: 0.36, dur: 0.3 },
      { freq: 1046.5, time: 0.48, dur: 1.4 },
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.0001, now + time);
      gain.gain.exponentialRampToValueAtTime(0.4, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([120, 60, 120, 60, 250]);
    }
  } catch (e) {
    console.error('Badge fanfare error:', e);
  }
}
