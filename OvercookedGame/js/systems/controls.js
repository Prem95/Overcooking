import gameState from '../state.js';
import { isMobileDevice } from '../utils/ui.js';
import { handleInteraction } from './interaction.js';

// Setup keyboard input
export function setupControls() {
    // Track key presses
    window.addEventListener('keydown', (event) => {
        gameState.keysPressed[event.key.toLowerCase()] = true;
        
        // Space bar for interactions
        if (event.key === ' ') {
            handleInteraction();
        }
    });
    
    window.addEventListener('keyup', (event) => {
        gameState.keysPressed[event.key.toLowerCase()] = false;
    });
    
    // Add mouse pointer lock for first-person view
    const canvas = document.getElementById('gameCanvas');
    
    // Request pointer lock when canvas is clicked
    canvas.addEventListener('click', () => {
        canvas.requestPointerLock = canvas.requestPointerLock || 
                                   canvas.mozRequestPointerLock ||
                                   canvas.webkitRequestPointerLock;
        canvas.requestPointerLock();
    });
    
    // Handle mouse movement for looking around
    document.addEventListener('mousemove', (event) => {
        if (document.pointerLockElement === canvas || 
            document.mozPointerLockElement === canvas ||
            document.webkitPointerLockElement === canvas) {
            
            // Get the mouse movement delta
            const movementX = event.movementX || 
                             event.mozMovementX || 
                             event.webkitMovementX || 0;
                             
            // Store the movement for processing in the player update
            gameState.mouseDeltaX = movementX;
        }
    });
    
    // Display instructions for pointer lock
    const instructions = document.createElement('div');
    instructions.id = 'instructions';
    instructions.innerHTML = 'Click on the game to look around with the mouse<br>Use WASD/Arrow keys to move';
    instructions.style.cssText = `
        position: fixed;
        top: 20px;
        left: 0;
        width: 100%;
        text-align: center;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 10px;
        font-family: Arial, sans-serif;
        z-index: 100;
    `;
    document.body.appendChild(instructions);
    
    // Hide instructions when pointer is locked
    function pointerLockChange() {
        if (document.pointerLockElement === canvas || 
            document.mozPointerLockElement === canvas ||
            document.webkitPointerLockElement === canvas) {
            instructions.style.display = 'none';
        } else {
            instructions.style.display = 'block';
        }
    }
    
    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerLockChange, false);
    document.addEventListener('mozpointerlockchange', pointerLockChange, false);
    document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
}

// Setup mobile controls
export function setupMobileControls() {
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
        handleInteraction(); // Trigger interaction directly
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