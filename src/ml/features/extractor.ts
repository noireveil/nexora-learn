import { Progress, Submission } from '@/lib/db/schema';
import * as tf from '@tensorflow/tfjs';

export interface UserSkillVector {
    accuracyRate: number;    
    avgTimePerChallenge: number;
    streakImpact: number;    
    hintUsageRate: number;   
    difficultyLevel: number; 
}

// Transform user history into numeric features
export const extractUserFeatures = (
    progress: Progress | undefined, 
    recentSubmissions: Submission[]
): UserSkillVector => {
    if (!progress || recentSubmissions.length === 0) {
        return {
            accuracyRate: 0.5, 
            avgTimePerChallenge: 0.5,
            streakImpact: 0,
            hintUsageRate: 0,
            difficultyLevel: 0.33
        };
    }

    const passedCount = recentSubmissions.filter(s => s.status === 'PASSED').length;
    const accuracyRate = passedCount / recentSubmissions.length;

    const totalTime = recentSubmissions.reduce((acc, curr) => acc + (curr.timeSpent || 60), 0);
    const avgTimeRaw = totalTime / recentSubmissions.length;
    const avgTimePerChallenge = Math.min(avgTimeRaw / 300, 1.0);

    const streakImpact = Math.min((progress.currentStreak || 0) / 10, 1.0);
    const totalHints = recentSubmissions.reduce((acc, curr) => acc + (curr.hintsUsed || 0), 0);
    const hintUsageRate = Math.min((totalHints / recentSubmissions.length) / 3, 1.0);

    const difficultyLevel = Math.min((progress.level || 1) / 10, 1.0);

    return {
        accuracyRate,
        avgTimePerChallenge,
        streakImpact,
        hintUsageRate,
        difficultyLevel
    };
};

// Convert features object to TF tensor
export const convertToTensor = (features: UserSkillVector): tf.Tensor2D => {
    return tf.tensor2d([[
        features.accuracyRate,
        features.avgTimePerChallenge,
        features.streakImpact,
        features.hintUsageRate,
        features.difficultyLevel
    ]]);
};