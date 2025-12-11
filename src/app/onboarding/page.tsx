'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Code2, Rocket, Zap, BookOpen } from "lucide-react";
import { db } from "@/lib/db/schema";
import { generateId } from "@/lib/utils/generateId";
import { COURSES } from "@/lib/content/courses";
import { calculateLevel } from "@/lib/gamification/levels";

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const levels = [
    { id: 'newbie', label: 'Newbie', desc: 'Baru pertama kali lihat kode. Mulai dari nol.', icon: <BookOpen className="w-6 h-6 text-green-500"/> },
    { id: 'basic', label: 'Basic', desc: 'Sudah paham syntax dasar. Skip materi awal.', icon: <Code2 className="w-6 h-6 text-blue-500"/> },
    { id: 'inter', label: 'Intermediate', desc: 'Paham fungsi & loop. Langsung ke studi kasus.', icon: <Zap className="w-6 h-6 text-yellow-500"/> },
    { id: 'adv', label: 'Advanced', desc: 'Sering bikin project kompleks. Tantangan berat.', icon: <Rocket className="w-6 h-6 text-red-500"/> }
  ];

  const handleStart = async () => {
    if (!selectedLevel) return;
    setIsSubmitting(true);
    
    const userId = generateId();
    const now = new Date().toISOString();
    
    let completedChallenges: string[] = [];
    let initialXP = 0;

    const getChallengesByLevel = (targetLevels: string[]) => {
        let ids: string[] = [];
        COURSES.forEach(course => {
            course.chapters.forEach(chapter => {
                if (targetLevels.includes(chapter.level)) {
                    ids.push(...chapter.challenges);
                }
            });
        });
        return ids;
    };

    const getFirstChapterChallenges = () => {
        let ids: string[] = [];
        COURSES.forEach(course => {
            if (course.chapters.length > 0) {
                ids.push(...course.chapters[0].challenges);
            }
        });
        return ids;
    };

    if (selectedLevel === 'basic') {
        completedChallenges = getFirstChapterChallenges();
        initialXP = 300;
    } 
    else if (selectedLevel === 'inter') {
        completedChallenges = getChallengesByLevel(['Beginner']);
        initialXP = 1500;
    }
    else if (selectedLevel === 'adv') {
        completedChallenges = getChallengesByLevel(['Beginner', 'Intermediate']);
        initialXP = 4000; 
    }

    const skillLevels: Record<string, number> = {
        'js-path': 0, 'python-path': 0, 'web-path': 0
    };
    if (selectedLevel === 'basic') { skillLevels['js-path'] = 15; skillLevels['python-path'] = 15; }
    if (selectedLevel === 'inter') { skillLevels['js-path'] = 50; skillLevels['python-path'] = 50; skillLevels['web-path'] = 50; }
    if (selectedLevel === 'adv')   { skillLevels['js-path'] = 80; skillLevels['python-path'] = 80; skillLevels['web-path'] = 80; }

    const calculatedStats = calculateLevel(initialXP);

    try {
        await db.users.add({
            id: userId,
            username: 'Petualang', 
            createdAt: now,
            lastLogin: now,
            startingLevel: selectedLevel 
        });

        await db.progress.add({
            userId: userId,
            level: calculatedStats.level, 
            xp: initialXP,
            currentStreak: 1, 
            lastStreakDate: now,
            skillLevels: skillLevels,
            completedChallenges: completedChallenges
        });
        
        const bulkSubmissions = completedChallenges.map(cId => ({
            userId,
            challengeId: cId,
            code: '// Auto-completed by Warm Start System',
            status: 'PASSED' as const,
            timestamp: now,
            executionTime: 0,
            timeSpent: 0,
            hintsUsed: 0
        }));

        if (bulkSubmissions.length > 0) {
            await db.submissions.bulkAdd(bulkSubmissions);
        }
        
        setTimeout(() => {
            router.push('/dashboard');
        }, 1000);
        
    } catch (error) {
        console.error("Failed to create account", error);
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-12">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Mari Sesuaikan <span className="text-primary">Perjalananmu</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Agar AI kami bisa menyiapkan materi yang paling pas, seberapa jauh pengalaman coding-mu saat ini?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {levels.map((lvl, idx) => (
            <motion.div
              key={lvl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`
                relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 text-left bg-white
                group hover:shadow-lg hover:-translate-y-1
                ${selectedLevel === lvl.id 
                  ? 'border-primary ring-4 ring-primary/10 shadow-xl' 
                  : 'border-slate-100 hover:border-primary/30'
                }
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-slate-50 ${selectedLevel === lvl.id ? 'bg-primary/10' : ''}`}>
                    {lvl.icon}
                </div>
                {selectedLevel === lvl.id && <CheckCircle className="w-6 h-6 text-primary animate-in zoom-in" />}
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-1">{lvl.label}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{lvl.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            <button
            onClick={handleStart}
            disabled={!selectedLevel || isSubmitting}
            className={`
                px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-primary/20
                ${!selectedLevel 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-primary hover:bg-indigo-600 text-white hover:shadow-primary/40 hover:scale-105 active:scale-95'
                }
            `}
            >
            {isSubmitting ? 'Menyiapkan Materi...' : 'Mulai Petualangan 🚀'}
            </button>
        </motion.div>
      </div>
    </div>
  );
}