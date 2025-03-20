# Project Architecture

## Project Structure

```
OvercookedGame/
├── index.html       # Main HTML file containing the game canvas
├── main.js          # Game entry point and ThreeJS initialization
├── package.json     # NPM configuration and dependencies
└── node_modules/    # External dependencies (ThreeJS, etc.)
```

## File Purposes

### index.html
- Provides the HTML structure for the game
- Contains a canvas element with ID "gameCanvas" where the game is rendered
- Imports the main.js script as an ES module
- Includes minimal styling to ensure the canvas fills the viewport

### main.js
- Initializes the ThreeJS environment:
  - Creates a scene, camera, and renderer
  - Sets up an orthographic camera for 2D top-down view
  - Configures the renderer to target the canvas element
  - Handles window resize events to maintain proper display
  - Implements the game loop using requestAnimationFrame
- Will eventually contain all game logic including:
  - Kitchen layout rendering
  - Player movement and controls
  - Item system and interactions
  - Game state management
  - Orders and scoring

### package.json
- Defines project metadata and dependencies
- Configures the project to use ES modules
- Includes ThreeJS as the main dependency
- Provides npm scripts for development:
  - `npm start`: Launches a development server to test the game

## Design Decisions

- **ThreeJS for Rendering**: Using ThreeJS for its powerful rendering capabilities while maintaining a 2D top-down view with an orthographic camera
- **ES Modules**: Using ES modules for better code organization and modern JavaScript features
- **Simple Geometric Shapes**: Starting with basic shapes for game elements before adding more complex assets
- **Responsive Design**: Implementing window resize handling to ensure the game works well on different screen sizes
