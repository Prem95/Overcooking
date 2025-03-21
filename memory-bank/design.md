# Kitchen Scene with Blocky Character Design in Three.js

This document provides a technical guide for creating a 3D kitchen scene in Three.js, inspired by a cartoonish, top-down cooking game design and a blocky, pixelated character style. The scene features a U-shaped counter with clearly defined stations, a blocky chef character, and background elements like a dining area and street view. The design emphasizes a vibrant, playful aesthetic with enhanced 3D modeling, improved colors, and readable station labels.

## 1. Scene Setup

### Camera and Perspective
- **Camera Type**: Use an OrthographicCamera for an isometric, top-down view with a slight tilt to emphasize 3D depth
- **Position**: (5, 10, 5) looking at (0, 0, 0) to center the kitchen and show depth
- **Frustum Size**: Set to 12 to focus on the kitchen while allowing some background visibility

### Lighting
- **Ambient Light**: Add a soft AmbientLight with a warm tone (0xfff5e1, intensity 0.5) for a cozy atmosphere
- **Directional Light**: Use a DirectionalLight (0xffffff, intensity 1.0) positioned at (5, 10, 5) to cast soft shadows and enhance depth
- **Shadows**: Enable shadows for the directional light with shadowMapSize set to 2048 for crisp, soft shadows

### Background
Set the scene background to a soft gradient using a CanvasTexture:
- **Top**: Light blue (0x87CEEB)
- **Bottom**: Light gray (0xD3D3D3)

## 2. Kitchen Layout

### U-Shaped Counter
- **Geometry**: Create three rectangular prisms using BoxGeometry for the counter sections
- **Dimensions**: Each section is 4x1x1 units (width, height, depth) to give a more substantial 3D appearance
- **Bevel**: Use ExtrudeGeometry with a slight bevel (depth 0.1) on the top edges for a rounded, 3D look

#### Material
Use MeshToonMaterial for a cartoonish look:
- **Surface**: Bright yellow (0xFFD700) to match the vibrant reference style
- **Edges**: Dark brown (0x5C4033) for contrast

#### Positioning (tightened for a cozier feel)
- **Left Section**: (-2, 0, 0), rotated 90 degrees on the Y-axis
- **Middle Section**: (0, 0, -1.5)
- **Right Section**: (2, 0, 0), rotated 90 degrees on the Y-axis

### Floor
- **Geometry**: Use a PlaneGeometry (15x15) for the floor
- **Texture**: Apply a checkered texture with white (0xFFFFFF) and black (0x000000) tiles
  - Use TextureLoader with a repeating 8x8 grid pattern for a classic kitchen look

### Walls
- **Geometry**: Create thin BoxGeometry walls
  - Back Wall: (0, 0, -2.5), size 8x2x0.2
  - Side Wall: (3, 0, 0), size 0.2x2x5
- **Material**: Use MeshToonMaterial with a tiled texture
  - Color: White (0xFFFFFF) with a subtle blue (0xADD8E6) tile pattern
  - Texture: Use TextureLoader with a 4x4 repeating tile pattern

## 3. Kitchen Elements and Stations

### Station Labels
- **Method**: Use 2D sprites (billboards) for station labels to ensure readability
  - Create a Sprite with a CanvasTexture for each label
- **Font**: Use a bold, sans-serif font (e.g., Arial, 40px)
- **Text Color**: Black (0x000000) on a semi-transparent white background (0xFFFFFF, alpha 0.8)

#### Labels and Positions
- "Pantry": (2, 1.5, 1)
- "Cooking Station": (2, 1.5, -1)
- "Chopping Station": (-2, 1.5, 1)
- "Serving Station": (0, 1.5, -1.5)

### Pantry
- **Geometry**: BoxGeometry(1, 1.5, 1) to give it a tall, 3D cabinet look
- **Material**: Green (0x228B22) with a wood texture (TextureLoader with a wood grain pattern)
- **Position**: On the right counter at (2, 0, 1)

### Cooking Station
- **Geometry**: BoxGeometry(1, 1, 1) for the base and CylinderGeometry for the pot (radius 0.3, height 0.3)
- **Material**: Black (0x000000) for the stove, red (0xFF0000) for the pot
- **Details**: Add small CylinderGeometry knobs (radius 0.05, height 0.1) in silver (0xC0C0C0) on the front
- **Position**: On the right counter at (2, 0, -1)

### Chopping Station
- **Geometry**: BoxGeometry(1, 0.2, 1) for a cutting board on the counter
- **Material**: Light brown (0xDEB887) with a wood texture
- **Details**: Add a small BoxGeometry knife (size 0.3x0.05x0.05) in silver (0xC0C0C0) on the board
- **Position**: On the left counter at (-2, 0.5, 1)

### Serving Station
- **Geometry**: BoxGeometry(1, 0.5, 1) for a small serving hatch
- **Material**: White (0xFFFFFF) with a glass-like transparency (alpha 0.7)
- **Position**: On the middle counter at (0, 0, -1.5)

### Sink
- **Geometry**: BoxGeometry(1, 0.2, 1) for the basin and CylinderGeometry for the faucet (radius 0.05, height 0.5)
- **Material**: Gray (0x808080) for the basin, silver (0xC0C0C0) for the faucet
- **Position**: On the right counter at (1, 0.5, 0)

### Preparation Items
- **Pancakes**: Stacked CylinderGeometry (radius 0.3, height 0.1, 3 stacks) with golden brown (0xDAA520)
- **Bowl of Batter**: SphereGeometry (radius 0.4) with beige (0xF5DEB3)
- **Plates**: CylinderGeometry (radius 0.5, height 0.05) with white (0xFFFFFF)

#### Positioning
- Pancakes: (-2, 0.5, 0) (near chopping station)
- Bowl: (0, 0.5, -1) (middle counter)
- Plate: (0, 0.5, -0.5) (middle counter)

## 4. Blocky Chef Character

### Geometry and Structure
- **Head**: BoxGeometry(0.8, 0.8, 0.8) at (0, 1.8, -1)
- **Body**: BoxGeometry(0.8, 1.2, 0.4) at (0, 1.0, -1)
- **Arms**: Two BoxGeometry(0.4, 1.2, 0.4)
  - Left Arm: (-0.6, 1.0, -1)
  - Right Arm: (0.6, 1.0, -1)
- **Legs**: Two BoxGeometry(0.4, 1.2, 0.4)
  - Left Leg: (-0.2, 0.4, -1)
  - Right Leg: (0.2, 0.4, -1)

### Materials and Colors
- **Material**: Use MeshToonMaterial for a cartoonish, flat look

#### Head
- **Hair**: Black (0x000000) on top and sides, styled slicked-back with a custom texture map
- **Face**: Light peach (0xFFDAB9), with:
  - Sunglasses: Black (0x000000) rectangles with blue (0x0000FF) center pixels
  - Beard: Brown (0x8B4513) on the lower half
  - Mouth: Black (0x000000) rectangle

#### Body
- **Jacket**: Black (0x000000) with a grid-like texture on the front
- **Shirt**: White (0xFFFFFF) visible underneath
- **Arms**: Upper part black (0x000000), lower part peach (0xFFDAB9)
- **Legs**: Dark blue jeans (0x00008B)
- **Shoes**: Brown (0x8B4513) at the bottom of legs

### Texture Mapping
Create a pixelated texture map (e.g., 64x64 pixels) similar to a Minecraft skin, mapping each face of the geometry to specific regions for hair, sunglasses, beard, jacket, etc.

### Positioning
Place the chef behind the middle counter at (0, 0, -1), facing the preparation items.

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
- **Soft Shadows**: Enable soft shadows for the directional light with shadowBias set to -0.0005 to avoid artifacts
- **Shadow Style**: Subtle, circular shadows beneath objects and the character

## 7. Styling and Aesthetics
- **Toon Shading**: Use MeshToonMaterial for all objects and the character to achieve a cartoonish, non-realistic look
- **Blocky Aesthetic**: Maintain sharp edges for the character, but use beveled edges for kitchen elements to enhance 3D depth
- **Color Palette**: Bright and playful tones (yellow counters, white/black tiles, red/green stations) with warm accents (brown, beige) for items
- **Low-Poly Design**: Keep polygon counts low for a retro, playful feel, but add small details (knobs, knife) for visual interest

## 8. Implementation Notes
- **Three.js Setup**: Initialize a Scene, OrthographicCamera, and WebGLRenderer. Add all objects and lights to the scene
- **Animation Loop**: Use requestAnimationFrame to render the scene continuously
- **Texture Loading**: Use TextureLoader for the floor, walls, and character texture maps
- **Camera Adjustment**: Ensure the camera angle highlights the 3D nature of the counters and stations

## Reflection on Changes
- **Text Visibility**: Using sprites with a larger font and semi-transparent background ensures readability without cluttering the 3D scene. I considered 3D text (TextGeometry), but it's harder to scale and can look pixelated at small sizes.
- **3D Modeling**: Increasing the counter height and adding beveled edges makes the kitchen feel more substantial. Small details like knobs and a knife on the chopping station add depth without overcomplicating the low-poly aesthetic.
- **Color and Design**: The bright yellow counters and white/black tiles align with the reference image's vibrant style. The tiled wall texture adds visual interest, and the tightened layout creates a more cohesive kitchen space.
- **Station Positioning**: Grouping the pantry and cooking station on the right side streamlines the workflow (grab ingredients, cook them), while placing the chopping station on the left separates preparation tasks logically.

This updated design.md addresses the visual and structural issues, creating a more engaging, 3D, and vibrant kitchen scene while maintaining the playful, cartoonish aesthetic. You can use this file in Cursor to guide the implementation.
