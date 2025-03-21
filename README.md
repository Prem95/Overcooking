# Overcooked Game

A browser-based 3D cooking game inspired by the popular Overcooked series, built with Three.js.

## Overview

This game recreates the frantic cooking experience of Overcooked, featuring:

- 3D kitchen environment with interactive stations
- Chef character with realistic 3D model
- Food preparation mechanics
- Item handling system for cooking workflows

## Getting Started

### Prerequisites

- Node.js (v12.0.0 or higher)
- npm (v6.0.0 or higher)
- Modern web browser with WebGL support

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd overcooked-game
   ```

2. Install dependencies:
   ```
   cd OvercookedGame
   npm install
   ```

### Running the Game

1. Start the development server:
   ```
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## How to Play

### Controls

- **Movement**: WASD or Arrow keys
- **Interact**: Space bar
- **Mobile**: Touch controls appear automatically on mobile devices

### Gameplay

1. **Get ingredients** from the pantry station (green)
2. **Prepare ingredients** at the chopping station (red)
3. **Cook food** at the cooking station (orange)
4. **Plate meals** from the plate dispenser (grey)
5. **Serve dishes** at the serving station (blue)
6. Use **counters** (light grey) to temporarily place items

## Game Architecture

The game uses a modular architecture with the following components:

### Project Structure

```
OvercookedGame/
├── index.html           # Main game HTML entry point
├── main.js              # Main application entry point
├── js/
│   ├── entities/        # Game objects (player, kitchen, items)
│   ├── systems/         # Game systems (controls, physics)
│   ├── utils/           # Helper functions
│   ├── constants.js     # Game constants and configuration
│   └── state.js         # Game state management
├── node_modules/        # Dependencies
└── package.json         # Project configuration
```

### Key Components

- **Three.js** - Powers the 3D rendering
- **Module System** - ES6 modules for code organization
- **Entity Components** - Modular object definitions
- **State Management** - Centralized game state

## Technologies

- **Three.js** - 3D graphics library
- **JavaScript (ES6+)** - Core programming language 
- **HTML5/CSS3** - Structure and styling
- **HTTP Server** - Local development server

## Browser Compatibility

- Chrome (recommended)
- Firefox 
- Edge
- Safari

Mobile browsers are supported with adaptive touch controls.

## Troubleshooting

If you encounter issues:

### Blank Screen or Loading Issues

1. **Check Browser Console** (F12) for errors
2. **Verify that your browser supports ES modules**
3. **Make sure you're running through a local server** (not via file:// protocol)
4. **Clear browser cache** or try incognito mode

### Performance Issues

1. **Close other browser tabs** and applications
2. **Reduce browser extensions** that might interfere
3. **Check for WebGL support** in your browser
4. **Lower the resolution** of your display if needed

For more detailed troubleshooting, refer to the `troubleshooting.md` file in the OvercookedGame directory.

## Future Enhancements

- Additional recipe types
- Multiplayer support
- Level progression system
- Score tracking
- Enhanced visual effects

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the Overcooked game series by Ghost Town Games
- Built with Three.js
- Special thanks to the Three.js community 