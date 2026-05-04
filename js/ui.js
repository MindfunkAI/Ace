import { appState } from './state.js';
import { audioEngine } from './audio_engine.js';

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sequencer-grid');
    const trackNames = ['kick', 'snare', 'hats', 'synth'];

    trackNames.forEach(track => {
        const rowLabel = document.createElement('div');
        rowLabel.className = "text-[8px] text-zinc-600 self-center uppercase font-bold";
        rowLabel.textContent = track;
        grid.appendChild(rowLabel);
        for (let i = 0; i < 16; i++) {
            const pad = document.createElement('div');
            pad.className = `step-pad track-${track}`;
            pad.dataset.step = i; pad.dataset.track = track;
            pad.addEventListener('click', () => {
                appState.toggleStep(track, i);
                pad.classList.toggle('on');
            });
            grid.appendChild(pad);
        }
    });

    appState.addEventListener('change', (e) => {
        const pads = document.querySelectorAll('.step-pad');
        pads.forEach(pad => {
            const step = parseInt(pad.dataset.step);
            pad.classList.toggle('current', step === e.detail.currentStep);
        });
    });

    document.getElementById('btn-glitch').addEventListener('click', () => {
        const active = !appState.state.glitchActive;
        appState.update('glitchActive', active);
        document.getElementById('btn-glitch').classList.toggle('bg-red-900', active);
        document.getElementById('btn-glitch').classList.toggle('text-white', active);
        document.getElementById('btn-glitch').textContent = active ? "MALFUNCTION_ACTIVE" : "GLITCH_SYSTEM";
    });

    document.getElementById('btn-render').addEventListener('click', () => {
        audioEngine.init();
        document.getElementById('btn-render').textContent = "SYSTEM ONLINE";
    });
});
