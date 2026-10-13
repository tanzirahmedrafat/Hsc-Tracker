import React from 'react';
import { useApp } from '../../context/AppContext';
import { toBengaliNumber } from '../../utils/bengali';
import { Flame, Trophy, Check, Sparkles, Clock } from 'lucide-react';

export const StudyStreakCard: React.FC = () => {
  const { streakInfo, todayStudySeconds, userProfile } = useApp();

  const targetHours = userProfile.dailyTargetHours || 6;
  const targetSeconds = targetHours * 3600;
  const isTodayMet = streakInfo.isTodayTargetMet;

  return (
    <div className="rounded-3xl bg-white p-5 border border-stone-200/80 shadow-2xs relative overflow-hidden transition-all">
      {/* Subtle warm glow background accent */}
      <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200/60 shadow-2xs">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">স্টাডি স্ট্রিক</h2>
            <p className="text-[11px] text-stone-500 font-medium">ধারাবাহিক পড়ালেখার রেকর্ড</p>
          </div>
        </div>

        {/* Longest streak pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200/70 text-xs font-semibold text-stone-700">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>রেকর্ড: {toBengaliNumber(streakInfo.longestStreak)} দিন</span>
        </div>
      </div>

      {/* Streak Hero Section */}
      <div className="flex items-center gap-4 py-2 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-md shrink-0">
          <Flame className="w-8 h-8 fill-white/90 drop-shadow-xs" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              {toBengaliNumber(streakInfo.currentStreak)}
            </span>
            <span className="text-base font-bold text-slate-800">দিন স্ট্রিক!</span>
          </div>

          <p className="text-xs text-stone-600 font-medium mt-0.5 leading-snug">
            {isTodayMet ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                আজকের লক্ষ্য পূরণ হয়েছে, স্ট্রিক সক্রিয়!
              </span>
            ) : (
              <span>আজকের লক্ষ্য পূরণ করে স্ট্রিক ধরে রাখো 🔥</span>
            )}
          </p>
        </div>
      </div>

      {/* Weekly 7-Day Tracker Row */}
      <div className="mt-4 pt-3.5 border-t border-stone-100 relative z-10">
        <div className="flex items-center justify-between gap-1">
          {streakInfo.weeklyStreakDays.map((day, idx) => {
            const isCompleted = day.isMet;
            const isCurrentDay = day.isToday;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                {/* Day Name */}
                <span
                  className={`text-[11px] mb-1.5 font-bold ${
                    isCurrentDay ? 'text-slate-900' : 'text-stone-400'
                  }`}
                >
                  {day.dayName}
                </span>

                {/* Day Status Icon Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xs scale-105'
                      : isCurrentDay
                      ? 'border-2 border-slate-900 bg-white text-slate-900 shadow-2xs'
                      : 'bg-stone-100 text-stone-300'
                  }`}
                  title={`${day.dayName}: ${toBengaliNumber(day.hoursStudied)} ঘণ্টা পড়া হয়েছে`}
                >
                  {isCompleted ? (
                    <Flame className="w-4 h-4 fill-white" />
                  ) : isCurrentDay ? (
                    <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                  )}
                </div>

                {/* Small indicator for current day */}
                {isCurrentDay && (
                  <span className="text-[9px] font-black text-slate-800 mt-1 uppercase tracking-tighter">
                    আজ
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
