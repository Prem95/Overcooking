# Development Guidelines

These are the guidelines for development as a senior game developer using Cursor, excluding the tech stack recommendation to adhere to the request for separation. They focus on best practices and methodologies.

## Codebase Organization
- Modularize code into separate sections:
  - Game logic
  - Rendering
  - Networking 
  - UI
- Maintain structured and manageable project architecture

## Performance Optimization
- Minimize draw calls
- Use efficient data structures
- Leverage ThreeJS features:
  - Instancing
  - Level of detail (LOD)
- Ensure smooth gameplay performance

## Input Handling
- Implement Pointer Lock API for mouse controls
- Add Gamepad API support for controllers
- Provide responsive and intuitive input handling

## Multiplayer State Management
- Utilize Colyseus room system
- Implement delta encoding
- Efficiently manage game instances
- Synchronize state between clients and server

## Network Latency Handling
- Apply client-side prediction
- Implement server reconciliation
- Minimize latency effects
- Ensure seamless multiplayer experience

## Security Measures
- Validate all client inputs on server
- Use HTTPS for secure communication
- Apply rate limiting
- Protect against abuse
- Maintain gameplay fairness

## Deployment Strategy
- Deploy on cloud provider with auto-scaling
- Use CDN for static assets
- Achieve scalability
- Maintain low latency worldwide
