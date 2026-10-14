import React, { useState } from 'react';
import { Header } from '../common/Header';
import { DaySelector } from './DaySelector';
import { OverallProgressCard } from './OverallProgressCard';
import { StudyWizardCard } from './StudyWizardCard';
import { StudyStreakCard } from './StudyStreakCard';
import { AcademicBadgesCard } from './AcademicBadgesCard';
import { DailyStudyTargetCard } from './DailyStudyTargetCard';
import { WeeklyProgressCard } from './WeeklyProgressCard';
import { SubjectCompletionDashboard } from './SubjectCompletionDashboard';
import { StudyTimerCard } from './StudyTimerCard';
import { TodayTasks } from './TodayTasks';
import { SubjectOverview } from './SubjectOverview';
import { AiBuddyPreviewCard } from './AiBuddyPreviewCard';
import { DayOfWeek } from '../../types';

export const HomeView: React.FC = () => {
  // Determine current day of week in Bengali
  const getInitialDay = (): DayOfWeek => {
    const dayIndex = new Date().getDay(); // 0 is Sunday
    const mapping: Record<number, DayOfWeek> = {
      0: 'রবি',
      1: 'সোম',
      2: 'মঙ্গল',
      3: 'বুধ',
      4: 'বৃহঃ',
      5: 'শুক্র',
      6: 'শনি',
    };
    return mapping[dayIndex] || 'শনি';
  };

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getInitialDay());

  return (
    <div className="pb-24 max-w-md mx-auto space-y-4">
      {/* Top Header */}
      <Header />

      {/* Horizontal Day Selector */}
      <div className="px-3">
        <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      </div>

      <div className="px-4 space-y-4">
        {/* Overall Progress Card */}
        <OverallProgressCard />

        {/* Dynamic Study Wizard Mascot Card */}
        <StudyWizardCard />

        {/* Study Streak Card */}
        <StudyStreakCard />

        {/* Academic Milestones & Badges Card */}
        <AcademicBadgesCard />

        {/* Daily Study Target Card with Progress Circle */}
        <DailyStudyTargetCard />

        {/* Weekly Progress Section with Line Chart */}
        <WeeklyProgressCard />

        {/* Large Dark Study Timer Card */}
        <StudyTimerCard />

        {/* AI Buddy Preview */}
        <AiBuddyPreviewCard />

        {/* Today's Tasks */}
        <TodayTasks />

        {/* Visual Dashboard for Subject Completion using Recharts */}
        <SubjectCompletionDashboard />

        {/* Subject Overview (2-Column) */}
        <SubjectOverview />
      </div>
    </div>
  );
};
