import { db } from '@/lib/db/schema';

interface SimilarityResult {
    isOriginal: boolean;
    similarityScore: number; 
    detectedPatterns?: string[];
}

// Normalize code for comparison
const tokenizeCode = (code: string): string => {
    return code
        .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "") // Hapus komentar JS/TS
        .replace(/\s+/g, "") // Hapus semua whitespace
        .toLowerCase();
};

// TODO: Implement Levenshtein distance algorithm
const calculateLevenshtein = (a: string, b: string): number => {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // deletion
                matrix[i][j - 1] + 1,      // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }
    return matrix[a.length][b.length];
};

export const checkPlagiarism = async (currentCode: string, challengeId: string, userId: string): Promise<SimilarityResult> => {
    // 1. Ambil submission user LAIN untuk soal yang sama
    const otherSubmissions = await db.submissions
        .where('challengeId').equals(challengeId)
        .filter(s => s.userId !== userId && s.status === 'PASSED')
        .toArray();
    
    const cleanCurrent = tokenizeCode(currentCode);
    let maxSimilarity = 0;

    // 2. Bandingkan satu per satu
    for (const sub of otherSubmissions) {
        if (!sub.code) continue;
        const cleanOther = tokenizeCode(sub.code);
        
        // Hitung jarak edit
        const distance = calculateLevenshtein(cleanCurrent, cleanOther);
        const maxLength = Math.max(cleanCurrent.length, cleanOther.length);
        
        if (maxLength === 0) continue;

        // Similarity = 1 - (Beda / Total Panjang)
        const similarity = 1 - (distance / maxLength);
        
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
        }
    }
    
    // Threshold 85% dianggap plagiat (sesuai proposal)
    const THRESHOLD = 0.85; 
    
    return {
        isOriginal: maxSimilarity < THRESHOLD,
        similarityScore: maxSimilarity,
        detectedPatterns: maxSimilarity > THRESHOLD ? ["High similarity with existing submission"] : []
    };
};