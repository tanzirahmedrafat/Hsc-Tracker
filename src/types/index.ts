export type Priority = 'low' | 'medium' | 'high';

export type DayOfWeek = 'শনি' | 'রবি' | 'সোম' | 'মঙ্গল' | 'বুধ' | 'বৃহঃ' | 'শুক্র' | 'প্রতিদিন';

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  iconName: string;
}

export interface ChapterMilestone {
  id: string;
  title: string; // e.g. 'Class 1', 'Class 2', 'MCQ', 'CQ'
  type?: 'class' | 'mcq' | 'cq' | 'revision' | 'custom';
  completed: boolean;
}

export interface Chapter {
  id: string;
  subjectId: string;
  chapterNo: number;
  title: string;
  description?: string;
  completed: boolean;
  targetDate?: string;
  notes?: string;
  updatedAt?: string;
  milestones?: ChapterMilestone[];
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  chapterId?: string;
  date: string; // YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

export interface RoutineItem {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // e.g. "০৭:০০ AM - ০৮:৩০ AM"
  rawTime?: string; // 24-hr time e.g. "07:00" for exact alarm matching
  subjectId: string;
  chapterTitle?: string;
  activityType: string; // e.g. 'অধ্যায় পড়া', 'রিভিশন', 'MCQ Practice'
  durationMinutes: number;
  note?: string;
  completed: boolean;
  alarmEnabled?: boolean;
}

export interface StudySession {
  id: string;
  subjectId: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  date: string; // YYYY-MM-DD
}

export interface UserProfile {
  name: string;
  examTarget: string; // e.g. 'HSC 2026'
  group: string; // e.g. 'বিজ্ঞান'
  dailyTargetHours: number;
  preferredTime: string;
  weakSubjects: string;
  notificationsEnabled: boolean;
}

export interface DayStreakStatus {
  dayName: DayOfWeek;
  dateStr: string;
  isMet: boolean;
  isToday: boolean;
  hoursStudied: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  isTodayTargetMet: boolean;
  weeklyStreakDays: DayStreakStatus[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  imageBase64?: string;
}
