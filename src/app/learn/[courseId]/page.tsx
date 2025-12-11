'use client';

import { useParams } from "next/navigation";
import { useCourseDetail } from "@/hooks/useCourseDetail"; 
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, Lock, FileCode } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export default function CourseDetailPage() {
  const params = useParams();
  const { course, enrichedChapters, isLoading } = useCourseDetail(params.courseId as string);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-text-muted">Memuat Silabus...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center">Kursus tidak ditemukan</div>;

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen max-w-4xl">
      <div className="mb-12">
        <Link href="/learn">
            <Button variant="ghost" size="sm" className="mb-6 pl-0 hover:bg-transparent hover:pl-2">
                <ArrowLeft size={16} className="mr-2"/> Kembali ke Daftar Kursus
            </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-4xl font-black text-primary mb-3 tracking-tight">{course.title}</h1>
                <p className="text-text-muted text-lg max-w-2xl leading-relaxed">{course.description}</p>
            </div>
            <div className="bg-surfaceHighlight px-5 py-3 rounded-xl border border-gray-200 text-center min-w-[120px]">
                <div className="text-3xl font-black text-text-main">{course.totalChapters}</div>
                <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Bab Materi</div>
            </div>
        </div>
      </div>

      <div className="space-y-10">
        {enrichedChapters.map((item, idx) => (
            <div key={item.chapter.id} className="relative">
                {idx !== enrichedChapters.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-[-40px] w-0.5 bg-gray-200 -z-10" />
                )}

                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-lg shadow-sm z-10 shrink-0">
                        {idx + 1}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-main">{item.chapter.title}</h3>
                        <p className="text-text-muted text-sm">{item.chapter.description}</p>
                    </div>
                </div>

                <div className="pl-16 space-y-3">
                    {item.challenges.map((challenge) => (
                        <Link 
                            key={challenge.id} 
                            href={challenge.status === 'LOCKED' ? '#' : `/challenge/${challenge.id}`}
                            className={cn("block", challenge.status === 'LOCKED' && "pointer-events-none")}
                        >
                            <Card className={cn(
                                "p-4 flex items-center justify-between group transition-all duration-200 border-gray-200",
                                challenge.status === 'LOCKED' ? "bg-gray-50 opacity-60" : "hover:border-primary/40 hover:shadow-md cursor-pointer",
                                challenge.status === 'COMPLETED' ? "bg-green-50/50 border-green-200" : "bg-white"
                            )}>
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                        challenge.status === 'COMPLETED' ? "bg-green-100 text-green-600" :
                                        challenge.status === 'LOCKED' ? "bg-gray-200 text-gray-400" :
                                        "bg-primary/10 text-primary"
                                    )}>
                                        {challenge.status === 'COMPLETED' ? <CheckCircle2 size={20}/> : 
                                         challenge.status === 'LOCKED' ? <Lock size={20}/> :
                                         <FileCode size={20}/>}
                                    </div>
                                    
                                    <div>
                                        <h4 className={cn(
                                            "font-semibold text-sm md:text-base",
                                            challenge.status === 'COMPLETED' ? "text-green-800" : "text-text-main"
                                        )}>
                                            {challenge.title}
                                        </h4>
                                        <span className="text-xs text-text-muted">
                                            {challenge.status === 'COMPLETED' ? 'Selesai' : 
                                             challenge.status === 'LOCKED' ? 'Terkunci' : 'Tersedia'}
                                        </span>
                                    </div>
                                </div>

                                {challenge.status !== 'LOCKED' && (
                                    <Button size="sm" variant={challenge.status === 'COMPLETED' ? 'secondary' : 'primary'} className="h-9 px-4 text-xs">
                                        {challenge.status === 'COMPLETED' ? 'Ulangi' : 'Mulai'}
                                    </Button>
                                )}
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}