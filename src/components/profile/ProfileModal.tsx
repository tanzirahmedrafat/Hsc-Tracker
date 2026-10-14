import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useFirebaseAuth } from '../../firebase/FirebaseAuthProvider';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { ApkGuideModal } from './ApkGuideModal';
import { toBengaliNumber } from '../../utils/bengali';
import {
  X,
  User,
  GraduationCap,
  Target,
  Bell,
  Download,
  RotateCcw,
  Check,
  Shield,
  Smartphone,
  Moon,
  Sun,
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const {
    isProfileOpen,
    setIsProfileOpen,
    userProfile,
    updateUserProfile,
    resetAllData,
    overallProgress,
    todayStudySeconds,
    theme,
    toggleTheme,
    unlockedBadgeCount,
    totalBadgeCount,
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [examTarget, setExamTarget] = useState(userProfile.examTarget);
  const [group, setGroup] = useState(userProfile.group);
  const [dailyTargetHours, setDailyTargetHours] = useState(userProfile.dailyTargetHours);
  const [preferredTime, setPreferredTime] = useState(userProfile.preferredTime);
  const [notifications, setNotifications] = useState(userProfile.notificationsEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState(false);

  const { currentUser, signInWithGoogle, signOutUser, isSyncing } = useFirebaseAuth();

  if (!isProfileOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      examTarget,
      group,
      dailyTargetHours: Number(dailyTargetHours),
      preferredTime,
      notificationsEnabled: notifications,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleNotificationRequest = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifications(true);
        updateUserProfile({ notificationsEnabled: true });
        new Notification('HSC Tracker 📚', {
          body: 'তোমার পড়ার সময় হয়েছে! নোটিফিকেশন সফলভাবে চালু হয়েছে।',
          icon: '/pwa-192x192.png',
        });
      }
    } else {
      alert('আপনার ব্রাউজারে নোটিফিকেশন সাপোর্ট করে না');
    }
  };

  const handleExportData = () => {
    const data = {
      userProfile,
      overallProgress,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hsc-tracker-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-stone-200/80 p-5 flex flex-col max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              {name ? name.charAt(0) : 'আ'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">শিক্ষার্থীর প্রোফাইল</h3>
              <p className="text-xs text-stone-500">তোমার লক্ষ্য ও সেটিংস</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Cloud Account & Sync Card */}
        {currentUser ? (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border border-blue-200/80 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || ''}
                  className="w-10 h-10 rounded-full border border-blue-300 shadow-2xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                  {currentUser.displayName?.charAt(0) || 'G'}
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{currentUser.displayName || 'Google User'}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-sans bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    {isSyncing ? 'সিঙ্ক হচ্ছে...' : 'Cloud Synced'}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 font-mono truncate max-w-[180px]">
                  {currentUser.email}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={signOutUser}
              className="py-1.5 px-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs transition active:scale-95 shadow-2xs"
            >
              লগআউট
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-center justify-center text-base">
                ☁️
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">গুগল ক্লাউড ব্যাকআপ (Firebase)</div>
                <div className="text-[11px] text-stone-500">লগইন করলে সব ডিভাইসে সিলেবাস ও স্ট্রিক সুরক্ষিত থাকবে</div>
              </div>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={isSyncing}
              className="py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs transition active:scale-95 flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <span>{isSyncing ? 'অপেক্ষা করুন...' : 'লগইন'}</span>
            </button>
          </div>
        )}

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-stone-50 rounded-2xl border border-stone-200/60 text-center">
          <div>
            <div className="text-[11px] text-stone-500 font-medium">সিলেবাস</div>
            <div className="text-base font-black text-rose-800 font-sans mt-0.5">
              {toBengaliNumber(overallProgress.percentage)}%
            </div>
          </div>
          <div>
            <div className="text-[11px] text-stone-500 font-medium">টার্গেট</div>
            <div className="text-base font-black text-slate-900 font-sans mt-0.5">
              {examTarget}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-stone-500 font-medium">মাইলস্টোন ব্যাজ</div>
            <div className="text-base font-black text-amber-700 font-sans mt-0.5 flex items-center justify-center gap-0.5">
              <span>{toBengaliNumber(unlockedBadgeCount)}/{toBengaliNumber(totalBadgeCount)}</span>
              <span className="text-xs">🏆</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">শিক্ষার্থীর নাম</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">টার্গেট ব্যাচ</label>
              <select
                value={examTarget}
                onChange={(e) => setExamTarget(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="HSC 2026">HSC 2026</option>
                <option value="HSC 2027">HSC 2027</option>
                <option value="HSC 2025">HSC 2025 (রিভিশন)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">বিভাগ</label>
              <input
                type="text"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              দৈনিক পড়ার লক্ষ্য (ঘণ্টা)
            </label>
            <input
              type="number"
              min="1"
              max="16"
              value={dailyTargetHours}
              onChange={(e) => setDailyTargetHours(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              পড়ার পছন্দের সময়
            </label>
            <input
              type="text"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Notifications */}
          <div className="pt-1">
            <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50/40">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-stone-500" />
                <div>
                  <div className="text-xs font-bold text-slate-900">স্টাডি রিমাইন্ডার নোটিফিকেশন</div>
                  <div className="text-[11px] text-stone-500">পড়ার সময় ও টাস্ক শেষ করার মনে করিয়ে দেবে</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleNotificationRequest}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  notifications ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-900 text-white'
                }`}
              >
                {notifications ? 'চালু আছে' : 'অনুমতি দিন'}
              </button>
            </div>
          </div>

          {/* Dark Mode Theme Toggle */}
          <div className="pt-1">
            <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50/40">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-600 flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>ডার্ক মোড (Dark Mode)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-sans bg-stone-200 text-stone-700">
                      {theme === 'dark' ? 'অন' : 'অফ'}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500">রাতের বেলায় চোখের আরামদায়ক ডার্ক থিম</div>
                </div>
              </div>

              {/* iOS / Modern Switch Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                  theme === 'dark' ? 'bg-indigo-600' : 'bg-stone-300'
                }`}
                title="ডার্ক মোড অন বা অফ করুন"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* PWA App Install Banner */}
          <div className="pt-1">
            <PWAInstallButton />
          </div>

          {/* APK & Android Native Ready Info */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/80 text-xs text-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span>Android APK Ready (১০০% ফাংশনাল)</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              এই অ্যাপটি Website 2 APK, Capacitor বা WebView দিয়ে সরাসরি APK ফাইলে রূপান্তরযোগ্য। ব্যাক বাটন নেভিগেশন, স্ক্রিন ওয়েক-লক, স্টাডি টাইমার ও অ্যালার্ম অফলাইনেও সম্পূর্ণ কার্যকর থাকবে।
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="/api/download/apk"
                download="HSC_Tracker.apk"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-97 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>HSC_Tracker.apk ডাউনলোড</span>
              </a>

              <button
                type="button"
                onClick={() => setIsApkGuideOpen(true)}
                className="py-2 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-97 border border-stone-200 shadow-2xs"
              >
                <span>নিয়মাবলী</span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-950 text-white font-semibold text-sm hover:bg-slate-900 active:scale-98 transition shadow-xs flex items-center justify-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>তথ্য সংরক্ষিত হয়েছে!</span>
                </>
              ) : (
                <span>প্রোফাইল আপডেট করুন</span>
              )}
            </button>
          </div>
        </form>

        {/* Data Management Footer */}
        <div className="mt-6 pt-4 border-t border-stone-100 space-y-2">
          <button
            onClick={handleExportData}
            className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>প্রোগ্রেস ডেটা ব্যাকআপ ডাউনলোড করুন</span>
          </button>

          <button
            onClick={() => {
              if (confirm('আপনার সকল অগ্রগতি ও কাস্টম অধ্যায় রিসেট করতে চান? এটি রিভার্স করা যাবে না।')) {
                resetAllData();
                setIsProfileOpen(false);
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>সকল ডেটা রিসেট করুন (ডিফল্ট সিলেবাসে ফিরুন)</span>
          </button>
        </div>

        {/* APK Conversion Guide Modal */}
        <ApkGuideModal
          isOpen={isApkGuideOpen}
          onClose={() => setIsApkGuideOpen(false)}
        />
      </div>
    </div>
  );
};
