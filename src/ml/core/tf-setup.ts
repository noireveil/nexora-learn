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
    } catch (error) {
        try {
            await tf.setBackend('cpu');
            await tf.ready();
        } catch (cpuError) {
            console.error("TFJS Initialization failed", cpuError);
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