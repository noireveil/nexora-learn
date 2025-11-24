import * as tf from '@tensorflow/tfjs';

// Initialize backend. Prioritizes WebGL for performance.
export const initTFBackend = async () => {
    try {
        await tf.setBackend('webgl'); 
        await tf.ready();
        console.log(`TFJS Backend: ${tf.getBackend()}`);
    } catch (error) {
        console.error("TFJS init failed, falling back:", error);
        // TODO: Add CPU/WASM fallback logic here
    }
};

// Memory management helper to prevent leaks
export const cleanTensors = (tensors: tf.Tensor[]) => {
    tensors.forEach(t => t.dispose());
};