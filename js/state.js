class StateManager extends EventTarget {
    constructor() {
        super();
        this.state = { 
            isRendering: false,
            pitch: 0,
            cutoff: 1000,
            drive: 0,
            bpm: 124,
            currentStep: 0,
            tracks: {
                synth: new Array(16).fill(false),
                kick: new Array(16).fill(false),
                snare: new Array(16).fill(false),
                hats: new Array(16).fill(false)
            }
        };
    }
    update(key, val) {
        this.state[key] = val;
        this.dispatchEvent(new CustomEvent('change', { detail: this.state }));
    }
    toggleStep(track, index) {
        this.state.tracks[track][index] = !this.state.tracks[track][index];
        this.dispatchEvent(new CustomEvent('change', { detail: this.state }));
    }
}
export const appState = new StateManager();
