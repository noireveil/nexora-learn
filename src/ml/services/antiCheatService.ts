import { db } from '@/lib/db/schema';

interface SimilarityResult {
    isOriginal: boolean;
    similarityScore: number; 
    detectedPatterns?: string[];
}

const tokenizeCode = (code: string): string => {
    return code
        .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "") 
        .replace(/\s+/g, "") 
        .toLowerCase();
};

const calculateLevenshtein = (a: string, b: string): number => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      
                matrix[i][j - 1] + 1,      
                matrix[i - 1][j - 1] + cost 
            );
        }
    }
    return matrix[a.length][b.length];
};

export const checkPlagiarism = async (currentCode: string, challengeId: string, userId: string): Promise<SimilarityResult> => {
    const otherSubmissions = await db.submissions
        .where('challengeId').equals(challengeId)
        .filter(s => s.status === 'PASSED' && s.userId !== userId) 
        .toArray();
    
    if (otherSubmissions.length === 0) {
        return { isOriginal: true, similarityScore: 0 };
    }

    const cleanCurrent = tokenizeCode(currentCode);
    let maxSimilarity = 0;

    for (const sub of otherSubmissions) {
        if (!sub.code) continue;
        
        const cleanOther = tokenizeCode(sub.code);
        
        if (Math.abs(cleanCurrent.length - cleanOther.length) / cleanCurrent.length > 0.5) continue;

        const distance = calculateLevenshtein(cleanCurrent, cleanOther);
        const maxLength = Math.max(cleanCurrent.length, cleanOther.length);
        
        if (maxLength === 0) continue;

        const similarity = 1 - (distance / maxLength);
        
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
        }
    }
    
    const THRESHOLD = 0.95;
    
    return {
        isOriginal: maxSimilarity < THRESHOLD,
        similarityScore: maxSimilarity,
        detectedPatterns: maxSimilarity > THRESHOLD ? 
            [`Terdeteksi kemiripan ${(maxSimilarity*100).toFixed(1)}% dengan user lain di device ini.`] : []
    };
};