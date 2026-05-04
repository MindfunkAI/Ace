class StateManager extends EventTarget {
    constructor() { super(); this.state = { isRendering: false }; }
    update(key, val) { this.state[key] = val; this.dispatchEvent(new CustomEvent('change', { detail: this.state })); }
}
export const appState = new StateManager();
