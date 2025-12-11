import Dexie, { Table } from 'dexie';

export interface User {
  id?: string; 
  username: string;
  createdAt: string;
  lastLogin: string;
}

export interface Progress {
  id?: number;
  userId: string;
  level: number;
  xp: number;
  currentStreak: number;
  skillLevels: Record<string, number>;
  completedChallenges: string[];
}

export interface Achievement {
  id?: number;
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface TestCase {
  input: any;
  expected: any;
  description: string;
}

export interface Challenge {
  id: string; 
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  starterCode: string;
  testCases: TestCase[];
  xpReward: number;
}

export interface Submission {
  id?: number;
  userId: string;
  challengeId: string;
  code: string;
  status: 'PASSED' | 'FAILED';
  timestamp: string;
  executionTime: number;
  timeSpent: number;
  hintsUsed: number; 
}

export class NexoraDB extends Dexie {
  users!: Table<User>;
  progress!: Table<Progress>;
  achievements!: Table<Achievement>;
  challenges!: Table<Challenge>;
  submissions!: Table<Submission>;

  constructor() {
    super('NexoraLearnDB');
    
    this.version(4).stores({
      users: 'id, username, lastLogin',
      progress: '++id, userId',
      achievements: '++id, userId',
      challenges: 'id, topic, difficulty',
      submissions: '++id, userId, challengeId'
    });
  }
}

export const db = new NexoraDB();