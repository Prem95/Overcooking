import * as THREE from 'three';
import { ITEM_SIZE, COLORS, ITEM_STATES, ITEM_TYPES } from '../constants.js';
import gameState from '../state.js';
import { kitchen } from './kitchen.js';

// Create an item
export function createItem(scene, type, state = ITEM_STATES.RAW) {
    // Determine color based on type and state
    let color;
    switch (type) {
        case ITEM_TYPES.ONION:
            color = state === ITEM_STATES.RAW ? COLORS.onion : 
                    state === ITEM_STATES.CHOPPED ? 0x00ff00 : 0x8B4513;
            break;
        case ITEM_TYPES.TOMATO:
            color = state === ITEM_STATES.RAW ? COLORS.tomato : 
                    state === ITEM_STATES.CHOPPED ? 0x00ff00 : 0x8B4513;
            break;
        case ITEM_TYPES.MEAT:
            color = state === ITEM_STATES.RAW ? COLORS.meat : 
                    state === ITEM_STATES.CHOPPED ? 0xBB5533 : 0x663311;
            break;
        default:
            color = COLORS.onion; // Default to onion
    }
    
    // Create item geometry based on state
    let geometry;
    if (state === ITEM_STATES.RAW) {
        // Raw items are spheres
        geometry = new THREE.SphereGeometry(ITEM_SIZE / 2, 16, 16);
    } else if (state === ITEM_STATES.CHOPPED) {
        // Chopped items are flatter spheres
        geometry = new THREE.SphereGeometry(ITEM_SIZE / 2, 16, 16);
        // Flatten the sphere to represent chopped item
        geometry.scale(1, 0.4, 1);
    } else if (state === ITEM_STATES.COOKED) {
        // Cooked items are glowing spheres
        geometry = new THREE.SphereGeometry(ITEM_SIZE / 2, 16, 16);
    }
    
    // Create material based on state
    let material;
    if (state === ITEM_STATES.COOKED) {
        // Cooked items have emissive properties
        material = new THREE.MeshPhongMaterial({ 
            color: color,
            emissive: 0x331100,
            emissiveIntensity: 0.5,
            shininess: 60 
        });
    } else {
        material = new THREE.MeshPhongMaterial({ 
            color: color,
            shininess: 30
        });
    }
    
    // Create the mesh
    const item = new THREE.Mesh(geometry, material);
    
    // Create a group to hold the item and any decorations
    const itemGroup = new THREE.Group();
    itemGroup.add(item);
    
    // For chopped items, add visual indicators
    if (state === ITEM_STATES.CHOPPED) {
        // Add chopping lines on top
        const lineGeometry = new THREE.BoxGeometry(ITEM_SIZE * 0.6, ITEM_SIZE * 0.01, ITEM_SIZE * 0.05);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
        
        for (let i = 0; i < 3; i++) {
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.position.y = ITEM_SIZE * 0.18;
            line.position.z = (i - 1) * ITEM_SIZE * 0.2;
            itemGroup.add(line);
        }
    }
    
    // For cooked items, add some particle effects
    if (state === ITEM_STATES.COOKED) {
        // Add small "steam" particles around the item
        const particleGeometry = new THREE.SphereGeometry(ITEM_SIZE * 0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xdddddd,
            transparent: true,
            opacity: 0.7
        });
        
        for (let i = 0; i < 5; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            const angle = Math.random() * Math.PI * 2;
            const radius = ITEM_SIZE * 0.4 + Math.random() * ITEM_SIZE * 0.3;
            particle.position.x = Math.cos(angle) * radius;
            particle.position.z = Math.sin(angle) * radius;
            particle.position.y = ITEM_SIZE * 0.3 + Math.random() * ITEM_SIZE * 0.2;
            itemGroup.add(particle);
            
            // Store initial position for animation
            particle.userData = {
                initialY: particle.position.y,
                speed: 0.003 + Math.random() * 0.003,
                phase: Math.random() * Math.PI * 2
            };
        }
    }
    
    // Add to scene with z-index above counters but below UI
    itemGroup.position.z = 0.05;
    scene.add(itemGroup);
    
    // Store item metadata
    itemGroup.userData = {
        type,
        state,
        isHeldByPlayer: false,
        isOnCounter: false,
        counterId: null,
        // For animation purposes
        particles: state === ITEM_STATES.COOKED ? 
                    itemGroup.children.filter(child => child !== item) : 
                    []
    };
    
    // Add to game state
    gameState.items.push(itemGroup);
    
    return itemGroup;
}

// Attach item to player
export function attachItemToPlayer(item) {
    // Set item position relative to player
    item.position.x = gameState.playerPosition.x;
    item.position.y = gameState.playerPosition.y + 0.6; // Position slightly above player
    item.position.z = 0.15; // Ensure it's above any counters but below UI
    
    // Update item state
    item.userData.isHeldByPlayer = true;
    item.userData.isOnCounter = false;
    item.userData.counterId = null;
    
    // Update game state
    gameState.playerHolding = item;
    
    // Animation for cooking items
    if (item.userData.state === ITEM_STATES.COOKED) {
        animateCookedItem(item);
    }
}

// Place item on counter
export function placeItemOnCounter(item, counter) {
    // Set item position to counter position
    item.position.x = counter.position.x;
    item.position.y = counter.position.y + 0.2; // Slightly above counter
    item.position.z = 0.05; // Above counter but below player and UI
    
    // Update item state
    item.userData.isHeldByPlayer = false;
    item.userData.isOnCounter = true;
    
    // Update counter state
    counter.userData.isOccupied = true;
    counter.userData.item = item;
    item.userData.counterId = kitchen.counters.indexOf(counter);
    
    // Update game state
    gameState.playerHolding = null;
    
    // Animation for cooking items
    if (item.userData.state === ITEM_STATES.COOKED) {
        animateCookedItem(item);
    }
}

// Pick up item from counter
export function pickUpItemFromCounter(counter) {
    const item = counter.userData.item;
    
    // Update item state
    item.userData.isHeldByPlayer = true;
    item.userData.isOnCounter = false;
    item.userData.counterId = null;
    
    // Update counter state
    counter.userData.isOccupied = false;
    counter.userData.item = null;
    
    // Attach to player
    attachItemToPlayer(item);
}

// Animate cooked items (steam particles)
function animateCookedItem(item) {
    if (item.userData.state !== ITEM_STATES.COOKED) return;
    
    // Animate each particle
    item.userData.particles.forEach(particle => {
        if (!particle.userData) return;
        
        // Move particle up and down
        particle.position.y = particle.userData.initialY + 
                              Math.sin(Date.now() * particle.userData.speed + 
                                       particle.userData.phase) * 0.1;
    });
    
    // Continue animation
    requestAnimationFrame(() => animateCookedItem(item));
} 