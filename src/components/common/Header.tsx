import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayBengaliDate } from '../../utils/bengali';
import { PWAInstallButton } from './PWAInstallButton';
import { User, Sparkles, Moon, Sun } from 'lucide-react';

export const Header: React.FC = () => {
  const { userProfile, setIsProfileOpen, theme, toggleTheme } = useApp();
  const dateStr = getTodayBengaliDate();

  return (
    <header className="pt-4 pb-2 px-4 flex items-center justify-between">
      <div>
        <p className="text-[13px] font-medium text-stone-500 tracking-tight">
          {dateStr}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            HSC Tracker
          </h1>
          <span className="inline-block w-2 h-2 rounded-full bg-rose-700 animate-pulse" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark Mode Quick Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white border border-stone-200/90 shadow-2xs hover:border-stone-300 active:scale-95 transition cursor-pointer"
          title={theme === 'dark' ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        <PWAInstallButton compact />

        {/* Profile Circle Button ("আমি") */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full bg-white border border-stone-200/90 shadow-2xs hover:border-stone-300 active:scale-95 transition"
          title="প্রোফাইল ও সেটিংস"
        >
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold">
            {userProfile.name ? userProfile.name.charAt(0) : 'আ'}
          </div>
          <span className="text-xs font-semibold text-slate-800">আমি</span>
        </button>
      </div>
    </header>
  );
};
