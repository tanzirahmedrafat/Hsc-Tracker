import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toBengaliNumber } from '../../utils/bengali';
import { StudyTree3D } from './StudyTree3D';
import { ChevronDown, ChevronUp, TreePine, PieChart, Sparkles } from 'lucide-react';

export const OverallProgressCard: React.FC = () => {
  const { subjects, overallProgress, subjectProgressMap, streakInfo, setActiveTab, setSelectedTrackerSubjectId } = useApp();
  const [showAllRows, setShowAllRows] = useState(false);
  const [viewMode, setViewMode] = useState<'tree' | 'gauge'>('tree');
  const [previewPercentage, setPreviewPercentage] = useState<number | null>(null);

  // Active percentage to display (either user's actual progress or a preview stage)
  const currentPercentage = previewPercentage !== null ? previewPercentage : overallProgress.percentage;

  // Circular progress calculations (SVG circle)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentPercentage / 100) * circumference;

  const displaySubjects = showAllRows ? subjects : subjects.slice(0, 6);

  const handleSubjectClick = (subId: string) => {
    setSelectedTrackerSubjectId(subId);
    setActiveTab('tracker');
  };

  return (
    <div className="rounded-3xl bg-white p-5 border border-stone-200/80 shadow-2xs">
      {/* Title & Controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900">সামগ্রিক অগ্রগতি</h2>
          {/* View Toggle Button */}
          <div className="flex items-center p-0.5 rounded-full bg-stone-100 border border-stone-200/70 text-[11px]">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-2.5 py-1 rounded-full font-bold transition flex items-center gap-1 ${
                viewMode === 'tree' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="3D বৃক্ষ সিমুলেশন"
            >
              <TreePine className="w-3.5 h-3.5" />
              <span>3D গাছ</span>
            </button>
            <button
              onClick={() => setViewMode('gauge')}
              className={`px-2.5 py-1 rounded-full font-bold transition flex items-center gap-1 ${
                viewMode === 'gauge' ? 'bg-white text-slate-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="সাধারণ চক্রাকার গেজ"
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>গেজ</span>
            </button>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-semibold text-xs border border-stone-200/60">
          {toBengaliNumber(overallProgress.completedChapters)}/{toBengaliNumber(overallProgress.totalChapters)} অধ্যায়
        </div>
      </div>

      {/* Main Visual Display */}
      {viewMode === 'tree' ? (
        <div className="my-2 space-y-2.5">
          {/* Hyperrealistic 3D Tree Simulation */}
          <StudyTree3D
            percentage={currentPercentage}
            streakDays={streakInfo?.currentStreak || 1}
            completedChapters={overallProgress.completedChapters}
            totalChapters={overallProgress.totalChapters}
          />

          {/* Tree Growth Stage Preview Bar */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1 text-[11px]">
            <button
              onClick={() => setPreviewPercentage(null)}
              className={`px-2.5 py-1 rounded-full font-bold transition shrink-0 ${
                previewPercentage === null
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:text-slate-900'
              }`}
            >
              🎯 লাইভ প্রোগ্রেস ({toBengaliNumber(overallProgress.percentage)}%)
            </button>
            <button
              onClick={() => setPreviewPercentage(5)}
              className={`px-2 py-1 rounded-full font-medium transition shrink-0 ${
                previewPercentage === 5
                  ? 'bg-emerald-900 text-white font-bold shadow-xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🌱 কচি চারা (৫%)
            </button>
            <button
              onClick={() => setPreviewPercentage(25)}
              className={`px-2 py-1 rounded-full font-medium transition shrink-0 ${
                previewPercentage === 25
                  ? 'bg-lime-700 text-white font-bold shadow-xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🌿 বাড়ন্ত চারা (২৫%)
            </button>
            <button
              onClick={() => setPreviewPercentage(55)}
              className={`px-2 py-1 rounded-full font-medium transition shrink-0 ${
                previewPercentage === 55
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🌳 সবুজ বৃক্ষ (৫৫%)
            </button>
            <button
              onClick={() => setPreviewPercentage(82)}
              className={`px-2 py-1 rounded-full font-medium transition shrink-0 ${
                previewPercentage === 82
                  ? 'bg-pink-700 text-white font-bold shadow-xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              🌸 পুষ্পিত (৮২%)
            </button>
            <button
              onClick={() => setPreviewPercentage(100)}
              className={`px-2.5 py-1 rounded-full font-bold transition shrink-0 ${
                previewPercentage === 100
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              🍎 ফলবান (১০০%)
            </button>
          </div>
        </div>
      ) : (
        /* Classic Circular Progress Indicator */
        <div className="flex items-center justify-center my-4">
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
                {toBengaliNumber(currentPercentage)}%
              </span>
              <span className="text-[10px] font-semibold text-stone-400 -mt-0.5">সম্পন্ন</span>
            </div>
          </div>
        </div>
      )}

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

        {/* View More / Less Toggle */}
        {subjects.length > 6 && (
          <button
            onClick={() => setShowAllRows(!showAllRows)}
            className="w-full pt-2 flex items-center justify-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 transition"
          >
            <span>{showAllRows ? 'কম দেখুন' : `আরও ${toBengaliNumber(subjects.length - 6)}টি বিষয় দেখুন`}</span>
            {showAllRows ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
};
