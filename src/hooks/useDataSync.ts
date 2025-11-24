import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { exportProgress, importProgress } from '@/lib/exportImport';

export const useDataSync = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  const performExport = async () => {
    try {
      setIsProcessing(true);
      await exportProgress();
      setStatus({ type: 'success', message: 'Backup file downloaded successfully.' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const performImport = async (file: File) => {
    try {
      setIsProcessing(true);
      const username = await importProgress(file);
      setStatus({ type: 'success', message: `Welcome back, ${username}! Data restored.` });
      
      // Refresh app state
      setTimeout(() => {
          router.refresh();
          window.location.reload();
      }, 1500);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, status, performExport, performImport };
};