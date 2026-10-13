import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { toBengaliNumber } from '../../utils/bengali';
import { Sparkles, Play, Flame, Heart, BookOpen, Wand2, Smartphone } from 'lucide-react';
import { HomeScreenWidgetModal } from './HomeScreenWidgetModal';

type WizardMood = 'sad' | 'starting' | 'happy' | 'triumphant';

const FUN_QUOTES = [
  'পড়াশোনা হলো এক ধরনের জাদু—যত পড়বে, তত শক্তিশালী হবে! 🪄',
  'আজকে ফিজিক্স বা ম্যাথের একটা কঠিন চ্যাপ্টার জয় করো! ⚡',
  'ছোট ছোট দৈনিক প্রচেষ্টাই HSC-তে গোল্ডেন A+ এনে দেয়! 🌟',
  'একটু বিরতি নিয়ে পানি খাও, তারপর আবার মনোযোগ দাও! 💧',
  'আমি তোমার সাথে আছি, চলো একসাথে বোর্ড পরীক্ষায় সেরা হই! 🎓',
];

export const StudyWizardCard: React.FC = () => {
  const { todayStudySeconds, userProfile, startTimer, setActiveTab, streakInfo } = useApp();
  const [clickCount, setClickCount] = useState(0);
  const [customQuoteIndex, setCustomQuoteIndex] = useState<number | null>(null);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);

  const targetHours = userProfile.dailyTargetHours || 6;
  const targetSeconds = targetHours * 3600;
  const progressRatio = targetSeconds > 0 ? todayStudySeconds / targetSeconds : 0;
  const progressPercent = Math.min(100, Math.round(progressRatio * 100));
  const studiedHours = Math.round((todayStudySeconds / 3600) * 10) / 10;
  const studiedMinutes = Math.floor((todayStudySeconds % 3600) / 60);

  // Determine Wizard's Mood
  const mood: WizardMood = useMemo(() => {
    if (todayStudySeconds < 300) return 'sad'; // less than 5 mins
    if (progressRatio < 0.35) return 'starting';
    if (progressRatio < 1.0) return 'happy';
    return 'triumphant';
  }, [todayStudySeconds, progressRatio]);

  const handleWizardClick = () => {
    setClickCount((c) => c + 1);
    setCustomQuoteIndex((prev) => ((prev ?? 0) + 1) % FUN_QUOTES.length);
  };

  // Content configuration per mood
  const config = {
    sad: {
      themeGradient: 'from-slate-900 via-indigo-950 to-blue-950',
      borderClass: 'border-blue-900/60',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      statusText: '😢 মন খারাপ উইজেট (Sad Mood)',
      mainDialogue:
        customQuoteIndex !== null
          ? FUN_QUOTES[customQuoteIndex]
          : 'আজকে তো এখনো পড়া শুরু করোনি... প্লিজ বই খোলো 😢',
      subText: 'পড়ালেখা না করলে আমার মন খারাপ হয়ে যায়!',
      actionText: '▶ পড়তে বসো (টাইমার চালু)',
      actionColor: 'bg-rose-600 hover:bg-rose-500 text-white',
      accentColor: '#38bdf8',
    },
    starting: {
      themeGradient: 'from-slate-950 via-slate-900 to-indigo-950',
      borderClass: 'border-indigo-900/50',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
      statusText: '🤔 মনোযোগী উইজেট (Focused Mood)',
      mainDialogue:
        customQuoteIndex !== null
          ? FUN_QUOTES[customQuoteIndex]
          : 'দারুণ শুরু করেছো! পড়ার গতি ধরে রাখলে আজকের লক্ষ্য পূরণ হবে 💪',
      subText: `আজকে ${toBengaliNumber(studiedHours)} ঘণ্টা পড়া হয়েছে`,
      actionText: '▶ পড়াশোনা চালিয়ে যাও',
      actionColor: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      accentColor: '#818cf8',
    },
    happy: {
      themeGradient: 'from-slate-950 via-slate-900 to-emerald-950',
      borderClass: 'border-emerald-900/50',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      statusText: '😊 খুশি উইজেট (Happy Mood)',
      mainDialogue:
        customQuoteIndex !== null
          ? FUN_QUOTES[customQuoteIndex]
          : 'তুমি খুব চমৎকার পড়ছো! আজকের টার্গেটের অর্ধেকের বেশি শেষ ✨',
      subText: `টার্গেটের ${toBengaliNumber(progressPercent)}% অর্জিত`,
      actionText: '▶ আরেকটু পড়ে লক্ষ্য ছুঁয়ে ফেলো',
      actionColor: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      accentColor: '#34d399',
    },
    triumphant: {
      themeGradient: 'from-amber-950 via-slate-950 to-rose-950',
      borderClass: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      statusText: '🧙‍♂️ লেজেন্ডারি মাস্টার উইজার্ড',
      mainDialogue:
        customQuoteIndex !== null
          ? FUN_QUOTES[customQuoteIndex]
          : 'অসাধারণ জাদুকরী পারফরম্যান্স! আজকের সম্পূর্ণ পড়ার লক্ষ্য পূরণ! 🏆🎉',
      subText: 'তুমি একজন সত্যিকারের HSC চ্যাম্পিয়ন!',
      actionText: '📖 রুটিন ও রিভিশন চেক করো',
      actionColor: 'bg-amber-600 hover:bg-amber-500 text-white',
      accentColor: '#fbbf24',
    },
  }[mood];

  return (
    <div
      className={`rounded-3xl p-5 bg-gradient-to-br ${config.themeGradient} text-white shadow-xl border ${config.borderClass} relative overflow-hidden transition-all duration-300`}
    >
      {/* Background magical ambient glow */}
      <div
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: config.accentColor }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: config.accentColor }}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${config.badgeBg}`}>
            {config.statusText}
          </span>
          <span className="text-[10px] text-stone-400 font-medium">ট্যাপ করে কথা শুনো</span>
        </div>

        {/* Streak indicator */}
        <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{toBengaliNumber(streakInfo.currentStreak)} দিন স্ট্রিক</span>
        </div>
      </div>

      {/* Main Wizard Display & Speech Bubble */}
      <div className="flex items-start gap-3.5 relative z-10">
        {/* Interactive Animated Wizard Character Avatar */}
        <button
          onClick={handleWizardClick}
          className="relative shrink-0 group focus:outline-none transition active:scale-90"
          title="উইজার্ডকে ট্যাপ করুন"
        >
          <div className="relative w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md p-1 border border-white/15 shadow-inner flex items-center justify-center">
            {/* Expressive SVG Wizard based on mood */}
            {mood === 'sad' && (
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Droopy Wizard Hat */}
                <path
                  d="M 50 12 L 20 52 Q 50 48 80 52 Z"
                  fill="#3b82f6"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                />
                <ellipse cx="50" cy="52" rx="34" ry="7" fill="#1e40af" />
                <path d="M 50 12 Q 35 18 32 26" stroke="#60a5fa" strokeWidth="3" fill="none" />
                {/* Sad Wizard Face */}
                <circle cx="50" cy="66" r="20" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
                {/* Drooping beard */}
                <path d="M 36 68 Q 50 88 64 68 Z" fill="#e2e8f0" />
                {/* Sad eyes */}
                <ellipse cx="43" cy="62" rx="2.5" ry="3.5" fill="#1e293b" />
                <ellipse cx="57" cy="62" rx="2.5" ry="3.5" fill="#1e293b" />
                {/* Big tear */}
                <circle cx="41" cy="69" r="2.2" fill="#38bdf8" className="animate-pulse" />
                {/* Sad downturned mouth */}
                <path d="M 45 74 Q 50 70 55 74" stroke="#713f12" strokeWidth="2" fill="none" />
              </svg>
            )}

            {mood === 'starting' && (
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Wizard Hat */}
                <path
                  d="M 50 10 L 22 50 Q 50 46 78 50 Z"
                  fill="#6366f1"
                  stroke="#4338ca"
                  strokeWidth="2"
                />
                <ellipse cx="50" cy="50" rx="32" ry="7" fill="#4338ca" />
                {/* Wizard Face */}
                <circle cx="50" cy="66" r="20" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
                {/* Beard */}
                <path d="M 35 68 Q 50 86 65 68 Z" fill="#f1f5f9" />
                {/* Focused eyes */}
                <circle cx="43" cy="62" r="2.5" fill="#1e293b" />
                <circle cx="57" cy="62" r="2.5" fill="#1e293b" />
                {/* Determined mouth */}
                <line x1="46" y1="72" x2="54" y2="72" stroke="#713f12" strokeWidth="2" strokeLinecap="round" />
                {/* Small wand */}
                <line x1="72" y1="55" x2="84" y2="40" stroke="#f59e0b" strokeWidth="3" />
                <circle cx="85" cy="39" r="3" fill="#fbbf24" />
              </svg>
            )}

            {mood === 'happy' && (
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md animate-pulse">
                {/* Wizard Hat with Star */}
                <path
                  d="M 50 8 L 22 48 Q 50 44 78 48 Z"
                  fill="#10b981"
                  stroke="#047857"
                  strokeWidth="2"
                />
                <ellipse cx="50" cy="48" rx="32" ry="7" fill="#047857" />
                <polygon points="50,22 52,28 58,28 53,32 55,38 50,34 45,38 47,32 42,28 48,28" fill="#fbbf24" />
                {/* Smiling Face */}
                <circle cx="50" cy="64" r="20" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
                {/* Fluffy Beard */}
                <path d="M 35 66 Q 50 88 65 66 Z" fill="#ffffff" />
                {/* Happy curved eyes */}
                <path d="M 40 60 Q 43 56 46 60" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M 54 60 Q 57 56 60 60" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Smile */}
                <path d="M 44 68 Q 50 75 56 68" stroke="#713f12" strokeWidth="2" fill="none" />
                {/* Magic wand with sparkles */}
                <line x1="74" y1="50" x2="86" y2="30" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                <circle cx="87" cy="29" r="4" fill="#fbbf24" />
              </svg>
            )}

            {mood === 'triumphant' && (
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                {/* Golden Legendary Wizard Hat */}
                <path
                  d="M 50 6 L 20 46 Q 50 42 80 46 Z"
                  fill="#f59e0b"
                  stroke="#b45309"
                  strokeWidth="2"
                />
                <ellipse cx="50" cy="46" rx="34" ry="7" fill="#d97706" />
                {/* Golden Crown on Hat */}
                <polygon points="40,28 45,18 50,24 55,18 60,28" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
                {/* Radiating Face */}
                <circle cx="50" cy="64" r="20" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                {/* Grand Beard */}
                <path d="M 34 66 Q 50 92 66 66 Z" fill="#ffffff" />
                {/* Joyful Star Eyes */}
                <polygon points="43,59 44,61 46,61 44,62 45,64 43,63 41,64 42,62 40,61 42,61" fill="#b45309" />
                <polygon points="57,59 58,61 60,61 58,62 59,64 57,63 55,64 56,62 54,61 56,61" fill="#b45309" />
                {/* Joyful Big Smile */}
                <path d="M 43 68 Q 50 78 57 68 Z" fill="#be123c" />
                {/* Magic Wand with Glowing Star */}
                <line x1="75" y1="52" x2="88" y2="24" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
                <polygon points="88,20 90,25 96,25 91,29 93,34 88,31 83,34 85,29 80,25 86,25" fill="#fef08a" />
              </svg>
            )}

            {/* Tap me bounce indicator badge */}
            <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-white/20 text-white text-[9px]">
              <Wand2 className="w-2.5 h-2.5 text-amber-300" />
            </span>
          </div>
        </button>

        {/* Speech Bubble */}
        <div className="flex-1 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 relative">
          {/* Arrow pointing to avatar */}
          <div className="absolute top-4 -left-2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-8 border-r-white/10" />

          <p className="text-xs font-semibold leading-relaxed text-slate-100">
            "{config.mainDialogue}"
          </p>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
            <span>{config.subText}</span>
            <span className="font-bold font-sans text-amber-300">
              {toBengaliNumber(studiedHours)} / {toBengaliNumber(targetHours)} ঘণ্টা
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-1.5 h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: config.accentColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center gap-2 relative z-10">
        <button
          onClick={() => {
            if (mood === 'triumphant') {
              setActiveTab('routine');
            } else {
              startTimer();
              // Scroll down to timer card
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition active:scale-97 shadow-md flex items-center justify-center gap-2 ${config.actionColor}`}
        >
          {mood === 'triumphant' ? <BookOpen className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{config.actionText}</span>
        </button>

        <button
          onClick={() => setIsWidgetModalOpen(true)}
          className="py-2.5 px-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 transition active:scale-97 flex items-center gap-1.5 shrink-0"
          title="মোবাইলের হোমস্ক্রিনে উইজেট সেটআপ ও প্রিভিউ"
        >
          <Smartphone className="w-3.5 h-3.5 text-rose-300" />
          <span>ফোনে উইজেট</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-buddy')}
          className="py-2.5 px-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 transition active:scale-97 flex items-center gap-1.5 shrink-0"
          title="পরামর্শ ও চ্যাট"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>পরামর্শ</span>
        </button>
      </div>

      {/* Android Mobile Home Screen Widget Preview Modal */}
      <HomeScreenWidgetModal
        isOpen={isWidgetModalOpen}
        onClose={() => setIsWidgetModalOpen(false)}
      />
    </div>
  );
};
