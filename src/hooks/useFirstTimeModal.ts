import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { importProgress } from '@/lib/exportImport';

export const useFirstTimeModal = () => {
  const [isImporting, setIsImporting] = useState(false);
  const router = useRouter();

  const handleStartFresh = async () => {
    router.push('/onboarding');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      await importProgress(file);
      router.refresh();
      setTimeout(() => {
          window.location.href = '/dashboard';
      }, 500);
    } catch (error: any) {
      alert("Import failed: " + error.message);
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    handleStartFresh,
    handleImport,
  };
};