import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-600/95 text-white px-3.5 py-1 text-xs font-medium shadow-md backdrop-blur-xs animate-pulse">
      <WifiOff className="w-3.5 h-3.5" />
      <span>অফলাইন মোড — সংরক্ষিত তথ্য প্রদর্শিত হচ্ছে</span>
    </div>
  );
};
