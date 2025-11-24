'use client';

import { useParams } from "next/navigation";
import { useCourseDetail } from "@/hooks/useCourseDetail"; 
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Trophy } from "lucide-react";
import { ChapterView } from "@/components/features/learn/ChapterView";
import Link from "next/link";

export default function CourseDetailPage() {
  const params = useParams();
  // Data fetching handled by hook
  const { course, enrichedChapters, isLoading } = useCourseDetail(params.courseId as string);

  if (isLoading) return <div className="p-20 text-center animate-pulse text-white">Loading Syllabus...</div>;
  if (!course) return <div className="p-20 text-center text-white">Course Not Found</div>;

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      <div className="mb-10">
        <Link href="/learn">
            <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
                <ArrowLeft size={16} className="mr-2"/> Back to Paths
            </Button>
        </Link>
        
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-bold mb-2 text-white">{course.title}</h1>
                <p className="text-text-muted text-lg max-w-2xl">{course.description}</p>
            </div>
            <div className="hidden md:block">
                <div className="bg-surfaceHighlight p-4 rounded-xl border border-white/5 text-center min-w-[150px]">
                    <Trophy className="mx-auto mb-2 text-yellow-500" />
                    <div className="text-xs text-text-muted uppercase tracking-wider">Total Chapters</div>
                    <div className="text-2xl font-bold text-white">{course.totalChapters}</div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-4xl">
        {enrichedChapters.map((item, idx) => (
            <ChapterView 
                key={item.chapter.id}
                index={idx}
                title={item.chapter.title}
                description={item.chapter.description}
                challenges={item.challenges}
            />
        ))}

        {enrichedChapters.length === 0 && (
            <div className="p-10 text-center border border-dashed border-white/10 rounded-xl text-text-muted">
                Konten untuk kursus ini sedang disusun (Coming Soon).
            </div>
        )}
      </div>
    </div>
  );
}