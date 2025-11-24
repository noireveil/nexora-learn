'use client';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Lock, Play, Circle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

// Interface extended with user status
export interface EnrichedChallenge {
  id: string;
  title: string; 
  status: 'LOCKED' | 'OPEN' | 'COMPLETED';
}

interface ChapterViewProps {
  title: string;
  description: string;
  challenges: EnrichedChallenge[];
  index: number;
}

export const ChapterView = ({ title, description, challenges, index }: ChapterViewProps) => {
  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold border border-primary/20">
            {index + 1}
        </div>
        <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-text-muted text-sm">{description}</p>
        </div>
      </div>

      <div className="space-y-3 pl-4 md:pl-12">
        {challenges.map((challenge) => (
            <Card 
                key={challenge.id} 
                className={cn(
                    "p-4 flex items-center justify-between transition-all border-white/5",
                    challenge.status === 'LOCKED' ? "opacity-50 bg-surface/30" : "hover:border-primary/30 bg-surface/60"
                )}
            >
                <div className="flex items-center gap-3">
                    {challenge.status === 'COMPLETED' && <CheckCircle className="text-green-500 w-5 h-5" />}
                    {challenge.status === 'OPEN' && <Circle className="text-primary w-5 h-5" />}
                    {challenge.status === 'LOCKED' && <Lock className="text-slate-500 w-5 h-5" />}
                    
                    <span className={cn(
                        "font-medium",
                        challenge.status === 'COMPLETED' ? "text-text-muted line-through" : "text-white"
                    )}>
                        {challenge.title || `Challenge ${challenge.id}`}
                    </span>
                </div>

                {challenge.status === 'LOCKED' ? (
                    <Button variant="ghost" disabled size="sm" className="opacity-0">
                        Locked
                    </Button>
                ) : (
                    <Link href={`/challenge/${challenge.id}`}>
                        <Button 
                            variant={challenge.status === 'COMPLETED' ? 'secondary' : 'primary'} 
                            className="h-8 text-xs px-4"
                        >
                            {challenge.status === 'COMPLETED' ? 'Review' : 'Solve'} 
                            {challenge.status !== 'COMPLETED' && <Play size={12} className="ml-2"/>}
                        </Button>
                    </Link>
                )}
            </Card>
        ))}
      </div>
    </div>
  );
};