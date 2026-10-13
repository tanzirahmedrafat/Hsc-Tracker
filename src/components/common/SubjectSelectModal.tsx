import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check } from 'lucide-react';

interface SubjectSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubjectId: string;
  onSelect: (subjectId: string) => void;
  title?: string;
}

export const SubjectSelectModal: React.FC<SubjectSelectModalProps> = ({
  isOpen,
  onClose,
  selectedSubjectId,
  onSelect,
  title = 'বিষয় বাছাই করুন',
}) => {
  const { subjects, subjectProgressMap } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-stone-200/80 max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-stone-500">তোমার অধ্যয়নের বিষয়টি নির্বাচন করো</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-3 overflow-y-auto space-y-1.5 flex-1">
          {subjects.map((sub) => {
            const isSelected = sub.id === selectedSubjectId;
            const progress = subjectProgressMap[sub.id];

            return (
              <button
                key={sub.id}
                onClick={() => {
                  onSelect(sub.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900/5 ring-1 ring-slate-900'
                    : 'border-stone-200/80 hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: sub.color }}
                  >
                    {sub.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{sub.name}</div>
                    <div className="text-[11px] text-stone-500">
                      {progress?.completedChapters || 0}/{progress?.totalChapters || 0} অধ্যায় ({progress?.percentage || 0}%)
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-stone-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
