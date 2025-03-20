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
- Implements the kitchen layout:
  - Defines game constants (station and counter sizes)
  - Creates a color scheme for different kitchen elements
  - Provides a function to create kitchen elements with labels
  - Implements a structured layout with stations and counters
  - Stores references to all elements in a `kitchen` object
  - Attaches metadata to elements for game logic
- Implements the player character and controls:
  - Creates a circular player representation
  - Manages player movement through keyboard and touch inputs
  - Implements collision detection to prevent movement through objects
  - Provides feedback through error messages
  - Sets up mobile controls that adapt to the device type
- Implements the item system:
  - Defines item types (onion, tomato, meat) and states (raw, chopped, cooked)
  - Creates visual representations for items
  - Manages item states (held by player, on counter, etc.)
  - Handles interactions with the pantry to create new items
  - Enables placing items on counters and picking them up
  - Maintains the relationship between items and counters
- Uses a central game state object to track:
  - Player position and held items
  - Input states (keyboard/touch)
  - UI elements like error messages
  - All items in the scene and their states
- Will eventually contain additional game logic:
  - Station-specific processing (chopping, cooking)
  - Recipe assembly and validation
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
- **Object-Oriented Design**: Using objects to represent game elements with associated metadata
- **Centralized Kitchen Layout**: Storing all kitchen elements in a central `kitchen` object for easy access and management
- **Centralized Game State**: Using a single state object to maintain game state, making it easier to track and update
- **AABB Collision Detection**: Using Axis-Aligned Bounding Box collision detection for simple and efficient collision handling
- **Visual Differentiation**: Using different colors for each type of station, counter, and item for easy identification
- **Text Labels**: Adding text labels to kitchen elements to improve usability and clarity
- **Proximity-Based Interactions**: Using a radius-based proximity system to detect when the player can interact with stations or counters
- **Z-Index Management**: Carefully managing z-index values to ensure proper rendering order (counters below items below player below UI)
- **Responsive Design**: Implementing window resize handling to ensure the game works well on different screen sizes
- **Cross-Platform Controls**: Supporting both keyboard and touch controls to work across desktop and mobile devices
- **User Feedback**: Implementing an error message system to provide feedback on player actions
- **State Tracking**: Maintaining comprehensive state for all game elements to enable complex interactions
