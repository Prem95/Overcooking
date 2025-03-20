import * as THREE from 'three';
import gameState, { setGameLoaded } from './state.js';
import { createKitchenLayout } from './entities/kitchen.js';
import { createPlayer, updatePlayerPosition } from './entities/player.js';
import { setupControls, setupMobileControls } from './systems/controls.js';

// Wait for DOM to load
window.addEventListener('DOMContentLoaded', init);

function init() {
    console.log("Initializing game...");
    
    // Create a canvas element for the game
    const container = document.getElementById('gameContainer');
    if (!container) {
        console.error("Game container not found!");
        return;
    }
    
    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    container.appendChild(canvas);
    
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
        canvas: canvas,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Initialize game components
    createKitchenLayout(scene);
    createPlayer(scene);
    setupControls();
    setupMobileControls();

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
        
        // Update player position based on inputs
        updatePlayerPosition(scene);
        
        renderer.render(scene, camera);
    }

    animate();
    
    // Log to console for debugging
    console.log("Game initialized successfully");
    
    // Set flag to indicate game has loaded
    setGameLoaded();
} 