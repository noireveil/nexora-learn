import * as tf from '@tensorflow/tfjs';
import { extractUserFeatures, convertToTensor } from '../features/extractor';
import { db } from '@/lib/db/schema';

const MODEL_URL = '/models/skill-predictor/model.json';
let model: tf.LayersModel | null = null;

// Dummy model creation for illustration; replace with actual model loading
const createDummyModel = () => {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 8, inputShape: [5], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' })); // 3 Output: Easy, Medium, Hard
    model.compile({ optimizer: 'sgd', loss: 'categoricalCrossentropy' });
    return model;
}

const loadModel = async () => {
    if (model) return model;
    
    try {
        model = await tf.loadLayersModel(MODEL_URL);
        console.log("Model loaded from URL");
    } catch (err) {
        console.warn("Model not found, using Fallback Dummy Model (Untrained)");
        model = createDummyModel();
    }
    return model;
};

export const predictNextDifficulty = async (userId: string): Promise<'Easy' | 'Medium' | 'Hard'> => {
    try {
        const progress = await db.progress.where('userId').equals(userId).first();
        const submissions = await db.submissions.where('userId').equals(userId).toArray();

        const features = extractUserFeatures(progress, submissions);
        
        const inputTensor = convertToTensor(features);
        
        const aiModel = await loadModel();
        if (!aiModel) return 'Easy';

        const prediction = aiModel.predict(inputTensor) as tf.Tensor;
        const resultIndex = prediction.argMax(1).dataSync()[0];

        inputTensor.dispose();
        prediction.dispose();

        const labels: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];
        return labels[resultIndex] || 'Medium';

    } catch (error) {
        console.error("Prediction Error:", error);
        return 'Medium'; // Fallback 
    }
};