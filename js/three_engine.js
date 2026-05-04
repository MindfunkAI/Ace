import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const init3D = () => {
    const container = document.getElementById('3d-container');
    if (!container) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 100);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    const cube = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshStandardMaterial({color: 0xccff00}));
    scene.add(cube);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const animate = () => { requestAnimationFrame(animate); cube.rotation.x += 0.01; renderer.render(scene, camera); };
    animate();
};
document.addEventListener('DOMContentLoaded', () => setTimeout(init3D, 200));
