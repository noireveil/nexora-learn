'use client';

import { Download, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useDataSync } from '@/hooks/useDataSync';

export const DataSync = () => {
  const { isProcessing, status, performExport, performImport } = useDataSync();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (confirm("Warning: This will overwrite your current progress. Continue?")) {
        performImport(file);
    }
    e.target.value = '';
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold flex items-center gap-2 text-white">
           ☁️ Data Sync (Offline Mode)
        </h3>
        <p className="text-text-muted text-sm mt-1">
          Simpan progressmu secara manual atau pindahkan ke perangkat lain. 
          Data disimpan dalam file JSON.
        </p>
      </div>

      {status && (
        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
          status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {status.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* EXPORT UI */}
        <div className="bg-surfaceHighlight p-4 rounded-xl border border-white/5 flex flex-col justify-between">
            <div>
                <h4 className="font-semibold text-indigo-400 mb-2">Export / Backup</h4>
                <p className="text-xs text-text-muted mb-4">Download file backup (.json) ke perangkat ini.</p>
            </div>
            <Button 
                onClick={performExport} 
                disabled={isProcessing}
                variant="secondary"
                className="w-full"
            >
                {isProcessing ? <Loader2 className="animate-spin mr-2"/> : <Download className="mr-2" size={16}/>}
                Download Backup
            </Button>
        </div>

        {/* IMPORT UI */}
        <div className="bg-surfaceHighlight p-4 rounded-xl border border-white/5 flex flex-col justify-between">
            <div>
                <h4 className="font-semibold text-emerald-400 mb-2">Import / Restore</h4>
                <p className="text-xs text-text-muted mb-4">Upload file backup untuk mengembalikan progress.</p>
            </div>
            <div className="relative">
                <input 
                    type="file" 
                    accept=".json"
                    onChange={onFileChange}
                    disabled={isProcessing}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <Button variant="primary" className="w-full" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="animate-spin mr-2"/> : <Upload className="mr-2" size={16}/>}
                    Select File
                </Button>
            </div>
        </div>
      </div>
    </Card>
  );
};