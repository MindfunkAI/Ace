import { appState } from './state.js';
import { api } from './api.js';
import { audioEngine } from './audio_engine.js';

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view-panel');
    const renderBtn = document.getElementById('btn-render');
    let isPlaying = false;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const mode = tab.dataset.target;
            tabs.forEach(t => t.classList.remove('text-[#ccff00]', 'border-b-2'));
            tab.classList.add('text-[#ccff00]', 'border-b-2');
            views.forEach(v => v.classList.add('hidden'));
            document.getElementById(mode).classList.remove('hidden');
            if (window.setVisualMode) window.setVisualMode(mode === 'view-3d' ? 'pbr' : mode === 'view-producer' ? 'glitch' : 'vector');
        });
    });

    renderBtn.addEventListener('click', () => {
        if (!isPlaying) {
            audioEngine.start();
            renderBtn.textContent = "STOP LOOP";
            renderBtn.classList.add('bg-[#ccff00]', 'text-black');
            isPlaying = true;
        } else {
            audioEngine.stop();
            renderBtn.textContent = "RENDER LOOP";
            renderBtn.classList.remove('bg-[#ccff00]', 'text-black');
            isPlaying = false;
        }
    });

    // Sliders koppelen
    document.getElementById('slider-cutoff').addEventListener('input', (e) => {
        audioEngine.setParam('cutoff', parseFloat(e.target.value));
    });

    document.getElementById('slider-res').addEventListener('input', (e) => {
        audioEngine.setParam('resonance', parseFloat(e.target.value));
    });
});
