import { db } from './schema';

// Idempotent seeder: Only runs if data is missing
export const seedDatabase = async () => {
    try {
        const count = await db.challenges.count();
        if (count > 0) return;

        console.log('🌱 Seeding initial database...');
        
        await db.challenges.bulkAdd([
            {
                id: 'js-var-01',
                title: 'Hello World Variable',
                description: 'Buatlah variabel bernama "message" yang berisi string "Hello Nexora".',
                difficulty: 'Easy',
                topic: 'Variables',
                starterCode: '// Tulis kodemu di sini\n',
                xpReward: 100,
                testCases: [
                    { input: null, expected: 'Hello Nexora', description: 'Variable message must equal "Hello Nexora"' }
                ]
            },
            {
                id: 'js-loop-01',
                title: 'Basic For Loop',
                description: 'Buat fungsi sumUp(n) yang menjumlahkan angka 1 sampai n.',
                difficulty: 'Medium',
                topic: 'Loops',
                starterCode: 'function sumUp(n) {\n  // Code here\n}',
                xpReward: 200,
                testCases: [
                    { input: 5, expected: 15, description: 'sumUp(5) should return 15' },
                    { input: 3, expected: 6, description: 'sumUp(3) should return 6' }
                ]
            }
        ]);
        
        console.log('✅ Database seeding completed.');
    } catch (error) {
        console.error("❌ Database seeding failed:", error);
    }
};