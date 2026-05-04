import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { appState } from './state.js';
import { audioEngine } from './audio_engine.js';

let scene, camera, renderer, cube, analyser, dataArray;

const init3D = () => {
    const container = document.getElementById('3d-container');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geo = new THREE.IcosahedronGeometry(2, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0xccff00, wireframe: true });
    cube = new THREE.Mesh(geo, mat);
    scene.add(cube);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const animate = () => {
        requestAnimationFrame(animate);
        if(audioEngine.analyser) {
            dataArray = new Uint8Array(audioEngine.analyser.frequencyBinCount);
            audioEngine.analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a,b) => a+b) / dataArray.length;
            cube.scale.set(1 + avg/100, 1 + avg/100, 1 + avg/100);
            cube.rotation.y += 0.01;
        }
        renderer.render(scene, camera);
    };
    animate();
};
document.addEventListener('DOMContentLoaded', () => setTimeout(init3D, 200));
