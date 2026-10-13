import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DayOfWeek } from '../../types';
import { RoutineModal } from './RoutineModal';
import { toBengaliNumber } from '../../utils/bengali';
import { Plus, Check, Trash2, Clock, BookOpen, Bell, BellOff, Volume2 } from 'lucide-react';

const DAYS: DayOfWeek[] = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'প্রতিদিন'];

const getTodayDayOfWeek = (): DayOfWeek => {
  const dayIndex = new Date().getDay();
  const mapping: Record<number, DayOfWeek> = {
    0: 'রবি',
    1: 'সোম',
    2: 'মঙ্গল',
    3: 'বুধ',
    4: 'বৃহঃ',
    5: 'শুক্র',
    6: 'শনি',
  };
  return mapping[dayIndex] || 'রবি';
};

export const RoutineView: React.FC = () => {
  const {
    routines,
    toggleRoutine,
    deleteRoutine,
    subjects,
    setActiveTab,
    toggleRoutineAlarm,
    testRoutineAlarm,
  } = useApp();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getTodayDayOfWeek);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Today's day name in Bengali
  const todayName = getTodayDayOfWeek();

  // Filter routines for selected day or everyday slots
  const dayRoutines = routines.filter(
    (r) => r.dayOfWeek === selectedDay || (selectedDay !== 'প্রতিদিন' && r.dayOfWeek === 'প্রতিদিন')
  );

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-5 space-y-4">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            সাপ্তাহিক<br />রুটিন
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-1">
            তোমার সপ্তাহের পড়াশোনা পরিকল্পনা ও সময়মতো অ্যালার্ম
          </p>
        </div>

        {/* Test Alarm Sound Button */}
        <button
          onClick={() => testRoutineAlarm()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 text-xs font-bold transition active:scale-95 shadow-2xs mt-1"
          title="অ্যালার্ম শব্দ পরীক্ষা করুন"
        >
          <Volume2 className="w-3.5 h-3.5 text-amber-700" />
          <span>টেস্ট অ্যালার্ম</span>
        </button>
      </div>

      {/* Routine Alarm Info Banner */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-orange-50 border border-amber-200/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700 shrink-0">
            <Bell className="w-4 h-4 fill-amber-500" />
          </div>
          <span className="font-semibold text-slate-800 text-[11px] leading-tight">
            রুটিনের নির্ধারিত সময় হলেই স্বয়ংক্রিয় অ্যালার্ম ও চিম রিংটোন বাজবে!
          </span>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {DAYS.map((day) => {
          const isSelected = selectedDay === day;
          const count = routines.filter((r) => r.dayOfWeek === day).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-slate-900 border border-stone-200/80 hover:border-stone-300'
              }`}
            >
              <span>{day}</span>
              {count > 0 && (
                <span
                  className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-sans ${
                    isSelected ? 'bg-slate-800 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {toBengaliNumber(count)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Routine Section for Selected Day */}
      <div className="rounded-3xl bg-white p-5 border border-stone-200/80 shadow-2xs space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {selectedDay}-বার এর রুটিন
            </h2>
            <p className="text-[11px] text-stone-400">
              মোট {toBengaliNumber(dayRoutines.length)}টি স্টাডি স্লট
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-95 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ যোগ করুন</span>
          </button>
        </div>

        {/* Empty State */}
        {dayRoutines.length === 0 ? (
          <div className="py-12 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-200 px-4">
            <p className="text-sm font-semibold text-stone-600">
              এই দিনের জন্য কোনো রুটিন নেই
            </p>
            <p className="text-xs text-stone-400 mt-1">
              পড়াশোনার সময়সূচি সাজাতে "+ যোগ করুন" বাটনে চাপুন অথবা AI Buddy দিয়ে প্ল্যান তৈরি করুন
            </p>
            <button
              onClick={() => setActiveTab('ai-buddy')}
              className="mt-3.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200/70 text-xs font-bold hover:bg-rose-100 transition inline-flex items-center gap-1"
            >
              <span>AI Study Planner খুলুন</span>
              <span>→</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {dayRoutines.map((routine) => {
              const sub = subjects.find((s) => s.id === routine.subjectId);

              return (
                <div
                  key={routine.id}
                  className={`group rounded-2xl border p-3.5 transition flex items-start gap-3 relative ${
                    routine.completed
                      ? 'bg-stone-50/70 border-stone-200/60 opacity-80'
                      : 'bg-white border-stone-200/90 hover:border-slate-800 shadow-2xs'
                  }`}
                >
                  {/* Completion checkbox */}
                  <button
                    onClick={() => toggleRoutine(routine.id)}
                    className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center transition active:scale-90 shrink-0 ${
                      routine.completed
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'border-stone-300 hover:border-slate-800 bg-white'
                    }`}
                  >
                    {routine.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Card Content */}
                  <div className="flex-1 min-w-0">
                    {/* Time & Duration */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{routine.startTime}</span>
                      <span className="text-stone-300">•</span>
                      <span>{toBengaliNumber(routine.durationMinutes)} মিনিট</span>
                    </div>

                    {/* Subject & Activity */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-md text-white"
                        style={{ backgroundColor: sub?.color || '#0f172a' }}
                      >
                        {sub?.name || 'সাধারণ বিষয়'}
                      </span>
                      <span className="text-xs font-bold text-slate-800 bg-stone-100 px-2 py-0.5 rounded-md">
                        {routine.activityType}
                      </span>
                    </div>

                    {/* Optional chapter or note */}
                    {routine.chapterTitle && (
                      <p className="text-xs font-medium text-stone-700 mt-1">
                        📖 {routine.chapterTitle}
                      </p>
                    )}
                    {routine.note && (
                      <p className="text-[11px] text-stone-500 mt-0.5 italic">
                        "{routine.note}"
                      </p>
                    )}
                  </div>

                  {/* Actions: Alarm & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleRoutineAlarm(routine.id)}
                      className={`p-1.5 rounded-lg transition ${
                        routine.alarmEnabled !== false
                          ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                          : 'text-stone-300 hover:text-stone-500 hover:bg-stone-100'
                      }`}
                      title={
                        routine.alarmEnabled !== false
                          ? 'অ্যালার্ম চালু আছে (বন্ধ করতে ট্যাপ করুন)'
                          : 'অ্যালার্ম বন্ধ আছে (চালু করতে ট্যাপ করুন)'
                      }
                    >
                      {routine.alarmEnabled !== false ? (
                        <Bell className="w-4 h-4 fill-amber-500 text-amber-600" />
                      ) : (
                        <BellOff className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => deleteRoutine(routine.id)}
                      className="opacity-50 group-hover:opacity-100 p-1.5 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <RoutineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        day={selectedDay}
      />
    </div>
  );
};
