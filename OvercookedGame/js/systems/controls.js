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