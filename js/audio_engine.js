import { appState } from './state.js';

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.nextStepTime = 0;
        this.currentStep = 0;
        this.initialized = false;
        this.delayNode = null;
        this.delayFeedback = null;
    }

    init() {
        if (this.initialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Master Delay Chain
        this.delayNode = this.ctx.createDelay(1.0);
        this.delayFeedback = this.ctx.createGain();
        this.delayNode.delayTime.value = 0.375; // Dotted 8th op 124 BPM
        
        this.delayNode.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);
        this.delayNode.connect(this.ctx.destination);

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
        const tracks = appState.state.tracks;
        if (tracks.kick[step]) {
            this.playKick(time);
            // Trigger visual pulse
            appState.update('lastKickTime', time);
        }
        if (tracks.snare[step]) this.playSnare(time);
        if (tracks.hats[step]) this.playHats(time);
        if (tracks.synth[step]) this.playSynth(time);
    }

    playKick(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);
        gain.gain.setValueAtTime(1.0, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.3);
    }

    playSynth(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.value = 110 * Math.pow(2, (appState.state.pitch || 0) / 12);
        
        // LFO Modulatie op Filter
        filter.type = 'lowpass';
        filter.frequency.value = appState.state.cutoff;
        lfo.frequency.value = appState.state.lfoSpeed;
        lfoGain.gain.value = appState.state.cutoff * 0.5;
        
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

        osc.connect(filter);
        filter.connect(gain);
        
        // Connect naar Master & Delay
        gain.connect(this.ctx.destination);
        this.delayFeedback.gain.value = appState.state.delay / 100;
        gain.connect(this.delayNode);

        lfo.start(time);
        osc.start(time);
        osc.stop(time + 0.2);
        lfo.stop(time + 0.2);
    }

    // Snare en Hats blijven gelijk aan vorige versie voor stabiliteit
    playSnare(time) { /* ... snare logic ... */ }
}
export const audioEngine = new AudioEngine();
