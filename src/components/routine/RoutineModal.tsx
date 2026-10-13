import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectSelectModal } from '../common/SubjectSelectModal';
import { DayOfWeek } from '../../types';
import { toBengaliNumber } from '../../utils/bengali';
import { X, ChevronDown, Check, Bell, Clock, Calendar } from 'lucide-react';

interface RoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: DayOfWeek;
}

const STUDY_TYPES = [
  'অধ্যায় পড়া',
  'রিভিশন',
  'MCQ Practice',
  'CQ Practice',
  'Formula Revision',
  'Mock Test',
  'Problem Solving',
];

const ALL_DAYS: DayOfWeek[] = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'প্রতিদিন'];

export const RoutineModal: React.FC<RoutineModalProps> = ({ isOpen, onClose, day }) => {
  const { subjects, addRoutine } = useApp();

  const getInitialRawTime = () => {
    const now = new Date();
    // Default to next minute
    now.setMinutes(now.getMinutes() + 2);
    const pad = (n: number) => (n < 10 ? '0' + n : String(n));
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<DayOfWeek>(day);
  const [rawTime, setRawTime] = useState<string>(getInitialRawTime);
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'phy-1');
  const [activityType, setActivityType] = useState('অধ্যায় পড়া');
  const [chapterTitle, setChapterTitle] = useState('');
  const [note, setNote] = useState('');
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  useEffect(() => {
    setSelectedDayOfWeek(day);
    setRawTime(getInitialRawTime());
  }, [day, isOpen]);

  if (!isOpen) return null;

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  // Generate friendly display string from rawTime (e.g. "০৭:০০ AM - ০৮:৩০ AM")
  const formatSlotTimeDisplay = (time24: string, duration: number) => {
    const [hStr, mStr] = time24.split(':');
    const startH = parseInt(hStr || '7', 10);
    const startM = parseInt(mStr || '0', 10);

    const totalStartMinutes = startH * 60 + startM;
    const totalEndMinutes = (totalStartMinutes + duration) % (24 * 60);
    const endH = Math.floor(totalEndMinutes / 60);
    const endM = totalEndMinutes % 60;

    const format12 = (h: number, m: number) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      let h12 = h % 12;
      if (h12 === 0) h12 = 12;
      const pad = (n: number) => (n < 10 ? '0' + n : String(n));
      return `${toBengaliNumber(pad(h12))}:${toBengaliNumber(pad(m))} ${ampm}`;
    };

    return `${format12(startH, startM)} - ${format12(endH, endM)}`;
  };

  const slotDisplay = formatSlotTimeDisplay(rawTime, durationMinutes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRoutine({
      dayOfWeek: selectedDayOfWeek,
      startTime: slotDisplay,
      rawTime: rawTime,
      subjectId: selectedSubjectId,
      activityType,
      durationMinutes,
      chapterTitle: chapterTitle.trim() || undefined,
      note: note.trim() || undefined,
      alarmEnabled,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
        <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-stone-200/80 p-5 flex flex-col max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">রুটিনে যোগ করুন</h3>
              <p className="text-xs text-stone-500">পড়ার সময় ও অ্যালার্ম সেট করুন</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Day Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                কোন দিনের রুটিন?
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {ALL_DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDayOfWeek(d)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                      selectedDayOfWeek === d
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 border border-stone-200/60'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Picker */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>পড়ার শুরুর সময় (অ্যালার্ম টাইম)</span>
                </label>
                <span className="text-[11px] font-bold text-amber-800 font-mono">
                  {rawTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="time"
                  required
                  value={rawTime}
                  onChange={(e) => setRawTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs"
                />
              </div>

              <div className="text-[11px] font-semibold text-stone-600 flex items-center justify-between pt-1">
                <span>স্লট সময়: <strong className="text-slate-900">{slotDisplay}</strong></span>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">বিষয় (Subject)</label>
              <button
                type="button"
                onClick={() => setIsSubjectModalOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50/50 hover:bg-stone-100/50 transition text-slate-800"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: selectedSubject?.color }}
                  />
                  <span className="font-medium">{selectedSubject?.name}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {/* Activity Type */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">অধ্যয়নের ধরন (Study Type)</label>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1 bg-stone-50 rounded-xl border border-stone-100">
                {STUDY_TYPES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setActivityType(st)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold text-left transition ${
                      activityType === st
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/60'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">সময়কাল (মিনিট)</label>
              <div className="flex gap-2">
                {[30, 45, 60, 90, 120].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDurationMinutes(dur)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      durationMinutes === dur
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50'
                    }`}
                  >
                    {dur} মি.
                  </button>
                ))}
              </div>
            </div>

            {/* Chapter (optional) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">অধ্যায় (ঐচ্ছিক)</label>
              <input
                type="text"
                placeholder="যেমন: ২য় অধ্যায়: ভেক্টর"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Note (optional) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">নোট (ঐচ্ছিক)</label>
              <input
                type="text"
                placeholder="যেমন: বোর্ড প্রশ্ন সমাধান করব"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Alarm Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-700">
                  <Bell className="w-4 h-4 fill-amber-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">পড়ার সময়ে অ্যালার্ম ও সাউন্ড বাজবে</div>
                  <div className="text-[10px] text-stone-500">নির্ধারিত সময়ে স্বয়ংক্রিয় রিংটোন বাজবে</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={alarmEnabled}
                onChange={(e) => setAlarmEnabled(e.target.checked)}
                className="w-5 h-5 accent-slate-900 rounded cursor-pointer"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-950 text-white font-semibold text-sm hover:bg-slate-900 active:scale-98 transition shadow-xs flex items-center justify-center gap-2"
              >
                <span>রুটিনে যোগ করো</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <SubjectSelectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        selectedSubjectId={selectedSubjectId}
        onSelect={(id) => setSelectedSubjectId(id)}
      />
    </>
  );
};
