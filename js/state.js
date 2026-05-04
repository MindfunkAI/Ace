class StateManager extends EventTarget {
    constructor() {
        super();
        this.state = {
            bpm: 124, swing: 0, currentStep: 0,
            pitch: 0, cutoff: 2000, res: 10,
            fmAmount: 0, fmFreq: 2, bitcrush: 0,
            sidechain: 50, reverb: 30, delay: 30,
            glitchActive: false,
            tracks: {
                synth: new Array(16).fill(false),
                kick: new Array(16).fill(false),
                snare: new Array(16).fill(false),
                hats: new Array(16).fill(false)
            }
        };
    }
    update(key, val) {
        this.state[key] = parseFloat(val);
        this.dispatchEvent(new CustomEvent('change', { detail: this.state }));
    }
    toggleStep(track, index) {
        this.state.tracks[track][index] = !this.state.tracks[track][index];
        this.dispatchEvent(new CustomEvent('change', { detail: this.state }));
    }
}
export const appState = new StateManager();
