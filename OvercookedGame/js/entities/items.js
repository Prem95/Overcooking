import * as THREE from 'three';
import { ITEM_SIZE, PLATE_SIZE, COLORS, ITEM_STATES, ITEM_TYPES } from '../constants.js';
import gameState from '../state.js';
import { kitchen } from './kitchen.js';

// Create a new item
export function createItem(scene, type, state = ITEM_STATES.RAW) {
    // Special case for plates
    if (type === ITEM_TYPES.PLATE) {
        return createPlate(scene);
    }
    
    // For other items, create standard geometry
    let geometry;
    let color;
    
    // Create a group to hold the item mesh and any decorations
    const itemGroup = new THREE.Group();
    
    // Determine color and geometry based on item type
    switch (type) {
        case ITEM_TYPES.ONION:
            color = state === ITEM_STATES.CHOPPED ? 0xAAFF77 : 0xFFFFAA;
            geometry = new THREE.SphereGeometry(ITEM_SIZE * 0.5, 16, 16);
            break;
        case ITEM_TYPES.TOMATO:
            color = state === ITEM_STATES.CHOPPED ? 0xAA3333 : 0xFF6666;
            geometry = new THREE.SphereGeometry(ITEM_SIZE * 0.5, 16, 16);
            break;
        case ITEM_TYPES.MEAT:
            color = state === ITEM_STATES.CHOPPED ? 0xBB5533 : 0x663311;
            geometry = new THREE.BoxGeometry(ITEM_SIZE * 0.8, ITEM_SIZE * 0.3, ITEM_SIZE * 0.8);
            break;
        default:
            color = 0x00ff00;
            geometry = new THREE.BoxGeometry(ITEM_SIZE, ITEM_SIZE, ITEM_SIZE);
    }
    
    // Create material based on state
    const material = new THREE.MeshPhongMaterial({ 
        color: color,
        shininess: state === ITEM_STATES.COOKED ? 60 : 30
    });
    
    // Create the base item mesh
    const itemMesh = new THREE.Mesh(geometry, material);
    itemGroup.add(itemMesh);
    
    // Add details based on type and state
    if (type === ITEM_TYPES.MEAT && state === ITEM_STATES.COOKED) {
        // Add grill marks
        const markGeometry = new THREE.BoxGeometry(ITEM_SIZE * 0.5, ITEM_SIZE * 0.01, ITEM_SIZE * 0.05);
        const markMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        // Create cross-hatch grill marks
        for (let i = -1; i <= 1; i += 1) {
            const mark1 = new THREE.Mesh(markGeometry, markMaterial);
            mark1.position.set(0, ITEM_SIZE * 0.16, i * ITEM_SIZE * 0.15);
            mark1.rotation.y = Math.PI / 4;
            itemGroup.add(mark1);
            
            const mark2 = new THREE.Mesh(markGeometry, markMaterial);
            mark2.position.set(0, ITEM_SIZE * 0.16, i * ITEM_SIZE * 0.15);
            mark2.rotation.y = -Math.PI / 4;
            itemGroup.add(mark2);
        }
        
        // Add steam particles for cooked items
        const particleGeometry = new THREE.SphereGeometry(ITEM_SIZE * 0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.7
        });
        
        for (let i = 0; i < 5; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(
                (Math.random() - 0.5) * ITEM_SIZE * 0.5,
                ITEM_SIZE * 0.3 + Math.random() * ITEM_SIZE * 0.2,
                (Math.random() - 0.5) * ITEM_SIZE * 0.5
            );
            itemGroup.add(particle);
            
            // Animate the steam particles
            const animateParticle = () => {
                particle.position.y += 0.01;
                particle.material.opacity -= 0.01;
                
                if (particle.material.opacity > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    itemGroup.remove(particle);
                }
            };
            
            animateParticle();
        }
    } else if (state === ITEM_STATES.CHOPPED) {
        // For chopped items, add some chopping lines
        if (type === ITEM_TYPES.ONION || type === ITEM_TYPES.TOMATO) {
            const lineGeometry = new THREE.BoxGeometry(ITEM_SIZE * 0.7, ITEM_SIZE * 0.01, ITEM_SIZE * 0.01);
            const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
            
            // Add chop lines
            for (let i = -1; i <= 1; i += 1) {
                const line = new THREE.Mesh(lineGeometry, lineMaterial);
                line.position.set(0, ITEM_SIZE * 0.05, i * ITEM_SIZE * 0.15);
                itemGroup.add(line);
            }
        }
    }
    
    // Add to scene
    scene.add(itemGroup);
    
    // Store metadata
    itemGroup.userData = {
        type: type,
        state: state,
        isHeldByPlayer: false,
        isOnCounter: false,
        counterId: null
    };
    
    // Add to game state
    gameState.items.push(itemGroup);
    
    return itemGroup;
}

// Create a plate
function createPlate(scene) {
    // Create a cylinder geometry for the plate
    const plateGeometry = new THREE.CylinderGeometry(PLATE_SIZE, PLATE_SIZE, PLATE_SIZE * 0.1, 32);
    
    // Create a material for the plate
    const plateMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff, 
        shininess: 100,
        specular: 0x111111
    });
    
    // Create the mesh
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    
    // Set the rotation so the plate lies flat
    plate.rotation.x = Math.PI / 2;
    
    // Add to scene and track in game state
    scene.add(plate);
    gameState.plates.push(plate);
    
    // Set user data for tracking
    plate.userData = {
        type: ITEM_TYPES.PLATE,
        state: null // Plates don't have a processing state
    };
    
    // Initialize empty ingredients array
    plate.ingredients = [];
    plate.ingredientMeshes = [];
    
    return plate;
}

// Add an ingredient to a plate
export function addIngredientToPlate(plate, ingredient) {
    if (!plate || !ingredient) return false;
    
    // Ensure the item is chopped or cooked
    if (ingredient.state !== ITEM_STATES.CHOPPED && ingredient.state !== ITEM_STATES.COOKED) {
        console.log("Only processed ingredients can be added to plates");
        return false;
    }
    
    // Check if plate already has this ingredient type
    if (plate.ingredients) {
        const hasType = plate.ingredients.some(ing => ing.type === ingredient.type);
        if (hasType) {
            console.log("Plate already has this ingredient type");
            return false;
        }
        
        // Plates can hold at most 3 ingredients
        if (plate.ingredients.length >= 3) {
            console.log("Plate is full");
            return false;
        }
    } else {
        plate.ingredients = [];
    }
    
    // Add ingredient to plate's data
    plate.ingredients.push({
        type: ingredient.type,
        state: ingredient.state
    });
    
    // Create visual representation of the ingredient
    const visual = createVisualIngredient(ingredient.type, ingredient.state);
    
    // Position based on number of ingredients
    const numIngredients = plate.ingredients.length;
    const heightOffset = 0.2; // Base height offset
    
    // Calculate position on the plate
    if (numIngredients === 1) {
        // First ingredient goes in the center
        visual.position.set(0, heightOffset, 0);
    } else if (numIngredients === 2) {
        // Second ingredient offset to the back
        visual.position.set(0, heightOffset, -PLATE_SIZE * 0.2);
        
        // Reposition the first ingredient to the front
        if (plate.ingredientMeshes && plate.ingredientMeshes.length > 0) {
            plate.ingredientMeshes[0].position.set(0, heightOffset, PLATE_SIZE * 0.2);
        }
    } else if (numIngredients === 3) {
        // Third ingredient goes to the right
        visual.position.set(PLATE_SIZE * 0.2, heightOffset, 0);
        
        // Keep first and second ingredients in their positions
        if (plate.ingredientMeshes && plate.ingredientMeshes.length > 1) {
            // Adjust the second ingredient to the left
            plate.ingredientMeshes[1].position.set(-PLATE_SIZE * 0.2, heightOffset, 0);
        }
    }
    
    // Attach visual to plate
    plate.add(visual);
    
    // Track visual objects for later reference
    if (!plate.ingredientMeshes) {
        plate.ingredientMeshes = [];
    }
    plate.ingredientMeshes.push(visual);
    
    return true;
}

// Create a visual representation of an ingredient (without full game logic)
function createVisualIngredient(type, state) {
    // Determine color based on type and state
    let color;
    switch (type) {
        case ITEM_TYPES.ONION:
            color = state === ITEM_STATES.CHOPPED ? 0x00ff00 : 0x8B4513;
            break;
        case ITEM_TYPES.TOMATO:
            color = state === ITEM_STATES.CHOPPED ? 0xAA3333 : 0x882222;
            break;
        case ITEM_TYPES.MEAT:
            color = state === ITEM_STATES.CHOPPED ? 0xBB5533 : 0x663311;
            break;
        default:
            color = 0x00ff00;
    }
    
    // Create a group to hold the ingredient parts
    const ingredientGroup = new THREE.Group();
    
    // Create different visual representations based on type and state
    if (type === ITEM_TYPES.MEAT) {
        if (state === ITEM_STATES.CHOPPED) {
            // Chopped meat is multiple small cubes
            const cubeSize = ITEM_SIZE * 0.15;
            const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize * 0.6, cubeSize);
            const cubeMaterial = new THREE.MeshPhongMaterial({ color: color, shininess: 30 });
            
            // Add cubes in a grid pattern
            for (let x = -1; x <= 1; x += 1) {
                for (let z = -1; z <= 1; z += 1) {
                    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cube.position.set(x * cubeSize * 1.2, 0, z * cubeSize * 1.2);
                    ingredientGroup.add(cube);
                }
            }
        } else if (state === ITEM_STATES.COOKED) {
            // Cooked meat with grill marks
            const meatGeometry = new THREE.BoxGeometry(ITEM_SIZE * 0.7, ITEM_SIZE * 0.15, ITEM_SIZE * 0.7);
            const meatMaterial = new THREE.MeshPhongMaterial({ color: color, shininess: 40 });
            const meat = new THREE.Mesh(meatGeometry, meatMaterial);
            ingredientGroup.add(meat);
            
            // Add grill marks
            const markGeometry = new THREE.BoxGeometry(ITEM_SIZE * 0.5, ITEM_SIZE * 0.01, ITEM_SIZE * 0.05);
            const markMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            
            for (let i = -1; i <= 1; i += 1) {
                const mark = new THREE.Mesh(markGeometry, markMaterial);
                mark.position.set(0, ITEM_SIZE * 0.08, i * ITEM_SIZE * 0.15);
                mark.rotation.y = Math.PI / 4;
                ingredientGroup.add(mark);
                
                const mark2 = new THREE.Mesh(markGeometry, markMaterial);
                mark2.position.set(0, ITEM_SIZE * 0.08, i * ITEM_SIZE * 0.15);
                mark2.rotation.y = -Math.PI / 4;
                ingredientGroup.add(mark2);
            }
        }
    } else if (type === ITEM_TYPES.TOMATO) {
        if (state === ITEM_STATES.CHOPPED) {
            // Chopped tomatoes are flat cylinders
            const geometry = new THREE.CylinderGeometry(ITEM_SIZE * 0.4, ITEM_SIZE * 0.4, ITEM_SIZE * 0.08, 16);
            const material = new THREE.MeshPhongMaterial({ color: color, shininess: 30 });
            const tomato = new THREE.Mesh(geometry, material);
            tomato.rotation.x = Math.PI / 2; // Lay flat
            ingredientGroup.add(tomato);
            
            // Add some slice marks
            const lineGeometry = new THREE.BoxGeometry(ITEM_SIZE * 0.5, ITEM_SIZE * 0.01, ITEM_SIZE * 0.01);
            const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x220000 });
            
            for (let i = -1; i <= 1; i += 1) {
                const line = new THREE.Mesh(lineGeometry, lineMaterial);
                line.position.set(0, ITEM_SIZE * 0.05, i * ITEM_SIZE * 0.1);
                ingredientGroup.add(line);
            }
        } else if (state === ITEM_STATES.COOKED) {
            // Cooked tomatoes are sauce-like
            const geometry = new THREE.CylinderGeometry(ITEM_SIZE * 0.5, ITEM_SIZE * 0.5, ITEM_SIZE * 0.08, 16);
            const material = new THREE.MeshPhongMaterial({ 
                color: color, 
                shininess: 60,
                emissive: 0x330000,
                emissiveIntensity: 0.2
            });
            const tomato = new THREE.Mesh(geometry, material);
            tomato.rotation.x = Math.PI / 2; // Lay flat
            ingredientGroup.add(tomato);
        }
    } else {
        // Onions and other ingredients
        if (state === ITEM_STATES.CHOPPED) {
            // Flat pieces
            const geometry = new THREE.CylinderGeometry(ITEM_SIZE * 0.4, ITEM_SIZE * 0.4, ITEM_SIZE * 0.1, 16);
            const material = new THREE.MeshPhongMaterial({ color: color, shininess: 30 });
            const onion = new THREE.Mesh(geometry, material);
            onion.rotation.x = Math.PI / 2; // Lay flat
            ingredientGroup.add(onion);
            
            // Add chop lines
            const lineGeometry = new THREE.BoxGeometry(ITEM_SIZE * 0.6, ITEM_SIZE * 0.01, ITEM_SIZE * 0.01);
            const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
            
            for (let i = -1; i <= 1; i += 1) {
                const line = new THREE.Mesh(lineGeometry, lineMaterial);
                line.position.set(0, ITEM_SIZE * 0.06, i * ITEM_SIZE * 0.1);
                ingredientGroup.add(line);
            }
        } else if (state === ITEM_STATES.COOKED) {
            // Cooked version
            const geometry = new THREE.CylinderGeometry(ITEM_SIZE * 0.4, ITEM_SIZE * 0.4, ITEM_SIZE * 0.15, 16);
            const material = new THREE.MeshPhongMaterial({ 
                color: color, 
                shininess: 60,
                emissive: 0x331100,
                emissiveIntensity: 0.2
            });
            const onion = new THREE.Mesh(geometry, material);
            onion.rotation.x = Math.PI / 2; // Lay flat
            ingredientGroup.add(onion);
        }
    }
    
    return ingredientGroup;
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