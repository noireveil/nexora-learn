import { useState, useEffect } from 'react';
import { db, User, Achievement } from '@/lib/db/schema';
import { getRankTitle, calculateLevel } from '@/lib/gamification/levels';

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ level: 1, xp: 0, rank: 'Novice', nextXp: 100, progress: 0 });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await db.users.orderBy('lastLogin').last();
      
      if (currentUser && currentUser.id) {
        setUser(currentUser);
        
        const progressData = await db.progress.where('userId').equals(currentUser.id).first();
        if (progressData) {
            const calc = calculateLevel(progressData.xp);
            setStats({
                level: calc.level,
                xp: progressData.xp,
                rank: getRankTitle(calc.level),
                nextXp: calc.nextLevelXp,
                progress: calc.progress 
            });
        }

        const userAchievements = await db.achievements.where('userId').equals(currentUser.id).toArray();
        setAchievements(userAchievements);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  return { user, stats, achievements, isLoading };
};