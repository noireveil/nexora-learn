import * as tf from '@tensorflow/tfjs';

const generateSyntheticData = (numSamples: number) => {
    const inputs: number[][] = [];
    const labels: number[][] = [];

    for (let i = 0; i < numSamples; i++) {
        const accuracy = Math.random(); 
        const time = Math.random();     
        const streak = Math.random();
        const hint = Math.random();     
        const difficulty = Math.random();

        inputs.push([accuracy, time, streak, hint, difficulty]);

        let target = [0, 1, 0]; 

        if (accuracy > 0.8 && time < 0.4 && hint < 0.3) {
            target = [0, 0, 1]; 
        } 
        else if (accuracy < 0.5 || time > 0.8) {
            target = [1, 0, 0];
        }

        labels.push(target);
    }

    return {
        xs: tf.tensor2d(inputs),
        ys: tf.tensor2d(labels)
    };
};

export const trainAndSaveModel = async () => {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({ units: 16, inputShape: [5], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

    model.compile({
        optimizer: tf.train.adam(0.01), 
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    const { xs, ys } = generateSyntheticData(2000);

    await model.fit(xs, ys, {
        epochs: 50, 
        shuffle: true
    });

    await model.save('downloads://skill-predictor-model');
    
    xs.dispose();
    ys.dispose();
};