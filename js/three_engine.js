import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { appState } from './state.js';

let scene, camera, renderer, cube, clock;

const init3D = () => {
    const container = document.getElementById('3d-container');
    if (!container) return;
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(3, 0.8, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const animate = () => {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Flyover Logica: Camera beweegt in een achtje rond de unit
        camera.position.x = Math.sin(t * 0.5) * 5;
        camera.position.z = Math.cos(t * 0.3) * 5;
        camera.position.y = 2 + Math.sin(t * 0.2);
        camera.lookAt(0, 0, 0);

        cube.rotation.y += 0.002;
        renderer.render(scene, camera);
    };
    animate();
};
document.addEventListener('DOMContentLoaded', () => setTimeout(init3D, 200));
