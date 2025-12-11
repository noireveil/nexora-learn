'use client';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, BookOpen, PlayCircle, Map, Compass } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface ContinueLearningProps {
  lastTopic?: string;      
  lastChapter?: string;    
  progress?: number;       
  challengeId?: string;    
  challengeTitle?: string; 
}

export const ContinueLearning = ({ 
  lastTopic, 
  lastChapter, 
  progress = 0,
  challengeId,
  challengeTitle
}: ContinueLearningProps) => {

  if (!lastTopic || !challengeId) {
    return (
        <Card className="group hover:border-orange-300 transition-all duration-500 relative overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md p-8 text-center">
            <div className="absolute -right-10 -bottom-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none text-orange-900 animate-spin-slow">
                <Compass size={150} />
            </div>

            <div className="flex flex-col items-center justify-center relative z-10">
                <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm border border-orange-100">
                    <Map className="text-orange-500 w-10 h-10 animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Petualangan Menunggu!</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                    Kamu belum memulai materi apapun. Pilih jalur belajarmu sekarang dan mulai kumpulkan XP pertamamu!
                </p>
                
                <Link href="/learn">
                    <Button 
                        className={cn(
                            "px-8 h-12 text-base font-bold shadow-lg transition-transform hover:scale-105",
                            "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
                            "text-white border-none shadow-orange-500/30"
                        )}
                    >
                        Mulai Belajar Sekarang <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform"/>
                    </Button>
                </Link>
            </div>
        </Card>
    );
  }

  return (
    <Card className="group hover:border-orange-400 transition-all duration-300 relative overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md">
      
      <div className="absolute -right-6 -top-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <BookOpen size={120} className="text-slate-900" />
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 p-2">
          
          <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-wider border border-orange-100">
                      In Progress
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                      Bab: {lastChapter}
                  </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1 truncate group-hover:text-orange-600 transition-colors">
                  {lastTopic}
              </h3>
              
              <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                  <PlayCircle size={14} className="text-slate-400"/> 
                  Materi Terakhir: <span className="font-medium text-slate-700">{challengeTitle}</span>
              </p>

              <div className="mt-4 flex items-center gap-3 w-full max-w-xs">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500 ease-out" 
                          style={{ width: `${progress}%` }} 
                      />
                  </div>
                  <span className="text-xs font-bold text-slate-400">{progress}%</span>
              </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
              <Link href={`/challenge/${challengeId}`}>
                  <Button 
                      className="w-full md:w-auto h-12 px-6 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/30 hover:scale-105 transition-all font-bold bg-slate-900 hover:bg-orange-600 text-white border-none"
                  >
                      Lanjutkan <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
              </Link>
          </div>
      </div>
    </Card>
  );
};