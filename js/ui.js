import { appState } from './state.js';
import { api } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const mode = tab.dataset.target; // dashboard, producer, 3d
            
            tabs.forEach(t => t.classList.remove('text-[#ccff00]', 'border-b-2'));
            tab.classList.add('text-[#ccff00]', 'border-b-2');
            views.forEach(v => v.classList.add('hidden'));
            document.getElementById(mode).classList.remove('hidden');

            // Koppel tabs aan 3D visual modes
            if (mode === 'view-3d') window.setVisualMode('pbr');
            if (mode === 'view-producer') window.setVisualMode('glitch');
            if (mode === 'view-dashboard') window.setVisualMode('vector');
        });
    });

    document.getElementById('btn-render').addEventListener('click', () => api.render());
});
