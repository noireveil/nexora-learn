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
    progress: Progress | null, 
    recentSubmissions: Submission[]
): UserSkillVector => {
    // TODO: Handle cold start for new users
    
    // TODO: Calculate accuracy rate (passed / total)

    // TODO: Normalize execution time (0.0 - 1.0)

    // TODO: Calculate streak impact

    return {
        accuracyRate: 0,
        avgTimePerChallenge: 0,
        streakImpact: 0,
        hintUsageRate: 0,
        difficultyLevel: 0
    };
};

// Convert features object to TF tensor
export const convertToTensor = (features: UserSkillVector): tf.Tensor2D => {
    // TODO: Map features to 2D tensor [1, 5]
    return tf.tensor2d([]); 
};