import React from 'react';
import { useApp } from '../../context/AppContext';
import { toBengaliNumber } from '../../utils/bengali';
import { ArrowRight, BookOpen } from 'lucide-react';

export const SubjectOverview: React.FC = () => {
  const { subjects, subjectProgressMap, setActiveTab, setSelectedTrackerSubjectId } = useApp();

  const handleSubjectClick = (subId: string) => {
    setSelectedTrackerSubjectId(subId);
    setActiveTab('tracker');
  };

  return (
    <div className="rounded-3xl bg-white p-5 border border-stone-200/80 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900">বিষয়ভিত্তিক</h2>
        <button
          onClick={() => setActiveTab('tracker')}
          className="flex items-center gap-1 text-xs font-bold text-rose-800 hover:text-rose-900 transition"
        >
          <span>সব দেখা</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2-Column Grid on Mobile */}
      <div className="grid grid-cols-2 gap-2.5">
        {subjects.map((sub) => {
          const prog = subjectProgressMap[sub.id] || { totalChapters: 0, completedChapters: 0, percentage: 0 };

          return (
            <button
              key={sub.id}
              onClick={() => handleSubjectClick(sub.id)}
              className="text-left p-3 rounded-2xl border border-stone-200/80 hover:border-slate-800 bg-stone-50/40 hover:bg-white transition group relative flex flex-col justify-between active:scale-97"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: sub.color }}
                  />
                  <span className="text-[10px] font-bold text-stone-500 font-sans">
                    {toBengaliNumber(prog.percentage)}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug truncate group-hover:text-rose-900 transition">
                  {sub.name}
                </h4>
              </div>

              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-stone-500 mb-1">
                  {toBengaliNumber(prog.completedChapters)}/{toBengaliNumber(prog.totalChapters)}
                </div>
                <div className="h-1.5 w-full bg-stone-200/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${prog.percentage}%`,
                      backgroundColor: prog.percentage > 0 ? sub.color : 'transparent',
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
