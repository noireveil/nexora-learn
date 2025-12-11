'use client';

import { useLearningPaths } from "@/hooks/useLearningPaths";
import { useRouteProtection } from "@/hooks/useRouteProtection";
import { CourseCard } from "@/components/features/learn/CourseCard";

export default function LearnPage() {
  const isAuthorized = useRouteProtection();
  const { courses, progressMap, isLoading } = useLearningPaths();

  if (!isAuthorized || isLoading) return <div className="p-20 text-center text-slate-500">Loading Paths...</div>;

  return (
    <div className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Learning Path</h1>
            <p className="text-slate-600 text-lg max-w-3xl leading-relaxed">
                Pilih jalur belajarmu. Kurikulum akan menyesuaikan secara otomatis berdasarkan level pengalaman yang kamu pilih di awal.
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
                <CourseCard 
                    key={course.id} 
                    course={course} 
                    progress={progressMap[course.id] || 0}
                    isLocked={false} 
                />
            ))}
        </div>
    </div>
  );
}