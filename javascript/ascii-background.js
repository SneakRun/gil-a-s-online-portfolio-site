console.log('ASCII background script file loaded');
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded and parsed");
  try {
    (function() {
      console.log("ASCII background script is running");

      // ASCII characters used for rendering, from darkest to lightest
      const asciiChars = "@$B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
      
      // Get the canvas element and its 2D rendering context
      const canvas = document.getElementById('ascii-canvas');
      if (!canvas) {
        console.error("Canvas element 'ascii-canvas' not found");
        return;
      }
      console.log("Canvas found:", canvas);
      const ctx = canvas.getContext('2d');
      console.log("Canvas context:", ctx);
      
      // Variables for font size, columns, and rows
      let fontSize, cols, rows;
      
      // Constants for noise generation and animation
      const noiseScale = 0.06; //reduced from 0.05
      const timeFactor = 0.003; // original speed 0.001, then 0.0012, then 0.0015
      let zOffset = 0;
      let animationFrameId;

      // Function to resize the canvas and recalculate dimensions
      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        // Keep the font size calculation as is
        fontSize = Math.max(6, Math.floor(canvas.width / 130));
        
        // Calculate cols and rows based on the fixed font size
        cols = Math.ceil(canvas.width / fontSize) + 1; // Add 1 to ensure full coverage
        rows = Math.ceil(canvas.height / fontSize);
        
        ctx.font = `${fontSize}px 'IBM Plex Mono', monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        console.log('Canvas size:', canvas.width, 'x', canvas.height);
        console.log('Font size:', fontSize);
        console.log('Grid:', cols, 'x', rows);
      }

      // Perlin noise function for 3D noise generation
      function noise(x, y, z) {
          const X = Math.floor(x) & 255;
          const Y = Math.floor(y) & 255;
          const Z = Math.floor(z) & 255;
          x -= Math.floor(x);
          y -= Math.floor(y);
          z -= Math.floor(z);
          const u = fade(x);
          const v = fade(y);
          const w = fade(z);
          const A = p[X]+Y, AA = p[A]+Z, AB = p[A+1]+Z;
          const B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;
          return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), 
                                         grad(p[BA], x-1, y, z)),
                                 lerp(u, grad(p[AB], x, y-1, z),
                                         grad(p[BB], x-1, y-1, z))),
                         lerp(v, lerp(u, grad(p[AA+1], x, y, z-1),
                                         grad(p[BA+1], x-1, y, z-1)),
                                 lerp(u, grad(p[AB+1], x, y-1, z-1),
                                         grad(p[BB+1], x-1, y-1, z-1))));
      }

      // Helper functions for Perlin noise
      function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
      function lerp(t, a, b) { return a + t * (b - a); }
      function grad(hash, x, y, z) {
          const h = hash & 15;
          const u = h < 8 ? x : y;
          const v = h < 4 ? y : h == 12 || h == 14 ? x : z;
          return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
      }

      // Initialize permutation table for Perlin noise
      const p = new Uint8Array(512);
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 255; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [p[i], p[j]] = [p[j], p[i]];
      }
      for (let i = 0; i < 256; i++) p[i + 256] = p[i];

      // Main drawing function
      function draw() {
        // Clear the canvas
        ctx.fillStyle = getComputedColor('--ascii-background-color');
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = getComputedColor('--ascii-text-color');
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                // Generate noise value
                const noiseValue = noise(x * noiseScale, y * noiseScale, zOffset);

                // Select ASCII character based on noise value
                const index = Math.floor((noiseValue * 0.5 + 0.5) * (asciiChars.length - 1));
                const char = asciiChars[index];

                // Draw the character
                ctx.fillText(char, x * fontSize, y * fontSize);
            }
        }

        // Increment z-offset for animation
        zOffset += timeFactor;
        animationFrameId = requestAnimationFrame(draw);
      }

      // Initialization function
      function init() {
        console.log("Initializing ASCII background");
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        draw();
        console.log("ASCII background initialized");
      }

      // Add console logs to confirm if the code is running
      console.log("ASCII background script started");

      // Log when the canvas is found
      console.log("Canvas element:", canvas);

      // Log when resizeCanvas is called
      const originalResizeCanvas = resizeCanvas;
      resizeCanvas = function() {
        console.log("Resizing canvas");
        originalResizeCanvas();
        console.log("Canvas resized. New dimensions:", canvas.width, "x", canvas.height);
      };

      // Start the animation
      init();

      console.log("ASCII background script setup complete");
    })();
  } catch (error) {
    console.error("Error in ASCII background script:", error);
  }
});

function getComputedColor(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}
