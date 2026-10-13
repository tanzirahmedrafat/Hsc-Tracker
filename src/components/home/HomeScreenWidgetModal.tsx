import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toBengaliNumber } from '../../utils/bengali';
import { X, Smartphone, Play, Flame, Check, Sparkles, Layers, ArrowRight } from 'lucide-react';

interface HomeScreenWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HomeScreenWidgetModal: React.FC<HomeScreenWidgetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { todayStudySeconds, userProfile, streakInfo, startTimer } = useApp();
  const [selectedWidgetSize, setSelectedWidgetSize] = useState<'4x2' | '2x2'>('4x2');

  if (!isOpen) return null;

  const targetHours = userProfile.dailyTargetHours || 6;
  const targetSeconds = targetHours * 3600;
  const progressRatio = targetSeconds > 0 ? todayStudySeconds / targetSeconds : 0;
  const progressPercent = Math.min(100, Math.round(progressRatio * 100));
  const studiedHours = Math.round((todayStudySeconds / 3600) * 10) / 10;
  const isSad = todayStudySeconds < 300;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-rose-600 flex items-center justify-center text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">মোবাইল হোমস্ক্রিন উইজেট (Widget)</h3>
              <p className="text-[10px] text-stone-400">ফোনের স্ক্রিনে অ্যাপের পাশে রাখার উইজেট</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Simulated Android Phone Screen Preview */}
          <div className="rounded-3xl p-3.5 bg-gradient-to-b from-sky-900 via-indigo-950 to-slate-950 border-4 border-slate-800 shadow-xl relative overflow-hidden text-white">
            {/* Phone Status Bar */}
            <div className="flex items-center justify-between text-[10px] text-white/80 pb-2.5 px-1 font-mono">
              <span>১০:৩০ AM</span>
              <div className="flex items-center gap-1.5 text-[9px]">
                <span>5G</span>
                <span>85%</span>
              </div>
            </div>

            {/* The 4x2 Android Widget on Mobile Home Screen */}
            <div className="my-2 rounded-2xl bg-black/60 backdrop-blur-md p-3.5 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  {/* Sad or Happy Emoji Avatar */}
                  <span className="text-2xl animate-bounce">
                    {isSad ? '😢' : progressRatio >= 1 ? '🧙‍♂️' : '😊'}
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-white flex items-center gap-1">
                      <span>HSC Study Tracker</span>
                    </div>
                    <div
                      className={`text-[10px] font-semibold ${
                        isSad ? 'text-blue-300' : 'text-emerald-300'
                      }`}
                    >
                      {isSad
                        ? 'পড়া শুরু করোনি 😢 (Sad Mood)'
                        : 'দারুণ করছো! ✨ (Happy Mood)'}
                    </div>
                  </div>
                </div>

                {/* Streak Badge */}
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{toBengaliNumber(streakInfo.currentStreak)} দিন</span>
                </div>
              </div>

              {/* Progress info */}
              <div className="mt-2.5 flex items-center justify-between text-[11px]">
                <span className="text-stone-300">আজকের পড়ার সময়:</span>
                <span className="font-bold font-sans text-amber-300">
                  {toBengaliNumber(studiedHours)} / {toBengaliNumber(targetHours)} ঘণ্টা
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-1 h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: isSad ? '#38bdf8' : '#10b981',
                  }}
                />
              </div>

              {/* Quick 1-tap start button directly on widget */}
              <button
                onClick={() => {
                  startTimer();
                  onClose();
                }}
                className={`mt-2.5 w-full py-1.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md ${
                  isSad
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isSad ? 'উইজেট থেকে পড়া শুরু করুন' : 'টাইমার অন করুন'}</span>
              </button>
            </div>

            {/* Simulated Android App Icons on Home Screen */}
            <div className="grid grid-cols-4 gap-2 pt-3 px-1 text-center text-[9px] text-white/80">
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm font-bold">
                  📞
                </div>
                <span>ফোন</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold">
                  💬
                </div>
                <span>মেসেজ</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-sm font-bold">
                  🎓
                </div>
                <span className="font-bold text-amber-300">HSC App</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-sm font-bold">
                  ⚙️
                </div>
                <span>সেটিংস</span>
              </div>
            </div>
          </div>

          {/* How to add on Real Phone Home Screen */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>ফোনের হোমস্ক্রিনে যুক্ত করার নিয়ম:</span>
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-stone-600 text-[11px] leading-relaxed">
              <li>
                <strong>PWA / অ্যাপ ইনস্টল করুন:</strong> প্রোফাইল থেকে "Install App" চাপলে এটি আপনার অ্যাপ ড্রয়ারে চলে আসবে।
              </li>
              <li>
                <strong>হোমস্ক্রিনে উইজেট শর্টকাট:</strong> ফোনের হোমস্ক্রিনে HSC Tracker আইকনের ওপর <strong>লং-প্রেস (চেপে ধরুন)</strong> করলে সরাসরি <em>"স্টাডি টাইমার"</em> ও <em>"আজকের রুটিন"</em> উইজেট পেয়ে যাবেন।
              </li>
              <li>
                <strong>ফ্লোটিং স্ক্রিন উইজেট:</strong> এই অ্যাপে সার্বক্ষণিক স্ক্রিনের নিচে একটি ফ্লোটিং উইজেট বাটন যুক্ত আছে যা পড়া না করলে 😢 মোডে থাকবে!
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-900 transition active:scale-98"
          >
            বুঝেছি, উইজেট প্রিভিউ বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
