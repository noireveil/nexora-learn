'use client';

import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";

interface ActivityData {
  day: string;
  count: number;
  fullDate: string;
}

export const ActivityChart = ({ data }: { data: ActivityData[] }) => {
  const maxCount = Math.max(...data.map(d => d.count), 5);

  return (
    <Card className="p-6 bg-white border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            📊 Aktivitas Belajar (7 Hari Terakhir)
        </h3>
        
        <div className="flex items-end justify-between h-40 gap-2">
            {data.map((item, idx) => {
                const heightPercentage = (item.count / maxCount) * 100;
                
                return (
                    <div key={idx} className="flex flex-col items-center flex-1 group relative">
                        <div className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {item.count} Soal
                        </div>

                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercentage}%` }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`w-full max-w-[30px] rounded-t-lg transition-all duration-300 ${
                                item.count > 0 ? 'bg-primary' : 'bg-slate-100'
                            } hover:bg-orange-500`}
                            style={{ minHeight: item.count > 0 ? '4px' : '4px' }}
                        />
                        
                        <span className="text-xs text-slate-400 mt-2 font-medium">
                            {item.day}
                        </span>
                    </div>
                );
            })}
        </div>
    </Card>
  );
};