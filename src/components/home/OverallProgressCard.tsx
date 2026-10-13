import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toBengaliNumber } from '../../utils/bengali';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const OverallProgressCard: React.FC = () => {
  const { subjects, overallProgress, subjectProgressMap, setActiveTab, setSelectedTrackerSubjectId } = useApp();
  const [showAllRows, setShowAllRows] = useState(false);

  // Circular progress calculations (SVG circle)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallProgress.percentage / 100) * circumference;

  const displaySubjects = showAllRows ? subjects : subjects.slice(0, 6);

  const handleSubjectClick = (subId: string) => {
    setSelectedTrackerSubjectId(subId);
    setActiveTab('tracker');
  };

  return (
    <div className="rounded-3xl bg-white p-5 border border-stone-200/80 shadow-2xs">
      {/* Title & Badge */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900">সামগ্রিক অগ্রগতি</h2>
        <div className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-semibold text-xs border border-stone-200/60">
          {toBengaliNumber(overallProgress.completedChapters)}/{toBengaliNumber(overallProgress.totalChapters)} অধ্যায়
        </div>
      </div>

      {/* Circular Progress Indicator */}
      <div className="flex items-center justify-center my-3">
        <div className="relative w-28 h-28 flex items-center justify-center">
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
            {/* Progress Stroke */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="text-rose-700 transition-all duration-700 ease-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
              {toBengaliNumber(overallProgress.percentage)}%
            </span>
            <span className="text-[10px] font-semibold text-stone-400 -mt-0.5">সম্পন্ন</span>
          </div>
        </div>
      </div>

      {/* Subject Progress Rows */}
      <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
        {displaySubjects.map((sub) => {
          const prog = subjectProgressMap[sub.id] || { totalChapters: 0, completedChapters: 0, percentage: 0 };

          return (
            <div
              key={sub.id}
              onClick={() => handleSubjectClick(sub.id)}
              className="group cursor-pointer hover:bg-stone-50/70 p-1.5 -mx-1.5 rounded-xl transition"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-stone-800 group-hover:text-rose-900 transition truncate max-w-[200px]">
                  {sub.name}
                </span>
                <span className="font-medium text-stone-500 font-sans">
                  {toBengaliNumber(prog.percentage)}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${prog.percentage}%`,
                    backgroundColor: prog.percentage > 0 ? sub.color : '#e2e8f0',
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* View all toggle */}
        <button
          onClick={() => setShowAllRows(!showAllRows)}
          className="w-full pt-2 flex items-center justify-center gap-1 text-xs font-semibold text-rose-800 hover:text-rose-900 transition"
        >
          <span>{showAllRows ? 'কম দেখুন' : `সব বিষয় দেখুন (${toBengaliNumber(subjects.length)}টি)`}</span>
          {showAllRows ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
