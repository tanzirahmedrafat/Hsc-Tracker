import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (compact) {
      return (
        <button
          onClick={install}
          title="অ্যাপ ইনস্টল করুন"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900 text-white hover:bg-slate-800 transition active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ইনস্টল</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-sm transition active:scale-98"
      >
        <Download className="w-4 h-4" />
        <span>অ্যাপ হিসেবে ফোনে ইনস্টল করুন</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        {compact ? (
          <button
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>ইনস্টল</span>
          </button>
        ) : (
          <button
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm font-medium hover:bg-stone-50 transition"
          >
            <Share2 className="w-4 h-4 text-rose-600" />
            <span>iPhone / iPad-এ ইনস্টল করুন</span>
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-stone-900">iPhone-এ হোম স্ক্রিনে যোগ করুন</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="text-xs text-stone-600 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-rose-700 bg-rose-50 rounded-full w-5 h-5 flex items-center justify-center shrink-0">১</span>
                  <span>সাফারি ব্রাউজারের নিচে থাকা <strong>Share (শেয়ার)</strong> আইকনে চাপ দিন।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-rose-700 bg-rose-50 rounded-full w-5 h-5 flex items-center justify-center shrink-0">২</span>
                  <span>একটু নিচে স্ক্রোল করে <strong>Add to Home Screen</strong> নির্বাচন করুন।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-rose-700 bg-rose-50 rounded-full w-5 h-5 flex items-center justify-center shrink-0">৩</span>
                  <span>উপরে ডানপাশে <strong>Add</strong> বাটনে ট্যাপ করলে অ্যাপটি ইনস্টল হয়ে যাবে!</span>
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                বুঝেছি
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
