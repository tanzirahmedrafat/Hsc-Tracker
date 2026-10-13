import React from 'react';
import { DayOfWeek } from '../../types';

interface DaySelectorProps {
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
}

const DAYS: DayOfWeek[] = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র'];

export const DaySelector: React.FC<DaySelectorProps> = ({ selectedDay, onSelectDay }) => {
  return (
    <div className="py-2 overflow-x-auto no-scrollbar flex items-center gap-2 px-1">
      {DAYS.map((day) => {
        const isSelected = selectedDay === day;

        return (
          <button
            key={day}
            onClick={() => onSelectDay(day)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 ${
              isSelected
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-slate-900 border border-stone-200/80 hover:border-stone-300'
            }`}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
};
