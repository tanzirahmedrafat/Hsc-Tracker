import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { Home, Calendar, CheckSquare, Sparkles } from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'হোম', icon: Home },
  { id: 'routine', label: 'রুটিন', icon: Calendar },
  { id: 'tracker', label: 'ট্র্যাকার', icon: CheckSquare },
  { id: 'ai-buddy', label: 'AI BUDDY', icon: Sparkles },
];

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 pb-safe">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
                isActive ? 'text-slate-950 font-bold' : 'text-stone-400 hover:text-stone-600 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'text-slate-950 scale-105' : 'text-stone-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${item.id === 'ai-buddy' && isActive ? 'text-rose-700' : ''}`} />
              </div>
              <span className="text-[11px] tracking-tight mt-0.5">{item.label}</span>
              {isActive && (
                <span className="absolute -top-[1px] w-6 h-[2px] bg-slate-900 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
