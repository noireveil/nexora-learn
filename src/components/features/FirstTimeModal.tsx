'use client';

import { Upload, UserPlus, Cpu, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFirstTimeModal } from '@/hooks/useFirstTimeModal';
import { motion } from 'framer-motion';

export function FirstTimeModal() {
  const { isOpen, isImporting, handleStartFresh, handleImport } = useFirstTimeModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-lg p-8 mx-4"
      >
        {/* ... existing UI structure ... */}
        <div className="bg-surface/50 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]">
               <Cpu size={32} className="text-primary" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Nexora<span className="text-primary">Learn</span>
            </h1>
            <p className="text-text-muted text-base leading-relaxed">
              Platform belajar coding offline-first. <br/>
              Data Anda disimpan lokal di perangkat ini.
            </p>
          </div>

          <div className="space-y-4">
            <div className="group relative">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-indigo-600 rounded-xl opacity-75 blur transition duration-200 group-hover:opacity-100" />
               <Button 
                  onClick={handleStartFresh} 
                  className="relative w-full h-14 bg-surface hover:bg-surfaceHighlight text-white border-0 flex justify-between items-center px-6"
               >
                  <span className="flex items-center gap-3 font-semibold text-lg">
                    <UserPlus size={20} className="text-primary"/>
                    Saya Pengguna Baru
                  </span>
                  <ChevronRight size={20} className="text-white/30 group-hover:text-white transition-colors"/>
               </Button>
            </div>

            <div className="relative group">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <Button 
                variant="secondary" 
                className="w-full h-14 bg-white/5 border-white/10 hover:bg-white/10 flex justify-center items-center gap-2"
                disabled={isImporting}
              >
                {isImporting ? (
                  <span className="animate-pulse">Mengembalikan Data...</span>
                ) : (
                  <>
                    <Upload size={18} className="text-text-muted group-hover:text-white transition-colors"/>
                    <span className="text-text-muted group-hover:text-white transition-colors">Restore Backup (.json)</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-text-muted/60">
              v1.0.0 • No Server • Privacy Focused
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}