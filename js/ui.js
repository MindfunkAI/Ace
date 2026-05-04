import { appState } from './state.js';
import { api } from './api.js';
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('text-[#ccff00]', 'border-b-2'));
            tab.classList.add('text-[#ccff00]', 'border-b-2');
            views.forEach(v => v.classList.add('hidden'));
            document.getElementById(tab.dataset.target).classList.remove('hidden');
        });
    });
    document.getElementById('btn-render').addEventListener('click', () => api.render());
});
