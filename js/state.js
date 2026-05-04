class StateManager extends EventTarget {
    constructor() {
        super();
        this.state = { 
            isRendering: false,
            pitch: 0,
            cutoff: 1000,
            resonance: 15,
            drive: 0,
            wavefold: 0,
            reverb: 20
        };
    }
    update(key, val) {
        this.state[key] = parseFloat(val);
        this.dispatchEvent(new CustomEvent('change', { detail: this.state }));
    }
}
export const appState = new StateManager();
