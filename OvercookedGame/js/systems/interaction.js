import gameState from '../state.js';
import { kitchen } from '../entities/kitchen.js';
import { checkProximity } from '../utils/collision.js';
import { createErrorMessage } from '../utils/ui.js';
import { createItem, attachItemToPlayer, placeItemOnCounter, pickUpItemFromCounter } from '../entities/items.js';
import { ITEM_TYPES } from '../constants.js';

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

// Handle interactions based on proximity to kitchen elements
export function handleInteraction() {
    const scene = gameState.player?.parent;
    if (!scene) return;
    
    // Check proximity to pantry
    if (checkProximity(gameState.playerPosition, kitchen.stations.pantry.position)) {
        handlePantryInteraction(scene);
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