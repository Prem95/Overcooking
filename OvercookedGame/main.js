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
        
        // Scene setup with a more attractive background gradient
        const scene = new THREE.Scene();
        
        // Create gradient background
        const canvas2 = document.createElement('canvas');
        const context = canvas2.getContext('2d');
        canvas2.width = 256;
        canvas2.height = 256;
        
        const gradient = context.createLinearGradient(0, 0, 0, canvas2.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue at top
        gradient.addColorStop(1, '#E0E0E0'); // Light gray at bottom
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas2.width, canvas2.height);
        
        const backgroundTexture = new THREE.CanvasTexture(canvas2);
        scene.background = backgroundTexture;

        // Orthographic camera for true isometric view
        const aspectRatio = window.innerWidth / window.innerHeight;
        const viewSize = 18; // Increased for a wider view of the kitchen
        const camera = new THREE.OrthographicCamera(
            -viewSize * aspectRatio / 2, // left
            viewSize * aspectRatio / 2,  // right
            viewSize / 2,                // top
            -viewSize / 2,               // bottom
            0.1,                         // near
            1000                         // far
        );
        
        // Position camera for a more dramatic isometric perspective
        camera.position.set(8, 10, 8); // Move more to side for better angle
        camera.lookAt(0, 0, 0);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Enable shadow rendering with improved quality
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Improved lighting
        // Warmer, brighter ambient light
        const ambientLight = new THREE.AmbientLight(0xfff5e1, 0.7);
        scene.add(ambientLight);
        
        // Main directional light with enhanced shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 10, 7.5);
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
        
        // Add a blue-tinted fill light from the opposite side
        const fillLight = new THREE.DirectionalLight(0xAED6F1, 0.5);
        fillLight.position.set(-5, 5, -5);
        scene.add(fillLight);
        
        // Add soft rim light for edge definition
        const rimLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
        rimLight.position.set(-2, 3, 10);
        scene.add(rimLight);

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