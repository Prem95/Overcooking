import * as THREE from 'three';
import { PLAYER_SIZE, COLORS, PLAYER_SPEED } from '../constants.js';
import gameState from '../state.js';
import { checkCollision } from '../utils/collision.js';

// Helper function to create a cube with color
function createCube(sizeX, sizeY, sizeZ, color) {
    const geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    const material = new THREE.MeshPhongMaterial({ color });
    return new THREE.Mesh(geometry, material);
}

// Create 3D chef character model
function createChefModel() {
    // Create character group
    const character = new THREE.Group();
    
    // Head (with hair, beard, sunglasses)
    const head = createCube(0.35, 0.35, 0.35, 0xFFC1A0); // Light peach skin tone
    head.position.set(0, 0.35, 0);
    character.add(head);
    
    // Sunglasses (cosmetic accessory)
    const sunglasses = createCube(0.38, 0.07, 0.05, 0x000000); // Black sunglasses
    sunglasses.position.set(0, 0.4, 0.16); // Positioned on face
    character.add(sunglasses);
    
    // Hair
    const hair = createCube(0.38, 0.14, 0.38, 0x000000); // Black hair
    hair.position.set(0, 0.5, 0);
    character.add(hair);
    
    // Torso (white shirt and black jacket)
    const torso = createCube(0.35, 0.3, 0.18, 0x1C2526); // Black jacket
    torso.position.set(0, 0.05, 0);
    character.add(torso);
    
    // Shirt (visible under jacket)
    const shirt = createCube(0.28, 0.25, 0.19, 0xFFFFFF); // White shirt
    shirt.position.set(0, 0.05, 0);
    character.add(shirt);
    
    // Left Arm
    const leftArm = createCube(0.16, 0.3, 0.16, 0x1C2526); // Jacket sleeve
    leftArm.position.set(-0.25, 0.05, 0);
    character.add(leftArm);
    
    // Right Arm
    const rightArm = createCube(0.16, 0.3, 0.16, 0x1C2526); // Jacket sleeve
    rightArm.position.set(0.25, 0.05, 0);
    character.add(rightArm);
    
    // Left Leg
    const leftLeg = createCube(0.16, 0.3, 0.16, 0x2A4066); // Dark blue pants
    leftLeg.position.set(-0.10, -0.2, 0);
    character.add(leftLeg);
    
    // Right Leg
    const rightLeg = createCube(0.16, 0.3, 0.16, 0x2A4066); // Dark blue pants
    rightLeg.position.set(0.10, -0.2, 0);
    character.add(rightLeg);
    
    // Shoes
    const leftShoe = createCube(0.18, 0.07, 0.18, 0x5C4033); // Brown shoes
    leftShoe.position.set(-0.10, -0.35, 0);
    character.add(leftShoe);
    
    const rightShoe = createCube(0.18, 0.07, 0.18, 0x5C4033);
    rightShoe.position.set(0.10, -0.35, 0);
    character.add(rightShoe);
    
    // Scale the entire character to match the game's size requirements
    character.scale.set(PLAYER_SIZE * 1.2, PLAYER_SIZE * 1.2, PLAYER_SIZE * 1.2);
    
    // Add shadow helper (small shadow beneath character)
    const shadowGeometry = new THREE.CircleGeometry(PLAYER_SIZE / 2, 32);
    const shadowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        transparent: true,
        opacity: 0.3
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2; // Flat on the ground
    shadow.position.y = -0.38;
    character.add(shadow);
    
    return character;
}

// Create player character
export function createPlayer(scene) {
    // Create the 3D chef model
    const player = createChefModel();
    
    // Start player in the center of the kitchen
    gameState.playerPosition = { x: 0, y: 1.5 };
    player.position.set(gameState.playerPosition.x, gameState.playerPosition.y, 0.1);
    
    // Add player to scene
    scene.add(player);
    gameState.player = player;
    
    // Setup player animation state
    gameState.playerAnimation = {
        walking: false,
        armSwingPhase: 0
    };
    
    return player;
}

// Update player position based on inputs
export function updatePlayerPosition(scene) {
    const newPosition = { 
        x: gameState.playerPosition.x, 
        y: gameState.playerPosition.y 
    };
    
    // Track if player is moving this frame
    let isMoving = false;
    
    // Calculate new position based on key presses
    if (gameState.keysPressed['w'] || gameState.keysPressed['arrowup']) {
        newPosition.y += PLAYER_SPEED;
        isMoving = true;
    }
    if (gameState.keysPressed['s'] || gameState.keysPressed['arrowdown']) {
        newPosition.y -= PLAYER_SPEED;
        isMoving = true;
    }
    if (gameState.keysPressed['a'] || gameState.keysPressed['arrowleft']) {
        newPosition.x -= PLAYER_SPEED;
        isMoving = true;
        gameState.player.rotation.y = Math.PI / 2; // Turn left
    }
    if (gameState.keysPressed['d'] || gameState.keysPressed['arrowright']) {
        newPosition.x += PLAYER_SPEED;
        isMoving = true;
        gameState.player.rotation.y = -Math.PI / 2; // Turn right
    }
    
    // Update player animation state
    gameState.playerAnimation.walking = isMoving;
    
    // Handle walking animation
    updateWalkingAnimation();
    
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
        
        // Update held item position if player is holding something
        if (gameState.playerHolding) {
            gameState.playerHolding.position.x = newPosition.x;
            gameState.playerHolding.position.y = newPosition.y + 0.4;
        }
    }
}

// Update walking animation
function updateWalkingAnimation() {
    if (!gameState.player) return;
    
    if (gameState.playerAnimation.walking) {
        // Move arms back and forth when walking
        gameState.playerAnimation.armSwingPhase += 0.15;
        
        const phase = Math.sin(gameState.playerAnimation.armSwingPhase);
        const leftArm = gameState.player.children.find(child => 
            child.position.x < -0.2 && child.position.y > 0);
        const rightArm = gameState.player.children.find(child => 
            child.position.x > 0.2 && child.position.y > 0);
        
        if (leftArm && rightArm) {
            leftArm.rotation.x = phase * 0.5;
            rightArm.rotation.x = -phase * 0.5;
        }
        
        // Also slightly move legs
        const leftLeg = gameState.player.children.find(child => 
            child.position.x < 0 && child.position.y < -0.1);
        const rightLeg = gameState.player.children.find(child => 
            child.position.x > 0 && child.position.y < -0.1);
        
        if (leftLeg && rightLeg) {
            leftLeg.position.z = Math.sin(gameState.playerAnimation.armSwingPhase) * 0.05;
            rightLeg.position.z = -Math.sin(gameState.playerAnimation.armSwingPhase) * 0.05;
        }
    } else {
        // Reset arm positions when not walking
        const leftArm = gameState.player.children.find(child => 
            child.position.x < -0.2 && child.position.y > 0);
        const rightArm = gameState.player.children.find(child => 
            child.position.x > 0.2 && child.position.y > 0);
            
        if (leftArm && rightArm) {
            leftArm.rotation.x = 0;
            rightArm.rotation.x = 0;
        }
        
        // Reset leg positions
        const leftLeg = gameState.player.children.find(child => 
            child.position.x < 0 && child.position.y < -0.1);
        const rightLeg = gameState.player.children.find(child => 
            child.position.x > 0 && child.position.y < -0.1);
            
        if (leftLeg && rightLeg) {
            leftLeg.position.z = 0;
            rightLeg.position.z = 0;
        }
    }
} 