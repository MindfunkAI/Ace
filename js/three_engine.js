import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { appState } from './state.js';

let scene, camera, renderer, cube, wireframe, clock;
let currentMode = 'pbr'; // pbr, glitch, vector

const init3D = () => {
    const container = document.getElementById('3d-container');
    if (!container) return;

    clock = new THREE.Clock();
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#050505');

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lichtsysteem (PBR focus)
    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambient);

    const spot = new THREE.SpotLight(0xccff00, 15);
    spot.position.set(2, 5, 2);
    scene.add(spot);

    // De Main Unit (PBR Hardware)
    const geometry = new THREE.BoxGeometry(3, 0.8, 2);
    const pbrMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        metalness: 0.9, 
        roughness: 0.2,
        emissive: 0x000000 
    });
    cube = new THREE.Mesh(geometry, pbrMat);
    scene.add(cube);

    // Vector Overlay (Wireframe)
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xccff00, transparent: true, opacity: 0 });
    wireframe = new THREE.LineSegments(edges, lineMat);
    scene.add(wireframe);

    const animate = () => {
        requestAnimationFrame(animate);
        const delta = clock.getElapsedTime();

        // Mode Switching Logica
        if (currentMode === 'glitch') {
            cube.rotation.y += 0.05 * Math.sin(delta * 10); // Vibratie effect
            cube.material.emissive.setHex(Math.random() > 0.9 ? 0x00ffff : 0x000000);
        } else if (currentMode === 'vector') {
            cube.material.opacity = 0.1;
            cube.material.transparent = true;
            wireframe.material.opacity = 1;
            cube.rotation.y += 0.005;
        } else {
            // PBR Mode
            cube.material.opacity = 1;
            cube.material.transparent = false;
            wireframe.material.opacity = 0;
            cube.rotation.y += 0.005;
            cube.material.emissive.setHex(0x000000);
        }

        renderer.render(scene, camera);
    };
    animate();
};

// Luister naar mode switches vanuit de UI
window.setVisualMode = (mode) => {
    currentMode = mode;
    console.log(`Visual Mode Switched to: ${mode}`);
};

document.addEventListener('DOMContentLoaded', () => setTimeout(init3D, 200));
