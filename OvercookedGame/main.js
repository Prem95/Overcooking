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
        
        // Add lighting for 3D models
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        console.log("Initializing kitchen layout...");
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