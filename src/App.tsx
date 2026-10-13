/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { BottomNav } from './components/common/BottomNav';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ProfileModal } from './components/profile/ProfileModal';
import { AlarmNotificationModal } from './components/common/AlarmNotificationModal';
import { FloatingStudyWidget } from './components/common/FloatingStudyWidget';
import { HomeView } from './components/home/HomeView';
import { RoutineView } from './components/routine/RoutineView';
import { TrackerView } from './components/tracker/TrackerView';
import { AiBuddyView } from './components/aibuddy/AiBuddyView';

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isProfileOpen,
    setIsProfileOpen,
    activeAlarmRoutine,
    dismissAlarm,
    timerStatus,
  } = useApp();

  // Android Screen Wake Lock during study timer session
  useEffect(() => {
    let wakeLock: any = null;
    if (timerStatus === 'running' && 'wakeLock' in navigator) {
      (navigator as any).wakeLock
        .request('screen')
        .then((lock: any) => {
          wakeLock = lock;
        })
        .catch(() => {});
    }
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, [timerStatus]);

  // Android Hardware / Software Back Button Handler
  useEffect(() => {
    const handlePopState = () => {
      if (activeAlarmRoutine) {
        dismissAlarm();
        return;
      }
      if (isProfileOpen) {
        setIsProfileOpen(false);
        return;
      }
      if (activeTab !== 'home') {
        setActiveTab('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeAlarmRoutine, isProfileOpen, activeTab, dismissAlarm, setIsProfileOpen, setActiveTab]);

  // Push history state when tab or modal opens for Android Back navigation
  useEffect(() => {
    if (activeTab !== 'home' || isProfileOpen || activeAlarmRoutine) {
      window.history.pushState({ tab: activeTab, profile: isProfileOpen }, '');
    }
  }, [activeTab, isProfileOpen, activeAlarmRoutine]);

  return (
    <main className="min-h-screen bg-[#f8f9fa] text-[#0f172a] antialiased select-none pb-safe">
      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Views based on Active Tab */}
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'routine' && <RoutineView />}
      {activeTab === 'tracker' && <TrackerView />}
      {activeTab === 'ai-buddy' && <AiBuddyView />}

      {/* Global Fixed Bottom Navigation */}
      <BottomNav />

      {/* Global Profile Modal */}
      <ProfileModal />

      {/* Routine Study Alarm Popup Modal */}
      <AlarmNotificationModal />

      {/* Mobile Floating Companion Widget (Sad if no study, Happy when studying) */}
      <FloatingStudyWidget />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
