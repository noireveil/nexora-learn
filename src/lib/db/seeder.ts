import { db } from './schema';
import { allChallenges } from '@/data/challanges';

const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const seedDatabase = async () => {
    try {
        const count = await db.challenges.count();
        
        if (count > 0 && count !== allChallenges.length) {
             await db.challenges.clear(); 
        } else if (count > 0) {
             return;
        }
        
        const batches = chunkArray(allChallenges, 50);

        for (const batch of batches) {
            const sanitizedBatch = batch.map((c: any) => ({
                id: c.id,
                title: c.title,
                topic: c.topic,
                difficulty: c.difficulty,
                description: c.description,
                starterCode: c.starterCode,
                testCases: c.testCases || [],
                hints: c.hints || [],
                xpReward: c.xpReward || 50
            }));

            await db.challenges.bulkPut(sanitizedBatch);
        }
    } catch (error) {
        console.error("Seeding failed:", error);
    }
};