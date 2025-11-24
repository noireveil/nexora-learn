import { db, User, Progress } from "@/lib/db/schema";

export const getCurrentUser = async (): Promise<User | undefined> => {
  return await db.users.orderBy('lastLogin').last();
};

export const getUserProgress = async (userId: string): Promise<Progress | undefined> => {
  return await db.progress.where('userId').equals(userId).first();
};

export const getDashboardData = async () => {
  const user = await getCurrentUser();
  if (!user || !user.id) return null;

  let progress = await getUserProgress(user.id);
  
  // Calculate real accuracy based on submissions
  const submissions = await db.submissions.where('userId').equals(user.id).toArray();
  let accuracy = 0;
  
  if (submissions.length > 0) {
    const passedCount = submissions.filter(s => s.status === 'PASSED').length;
    accuracy = Math.round((passedCount / submissions.length) * 100);
  }

  // Return dynamic data mixed with progress
  return { 
    user, 
    progress: progress ? { ...progress, accuracy } : null 
  };
};