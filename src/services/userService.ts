import { db, User, Progress } from "@/lib/db/schema";
import { calculateLevel } from "@/lib/gamification/levels";
import { getCourseByChallengeId, getTotalChallengesInCourse } from "./courseService";
import { BADGES } from "@/lib/gamification/badges";

export const getCurrentUser = async (): Promise<User | undefined> => {
  return await db.users.orderBy('lastLogin').last();
};

export const getUserProgress = async (userId: string): Promise<Progress | undefined> => {
  return await db.progress.where('userId').equals(userId).first();
};

const checkAndUnlockBadges = async (userId: string, progress: Progress) => {
  const realSolvesCount = await db.submissions
    .where('userId').equals(userId)
    .filter(s => s.status === 'PASSED' && s.executionTime > 0) 
    .count();

  const currentStreak = progress.currentStreak;
  const currentLevel = progress.level;
  
  const existingAchievements = await db.achievements.where('userId').equals(userId).toArray();
  const ownedBadgeIds = new Set(existingAchievements.map(a => a.achievementId));
  const now = new Date().toISOString();

  for (const badge of BADGES) {
      if (ownedBadgeIds.has(badge.id)) continue;

      let isEligible = false;

      if (badge.type === 'SOLVER' && realSolvesCount >= badge.threshold) isEligible = true;
      if (badge.type === 'STREAK' && currentStreak >= badge.threshold) isEligible = true;
      if (badge.type === 'LEVEL' && currentLevel >= badge.threshold) isEligible = true;

      if (isEligible) {
          await db.achievements.add({
              userId,
              achievementId: badge.id,
              unlockedAt: now
          });
      }
  }
};

export const updateUserProgress = async (userId: string, challengeId: string, xpReward: number) => {
  const progress = await db.progress.where('userId').equals(userId).first();
  if (!progress) return;

  const now = new Date();
  const todayStr = now.toDateString(); 
  
  let newXp = progress.xp;
  let newLevel = progress.level;
  let newStreak = progress.currentStreak;
  let newSkillLevels = { ...progress.skillLevels };
  let updatedCompletedChallenges = [...progress.completedChallenges];
  let lastStreakDate = progress.lastStreakDate;
  
  let dbUpdateNeeded = false;

  const lastActiveDateObj = lastStreakDate ? new Date(lastStreakDate) : null;
  const lastActiveStr = lastActiveDateObj ? lastActiveDateObj.toDateString() : "";

  if (lastActiveStr !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActiveStr === yesterday.toDateString()) {
          newStreak += 1;
      } else {
          newStreak = 1;
      }
      
      lastStreakDate = now.toISOString();
      dbUpdateNeeded = true;
  }

  const isNewChallenge = !progress.completedChallenges.includes(challengeId);

  if (isNewChallenge) {
      dbUpdateNeeded = true;
      updatedCompletedChallenges.push(challengeId);

      newXp += xpReward;
      const calc = calculateLevel(newXp);
      newLevel = calc.level;

      const courseId = getCourseByChallengeId(challengeId);
      if (courseId) {
          const totalChallenges = getTotalChallengesInCourse(courseId);
          const currentPercentage = newSkillLevels[courseId] || 0;
          const increment = totalChallenges > 0 ? 100 / totalChallenges : 0;
          newSkillLevels[courseId] = Math.min(100, Math.round(currentPercentage + increment));
      }
  }

  if (dbUpdateNeeded) {
      await db.progress.update(progress.id!, {
        xp: newXp,
        level: newLevel,
        currentStreak: newStreak,
        lastStreakDate: lastStreakDate,
        skillLevels: newSkillLevels,
        completedChallenges: updatedCompletedChallenges
      });
  }

  const updatedProgress = await db.progress.where('userId').equals(userId).first();
  if (updatedProgress) {
      await checkAndUnlockBadges(userId, updatedProgress);
  }
};

export const getDashboardData = async () => {
  const user = await getCurrentUser();
  if (!user || !user.id) return null;

  let progress = await getUserProgress(user.id);
  
  if (progress) {
      await checkAndUnlockBadges(user.id, progress);
  }

  const submissions = await db.submissions.where('userId').equals(user.id).reverse().sortBy('timestamp');
  
  let accuracy = 0;
  if (submissions.length > 0) {
    const passedCount = submissions.filter(s => s.status === 'PASSED').length;
    accuracy = Math.round((passedCount / submissions.length) * 100);
  }

  const lastRealSubmission = submissions.find(s => s.code !== '// Auto-completed by Warm Start System');
  const lastActiveChallengeId = lastRealSubmission ? lastRealSubmission.challengeId : null;

  const achievements = await db.achievements.where('userId').equals(user.id).reverse().toArray();

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toDateString();
  }).reverse();

  const activityData = last7Days.map(dateStr => {
    const count = submissions.filter(s => new Date(s.timestamp).toDateString() === dateStr).length;
    const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
    return { day: dayName, count, fullDate: dateStr };
  });

  return { 
    user, 
    progress: progress ? { ...progress, accuracy } : null,
    recentAchievement: achievements[0],
    activityData,
    lastActiveChallengeId 
  };
};