import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Orthographic camera for 2D top-down view
const aspectRatio = window.innerWidth / window.innerHeight;
const viewSize = 10; // The height of the viewable area in units
const camera = new THREE.OrthographicCamera(
    -viewSize * aspectRatio / 2, // left
    viewSize * aspectRatio / 2,  // right
    viewSize / 2,                // top
    -viewSize / 2,               // bottom
    1,                           // near
    1000                         // far
);
camera.position.z = 10;

// Renderer setup targeting the canvas
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('gameCanvas'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Add a simple 2D shape (a square) to the scene
const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const square = new THREE.Mesh(geometry, material);
scene.add(square);

// Handle window resize
window.addEventListener('resize', () => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    
    camera.left = -viewSize * aspectRatio / 2;
    camera.right = viewSize * aspectRatio / 2;
    camera.top = viewSize / 2;
    camera.bottom = -viewSize / 2;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate(); 