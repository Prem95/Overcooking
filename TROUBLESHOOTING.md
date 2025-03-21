# Troubleshooting Guide for Overcooked Game

## Common Issues and Solutions

### Blank White Screen

If you're seeing a blank white screen when loading the game, try these steps:

1. **Check Browser Console for Errors**
   - Open your browser's developer tools (F12 or Right-click > Inspect)
   - Look for any JavaScript errors in the Console tab
   - Common errors might include:
     - Module import failures
     - Canvas not found
     - ThreeJS initialization errors

2. **Try the Test Page**
   - Navigate to http://127.0.0.1:8080/test.html
   - This is a simplified test that should show a rotating green cube
   - If this works but the main game doesn't, the issue is in our game code
   - If this also doesn't work, the issue might be with Three.js or ES modules support

3. **Check for CORS Issues**
   - If the console shows CORS errors, make sure you're running the game through the http-server
   - Accessing the files directly via file:// protocol won't work with ES modules

4. **Browser Compatibility**
   - Make sure you're using a modern browser that supports ES modules
   - Chrome, Firefox, Safari, and Edge should all work
   - Try clearing your browser cache or using incognito mode

5. **Import Paths**
   - Make sure the import paths in the main.js file match the import map in index.html

### Mobile Device Issues

If you're experiencing problems on mobile:

1. **Performance**
   - 3D games can be resource-intensive for mobile devices
   - Try closing other apps and browser tabs
   - Ensure your device has adequate GPU capabilities

2. **Touch Controls**
   - If touch controls aren't appearing, check if your device width is correctly detected
   - You might need to refresh the page after rotating your device

3. **Browser Support**
   - Make sure you're using a recent version of Safari (iOS) or Chrome (Android)
   - Some older mobile browsers don't fully support ES modules or WebGL

## Quick Fix

If you're still having issues, try this simpler approach:

1. Replace the content of `index.html` with:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Overcooked-Inspired Game</title>
    <style>
        body { margin: 0; overflow: hidden; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script type="module">
        import * as THREE from 'https://unpkg.com/three@0.162.0/build/three.module.js';

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // Camera
        const viewSize = 10;
        const aspectRatio = window.innerWidth / window.innerHeight;
        const camera = new THREE.OrthographicCamera(
            -viewSize * aspectRatio / 2,
            viewSize * aspectRatio / 2,
            viewSize / 2,
            -viewSize / 2,
            1,
            1000
        );
        camera.position.z = 10;

        // Renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Add kitchen elements
        const COLORS = {
            pantry: 0x8BC34A,        // green
            chopping: 0xFF5252,      // red
            cooking: 0xFF9800,       // orange
            plateDispenser: 0x9E9E9E, // grey
            serving: 0x2196F3,       // blue
            counter: 0xBDBDBD        // light grey
        };

        // Test cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();
    </script>
</body>
</html>
```

2. This simplified version should work in most browsers and confirm that Three.js is loading correctly.

## WebGL Support

This game requires WebGL support in your browser. To check if your browser supports WebGL:

1. Visit [https://get.webgl.org/](https://get.webgl.org/)
2. If you see a spinning cube, WebGL is enabled and working
3. If not, check browser settings to ensure WebGL is enabled, or use a different browser

## Still Having Issues?

If you've tried all the above and are still seeing a blank screen:
- Try a different browser
- Check if any browser extensions might be blocking scripts
- Make sure your internet connection is working (needed for CDN imports)
- Check your device's GPU capabilities and drivers

For further assistance, please open an issue in the GitHub repository with:
- Your browser version
- Operating system
- Any error messages from the console
- Steps you've already tried 