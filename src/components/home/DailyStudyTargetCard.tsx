import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toBengaliNumber, formatDurationBengali } from '../../utils/bengali';
import { Target, CheckCircle2, ChevronRight, Edit3, Flame, Clock } from 'lucide-react';

export const DailyStudyTargetCard: React.FC = () => {
  const { userProfile, updateUserProfile, todayStudySeconds } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  const targetHours = userProfile.dailyTargetHours || 6;
  const targetSeconds = targetHours * 3600;
  const progressPercent = Math.min(100, Math.round((todayStudySeconds / targetSeconds) * 100));
  const remainingSeconds = Math.max(0, targetSeconds - todayStudySeconds);
  const isGoalReached = todayStudySeconds >= targetSeconds;

  // SVG Circle calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleSetTarget = (hours: number) => {
    updateUserProfile({ dailyTargetHours: hours });
    setIsEditing(false);
  };

  return (
    <div className="rounded-3xl bg-white p-5 border border-stone-200/80 shadow-2xs transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200/60 shadow-2xs">
            <Target className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">দৈনিক পড়ার লক্ষ্য</h2>
            <p className="text-[11px] text-stone-500 font-medium">আজকের স্টাডি গোল ট্র্যাকিং</p>
          </div>
        </div>

        {/* Set Target Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/70 text-slate-800 text-xs font-bold transition active:scale-95 border border-stone-200/60"
        >
          <Edit3 className="w-3.5 h-3.5 text-stone-600" />
          <span>{toBengaliNumber(targetHours)} ঘণ্টা</span>
        </button>
      </div>

      {/* Target Setting Drawer / Quick Selector */}
      {isEditing && (
        <div className="mb-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">আজকের লক্ষ্য নির্ধারণ করুন:</span>
            <button
              onClick={() => setIsEditing(false)}
              className="text-[11px] text-stone-500 hover:text-slate-900 font-semibold"
            >
              বন্ধ করুন ✕
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[4, 6, 8, 10].map((hr) => (
              <button
                key={hr}
                onClick={() => handleSetTarget(hr)}
                className={`py-2 rounded-xl text-xs font-bold transition ${
                  targetHours === hr
                    ? 'bg-slate-950 text-white shadow-2xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-slate-800'
                }`}
              >
                {toBengaliNumber(hr)} ঘণ্টা
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Stats with Visual Progress Circle */}
      <div className="flex items-center justify-between gap-4 pt-1">
        {/* Left Side: Stats Breakdown */}
        <div className="flex-1 space-y-2.5">
          {/* Studied so far */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>পড়া হয়েছে</span>
            </div>
            <div className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
              {formatDurationBengali(todayStudySeconds)}
            </div>
          </div>

          {/* Remaining or Completed badge */}
          <div>
            {isGoalReached ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>আজকের লক্ষ্য পূরণ হয়েছে! 🎉</span>
              </div>
            ) : (
              <div className="text-xs text-stone-500">
                লক্ষ্য ছুঁতে বাকি:{' '}
                <span className="font-bold text-rose-800 font-sans">
                  {formatDurationBengali(remainingSeconds)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Visual Circular Progress */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
            {/* Background Track */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="text-stone-100"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className={`transition-all duration-700 ease-out ${
                isGoalReached ? 'text-emerald-600' : 'text-slate-950'
              }`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-xl font-black tracking-tight font-sans ${
                isGoalReached ? 'text-emerald-700' : 'text-slate-900'
              }`}
            >
              {toBengaliNumber(progressPercent)}%
            </span>
            <span className="text-[10px] font-bold text-stone-400 -mt-0.5">
              {isGoalReached ? 'সম্পূর্ণ' : 'অর্জিত'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
