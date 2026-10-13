import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Chapter } from '../../types';
import { X, Plus, Save } from 'lucide-react';

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
  chapterToEdit?: Chapter | null;
}

export const ChapterModal: React.FC<ChapterModalProps> = ({
  isOpen,
  onClose,
  subjectId,
  chapterToEdit,
}) => {
  const { addChapter, editChapter, chapters } = useApp();

  const nextDefaultNo =
    chapterToEdit?.chapterNo ||
    chapters.filter((c) => c.subjectId === subjectId).length + 1;

  const [chapterNo, setChapterNo] = useState<number>(nextDefaultNo);
  const [title, setTitle] = useState(chapterToEdit?.title || '');
  const [description, setDescription] = useState(chapterToEdit?.description || '');
  const [notes, setNotes] = useState(chapterToEdit?.notes || '');

  // Reset or initialize on open
  React.useEffect(() => {
    if (chapterToEdit) {
      setChapterNo(chapterToEdit.chapterNo);
      setTitle(chapterToEdit.title);
      setDescription(chapterToEdit.description || '');
      setNotes(chapterToEdit.notes || '');
    } else {
      const nextNo = chapters.filter((c) => c.subjectId === subjectId).length + 1;
      setChapterNo(nextNo);
      setTitle('');
      setDescription('');
      setNotes('');
    }
  }, [chapterToEdit, subjectId, chapters]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (chapterToEdit) {
      editChapter(chapterToEdit.id, {
        chapterNo: Number(chapterNo),
        title: title.trim(),
        description: description.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      addChapter(subjectId, title.trim(), Number(chapterNo), description.trim() || undefined);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-stone-200/80 p-5 flex flex-col max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <h3 className="text-base font-bold text-slate-900">
            {chapterToEdit ? 'অধ্যায় সম্পাদনা' : 'নতুন অধ্যায় যোগ করুন'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">অধ্যায় নম্বর</label>
            <input
              type="number"
              min="1"
              required
              value={chapterNo}
              onChange={(e) => setChapterNo(parseInt(e.target.value, 10) || 1)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">অধ্যায়ের নাম</label>
            <input
              type="text"
              required
              placeholder="যেমন: ৩য় অধ্যায়: গতিবিদ্যা"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)</label>
            <input
              type="text"
              placeholder="যেমন: প্রাসের গতি, একমাত্রিক ও দ্বিমাত্রিক গতি"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">ব্যক্তিগত নোট বা টার্গেট (ঐচ্ছিক)</label>
            <textarea
              rows={2}
              placeholder="যেমন: টেস্ট পেপারের শীর্ষ ৫ কলেজের CQ শেষ করতে হবে"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-950 text-white font-semibold text-sm hover:bg-slate-900 active:scale-98 transition shadow-xs flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
