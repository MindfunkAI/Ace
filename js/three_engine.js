import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { appState } from './state.js';

let scene, camera, renderer, cube, spot, clock;
let currentMode = 'pbr';

const init3D = () => {
    const container = document.getElementById('3d-container');
    if (!container) return;
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    spot = new THREE.SpotLight(0xccff00, 10);
    spot.position.set(2, 5, 2);
    scene.add(spot);

    const geometry = new THREE.BoxGeometry(3, 0.8, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.2 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const animate = () => {
        requestAnimationFrame(animate);
        const state = appState.state;
        const time = clock.getElapsedTime();

        // 3D Reactivity: Drive bepaalt 'vibratie' en Glitch
        const driveFactor = (state.drive / 100);
        cube.position.x = Math.sin(time * 50) * (driveFactor * 0.05);
        
        // Cutoff bepaalt lichtintensiteit
        spot.intensity = 5 + (state.cutoff / 2000);
        
        // Mode behavior
        if (currentMode === 'glitch') {
            cube.rotation.y += 0.01 + driveFactor;
            if (Math.random() < driveFactor * 0.1) {
                cube.position.y += 0.1; // Glitch jump
            } else {
                cube.position.y = 0;
            }
        } else {
            cube.rotation.y += 0.005;
            cube.position.y = 0;
        }

        renderer.render(scene, camera);
    };
    animate();
};
window.setVisualMode = (mode) => currentMode = mode;
document.addEventListener('DOMContentLoaded', () => setTimeout(init3D, 200));
