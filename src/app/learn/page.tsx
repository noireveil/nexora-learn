'use client';

import { CourseCard } from "@/components/features/learn/CourseCard";
import { useLearningPaths } from "@/hooks/useLearningPaths";

export default function LearnPage() {
  const { courses, progressMap, isLoading } = useLearningPaths();

  if (isLoading) return <div className="p-20 text-center text-text-muted animate-pulse">Loading Paths...</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-2xl mb-12">
        <h1 className="text-3xl font-bold mb-4 text-white">Learning Paths</h1>
        <p className="text-text-muted text-lg">
            Kurikulum terstruktur yang dirancang untuk membawamu dari pemula hingga mahir. 
            Pilih jalurmu dan mulai coding hari ini.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
            <CourseCard 
                key={course.id} 
                course={course}
                progress={progressMap[course.id] || 0}
                isLocked={course.id === 'web-path'}
            />
        ))}
      </div>
    </div>
  );
}