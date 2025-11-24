import { useState, useEffect } from 'react';
import { getDashboardData } from '@/services/userService';
import { User, Progress } from "@/lib/db/schema";

export const useDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardData();
        if (data) {
          setUser(data.user);
          setProgress(data.progress || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return { user, progress, isLoading };
};