import React from 'react';
import { useApp } from '../../context/AppContext';
import { toBengaliNumber } from '../../utils/bengali';
import { Bell, Play, X, Clock, BookOpen, Volume2 } from 'lucide-react';

export const AlarmNotificationModal: React.FC = () => {
  const { activeAlarmRoutine, dismissAlarm, startStudyFromAlarm, subjects } = useApp();

  if (!activeAlarmRoutine) return null;

  const subject = subjects.find((s) => s.id === activeAlarmRoutine.subjectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border-2 border-rose-500 overflow-hidden animate-in zoom-in-95 duration-200 text-center">
        {/* Animated Top Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 p-6 text-white relative">
          <button
            onClick={dismissAlarm}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Ringing Bell Animation */}
          <div className="relative inline-block my-2">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center animate-ping absolute inset-0" />
            <div className="w-16 h-16 rounded-full bg-white text-rose-700 flex items-center justify-center shadow-lg relative z-10">
              <Bell className="w-8 h-8 fill-rose-600 animate-bounce" />
            </div>
          </div>

          <h2 className="text-xl font-black tracking-tight mt-1">পড়ার সময় হয়েছে!</h2>
          <p className="text-xs text-rose-100 mt-0.5">রুটিনের নির্ধারিত সময় অনুযায়ী পড়ার অ্যালার্ম</p>
        </div>

        {/* Routine Details Card */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2">
            {/* Subject */}
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: subject?.color || '#0f172a' }}
              />
              <span className="font-bold text-slate-900 text-sm">
                {subject?.name || 'বিষয়'}
              </span>
            </div>

            {/* Activity & Chapter */}
            <div className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-stone-400" />
              <span>{activeAlarmRoutine.activityType}</span>
            </div>

            {activeAlarmRoutine.chapterTitle && (
              <div className="text-xs text-stone-600 pl-5">
                {activeAlarmRoutine.chapterTitle}
              </div>
            )}

            {/* Time & Duration */}
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 pt-1 border-t border-stone-200/60">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{activeAlarmRoutine.startTime}</span>
              <span>•</span>
              <span>{toBengaliNumber(activeAlarmRoutine.durationMinutes)} মিনিট</span>
            </div>
          </div>

          {/* Sound alert note */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-700 font-medium bg-amber-50 py-1.5 px-3 rounded-xl border border-amber-200/60">
            <Volume2 className="w-3.5 h-3.5 shrink-0" />
            <span>অ্যালার্ম চিম বাজছে — পড়া শুরু করুন!</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => startStudyFromAlarm(activeAlarmRoutine)}
              className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>▶ পড়া শুরু করুন (স্টাডি টাইমার)</span>
            </button>

            <button
              onClick={dismissAlarm}
              className="w-full py-2.5 rounded-2xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition"
            >
              অ্যালার্ম বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
