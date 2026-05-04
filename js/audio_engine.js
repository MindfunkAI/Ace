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
        const tracks = appState.state.tracks;
        if (tracks.synth[step]) this.playSynth(time);
        if (tracks.kick[step]) this.playKick(time);
        if (tracks.snare[step]) this.playSnare(time);
        if (tracks.hats[step]) this.playHats(time);
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

    playSnare(time) {
        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(time);
    }

    playHats(time) {
        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 8000;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(time);
    }

    playSynth(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = 110 * Math.pow(2, (appState.state.pitch || 0) / 12);
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.15);
    }
}
export const audioEngine = new AudioEngine();
