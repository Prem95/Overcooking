import * as THREE from 'three';
import gameState, { setGameLoaded } from './js/state.js';
import { createKitchenLayout } from './js/entities/kitchen.js';
import { createPlayer, updatePlayerPosition } from './js/entities/player.js';
import { setupControls, setupMobileControls } from './js/systems/controls.js';

console.log("Modules imported successfully");

// Wait for DOM to load
window.addEventListener('DOMContentLoaded', init);

function init() {
    try {
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
        scene.background = new THREE.Color(0x87CEEB); // Light blue sky background

        // Orthographic camera for 2D top-down view with slight perspective
        const aspectRatio = window.innerWidth / window.innerHeight;
        const viewSize = 14; // Increased viewable area to accommodate larger kitchen
        const camera = new THREE.OrthographicCamera(
            -viewSize * aspectRatio / 2, // left
            viewSize * aspectRatio / 2,  // right
            viewSize / 2,                // top
            -viewSize / 2,               // bottom
            0.1,                         // near
            1000                         // far
        );
        
        // Position camera for a slightly isometric perspective
        camera.position.set(0, 8, 10);
        camera.lookAt(0, 0, 0);
        camera.rotation.z = 0; // Keep kitchen aligned with screen

        // Renderer setup targeting the canvas with improved settings
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Enable shadow rendering
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add enhanced lighting for 3D models
        // Warm ambient light
        const ambientLight = new THREE.AmbientLight(0xfff5e1, 0.6);
        scene.add(ambientLight);
        
        // Main directional light with shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        
        // Improve shadow quality
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.bias = -0.001;
        
        const d = 15;
        directionalLight.shadow.camera.left = -d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = -d;
        
        scene.add(directionalLight);
        
        // Add a subtle secondary light
        const secondaryLight = new THREE.DirectionalLight(0xAED6F1, 0.3);
        secondaryLight.position.set(-5, 5, -5);
        scene.add(secondaryLight);

        console.log("Initializing enhanced 3D kitchen layout...");
        // Initialize game components
        createKitchenLayout(scene);
        
        console.log("Creating player...");
        createPlayer(scene);
        
        console.log("Setting up controls...");
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
    } catch (error) {
        console.error("Error during game initialization:", error);
    }
} 