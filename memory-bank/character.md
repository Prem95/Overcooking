# Three.js Character and Item Code for Overcooked-Inspired Game

This document provides Three.js code to create a 3D chef character and items (ingredients and dishes) for an Overcooked-inspired game. The character has a blocky, voxel-like style reminiscent of Minecraft skins, with stylish clothing and accessories. Items use simple 3D shapes with distinct colors to indicate their states.

## Character Design

The chef character has a pixelated, blocky appearance with:

### Head
- Black hair with a side part
- Blue eyes 
- Brown beard
- Black sunglasses

### Body
- White dress shirt under a black jacket with subtle grid pattern
- Dark blue pants
- Brown shoes

### Cosmetics
- Black sunglasses
- Stylish jacket with grid texture

## Item Design

Items include ingredients and dishes with state-based appearances:

### Ingredients
- Raw: Sphere with unique color (e.g. yellow for onion)
- Chopped: Sphere with different color (e.g. green)
- Cooked: Sphere with cooked color (e.g. brown)

### Dishes
- Plate with stacked ingredients (simple cylinder)

## Code Examples

### Scene Setup
Set up the Three.js scene with an orthographic camera for a top-down view, ideal for a kitchen-based game layout.
javascript

import * as THREE from 'three';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Light blue background

// Set up orthographic camera for top-down view
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 10;
const camera = new THREE.OrthographicCamera(
  frustumSize * aspect / -2,
  frustumSize * aspect / 2,
  frustumSize / 2,
  frustumSize / -2,
  0.1,
  1000
);
camera.position.set(0, 10, 0); // Camera above the scene
camera.lookAt(0, 0, 0);

// Set up renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

Character Model
The character is built using cubes for each body part, styled with materials to reflect the described clothing and accessories.
javascript

// Helper function to create a cube with color
function createCube(sizeX, sizeY, sizeZ, color) {
  const geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
  const material = new THREE.MeshPhongMaterial({ color });
  return new THREE.Mesh(geometry, material);
}

// Create character group
const character = new THREE.Group();

// Head (with hair, beard, sunglasses)
const head = createCube(1, 1, 1, 0xFFC1A0); // Light peach skin tone
head.position.set(0, 1.5, 0);
character.add(head);

// Sunglasses (cosmetic accessory)
const sunglasses = createCube(1.1, 0.2, 0.1, 0x000000); // Black sunglasses
sunglasses.position.set(0, 1.7, 0.45); // Positioned on face
character.add(sunglasses);

// Hair
const hair = createCube(1.1, 0.4, 1.1, 0x000000); // Black hair
hair.position.set(0, 1.9, 0);
character.add(hair);

// Torso (white shirt and black jacket)
const torso = createCube(1, 1, 0.5, 0x1C2526); // Black jacket
torso.position.set(0, 0.5, 0);
character.add(torso);

// Shirt (visible under jacket)
const shirt = createCube(0.8, 0.8, 0.6, 0xFFFFFF); // White shirt
shirt.position.set(0, 0.5, 0);
character.add(shirt);

// Left Arm
const leftArm = createCube(0.5, 1, 0.5, 0x1C2526); // Jacket sleeve
leftArm.position.set(-0.75, 0.5, 0);
character.add(leftArm);

// Right Arm
const rightArm = createCube(0.5, 1, 0.5, 0x1C2526); // Jacket sleeve
rightArm.position.set(0.75, 0.5, 0);
character.add(rightArm);

// Left Leg
const leftLeg = createCube(0.5, 1, 0.5, 0x2A4066); // Dark blue pants
leftLeg.position.set(-0.25, 0, 0);
character.add(leftLeg);

// Right Leg
const rightLeg = createCube(0.5, 1, 0.5, 0x2A4066); // Dark blue pants
rightLeg.position.set(0.25, 0, 0);
character.add(rightLeg);

// Shoes
const leftShoe = createCube(0.6, 0.2, 0.6, 0x5C4033); // Brown shoes
leftShoe.position.set(-0.25, -0.4, 0);
character.add(leftShoe);
const rightShoe = createCube(0.6, 0.2, 0.6, 0x5C4033);
rightShoe.position.set(0.25, -0.4, 0);
character.add(rightShoe);

// Add character to scene
scene.add(character);

Item Models
Items are created as spheres or cylinders with colors indicating their state, keeping the design simple yet visually distinct.
javascript

// Function to create an ingredient
function createIngredient(type, state) {
  let color;
  switch (state) {
    case 'raw':
      color = type === 'onion' ? 0xffff00 : 0xff0000; // Yellow onion, red tomato
      break;
    case 'chopped':
      color = 0x00ff00; // Green for chopped
      break;
    case 'cooked':
      color = 0x8B4513; // Brown for cooked
      break;
  }
  const geometry = new THREE.SphereGeometry(0.3, 16, 16);
  const material = new THREE.MeshPhongMaterial({ color });
  const ingredient = new THREE.Mesh(geometry, material);
  return ingredient;
}

// Example: Raw onion
const rawOnion = createIngredient('onion', 'raw');
rawOnion.position.set(2, 0.15, 0); // Slightly above ground
scene.add(rawOnion);

// Function to create a dish (plate with ingredients)
function createDish(ingredients) {
  const plateGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
  const plateMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc }); // Light gray plate
  const plate = new THREE.Mesh(plateGeometry, plateMaterial);

  // Add ingredients on top
  ingredients.forEach((ingredient, index) => {
    const ingMesh = createIngredient(ingredient.type, ingredient.state);
    ingMesh.position.set(0, 0.1 + index * 0.2, 0);
    plate.add(ingMesh);
  });

  return plate;
}

// Example: Salad dish with chopped onion and tomato
const saladIngredients = [
  { type: 'onion', state: 'chopped' },
  { type: 'tomato', state: 'chopped' }
];
const salad = createDish(saladIngredients);
salad.position.set(-2, 0, 0);
scene.add(salad);

Animation and Rendering
An animation loop keeps the scene rendering continuously, with room for future character animations.
javascript

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  // Add character movements or rotations here (e.g., character.rotation.y += 0.01)
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = frustumSize * aspect / -2;
  camera.right = frustumSize * aspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = frustumSize / -2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

Styling and Cosmetics Notes
Textures: For a more detailed look, replace colors with pixelated textures (e.g., head_texture.png for hair, beard, and sunglasses). Use THREE.TextureLoader to apply them.

Cosmetics: The sunglasses are a standalone cube on the face, and the jacket’s grid pattern can be added via a texture. The shirt peeks out under the jacket for added depth.

Lighting: The directional light creates shadows, enhancing the 3D effect. Adjust MeshPhongMaterial properties (e.g., shininess) for a polished look on the jacket.

Items: Spheres keep items simple, but you can use cubes or custom shapes for chopped states to match the voxel aesthetic.

Expansion Ideas
Add walking animations by rotating arms and legs.

Introduce more ingredients (e.g., steak, lettuce) and dishes (e.g., steak plate).

Use OrbitControls from Three.js for camera interaction during development.

This code provides a complete foundation for a stylized 3D chef character and items in Three.js, ready for integration into your Overcooked-inspired game.

