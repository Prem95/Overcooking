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
    
    // Create a 3D box for the kitchen element
    const geometry = new THREE.BoxGeometry(size, size * 0.3, size);
    const material = new THREE.MeshPhongMaterial({ 
        color,
        shininess: 30
    });
    const element = new THREE.Mesh(geometry, material);
    
    // Position the box so its top is at y=0
    element.position.y = -size * 0.15;
    elementGroup.add(element);
    
    // For stations, add distinctive features based on their type
    if (type === 'Pantry') {
        // Add shelf-like structures for the pantry
        const shelfGeometry = new THREE.BoxGeometry(size * 0.8, size * 0.05, size * 0.8);
        const shelfMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown wood color
        
        for (let i = 0; i < 3; i++) {
            const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
            shelf.position.y = -size * 0.15 + size * 0.1 * i;
            elementGroup.add(shelf);
        }
        
        // Add some items on the shelves
        const itemGeometry = new THREE.BoxGeometry(size * 0.2, size * 0.1, size * 0.2);
        const itemMaterials = [
            new THREE.MeshPhongMaterial({ color: 0xFFEB3B }), // Yellow (onion)
            new THREE.MeshPhongMaterial({ color: 0xFF5252 }), // Red (tomato)
            new THREE.MeshPhongMaterial({ color: 0x795548 })  // Brown (meat)
        ];
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                const item = new THREE.Mesh(itemGeometry, itemMaterials[i]);
                item.position.y = -size * 0.15 + size * 0.1 * i + size * 0.07;
                item.position.x = (j - 0.5) * size * 0.3;
                item.position.z = (Math.random() - 0.5) * size * 0.3;
                elementGroup.add(item);
            }
        }
    } else if (type === 'Chopping') {
        // Add a cutting board and knife for the chopping station
        const boardGeometry = new THREE.BoxGeometry(size * 0.7, size * 0.05, size * 0.5);
        const boardMaterial = new THREE.MeshPhongMaterial({ color: 0xDEB887 }); // Burlywood
        const board = new THREE.Mesh(boardGeometry, boardMaterial);
        board.position.y = -size * 0.15 + size * 0.05;
        board.position.z = size * 0.1;
        elementGroup.add(board);
        
        // Add a knife
        const knifeHandleGeometry = new THREE.BoxGeometry(size * 0.05, size * 0.05, size * 0.2);
        const knifeHandleMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const knifeHandle = new THREE.Mesh(knifeHandleGeometry, knifeHandleMaterial);
        knifeHandle.position.y = -size * 0.15 + size * 0.08;
        knifeHandle.position.x = size * 0.25;
        knifeHandle.position.z = size * 0.1;
        knifeHandle.rotation.y = Math.PI / 4;
        elementGroup.add(knifeHandle);
        
        const knifeBladeGeometry = new THREE.BoxGeometry(size * 0.25, size * 0.01, size * 0.05);
        const knifeBladeMaterial = new THREE.MeshPhongMaterial({ color: 0xC0C0C0, metalness: 0.7 });
        const knifeBlade = new THREE.Mesh(knifeBladeGeometry, knifeBladeMaterial);
        knifeBlade.position.y = -size * 0.15 + size * 0.09;
        knifeBlade.position.x = size * 0.25 - size * 0.15;
        knifeBlade.position.z = size * 0.1;
        knifeBlade.rotation.y = Math.PI / 4;
        elementGroup.add(knifeBlade);
        
        // Add chopping marks on board
        for (let i = 0; i < 5; i++) {
            const markGeometry = new THREE.BoxGeometry(size * 0.02, size * 0.01, size * 0.3);
            const markMaterial = new THREE.MeshBasicMaterial({ color: 0x5D4037 });
            const mark = new THREE.Mesh(markGeometry, markMaterial);
            mark.position.y = -size * 0.15 + size * 0.06;
            mark.position.x = (i - 2) * size * 0.1;
            mark.position.z = size * 0.1;
            elementGroup.add(mark);
        }
    } else if (type === 'Cooking') {
        // Add a cooking pot for the cooking station
        const potBaseGeometry = new THREE.CylinderGeometry(size * 0.3, size * 0.3, size * 0.15, 16);
        const potBaseMaterial = new THREE.MeshPhongMaterial({ color: 0x404040, shininess: 60 });
        const potBase = new THREE.Mesh(potBaseGeometry, potBaseMaterial);
        potBase.position.y = -size * 0.15 + size * 0.1;
        elementGroup.add(potBase);
        
        // Add pot rim
        const potRimGeometry = new THREE.TorusGeometry(size * 0.3, size * 0.03, 8, 24);
        const potRim = new THREE.Mesh(potRimGeometry, potBaseMaterial);
        potRim.rotation.x = Math.PI / 2;
        potRim.position.y = -size * 0.15 + size * 0.18;
        elementGroup.add(potRim);
        
        // Add burner beneath the pot
        const burnerGeometry = new THREE.CylinderGeometry(size * 0.2, size * 0.2, size * 0.02, 16);
        const burnerMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFF5722, 
            emissive: 0xFF5722, 
            emissiveIntensity: 0.5 
        });
        const burner = new THREE.Mesh(burnerGeometry, burnerMaterial);
        burner.position.y = -size * 0.15 + size * 0.01;
        elementGroup.add(burner);
        
        // Add controls on the front
        for (let i = 0; i < 2; i++) {
            const knobGeometry = new THREE.CylinderGeometry(size * 0.05, size * 0.05, size * 0.02, 16);
            const knobMaterial = new THREE.MeshPhongMaterial({ color: 0x212121 });
            const knob = new THREE.Mesh(knobGeometry, knobMaterial);
            knob.position.y = -size * 0.15 + size * 0.05;
            knob.position.x = (i - 0.5) * size * 0.3;
            knob.position.z = size * 0.3;
            knob.rotation.x = Math.PI / 2;
            elementGroup.add(knob);
        }
    } else if (type === 'Plates') {
        // Add stack of plates for the plate dispenser
        for (let i = 0; i < 3; i++) {
            const plateGeometry = new THREE.CylinderGeometry(size * 0.25, size * 0.25, size * 0.02, 16);
            const plateMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 100 });
            const plate = new THREE.Mesh(plateGeometry, plateMaterial);
            plate.position.y = -size * 0.15 + size * 0.02 + i * size * 0.03;
            elementGroup.add(plate);
        }
        
        // Add a dispenser mechanism
        const dispenserGeometry = new THREE.BoxGeometry(size * 0.5, size * 0.2, size * 0.1);
        const dispenserMaterial = new THREE.MeshPhongMaterial({ color: 0x9E9E9E });
        const dispenser = new THREE.Mesh(dispenserGeometry, dispenserMaterial);
        dispenser.position.y = -size * 0.15 + size * 0.2;
        dispenser.position.z = size * 0.3;
        elementGroup.add(dispenser);
        
        // Add a button
        const buttonGeometry = new THREE.CylinderGeometry(size * 0.05, size * 0.05, size * 0.02, 16);
        const buttonMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.position.y = -size * 0.15 + size * 0.2;
        button.position.z = size * 0.35;
        button.rotation.x = Math.PI / 2;
        elementGroup.add(button);
    } else if (type === 'Serving') {
        // Add a serving hatch for the serving station
        const hatchGeometry = new THREE.BoxGeometry(size * 0.8, size * 0.1, size * 0.4);
        const hatchMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
        const hatch = new THREE.Mesh(hatchGeometry, hatchMaterial);
        hatch.position.y = -size * 0.15 + size * 0.05;
        elementGroup.add(hatch);
        
        // Add a bell
        const bellGeometry = new THREE.SphereGeometry(size * 0.08, 16, 16);
        const bellMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700, metalness: 0.8 });
        const bell = new THREE.Mesh(bellGeometry, bellMaterial);
        bell.position.y = -size * 0.15 + size * 0.15;
        bell.position.x = size * 0.3;
        elementGroup.add(bell);
        
        // Add bell base
        const bellBaseGeometry = new THREE.CylinderGeometry(size * 0.03, size * 0.05, size * 0.05, 16);
        const bellBaseMaterial = new THREE.MeshPhongMaterial({ color: 0xA57C52 });
        const bellBase = new THREE.Mesh(bellBaseGeometry, bellBaseMaterial);
        bellBase.position.y = -size * 0.15 + size * 0.1;
        bellBase.position.x = size * 0.3;
        elementGroup.add(bellBase);
        
        // Add a "window" to indicate the serving area
        const windowFrameGeometry = new THREE.BoxGeometry(size * 0.9, size * 0.4, size * 0.05);
        const windowFrameMaterial = new THREE.MeshPhongMaterial({ color: 0x5D4037 });
        const windowFrame = new THREE.Mesh(windowFrameGeometry, windowFrameMaterial);
        windowFrame.position.y = -size * 0.15 + size * 0.3;
        windowFrame.position.z = size * 0.4;
        elementGroup.add(windowFrame);
        
        // Add glass for the window
        const windowGlassGeometry = new THREE.BoxGeometry(size * 0.8, size * 0.3, size * 0.01);
        const windowGlassMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xE3F2FD, 
            transparent: true, 
            opacity: 0.3 
        });
        const windowGlass = new THREE.Mesh(windowGlassGeometry, windowGlassMaterial);
        windowGlass.position.y = -size * 0.15 + size * 0.3;
        windowGlass.position.z = size * 0.42;
        elementGroup.add(windowGlass);
    } else if (type === 'Counter') {
        // Add a raised rim around the counter
        const rimGeometry = new THREE.BoxGeometry(size * 1.05, size * 0.05, size * 1.05);
        const rimMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.position.y = -size * 0.15 + size * 0.15;
        elementGroup.add(rim);
        
        // Add some wood texture to the counter
        const woodDetailGeometry = new THREE.PlaneGeometry(size * 0.9, size * 0.9);
        const woodDetailMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xD2B48C,
            bumpScale: 0.01
        });
        const woodDetail = new THREE.Mesh(woodDetailGeometry, woodDetailMaterial);
        woodDetail.rotation.x = -Math.PI / 2;
        woodDetail.position.y = -size * 0.15 + size * 0.151;
        elementGroup.add(woodDetail);
    }
    
    // Add a text label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;
    context.fillStyle = 'white';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(type, canvas.width/2, canvas.height/2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const labelGeometry = new THREE.PlaneGeometry(size * 0.8, size * 0.3);
    const labelMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true
    });
    
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(0, 0.1, 0); // Position label above element
    label.rotation.x = -Math.PI / 4; // Angle label for better visibility
    elementGroup.add(label);
    
    scene.add(elementGroup);
    return elementGroup;
}

// Create a checkered floor
function createKitchenFloor(scene) {
    const floorSize = 20;
    const geometry = new THREE.PlaneGeometry(floorSize, floorSize);
    
    // Create a checkered pattern
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const tileSize = 64;
    canvas.width = tileSize * 8;
    canvas.height = tileSize * 8;
    
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            context.fillStyle = (x + y) % 2 === 0 ? '#D3D3D3' : '#F5F5F5';
            context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    
    const material = new THREE.MeshPhongMaterial({ 
        map: texture,
        shininess: 10
    });
    
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    floor.position.y = -0.45; // Slightly below stations
    
    scene.add(floor);
    return floor;
}

// Create kitchen walls
function createKitchenWalls(scene) {
    const walls = [];
    
    // Back wall
    const backWallGeometry = new THREE.BoxGeometry(20, 3, 0.2);
    const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xE0E0E0 });
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 1, -7);
    scene.add(backWall);
    walls.push(backWall);
    
    // Left wall
    const leftWallGeometry = new THREE.BoxGeometry(0.2, 3, 14);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-10, 1, 0);
    scene.add(leftWall);
    walls.push(leftWall);
    
    // Right wall
    const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    rightWall.position.set(10, 1, 0);
    scene.add(rightWall);
    walls.push(rightWall);
    
    return walls;
}

// Add decorative elements
function createDecorativeElements(scene) {
    const decorations = [];
    
    // Wall decorations - Simple picture frame
    const frameGeometry = new THREE.BoxGeometry(2, 1.5, 0.1);
    const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x5D4037 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(-5, 1.5, -6.9);
    scene.add(frame);
    decorations.push(frame);
    
    // Canvas inside frame
    const canvasGeometry = new THREE.BoxGeometry(1.8, 1.3, 0.02);
    const canvasMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    const canvas = new THREE.Mesh(canvasGeometry, canvasMaterial);
    canvas.position.set(-5, 1.5, -6.8);
    scene.add(canvas);
    decorations.push(canvas);
    
    // Potted plant
    const potGeometry = new THREE.CylinderGeometry(0.3, 0.2, 0.4, 16);
    const potMaterial = new THREE.MeshPhongMaterial({ color: 0x795548 });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.set(7, 0, -5);
    scene.add(pot);
    decorations.push(pot);
    
    // Plant leaves
    const leavesGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x4CAF50 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(7, 0.7, -5);
    scene.add(leaves);
    decorations.push(leaves);
    
    return decorations;
}

// Create kitchen layout with all stations and counters
export function createKitchenLayout(scene) {
    console.log("Creating enhanced 3D kitchen layout...");
    
    // Create floor and walls
    kitchen.floor = createKitchenFloor(scene);
    kitchen.walls = createKitchenWalls(scene);
    
    // Create stations with a more U-shaped layout
    kitchen.stations.pantry = createKitchenElement(scene, 'Pantry', { x: -6, y: 4 }, STATION_SIZE, COLORS.pantry);
    kitchen.stations.chopping = createKitchenElement(scene, 'Chopping', { x: -6, y: 0 }, STATION_SIZE, COLORS.chopping);
    kitchen.stations.cooking = createKitchenElement(scene, 'Cooking', { x: -6, y: -4 }, STATION_SIZE, COLORS.cooking);
    kitchen.stations.plateDispenser = createKitchenElement(scene, 'Plates', { x: 6, y: 4 }, STATION_SIZE, COLORS.plateDispenser);
    kitchen.stations.serving = createKitchenElement(scene, 'Serving', { x: 6, y: -4 }, STATION_SIZE, COLORS.serving);
    
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
    
    // Add decorative elements
    kitchen.decorations = createDecorativeElements(scene);
    
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