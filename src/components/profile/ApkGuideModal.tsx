import React, { useState } from 'react';
import { X, Smartphone, Copy, Check, ExternalLink, Download, Layers, ShieldCheck } from 'lucide-react';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'webintoapp' | 'website2apk'>('pwa');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const appUrl =
    typeof window !== 'undefined' && window.location.href
      ? window.location.origin
      : 'https://ais-pre-nvfialwb3mtxy3un4e3w4z-310930086419.asia-east1.run.app';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4.5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">অ্যান্ড্রয়েড অ্যাপ (APK) রূপান্তর গাইড</h3>
              <p className="text-[11px] text-stone-300">প্রপারলি ফোনে অ্যাপ হিসেবে চালানোর ৩টি সেরা উপায়</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live URL Copy Box */}
        <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-2 text-xs">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-stone-500 block font-medium">তোমার অ্যাপের লাইভ লিংক:</span>
            <div className="font-mono text-slate-900 text-xs truncate select-all">{appUrl}</div>
          </div>
          <button
            onClick={handleCopyUrl}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition active:scale-95 flex items-center gap-1.5 shrink-0 shadow-2xs"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'কপি হয়েছে!' : 'লিংক কপি'}</span>
          </button>
        </div>

        {/* Direct APK Download Banner */}
        <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">ফুল APK ফাইল (Direct Download)</div>
              <div className="text-[10px] text-stone-500">HSC_Tracker.apk ব্যাকএন্ড থেকে জেনারেট করা</div>
            </div>
          </div>

          <a
            href="/api/download/apk"
            download="HSC_Tracker.apk"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition active:scale-95 flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>APK ডাউনলোড</span>
          </a>
        </div>

        {/* Method Switcher Tabs */}
        <div className="flex items-center p-1.5 bg-stone-100 border-b border-stone-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2 rounded-xl transition text-center ${
              activeTab === 'pwa'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            ১. ১-ক্লিক ইনস্টল (সেরা)
          </button>
          <button
            onClick={() => setActiveTab('webintoapp')}
            className={`flex-1 py-2 rounded-xl transition text-center ${
              activeTab === 'webintoapp'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            ২. ফ্রি অনলাইন APK
          </button>
          <button
            onClick={() => setActiveTab('website2apk')}
            className={`flex-1 py-2 rounded-xl transition text-center ${
              activeTab === 'website2apk'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            ৩. অফলাইন APK টুল
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-800">
          {activeTab === 'pwa' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>গুগলের অফিসিয়াল ও সবচেয়ে সহজ পদ্ধতি (০ MB সাইজ)</span>
                </div>
                <p className="text-[11px] mt-1 text-emerald-800 leading-relaxed">
                  কোনো সফটওয়্যার বা কনভার্টার ছাড়াই আপনার মোবাইল ব্রাউজার থেকেই এটি সরাসরি ফোনে ইনস্টল করা যায়। ফুলস্ক্রিন চলে, অফলাইনে ক্যাশ থাকে এবং কোনো ব্রাউজার বার থাকে না।
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">ধাপসমূহ:</h4>
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    ১
                  </span>
                  <div>
                    <strong>Chrome ব্রাউজারে খুলুন:</strong> আপনার অ্যান্ড্রয়েড ফোনে Chrome বা Edge ব্রাউজারে এই লিংকটি ওপেন করুন।
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    ২
                  </span>
                  <div>
                    <strong>মেনু চাপুন:</strong> ব্রাউজারের উপরে ডানপাশের ৩টি ডট (<strong>⋮</strong>) মেনুতে ট্যাপ করুন।
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    ৩
                  </span>
                  <div>
                    <strong>"Install app" চাপুন:</strong> মেনু থেকে <em>"Install app"</em> (অথবা <em>"Add to Home screen"</em>) সিলেক্ট করে <strong>Install</strong> কনফার্ম করুন।
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    ৪
                  </span>
                  <div>
                    <strong>সম্পন্ন!</strong> অ্যাপটি আপনার ফোনের অ্যাপ ড্রয়ারে আইকনসহ ইনস্টল হয়ে যাবে এবং কোনো ব্রাউজার বার ছাড়া ফুল-স্ক্রিনে ওপেন হবে।
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webintoapp' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950">
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-indigo-700" />
                  <span>সরাসরি .apk ফাইল ডাউনলোড করার ফ্রি পদ্ধতি</span>
                </div>
                <p className="text-[11px] mt-1 text-indigo-800 leading-relaxed">
                  আপনি যদি আপনার বন্ধুদের ব্লুটুথ বা হোয়াটসঅ্যাপে দেওয়ার মতো একটি আসল <code>.apk</code> ইনস্টলার ফাইল চান, তবে অনলাইন ফ্রি টুল দিয়ে ১ মিনিটে তৈরি করতে পারবেন।
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">ধাপসমূহ:</h4>
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    ১
                  </span>
                  <div>
                    যেকোনো ফ্রি APK মেকার সাইটে যান (যেমন: <strong>webintoapp.com</strong> অথবা <strong>appsgeyser.com</strong>)।
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    ২
                  </span>
                  <div>
                    <strong>URL দিন:</strong> "Enter your Website URL" বক্সে আপনার অ্যাপের কপি করা লিংকটি পেস্ট করুন।
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    ৩
                  </span>
                  <div>
                    <strong>App Name ও Icon:</strong> নাম দিন <code>HSC Tracker</code> এবং আইকন সিলেক্ট করুন।
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    ৪
                  </span>
                  <div>
                    <strong>"Generate APK" চাপুন:</strong> জেনারেট সম্পন্ন হলে সরাসরি <code>HSC_Tracker.apk</code> ফাইল ডাউনলোড করে ফোনে ইনস্টল করুন।
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'website2apk' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-700" />
                  <span>প্রফেশনাল ১০০% অফলাইন APK বিল্ডার (PC সফটওয়্যার)</span>
                </div>
                <p className="text-[11px] mt-1 text-amber-800 leading-relaxed">
                  কম্পিউটার থেকে <strong>Website 2 APK Builder</strong> বা <strong>Capacitor</strong> ব্যবহার করে লোকাল ফাইল দিয়ে সাইন করা প্রফেশনাল APK ও AAB ফাইল তৈরি করা যায়।
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">যে সেটিংসগুলো অন রাখবেন:</h4>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] space-y-1.5 leading-relaxed">
                  <div>✅ <strong>Offline Cache:</strong> Enable (যাতে অফলাইনেও চলে)</div>
                  <div>✅ <strong>Orientation:</strong> Portrait (উল্লম্ব)</div>
                  <div>✅ <strong>Hardware Back Button:</strong> Enabled (আমাদের কোডে বিল্ট-ইন হ্যান্ডেল করা আছে)</div>
                  <div>✅ <strong>Permissions:</strong> Vibration ও Notification টিক দিন</div>
                </div>
              </div>
            </div>
          )}

          {/* Golden Tip */}
          <div className="p-3 rounded-2xl bg-slate-950 text-white text-[11px] leading-relaxed">
            <span className="text-amber-300 font-bold">💡 আমাদের পরামর্শ:</span> আপনার নিজের পড়ার সুবিধার জন্য <strong>১ম পদ্ধতি (১-ক্লিক ইনস্টল)</strong> ব্যবহার করাই সবচেয়ে দ্রুত ও কার্যকর। এটি কোনো কনভার্টারের ঝামেলা ছাড়াই ফোন মেমোরিতে মাত্র কয়েক কিলোবাইটে নিখুঁত নেটিভ অ্যাপ হয়ে যায়!
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-900 transition active:scale-98"
          >
            বুঝেছি, গাইড বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
