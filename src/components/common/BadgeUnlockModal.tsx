import React, { useEffect } from 'react';
import { AcademicBadge } from '../../types';
import { playBadgeUnlockFanfare } from '../../utils/audioAlarm';
import { Award, Sparkles, X, Share2, Check } from 'lucide-react';

interface BadgeUnlockModalProps {
  badge: AcademicBadge | null;
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({ badge, onClose }) => {
  useEffect(() => {
    if (badge) {
      playBadgeUnlockFanfare();
    }
  }, [badge]);

  if (!badge) return null;

  const tierColors = {
    bronze: 'from-amber-700/20 to-amber-900/10 text-amber-700 border-amber-300',
    silver: 'from-slate-400/20 to-slate-600/10 text-slate-700 border-slate-300',
    gold: 'from-amber-400/30 to-yellow-500/20 text-amber-600 border-amber-400',
    diamond: 'from-cyan-400/30 to-blue-600/20 text-cyan-600 border-cyan-400',
  };

  const tierLabel = {
    bronze: 'ব্রোঞ্জ ব্যাজ 🥉',
    silver: 'সিলভার ব্যাজ 🥈',
    gold: 'স্বর্ণপদক ব্যাজ 🥇',
    diamond: 'ডায়মন্ড এলিট ব্যাজ 💎',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-amber-200 text-center animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Confetti / Glow Background Effect */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Celebration Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>নতুন অর্জন আনলক!</span>
        </div>

        {/* Big Glowing Badge Icon */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-100 via-orange-50 to-yellow-100 border-4 border-amber-300/80 shadow-lg flex items-center justify-center text-5xl animate-bounce">
            {badge.icon}
          </div>
          <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold font-sans tracking-wide shadow-xs">
            {tierLabel[badge.tier]}
          </div>
        </div>

        {/* Badge Titles */}
        <div className="space-y-1 mb-3">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {badge.title}
          </h3>
          <div className="text-xs font-bold text-amber-700 font-sans tracking-wide uppercase">
            {badge.englishName}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-stone-600 leading-relaxed px-2 mb-5">
          {badge.description}
        </p>

        {/* Requirement & Unlocked At Info */}
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 mb-5 text-left flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-[11px]">শর্ত পূরণ হয়েছে:</div>
            <div className="text-[11px] text-stone-600">{badge.requirementText}</div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white font-bold text-sm hover:opacity-95 active:scale-98 transition shadow-md flex items-center justify-center gap-2"
        >
          <span>ধন্যবাদ! পড়া চালিয়ে যাই</span>
          <Award className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
