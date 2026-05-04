import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { appState } from './state.js';

let scene, camera, renderer, cube, spot, clock;

const init3D = () => {
    const container = document.getElementById('3d-container');
    if (!container) return;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    spot = new THREE.SpotLight(0xccff00, 5);
    spot.position.set(2, 5, 2);
    scene.add(spot);

    const geometry = new THREE.BoxGeometry(3, 0.8, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const animate = () => {
        requestAnimationFrame(animate);
        const state = appState.state;
        
        // Kick Pulse Logic: bereken de 'leeftijd' van de laatste kick
        const now = renderer.info.render.frame * 0.016; // Simpele tijd-indicatie
        const timeSinceKick = now % 0.5; // Korte decay curve
        
        const pulse = Math.exp(-timeSinceKick * 10); // Snelle daling
        const scale = 1 + (pulse * 0.1); 
        cube.scale.set(scale, scale, scale);
        spot.intensity = 5 + (pulse * 20);

        cube.rotation.y += 0.005;
        renderer.render(scene, camera);
    };
    animate();
};
document.addEventListener('DOMContentLoaded', () => setTimeout(init3D, 200));
