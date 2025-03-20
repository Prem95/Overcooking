import * as THREE from 'three';

// Game constants
const STATION_SIZE = 1;
const COUNTER_SIZE = 0.8;
const PLAYER_SIZE = 0.6;
const PLAYER_SPEED = 0.1;
const INTERACTION_RADIUS = 0.8; // Distance from which player can interact with objects

// Define station and counter colors
const COLORS = {
    pantry: 0x8BC34A,        // green
    chopping: 0xFF5252,      // red
    cooking: 0xFF9800,       // orange
    plateDispenser: 0x9E9E9E, // grey
    serving: 0x2196F3,       // blue
    counter: 0xBDBDBD,       // light grey
    player: 0xFFFFFF         // white
};

// Game state
const gameState = {
    keysPressed: {},
    player: null,
    playerPosition: { x: 0, y: 0 },
    playerHolding: null,
    errorMessage: null,
    errorMessageTimeout: null
};

// Wait for DOM to load
window.addEventListener('DOMContentLoaded', init);

function init() {
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
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Kitchen layout - stores references to all stations and counters
    const kitchen = {
        stations: {},
        counters: []
    };

    // Function to create a station or counter
    function createKitchenElement(type, position, size, color) {
        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.MeshBasicMaterial({ color });
        const element = new THREE.Mesh(geometry, material);
        element.position.set(position.x, position.y, 0);
        
        // Add a text label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;
        context.fillStyle = 'white';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(type, canvas.width/2, canvas.height/2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelGeometry = new THREE.PlaneGeometry(size * 0.8, size * 0.3);
        const labelMaterial = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true
        });
        
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(0, -size * 0.2, 0.1); // Position label below element
        element.add(label);
        
        scene.add(element);
        return element;
    }

    // Define and create stations
    function createKitchenLayout() {
        console.log("Creating kitchen layout...");
        // Create stations
        kitchen.stations.pantry = createKitchenElement('Pantry', { x: -4, y: 3 }, STATION_SIZE, COLORS.pantry);
        kitchen.stations.chopping = createKitchenElement('Chopping', { x: -4, y: 0 }, STATION_SIZE, COLORS.chopping);
        kitchen.stations.cooking = createKitchenElement('Cooking', { x: -4, y: -3 }, STATION_SIZE, COLORS.cooking);
        kitchen.stations.plateDispenser = createKitchenElement('Plates', { x: 4, y: 3 }, STATION_SIZE, COLORS.plateDispenser);
        kitchen.stations.serving = createKitchenElement('Serving', { x: 4, y: -3 }, STATION_SIZE, COLORS.serving);
        
        // Create counters (at least 3)
        kitchen.counters.push(
            createKitchenElement('Counter', { x: 0, y: 3 }, COUNTER_SIZE, COLORS.counter),
            createKitchenElement('Counter', { x: 0, y: 0 }, COUNTER_SIZE, COLORS.counter),
            createKitchenElement('Counter', { x: 0, y: -3 }, COUNTER_SIZE, COLORS.counter),
            createKitchenElement('Counter', { x: 4, y: 0 }, COUNTER_SIZE, COLORS.counter),
            createKitchenElement('Counter', { x: -2, y: -1.5 }, COUNTER_SIZE, COLORS.counter)
        );
        
        // Store positions and states for game logic
        kitchen.counters.forEach(counter => {
            counter.userData = {
                isOccupied: false,
                position: { x: counter.position.x, y: counter.position.y }
            };
        });
        
        // Store station positions for game logic
        Object.entries(kitchen.stations).forEach(([key, station]) => {
            station.userData = {
                type: key,
                position: { x: station.position.x, y: station.position.y }
            };
        });
    }

    // Create player character
    function createPlayer() {
        // Create a circular player representation
        const geometry = new THREE.CircleGeometry(PLAYER_SIZE / 2, 32);
        const material = new THREE.MeshBasicMaterial({ color: COLORS.player });
        const player = new THREE.Mesh(geometry, material);
        
        // Start player in the center of the kitchen
        gameState.playerPosition = { x: 0, y: 1.5 };
        player.position.set(gameState.playerPosition.x, gameState.playerPosition.y, 0.1);
        
        scene.add(player);
        gameState.player = player;
        
        return player;
    }
    
    // Create error message popup
    function createErrorMessage(message) {
        // Clear existing error message if present
        if (gameState.errorMessage) {
            scene.remove(gameState.errorMessage);
            clearTimeout(gameState.errorMessageTimeout);
        }
        
        // Create a canvas texture for the error message
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        // Fill with semi-transparent background
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(message, canvas.width/2, canvas.height/2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const geometry = new THREE.PlaneGeometry(2, 0.5);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true
        });
        
        const errorMesh = new THREE.Mesh(geometry, material);
        errorMesh.position.set(
            gameState.playerPosition.x, 
            gameState.playerPosition.y + 0.8, 
            0.2
        );
        
        scene.add(errorMesh);
        gameState.errorMessage = errorMesh;
        
        // Auto-remove after 2 seconds
        gameState.errorMessageTimeout = setTimeout(() => {
            scene.remove(errorMesh);
            gameState.errorMessage = null;
        }, 2000);
    }

    // Check collision with kitchen elements
    function checkCollision(position) {
        // Get half sizes for collision detection
        const playerHalfSize = PLAYER_SIZE / 2;
        const stationHalfSize = STATION_SIZE / 2;
        const counterHalfSize = COUNTER_SIZE / 2;
        
        // Check collision with stations
        for (const station of Object.values(kitchen.stations)) {
            const stationPos = station.position;
            if (
                position.x + playerHalfSize > stationPos.x - stationHalfSize &&
                position.x - playerHalfSize < stationPos.x + stationHalfSize &&
                position.y + playerHalfSize > stationPos.y - stationHalfSize &&
                position.y - playerHalfSize < stationPos.y + stationHalfSize
            ) {
                return true; // Collision detected
            }
        }
        
        // Check collision with counters
        for (const counter of kitchen.counters) {
            const counterPos = counter.position;
            if (
                position.x + playerHalfSize > counterPos.x - counterHalfSize &&
                position.x - playerHalfSize < counterPos.x + counterHalfSize &&
                position.y + playerHalfSize > counterPos.y - counterHalfSize &&
                position.y - playerHalfSize < counterPos.y + counterHalfSize
            ) {
                return true; // Collision detected
            }
        }
        
        return false; // No collision
    }

    // Setup keyboard input
    function setupControls() {
        // Track key presses
        window.addEventListener('keydown', (event) => {
            gameState.keysPressed[event.key.toLowerCase()] = true;
            
            // Space bar for interactions
            if (event.key === ' ') {
                // Handle interactions here in future steps
            }
        });
        
        window.addEventListener('keyup', (event) => {
            gameState.keysPressed[event.key.toLowerCase()] = false;
        });
    }
    
    // Setup mobile controls
    function setupMobileControls() {
        // Create mobile control overlay
        const overlay = document.createElement('div');
        overlay.id = 'mobile-controls';
        overlay.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            pointer-events: none;
        `;
        
        // Create container for WASD buttons
        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 60px);
            grid-template-rows: repeat(3, 60px);
            gap: 5px;
            pointer-events: auto;
        `;
        
        // Create buttons
        const createButton = (text, gridArea, key) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = `
                grid-area: ${gridArea};
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.6);
                border: 2px solid #333;
                border-radius: 8px;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                user-select: none;
            `;
            
            // Touch events for mobile
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                gameState.keysPressed[key] = true;
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                gameState.keysPressed[key] = false;
            });
            
            return button;
        };
        
        // WASD buttons
        const upButton = createButton('W', '1 / 2 / 2 / 3', 'w');
        const leftButton = createButton('A', '2 / 1 / 3 / 2', 'a');
        const downButton = createButton('S', '2 / 2 / 3 / 3', 's');
        const rightButton = createButton('D', '2 / 3 / 3 / 4', 'd');
        
        // Action button
        const actionButton = document.createElement('button');
        actionButton.textContent = 'SPACE';
        actionButton.style.cssText = `
            margin-left: 20px;
            width: 120px;
            height: 60px;
            background-color: rgba(255, 255, 255, 0.6);
            border: 2px solid #333;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            pointer-events: auto;
            user-select: none;
        `;
        
        actionButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            gameState.keysPressed[' '] = true;
        });
        
        actionButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            gameState.keysPressed[' '] = false;
        });
        
        // Add buttons to container
        controlsContainer.appendChild(upButton);
        controlsContainer.appendChild(leftButton);
        controlsContainer.appendChild(downButton);
        controlsContainer.appendChild(rightButton);
        
        // Add containers to overlay
        overlay.appendChild(controlsContainer);
        overlay.appendChild(actionButton);
        
        // Add overlay to body
        document.body.appendChild(overlay);
        
        // Only show on mobile devices
        if (!isMobileDevice()) {
            overlay.style.display = 'none';
        }
    }
    
    // Check if device is mobile
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Update player position based on inputs
    function updatePlayerPosition() {
        const newPosition = { 
            x: gameState.playerPosition.x, 
            y: gameState.playerPosition.y 
        };
        
        // Calculate new position based on key presses
        if (gameState.keysPressed['w'] || gameState.keysPressed['arrowup']) {
            newPosition.y += PLAYER_SPEED;
        }
        if (gameState.keysPressed['s'] || gameState.keysPressed['arrowdown']) {
            newPosition.y -= PLAYER_SPEED;
        }
        if (gameState.keysPressed['a'] || gameState.keysPressed['arrowleft']) {
            newPosition.x -= PLAYER_SPEED;
        }
        if (gameState.keysPressed['d'] || gameState.keysPressed['arrowright']) {
            newPosition.x += PLAYER_SPEED;
        }
        
        // Only update position if there's no collision
        if (!checkCollision(newPosition)) {
            gameState.playerPosition = newPosition;
            gameState.player.position.set(newPosition.x, newPosition.y, 0.1);
            
            // Update error message position if it exists
            if (gameState.errorMessage) {
                gameState.errorMessage.position.set(
                    newPosition.x,
                    newPosition.y + 0.8,
                    0.2
                );
            }
        } else {
            // Optional: Show error message for collision
            // createErrorMessage("Can't move there!");
        }
    }

    // Create kitchen layout
    createKitchenLayout();
    
    // Create the player character
    createPlayer();
    
    // Setup controls
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
        updatePlayerPosition();
        
        renderer.render(scene, camera);
    }

    animate();
    
    // Log to console for debugging
    console.log("Game initialized successfully");
} 