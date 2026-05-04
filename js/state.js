class StateManager extends EventTarget {
    constructor() {
        super();
        this.state = { 
            isRendering: false,
            pitch: 0,
            cutoff: 1000,
            drive: 0,
            steps: new Array(16).fill(false),
            currentStep: 0,
            bpm: 124
        };
    }
    update(key, val) {
        this.state[key] = val;
        this.dispatchEvent(new CustomEvent('change', { detail: this.state }));
    }
    toggleStep(index) {
        this.state.steps[index] = !this.state.steps[index];
        this.dispatchEvent(new CustomEvent('change', { detail: this.state }));
    }
}
export const appState = new StateManager();
