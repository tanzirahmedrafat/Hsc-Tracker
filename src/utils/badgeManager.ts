import { AcademicBadge, StudySession, StreakInfo, Task, RoutineItem } from '../types';

export const BADGE_DEFINITIONS: Omit<AcademicBadge, 'unlocked' | 'unlockedAt' | 'currentProgress'>[] = [
  {
    id: 'early_bird',
    key: 'early_bird',
    title: 'ভোরের পাখি',
    englishName: 'Early Bird',
    category: 'time',
    description: 'ভোর ৫:০০ থেকে সকাল ৮:৩০ এর মধ্যে মনোযোগী পড়ালেখা সম্পন্ন করেছেন।',
    icon: '🌅',
    tier: 'bronze',
    targetProgress: 3,
    requirementText: 'ভোরে ৩টি স্টাডি সেশন সম্পন্ন করুন',
  },
  {
    id: 'night_owl',
    key: 'night_owl',
    title: 'রাতের পেঁচা',
    englishName: 'Night Owl',
    category: 'time',
    description: 'রাত ১০:০০ থেকে ভোর ৩:০০ এর মধ্যে নিস্তব্ধ রাতে মনোযোগ দিয়ে পড়েছেন।',
    icon: '🦉',
    tier: 'bronze',
    targetProgress: 3,
    requirementText: 'গভীর রাতে ৩টি স্টাডি সেশন সম্পন্ন করুন',
  },
  {
    id: 'deep_work_titan',
    key: 'deep_work_titan',
    title: 'ধ্যানমগ্ন শিক্ষার্থী',
    englishName: 'Deep Work Titan',
    category: 'consistency',
    description: 'একটানা ৪৫ মিনিট বা তার বেশি সময় কোনো বিরতি ছাড়া গভীর মনোযোগে পড়াশোনা করেছেন।',
    icon: '⏱️',
    tier: 'silver',
    targetProgress: 2,
    requirementText: 'টানা ৪৫+ মিনিটের ২টি স্টাডি সেশন সম্পন্ন করুন',
  },
  {
    id: 'streak_flame',
    key: 'streak_flame',
    title: 'ধারাবাহিকতার আগুন',
    englishName: 'Consistency Flame',
    category: 'streak',
    description: 'টানা ৫ দিন বা তার বেশি সময় প্রতিদিন পড়ার লক্ষ্য পূরণ করে স্ট্রিক বজায় রেখেছেন।',
    icon: '🔥',
    tier: 'silver',
    targetProgress: 5,
    requirementText: 'টানা ৫ দিনের স্টাডি স্ট্রিক অর্জন করুন',
  },
  {
    id: 'syllabus_pro',
    key: 'syllabus_pro',
    title: 'সিলেবাস প্রো',
    englishName: 'Syllabus Pro',
    category: 'mastery',
    description: 'এইচএসসি সম্পূর্ণ সিলেবাসের ৫০% বা তার বেশি অধ্যায় সম্পন্ন করে অসাধারণ মাইলফলক ছুঁয়েছেন।',
    icon: '🏆',
    tier: 'gold',
    targetProgress: 50,
    requirementText: 'সিলেবাসের ৫০% পড়া সম্পন্ন করুন',
  },
  {
    id: 'all_rounder',
    key: 'all_rounder',
    title: 'সর্ববিদ্যা বিশারদ',
    englishName: 'Multi-Subject Scholar',
    category: 'mastery',
    description: 'কমপক্ষে ৪টি ভিন্ন ভিন্ন বিষয়ে স্টাডি সেশন সম্পন্ন করে পড়ার ভারসাম্য বজায় রেখেছেন।',
    icon: '📚',
    tier: 'silver',
    targetProgress: 4,
    requirementText: '৪টি আলাদা বিষয়ে পড়ালেখা করুন',
  },
  {
    id: 'daily_crusher',
    key: 'daily_crusher',
    title: 'দৈনিক লক্ষ্যভেদী',
    englishName: 'Daily Target Crusher',
    category: 'consistency',
    description: 'আজকের নির্ধারিত পড়ার দৈনিক ঘণ্টার লক্ষ্যমাত্রা ১০০% পূর্ণ করেছেন।',
    icon: '🎯',
    tier: 'bronze',
    targetProgress: 1,
    requirementText: 'আজকের দৈনিক পড়ার টার্গেট ১০০% পূরণ করুন',
  },
  {
    id: 'task_master',
    key: 'task_master',
    title: 'টাস্ক মাস্টার',
    englishName: 'Task Eliminator',
    category: 'consistency',
    description: 'স্টাডি ট্র্যাকারের ৫টি পড়ার টাস্ক সফলভাবে সম্পন্ন করেছেন।',
    icon: '⚡',
    tier: 'bronze',
    targetProgress: 5,
    requirementText: '৫টি পড়ার টাস্ক সম্পন্ন করুন',
  },
  {
    id: 'routine_champion',
    key: 'routine_champion',
    title: 'রুটিন চ্যাম্পিয়ন',
    englishName: 'Routine Disciplinarian',
    category: 'consistency',
    description: 'সাপ্তাহিক রুটিনের নির্ধারিত সময় মেনে পড়ার স্লট সম্পন্ন করেছেন।',
    icon: '📅',
    tier: 'silver',
    targetProgress: 4,
    requirementText: 'রুটিনের ৪টি পড়া সময়মতো শেষ করুন',
  },
  {
    id: 'century_legend',
    key: 'century_legend',
    title: 'পূর্ণাঙ্গ মহীরুহ',
    englishName: 'HSC Centurion',
    category: 'mastery',
    description: 'সম্পূর্ণ ১০০% সিলেবাস সফলভাবে শেষ করেছেন—আপনার ৩D গাছটি ফুলে ও পাকা ফলে পরিপূর্ণ!',
    icon: '🍎',
    tier: 'diamond',
    targetProgress: 100,
    requirementText: 'সম্পূর্ণ ১০০% সিলেবাস সম্পন্ন করুন',
  },
];

export interface ComputeBadgesParams {
  sessions: StudySession[];
  streak: StreakInfo;
  overallProgress: { percentage: number; completedChapters: number };
  tasks: Task[];
  routines: RoutineItem[];
  savedUnlocked?: Record<string, string>; // badgeId -> ISO string
}

export function computeBadges({
  sessions,
  streak,
  overallProgress,
  tasks,
  routines,
  savedUnlocked = {},
}: ComputeBadgesParams): {
  badges: AcademicBadge[];
  unlockedCount: number;
  totalCount: number;
} {
  // 1. Analyze sessions for Early Bird (05:00 - 08:30)
  let earlyBirdCount = 0;
  let nightOwlCount = 0;
  let deepWorkCount = 0;
  const distinctSubjects = new Set<string>();

  sessions.forEach((s) => {
    distinctSubjects.add(s.subjectId);

    // Deep work (>= 45 mins = 2700s)
    if (s.durationSeconds >= 2700) {
      deepWorkCount++;
    }

    try {
      const d = new Date(s.startTime);
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const totalMinutes = hours * 60 + minutes;

      // Early bird: 5:00 (300m) to 8:30 (510m)
      if (totalMinutes >= 300 && totalMinutes <= 510) {
        earlyBirdCount++;
      }

      // Night owl: 22:00 (1320m) to 03:00 (180m next day)
      if (hours >= 22 || hours < 3) {
        nightOwlCount++;
      }
    } catch {}
  });

  // Completed tasks count
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  // Completed routines count
  const completedRoutinesCount = routines.filter((r) => r.completed).length;

  const badges: AcademicBadge[] = BADGE_DEFINITIONS.map((def) => {
    let currentProgress = 0;

    switch (def.id) {
      case 'early_bird':
        currentProgress = earlyBirdCount;
        break;
      case 'night_owl':
        currentProgress = nightOwlCount;
        break;
      case 'deep_work_titan':
        currentProgress = deepWorkCount;
        break;
      case 'streak_flame':
        currentProgress = Math.max(streak?.currentStreak || 0, streak?.longestStreak || 0);
        break;
      case 'syllabus_pro':
        currentProgress = overallProgress.percentage;
        break;
      case 'all_rounder':
        currentProgress = distinctSubjects.size;
        break;
      case 'daily_crusher':
        currentProgress = streak?.isTodayTargetMet ? 1 : 0;
        break;
      case 'task_master':
        currentProgress = completedTasksCount;
        break;
      case 'routine_champion':
        currentProgress = completedRoutinesCount;
        break;
      case 'century_legend':
        currentProgress = overallProgress.percentage;
        break;
      default:
        currentProgress = 0;
    }

    const wasAlreadyUnlocked = Boolean(savedUnlocked[def.id]);
    const isNowUnlocked = wasAlreadyUnlocked || currentProgress >= def.targetProgress;
    const unlockedAt = savedUnlocked[def.id] || (isNowUnlocked ? new Date().toISOString() : undefined);

    return {
      ...def,
      currentProgress: Math.min(currentProgress, def.targetProgress),
      unlocked: isNowUnlocked,
      unlockedAt,
    };
  });

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return {
    badges,
    unlockedCount,
    totalCount: badges.length,
  };
}
