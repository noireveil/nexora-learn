'use client';

import { useEffect, useState } from "react";
import { ArrowRight, WifiOff, ShieldCheck, BrainCircuit, PlayCircle } from "lucide-react";
import { seedDatabase } from "@/lib/db/seeder";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { FirstTimeModal } from "@/components/features/FirstTimeModal";

export default function Home() {
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [userName, setUserName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
        await seedDatabase();
        const user = await db.users.orderBy('lastLogin').last();
        if (user && user.startingLevel) {
            setIsReturningUser(true);
            setUserName(user.username);
        }
    };
    init();
  }, []);

  const handleMainAction = () => {
    if (isReturningUser) {
        router.push('/dashboard');
    } else {
        setIsModalOpen(true);
    }
  };

  return (
    <div className="bg-background min-h-screen font-sans overflow-x-hidden">
      <FirstTimeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-text-muted text-sm font-medium mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            v1.0.0 Public Beta • Offline Ready
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
            Education Transformation <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
              via Web Innovation
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform belajar coding offline-first dengan teknologi AI On-Device. 
            Tanpa server, tanpa hambatan internet, privasi terjaga.
          </p>

          <div className="flex flex-col items-center justify-center gap-2">
            {isReturningUser && (
                <span className="text-sm font-medium text-slate-500 animate-in fade-in slide-in-from-bottom-2">
                    Halo {userName}, anda sudah terdaftar ✨
                </span>
            )}
            
            <Button 
                onClick={handleMainAction}
                variant="accent" 
                size="lg" 
                className="shadow-xl shadow-orange-500/20 px-10 h-14 text-lg rounded-2xl transition-transform hover:scale-105"
            >
                {isReturningUser ? (
                    <>Lanjutkan Petualangan <PlayCircle size={22} className="ml-2 fill-white/20"/></>
                ) : (
                    <>Mulai Petualangan <ArrowRight size={22} className="ml-2"/></>
                )}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={<BrainCircuit size={32} />} 
                title="Adaptive Learning" 
                desc="Tingkat kesulitan soal menyesuaikan kemampuan Anda secara real-time menggunakan TensorFlow.js."
                color="text-secondary"
            />
            <FeatureCard 
                icon={<WifiOff size={32} />} 
                title="100% Offline" 
                desc="Tidak ada internet? Tidak masalah. PWA menyimpan data dan model AI di perangkat Anda."
                color="text-primary"
            />
            <FeatureCard 
                icon={<ShieldCheck size={32} />} 
                title="Anti-Paste Integrity" 
                desc="Sistem menolak input instan (Copy-Paste) untuk memastikan integritas pembelajaran dan melatih ingatan sintaks."
                color="text-accent"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const FeatureCard = ({ icon, title, desc, color }: any) => (
    <div className="p-8 rounded-2xl bg-background border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 group">
        <div className={`w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mb-6 ${color} shadow-sm group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
);