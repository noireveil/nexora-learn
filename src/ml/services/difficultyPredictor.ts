import * as tf from '@tensorflow/tfjs';
import { extractUserFeatures, convertToTensor } from '../features/extractor';
import { db } from '@/lib/db/schema';

const MODEL_URL = '/models/skill-predictor/model.json';
let model: tf.LayersModel | null = null;

const loadModel = async () => {
    if (model) return model;
    
    try {
        // TODO: Load layers model from public URL
        // model = await tf.loadLayersModel(MODEL_URL);
        return null;
    } catch (err) {
        console.error("Model load error", err);
        return null;
    }
};

export const predictNextDifficulty = async (userId: string): Promise<'Easy' | 'Medium' | 'Hard'> => {
    const progress = await db.progress.where('userId').equals(userId).first() || null;
    const submissions = await db.submissions.where('userId').equals(userId).toArray();

    // TODO: Extract features from user history
    
    // TODO: Convert features to tensor
    
    // TODO: Run model prediction
    
    return 'Medium'; // Fallback
};