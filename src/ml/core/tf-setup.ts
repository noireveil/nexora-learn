import * as tf from '@tensorflow/tfjs';

export const initTFBackend = async () => {
    try {
        await tf.setBackend('webgl');

        const backend = tf.backend() as any;
        
        if (backend?.getGPGPUContext) {
            const gl = backend.getGPGPUContext().gl;
            if (gl) {
                tf.env().set('WEBGL_CHECK_NUMERICS', false);
            }
        }
        
        await tf.ready();
        console.log(`[ML-Engine] Initialized: ${tf.getBackend()}`);
    } catch (error) {
        console.warn("[ML-Engine] WebGL failed, falling back to CPU", error);
        try {
            await tf.setBackend('cpu');
            await tf.ready();
        } catch (cpuError) {
            console.error("[ML-Engine] CRITICAL FAILURE: Could not initialize TFJS", cpuError);
        }
    }
};

export const cleanTensors = (tensors: (tf.Tensor | undefined | null)[]) => {
    tensors.forEach(t => {
        if (t && !t.isDisposed) {
            t.dispose();
        }
    });
};