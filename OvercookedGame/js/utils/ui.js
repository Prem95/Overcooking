import * as THREE from 'three';
import gameState from '../state.js';

// Create error message popup
export function createErrorMessage(scene, message) {
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

// Check if device is mobile
export function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
} 