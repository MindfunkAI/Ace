export const audioEngine = {
    ctx: null,
    oscillator: null,
    gainNode: null,
    filter: null,

    init() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.value = 1000;

        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = 0;

        this.filter.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
    },

    start() {
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        this.oscillator = this.ctx.createOscillator();
        this.oscillator.type = 'sawtooth';
        this.oscillator.frequency.value = 55; // Deep Bass
        this.oscillator.connect(this.filter);
        this.oscillator.start();
        
        this.gainNode.gain.setTargetAtTime(0.5, this.ctx.currentTime, 0.1);
    },

    stop() {
        if (this.gainNode) {
            this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
            setTimeout(() => this.oscillator.stop(), 200);
        }
    },

    setParam(param, value) {
        if (!this.ctx) return;
        if (param === 'cutoff') this.filter.frequency.setTargetAtTime(value, this.ctx.currentTime, 0.05);
        if (param === 'resonance') this.filter.Q.setTargetAtTime(value, this.ctx.currentTime, 0.05);
    }
};
