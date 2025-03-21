import * as THREE from 'three';
import { STATION_SIZE, COUNTER_SIZE, COLORS } from '../constants.js';

// Kitchen layout object
export const kitchen = {
    stations: {},
    counters: [],
    decorations: []
};

// Function to create a station or counter
export function createKitchenElement(scene, type, position, size, color) {
    // Create a group to hold the station/counter and its label
    const elementGroup = new THREE.Group();
    elementGroup.position.set(position.x, position.y, 0);
    
    // Create a 3D box for the kitchen element with increased height for better 3D perception
    const geometry = new THREE.BoxGeometry(size, size * 0.5, size);  // Increased height
    
    // Use MeshPhongMaterial for better lighting
    const material = new THREE.MeshPhongMaterial({ 
        color,
        shininess: 30
    });
    
    const element = new THREE.Mesh(geometry, material);
    
    // Position the box so its bottom is at y=0 (origin of the group)
    // This makes it easier to place the group on the ground
    element.position.y = size * 0.25;  // Half the height of the box
    element.castShadow = true;
    element.receiveShadow = true;
    elementGroup.add(element);
    
    // Add a bevel effect for the top edges to make it look more 3D
    const topGeometry = new THREE.BoxGeometry(size * 0.95, size * 0.05, size * 0.95);
    const topMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(color).multiplyScalar(1.2), // Slightly brighter top
        shininess: 50
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = size * 0.5 + size * 0.025; // Position on top of the base element
    top.castShadow = true;
    top.receiveShadow = true;
    elementGroup.add(top);
    
    // Add station-specific details
    if (type === 'Pantry') {
        // Add shelves to pantry
        for (let i = 0; i < 3; i++) {
            const shelf = new THREE.Mesh(
                new THREE.BoxGeometry(size * 0.8, size * 0.05, size * 0.8),
                new THREE.MeshPhongMaterial({ color: 0x8B4513 })
            );
            shelf.position.y = size * 0.25 + size * 0.1 + i * size * 0.15; // Starting from top of base
            shelf.castShadow = true;
            shelf.receiveShadow = true;
            elementGroup.add(shelf);
        }
    } else if (type === 'Chopping') {
        // Add cutting board
        const board = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.7, size * 0.05, size * 0.5),
            new THREE.MeshPhongMaterial({ color: 0xDEB887 })
        );
        board.position.y = size * 0.5 + size * 0.025; // Position on top of the station
        board.position.z = size * 0.1;
        board.castShadow = true;
        board.receiveShadow = true;
        elementGroup.add(board);
        
        // Add knife
        const knife = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.25, size * 0.05, size * 0.05),
            new THREE.MeshPhongMaterial({ color: 0xC0C0C0 })
        );
        knife.position.y = size * 0.5 + size * 0.05; // Position on top of the cutting board
        knife.position.x = size * 0.25;
        knife.position.z = size * 0.1;
        knife.rotation.y = Math.PI / 4;
        knife.castShadow = true;
        elementGroup.add(knife);
    } else if (type === 'Cooking') {
        // Add cooking pot
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.3, size * 0.3, size * 0.15, 16),
            new THREE.MeshPhongMaterial({ color: 0x404040, shininess: 60 })
        );
        pot.position.y = size * 0.5 + size * 0.075; // Position on top of the station
        pot.castShadow = true;
        pot.receiveShadow = true;
        elementGroup.add(pot);
        
        // Add burner
        const burner = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.2, size * 0.2, size * 0.02, 16),
            new THREE.MeshPhongMaterial({ 
                color: 0xFF5722, 
                emissive: 0xFF5722, 
                emissiveIntensity: 0.5 
            })
        );
        burner.position.y = size * 0.5 + size * 0.01; // Position on top of the station
        elementGroup.add(burner);
    } else if (type === 'Plates') {
        // Add stack of plates
        for (let i = 0; i < 3; i++) {
            const plate = new THREE.Mesh(
                new THREE.CylinderGeometry(size * 0.25, size * 0.25, size * 0.02, 16),
                new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 100 })
            );
            plate.position.y = size * 0.5 + (i * size * 0.03); // Stack plates on top of station
            plate.castShadow = true;
            plate.receiveShadow = true;
            elementGroup.add(plate);
        }
    } else if (type === 'Serving') {
        // Add serving window
        const window = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.9, size * 0.2, size * 0.1),
            new THREE.MeshPhongMaterial({ color: 0x5D4037 })
        );
        window.position.y = size * 0.5 + size * 0.1; // Position on top of the station
        window.position.z = size * 0.4;
        window.castShadow = true;
        window.receiveShadow = true;
        elementGroup.add(window);
        
        // Add bell
        const bell = new THREE.Mesh(
            new THREE.SphereGeometry(size * 0.08, 16, 16),
            new THREE.MeshPhongMaterial({ color: 0xFFD700 })
        );
        bell.position.y = size * 0.5 + size * 0.08; // Position on top of the station
        bell.position.x = size * 0.3;
        bell.castShadow = true;
        elementGroup.add(bell);
    } else if (type === 'Counter') {
        // Add counter rim
        const rim = new THREE.Mesh(
            new THREE.BoxGeometry(size * 1.05, size * 0.05, size * 1.05),
            new THREE.MeshPhongMaterial({ color: 0x808080 })
        );
        rim.position.y = size * 0.5 + size * 0.025; // Position on top of the counter
        rim.castShadow = true;
        rim.receiveShadow = true;
        elementGroup.add(rim);
    }
    
    // Create larger and more visible label using sprite (billboard)
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;
    
    // Create a semi-transparent background for better readability
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text with larger font
    context.fillStyle = 'white';
    context.font = 'bold 36px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(type, canvas.width/2, canvas.height/2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
    });
    
    // Create a sprite that always faces the camera
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(size * 1.2, size * 0.6, 1); // Make label larger
    sprite.position.set(0, 0.5, 0); // Position label higher above element
    elementGroup.add(sprite);
    
    scene.add(elementGroup);
    return elementGroup;
}

// Create a warmer, less distracting wooden floor
function createKitchenFloor(scene) {
    const floorSize = 20;
    const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
    
    // Create a wooden floor texture
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    
    // Set base color - warm light wooden tone
    context.fillStyle = '#D2B48C'; // Tan
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add wood grain patterns
    for (let i = 0; i < 40; i++) {
        const y = i * (canvas.height / 40);
        
        // Varying wood grain colors
        context.fillStyle = i % 2 === 0 ? '#C19A6B' : '#D2B48C'; // Alternating wood tones
        context.fillRect(0, y, canvas.width, canvas.height / 40);
        
        // Add subtle grain lines
        context.strokeStyle = 'rgba(101, 67, 33, 0.2)'; // Semi-transparent dark brown
        context.lineWidth = 1;
        context.beginPath();
        
        for (let j = 0; j < 5; j++) {
            // Random wavy lines for wood grain effect
            let x = 0;
            context.moveTo(x, y + Math.random() * (canvas.height / 40));
            
            while (x < canvas.width) {
                x += 20;
                context.lineTo(x, y + Math.random() * (canvas.height / 40));
            }
        }
        
        context.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    
    const floorMaterial = new THREE.MeshPhongMaterial({ 
        map: texture,
        shininess: 10
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    floor.position.y = -0.5; // Fixed position for floor
    floor.receiveShadow = true; // Make floor receive shadows
    scene.add(floor);
    
    return floor;
}

// Create kitchen walls with brick texture
function createKitchenWalls(scene) {
    const walls = [];
    
    // Create a brick texture
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    
    // Base brick color
    context.fillStyle = '#AA4A44'; // Brick red
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Brick pattern
    const brickHeight = 30;
    const brickWidth = 60;
    const mortarSize = 3;
    
    context.fillStyle = '#D9D9D9'; // Mortar color (light gray)
    
    // Draw horizontal mortar lines
    for (let y = 0; y <= canvas.height; y += brickHeight + mortarSize) {
        context.fillRect(0, y, canvas.width, mortarSize);
    }
    
    // Draw vertical mortar lines (with offset for alternating rows)
    for (let y = 0; y <= canvas.height; y += (brickHeight + mortarSize) * 2) {
        // First row of bricks
        for (let x = 0; x <= canvas.width; x += brickWidth + mortarSize) {
            context.fillRect(x, y, mortarSize, brickHeight);
        }
        
        // Second row of bricks (offset)
        for (let x = brickWidth / 2; x <= canvas.width; x += brickWidth + mortarSize) {
            context.fillRect(x, y + brickHeight + mortarSize, mortarSize, brickHeight);
        }
    }
    
    // Add some variation to bricks
    context.globalCompositeOperation = 'multiply';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 5 + Math.random() * 15;
        
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
    }
    
    context.globalCompositeOperation = 'source-over';
    
    const brickTexture = new THREE.CanvasTexture(canvas);
    brickTexture.wrapS = THREE.RepeatWrapping;
    brickTexture.wrapT = THREE.RepeatWrapping;
    brickTexture.repeat.set(4, 2);
    
    const wallMaterial = new THREE.MeshPhongMaterial({ 
        map: brickTexture,
        shininess: 5
    });
    
    // Properly aligned wall dimensions
    const wallHeight = 3;
    
    // Back wall - properly aligned
    const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(20, wallHeight, 0.2),
        wallMaterial
    );
    backWall.position.set(0, wallHeight/2 - 0.5, -10); // Grounded and properly placed
    backWall.receiveShadow = true;
    scene.add(backWall);
    walls.push(backWall);
    
    // Left wall - properly aligned
    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, wallHeight, 20),
        wallMaterial
    );
    leftWall.position.set(-10, wallHeight/2 - 0.5, 0); // Grounded and properly placed
    leftWall.receiveShadow = true;
    scene.add(leftWall);
    walls.push(leftWall);
    
    // Right wall - properly aligned
    const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, wallHeight, 20),
        wallMaterial
    );
    rightWall.position.set(10, wallHeight/2 - 0.5, 0); // Grounded and properly placed
    rightWall.receiveShadow = true;
    scene.add(rightWall);
    walls.push(rightWall);
    
    // Front wall with door opening - properly aligned
    const frontWallLeft = new THREE.Mesh(
        new THREE.BoxGeometry(8, wallHeight, 0.2),
        wallMaterial
    );
    frontWallLeft.position.set(-6, wallHeight/2 - 0.5, 10); // Grounded and properly placed
    frontWallLeft.receiveShadow = true;
    scene.add(frontWallLeft);
    walls.push(frontWallLeft);
    
    const frontWallRight = new THREE.Mesh(
        new THREE.BoxGeometry(8, wallHeight, 0.2),
        wallMaterial
    );
    frontWallRight.position.set(6, wallHeight/2 - 0.5, 10); // Grounded and properly placed
    frontWallRight.receiveShadow = true;
    scene.add(frontWallRight);
    walls.push(frontWallRight);
    
    return walls;
}

// Create kitchen layout with all stations and counters
export function createKitchenLayout(scene) {
    console.log("Creating enhanced 3D kitchen layout...");
    
    // Create floor and walls
    kitchen.floor = createKitchenFloor(scene);
    kitchen.walls = createKitchenWalls(scene);
    
    // Y position for all stations and counters to ensure they're on the ground
    // The floor is at y=-0.5, and we want the bottom of elements to be exactly at that level
    const yPosition = -0.5; // This will place the bottom of all elements at floor level
    
    // Create stations with a U-shaped layout
    // Rearranged as per request: pantry and cooking on one side, chopping on another
    kitchen.stations.pantry = createKitchenElement(scene, 'Pantry', { x: 6, y: 4 }, STATION_SIZE, COLORS.pantry);
    kitchen.stations.cooking = createKitchenElement(scene, 'Cooking', { x: 6, y: -4 }, STATION_SIZE, COLORS.cooking);
    kitchen.stations.chopping = createKitchenElement(scene, 'Chopping', { x: -6, y: 0 }, STATION_SIZE, COLORS.chopping);
    kitchen.stations.plateDispenser = createKitchenElement(scene, 'Plates', { x: -6, y: 4 }, STATION_SIZE, COLORS.plateDispenser);
    kitchen.stations.serving = createKitchenElement(scene, 'Serving', { x: -6, y: -4 }, STATION_SIZE, COLORS.serving);
    
    // Properly ground all stations
    Object.values(kitchen.stations).forEach(station => {
        station.position.y = yPosition;
    });
    
    // Create counters in a U-shape around the kitchen
    // Left side
    kitchen.counters.push(
        createKitchenElement(scene, 'Counter', { x: -4, y: 4 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: -4, y: 2 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: -4, y: 0 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: -4, y: -2 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: -4, y: -4 }, COUNTER_SIZE, COLORS.counter)
    );
    
    // Bottom (connecting) counters
    kitchen.counters.push(
        createKitchenElement(scene, 'Counter', { x: -2, y: -4 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: 0, y: -4 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: 2, y: -4 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: 4, y: -4 }, COUNTER_SIZE, COLORS.counter)
    );
    
    // Right side
    kitchen.counters.push(
        createKitchenElement(scene, 'Counter', { x: 4, y: -2 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: 4, y: 0 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: 4, y: 2 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: 4, y: 4 }, COUNTER_SIZE, COLORS.counter)
    );
    
    // Central island - allows player to walk around
    kitchen.counters.push(
        createKitchenElement(scene, 'Counter', { x: -1, y: 0 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: 1, y: 0 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: -1, y: 2 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: 1, y: 2 }, COUNTER_SIZE, COLORS.counter)
    );
    
    // Properly ground all counters
    kitchen.counters.forEach(counter => {
        counter.position.y = yPosition;
    });
    
    // Store positions and states for game logic
    kitchen.counters.forEach(counter => {
        counter.userData = {
            isOccupied: false,
            position: { x: counter.position.x, y: counter.position.y },
            item: null
        };
    });
    
    // Store station positions for game logic
    Object.entries(kitchen.stations).forEach(([key, station]) => {
        station.userData = {
            type: key,
            position: { x: station.position.x, y: station.position.y }
        };
    });
} 