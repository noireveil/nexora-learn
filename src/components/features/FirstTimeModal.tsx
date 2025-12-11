'use client';

import { Upload, UserPlus, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFirstTimeModal } from '@/hooks/useFirstTimeModal';
import { motion, AnimatePresence } from 'framer-motion';

interface FirstTimeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FirstTimeModal({ isOpen, onClose }: FirstTimeModalProps) {
  const { isImporting, handleStartFresh, handleImport } = useFirstTimeModal();

  return (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop Gelap */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" 
            />

            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, type: "spring" }}
                className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl z-10"
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                    <X size={20} />
                </button>

                {/* Header Section */}
                <div className="text-center mb-10 pt-4">
                <h1 className="text-3xl font-black tracking-tight mb-4">
                    <span className="text-slate-900">Nexora</span>
                    <span className="text-orange-600">Learn</span>
                </h1>
                
                <p className="text-slate-500 text-base leading-relaxed max-w-xs mx-auto">
                    Platform belajar coding offline-first.<br/>
                    Pilih metode masuk Anda.
                </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                {/* Tombol Utama: Pengguna Baru */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl opacity-20 blur transition duration-200 group-hover:opacity-40" />
                    <Button 
                        onClick={handleStartFresh} 
                        className="relative w-full h-16 bg-slate-900 hover:bg-slate-800 text-white border-0 flex justify-between items-center px-6 rounded-xl shadow-xl transition-all hover:scale-[1.02]"
                    >
                        <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <UserPlus size={20} className="text-orange-400"/>
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-base">Saya Pengguna Baru</p>
                            <p className="text-xs text-slate-400 font-normal">Mulai petualangan dari awal</p>
                        </div>
                        </div>
                        <ChevronRight size={20} className="text-slate-500 group-hover:text-white transition-colors"/>
                    </Button>
                </div>

                {/* Tombol Sekunder: Restore */}
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
                    className="w-full h-14 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600 flex justify-center items-center gap-2 rounded-xl"
                    disabled={isImporting}
                    >
                    {isImporting ? (
                        <span className="animate-pulse">Mengembalikan Data...</span>
                    ) : (
                        <>
                        <Upload size={18} className="text-slate-400"/>
                        <span className="font-medium">Restore Backup (.json)</span>
                        </>
                    )}
                    </Button>
                </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center border-t border-slate-100 pt-6">
                <p className="text-xs font-medium text-slate-400">
                    v1.0.0 • No Server • Privacy Focused
                </p>
                </div>
            </motion.div>
            </div>
        )}
    </AnimatePresence>
  );
}