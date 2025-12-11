import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlayCircle, Lock } from "lucide-react";
import Link from "next/link";
import { Course } from "@/lib/content/courses";

interface CourseCardProps {
  course: Course;
  progress: number;
  isLocked?: boolean;
}

export const CourseCard = ({ course, progress, isLocked = false }: CourseCardProps) => {
  return (
    <Card className={`flex flex-col h-full transition-all ${isLocked ? 'opacity-75 grayscale' : 'hover:border-orange-400 hover:shadow-md'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${
            course.icon === 'js' ? 'bg-yellow-500/20 text-yellow-500' :
            course.icon === 'python' ? 'bg-blue-500/20 text-blue-500' :
            'bg-orange-500/20 text-orange-500'
        }`}>
            <span className="font-bold text-xl uppercase">{course.icon.substring(0, 2)}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
      <p className="text-text-muted text-sm mb-6 flex-1">{course.description}</p>

      <div className="space-y-4">
        <div className="space-y-1">
            <div className="flex justify-between text-xs text-text-muted">
                <span>Progress</span>
                <span>{progress}%</span>
            </div>
            <div className="h-2 bg-surfaceHighlight rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-primary'}`} 
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>

        {isLocked ? (
            <Button variant="secondary" disabled className="w-full">
                <Lock size={16} className="mr-2" /> Locked
            </Button>
        ) : (
            <Link href={`/learn/${course.id}`} className="block">
                <Button className="w-full group bg-slate-900 hover:bg-orange-600 text-white border-none shadow-md shadow-orange-500/10">
                    {progress > 0 ? 'Lanjutkan' : 'Mulai Belajar'} 
                    <PlayCircle size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
        )}
      </div>
    </Card>
  );
};