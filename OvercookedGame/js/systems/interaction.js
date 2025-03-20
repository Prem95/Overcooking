import gameState from '../state.js';
import { kitchen } from '../entities/kitchen.js';
import { checkProximity } from '../utils/collision.js';
import { createErrorMessage, createProgressBar } from '../utils/ui.js';
import { createItem, attachItemToPlayer, placeItemOnCounter, pickUpItemFromCounter } from '../entities/items.js';
import { ITEM_TYPES, ITEM_STATES } from '../constants.js';

// Handle pantry interaction
export function handlePantryInteraction(scene) {
    // If player is already holding something, can't pick up a new item
    if (gameState.playerHolding) {
        createErrorMessage(scene, "Hands full!");
        return;
    }
    
    // Get a random item type - for now, just onions
    const itemType = ITEM_TYPES.ONION;
    
    // Create the item
    const item = createItem(scene, itemType);
    
    // Attach it to the player
    attachItemToPlayer(item);
}

// Handle counter interaction
export function handleCounterInteraction(scene, counter) {
    // If counter is empty and player is holding an item, place item on counter
    if (!counter.userData.isOccupied && gameState.playerHolding) {
        placeItemOnCounter(gameState.playerHolding, counter);
    }
    // If counter has an item and player's hands are empty, pick up item
    else if (counter.userData.isOccupied && !gameState.playerHolding) {
        pickUpItemFromCounter(counter);
    }
    // Invalid action (counter occupied and player holding something)
    else if (counter.userData.isOccupied && gameState.playerHolding) {
        createErrorMessage(scene, "Counter occupied!");
    }
    // Invalid action (counter empty and player not holding anything)
    else {
        createErrorMessage(scene, "Nothing to pick up!");
    }
}

// Handle chopping station interaction
export function handleChoppingInteraction(scene) {
    // Check if there's already a processing task in progress
    if (gameState.processingInProgress) {
        createErrorMessage(scene, "Already processing!");
        return;
    }
    
    // Get the counter space in front of the chopping station (now at -4, 0)
    const choppingCounter = kitchen.counters.find(counter => 
        counter.position.x === -4 && 
        counter.position.y === 0
    );
    
    // If no counter found or counter is empty, show error
    if (!choppingCounter || !choppingCounter.userData.isOccupied) {
        createErrorMessage(scene, "Nothing to chop!");
        return;
    }
    
    // Get the item on the counter
    const item = choppingCounter.userData.item;
    
    // Only raw items can be chopped
    if (item.userData.state !== ITEM_STATES.RAW) {
        createErrorMessage(scene, "Already processed!");
        return;
    }
    
    // Start the chopping process
    const progressBar = createProgressBar(scene, gameState.playerPosition.x, gameState.playerPosition.y);
    gameState.processingInProgress = true;
    
    // Chopping takes 3 seconds
    let progress = 0;
    const choppingInterval = setInterval(() => {
        progress += 0.05; // Increment by 5% each frame for smooth animation
        
        // Update progress bar
        if (progressBar && progressBar.material && progressBar.material.uniforms) {
            progressBar.material.uniforms.progress.value = progress;
        }
        
        // Check if complete
        if (progress >= 1) {
            clearInterval(choppingInterval);
            
            // Remove progress bar
            if (progressBar) {
                scene.remove(progressBar);
            }
            
            // Create a new chopped item
            const choppedItem = createItem(scene, item.userData.type, ITEM_STATES.CHOPPED);
            
            // Place it on the counter
            placeItemOnCounter(choppedItem, choppingCounter);
            
            // Remove the original item
            scene.remove(item);
            gameState.items = gameState.items.filter(i => i !== item);
            
            // Reset processing state
            gameState.processingInProgress = false;
        }
    }, 50); // Update every 50ms for smooth animation
}

// Handle cooking station interaction
export function handleCookingInteraction(scene) {
    // Check if there's already a processing task in progress
    if (gameState.processingInProgress) {
        createErrorMessage(scene, "Already processing!");
        return;
    }
    
    // Get the counter space in front of the cooking station (now at -4, -4)
    const cookingCounter = kitchen.counters.find(counter => 
        counter.position.x === -4 && 
        counter.position.y === -4
    );
    
    // If no counter found or counter is empty, show error
    if (!cookingCounter || !cookingCounter.userData.isOccupied) {
        createErrorMessage(scene, "Nothing to cook!");
        return;
    }
    
    // Get the item on the counter
    const item = cookingCounter.userData.item;
    
    // Only chopped items can be cooked
    if (item.userData.state !== ITEM_STATES.CHOPPED) {
        if (item.userData.state === ITEM_STATES.RAW) {
            createErrorMessage(scene, "Chop it first!");
        } else {
            createErrorMessage(scene, "Already cooked!");
        }
        return;
    }
    
    // Start the cooking process
    const progressBar = createProgressBar(scene, gameState.playerPosition.x, gameState.playerPosition.y);
    gameState.processingInProgress = true;
    
    // Cooking takes 5 seconds
    let progress = 0;
    const cookingInterval = setInterval(() => {
        progress += 0.03; // Increment by 3% each frame for smooth animation
        
        // Update progress bar
        if (progressBar && progressBar.material && progressBar.material.uniforms) {
            progressBar.material.uniforms.progress.value = progress;
        }
        
        // Check if complete
        if (progress >= 1) {
            clearInterval(cookingInterval);
            
            // Remove progress bar
            if (progressBar) {
                scene.remove(progressBar);
            }
            
            // Create a new cooked item
            const cookedItem = createItem(scene, item.userData.type, ITEM_STATES.COOKED);
            
            // Place it on the counter
            placeItemOnCounter(cookedItem, cookingCounter);
            
            // Remove the original item
            scene.remove(item);
            gameState.items = gameState.items.filter(i => i !== item);
            
            // Reset processing state
            gameState.processingInProgress = false;
        }
    }, 50); // Update every 50ms for smooth animation
}

// Handle interactions based on proximity to kitchen elements
export function handleInteraction() {
    const scene = gameState.player?.parent;
    if (!scene) return;
    
    // Check proximity to pantry
    if (checkProximity(gameState.playerPosition, kitchen.stations.pantry.position)) {
        handlePantryInteraction(scene);
        return;
    }
    
    // Check proximity to chopping station
    if (checkProximity(gameState.playerPosition, kitchen.stations.chopping.position)) {
        handleChoppingInteraction(scene);
        return;
    }
    
    // Check proximity to cooking station
    if (checkProximity(gameState.playerPosition, kitchen.stations.cooking.position)) {
        handleCookingInteraction(scene);
        return;
    }
    
    // Check proximity to counters
    for (const counter of kitchen.counters) {
        if (checkProximity(gameState.playerPosition, counter.position)) {
            handleCounterInteraction(scene, counter);
            return;
        }
    }
    
    // If we get here, player is not near any interactive element
    createErrorMessage(scene, "Nothing nearby!");
} 