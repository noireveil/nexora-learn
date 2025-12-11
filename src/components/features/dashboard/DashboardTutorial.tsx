'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, BarChart2, Map } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';

export const DashboardTutorial = ({ userId }: { userId: string }) => {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleComplete = async () => {
    await db.users.update(userId, { tutorialCompleted: true });
    // UX FIX: Langsung arahkan user, jangan suruh cari menu sendiri
    router.push('/learn');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        />

        <motion.div 
            key={step}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative z-[101] bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 text-center"
        >
            {/* STEP 0: Welcome */}
            {step === 0 && (
                <>
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Selamat Datang!</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Akunmu berhasil dibuat. Ini adalah <b>Dashboard</b> pribadimu. Di sini kamu bisa memantau progress belajar harianmu.
                    </p>
                    <Button onClick={() => setStep(1)} className="w-full h-12 text-base">
                        Lanjut Tour
                    </Button>
                </>
            )}

            {/* STEP 1: Stats */}
            {step === 1 && (
                <>
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <BarChart2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Statistik Belajar</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Perhatikan <b>Streak Harian</b> dan <b>XP</b> di bagian atas. Konsistensi adalah kunci untuk menjadi programmer handal!
                    </p>
                    <Button onClick={() => setStep(2)} className="w-full h-12 text-base">
                        Mengerti <ArrowRight className="ml-2 w-4 h-4"/>
                    </Button>
                </>
            )}

            {/* STEP 2: Action */}
            {step === 2 && (
                <>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Map className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Mulai Belajar</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Materi belajarmu sudah disiapkan oleh AI sesuai level yang kamu pilih. Yuk mulai coding sekarang!
                    </p>
                    <Button onClick={handleComplete} variant="accent" className="w-full h-12 text-base shadow-xl shadow-accent/20">
                        Buka Learning Paths 🚀
                    </Button>
                </>
            )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};