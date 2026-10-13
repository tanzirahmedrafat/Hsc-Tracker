import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Chapter, ChapterMilestone } from '../../types';
import { toBengaliNumber } from '../../utils/bengali';
import { Check, Plus, X, Video, HelpCircle, FileText, BookOpen, Sparkles } from 'lucide-react';

interface ChapterMilestoneListProps {
  chapter: Chapter;
  subjectColor: string;
}

export const ChapterMilestoneList: React.FC<ChapterMilestoneListProps> = ({
  chapter,
  subjectColor,
}) => {
  const { toggleChapterMilestone, addChapterMilestone, deleteChapterMilestone } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [selectedType, setSelectedType] = useState<ChapterMilestone['type']>('class');

  const milestones = chapter.milestones || [];
  const completedCount = milestones.filter((m) => m.completed).length;
  const totalCount = milestones.length;

  // Compute next class number if needed
  const classCount = milestones.filter(
    (m) => m.type === 'class' || m.title.toLowerCase().includes('class')
  ).length;
  const nextClassTitle = `Class ${classCount + 1}`;

  const handleQuickAdd = (title: string, type: ChapterMilestone['type']) => {
    addChapterMilestone(chapter.id, title, type);
    setIsAdding(false);
    setCustomTitle('');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    addChapterMilestone(chapter.id, customTitle.trim(), selectedType);
    setCustomTitle('');
    setIsAdding(false);
  };

  const getMilestoneIcon = (title: string, type?: string) => {
    const t = title.toLowerCase();
    if (type === 'class' || t.includes('class') || t.includes('ক্লাস')) {
      return <Video className="w-3 h-3 shrink-0" />;
    }
    if (type === 'mcq' || t.includes('mcq')) {
      return <HelpCircle className="w-3 h-3 shrink-0" />;
    }
    if (type === 'cq' || t.includes('cq')) {
      return <FileText className="w-3 h-3 shrink-0" />;
    }
    return <BookOpen className="w-3 h-3 shrink-0" />;
  };

  return (
    <div className="mt-2.5 pt-2.5 border-t border-stone-100/90 space-y-2">
      {/* Progress & Milestone Header */}
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 font-bold text-stone-600">
          <span>অংশসমূহ:</span>
          {totalCount > 0 && (
            <span className="font-sans px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700 text-[10px]">
              {toBengaliNumber(completedCount)}/{toBengaliNumber(totalCount)} সম্পন্ন
            </span>
          )}
        </div>

        {/* Toggle Add Form Button */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-800 hover:text-rose-800 px-2 py-0.5 rounded-full hover:bg-stone-100 transition active:scale-95"
            title="নতুন Class, MCQ বা CQ যোগ করুন"
          >
            <Plus className="w-3 h-3" />
            <span>যোগ করুন</span>
          </button>
        )}
      </div>

      {/* Milestone Pills Row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {milestones.map((m) => {
          const isDone = m.completed;

          return (
            <div
              key={m.id}
              className={`group/item inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs border select-none ${
                isDone
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300/80 hover:bg-emerald-100'
                  : 'bg-stone-50 text-stone-700 border-stone-200/80 hover:border-slate-800 hover:bg-stone-100'
              }`}
            >
              {/* Toggle click area */}
              <button
                onClick={() => toggleChapterMilestone(chapter.id, m.id)}
                className="flex items-center gap-1.5 active:scale-95 transition"
                title={isDone ? 'অসম্পূর্ণ করুন' : 'সম্পন্ন করুন'}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-md flex items-center justify-center text-[10px] transition ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'border border-stone-300 text-transparent'
                  }`}
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>

                <span className="flex items-center gap-1">
                  {getMilestoneIcon(m.title, m.type)}
                  <span className={isDone ? 'line-through opacity-85' : ''}>{m.title}</span>
                </span>
              </button>

              {/* Delete button (shows on hover) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChapterMilestone(chapter.id, m.id);
                }}
                className="opacity-0 group-hover/item:opacity-100 ml-0.5 p-0.5 text-stone-400 hover:text-rose-600 rounded transition"
                title="মুছুন"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}

        {/* Small Add Trigger Chip */}
        {!isAdding && milestones.length === 0 && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border border-dashed border-stone-300 text-stone-500 hover:border-slate-800 hover:text-slate-900 transition"
          >
            <Plus className="w-3 h-3" />
            <span>Class 1, MCQ, CQ যোগ করুন</span>
          </button>
        )}
      </div>

      {/* Inline Quick Add Drawer */}
      {isAdding && (
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 animate-in fade-in zoom-in-95 duration-150 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span>কী যোগ করতে চাও?</span>
            <button
              onClick={() => setIsAdding(false)}
              className="text-[11px] text-stone-400 hover:text-slate-900"
            >
              বন্ধ করুন ✕
            </button>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickAdd(nextClassTitle, 'class')}
              className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-slate-900 text-xs font-bold text-slate-800 flex items-center gap-1 transition active:scale-95 shadow-2xs"
            >
              <Video className="w-3 h-3 text-indigo-600" />
              <span>+ {nextClassTitle}</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickAdd('MCQ Practice', 'mcq')}
              className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-slate-900 text-xs font-bold text-slate-800 flex items-center gap-1 transition active:scale-95 shadow-2xs"
            >
              <HelpCircle className="w-3 h-3 text-amber-600" />
              <span>+ MCQ</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickAdd('CQ Practice', 'cq')}
              className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-slate-900 text-xs font-bold text-slate-800 flex items-center gap-1 transition active:scale-95 shadow-2xs"
            >
              <FileText className="w-3 h-3 text-rose-600" />
              <span>+ CQ</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickAdd('নোট ও রিভিশন', 'revision')}
              className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-slate-900 text-xs font-bold text-slate-800 flex items-center gap-1 transition active:scale-95 shadow-2xs"
            >
              <BookOpen className="w-3 h-3 text-emerald-600" />
              <span>+ রিভিশন</span>
            </button>
          </div>

          {/* Custom Input */}
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              placeholder="বা কাস্টম নাম (যেমন: বোর্ড CQ 2024, Class 3)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs"
            />
            <button
              type="submit"
              disabled={!customTitle.trim()}
              className="px-3 py-1.5 rounded-xl bg-slate-900 disabled:opacity-50 text-white text-xs font-bold hover:bg-slate-800 transition active:scale-95"
            >
              যোগ
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
