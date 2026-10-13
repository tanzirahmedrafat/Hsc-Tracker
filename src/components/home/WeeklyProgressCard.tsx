import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { toBengaliNumber } from '../../utils/bengali';
import { TrendingUp, Award, Calendar, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

interface ChartPoint {
  dayLabel: string;
  fullDay: string;
  dateStr: string;
  hours: number;
  minutes: number;
  isToday: boolean;
  targetMet: boolean;
}

const BENGALI_DAY_NAMES: Record<number, string> = {
  0: 'রবি',
  1: 'সোম',
  2: 'মঙ্গল',
  3: 'বুধ',
  4: 'বৃহঃ',
  5: 'শুক্র',
  6: 'শনি',
};

export const WeeklyProgressCard: React.FC = () => {
  const { userProfile, todayStudySeconds } = useApp();

  const targetHours = userProfile.dailyTargetHours || 6;
  const targetSeconds = targetHours * 3600;

  // Compute past 7 days study hours
  const { chartData, totalWeekHours, averageDailyHours, maxDay, targetsMetCount } = useMemo(() => {
    // Read studySessions from localStorage directly or default
    let sessions: any[] = [];
    try {
      const saved = localStorage.getItem('hsc_tracker_sessions_v1');
      if (saved) {
        sessions = JSON.parse(saved);
      }
    } catch {
      sessions = [];
    }

    const todayDate = new Date();
    const todayDateStr = todayDate.toISOString().split('T')[0];

    // Group sessions by date
    const dateMap: Record<string, number> = {};
    sessions.forEach((s: any) => {
      dateMap[s.date] = (dateMap[s.date] || 0) + s.durationSeconds;
    });
    // Add today's live elapsed seconds
    dateMap[todayDateStr] = todayStudySeconds;

    const points: ChartPoint[] = [];
    let totalSec = 0;
    let maxSec = 0;
    let maxPointName = '';
    let metCount = 0;

    // Generate last 7 days from (today - 6) to today
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayIdx = d.getDay();
      const dayLabel = BENGALI_DAY_NAMES[dayIdx] || '';
      const isToday = dStr === todayDateStr;

      const daySec = isToday ? todayStudySeconds : (dateMap[dStr] || 0);
      const hours = Math.round((daySec / 3600) * 10) / 10;
      const minutes = Math.round((daySec % 3600) / 60);

      totalSec += daySec;
      if (daySec >= targetSeconds || daySec >= 3 * 3600) {
        metCount++;
      }

      if (daySec > maxSec) {
        maxSec = daySec;
        maxPointName = `${dayLabel} (${toBengaliNumber(hours)} ঘণ্টা)`;
      }

      points.push({
        dayLabel: isToday ? `${dayLabel} (আজ)` : dayLabel,
        fullDay: dayLabel,
        dateStr: dStr,
        hours,
        minutes,
        isToday,
        targetMet: daySec >= targetSeconds,
      });
    }

    const totalHours = Math.round((totalSec / 3600) * 10) / 10;
    const avgHours = Math.round((totalHours / 7) * 10) / 10;

    return {
      chartData: points,
      totalWeekHours: totalHours,
      averageDailyHours: avgHours,
      maxDay: maxPointName || 'আজ',
      targetsMetCount: metCount,
    };
  }, [todayStudySeconds, targetHours, targetSeconds]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: ChartPoint = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-stone-200 text-xs">
          <div className="font-bold text-slate-900 flex items-center justify-between gap-2 border-b border-stone-100 pb-1 mb-1.5">
            <span>{data.fullDay}-বার {data.isToday && '• আজ'}</span>
            <span className="text-[10px] text-stone-400 font-mono">{data.dateStr}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-stone-500">পড়া হয়েছে:</span>
              <span className="font-extrabold text-slate-900 font-sans">
                {toBengaliNumber(data.hours)} ঘণ্টা
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-stone-500">দৈনিক লক্ষ্য:</span>
              <span className="font-medium text-stone-600 font-sans">
                {toBengaliNumber(targetHours)} ঘণ্টা
              </span>
            </div>
            <div className="pt-1 mt-1 border-t border-stone-100">
              {data.targetMet ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  লক্ষ্য পূরণ হয়েছে!
                </span>
              ) : (
                <span className="text-stone-500 text-[11px]">
                  লক্ষ্য থেকে {toBengaliNumber(Math.max(0, Math.round((targetHours - data.hours) * 10) / 10))} ঘণ্টা বাকি
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl bg-white p-5 border border-stone-200/80 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-2xs">
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">সাপ্তাহিক অগ্রগতি</h2>
            <p className="text-[11px] text-stone-500 font-medium">গত ৭ দিনের পড়ার ট্রেন্ড</p>
          </div>
        </div>

        {/* Total weekly hours pill */}
        <div className="px-3 py-1 rounded-full bg-stone-100 border border-stone-200/70 text-xs font-bold text-slate-800">
          মোট: <span className="font-sans text-rose-800">{toBengaliNumber(totalWeekHours)}</span> ঘণ্টা
        </div>
      </div>

      {/* Line Chart */}
      <div className="w-full h-48 -ml-1 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="dayLabel"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              unit="h"
              domain={[0, Math.max(targetHours + 2, 8)]}
            />
            {/* Target line */}
            <ReferenceLine
              y={targetHours}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#0f172a"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#0f172a', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#be123c', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Stats Footer */}
      <div className="pt-2 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/60">
          <div className="text-[10px] text-stone-500 font-medium">দৈনিক গড়</div>
          <div className="font-black text-slate-900 font-sans text-sm mt-0.5">
            {toBengaliNumber(averageDailyHours)} ঘণ্টা
          </div>
        </div>

        <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/60">
          <div className="text-[10px] text-stone-500 font-medium">সর্বোচ্চ পড়ার দিন</div>
          <div className="font-bold text-slate-900 text-xs mt-0.5 truncate">
            {maxDay}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/60">
          <div className="text-[10px] text-stone-500 font-medium">লক্ষ্য পূরণ</div>
          <div className="font-black text-rose-800 font-sans text-sm mt-0.5">
            {toBengaliNumber(targetsMetCount)}/৭ দিন
          </div>
        </div>
      </div>
    </div>
  );
};
