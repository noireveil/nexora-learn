import { useState, useEffect } from "react";
import { getEnrichedCourseData } from "@/services/courseService";
import { Course, Chapter } from "@/lib/content/courses";
import { EnrichedChallenge } from "@/components/features/learn/ChapterView";

export const useCourseDetail = (courseId: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [enrichedChapters, setEnrichedChapters] = useState<{ chapter: Chapter, challenges: EnrichedChallenge[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await getEnrichedCourseData(courseId);
      if (data) {
        setCourse(data.course);
        setEnrichedChapters(data.enrichedChapters);
      }
      setIsLoading(false);
    };

    if (courseId) loadData();
  }, [courseId]);

  return { course, enrichedChapters, isLoading };
};