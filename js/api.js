import { appState } from './state.js';
export const api = { async render() { appState.update('isRendering', true); setTimeout(() => appState.update('isRendering', false), 2000); } };
