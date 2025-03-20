// Centralized game state
const gameState = {
    keysPressed: {},
    player: null,
    playerPosition: { x: 0, y: 0 },
    playerHolding: null,
    errorMessage: null,
    errorMessageTimeout: null,
    items: []  // To track all items in the scene
};

// Indicate when game is loaded
export function setGameLoaded() {
    window.gameLoaded = true;
}

export default gameState; 