import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PlayCircle, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Course } from "@/lib/content/courses";

interface CourseCardProps {
  course: Course;
  progress: number; // 0 - 100
  isLocked?: boolean;
}

export const CourseCard = ({ course, progress, isLocked = false }: CourseCardProps) => {
  return (
    <Card className={`flex flex-col h-full transition-all ${isLocked ? 'opacity-75 grayscale' : 'hover:border-primary/50'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${
            course.icon === 'js' ? 'bg-yellow-500/20 text-yellow-500' :
            course.icon === 'python' ? 'bg-blue-500/20 text-blue-500' :
            'bg-orange-500/20 text-orange-500'
        }`}>
            {/* Simple Text Icon replacement for real SVGs */}
            <span className="font-bold text-xl uppercase">{course.icon.substring(0, 2)}</span>
        </div>
        <Badge variant={course.level === 'Beginner' ? 'success' : 'warning'}>
            {course.level}
        </Badge>
      </div>

      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
      <p className="text-text-muted text-sm mb-6 flex-1">{course.description}</p>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-1">
            <div className="flex justify-between text-xs text-text-muted">
                <span>Progress</span>
                <span>{progress}%</span>
            </div>
            <div className="h-2 bg-surfaceHighlight rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>

        {/* Action Button */}
        {isLocked ? (
            <Button variant="secondary" disabled className="w-full">
                <Lock size={16} className="mr-2" /> Locked
            </Button>
        ) : (
            <Link href={`/learn/${course.id}`} className="block">
                <Button className="w-full group">
                    {progress > 0 ? 'Lanjutkan' : 'Mulai Belajar'} 
                    <PlayCircle size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
        )}
      </div>
    </Card>
  );
};