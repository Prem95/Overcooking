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
        const stationPos = station.position;
        if (
            position.x + playerHalfSize > stationPos.x - stationHalfSize &&
            position.x - playerHalfSize < stationPos.x + stationHalfSize &&
            position.y + playerHalfSize > stationPos.y - stationHalfSize &&
            position.y - playerHalfSize < stationPos.y + stationHalfSize
        ) {
            return true; // Collision detected
        }
    }
    
    // Check collision with counters
    for (const counter of kitchen.counters) {
        const counterPos = counter.position;
        if (
            position.x + playerHalfSize > counterPos.x - counterHalfSize &&
            position.x - playerHalfSize < counterPos.x + counterHalfSize &&
            position.y + playerHalfSize > counterPos.y - counterHalfSize &&
            position.y - playerHalfSize < counterPos.y + counterHalfSize
        ) {
            return true; // Collision detected
        }
    }
    
    return false; // No collision
}

// Check proximity to stations/counters
export function checkProximity(position, targetPos) {
    const distance = Math.sqrt(
        Math.pow(position.x - targetPos.x, 2) +
        Math.pow(position.y - targetPos.y, 2)
    );
    return distance <= INTERACTION_RADIUS;
} 