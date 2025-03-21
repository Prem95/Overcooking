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
    
    // Scene setup with improved background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Light blue sky background

    // Orthographic camera for isometric, top-down view with a slight tilt
    const aspectRatio = window.innerWidth / window.innerHeight;
    const viewSize = 12; // The height of the viewable area in units
    const camera = new THREE.OrthographicCamera(
        -viewSize * aspectRatio / 2, // left
        viewSize * aspectRatio / 2,  // right
        viewSize / 2,                // top
        -viewSize / 2,               // bottom
        0.1,                         // near
        1000                         // far
    );
    
    // Position camera for a slightly isometric perspective to show depth
    camera.position.set(5, 10, 5);
    camera.lookAt(0, 0, 0);

    // Renderer setup targeting the canvas with improved settings
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Enable shadow rendering
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add enhanced lighting for 3D models
    // Warm ambient light for a cozy atmosphere
    const ambientLight = new THREE.AmbientLight(0xfff5e1, 0.5);
    scene.add(ambientLight);
    
    // Main directional light with shadows to enhance depth
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    
    // Improve shadow quality
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.bias = -0.0005;
    
    const d = 15;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;
    
    scene.add(directionalLight);

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