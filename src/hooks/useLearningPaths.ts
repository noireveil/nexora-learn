import { useState, useEffect } from 'react';
import { db } from '@/lib/db/schema';
import { COURSES } from '@/lib/content/courses';

export const useLearningPaths = () => {
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const user = await db.users.orderBy('lastLogin').last();
        if (user && user.id) {
          const progress = await db.progress.where('userId').equals(user.id).first();
          
          if (progress?.skillLevels) {
             setProgressMap(progress.skillLevels); 
          }
        }
      } catch (err) {
        console.error("Failed to load paths", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgress();
  }, []);
  return { courses: COURSES, progressMap, isLoading };
};