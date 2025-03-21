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
    
    // Make character receive shadows
    character.traverse(function(object) {
        if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });
    
    return character;
}

// Create player character
export function createPlayer(scene) {
    // In first-person view, we don't need to see the player model
    // We'll create a minimal representation for collision purposes
    const player = new THREE.Group();
    
    // Add a small invisible mesh for collision detection
    const collisionGeometry = new THREE.CylinderGeometry(PLAYER_SIZE/2, PLAYER_SIZE/2, 1.8, 8);
    const collisionMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFF0000, 
        transparent: true,
        opacity: 0.0 // Invisible
    });
    const collisionMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
    collisionMesh.position.y = 0.9; // Position at center of player height
    player.add(collisionMesh);
    
    // Create hands that will be visible in first-person view
    const handGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.3);
    const handMaterial = new THREE.MeshPhongMaterial({ color: 0xFFC1A0 }); // Skin tone
    
    // Right hand (visible on the right side of the screen)
    const rightHand = new THREE.Mesh(handGeometry, handMaterial);
    rightHand.position.set(0.3, -0.3, -0.5); // Position at lower right of view
    player.add(rightHand);
    
    // Left hand (visible on the left side of the screen)
    const leftHand = new THREE.Mesh(handGeometry, handMaterial);
    leftHand.position.set(-0.3, -0.3, -0.5); // Position at lower left of view
    player.add(leftHand);
    
    // Store references to hands for animation
    player.userData = {
        hands: {
            left: leftHand,
            right: rightHand
        }
    };
    
    // Start player in the center of the kitchen
    gameState.playerPosition = { x: 0, y: 1.5 };
    gameState.playerRotation = 0; // Facing positive X initially
    
    // Position player for first-person view
    // Height is fixed at eye level (1.7 meters)
    player.position.set(gameState.playerPosition.x, 0, gameState.playerPosition.y);
    
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
export function updatePlayerPosition() {
    if (!gameState.player || !gameState.camera) return;
    
    const forward = new THREE.Vector3(
        Math.cos(gameState.playerRotation),
        0,
        Math.sin(gameState.playerRotation)
    );
    
    const right = new THREE.Vector3(
        Math.cos(gameState.playerRotation + Math.PI/2),
        0,
        Math.sin(gameState.playerRotation + Math.PI/2)
    );
    
    const newPosition = { 
        x: gameState.playerPosition.x, 
        y: gameState.playerPosition.y 
    };
    
    // Track if player is moving this frame
    let isMoving = false;
    
    // Calculate new position based on key presses
    if (gameState.keysPressed['w'] || gameState.keysPressed['arrowup']) {
        newPosition.x += forward.x * PLAYER_SPEED;
        newPosition.y += forward.z * PLAYER_SPEED;
        isMoving = true;
    }
    if (gameState.keysPressed['s'] || gameState.keysPressed['arrowdown']) {
        newPosition.x -= forward.x * PLAYER_SPEED;
        newPosition.y -= forward.z * PLAYER_SPEED;
        isMoving = true;
    }
    if (gameState.keysPressed['a'] || gameState.keysPressed['arrowleft']) {
        newPosition.x += right.x * PLAYER_SPEED;
        newPosition.y += right.z * PLAYER_SPEED;
        isMoving = true;
    }
    if (gameState.keysPressed['d'] || gameState.keysPressed['arrowright']) {
        newPosition.x -= right.x * PLAYER_SPEED;
        newPosition.y -= right.z * PLAYER_SPEED;
        isMoving = true;
    }
    
    // Mouse look rotation (handled by controls.js)
    if (gameState.mouseDeltaX) {
        gameState.playerRotation -= gameState.mouseDeltaX * 0.002; // Sensitivity factor
        gameState.mouseDeltaX = 0;
    }
    
    // Update player animation state
    gameState.playerAnimation.walking = isMoving;
    
    // Animate hands when walking
    updateHandsAnimation(isMoving);
    
    // Only update position if there's no collision
    // For first-person, we treat x,z as horizontal coordinates and y as height
    const checkPos = { x: newPosition.x, y: newPosition.y };
    if (!checkCollision(checkPos)) {
        gameState.playerPosition = newPosition;
        
        // Update player position
        gameState.player.position.set(newPosition.x, 0, newPosition.y);
        
        // Update camera position and rotation
        gameState.camera.position.set(newPosition.x, 1.7, newPosition.y); // Eye height
        
        // Update camera direction based on player rotation
        const lookAtPos = new THREE.Vector3(
            newPosition.x + Math.cos(gameState.playerRotation),
            1.7, // Same height as camera
            newPosition.y + Math.sin(gameState.playerRotation)
        );
        gameState.camera.lookAt(lookAtPos);
        
        // Update hands rotation to match camera
        gameState.player.rotation.y = gameState.playerRotation;
        
        // Update error message position if it exists
        if (gameState.errorMessage) {
            // Position error message in front of the camera
            const errorPos = new THREE.Vector3(
                newPosition.x + Math.cos(gameState.playerRotation) * 1.0,
                1.9, // Slightly above eye level
                newPosition.y + Math.sin(gameState.playerRotation) * 1.0
            );
            gameState.errorMessage.position.copy(errorPos);
            
            // Make error message face the camera
            gameState.errorMessage.lookAt(gameState.camera.position);
        }
        
        // Update held item position if player is holding something
        if (gameState.playerHolding) {
            // Position item in front of the camera (slightly to the right)
            const itemPos = new THREE.Vector3(
                newPosition.x + Math.cos(gameState.playerRotation) * 0.5 + Math.cos(gameState.playerRotation + Math.PI/2) * 0.2,
                1.5, // Slightly below eye level
                newPosition.y + Math.sin(gameState.playerRotation) * 0.5 + Math.sin(gameState.playerRotation + Math.PI/2) * 0.2
            );
            gameState.playerHolding.position.copy(itemPos);
            
            // Make held item face the same direction as player
            gameState.playerHolding.rotation.y = gameState.playerRotation;
        }
    }
}

// Update hands animation
function updateHandsAnimation(isMoving) {
    if (!gameState.player || !gameState.player.userData.hands) return;
    
    const { left, right } = gameState.player.userData.hands;
    
    if (isMoving) {
        // Swing arms when walking
        gameState.playerAnimation.armSwingPhase += 0.15;
        
        const phase = Math.sin(gameState.playerAnimation.armSwingPhase);
        
        if (left && right) {
            // Move hands back and forth
            left.position.z = -0.5 - phase * 0.1;
            right.position.z = -0.5 + phase * 0.1;
            
            // Also move hands up and down slightly
            left.position.y = -0.3 + Math.abs(phase) * 0.05;
            right.position.y = -0.3 + Math.abs(phase) * 0.05;
        }
    } else {
        // Reset hands to default position when not moving
        if (left && right) {
            left.position.z = -0.5;
            right.position.z = -0.5;
            left.position.y = -0.3;
            right.position.y = -0.3;
        }
    }
} 