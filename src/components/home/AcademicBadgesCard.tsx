import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicBadge } from '../../types';
import { toBengaliNumber } from '../../utils/bengali';
import { Award, Lock, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

export const AcademicBadgesCard: React.FC = () => {
  const { academicBadges, unlockedBadgeCount, totalBadgeCount } = useApp();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<AcademicBadge | null>(null);

  const filteredBadges = academicBadges.filter((b) => {
    if (filter === 'unlocked') return b.unlocked;
    if (filter === 'locked') return !b.unlocked;
    return true;
  });

  const tierBg = {
    bronze: 'border-amber-700/30 bg-amber-50/50 text-amber-900',
    silver: 'border-slate-300 bg-slate-50/60 text-slate-800',
    gold: 'border-amber-400 bg-amber-50/70 text-amber-900',
    diamond: 'border-cyan-400 bg-cyan-50/70 text-cyan-950',
  };

  return (
    <div className="rounded-3xl bg-white p-5 border border-stone-200/80 shadow-2xs space-y-4">
      {/* Title & Badge Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">অ্যাকাডেমিক মাইলস্টোন</h2>
            <p className="text-xs text-stone-500">পড়াশোনার ধারাবাহিকতায় বিশেষ ব্যাজ</p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>
            {toBengaliNumber(unlockedBadgeCount)}/{toBengaliNumber(totalBadgeCount)} অর্জিত
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 text-xs font-bold">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-xl transition text-center ${
            filter === 'all' ? 'bg-white text-slate-950 shadow-2xs' : 'text-stone-600 hover:text-slate-900'
          }`}
        >
          সব ({toBengaliNumber(totalBadgeCount)})
        </button>
        <button
          onClick={() => setFilter('unlocked')}
          className={`flex-1 py-1.5 rounded-xl transition text-center ${
            filter === 'unlocked' ? 'bg-white text-slate-950 shadow-2xs' : 'text-stone-600 hover:text-slate-900'
          }`}
        >
          অর্জিত ({toBengaliNumber(unlockedBadgeCount)})
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`flex-1 py-1.5 rounded-xl transition text-center ${
            filter === 'locked' ? 'bg-white text-slate-950 shadow-2xs' : 'text-stone-600 hover:text-slate-900'
          }`}
        >
          আসন্ন ({toBengaliNumber(totalBadgeCount - unlockedBadgeCount)})
        </button>
      </div>

      {/* Badges Grid (2 Columns) */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredBadges.map((badge) => {
          const progressPercent = Math.min(100, Math.round((badge.currentProgress / badge.targetProgress) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`relative p-3 rounded-2xl border transition-all cursor-pointer active:scale-97 select-none flex flex-col justify-between ${
                badge.unlocked
                  ? `${tierBg[badge.tier]} shadow-2xs hover:shadow-xs hover:border-amber-400`
                  : 'bg-stone-50/70 border-stone-200/80 text-stone-500 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Top Row: Icon & Status */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl shadow-2xs ${
                    badge.unlocked
                      ? 'bg-white shadow-xs'
                      : 'bg-stone-200/80 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                {badge.unlocked ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-stone-200/80 text-stone-400 flex items-center justify-center text-xs">
                    <Lock className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* Title & English Subtitle */}
              <div className="my-2">
                <div className="font-bold text-xs text-slate-900 truncate">
                  {badge.title}
                </div>
                <div className="text-[10px] text-stone-500 font-sans truncate">
                  {badge.englishName}
                </div>
              </div>

              {/* Progress Bar / Unlocked Status */}
              <div>
                {badge.unlocked ? (
                  <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <span>আনলক হয়েছে 🎉</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-sans text-stone-500">
                      <span>অগ্রগতি</span>
                      <span>
                        {toBengaliNumber(badge.currentProgress)}/{toBengaliNumber(badge.targetProgress)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Drawer / Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 border border-stone-200 shadow-xl space-y-4 text-center animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-4xl shadow-sm">
              {selectedBadge.icon}
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">{selectedBadge.title}</h3>
              <p className="text-xs font-bold text-amber-700 font-sans tracking-wide uppercase">
                {selectedBadge.englishName}
              </p>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed px-2">
              {selectedBadge.description}
            </p>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-left text-xs space-y-1.5">
              <div className="font-bold text-slate-900">যেভাবে আনলক করবেন:</div>
              <div className="text-stone-600">{selectedBadge.requirementText}</div>

              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                <span className="text-stone-500">বর্তমান অগ্রগতি:</span>
                <span className="font-bold font-sans text-slate-900">
                  {toBengaliNumber(selectedBadge.currentProgress)}/{toBengaliNumber(selectedBadge.targetProgress)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-900 transition active:scale-95 shadow-2xs"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
