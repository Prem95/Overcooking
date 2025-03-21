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
    
    // Position the box so its top is at y=0
    element.position.y = -size * 0.25;  // Adjusted for increased height
    elementGroup.add(element);
    
    // Add a bevel effect for the top edges to make it look more 3D
    const topGeometry = new THREE.BoxGeometry(size * 0.95, size * 0.05, size * 0.95);
    const topMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(color).multiplyScalar(1.2), // Slightly brighter top
        shininess: 50
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = -size * 0.25 + size * 0.25 + size * 0.025;
    elementGroup.add(top);
    
    // Add station-specific details
    if (type === 'Pantry') {
        // Add shelves to pantry
        for (let i = 0; i < 3; i++) {
            const shelf = new THREE.Mesh(
                new THREE.BoxGeometry(size * 0.8, size * 0.05, size * 0.8),
                new THREE.MeshPhongMaterial({ color: 0x8B4513 })
            );
            shelf.position.y = -size * 0.25 + size * 0.15 * i;
            elementGroup.add(shelf);
        }
    } else if (type === 'Chopping') {
        // Add cutting board
        const board = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.7, size * 0.05, size * 0.5),
            new THREE.MeshPhongMaterial({ color: 0xDEB887 })
        );
        board.position.y = -size * 0.25 + size * 0.05;
        board.position.z = size * 0.1;
        elementGroup.add(board);
        
        // Add knife
        const knife = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.25, size * 0.05, size * 0.05),
            new THREE.MeshPhongMaterial({ color: 0xC0C0C0 })
        );
        knife.position.y = -size * 0.25 + size * 0.08;
        knife.position.x = size * 0.25;
        knife.position.z = size * 0.1;
        knife.rotation.y = Math.PI / 4;
        elementGroup.add(knife);
    } else if (type === 'Cooking') {
        // Add cooking pot
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.3, size * 0.3, size * 0.15, 16),
            new THREE.MeshPhongMaterial({ color: 0x404040, shininess: 60 })
        );
        pot.position.y = -size * 0.25 + size * 0.1;
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
        burner.position.y = -size * 0.25 + size * 0.01;
        elementGroup.add(burner);
    } else if (type === 'Plates') {
        // Add stack of plates
        for (let i = 0; i < 3; i++) {
            const plate = new THREE.Mesh(
                new THREE.CylinderGeometry(size * 0.25, size * 0.25, size * 0.02, 16),
                new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 100 })
            );
            plate.position.y = -size * 0.25 + size * 0.02 + i * size * 0.03;
            elementGroup.add(plate);
        }
    } else if (type === 'Serving') {
        // Add serving window
        const window = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.9, size * 0.2, size * 0.1),
            new THREE.MeshPhongMaterial({ color: 0x5D4037 })
        );
        window.position.y = -size * 0.25 + size * 0.3;
        window.position.z = size * 0.4;
        elementGroup.add(window);
        
        // Add bell
        const bell = new THREE.Mesh(
            new THREE.SphereGeometry(size * 0.08, 16, 16),
            new THREE.MeshPhongMaterial({ color: 0xFFD700 })
        );
        bell.position.y = -size * 0.25 + size * 0.15;
        bell.position.x = size * 0.3;
        elementGroup.add(bell);
    } else if (type === 'Counter') {
        // Add counter rim
        const rim = new THREE.Mesh(
            new THREE.BoxGeometry(size * 1.05, size * 0.05, size * 1.05),
            new THREE.MeshPhongMaterial({ color: 0x808080 })
        );
        rim.position.y = -size * 0.25 + size * 0.25;
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

// Create a checkered floor
function createKitchenFloor(scene) {
    const floorSize = 20;
    const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
    
    // Create a checkered pattern
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;
    
    const tileSize = 32;
    for (let x = 0; x < canvas.width; x += tileSize) {
        for (let y = 0; y < canvas.height; y += tileSize) {
            const isEven = (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0;
            context.fillStyle = isEven ? '#FFFFFF' : '#000000';
            context.fillRect(x, y, tileSize, tileSize);
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    
    const floorMaterial = new THREE.MeshPhongMaterial({ 
        map: texture,
        shininess: 10
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    floor.position.y = -0.5; // Fixed position for floor
    scene.add(floor);
    
    return floor;
}

// Create kitchen walls
function createKitchenWalls(scene) {
    const walls = [];
    
    // Back wall
    const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(20, 3, 0.2),
        new THREE.MeshPhongMaterial({ color: 0xE0E0E0 })
    );
    backWall.position.set(0, 1, -7);
    scene.add(backWall);
    walls.push(backWall);
    
    // Left wall
    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3, 14),
        new THREE.MeshPhongMaterial({ color: 0xE0E0E0 })
    );
    leftWall.position.set(-10, 1, 0);
    scene.add(leftWall);
    walls.push(leftWall);
    
    // Right wall
    const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3, 14),
        new THREE.MeshPhongMaterial({ color: 0xE0E0E0 })
    );
    rightWall.position.set(10, 1, 0);
    scene.add(rightWall);
    walls.push(rightWall);
    
    return walls;
}

// Create kitchen layout with all stations and counters
export function createKitchenLayout(scene) {
    console.log("Creating enhanced 3D kitchen layout...");
    
    // Create floor and walls
    kitchen.floor = createKitchenFloor(scene);
    kitchen.walls = createKitchenWalls(scene);
    
    // Create stations with a U-shaped layout
    // Rearranged as per request: pantry and cooking on one side, chopping on another
    kitchen.stations.pantry = createKitchenElement(scene, 'Pantry', { x: 6, y: 4 }, STATION_SIZE, COLORS.pantry);
    kitchen.stations.cooking = createKitchenElement(scene, 'Cooking', { x: 6, y: -4 }, STATION_SIZE, COLORS.cooking);
    kitchen.stations.chopping = createKitchenElement(scene, 'Chopping', { x: -6, y: 0 }, STATION_SIZE, COLORS.chopping);
    kitchen.stations.plateDispenser = createKitchenElement(scene, 'Plates', { x: -6, y: 4 }, STATION_SIZE, COLORS.plateDispenser);
    kitchen.stations.serving = createKitchenElement(scene, 'Serving', { x: -6, y: -4 }, STATION_SIZE, COLORS.serving);
    
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