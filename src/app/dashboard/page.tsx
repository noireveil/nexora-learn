'use client';

import { useDashboard } from "@/hooks/useDashboard";
import { useLearningPaths } from "@/hooks/useLearningPaths";
import { useRouteProtection } from "@/hooks/useRouteProtection";
import { DashboardTutorial } from "@/components/features/dashboard/DashboardTutorial";
import { ActivityChart } from "@/components/features/dashboard/ActivityChart";
import { Clock, Award, Trophy, Zap, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ContinueLearning } from "@/components/features/dashboard/ContinueLearning";
import { BADGES } from "@/lib/gamification/badges";

export default function Dashboard() {
  const isAuthorized = useRouteProtection();
  
  const { user, progress, isLoading, activityData, recentAchievement, lastActiveChallengeId, hasStarted } = useDashboard() as any;
  const { courses } = useLearningPaths();

  if (!isAuthorized || isLoading) return <div className="p-20 text-center text-slate-500">Memuat Dashboard...</div>;
  if (!user) return null;

  let lastTopic: string | undefined = undefined;
  let lastChapter: string | undefined = undefined;
  let progressPercent = 0;
  let nextChallengeId: string | undefined = undefined;
  let nextChallengeTitle: string | undefined = undefined;

  if (hasStarted && progress && lastActiveChallengeId) { 
      const currentCourse = courses.find((c: any) => 
          c.chapters.some((ch: any) => ch.challenges.includes(lastActiveChallengeId))
      );

      if (currentCourse) {
          lastTopic = currentCourse.title;
          progressPercent = progress.skillLevels?.[currentCourse.id] || 0;
          
          const activeChapter = currentCourse.chapters.find((ch: any) => ch.challenges.includes(lastActiveChallengeId));
          if (activeChapter) lastChapter = activeChapter.title;

          nextChallengeId = lastActiveChallengeId; 
          
          const isProject = activeChapter?.id.includes('project');
          nextChallengeTitle = isProject ? "Misi Project Baru" : "Lanjutkan Materi"; 
      }
  }

  const latestBadge = recentAchievement 
    ? BADGES.find(b => b.id === recentAchievement.achievementId) 
    : null;

  const getBadgeIcon = (type: string) => {
      if (type === 'STREAK') return <Zap size={32} />;
      if (type === 'SOLVER') return <Target size={32} />;
      if (type === 'LEVEL') return <Award size={32} />;
      return <Trophy size={32} />;
  };

  const getBadgeColor = (tier: string) => {
      switch(tier) {
        case 'BRONZE': return 'bg-orange-50 text-orange-600';
        case 'SILVER': return 'bg-slate-100 text-slate-600';
        case 'GOLD': return 'bg-yellow-50 text-yellow-600';
        case 'PLATINUM': return 'bg-cyan-50 text-cyan-600';
        default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl relative">
      {user && !user.tutorialCompleted && (
        <DashboardTutorial userId={user.id!} />
      )}

      <div className="mb-10 mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Halo, <span className="text-primary">{user.username}</span> 👋
            </h1>
            <p className="text-slate-500">Siap melanjutkan petualangan kodingmu hari ini?</p>
        </div>
        <div className="flex gap-3">
            <Badge variant="neutral" className="px-3 py-1 bg-white border-slate-200 text-slate-600 shadow-sm">
                <Clock size={14} className="mr-1"/> Streak: {progress?.currentStreak || 0} Hari
            </Badge>
            <Badge variant="warning" className="px-3 py-1 bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm">
                <Award size={14} className="mr-1"/> {progress?.xp || 0} XP
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Status Belajar</h2>
                <ContinueLearning 
                    lastTopic={lastTopic}
                    lastChapter={lastChapter}
                    progress={progressPercent}
                    challengeId={nextChallengeId}
                    challengeTitle={nextChallengeTitle}
                />
            </section>

            <section>
                {activityData && <ActivityChart data={activityData} />}
            </section>
        </div>

        <div className="space-y-8">
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={20}/> Achievement Terbaru
                </h2>
                <Card className="bg-white border-slate-200 p-6 flex flex-col items-center text-center shadow-sm">
                    {latestBadge ? (
                        <>
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-sm ${getBadgeColor(latestBadge.tier)}`}>
                                {getBadgeIcon(latestBadge.type)}
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">{latestBadge.title}</h3>
                            <p className="text-sm text-slate-500 mt-1">{latestBadge.description}</p>
                            <span className="mt-4 text-xs text-slate-400">
                                Diperoleh: {new Date(recentAchievement.unlockedAt).toLocaleDateString()}
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 grayscale opacity-50">
                                <Trophy size={32} className="text-slate-400" />
                            </div>
                            <p className="font-bold text-slate-900">Belum ada Achievement</p>
                            <p className="text-xs text-slate-500 mt-1">Selesaikan 1 soal pertamamu!</p>
                        </>
                    )}
                </Card>
            </section>
        </div>
      </div>
    </div>
  );
}