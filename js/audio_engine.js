import { appState } from './state.js';

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.osc = null;
        this.filter = null;
        this.dist = null;
        this.gain = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        this.osc = this.ctx.createOscillator();
        this.filter = this.ctx.createBiquadFilter();
        this.dist = this.ctx.createWaveShaper();
        this.gain = this.ctx.createGain();

        this.osc.type = 'sawtooth';
        this.filter.type = 'lowpass';
        this.gain.gain.value = 0.2;

        this.osc.connect(this.filter);
        this.filter.connect(this.dist);
        this.dist.connect(this.gain);
        this.gain.connect(this.ctx.destination);

        this.osc.start();
        this.initialized = true;
        console.log("AUDIO_CORE: ONLINE");
    }

    updateParams(state) {
        if (!this.initialized) return;
        
        // Pitch mapping
        const freq = 110 * Math.pow(2, (state.pitch || 0) / 12);
        this.osc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);

        // Filter mapping
        this.filter.frequency.setTargetAtTime(state.cutoff || 1000, this.ctx.currentTime, 0.1);
        this.filter.Q.setTargetAtTime((state.resonance || 15) / 5, this.ctx.currentTime, 0.1);

        // Drive (Distortion)
        if (state.drive > 0) {
            this.dist.curve = this.makeDistortionCurve(state.drive);
        } else {
            this.dist.curve = null;
        }
    }

    makeDistortionCurve(amount) {
        const k = amount * 2;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }
}

export const audioEngine = new AudioEngine();
