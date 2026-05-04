import { appState } from './state.js';
import { audioEngine } from './audio_engine.js';

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sequencer-grid');
    const stepDisplay = document.getElementById('current-step-display');

    // Genereer 16 pads
    for (let i = 0; i < 16; i++) {
        const pad = document.createElement('div');
        pad.classList.add('step-pad');
        pad.dataset.index = i;
        pad.addEventListener('click', () => {
            appState.toggleStep(i);
            pad.classList.toggle('on');
        });
        grid.appendChild(pad);
    }

    // Luister naar state changes voor visual sync
    appState.addEventListener('change', (e) => {
        const state = e.detail;
        stepDisplay.textContent = state.currentStep + 1;
        
        const pads = document.querySelectorAll('.step-pad');
        pads.forEach((pad, i) => {
            pad.classList.toggle('current', i === state.currentStep);
        });
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            const mode = tab.dataset.target;
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('text-[#ccff00]', 'border-b-2'));
            tab.classList.add('text-[#ccff00]', 'border-b-2');
            document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
            document.getElementById(mode).classList.remove('hidden');
        });
    });

    // Faders
    document.querySelectorAll('.tactical-fader').forEach(fader => {
        fader.addEventListener('input', (e) => {
            appState.update(e.target.dataset.param, parseFloat(e.target.value));
            document.getElementById(`val-${e.target.dataset.param}`).textContent = e.target.value;
        });
    });

    document.getElementById('btn-render').addEventListener('click', () => {
        audioEngine.init();
        document.getElementById('btn-render').textContent = "ENGINE RUNNING";
        document.getElementById('btn-render').classList.add('opacity-50');
    });
});
