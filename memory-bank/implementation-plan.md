---
description: 
globs: 
alwaysApply: true
---
# Implementation Plan for Overcooked-Inspired Game

This document provides a step-by-step implementation plan for building a simplified version of the Overcooked-inspired game described in the Game Design Document (GDD). The plan focuses on the base game features for a single-player, time-management cooking game and is intended for AI developers to follow. Each step includes a specific instruction and a test to validate correct implementation. 

The base game includes a kitchen with essential stations, player movement, item handling, dish preparation, order fulfillment, and basic time and cash management, all rendered in a 2D top-down view using ThreeJS. Additional features like special skills, multiple levels, and complex recipes can be added in future iterations.

## Important Implementation Details

### Design Considerations
- **Collision Detection**: Players cannot move through stations or counters. The game should simulate a real kitchen where physical objects block movement.
- **Visual Indicators**: Use simple progress bars displayed above the player's head to show cutting/cooking progress.
- **Game State Management**: Use a central state object to maintain game state for simplicity.
- **Mobile Support**: Include support for mobile devices with an overlay of WASD buttons at the bottom of the screen and specific keys for actions (cut, carry, place).
- **Error Handling**: Display a simple "Not allowed" popup above the player's head when an invalid action is attempted.
- **Asset Management**: Use simple ThreeJS geometric models for now.
- **Sound Effects**: No sound implementation in the initial version.
- **Game Loop Structure**: Use requestAnimationFrame with a single update function.
- **Success/Failure Conditions**: Success is measured by the total number of orders completed within the time limit. The highest number of completed orders wins.
- **Difficulty Progression**: Each level can have a maximum of 3 dishes with increasing complexity:
  - Level 1: Simple dishes (e.g., raw salmon)
  - Level 2: Medium complexity (e.g., fried rice with egg and rice)
  - Level 3: Complex dishes (e.g., pizza with flour, tomato, and cheese)

## 1. Setting up the Project

### Step 1: Create the Project Directory
- Create a new directory for the project on your filesystem.
- Name it something descriptive, like "OvercookedGame".
- **Test**: Verify that the directory exists in your filesystem.

### Step 2: Initialize npm
- Open a terminal in the project directory.
- Run the command `npm init -y` to create a default package.json file.
- **Test**: Check that a package.json file exists in the directory with default content.

### Step 3: Install ThreeJS
- In the terminal, run `npm install three` to add ThreeJS as a dependency.
- **Test**: Confirm that a node_modules folder appears in the directory and includes the three package.

### Step 4: Create index.html
- Create a file named index.html in the project directory.
- Add the following content:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Overcooked-Inspired Game</title>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script type="module" src="main.js"></script>
</body>
</html>
```
- **Test**: Open index.html in a text editor and verify that it contains a canvas element and a script tag with type="module".

### Step 5: Set up main.js with ThreeJS
- Create a file named main.js in the project directory.
- In main.js, set up a basic ThreeJS scene:
  - Import ThreeJS using ES modules.
  - Create a scene, an orthographic camera for a 2D top-down view, and a WebGL renderer targeting the canvas with ID gameCanvas.
  - Set the camera to view a defined area (e.g., a 10x10 unit grid).
  - Add a simple 2D shape (e.g., a square) to the scene using a mesh with a plane geometry and a basic material.
  - Render the scene in an animation loop.
- **Test**: Open index.html in a browser (using a local server if needed due to module imports) and see a square rendered on the canvas.

## 2. Implementing the Kitchen Layout

### Step 6: Define and Render Kitchen Stations and Counters
- In main.js, define positions for the following stations and counters in a 2D layout:
  - Pantry
  - Chopping Station
  - Cooking Station
  - Plate Dispenser
  - Serving Station
  - At least 3 counter spaces (separate from station counters)
- Create 2D representations for each:
  - Use colored rectangles (meshes with plane geometry and different material colors) for each station and counter.
  - Assign unique colors (e.g., green for pantry, red for chopping) for easy identification.
  - Add all representations to the scene at their designated positions.
- **Test**: Reload the browser and see all stations and counters rendered as colored rectangles in a sensible kitchen layout (e.g., stations along edges, counters in the center).

## 3. Player Movement and Controls

### Step 7: Implement the Player Character
- In main.js, create a 2D representation for the player (e.g., a white circle using a circle geometry and basic material).
- Add the player to the scene at a starting position (e.g., center of the kitchen).
- Implement movement:
  - Add event listeners for arrow keys or WASD.
  - Update the player's position based on key presses with a fixed speed (e.g., 0.1 units per frame).
  - Implement collision detection to prevent the player from moving through stations and counters.
  - For mobile support, add WASD button overlays at the bottom of the screen.
- **Test**: Reload the browser and use arrow keys or WASD to move the player around the kitchen, verifying that the player cannot move through stations or counters.

### Step 7b: Implement Collision Detection
- Create a function to check if the player's new position would collide with any station or counter.
- If a collision is detected, prevent the player from moving to that position.
- **Test**: Try to move the player into a station or counter and verify that movement is blocked.

### Step 7c: Implement Mobile Controls
- Add WASD button overlays at the bottom of the screen for mobile devices.
- Add specific buttons for actions (cut, carry, place).
- Implement touch event handling for these buttons.
- **Test**: Open the game on a mobile device or mobile emulator and verify that the controls work properly.

## 4. Item System

### Step 8: Implement Picking Up Items from the Pantry
- Define a proximity radius (e.g., 0.5 units) for the player to interact with stations.
- When the player is within this radius of the pantry and presses the spacebar:
  - Create an item (e.g., an "onion" represented as a small yellow square).
  - Attach it to the player (e.g., position it slightly offset from the player's center).
  - Limit the player to holding one item at a time.
- **Test**: Move the player near the pantry, press space, and see a yellow square appear next to the player, moving with them.

### Step 9: Implement Placing Items on Counters
- Assign each counter a position and an occupancy state (empty or occupied).
- When the player is holding an item and is near an empty counter:
  - Pressing space places the item on the counter.
  - Move the item's visual representation to the counter's position.
  - Update the counter's state to occupied and clear the player's held item.
- If the player attempts an invalid action (e.g., placing an item on an occupied counter), display a "Not allowed" popup above the player's head.
- **Test**: Pick up an item from the pantry, move to an empty counter, press space, and see the item placed on the counter while the player's hands are empty. Also, try to place an item on an occupied counter and verify that the error message appears.

### Step 10: Implement Picking Up Items from Counters
- When the player is not holding an item and is near an occupied counter:
  - Pressing space picks up the item from the counter.
  - Attach the item to the player visually.
  - Update the counter's state to empty.
- **Test**: Move to a counter with an item, press space, and see the player holding the item while the counter becomes empty.

## 5. Station Interactions

### Step 11: Implement Chopping at the Chopping Station
- Assign the chopping station its own counter space (a specific position).
- When an item is on the chopping station's counter and the player is near:
  - Pressing space starts the chopping process.
  - Display a simple progress bar above the player's head that fills over 3 seconds.
  - After 3 seconds, change the item to a chopped state (e.g., change its color to green).
- **Test**: Place an item on the chopping station's counter, move near it, press space, wait 3 seconds, and see the item's color change to green.

### Step 12: Implement Cooking at the Cooking Station
- Assign the cooking station its own counter space.
- When an item is on the cooking station's counter and the player is near:
  - Pressing space starts the cooking process.
  - Display a simple progress bar above the player's head that fills over 5 seconds.
  - After 5 seconds, change the item to a cooked state (e.g., change its color to brown).
- **Test**: Place an item on the cooking station's counter, move near it, press space, wait 5 seconds, and see the item's color change to brown.

## 6. Plates and Assembling Dishes

### Step 13: Implement Picking Up Plates from the Plate Dispenser
- When the player is near the plate dispenser and presses space:
  - Create a plate (e.g., a gray rectangle).
  - Attach it to the player visually.
- **Test**: Move near the plate dispenser, press space, and see the player holding a gray rectangle.

### Step 14: Implement Adding Ingredients to the Plate
- When the player is holding a plate and is near a counter with a prepared ingredient (chopped or cooked):
  - Pressing space adds the ingredient to the plate.
  - Maintain a list of ingredients on the plate (e.g., store in a data structure).
  - Visually stack the ingredients on the plate (e.g., position them slightly overlapping).
- **Test**: Hold a plate, move to a counter with a prepared ingredient, press space, and see the ingredient visually added to the plate.

## 7. Orders and Serving

### Step 15: Implement the Order Queue
- Display an order queue at the top of the screen (e.g., using ThreeJS text or sprites).
- Add up to 3 orders, each with:
  - A dish name (e.g., "Salad").
  - A timer (e.g., 45 seconds).
- Use a predefined order for the base game (e.g., "Salad" requiring a chopped onion and a chopped tomato).
- Decrease each order's timer every second; remove the order if it reaches zero.
- **Test**: Reload the browser and see up to 3 orders at the top with their timers counting down.

### Step 16: Implement Serving Dishes
- Assign the serving station its own counter space.
- When the player is holding a plate with ingredients and is near the serving station:
  - Pressing space places the plate on the serving station's counter.
- When the player is near the serving station with a plate on its counter:
  - Pressing space serves the plate.
  - Check if the plate's ingredients match the order's recipe (e.g., "Salad" = chopped onion + chopped tomato).
  - If it matches, remove the order, increase cash by $10, and remove the plate.
  - If it doesn't match, remove the plate without reward.
- **Test**: Place a plate with correct ingredients (e.g., chopped onion and tomato) on the serving counter, press space, and see the order disappear and cash increase; place an incorrect plate and see it removed without reward.

## 8. Level Timer and Cash System

### Step 17: Implement the Level Timer
- Display a level timer at the top of the screen (e.g., using ThreeJS text), starting at 2 minutes.
- Decrease the timer every second.
- When it reaches zero, end the level and display the total number of orders completed.
- **Test**: Reload the browser and see the level timer counting down from 2 minutes.

### Step 18: Implement the Cash System
- Display the current cash balance (e.g., using ThreeJS text), starting at $0.
- When a correct dish is served in Step 16, increase the cash by $10.
- Keep track of the total number of completed orders as the success metric.
- **Test**: Serve a correct dish and see the cash display increase by $10 and the completed orders count increment.

## 9. Game State Management

### Step 19: Implement Central State Object
- Create a central state object to maintain all game state, including:
  - Player position and held items
  - Counter and station states
  - Order queue
  - Cash balance
  - Completed orders count
  - Time remaining
- Ensure all game functions reference and update this central state.
- Implement a simple game loop using requestAnimationFrame with a single update function that processes all game logic and rendering.
- **Test**: Verify that all game elements update correctly when the state changes.

## 10. Level Progression

### Step 20: Implement Level Progression
- Create a basic level progression system with increasing difficulty:
  - Level 1: Simple dishes (e.g., raw salmon)
  - Level 2: Medium complexity dishes (e.g., fried rice with egg and rice)
  - Level 3: Complex dishes (e.g., pizza with flour, tomato, and cheese)
- Each level can have a maximum of 3 different dishes available in the order queue.
- **Test**: Complete a level and verify that the next level has more complex dish requirements.

---

This plan outlines the creation of a functional base game where the player can prepare ingredients, assemble dishes on plates, serve orders, and manage time and cash. Future enhancements, such as special skills, additional levels, and more complex recipes, can build upon this foundation. 