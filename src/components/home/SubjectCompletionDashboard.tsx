import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { toBengaliNumber } from '../../utils/bengali';
import { BarChart3, ChevronRight, Sparkles, AlertCircle, CheckCircle2, Trophy } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

type SubjectCategory = 'all' | 'science' | 'general';

interface ChartItem {
  id: string;
  name: string;
  shortName: string;
  percentage: number;
  completed: number;
  total: number;
  color: string;
  category: 'science' | 'general';
}

const SHORT_NAMES: Record<string, string> = {
  'bangla-1': 'বাংলা ১ম',
  'bangla-2': 'বাংলা ২য়',
  'eng-1': 'ইংরেজি ১ম',
  'eng-2': 'ইংরেজি ২য়',
  'ict': 'ICT',
  'phy-1': 'পদার্থ ১ম',
  'phy-2': 'পদার্থ ২য়',
  'chem-1': 'রসায়ন ১ম',
  'chem-2': 'রসায়ন ২য়',
  'hmath-1': 'উচ্চতর গণিত ১ম',
  'hmath-2': 'উচ্চতর গণিত ২য়',
  'bio-1': 'জীববিজ্ঞান ১ম',
  'bio-2': 'জীববিজ্ঞান ২য়',
};

const SCIENCE_IDS = new Set([
  'phy-1',
  'phy-2',
  'chem-1',
  'chem-2',
  'hmath-1',
  'hmath-2',
  'bio-1',
  'bio-2',
]);

export const SubjectCompletionDashboard: React.FC = () => {
  const { subjects, subjectProgressMap, setSelectedTrackerSubjectId, setActiveTab } = useApp();
  const [activeCategory, setActiveCategory] = useState<SubjectCategory>('all');

  // Process and sort chart data
  const { allData, filteredData, topSubject, lowestSubject, averagePercentage } = useMemo(() => {
    const list: ChartItem[] = subjects.map((sub) => {
      const prog = subjectProgressMap[sub.id] || { totalChapters: 0, completedChapters: 0, percentage: 0 };
      const isScience = SCIENCE_IDS.has(sub.id);

      return {
        id: sub.id,
        name: sub.name,
        shortName: SHORT_NAMES[sub.id] || sub.name,
        percentage: prog.percentage,
        completed: prog.completedChapters,
        total: prog.totalChapters,
        color: sub.color,
        category: isScience ? 'science' : 'general',
      };
    });

    const filtered = list.filter((item) => {
      if (activeCategory === 'science') return item.category === 'science';
      if (activeCategory === 'general') return item.category === 'general';
      return true;
    });

    // Stats calculations
    const sorted = [...list].sort((a, b) => b.percentage - a.percentage);
    const top = sorted[0];
    const lowest = sorted[sorted.length - 1];
    const avg = Math.round(list.reduce((sum, item) => sum + item.percentage, 0) / (list.length || 1));

    return {
      allData: list,
      filteredData: filtered,
      topSubject: top,
      lowestSubject: lowest,
      averagePercentage: avg,
    };
  }, [subjects, subjectProgressMap, activeCategory]);

  const handleNavigateToSubject = (subjectId: string) => {
    setSelectedTrackerSubjectId(subjectId);
    setActiveTab('tracker');
  };

  // Custom Tooltip for recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: ChartItem = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-stone-200 text-xs max-w-56">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-stone-100 pb-1.5 mb-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: data.color }}
            />
            <span className="truncate">{data.name}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-stone-500">সিলেবাস সম্পন্ন:</span>
              <span className="font-extrabold text-slate-900 font-sans text-sm">
                {toBengaliNumber(data.percentage)}%
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-[11px] text-stone-500">
              <span>অধ্যায় অনুপাত:</span>
              <span className="font-semibold text-stone-700 font-sans">
                {toBengaliNumber(data.completed)} / {toBengaliNumber(data.total)}
              </span>
            </div>

            <div className="pt-1.5 mt-1 border-t border-stone-100 text-[10px] text-rose-800 font-bold flex items-center gap-1">
              <span>ট্র্যাকারে দেখতে ট্যাপ করো</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Adjust chart height dynamically based on number of items
  const chartHeight = Math.max(220, filteredData.length * 34);

  return (
    <div className="rounded-3xl bg-white p-5 border border-stone-200/80 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-2xs">
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">বিষয়ভিত্তিক অগ্রগতি ড্যাশবোর্ড</h2>
            <p className="text-[11px] text-stone-500 font-medium">HSC প্রতিটি বিষয়ের সিলেবাস সমাপ্তি শতকরা হার</p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
            activeCategory === 'all'
              ? 'bg-slate-950 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 border border-stone-200/60'
          }`}
        >
          সব বিষয় ({toBengaliNumber(allData.length)})
        </button>

        <button
          onClick={() => setActiveCategory('science')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
            activeCategory === 'science'
              ? 'bg-slate-950 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 border border-stone-200/60'
          }`}
        >
          বিজ্ঞান গ্রুপ ({toBengaliNumber(8)})
        </button>

        <button
          onClick={() => setActiveCategory('general')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
            activeCategory === 'general'
              ? 'bg-slate-950 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 border border-stone-200/60'
          }`}
        >
          ভাষা ও ICT ({toBengaliNumber(5)})
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/60">
          <div className="text-[10px] text-stone-500 font-medium">গড় সমাপ্তি</div>
          <div className="font-black text-slate-900 font-sans text-sm mt-0.5">
            {toBengaliNumber(averagePercentage)}%
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/60">
          <div className="text-[10px] text-stone-500 font-medium">সর্বোচ্চ অগ্রগতি</div>
          <div className="font-bold text-emerald-800 text-xs mt-0.5 truncate" title={topSubject?.name}>
            {topSubject?.shortName} ({toBengaliNumber(topSubject?.percentage || 0)}%)
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/60">
          <div className="text-[10px] text-stone-500 font-medium">মনোযোগ প্রয়োজন</div>
          <div className="font-bold text-rose-800 text-xs mt-0.5 truncate" title={lowestSubject?.name}>
            {lowestSubject?.shortName} ({toBengaliNumber(lowestSubject?.percentage || 0)}%)
          </div>
        </div>
      </div>

      {/* Recharts Horizontal Bar Chart */}
      <div className="w-full pt-1 -ml-2" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={filteredData}
            margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload.length) {
                const clickedItem = state.activePayload[0].payload as ChartItem;
                handleNavigateToSubject(clickedItem.id);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis
              type="number"
              domain={[0, 100]}
              unit="%"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
            />
            <YAxis
              type="category"
              dataKey="shortName"
              width={90}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.8 }} />
            <ReferenceLine x={averagePercentage} stroke="#cbd5e1" strokeDasharray="3 3" />
            <Bar
              dataKey="percentage"
              radius={[0, 6, 6, 0]}
              barSize={16}
              cursor="pointer"
              animationDuration={800}
            >
              {filteredData.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={entry.percentage > 0 ? entry.color : '#e2e8f0'}
                  className="hover:opacity-85 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Interactive Tip */}
      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
        <span>💡 যে কোনো বিষয়ে ট্যাপ করে বিস্তারিত সিলেবাস ও অধ্যায় দেখুন</span>
        <button
          onClick={() => setActiveTab('tracker')}
          className="font-bold text-slate-800 hover:text-rose-800 flex items-center gap-0.5"
        >
          <span>ট্র্যাকার</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
