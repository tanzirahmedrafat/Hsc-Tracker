import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTimer, formatDurationBengali } from '../../utils/bengali';
import { SubjectSelectModal } from '../common/SubjectSelectModal';
import { Play, Pause, RotateCcw, BookOpen, Sparkles } from 'lucide-react';

export const StudyTimerCard: React.FC = () => {
  const {
    timerSeconds,
    timerStatus,
    timerSubjectId,
    setTimerSubjectId,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    todayStudySeconds,
    subjects,
  } = useApp();

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  const activeSubject = subjects.find((s) => s.id === timerSubjectId) || subjects[0];
  const timerDisplay = formatTimer(timerSeconds);
  const todayDurationDisplay = formatDurationBengali(todayStudySeconds);

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-5 shadow-xl border border-slate-800">
        {/* Subtle accent glow */}
        <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-44 h-44 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

        {/* Top bar */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
            <h2 className="text-base font-bold tracking-tight text-white">স্টাডি টাইমার</h2>
          </div>

          {/* Right pill: "বিষয় বাছাই" */}
          <button
            onClick={() => setIsSubjectModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-xs font-medium text-slate-200 transition active:scale-95"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: activeSubject?.color || '#b91c1c' }}
            />
            <span className="truncate max-w-[110px]">{activeSubject?.name || 'বিষয় বাছাই'}</span>
            <span className="text-[10px] text-slate-400">▾</span>
          </button>
        </div>

        {/* Large Timer Display */}
        <div className="my-3 text-center relative z-10">
          <div className="text-5xl sm:text-6xl font-black tracking-wider font-mono text-white select-none drop-shadow-sm">
            {timerDisplay}
          </div>
          <p className="mt-2 text-xs font-medium text-slate-400">
            আজকের পড়া: <span className="text-slate-200 font-semibold">{todayDurationDisplay}</span>
          </p>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-center gap-3 relative z-10">
          {/* Main button: Start / Pause / Resume */}
          {timerStatus === 'running' ? (
            <button
              onClick={pauseTimer}
              className="flex-1 max-w-[180px] py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>বিরতি নিন</span>
            </button>
          ) : timerStatus === 'paused' ? (
            <button
              onClick={resumeTimer}
              className="flex-1 max-w-[180px] py-3 px-5 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>চালিয়ে যান</span>
            </button>
          ) : (
            <button
              onClick={startTimer}
              className="flex-1 max-w-[180px] py-3 px-5 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>▶ শুরু করুন</span>
            </button>
          )}

          {/* Reset / Stop Button */}
          <button
            onClick={resetTimer}
            title="টাইমার রিসেট ও সেশন সংরক্ষণ"
            disabled={timerSeconds === 0}
            className={`p-3 rounded-2xl border transition active:scale-90 flex items-center justify-center ${
              timerSeconds > 0
                ? 'border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'border-slate-800 bg-slate-900/30 text-slate-600 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <SubjectSelectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        selectedSubjectId={timerSubjectId}
        onSelect={(id) => setTimerSubjectId(id)}
        title="টাইমারের জন্য বিষয় নির্বাচন"
      />
    </>
  );
};
