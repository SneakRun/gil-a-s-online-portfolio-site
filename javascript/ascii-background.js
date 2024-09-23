// Perlin noise initialization
const p = new Uint8Array(512);
for (let i = 0; i < 256; i++) p[i] = i;
for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
}
for (let i = 0; i < 256; i++) p[i + 256] = p[i];

document.addEventListener('DOMContentLoaded', function() {
  try {
    (function() {
      const asciiChars = "@$B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
      
      const canvas = document.getElementById('ascii-canvas');
      if (!canvas) {
        console.error("Canvas element 'ascii-canvas' not found");
        return;
      }
      const ctx = canvas.getContext('2d');
      
      let fontSize, cols, rows;
      
      const noiseScale = 0.06;
      const timeFactor = 0.008;
      let zOffset = 0;
      let animationFrameId;

      // Off-screen canvas for character rendering
      const offscreenCanvas = document.createElement('canvas');
      const offscreenCtx = offscreenCanvas.getContext('2d');

      // Noise value cache
      const noiseCache = new Map();

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        fontSize = Math.max(6, Math.floor(canvas.width / 130));
        
        cols = Math.ceil(canvas.width / fontSize) + 1;
        rows = Math.ceil(canvas.height / fontSize);
        
        ctx.font = `${fontSize}px 'IBM Plex Mono', monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Resize off-screen canvas
        offscreenCanvas.width = cols * fontSize;
        offscreenCanvas.height = rows * fontSize;
        offscreenCtx.font = ctx.font;
        offscreenCtx.textAlign = ctx.textAlign;
        offscreenCtx.textBaseline = ctx.textBaseline;

        // Clear noise cache on resize
        noiseCache.clear();
      }

      function noise(x, y, z) {
        const key = `${x},${y},${z}`;
        if (noiseCache.has(key)) return noiseCache.get(key);

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
        const result = lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), 
                                       grad(p[BA], x-1, y, z)),
                               lerp(u, grad(p[AB], x, y-1, z),
                                       grad(p[BB], x-1, y-1, z))),
                       lerp(v, lerp(u, grad(p[AA+1], x, y, z-1),
                                       grad(p[BA+1], x-1, y, z-1)),
                               lerp(u, grad(p[AB+1], x, y-1, z-1),
                                       grad(p[BB+1], x-1, y-1, z-1))));
        
        noiseCache.set(key, result);
        return result;
      }

      function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
      function lerp(t, a, b) { return a + t * (b - a); }
      function grad(hash, x, y, z) {
          const h = hash & 15;
          const u = h < 8 ? x : y;
          const v = h < 4 ? y : h == 12 || h == 14 ? x : z;
          return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
      }

      let lastDrawTime = 0;
      const frameInterval = 1000 / 30; // 30 FPS

      function draw(currentTime) {
        if (currentTime - lastDrawTime < frameInterval) {
          animationFrameId = requestAnimationFrame(draw);
          return;
        }
        lastDrawTime = currentTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

        offscreenCtx.fillStyle = getComputedColor('--ascii-text-color');
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const noiseValue = noise(x * noiseScale, y * noiseScale, zOffset);
                const index = Math.floor((noiseValue * 0.5 + 0.5) * (asciiChars.length - 1));
                const char = asciiChars[index];
                offscreenCtx.fillText(char, x * fontSize, y * fontSize);
            }
        }

        ctx.drawImage(offscreenCanvas, 0, 0);

        zOffset += timeFactor;
        if (noiseCache.size > 1000000) noiseCache.clear(); // Prevent excessive cache growth
        animationFrameId = requestAnimationFrame(draw);
      }

      function init() {
        resizeCanvas();
        draw(0);
        window.addEventListener('beforeunload', cleanup);
      }

      const debouncedResizeCanvas = debounce(resizeCanvas, 250);
      window.addEventListener('resize', debouncedResizeCanvas);

      init();
    })();
  } catch (error) {
    console.error("Error in ASCII background script:", error);
  }
});

function getComputedColor(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function cleanup() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}