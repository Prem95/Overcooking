import * as THREE from 'three';
import { STATION_SIZE, COUNTER_SIZE, COLORS } from '../constants.js';

// Kitchen layout object
export const kitchen = {
    stations: {},
    counters: []
};

// Function to create a station or counter
export function createKitchenElement(scene, type, position, size, color) {
    // Create a group to hold the station/counter and its label
    const elementGroup = new THREE.Group();
    elementGroup.position.set(position.x, position.y, 0);
    
    // Create a 3D box instead of a plane for the kitchen element
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
    } else if (type === 'Plates') {
        // Add stack of plates for the plate dispenser
        for (let i = 0; i < 3; i++) {
            const plateGeometry = new THREE.CylinderGeometry(size * 0.25, size * 0.25, size * 0.02, 16);
            const plateMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 100 });
            const plate = new THREE.Mesh(plateGeometry, plateMaterial);
            plate.position.y = -size * 0.15 + size * 0.02 + i * size * 0.03;
            elementGroup.add(plate);
        }
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
    } else if (type === 'Counter') {
        // Add a raised rim around the counter
        const rimGeometry = new THREE.BoxGeometry(size * 1.05, size * 0.05, size * 1.05);
        const rimMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.position.y = -size * 0.15 + size * 0.15;
        elementGroup.add(rim);
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

// Create kitchen layout with all stations and counters
export function createKitchenLayout(scene) {
    console.log("Creating kitchen layout...");
    
    // Create stations
    kitchen.stations.pantry = createKitchenElement(scene, 'Pantry', { x: -4, y: 3 }, STATION_SIZE, COLORS.pantry);
    kitchen.stations.chopping = createKitchenElement(scene, 'Chopping', { x: -4, y: 0 }, STATION_SIZE, COLORS.chopping);
    kitchen.stations.cooking = createKitchenElement(scene, 'Cooking', { x: -4, y: -3 }, STATION_SIZE, COLORS.cooking);
    kitchen.stations.plateDispenser = createKitchenElement(scene, 'Plates', { x: 4, y: 3 }, STATION_SIZE, COLORS.plateDispenser);
    kitchen.stations.serving = createKitchenElement(scene, 'Serving', { x: 4, y: -3 }, STATION_SIZE, COLORS.serving);
    
    // Create counters
    kitchen.counters.push(
        createKitchenElement(scene, 'Counter', { x: 0, y: 3 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: 0, y: 0 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: 0, y: -3 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: 4, y: 0 }, COUNTER_SIZE, COLORS.counter),
        createKitchenElement(scene, 'Counter', { x: -2, y: -1.5 }, COUNTER_SIZE, COLORS.counter)
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