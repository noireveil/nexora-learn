import { db } from "@/lib/db/schema";
import { COURSES, Course, Chapter } from "@/lib/content/courses";
import { EnrichedChallenge } from "@/components/features/learn/ChapterView";

// Fetch static course data
export const getCourseById = (courseId: string): Course | undefined => {
  return COURSES.find(c => c.id === courseId);
};

// Fetch specific challenge from DB
export const getChallengeById = async (challengeId: string) => {
  const challenges = await db.challenges.toArray();
  return challenges.find(c => c.id === challengeId) || challenges[0];
};

// Merge static syllabus with user progress from DB
export const getEnrichedCourseData = async (courseId: string) => {
  const course = getCourseById(courseId);
  if (!course) return null;

  // Get latest user activity
  const user = await db.users.orderBy('lastLogin').last();
  const completedIds = new Set<string>();

  if (user && user.id) {
    const submissions = await db.submissions.where('userId').equals(user.id).toArray();
    submissions.forEach(s => {
      if (s.status === 'PASSED') completedIds.add(s.challengeId);
    });
  }

  // Map challenge titles
  const allChallenges = await db.challenges.toArray();
  const challengeMap = new Map(allChallenges.map(c => [c.id, c.title]));

  // Determine chapter status (Locked/Open/Completed)
  const enrichedChapters = course.chapters.map(chapter => {
    const chapterChallenges: EnrichedChallenge[] = chapter.challenges.map((challengeId, idx) => {
      const title = challengeMap.get(challengeId) || "Unknown Challenge";
      const isCompleted = completedIds.has(challengeId);

      // Sequential unlock logic
      const prevChallengeId = idx > 0 ? chapter.challenges[idx - 1] : null;
      const isPrevCompleted = prevChallengeId ? completedIds.has(prevChallengeId) : true;

      let status: 'LOCKED' | 'OPEN' | 'COMPLETED' = 'LOCKED';

      if (isCompleted) {
        status = 'COMPLETED';
      } else if (isPrevCompleted) {
        status = 'OPEN';
      }

      return { id: challengeId, title, status };
    });

    return { chapter, challenges: chapterChallenges };
  });

  return { course, enrichedChapters };
};