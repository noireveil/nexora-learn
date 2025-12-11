import { db } from "@/lib/db/schema";
import { COURSES, Course, Chapter } from "@/lib/content/courses";
import { EnrichedChallenge } from "@/components/features/learn/ChapterView";

export const getCourseById = (courseId: string): Course | undefined => {
  return COURSES.find(c => c.id === courseId);
};

export const getCourseByChallengeId = (challengeId: string): string | null => {
    for (const course of COURSES) {
        for (const chapter of course.chapters) {
            if (chapter.challenges.includes(challengeId)) {
                return course.id;
            }
        }
    }
    return null;
};

export const getTotalChallengesInCourse = (courseId: string): number => {
    const course = getCourseById(courseId);
    if (!course) return 0;
    return course.chapters.reduce((acc, ch) => acc + ch.challenges.length, 0);
};

export const getChallengeById = async (challengeId: string) => {
  const challenges = await db.challenges.toArray();
  return challenges.find(c => c.id === challengeId) || challenges[0];
};

export const getNextChallengeId = (currentChallengeId: string): string | null => {
    const allChallengeIds: string[] = [];
    COURSES.forEach(course => {
        course.chapters.forEach(chapter => {
            allChallengeIds.push(...chapter.challenges);
        });
    });

    const currentIndex = allChallengeIds.indexOf(currentChallengeId);
    if (currentIndex !== -1 && currentIndex < allChallengeIds.length - 1) {
        return allChallengeIds[currentIndex + 1];
    }
    return null; 
};

export const getEnrichedCourseData = async (courseId: string) => {
  const course = getCourseById(courseId);
  if (!course) return null;

  const user = await db.users.orderBy('lastLogin').last();
  const completedIds = new Set<string>();

  if (user && user.id) {
    const submissions = await db.submissions.where('userId').equals(user.id).toArray();
    submissions.forEach(s => {
      if (s.status === 'PASSED') completedIds.add(s.challengeId);
    });
  }

  const allChallenges = await db.challenges.toArray();
  const challengeMap = new Map(allChallenges.map(c => [c.id, c.title]));

  const isCompleted = (id: string) => completedIds.has(id);

  const enrichedChapters = course.chapters.map((chapter, chapterIndex) => {
    let isPrevChapterFinished = true;

    if (chapterIndex > 0) {
        const prevChapter = course.chapters[chapterIndex - 1];
        if (prevChapter.challenges.length > 0) {
            const lastChallengeOfPrevChapter = prevChapter.challenges[prevChapter.challenges.length - 1];
            isPrevChapterFinished = isCompleted(lastChallengeOfPrevChapter);
        }
    }

    const chapterChallenges: EnrichedChallenge[] = chapter.challenges.map((challengeId, challengeIndex) => {
      const title = challengeMap.get(challengeId) || "Unknown Challenge";
      const challengeIsCompleted = isCompleted(challengeId);

      let isUnlocked = false;

      if (challengeIndex === 0) {
          if (chapterIndex === 0) {
              isUnlocked = true;
          } else {
              isUnlocked = isPrevChapterFinished;
          }
      } else {
          const prevChallengeId = chapter.challenges[challengeIndex - 1];
          isUnlocked = isCompleted(prevChallengeId);
      }

      let status: 'LOCKED' | 'OPEN' | 'COMPLETED' = 'LOCKED';

      if (challengeIsCompleted) {
        status = 'COMPLETED';
      } else if (isUnlocked) {
        status = 'OPEN';
      }

      return { id: challengeId, title, status };
    });

    return { chapter, challenges: chapterChallenges };
  });

  return { course, enrichedChapters };
};