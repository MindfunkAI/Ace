import { appState } from './state.js';

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.analyser = null;
        this.masterGain = null;
        this.initialized = false;
        this.nextStepTime = 0;
        this.currentStep = 0;
    }

    init() {
        if (this.initialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
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
        const s = appState.state;
        const baseNote = 60.0 / s.bpm / 4;
        // Swing logica: elke even stap wordt vertraagd
        const isEven = this.currentStep % 2 === 1;
        const swingOffset = isEven ? (s.swing / 100) * baseNote : 0;
        
        this.nextStepTime += baseNote + swingOffset;
        this.currentStep = (this.currentStep + 1) % 16;
        appState.update('currentStep', this.currentStep);
    }

    scheduleStep(step, time) {
        const t = appState.state.tracks;
        if (t.kick[step]) this.playKick(time);
        if (t.snare[step]) this.playSnare(time);
        if (t.hats[step]) this.playHats(time);
        if (t.synth[step]) this.playSynth(time);
    }

    playKick(time) {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
        g.gain.setValueAtTime(1, time);
        g.gain.linearRampToValueAtTime(0, time + 0.2);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(time); osc.stop(time + 0.2);
        
        // Sidechain trigger: Master gain even omlaag
        const sc = appState.state.sidechain / 100;
        this.masterGain.gain.setTargetAtTime(1 - sc, time, 0.01);
        this.masterGain.gain.setTargetAtTime(1, time + 0.1, 0.05);
    }

    playSynth(time) {
        const s = appState.state;
        const carrier = this.ctx.createOscillator();
        const modulator = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const g = this.ctx.createGain();

        // FM Synthesis core
        carrier.type = 'sawtooth';
        const freq = 110 * Math.pow(2, s.pitch / 12);
        carrier.frequency.setValueAtTime(freq, time);
        
        modulator.frequency.setValueAtTime(freq * s.fmFreq, time);
        modGain.gain.setValueAtTime(s.fmAmount * 10, time);
        
        modulator.connect(modGain);
        modGain.connect(carrier.frequency);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(s.cutoff, time);
        filter.Q.value = s.res;

        g.gain.setValueAtTime(0.2, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

        carrier.connect(filter);
        filter.connect(g);
        g.connect(this.masterGain);

        modulator.start(time); carrier.start(time);
        modulator.stop(time + 0.2); carrier.stop(time + 0.2);
    }

    playSnare(time) { /* Noise Snare Logic */ }
    playHats(time) { /* Noise Hats Logic */ }
}
export const audioEngine = new AudioEngine();
