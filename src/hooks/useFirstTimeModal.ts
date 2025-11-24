import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isFirstTimeUser, importProgress } from '@/lib/exportImport';
import { db } from '@/lib/db/schema';
import { generateId } from '@/lib/utils/generateId'; 

export const useFirstTimeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    isFirstTimeUser().then((isFirst) => {
      if (isFirst) setIsOpen(true);
    });
  }, []);

  const handleStartFresh = async () => {
    try {
      await db.users.add({
        id: generateId(), 
        username: 'Guest Learner',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });
      setIsOpen(false);
      router.push('/dashboard');
    } catch (error) {
      console.error("Failed to create user", error);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      await importProgress(file);
      setIsOpen(false);
      router.refresh();
      window.location.reload();
    } catch (error: any) {
      alert("Import failed: " + error.message);
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isOpen,
    isImporting,
    handleStartFresh,
    handleImport,
  };
};