# Kitchen Scene with Blocky Character Design in Three.js

This document provides a technical guide for creating a 3D kitchen scene in Three.js, inspired by a cartoonish, top-down cooking game design and a blocky, pixelated character style. The scene features a U-shaped counter, a blocky chef character, and background elements like a dining area and street view. The design emphasizes a warm, inviting vibe with soft lighting and a vibrant, retro color palette.

## 1. Scene Setup

### Camera and Perspective
- **Camera Type**: Use an OrthographicCamera for an isometric, top-down view to maintain a 2D-like simplicity with a slight 3D tilt
- **Position**: (0, 10, 5) looking at (0, 0, 0) to center the kitchen and provide a slight angle
- **Frustum Size**: Set to 15 to capture the entire kitchen layout

### Lighting
- **Ambient Light**: Add a soft AmbientLight with a warm tone (0xfff5e1, intensity 0.6) for a cozy atmosphere
- **Directional Light**: Use a DirectionalLight (0xffffff, intensity 0.8) positioned at (5, 10, 5) to cast subtle shadows and enhance depth
- **Shadows**: Enable shadows for the directional light with shadowMapSize set to 1024 for soft, diffused shadows

### Background
- Set the scene background to a light blue (0x87CEEB) to mimic a sky or simple backdrop

## 2. Kitchen Layout

### U-Shaped Counter
- **Geometry**: Create three rectangular prisms using BoxGeometry for the counter sections
- **Dimensions**: Each section is 4x0.5x1 units (width, height, depth)
- **Material**: Use MeshPhongMaterial with:
  - Surface: Beige (0xD2B48C)
  - Edges: Brown (0x8B4513)
- **Positioning**:
  - Left Section: (-2, 0, 0), rotated 90 degrees on the Y-axis
  - Middle Section: (0, 0, -2)
  - Right Section: (2, 0, 0), rotated 90 degrees on the Y-axis

### Floor
- **Geometry**: Use a PlaneGeometry (20x20) for the floor
- **Texture**: Apply a checkered texture with light gray (0xD3D3D3) and white (0xFFFFFF) tiles
  - Use TextureLoader with a repeating 10x10 grid pattern

### Walls
- **Geometry**: Create thin BoxGeometry walls
  - Back Wall: (0, 0, -3), size 10x2x0.2
  - Side Wall: (3, 0, 0), size 0.2x2x6
- **Material**: Use MeshPhongMaterial with a brown color (0xA0522D) for a wooden or brick look

## 3. Kitchen Elements

### Sink
- **Geometry**: BoxGeometry for the basin (1x0.2x1) and CylinderGeometry for the faucet (radius 0.05, height 0.5)
- **Material**: Gray (0x808080) for the basin, silver (0xC0C0C0) for the faucet
- **Position**: On the right counter at (2, 0.5, 0)

### Stove
- **Geometry**: BoxGeometry for the base (1x0.5x1) and CylinderGeometry for the pot (radius 0.3, height 0.3)
- **Material**: Black (0x000000) for the stove, red (0xFF0000) for the pot
- **Position**: Next to the sink at (1, 0.5, 0)

### Preparation Items
- **Pancakes**: Stacked CylinderGeometry (radius 0.3, height 0.1, 3 stacks) with yellow (0xFFD700)
- **Bowl of Batter**: SphereGeometry (radius 0.4) with beige (0xF5DEB3)
- **Plates**: CylinderGeometry (radius 0.5, height 0.05) with white (0xFFFFFF)
- **Positioning**: Scatter on the counter:
  - Pancakes: (-2, 0.5, 0) and (0, 0.5, -2)
  - Bowl: (-1, 0.5, 0)
  - Plate: (0, 0.5, -1)

## 4. Blocky Chef Character

### Geometry and Structure
- **Head**: BoxGeometry(0.8, 0.8, 0.8) at (0, 1.8, -2)
- **Body**: BoxGeometry(0.8, 1.2, 0.4) at (0, 1.0, -2)
- **Arms**: Two BoxGeometry(0.4, 1.2, 0.4):
  - Left Arm: (-0.6, 1.0, -2)
  - Right Arm: (0.6, 1.0, -2)
- **Legs**: Two BoxGeometry(0.4, 1.2, 0.4):
  - Left Leg: (-0.2, 0.4, -2)
  - Right Leg: (0.2, 0.4, -2)

### Materials and Colors
- **Material**: Use MeshToonMaterial for a cartoonish, flat look
- **Head**:
  - Hair: Black (0x000000) on top and sides, styled slicked-back with a custom texture map
  - Face: Light peach (0xFFDAB9), with:
    - Sunglasses: Black (0x000000) rectangles with blue (0x0000FF) center pixels
    - Beard: Brown (0x8B4513) on the lower half
    - Mouth: Black (0x000000) rectangle
- **Body**: 
  - Jacket: Black (0x000000) with a grid-like texture on the front
  - Shirt: White (0xFFFFFF) visible underneath
  - Arms: Upper part black (0x000000), lower part peach (0xFFDAB9)
  - Legs: Dark blue jeans (0x00008B)
  - Shoes: Brown (0x8B4513) at the bottom of legs

### Texture Mapping
Create a pixelated texture map (e.g., 64x64 pixels) similar to a Minecraft skin, mapping each face of the geometry to specific regions for hair, sunglasses, beard, jacket, etc.

### Positioning
Place the chef behind the middle counter at (0, 0, -2), facing the preparation items.

## 5. Background Elements

### Dining Area
- **Table**: BoxGeometry(1.5, 0.1, 1.5) with brown (0x8B4513) at (2, 0, 2)
- **Chairs**: Two BoxGeometry(0.5, 0.5, 0.5) with brown (0x8B4513) at (2.5, 0, 2) and (1.5, 0, 2)

### Plants
- **Geometry**: CylinderGeometry (radius 0.2, height 0.3) for pots and SphereGeometry (radius 0.3) for leaves
- **Material**: Brown (0x8B4513) for pots, green (0x008000) for leaves
- **Positioning**: (1, 0, 1) near the table, (-3, 0, -1) near the counter

### Street View
- **Sidewalk**: PlaneGeometry(5, 5) with gray (0x808080) at (4, 0, 0)
- **Streetlamp**: CylinderGeometry (radius 0.1, height 2) with yellow (0xFFFF00) at the top, at (5, 0, 1)

## 6. Lighting and Shadows
- **Soft Shadows**: Enable soft shadows for the directional light with shadowBias set to -0.001 to avoid artifacts
- **Shadow Style**: Subtle, circular shadows beneath objects and the character

## 7. Styling and Aesthetics
- **Toon Shading**: Use MeshToonMaterial for all objects and the character to achieve a cartoonish, non-realistic look
- **Blocky Aesthetic**: Maintain sharp edges and flat faces for the character, contrasting with slightly rounded kitchen elements
- **Color Palette**: Warm tones (beige, brown, yellow) with vibrant accents (black, blue, red) for the character and items
- **Low-Poly Design**: Keep polygon counts low for a retro, playful feel

## 8. Implementation Notes
- **Three.js Setup**: Initialize a Scene, OrthographicCamera, and WebGLRenderer. Add all objects and lights to the scene
- **Animation Loop**: Use requestAnimationFrame to render the scene continuously
- **Texture Loading**: Use TextureLoader for the floor and character texture maps

This design.md file provides a structured approach to recreating a kitchen scene with a blocky chef character in Three.js. It blends the playful, functional kitchen layout with a pixelated, Minecraft-inspired character, ensuring a cohesive yet stylized 3D environment. You can copy this into a file in your project directory and use it with a tool like Cursor to guide your implementation.
