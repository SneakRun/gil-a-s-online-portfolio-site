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
      const timeFactor = 0.003;
      let zOffset = 0;
      let animationFrameId;

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Set a minimum font size and calculate based on screen width
        const minFontSize = 8;
        const maxFontSize = 16;
        fontSize = Math.max(minFontSize, Math.min(maxFontSize, Math.floor(canvas.width / 80)));
        
        cols = Math.ceil(canvas.width / fontSize);
        rows = Math.ceil(canvas.height / fontSize);
        
        ctx.font = `${fontSize}px 'IBM Plex Mono', monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
      }

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

      function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
      function lerp(t, a, b) { return a + t * (b - a); }
      function grad(hash, x, y, z) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h == 12 || h == 14 ? x : z;
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
      }

      const p = new Uint8Array(512);
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [p[i], p[j]] = [p[j], p[i]];
      }
      for (let i = 0; i < 256; i++) p[i + 256] = p[i];

      function draw() {
        ctx.fillStyle = getComputedColor('--ascii-background-color');
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = getComputedColor('--ascii-text-color');
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const noiseValue = noise(x * noiseScale, y * noiseScale, zOffset);
            const index = Math.floor((noiseValue * 0.5 + 0.5) * (asciiChars.length - 1));
            ctx.fillText(asciiChars[index], x * fontSize, y * fontSize);
          }
        }

        zOffset += timeFactor;
        animationFrameId = requestAnimationFrame(draw);
      }

      function init() {
        resizeCanvas();
        draw();
      }

      const debouncedResizeCanvas = debounce(resizeCanvas, 250);
      window.addEventListener('resize', debouncedResizeCanvas);
      window.addEventListener('beforeunload', cleanup);

      init();
    })();
  } catch (error) {
    console.error("Error in ASCII background script:", error);
  }
});

function getComputedColor(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function cleanup() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}