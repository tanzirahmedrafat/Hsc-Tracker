import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskModal } from './TaskModal';
import { Plus, Check, Trash2, Tag } from 'lucide-react';
import { Priority } from '../../types';

export const TodayTasks: React.FC = () => {
  const { tasks, toggleTask, deleteTask, subjects } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const priorityBadge = (p: Priority) => {
    switch (p) {
      case 'high':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">বেশি</span>;
      case 'medium':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">মাঝারি</span>;
      case 'low':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">কম</span>;
    }
  };

  return (
    <>
      <div className="rounded-3xl bg-white p-5 border border-stone-200/80 shadow-2xs">
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">আজকের টাস্ক</h2>
            {tasks.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center">
                {tasks.filter((t) => !t.completed).length}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-95 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ যোগ করুন</span>
          </button>
        </div>

        {/* Task list or empty state */}
        {tasks.length === 0 ? (
          <div className="py-8 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
            <p className="text-sm font-medium text-stone-500">আজকের জন্য কোনো টাস্ক নেই</p>
            <p className="text-xs text-stone-400 mt-1">পড়াশোনার লক্ষ্য ঠিক করতে উপরে "+ যোগ করুন" চাপুন</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasks.map((task) => {
              const sub = subjects.find((s) => s.id === task.subjectId);

              return (
                <div
                  key={task.id}
                  className={`group flex items-start gap-3 p-3 rounded-2xl border transition ${
                    task.completed
                      ? 'bg-stone-50/80 border-stone-200/60 opacity-75'
                      : 'bg-white border-stone-200/90 hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  {/* Custom Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition active:scale-90 shrink-0 ${
                      task.completed
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'border-stone-300 hover:border-slate-800 bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium leading-snug break-words ${
                        task.completed ? 'line-through text-stone-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {sub && (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${sub.color}15`,
                            color: sub.color,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: sub.color }}
                          />
                          {sub.name}
                        </span>
                      )}

                      {priorityBadge(task.priority)}
                    </div>
                  </div>

                  {/* Delete action */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-60 group-hover:opacity-100 p-1 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="টাস্ক মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
