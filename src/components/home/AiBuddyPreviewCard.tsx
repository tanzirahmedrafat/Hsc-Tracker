import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const AiBuddyPreviewCard: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div
      onClick={() => setActiveTab('ai-buddy')}
      className="cursor-pointer rounded-3xl p-4.5 bg-gradient-to-r from-rose-50/90 via-orange-50/60 to-amber-50/50 border border-rose-200/60 hover:border-rose-300 transition shadow-2xs group flex items-center justify-between active:scale-98"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-rose-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition shrink-0">
          <Sparkles className="w-6 h-6 fill-white/20 animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-900 transition">
            AI Buddy-কে জিজ্ঞাসা করুন
          </h3>
          <p className="text-xs text-stone-600 mt-0.5 leading-tight">
            অংক সমাধান, পড়ার পরামর্শ — ছবি দেওয়াও যাবে
          </p>
        </div>
      </div>

      <div className="w-8 h-8 rounded-full bg-white/80 border border-rose-200/50 flex items-center justify-center text-rose-800 group-hover:translate-x-1 transition shrink-0">
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
};
