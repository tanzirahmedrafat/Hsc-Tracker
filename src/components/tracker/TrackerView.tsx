import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChapterModal } from './ChapterModal';
import { ChapterMilestoneList } from './ChapterMilestoneList';
import { Chapter } from '../../types';
import { toBengaliNumber } from '../../utils/bengali';
import {
  Check,
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  AlertTriangle,
  Sparkles,
  Award,
} from 'lucide-react';

export const TrackerView: React.FC = () => {
  const {
    subjects,
    chapters,
    toggleChapter,
    deleteChapter,
    selectedTrackerSubjectId,
    setSelectedTrackerSubjectId,
    subjectProgressMap,
    setActiveTab,
    unlockedBadgeCount,
    totalBadgeCount,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chapterToEdit, setChapterToEdit] = useState<Chapter | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const activeSubject =
    subjects.find((s) => s.id === selectedTrackerSubjectId) || subjects[0];

  // Filter chapters for current subject, ordered by chapterNo
  const subjectChapters = chapters
    .filter((c) => c.subjectId === activeSubject.id)
    .sort((a, b) => a.chapterNo - b.chapterNo);

  const progress = subjectProgressMap[activeSubject.id] || {
    totalChapters: subjectChapters.length,
    completedChapters: subjectChapters.filter((c) => c.completed).length,
    percentage: 0,
  };

  const handleEdit = (chap: Chapter) => {
    setChapterToEdit(chap);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setChapterToEdit(null);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string) => {
    deleteChapter(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-5 space-y-4">
      {/* Page Title & Milestone Badge Pill */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            অধ্যায় ট্র্যাকার
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-1">
            বিষয় নির্বাচন করো, অধ্যায় চেক করো
          </p>
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-amber-100 transition active:scale-95 shrink-0"
          title="অ্যাকাডেমিক মাইলস্টোন ব্যাজ দেখুন"
        >
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>{toBengaliNumber(unlockedBadgeCount)}/{toBengaliNumber(totalBadgeCount)} ব্যাজ</span>
        </button>
      </div>

      {/* Horizontal Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {subjects.map((sub) => {
          const isSelected = sub.id === activeSubject.id;
          const prog = subjectProgressMap[sub.id];

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedTrackerSubjectId(sub.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-slate-900 border border-stone-200/80 hover:border-stone-300'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: sub.color }}
              />
              <span>{sub.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                  isSelected ? 'bg-slate-800 text-stone-200' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {toBengaliNumber(prog?.percentage || 0)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Subject Progress Card */}
      <div className="rounded-3xl bg-white p-5 border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-2xs"
              style={{ backgroundColor: activeSubject.color }}
            >
              {activeSubject.name.slice(0, 1)}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{activeSubject.name}</h2>
              <p className="text-xs text-stone-500">
                {toBengaliNumber(progress.completedChapters)}/{toBengaliNumber(progress.totalChapters)} অধ্যায় সম্পন্ন
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-slate-900 font-sans">
              {toBengaliNumber(progress.percentage)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress.percentage}%`,
              backgroundColor: progress.percentage > 0 ? activeSubject.color : 'transparent',
            }}
          />
        </div>
      </div>

      {/* Chapter List Card */}
      <div className="rounded-3xl bg-white p-5 border border-stone-200/80 shadow-2xs space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className="text-base font-bold text-slate-900">অধ্যায়সমূহ</h3>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-95 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ অধ্যায়</span>
          </button>
        </div>

        {/* Chapters */}
        {subjectChapters.length === 0 ? (
          <div className="py-10 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
            <p className="text-sm font-semibold text-stone-600">কোনো অধ্যায় পাওয়া যায়নি</p>
            <p className="text-xs text-stone-400 mt-1">
              সিলেবাস সাজাতে উপরে "+ অধ্যায়" বাটনে চাপুন
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {subjectChapters.map((chap) => (
              <div
                key={chap.id}
                className={`group flex items-start gap-3 p-3 rounded-2xl border transition ${
                  chap.completed
                    ? 'bg-emerald-50/40 border-emerald-200/60'
                    : 'bg-white border-stone-200/80 hover:border-slate-800'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleChapter(chap.id)}
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition active:scale-90 shrink-0 ${
                    chap.completed
                      ? 'bg-slate-950 border-slate-950 text-white'
                      : 'border-stone-300 hover:border-slate-900 bg-white'
                  }`}
                  title={chap.completed ? 'অসম্পূর্ণ চিহ্নিত করুন' : 'সম্পন্ন চিহ্নিত করুন'}
                >
                  {chap.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                {/* Chapter Number & Title */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-bold text-stone-400 font-sans shrink-0">
                      #{toBengaliNumber(chap.chapterNo)}
                    </span>
                    <span
                      className={`text-sm font-medium leading-snug break-words ${
                        chap.completed ? 'line-through text-stone-400' : 'text-slate-900'
                      }`}
                    >
                      {chap.title}
                    </span>
                  </div>

                  {chap.description && (
                    <p className="text-[11px] text-stone-500 mt-0.5 pl-5">
                      {chap.description}
                    </p>
                  )}

                  {chap.notes && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mt-1 pl-5 inline-block">
                      📝 {chap.notes}
                    </p>
                  )}

                  {/* Chapter Milestone Sub-Items (Class 1, 2, MCQ, CQ) */}
                  <ChapterMilestoneList
                    chapter={chap}
                    subjectColor={activeSubject.color}
                  />
                </div>

                {/* Action buttons: Edit & Delete */}
                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(chap)}
                    className="p-1 rounded-lg text-stone-400 hover:text-slate-800 hover:bg-stone-100 transition"
                    title="সম্পাদনা"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(chap.id)}
                    className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-stone-200 space-y-3">
            <div className="flex items-center gap-3 text-rose-700">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="text-base font-bold text-slate-900">অধ্যায় মুছে ফেলতে চান?</h4>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              এই অধ্যায়টি মুছে ফেললে আপনার প্রগ্রেস আপডেট হবে। আপনি কি নিশ্চিত?
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50"
              >
                বাতিল
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-700 text-white font-semibold text-xs hover:bg-rose-800 shadow-xs"
              >
                হ্যাঁ, মুছুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Modal */}
      <ChapterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subjectId={activeSubject.id}
        chapterToEdit={chapterToEdit}
      />
    </div>
  );
};
