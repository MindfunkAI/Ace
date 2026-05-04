import { appState } from './state.js';
import { api } from './api.js';
import { audioEngine } from './audio_engine.js';

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

    document.querySelectorAll('.tactical-fader').forEach(fader => {
        fader.addEventListener('input', (e) => {
            const param = e.target.dataset.param;
            const val = e.target.value;
            appState.update(param, val);
            audioEngine.updateParams(appState.state);
            
            const label = document.getElementById(`val-${param}`);
            if (label) label.textContent = (param === 'cutoff') ? `${val}Hz` : `${val}%`;
        });
    });

    document.getElementById('btn-render').addEventListener('click', () => {
        audioEngine.init();
        api.render();
    });
});
