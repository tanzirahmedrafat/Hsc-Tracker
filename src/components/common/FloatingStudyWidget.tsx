import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toBengaliNumber } from '../../utils/bengali';
import { Play, Pause, X, Maximize2, Flame, Sparkles, BookOpen } from 'lucide-react';

export const FloatingStudyWidget: React.FC = () => {
  const {
    todayStudySeconds,
    userProfile,
    timerStatus,
    startTimer,
    pauseTimer,
    setActiveTab,
    streakInfo,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const targetHours = userProfile.dailyTargetHours || 6;
  const targetSeconds = targetHours * 3600;
  const progressRatio = targetSeconds > 0 ? todayStudySeconds / targetSeconds : 0;
  const progressPercent = Math.min(100, Math.round(progressRatio * 100));
  const studiedHours = Math.round((todayStudySeconds / 3600) * 10) / 10;
  const studiedMinutes = Math.floor((todayStudySeconds % 3600) / 60);

  const isSad = todayStudySeconds < 300; // Less than 5 mins

  if (isDismissed) return null;

  return (
    <>
      {/* Floating Widget Bubble (always visible on bottom-right of mobile screen) */}
      <div className="fixed bottom-20 right-4 z-40 select-none">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className={`group relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl backdrop-blur-md border transition-all active:scale-95 duration-200 ${
              isSad
                ? 'bg-slate-950/90 text-white border-blue-400/40 hover:bg-slate-900'
                : 'bg-slate-950/90 text-white border-emerald-400/40 hover:bg-slate-900'
            }`}
          >
            {/* Sad / Happy Emoji Avatar */}
            <div className="relative">
              <span className="text-xl">
                {isSad ? '😢' : progressRatio >= 1.0 ? '🧙‍♂️' : '😊'}
              </span>
              {timerStatus === 'running' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              )}
            </div>

            {/* Quick Text */}
            <div className="text-left text-[11px] leading-tight">
              <div className="font-extrabold flex items-center gap-1">
                <span>{isSad ? 'পড়া হয়নি!' : `${toBengaliNumber(studiedHours)}h পড়া`}</span>
              </div>
              <div className="text-[10px] text-stone-300 font-medium">
                {timerStatus === 'running' ? 'টাইমার চালু' : 'উইজেট ট্যাপ করো'}
              </div>
            </div>
          </button>
        ) : (
          /* Expanded Android-Style Widget Card */
          <div className="w-72 rounded-3xl bg-slate-950 text-white p-4 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-150">
            {/* Widget Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span className="text-base">{isSad ? '😢' : '😊'}</span>
                <span>মোবাইল স্টাডি উইজেট</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mascot Status Message */}
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/10 text-xs mb-3">
              {isSad ? (
                <div className="text-blue-300 font-semibold leading-relaxed">
                  "আজকে এখনো কোনো পড়ালেখা হয়নি... প্লিজ পড়তে বসো 😢"
                </div>
              ) : progressRatio >= 1.0 ? (
                <div className="text-amber-300 font-semibold leading-relaxed">
                  "জাদুকরী পড়া! আজকের সব লক্ষ্য পূরণ হয়েছে 🏆"
                </div>
              ) : (
                <div className="text-emerald-300 font-semibold leading-relaxed">
                  "খুব সুন্দর পড়ছো! এভাবেই চালিয়ে যাও 💪"
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-stone-400">আজকের পড়া:</span>
              <span className="font-extrabold font-sans text-amber-300 text-sm">
                {toBengaliNumber(studiedHours)} / {toBengaliNumber(targetHours)} ঘণ্টা
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: isSad ? '#38bdf8' : '#10b981',
                }}
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  if (timerStatus === 'running') {
                    pauseTimer();
                  } else {
                    startTimer();
                  }
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition active:scale-95 flex items-center justify-center gap-1.5 ${
                  timerStatus === 'running'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {timerStatus === 'running' ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>পজ করুন</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>পড়া শুরু</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveTab('routine');
                }}
                className="py-2 px-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 border border-white/15 text-stone-200 transition"
              >
                রুটিন
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
