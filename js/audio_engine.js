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
        const secondsPerBeat = 60.0 / appState.state.bpm / 4;
        this.nextStepTime += secondsPerBeat;
        this.currentStep = (this.currentStep + 1) % 16;
        appState.update('currentStep', this.currentStep);
    }

    scheduleStep(step, time) {
        const s = appState.state;
        // Als Glitch aan staat, gooi de boel willekeurig omver
        let p = s.pitch;
        let c = s.cutoff;
        if (s.glitchActive && Math.random() > 0.5) {
            p = Math.floor(Math.random() * 24) - 12;
            c = Math.random() * 5000 + 200;
        }

        if (s.tracks.synth[step]) this.playSynth(time, p, c);
        if (s.tracks.kick[step]) this.playKick(time);
        if (s.tracks.snare[step]) this.playSnare(time);
        if (s.tracks.hats[step]) this.playHats(time);
    }

    playSynth(time, p, c) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = (appState.state.glitchActive && Math.random() > 0.8) ? 'square' : 'sawtooth';
        osc.frequency.setValueAtTime(110 * Math.pow(2, p / 12), time);
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.1);
    }

    playKick(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
        gain.gain.setValueAtTime(0.8, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.2);
    }
    
    playSnare(time) { /* Basic noise snare */ }
    playHats(time) { /* Basic noise hats */ }
}
export const audioEngine = new AudioEngine();
