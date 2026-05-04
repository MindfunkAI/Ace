class StateManager extends EventTarget {
    constructor() {
        super();
        this.state = this.load() || { 
            pitch: 0, cutoff: 1000, delay: 30, bpm: 124,
            tracks: {
                synth: new Array(16).fill(false),
                kick: new Array(16).fill(false),
                snare: new Array(16).fill(false),
                hats: new Array(16).fill(false)
            }
        };
        this.state.currentStep = 0;
        this.state.glitchActive = false;
    }
    update(key, val) {
        this.state[key] = val;
        this.dispatchEvent(new CustomEvent('change', { detail: this.state }));
    }
    toggleStep(track, index) {
        this.state.tracks[track][index] = !this.state.tracks[track][index];
        this.dispatchEvent(new CustomEvent('change', { detail: this.state }));
    }
    save() {
        localStorage.setItem('ace_session', JSON.stringify(this.state));
        console.log("SYSTEM_STORAGE: SESSION_SAVED");
    }
    load() {
        const data = localStorage.getItem('ace_session');
        return data ? JSON.parse(data) : null;
    }
}
export const appState = new StateManager();
