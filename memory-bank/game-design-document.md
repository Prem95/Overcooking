---
description: 
globs: 
alwaysApply: true
---
# Overcooked Game Design Document

## Game Overview
This is a single-player time-management cooking game inspired by Overcooked. You play as a lone chef in a bustling kitchen, tasked with preparing and serving dishes based on incoming customer orders. The game features 5 levels of increasing difficulty, each with a time limit. Correctly prepared and served dishes earn you cash, which can be spent on special skills to enhance your performance. The goal is to efficiently manage your time and resources to meet the demands of each level.

## Gameplay Mechanics

### Player Controls
- **Movement**: Use arrow keys or WASD to move the chef around the kitchen.
- **Pick Up Items**: Press the spacebar to pick up ingredients or dishes when near them.
- **Perform Actions**: Press the spacebar near a station to perform its specific action (e.g., chop, cook).
- **Activate Skills**: Use designated keys (e.g., 1, 2, 3) to activate special skills when you have enough cash.

### Kitchen Stations
- **Pantry**: Source of raw ingredients (e.g., onion, tomato, meat) with an unlimited supply.
- **Chopping Station**: Chops ingredients, taking 3 seconds per action.
- **Cooking Station**: Cooks ingredients, taking 5 seconds per action.
- **Assembling Station**: Combines prepared ingredients into a dish, taking 2 seconds.
- **Serving Station**: Delivers completed dishes to fulfill orders, instant action.

> Note: Limited counter space (e.g., 4 spots) is available to temporarily place items. If full, you must clear space before adding more items.

### Ingredients and Dishes
- **Ingredients**: Examples include onion, tomato, carrot, meat, and sauce.
- **Dishes**: Each dish has a recipe specifying required prepared ingredients. Examples:
  - *Salad*: Chopped onion + chopped tomato
  - *Steak*: Cooked meat
  - *Stew*: Chopped carrot + cooked meat + sauce
- **Progression**: Recipes grow more complex across levels, requiring more ingredients and preparation steps (e.g., Level 1: 2 ingredients, Level 5: up to 5 ingredients).

### Orders
- **Appearance**: Orders appear in a queue, with up to 3 visible at once.
- **Details**: Each order specifies a dish and includes a timer (e.g., 45 seconds in Level 1, decreasing to 20 seconds by Level 5).
- **Serving**: Deliver the correct dish to the serving station before the timer expires to earn $10. Incorrect dishes are not accepted, wasting time but incurring no additional penalty.
- **Frequency**: Orders arrive at intervals (e.g., every 15 seconds in Level 1, every 5 seconds in Level 5).

### Cash and Special Skills
- **Earning Cash**: You start each level with $0 and earn $10 for every correctly served dish.
- **Spending Cash**: Use cash during gameplay to activate special skills:
  - *Speed Boost*: $20, increases movement speed by 50% for 10 seconds.
  - *Quick Chop*: $15, makes the next 3 chopping actions instant (0 seconds).
  - *Time Extension*: $30, adds 15 seconds to the level timer.
- **Management**: Cash is earned and spent within each level, resetting to $0 at the start of the next level.

## Levels and Progression
- **Structure**: The game has 5 levels, each with a unique time limit and target number of dishes to serve to pass.
- **Details**:
  - *Level 1*: 2 minutes, 5 dishes, simple recipes (2 ingredients), orders every 15 seconds, 45-second order timers.
  - *Level 2*: 2.5 minutes, 7 dishes, slightly harder recipes (2-3 ingredients), orders every 12 seconds, 40-second order timers.
  - *Level 3*: 3 minutes, 10 dishes, moderate recipes (3-4 ingredients), orders every 10 seconds, 35-second order timers.
  - *Level 4*: 3.5 minutes, 13 dishes, harder recipes (4 ingredients), orders every 7 seconds, 25-second order timers.
  - *Level 5*: 4 minutes, 16 dishes, complex recipes (4-5 ingredients), orders every 5 seconds, 20-second order timers.
- **Difficulty**: Increases through more complex recipes, faster order frequency, and shorter individual order timers, balanced by longer level times.

## User Interface
- **Kitchen Layout**: Displays stations (pantry, chopping, cooking, assembling, serving) and counter spaces in a 2D top-down view.
- **Order Queue**: Shown at the top, listing up to 3 orders with their dishes and countdown timers.
- **Cash and Skills**: Displayed at the bottom, showing current cash balance and buttons/icons for activating special skills.
- **Level Timer**: A prominent countdown timer indicating remaining level time.
- **Prompts**: Action prompts (e.g., "Press Space to Chop") appear when near stations. 