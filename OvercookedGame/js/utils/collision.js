import { PLAYER_SIZE, STATION_SIZE, COUNTER_SIZE, INTERACTION_RADIUS } from '../constants.js';
import { kitchen } from '../entities/kitchen.js';

// Check collision with kitchen elements
export function checkCollision(position) {
    // Get half sizes for collision detection
    const playerHalfSize = PLAYER_SIZE / 2;
    const stationHalfSize = STATION_SIZE / 2;
    const counterHalfSize = COUNTER_SIZE / 2;
    
    // Check collision with stations
    for (const station of Object.values(kitchen.stations)) {
        // For first-person view, kitchen stations are in x,z coordinates (y is height)
        // where player's position.y is actually the z coordinate
        const stationX = station.position.x;
        const stationZ = station.position.y; // y component of station is z in 3D space
        
        if (
            position.x + playerHalfSize > stationX - stationHalfSize &&
            position.x - playerHalfSize < stationX + stationHalfSize &&
            position.y + playerHalfSize > stationZ - stationHalfSize &&
            position.y - playerHalfSize < stationZ + stationHalfSize
        ) {
            return true; // Collision detected
        }
    }
    
    // Check collision with counters
    for (const counter of kitchen.counters) {
        // Same coordinate conversion as with stations
        const counterX = counter.position.x;
        const counterZ = counter.position.y; // y component of counter is z in 3D space
        
        if (
            position.x + playerHalfSize > counterX - counterHalfSize &&
            position.x - playerHalfSize < counterX + counterHalfSize &&
            position.y + playerHalfSize > counterZ - counterHalfSize &&
            position.y - playerHalfSize < counterZ + counterHalfSize
        ) {
            return true; // Collision detected
        }
    }
    
    // Check collision with walls (assuming kitchen boundaries)
    const kitchenBounds = 9.5; // Slightly inside the walls at ±10
    if (
        position.x < -kitchenBounds ||
        position.x > kitchenBounds ||
        position.y < -kitchenBounds ||
        position.y > kitchenBounds
    ) {
        return true; // Collision with walls
    }
    
    return false; // No collision
}

// Check proximity to stations/counters
export function checkProximity(position, targetPos) {
    // For first-person view, convert coordinates appropriately
    // position.y is player's z coordinate in 3D space
    // targetPos.y is the station/counter's z coordinate in 3D space
    const distance = Math.sqrt(
        Math.pow(position.x - targetPos.x, 2) +
        Math.pow(position.y - targetPos.y, 2)
    );
    
    // Slightly increased interaction radius for first-person to make it easier
    return distance <= INTERACTION_RADIUS * 1.2;
} 