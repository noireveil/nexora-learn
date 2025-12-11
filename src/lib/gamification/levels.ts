export const BASE_XP = 100; 
export const MULTIPLIER = 1.5;

export const calculateLevel = (totalXp: number): { level: number; progress: number; nextLevelXp: number } => {
  let level = 1;
  let xpForNext = BASE_XP;
  
  while (totalXp >= xpForNext) {
    totalXp -= xpForNext;
    level++;
    xpForNext = Math.floor(xpForNext * MULTIPLIER);
  }

  const progress = Math.min(100, Math.floor((totalXp / xpForNext) * 100));

  return {
    level,
    progress,
    nextLevelXp: xpForNext
  };
};

export const getRankTitle = (level: number): string => {
  if (level < 3) return "Novice Coder";
  if (level < 5) return "Script Kiddie";
  if (level < 10) return "Code Warrior";
  return "Nexora Master";
};