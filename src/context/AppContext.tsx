import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Subject,
  Chapter,
  ChapterMilestone,
  Task,
  RoutineItem,
  StudySession,
  UserProfile,
  DayOfWeek,
  StreakInfo,
  DayStreakStatus,
} from '../types';
import {
  DEFAULT_SUBJECTS,
  DEFAULT_CHAPTERS,
  DEFAULT_TASKS,
  DEFAULT_ROUTINES,
  DEFAULT_USER_PROFILE,
  DEFAULT_STUDY_SESSIONS,
} from '../data/defaultData';
import { startRoutineAlarm, stopRoutineAlarm } from '../utils/audioAlarm';
import {
  triggerBackgroundAlarm,
  scheduleTestBackgroundAlarm,
  requestNotificationPermission,
} from '../utils/backgroundAlarmManager';
import { parseStartTime } from '../utils/bengali';

export type NavTab = 'home' | 'routine' | 'tracker' | 'ai-buddy';

interface OverallProgress {
  totalChapters: number;
  completedChapters: number;
  percentage: number;
}

interface SubjectProgress {
  subjectId: string;
  totalChapters: number;
  completedChapters: number;
  percentage: number;
}

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  subjects: Subject[];
  chapters: Chapter[];
  toggleChapter: (chapterId: string) => void;
  addChapter: (subjectId: string, title: string, chapterNo?: number, description?: string) => void;
  editChapter: (chapterId: string, updates: Partial<Chapter>) => void;
  deleteChapter: (chapterId: string) => void;
  toggleChapterMilestone: (chapterId: string, milestoneId: string) => void;
  addChapterMilestone: (chapterId: string, title: string, type?: ChapterMilestone['type']) => void;
  deleteChapterMilestone: (chapterId: string, milestoneId: string) => void;

  selectedTrackerSubjectId: string;
  setSelectedTrackerSubjectId: (id: string) => void;

  overallProgress: OverallProgress;
  subjectProgressMap: Record<string, SubjectProgress>;

  // Tasks
  tasks: Task[];
  addTask: (title: string, subjectId: string, priority?: 'low' | 'medium' | 'high') => void;
  toggleTask: (taskId: string) => void;
  editTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;

  // Routines
  routines: RoutineItem[];
  addRoutine: (item: Omit<RoutineItem, 'id' | 'completed'>) => void;
  toggleRoutine: (id: string) => void;
  editRoutine: (id: string, updates: Partial<RoutineItem>) => void;
  deleteRoutine: (id: string) => void;
  importAiPlanSlots: (slots: Array<{ day: DayOfWeek; time: string; subject: string; activity: string; duration: number }>) => void;
  toggleRoutineAlarm: (id: string) => void;
  testRoutineAlarm: (routine?: RoutineItem) => void;
  scheduleTestBackgroundAlarm: (delaySeconds: number, routine?: RoutineItem) => Promise<boolean>;
  requestNotificationPermission: () => Promise<boolean>;

  // Routine Alarm Popup State
  activeAlarmRoutine: RoutineItem | null;
  dismissAlarm: () => void;
  startStudyFromAlarm: (routine: RoutineItem) => void;

  // Study Timer
  timerSeconds: number;
  timerStatus: 'idle' | 'running' | 'paused';
  timerSubjectId: string;
  setTimerSubjectId: (id: string) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  todayStudySeconds: number;

  // Study Streak
  streakInfo: StreakInfo;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  resetAllData: () => void;

  // Profile modal state
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;

  // Dark Mode Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SUBJECTS: 'hsc_tracker_subjects_v1',
  CHAPTERS: 'hsc_tracker_chapters_v1',
  TASKS: 'hsc_tracker_tasks_v1',
  ROUTINES: 'hsc_tracker_routines_v1',
  SESSIONS: 'hsc_tracker_sessions_v1',
  PROFILE: 'hsc_tracker_profile_v1',
  TIMER: 'hsc_tracker_timer_state_v1',
  THEME: 'hsc_tracker_theme',
};

const createDefaultMilestones = (chapterId: string, isCompleted: boolean = false): ChapterMilestone[] => [
  { id: `m-${chapterId}-c1`, title: 'Class 1', type: 'class', completed: isCompleted },
  { id: `m-${chapterId}-c2`, title: 'Class 2', type: 'class', completed: isCompleted },
  { id: `m-${chapterId}-mcq`, title: 'MCQ', type: 'mcq', completed: isCompleted },
  { id: `m-${chapterId}-cq`, title: 'CQ', type: 'cq', completed: isCompleted },
];

const ensureMilestones = (list: Chapter[]): Chapter[] => {
  return list.map((c) => ({
    ...c,
    milestones:
      c.milestones && c.milestones.length > 0
        ? c.milestones
        : createDefaultMilestones(c.id, c.completed),
  }));
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Theme state persisted in localStorage
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {}
    return 'light';
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
  };

  // Load state with fallback to defaults
  const [subjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
    } catch {
      return DEFAULT_SUBJECTS;
    }
  });

  const [chapters, setChapters] = useState<Chapter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAPTERS);
      const parsed = saved ? JSON.parse(saved) : DEFAULT_CHAPTERS;
      return ensureMilestones(parsed);
    } catch {
      return ensureMilestones(DEFAULT_CHAPTERS);
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [routines, setRoutines] = useState<RoutineItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      return saved ? JSON.parse(saved) : DEFAULT_ROUTINES;
    } catch {
      return DEFAULT_ROUTINES;
    }
  });

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return saved ? JSON.parse(saved) : DEFAULT_STUDY_SESSIONS;
    } catch {
      return DEFAULT_STUDY_SESSIONS;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  const [selectedTrackerSubjectId, setSelectedTrackerSubjectId] = useState<string>('bangla-1');

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
    } catch (e) {
      console.error(e);
    }
  }, [chapters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
    } catch (e) {
      console.error(e);
    }
  }, [routines]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(studySessions));
    } catch (e) {
      console.error(e);
    }
  }, [studySessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  // Dynamic Progress calculations
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((c) => c.completed).length;
  const overallPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const overallProgress: OverallProgress = {
    totalChapters,
    completedChapters,
    percentage: overallPercentage,
  };

  const subjectProgressMap: Record<string, SubjectProgress> = {};
  subjects.forEach((sub) => {
    const subChapters = chapters.filter((c) => c.subjectId === sub.id);
    const completed = subChapters.filter((c) => c.completed).length;
    const total = subChapters.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    subjectProgressMap[sub.id] = {
      subjectId: sub.id,
      totalChapters: total,
      completedChapters: completed,
      percentage,
    };
  });

  // Chapter actions
  const toggleChapter = (chapterId: string) => {
    setChapters((prev) =>
      prev.map((c) => {
        if (c.id === chapterId) {
          const nextCompleted = !c.completed;
          const currentMilestones =
            c.milestones && c.milestones.length > 0
              ? c.milestones
              : createDefaultMilestones(c.id, c.completed);

          return {
            ...c,
            completed: nextCompleted,
            milestones: currentMilestones.map((m) => ({ ...m, completed: nextCompleted })),
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  const addChapter = (subjectId: string, title: string, chapterNo?: number, description?: string) => {
    const existing = chapters.filter((c) => c.subjectId === subjectId);
    const nextNo = chapterNo || existing.length + 1;
    const newId = `chap-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newChap: Chapter = {
      id: newId,
      subjectId,
      chapterNo: nextNo,
      title,
      description,
      completed: false,
      milestones: createDefaultMilestones(newId, false),
      updatedAt: new Date().toISOString(),
    };
    setChapters((prev) => [...prev, newChap]);
  };

  const editChapter = (chapterId: string, updates: Partial<Chapter>) => {
    setChapters((prev) =>
      prev.map((c) => (c.id === chapterId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  };

  const deleteChapter = (chapterId: string) => {
    setChapters((prev) => prev.filter((c) => c.id !== chapterId));
  };

  const toggleChapterMilestone = (chapterId: string, milestoneId: string) => {
    setChapters((prev) =>
      prev.map((c) => {
        if (c.id === chapterId) {
          const currentMilestones =
            c.milestones && c.milestones.length > 0
              ? c.milestones
              : createDefaultMilestones(c.id, c.completed);

          const updatedMilestones = currentMilestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );

          const allDone = updatedMilestones.length > 0 && updatedMilestones.every((m) => m.completed);

          return {
            ...c,
            completed: allDone,
            milestones: updatedMilestones,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  const addChapterMilestone = (
    chapterId: string,
    title: string,
    type: ChapterMilestone['type'] = 'custom'
  ) => {
    if (!title.trim()) return;
    setChapters((prev) =>
      prev.map((c) => {
        if (c.id === chapterId) {
          const currentMilestones =
            c.milestones && c.milestones.length > 0
              ? c.milestones
              : createDefaultMilestones(c.id, c.completed);

          const newMilestone: ChapterMilestone = {
            id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: title.trim(),
            type,
            completed: false,
          };

          return {
            ...c,
            milestones: [...currentMilestones, newMilestone],
            completed: false,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  const deleteChapterMilestone = (chapterId: string, milestoneId: string) => {
    setChapters((prev) =>
      prev.map((c) => {
        if (c.id === chapterId) {
          const currentMilestones =
            c.milestones && c.milestones.length > 0
              ? c.milestones
              : createDefaultMilestones(c.id, c.completed);

          const updatedMilestones = currentMilestones.filter((m) => m.id !== milestoneId);
          const allDone = updatedMilestones.length > 0 && updatedMilestones.every((m) => m.completed);

          return {
            ...c,
            milestones: updatedMilestones,
            completed: updatedMilestones.length > 0 ? allDone : c.completed,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  // Task actions
  const addTask = (title: string, subjectId: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const today = new Date().toISOString().split('T')[0];
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      subjectId,
      date: today,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const editTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Routine actions
  const addRoutine = (item: Omit<RoutineItem, 'id' | 'completed'>) => {
    const newRoutine: RoutineItem = {
      id: `rt-${Date.now()}`,
      ...item,
      completed: false,
    };
    setRoutines((prev) => [...prev, newRoutine]);
  };

  const toggleRoutine = (id: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const editRoutine = (id: string, updates: Partial<RoutineItem>) => {
    setRoutines((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRoutine = (id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  const importAiPlanSlots = (
    slots: Array<{ day: DayOfWeek; time: string; subject: string; activity: string; duration: number }>
  ) => {
    const newItems: RoutineItem[] = slots.map((s, idx) => {
      // Find matching subject or default
      const matchedSubject =
        subjects.find((sub) => sub.name.toLowerCase().includes(s.subject.toLowerCase())) ||
        subjects[0];

      return {
        id: `ai-rt-${Date.now()}-${idx}`,
        dayOfWeek: s.day,
        startTime: s.time,
        subjectId: matchedSubject.id,
        activityType: s.activity,
        durationMinutes: s.duration || 60,
        completed: false,
        note: 'AI Study Buddy দ্বারা প্রস্তাবিত',
      };
    });

    setRoutines((prev) => [...prev, ...newItems]);
  };

  // Routine Alarm System
  const [activeAlarmRoutine, setActiveAlarmRoutine] = useState<RoutineItem | null>(null);
  const triggeredAlarmsRef = useRef<Set<string>>(new Set());

  const dismissAlarm = () => {
    stopRoutineAlarm();
    setActiveAlarmRoutine(null);
  };

  const startStudyFromAlarm = (routine: RoutineItem) => {
    stopRoutineAlarm();
    setActiveAlarmRoutine(null);
    setTimerSubjectId(routine.subjectId);
    startTimer();
    setActiveTab('home');
  };

  const toggleRoutineAlarm = (id: string) => {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, alarmEnabled: r.alarmEnabled === false ? true : false } : r
      )
    );
  };

  const testRoutineAlarm = (routine?: RoutineItem) => {
    const target = routine || routines[0];
    if (target) {
      setActiveAlarmRoutine(target);
      const matchedSub = subjects.find((s) => s.id === target.subjectId);
      triggerBackgroundAlarm(target, matchedSub?.name || 'বিষয়');
    }
  };

  const scheduleTestBackgroundAlarmHandler = async (delaySeconds: number, routine?: RoutineItem): Promise<boolean> => {
    const target = routine || routines[0];
    if (!target) return false;
    const matchedSub = subjects.find((s) => s.id === target.subjectId);
    return await scheduleTestBackgroundAlarm(delaySeconds, target, matchedSub?.name || 'বিষয়');
  };

  // Routine Alarm Background Time Checker (runs every 5 seconds + Web Worker + lockscreen catchup)
  useEffect(() => {
    const checkAlarmTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const todayDateStr = now.toISOString().split('T')[0];

      const BENGALI_DAY_MAP: Record<number, DayOfWeek> = {
        0: 'রবি',
        1: 'সোম',
        2: 'মঙ্গল',
        3: 'বুধ',
        4: 'বৃহঃ',
        5: 'শুক্র',
        6: 'শনি',
      };
      const todayDay = BENGALI_DAY_MAP[now.getDay()];

      const todayRoutines = routines.filter(
        (r) =>
          (r.dayOfWeek === todayDay || r.dayOfWeek === 'প্রতিদিন') &&
          r.alarmEnabled !== false &&
          !r.completed
      );

      const nowTotalMinutes = currentHour * 60 + currentMinute;

      for (const r of todayRoutines) {
        let targetHour: number | null = null;
        let targetMinute: number | null = null;

        if (r.rawTime) {
          const [hStr, mStr] = r.rawTime.split(':');
          targetHour = parseInt(hStr, 10);
          targetMinute = parseInt(mStr, 10);
        } else {
          const parsed = parseStartTime(r.startTime);
          if (parsed) {
            targetHour = parsed.hour;
            targetMinute = parsed.minute;
          }
        }

        if (targetHour !== null && targetMinute !== null && !isNaN(targetHour) && !isNaN(targetMinute)) {
          const targetTotalMinutes = targetHour * 60 + targetMinute;
          const diff = nowTotalMinutes - targetTotalMinutes;

          // Trigger if on time (diff === 0) or within 3 minutes window if phone was asleep/backgrounded
          if (diff >= 0 && diff <= 3) {
            const triggerDayKey = `${r.id}_${todayDateStr}`;
            if (!triggeredAlarmsRef.current.has(triggerDayKey)) {
              triggeredAlarmsRef.current.add(triggerDayKey);
              setActiveAlarmRoutine(r);

              const matchedSub = subjects.find((s) => s.id === r.subjectId);
              triggerBackgroundAlarm(r, matchedSub?.name || 'বিষয়');
              break;
            }
          }
        }
      }
    };

    checkAlarmTime();
    const interval = setInterval(checkAlarmTime, 5000);

    // Dedicated Background Web Worker to keep checking when app is minimized
    let worker: Worker | null = null;
    try {
      if (typeof window !== 'undefined' && 'Worker' in window) {
        worker = new Worker('/alarm-worker.js');
        worker.onmessage = (e) => {
          if (e.data === 'TICK') {
            checkAlarmTime();
          }
        };
        worker.postMessage('START');
      }
    } catch (e) {
      console.warn('Worker initialization fallback:', e);
    }

    // Catch missed alarms immediately on phone screen unlock or tab focus
    const handleVisibility = () => {
      checkAlarmTime();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    // Listen for Service Worker notification click events
    const handleSwMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'ALARM_NOTIFICATION_CLICKED') {
        const found = routines.find((rt) => rt.id === event.data.routineId) || routines[0];
        if (found) {
          setActiveAlarmRoutine(found);
        }
      }
    };
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
    }

    return () => {
      clearInterval(interval);
      if (worker) {
        worker.postMessage('STOP');
        worker.terminate();
      }
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage);
      }
    };
  }, [routines, subjects]);

  // Study Timer Logic with persistent background timestamp
  const [timerStatus, setTimerStatus] = useState<'idle' | 'running' | 'paused'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMER);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.status || 'idle';
      }
    } catch {}
    return 'idle';
  });

  const [timerSubjectId, setTimerSubjectId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMER);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.subjectId || 'phy-1';
      }
    } catch {}
    return 'phy-1';
  });

  const [timerSeconds, setTimerSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.status === 'running' && parsed.startTime) {
          const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
          return (parsed.accumulatedSeconds || 0) + elapsed;
        }
        return parsed.accumulatedSeconds || 0;
      }
    } catch {}
    return 0;
  });

  const startTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef<number>(timerSeconds);

  // Sync timer state to localStorage whenever it changes
  const saveTimerState = (status: 'idle' | 'running' | 'paused', startMs: number | null, accum: number, subId: string) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.TIMER,
        JSON.stringify({
          status,
          startTime: startMs,
          accumulatedSeconds: accum,
          subjectId: subId,
        })
      );
    } catch {}
  };

  useEffect(() => {
    let interval: any = null;
    if (timerStatus === 'running') {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      interval = setInterval(() => {
        if (startTimeRef.current) {
          const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setTimerSeconds(accumulatedRef.current + currentElapsed);
        }
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerStatus]);

  const startTimer = () => {
    const now = Date.now();
    startTimeRef.current = now;
    setTimerStatus('running');
    saveTimerState('running', now, accumulatedRef.current, timerSubjectId);
  };

  const pauseTimer = () => {
    if (startTimeRef.current) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      accumulatedRef.current += elapsed;
      setTimerSeconds(accumulatedRef.current);
    }
    startTimeRef.current = null;
    setTimerStatus('paused');
    saveTimerState('paused', null, accumulatedRef.current, timerSubjectId);
  };

  const resumeTimer = () => {
    startTimer();
  };

  const resetTimer = () => {
    // If timer ran for at least 15 seconds, save the session to study history
    if (timerSeconds >= 15) {
      const today = new Date().toISOString().split('T')[0];
      const newSession: StudySession = {
        id: `sess-${Date.now()}`,
        subjectId: timerSubjectId,
        startTime: new Date(Date.now() - timerSeconds * 1000).toISOString(),
        endTime: new Date().toISOString(),
        durationSeconds: timerSeconds,
        date: today,
      };
      setStudySessions((prev) => [newSession, ...prev]);
    }

    startTimeRef.current = null;
    accumulatedRef.current = 0;
    setTimerSeconds(0);
    setTimerStatus('idle');
    saveTimerState('idle', null, 0, timerSubjectId);
  };

  // Calculate today's total study seconds
  const todayDateStr = new Date().toISOString().split('T')[0];
  const completedTodaySeconds = studySessions
    .filter((s) => s.date === todayDateStr)
    .reduce((sum, s) => sum + s.durationSeconds, 0);

  const todayStudySeconds = completedTodaySeconds + (timerStatus === 'running' || timerStatus === 'paused' ? timerSeconds : 0);

  // Dynamic Study Streak Calculation
  const targetSeconds = (userProfile.dailyTargetHours || 6) * 3600;
  const isTodayTargetMet = todayStudySeconds >= targetSeconds;

  // Aggregate past study seconds by date
  const sessionsByDate: Record<string, number> = {};
  studySessions.forEach((s) => {
    sessionsByDate[s.date] = (sessionsByDate[s.date] || 0) + s.durationSeconds;
  });
  sessionsByDate[todayDateStr] = todayStudySeconds;

  // Calculate consecutive days meeting target backwards
  let currentStreak = 0;
  const checkDate = new Date();
  // If today is not met yet, count backwards starting from yesterday
  if (!isTodayTargetMet) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Count consecutive days meeting target threshold
  for (let i = 0; i < 30; i++) {
    const dStr = checkDate.toISOString().split('T')[0];
    const studiedSec = sessionsByDate[dStr] || 0;
    // Goal threshold: either full target or at least 3 hours (giving encouragement)
    if (studiedSec >= Math.min(targetSeconds, 3 * 3600)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  if (isTodayTargetMet && currentStreak === 0) {
    currentStreak = 1;
  }

  const longestStreak = Math.max(currentStreak, 7);

  // 7-day status for the current week (শনি to শুক্র)
  const BENGALI_DAY_MAP: Record<number, DayOfWeek> = {
    0: 'রবি',
    1: 'সোম',
    2: 'মঙ্গল',
    3: 'বুধ',
    4: 'বৃহঃ',
    5: 'শুক্র',
    6: 'শনি',
  };

  const currentDayOfWeekIdx = new Date().getDay(); // 0 is Sun, 6 is Sat
  const distFromSat = (currentDayOfWeekIdx + 1) % 7;
  const satDate = new Date();
  satDate.setDate(satDate.getDate() - distFromSat);

  const weeklyStreakDays: DayStreakStatus[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(satDate);
    d.setDate(d.getDate() + i);
    const dStr = d.toISOString().split('T')[0];
    const dayOfWeek = BENGALI_DAY_MAP[d.getDay()];
    const isToday = dStr === todayDateStr;
    const studiedSec = isToday ? todayStudySeconds : (sessionsByDate[dStr] || 0);
    const isMet = studiedSec >= Math.min(targetSeconds, 3 * 3600);

    weeklyStreakDays.push({
      dayName: dayOfWeek,
      dateStr: dStr,
      isMet,
      isToday,
      hoursStudied: Math.round((studiedSec / 3600) * 10) / 10,
    });
  }

  const streakInfo: StreakInfo = {
    currentStreak,
    longestStreak,
    isTodayTargetMet,
    weeklyStreakDays,
  };

  // Profile actions
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  const resetAllData = () => {
    setChapters(DEFAULT_CHAPTERS);
    setTasks(DEFAULT_TASKS);
    setRoutines(DEFAULT_ROUTINES);
    setStudySessions([]);
    setUserProfile(DEFAULT_USER_PROFILE);
    resetTimer();
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        subjects,
        chapters,
        toggleChapter,
        addChapter,
        editChapter,
        deleteChapter,
        toggleChapterMilestone,
        addChapterMilestone,
        deleteChapterMilestone,
        selectedTrackerSubjectId,
        setSelectedTrackerSubjectId,
        overallProgress,
        subjectProgressMap,
        tasks,
        addTask,
        toggleTask,
        editTask,
        deleteTask,
        routines,
        addRoutine,
        toggleRoutine,
        editRoutine,
        deleteRoutine,
        importAiPlanSlots,
        toggleRoutineAlarm,
        testRoutineAlarm,
        scheduleTestBackgroundAlarm: scheduleTestBackgroundAlarmHandler,
        requestNotificationPermission,
        activeAlarmRoutine,
        dismissAlarm,
        startStudyFromAlarm,
        timerSeconds,
        timerStatus,
        timerSubjectId,
        setTimerSubjectId,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        todayStudySeconds,
        streakInfo,
        userProfile,
        updateUserProfile,
        resetAllData,
        isProfileOpen,
        setIsProfileOpen,
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
