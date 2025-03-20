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

// Create progress bar for chopping/cooking
export function createProgressBar(scene, x, y) {
    // Create a shader material for the progress bar
    const progressMaterial = new THREE.ShaderMaterial({
        uniforms: {
            progress: { value: 0.0 },
            barColor: { value: new THREE.Color(0x00ff00) }, // Green color
            backgroundColor: { value: new THREE.Color(0x333333) } // Dark gray
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float progress;
            uniform vec3 barColor;
            uniform vec3 backgroundColor;
            varying vec2 vUv;
            void main() {
                // Background of progress bar
                vec3 color = backgroundColor;
                
                // Fill bar based on progress
                if (vUv.x < progress) {
                    color = barColor;
                }
                
                // Add outline
                if (vUv.x < 0.02 || vUv.x > 0.98 || vUv.y < 0.1 || vUv.y > 0.9) {
                    color = vec3(0.0, 0.0, 0.0);
                }
                
                gl_FragColor = vec4(color, 1.0);
            }
        `
    });
    
    // Create the progress bar mesh
    const barGeometry = new THREE.PlaneGeometry(1.5, 0.3);
    const progressBar = new THREE.Mesh(barGeometry, progressMaterial);
    
    // Position above the player
    progressBar.position.set(x, y + 1.2, 0.2);
    
    // Add to scene
    scene.add(progressBar);
    
    // Store reference and return
    gameState.progressBar = progressBar;
    return progressBar;
}

// Check if device is mobile
export function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
} 