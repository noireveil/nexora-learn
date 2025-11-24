import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

interface ContinueLearningProps {
  lastTopic?: string;
  lastChapter?: string;
  progress?: number;
  challengeId?: string;
}

export const ContinueLearning = ({ 
  lastTopic = "JavaScript Basics", 
  lastChapter = "Introduction", 
  progress = 0,
  challengeId = "js-var-01" 
}: ContinueLearningProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="group hover:border-primary/50 transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookOpen size={100} />
        </div>
        
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                    {lastTopic}
                </h3>
                <p className="text-text-muted text-sm">{lastChapter}</p>
            </div>
            <div className="text-xs px-2 py-1 bg-primary/20 text-primary-300 rounded border border-primary/20">
                In Progress
            </div>
        </div>
        
        <div className="w-full bg-surfaceHighlight h-2 rounded-full mb-4 overflow-hidden relative z-10">
            <div 
                className="bg-primary h-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }} 
            />
        </div>
        
        <div className="flex justify-end relative z-10">
            <Link href={`/challenge/${challengeId}`}>
                <Button variant="secondary" className="text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                    Lanjutkan <ArrowRight size={16} className="ml-2" />
                </Button>
            </Link>
        </div>
      </Card>
    </div>
  );
};