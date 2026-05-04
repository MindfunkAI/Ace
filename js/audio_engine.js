import { appState } from './state.js';

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.nextStepTime = 0;
        this.currentStep = 0;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.nextStepTime = this.ctx.currentTime;
        this.scheduler();
        this.initialized = true;
    }

    scheduler() {
        while (this.nextStepTime < this.ctx.currentTime + 0.1) {
            this.scheduleStep(this.currentStep, this.nextStepTime);
            this.advanceStep();
        }
        setTimeout(() => this.scheduler(), 25);
    }

    advanceStep() {
        const secondsPerBeat = 60.0 / appState.state.bpm / 4; // 16th notes
        this.nextStepTime += secondsPerBeat;
        this.currentStep = (this.currentStep + 1) % 16;
        appState.update('currentStep', this.currentStep);
    }

    scheduleStep(step, time) {
        if (appState.state.steps[step]) {
            this.playTone(time);
        }
    }

    playTone(time) {
        const osc = this.ctx.createOscillator();
        const amp = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        const freq = 110 * Math.pow(2, (appState.state.pitch || 0) / 12);
        osc.frequency.setValueAtTime(freq, time);
        osc.type = 'sawtooth';

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(appState.state.cutoff, time);
        filter.frequency.exponentialRampToValueAtTime(100, time + 0.1);

        amp.gain.setValueAtTime(0.15, time);
        amp.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        osc.connect(filter);
        filter.connect(amp);
        amp.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.1);
    }
}
export const audioEngine = new AudioEngine();
