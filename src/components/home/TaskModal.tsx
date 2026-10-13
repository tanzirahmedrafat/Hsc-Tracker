import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectSelectModal } from '../common/SubjectSelectModal';
import { X, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Priority } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
  const { subjects, addTask } = useApp();
  const [title, setTitle] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'phy-1');
  const [priority, setPriority] = useState<Priority>('medium');
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  if (!isOpen) return null;

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title.trim(), selectedSubjectId, priority);
    setTitle('');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
        <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-stone-200/80 p-5 flex flex-col animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <h3 className="text-base font-bold text-slate-900">নতুন টাস্ক যোগ করুন</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">টাস্কের বিবরণ</label>
              <input
                type="text"
                required
                placeholder="যেমন: ভেক্টর ডট ও ক্রস গুণন সমাধান"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">বিষয়</label>
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

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">অগ্রাধিকার (Priority)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'কম', color: 'border-emerald-300 text-emerald-800 bg-emerald-50/50' },
                  { id: 'medium', label: 'মাঝারি', color: 'border-amber-300 text-amber-800 bg-amber-50/50' },
                  { id: 'high', label: 'বেশি', color: 'border-rose-300 text-rose-800 bg-rose-50/50' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id as Priority)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      priority === p.id
                        ? `${p.color} ring-1 ring-current font-bold`
                        : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-950 text-white font-semibold text-sm hover:bg-slate-900 active:scale-98 transition shadow-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>টাস্ক সংরক্ষণ করুন</span>
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
