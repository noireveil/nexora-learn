'use client';

import { useDashboard } from "@/hooks/useDashboard";
import { StatsOverview } from "@/components/features/dashboard/StatsOverview";
import { ContinueLearning } from "@/components/features/dashboard/ContinueLearning";
import { FirstTimeModal } from "@/components/features/FirstTimeModal"; 

export default function Dashboard() {
  // Isolated dashboard logic
  const { user, progress, isLoading } = useDashboard();

  if (isLoading) {
    return <div className="p-10 text-center animate-pulse text-text-muted">Loading dashboard...</div>;
  }

  if (!user) {
    return (
        <div className="container mx-auto px-6 py-10 text-center">
            <h2 className="text-xl mb-4 text-white">Please log in or create an account.</h2>
            <FirstTimeModal /> 
        </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {user.username}
        </span>
      </h1>
      
      <StatsOverview 
        streak={progress?.currentStreak || 0}
        xp={progress?.xp || 0}
        accuracy={92} 
      />

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
        Continue Learning <span className="h-px flex-1 bg-white/10 ml-4"></span>
      </h2>

      <ContinueLearning 
        lastTopic="JavaScript Basics" 
        progress={progress?.level ? (progress.level * 10) % 100 : 10} 
        challengeId="js-var-01" 
      />
    </div>
  );
}