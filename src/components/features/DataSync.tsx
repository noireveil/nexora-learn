'use client';

import { Download, Upload, CheckCircle, AlertCircle, Loader2, Cloud, Database, RefreshCw, Box, Trash2, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useDataSync } from '@/hooks/useDataSync';
import { cn } from '@/lib/utils/cn';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { db } from '@/lib/db/schema';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ConfirmModalConfig {
    title: string;
    message: string;
    type: 'warning' | 'danger';
    onConfirm: () => void;
}

export const DataSync = () => {
  const { isProcessing, status, performExport, performImport } = useDataSync();
  const [isDownloadingPy, setIsDownloadingPy] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const [confirmConfig, setConfirmConfig] = useState<ConfirmModalConfig | null>(null);
  
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setConfirmConfig({
        title: "Timpa Progress?",
        message: "Import data akan menghapus progress saat ini dan menggantinya dengan data dari file backup. Tindakan ini tidak bisa dibatalkan.",
        type: 'warning',
        onConfirm: () => {
            performImport(file);
            setConfirmConfig(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    });
  };

  const cancelImport = () => {
      setConfirmConfig(null);
      setTimeout(() => {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 300);
  };

  const handleDownloadPython = async () => {
    setIsDownloadingPy(true);
    const toastId = toast.loading("Mendownload Python Engine (10MB+)...");
    
    try {
        const filesToCache = [
            "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js",
            "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.asm.js",
            "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.asm.wasm",
            "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/repodata.json",
            "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide_py.tar",
            "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/stdlib.zip"
        ];

        await Promise.all(filesToCache.map(url => fetch(url, { cache: 'force-cache' })));
        
        toast.success("Python Engine Siap Offline!", { id: toastId });
    } catch (error) {
        console.error(error);
        toast.error("Gagal download. Pastikan internet lancar.", { id: toastId });
    } finally {
        setIsDownloadingPy(false);
    }
  };

  const handleFactoryResetTrigger = () => {
      setConfirmConfig({
          title: "Hapus Semua Data?",
          message: "BAHAYA: Semua progress, level, XP, dan akun akan dihapus permanen dari perangkat ini. Anda akan kembali ke awal.",
          type: 'danger',
          onConfirm: async () => {
              setConfirmConfig(null);
              await executeFactoryReset();
          }
      });
  };

  const executeFactoryReset = async () => {
    setIsResetting(true);
    try {
        await db.delete();
        await db.open();
        toast.success("Database berhasil di-reset!");
        
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    } catch (e) {
        console.error(e);
        toast.error("Gagal reset database");
        setIsResetting(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
        {confirmConfig && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={cancelImport}
                    className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                    className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 z-10"
                >
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto",
                        confirmConfig.type === 'danger' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                    )}>
                        <AlertTriangle size={24} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
                        {confirmConfig.title}
                    </h3>
                    
                    <p className="text-center text-slate-500 text-sm mb-6 leading-relaxed">
                        {confirmConfig.message}
                    </p>

                    <div className="flex gap-3">
                        <Button 
                            variant="secondary" 
                            onClick={cancelImport}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border-0"
                        >
                            Batal
                        </Button>
                        <Button 
                            variant={confirmConfig.type === 'danger' ? 'danger' : 'primary'}
                            onClick={confirmConfig.onConfirm}
                            className={cn(
                                "flex-1 border-0",
                                confirmConfig.type !== 'danger' && "bg-amber-500 hover:bg-amber-600 text-white"
                            )}
                        >
                            Ya, Lanjutkan
                        </Button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
  );

  return (
    <>
        <div className="space-y-6 relative z-10">
            <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Cloud className="text-blue-500" size={20}/> Cloud Sync (Offline)
                </h3>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Nexora berjalan 100% offline. Simpan data secara manual atau download engine tambahan.
                </p>
            </div>

            {status && (
                <div className={cn(
                    "p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2 border",
                    status.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                )}>
                <div className="mt-0.5 shrink-0">
                    {status.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                </div>
                <p className="font-medium">{status.message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                
                <div className="group relative bg-indigo-50 rounded-xl border border-indigo-100 p-5 hover:border-indigo-300 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Box size={24} />
                        </div>
                        <div className="bg-white px-2 py-1 rounded text-[10px] font-bold text-indigo-500 uppercase tracking-wider border border-indigo-100">
                            Offline Resources
                        </div>
                    </div>
                    
                    <h4 className="font-bold text-slate-900 mb-1">Download Python</h4>
                    <p className="text-xs text-slate-500 mb-4 h-8">
                        Wajib di-klik jika ingin mengerjakan soal Python tanpa internet. (Sekali saja)
                    </p>

                    <Button 
                        onClick={handleDownloadPython} 
                        disabled={isDownloadingPy}
                        variant="primary" 
                        className="w-full justify-between bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                    >
                        <span>{isDownloadingPy ? 'Sedang Download...' : 'Simpan Engine ke Cache'}</span>
                        {isDownloadingPy ? <Loader2 className="animate-spin" size={16}/> : <Download size={16}/>}
                    </Button>
                </div>

                <div className="group relative bg-white rounded-xl border-2 border-slate-100 p-5 hover:border-blue-100 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Database size={24} />
                        </div>
                        <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Backup
                        </div>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">Export Data</h4>
                    <p className="text-xs text-slate-500 mb-4 h-8">
                        Download file <code>.json</code> berisi seluruh progress kamu.
                    </p>
                    <Button onClick={performExport} disabled={isProcessing} variant="secondary" className="w-full justify-between">
                        <span>Download Backup</span>
                        {isProcessing ? <Loader2 className="animate-spin" size={16}/> : <Download size={16}/>}
                    </Button>
                </div>

                <div className="group relative bg-white rounded-xl border-2 border-dashed border-slate-200 p-5 hover:border-orange-300 hover:bg-orange-50/30 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg group-hover:scale-110 transition-transform">
                            <RefreshCw size={24} />
                        </div>
                        <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Restore
                        </div>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">Import Data</h4>
                    <p className="text-xs text-slate-500 mb-4 h-8">Upload file backup untuk mengembalikan progress.</p>
                    <div className="relative">
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept=".json" 
                            onChange={onFileChange} 
                            disabled={isProcessing} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <Button variant="secondary" className="w-full justify-between bg-white border-slate-200">
                            <span>Pilih File JSON</span>
                            {isProcessing ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>}
                        </Button>
                    </div>
                </div>

                <div className="group relative bg-red-50 rounded-xl border border-red-100 p-5 hover:border-red-300 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Trash2 size={24} />
                        </div>
                        <div className="bg-white px-2 py-1 rounded text-[10px] font-bold text-red-500 uppercase tracking-wider border border-red-100">
                            Danger Zone
                        </div>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">Factory Reset</h4>
                    <p className="text-xs text-slate-500 mb-4 h-8">
                        Hapus semua data akun dan progress dari perangkat ini.
                    </p>
                    <Button 
                        onClick={handleFactoryResetTrigger} 
                        disabled={isResetting}
                        className="w-full justify-between bg-red-600 hover:bg-red-700 text-white border-0 shadow-red-200"
                    >
                        <span>{isResetting ? 'Menghapus...' : 'Hapus Semua Data'}</span>
                        {isResetting ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={16}/>}
                    </Button>
                </div>
            </div>
        </div>

        {mounted && createPortal(modalContent, document.body)}
    </>
  );
};