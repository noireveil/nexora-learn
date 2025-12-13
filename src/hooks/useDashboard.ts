import { useState, useEffect } from 'react';
import { getDashboardData } from '@/services/userService';
import { User, Progress, Achievement } from "@/lib/db/schema";

export const useDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);
  const [lastActiveChallengeId, setLastActiveChallengeId] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false); // State baru
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardData();
        if (data) {
          setUser(data.user);
          setProgress(data.progress || null);
          setActivityData(data.activityData || []);
          setRecentAchievement(data.recentAchievement || null);
          setLastActiveChallengeId(data.lastActiveChallengeId || null);
          setHasStarted(data.hasStarted || false); // Set state
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return { user, progress, activityData, recentAchievement, lastActiveChallengeId, hasStarted, isLoading };
};