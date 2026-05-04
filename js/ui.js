import { appState } from './state.js';
import { api } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const mode = tab.dataset.target;
            tabs.forEach(t => t.classList.remove('text-[#ccff00]', 'border-b-2'));
            tab.classList.add('text-[#ccff00]', 'border-b-2');
            views.forEach(v => v.classList.add('hidden'));
            document.getElementById(mode).classList.remove('hidden');

            if (window.setVisualMode) {
                if (mode === 'view-3d') window.setVisualMode('pbr');
                if (mode === 'view-producer') window.setVisualMode('glitch');
                if (mode === 'view-dashboard') window.setVisualMode('vector');
            }
        });
    });

    // Fader handling
    const faders = document.querySelectorAll('.tactical-fader');
    faders.forEach(fader => {
        fader.addEventListener('input', (e) => {
            const param = e.target.dataset.param;
            const val = e.target.value;
            
            // Update State
            appState.update(param, val);

            // Update Label visuals
            const label = document.getElementById(`val-${param}`);
            if (label) {
                if (param === 'cutoff') label.textContent = `${val}Hz`;
                else if (param === 'pitch') label.textContent = val > 0 ? `+${val}` : val;
                else label.textContent = `${val}%`;
            }
        });
    });

    document.getElementById('btn-render').addEventListener('click', () => api.render());
});
