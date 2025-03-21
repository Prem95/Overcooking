// Centralized game state
const gameState = {
    keysPressed: {},
    player: null,
    playerPosition: { x: 0, y: 0 },
    playerRotation: 0, // Player looking direction in radians
    playerHolding: null,
    errorMessage: null,
    errorMessageTimeout: null,
    items: [],  // To track all items in the scene
    processingInProgress: false, // Flag to track if chopping/cooking is in progress
    progressBar: null, // Reference to the current progress bar
    plates: [], // Array to track all plates in the game
    score: 0,   // Player's score
    activeRecipes: [], // Recipes that need to be prepared (will be added in future steps)
    camera: null, // Reference to the camera for first-person view
    mouseDeltaX: 0, // Mouse movement for first-person looking
    lastInteractionTime: 0 // To prevent too frequent interactions
};

// Indicate when game is loaded
export function setGameLoaded() {
    window.gameLoaded = true;
}

export default gameState; 