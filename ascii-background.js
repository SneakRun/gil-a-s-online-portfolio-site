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
  const noiseScale = 0.05;
  const brushSize = 50;
  const timeFactor = 0.01;
  let zOffset = 0;
  let animationFrameId;

  // Function to resize the canvas and recalculate dimensions
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    fontSize = Math.max(5, Math.floor(canvas.width / 80)); // Adjust font size based on canvas width
    cols = Math.floor(canvas.width / fontSize);
    rows = Math.floor(canvas.height / fontSize);
    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
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
    console.log("Drawing frame");
      // Clear the canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Get mouse position (default to 0 if not set)
      const mouseX = window.mouseX || 0;
      const mouseY = window.mouseY || 0;

      ctx.fillStyle = 'white';
      for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
              // Calculate distance from current position to mouse
              const distance = Math.hypot(mouseX - (x * fontSize + fontSize / 2), mouseY - (y * fontSize + fontSize / 2));
              const effectIntensity = Math.max(0, Math.min(1, 1 - distance / brushSize));

              // Generate noise value and adjust based on mouse proximity
              const noiseBase = noise(x * noiseScale, y * noiseScale, zOffset);
              const adjustedNoiseValue = noiseBase + (0.5 * effectIntensity * noise(x * noiseScale + effectIntensity, y * noiseScale + effectIntensity, zOffset));

              // Select ASCII character based on noise value
              const index = Math.floor((adjustedNoiseValue * 0.5 + 0.5) * (asciiChars.length - 1));
              const char = asciiChars[index];

              // Draw the character
              ctx.fillText(char, x * fontSize, y * fontSize);
          }
      }

      // Increment z-offset for animation
      zOffset += timeFactor;
      animationFrameId = requestAnimationFrame(draw);
  }

  // Function to handle mouse movement
  function handleMouseMove(event) {
      const rect = canvas.getBoundingClientRect();
      window.mouseX = event.clientX - rect.left;
      window.mouseY = event.clientY - rect.top;
  }

  // Initialization function
  function init() {
    console.log("Initializing ASCII background");
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    draw();
    console.log("ASCII background initialized");
  }

  // Start the animation
  init();

  document.addEventListener('DOMContentLoaded', function() {
    const asciiContainer = document.getElementById('ascii-background');
    
    function generateAsciiArt() {
        // Your ASCII art generation logic here
        // For example:
        let asciiArt = '';
        for (let i = 0; i < 1000; i++) {
            asciiArt += String.fromCharCode(33 + Math.floor(Math.random() * 94));
        }
        return asciiArt;
    }

    function updateBackground() {
        asciiContainer.textContent = generateAsciiArt();
        requestAnimationFrame(updateBackground);
    }

    updateBackground();
  });
})();