export type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type BadgeType = 'STREAK' | 'SOLVER' | 'LEVEL';

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  type: BadgeType;
  tier: BadgeTier;
  threshold: number;
}

export const BADGES: BadgeDef[] = [
  { id: 'SOLVER_1', title: 'Hello World', description: 'Menyelesaikan 1 tantangan pertama.', type: 'SOLVER', tier: 'BRONZE', threshold: 1 },
  { id: 'SOLVER_3', title: 'Getting Started', description: 'Menyelesaikan 3 tantangan.', type: 'SOLVER', tier: 'BRONZE', threshold: 3 },
  { id: 'SOLVER_5', title: 'High Five', description: 'Menyelesaikan 5 tantangan.', type: 'SOLVER', tier: 'SILVER', threshold: 5 },
  { id: 'SOLVER_10', title: 'Code Novice', description: 'Menyelesaikan 10 tantangan.', type: 'SOLVER', tier: 'SILVER', threshold: 10 },
  { id: 'SOLVER_25', title: 'Problem Solver', description: 'Menyelesaikan 25 tantangan.', type: 'SOLVER', tier: 'GOLD', threshold: 25 },
  { id: 'SOLVER_50', title: 'Code Warrior', description: 'Menyelesaikan 50 tantangan.', type: 'SOLVER', tier: 'PLATINUM', threshold: 50 },

  { id: 'STREAK_3', title: 'Warming Up', description: 'Belajar 3 hari berturut-turut.', type: 'STREAK', tier: 'BRONZE', threshold: 3 },
  { id: 'STREAK_7', title: 'On Fire', description: 'Belajar 7 hari berturut-turut.', type: 'STREAK', tier: 'SILVER', threshold: 7 },
  { id: 'STREAK_14', title: 'Dedicated', description: 'Belajar 14 hari berturut-turut.', type: 'STREAK', tier: 'GOLD', threshold: 14 },
  { id: 'STREAK_30', title: 'Legendary', description: 'Belajar 30 hari berturut-turut.', type: 'STREAK', tier: 'PLATINUM', threshold: 30 },

  { id: 'LEVEL_2', title: 'Level Up!', description: 'Mencapai Level 2.', type: 'LEVEL', tier: 'BRONZE', threshold: 2 },
  { id: 'LEVEL_5', title: 'Rising Star', description: 'Mencapai Level 5.', type: 'LEVEL', tier: 'SILVER', threshold: 5 },
  { id: 'LEVEL_10', title: 'Veteran', description: 'Mencapai Level 10.', type: 'LEVEL', tier: 'GOLD', threshold: 10 },
  { id: 'LEVEL_20', title: 'Guru', description: 'Mencapai Level 20.', type: 'LEVEL', tier: 'PLATINUM', threshold: 20 },
];

export const getBadgeById = (id: string) => BADGES.find(b => b.id === id);