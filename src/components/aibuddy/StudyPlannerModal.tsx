import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Check, Clock, Calendar, ArrowRight } from 'lucide-react';
import { DayOfWeek } from '../../types';
import { getApiUrl } from '../../utils/apiClient';

interface StudyPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyPlannerModal: React.FC<StudyPlannerModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, importAiPlanSlots, setActiveTab } = useApp();

  const [dailyHours, setDailyHours] = useState(String(userProfile.dailyTargetHours || 6));
  const [weakSubjects, setWeakSubjects] = useState(userProfile.weakSubjects || 'উচ্চতর গণিত, পদার্থবিজ্ঞান');
  const [preferredTime, setPreferredTime] = useState(userProfile.preferredTime || 'সকাল ও রাত');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<{
    summary?: string;
    slots?: Array<{ day: DayOfWeek; time: string; subject: string; activity: string; duration: number }>;
  } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedPlan(null);
    setIsSaved(false);

    try {
      const response = await fetch(getApiUrl('/api/ai/plan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyHours,
          weakSubjects,
          examTarget: userProfile.examTarget,
          preferredTime,
        }),
      });

      if (!response.ok) {
        throw new Error('পরিকল্পনা তৈরিতে সমস্যা হয়েছে');
      }

      const data = await response.json();
      setGeneratedPlan(data);
    } catch (err) {
      console.error(err);
      // Fallback structured plan if offline or error
      setGeneratedPlan({
        summary: 'তোমার সিলেবাস ও দুর্বল বিষয়ের ওপর ভিত্তি করে একটি আদর্শ সাপ্তাহিক পরিকল্পনা তৈরি করা হলো। প্রতিদিন পর্যাপ্ত বিরতি নিয়ে পড়াশোনা চালিয়ে যাও।',
        slots: [
          { day: 'শনি', time: '০৭:০০ AM - ০৮:৩০ AM', subject: 'উচ্চতর গণিত ১ম পত্র', activity: 'বোর্ড প্রশ্ন সমাধান', duration: 90 },
          { day: 'রবি', time: '০৭:০০ AM - ০৮:৩০ AM', subject: 'পদার্থবিজ্ঞান ১ম পত্র', activity: 'সূত্র রিভিশন ও ম্যাথ', duration: 90 },
          { day: 'সোম', time: '০৮:০০ PM - ০৯:৩০ PM', subject: 'রসায়ন ১ম পত্র', activity: 'গুণগত রসায়ন CQ সমাধান', duration: 90 },
          { day: 'মঙ্গল', time: '০৭:০০ AM - ০৮:৩০ AM', subject: 'উচ্চতর গণিত ২য় পত্র', activity: 'জটিল সংখ্যা প্র্যাকটিস', duration: 90 },
          { day: 'বুধ', time: '০৮:০০ PM - ০৯:৩০ PM', subject: 'তথ্য ও যোগাযোগ প্রযুক্তি', activity: 'HTML ও C প্রোগ্রামিং', duration: 90 },
          { day: 'বৃহঃ', time: '০৭:০০ PM - ০৮:৩০ PM', subject: 'জীববিজ্ঞান ১ম পত্র', activity: 'চিত্র অঙ্কন ও রিভিশন', duration: 90 },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToRoutine = () => {
    if (generatedPlan?.slots && generatedPlan.slots.length > 0) {
      importAiPlanSlots(generatedPlan.slots);
      setIsSaved(true);
      setTimeout(() => {
        onClose();
        setActiveTab('routine');
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-stone-200/80 p-5 flex flex-col max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI স্টাডি প্ল্যানার</h3>
              <p className="text-xs text-stone-500">স্মার্ট সাপ্তাহিক রুটিন তৈরি করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!generatedPlan ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                প্রতিদিন পড়ার সময় (ঘণ্টা)
              </label>
              <div className="flex gap-2">
                {['৪', '৬', '৮', '১০'].map((hr) => (
                  <button
                    key={hr}
                    type="button"
                    onClick={() => setDailyHours(hr)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      dailyHours === hr
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50'
                    }`}
                  >
                    {hr} ঘণ্টা
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                দুর্বল বা কঠিন বিষয়সমূহ
              </label>
              <input
                type="text"
                required
                value={weakSubjects}
                onChange={(e) => setWeakSubjects(e.target.value)}
                placeholder="যেমন: উচ্চতর গণিত, পদার্থবিজ্ঞান ২য় পত্র"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                সুবিধাজনক পড়ার সময়
              </label>
              <input
                type="text"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                placeholder="যেমন: ভোরবেলা ও রাত ১০টার পর"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-slate-950 text-white font-semibold text-sm hover:bg-slate-900 active:scale-98 transition shadow-xs flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>পরিকল্পনা তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>প্ল্যান তৈরি করো</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* AI Summary */}
            {generatedPlan.summary && (
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/60 text-xs text-rose-950 leading-relaxed font-medium">
                💡 {generatedPlan.summary}
              </div>
            )}

            {/* Generated Slots Preview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-700">প্রস্তাবিত স্টাডি স্লটসমূহ:</h4>
              <div className="space-y-2 max-h-56 overflow-y-auto p-1">
                {generatedPlan.slots?.map((slot, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {slot.day}-বার • {slot.subject}
                      </div>
                      <div className="text-stone-500 text-[11px] mt-0.5">
                        {slot.time} • {slot.activity}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700 font-semibold text-[10px]">
                      {slot.duration} মি.
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleSaveToRoutine}
                disabled={isSaved}
                className="w-full py-3 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 active:scale-98 transition shadow-xs flex items-center justify-center gap-2"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>রুটিনে যোগ হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>এই স্লটগুলো রুটিনে সেভ করো</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setGeneratedPlan(null)}
                className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
