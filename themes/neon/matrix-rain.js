/**
 * openclaw-theme-neon — matrix-rain.js
 * Standalone canvas-based Matrix rain effect.
 * Drop a <canvas class="neon-matrix-rain" id="matrix-rain"></canvas>
 * in your HTML, then call: MatrixRain.init()
 *
 * Reads CSS custom properties from :root for configuration:
 *   --matrix-density  (0.01–0.10, default 0.03)
 *   --matrix-speed    (multiplier, default 1.0)
 *   --matrix-opacity  (canvas opacity, default 0.18)
 *   --neon-primary    (drop color, default #00ff41)
 *
 * MIT License — Ian Alloway
 */

const MatrixRain = (() => {
  const KATAKANA =
    'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
  const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
  const CHARS = KATAKANA + LATIN;

  let canvas, ctx, drops, onResize, onVisibility, motionQuery, onMotion;
  let animId = null;
  let originalDisplay = '';
  let cols, fontSize, density, speed, color;

  function getCSSVar(name, fallback) {
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    return val || fallback;
  }

  function readConfig() {
    const rawDensity = parseFloat(getCSSVar('--matrix-density', '0.03'));
    const rawSpeed = parseFloat(getCSSVar('--matrix-speed', '1.0'));
    density = Number.isFinite(rawDensity) ? Math.min(0.1, Math.max(0.01, rawDensity)) : 0.03;
    speed = Number.isFinite(rawSpeed) && rawSpeed > 0 ? rawSpeed : 1;
    color   = getCSSVar('--neon-primary', '#00ff41');
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    fontSize = 14;
    cols     = Math.floor(canvas.width / fontSize);
    drops    = Array.from({ length: cols }, () =>
      Math.random() > 0.5 ? Math.random() * -canvas.height / fontSize : 1
    );
  }

  let lastTime = 0;
  const BASE_FPS = 20;

  function draw(timestamp) {
    animId = null;
    if (!ctx || document.hidden || motionQuery.matches) return;
    animId = requestAnimationFrame(draw);

    const interval = 1000 / (BASE_FPS * speed);
    if (timestamp - lastTime < interval) return;
    lastTime = timestamp;

    // Semi-transparent black overlay creates the fade trail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px 'IBM Plex Mono', monospace`;

    for (let i = 0; i < cols; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Lead character is bright white
      const isLead = drops[i] > 1 && Math.random() > 0.85;
      ctx.fillStyle = isLead ? '#ffffff' : color;
      ctx.shadowColor = color;
      ctx.shadowBlur  = isLead ? 8 : 4;

      ctx.fillText(char, x, y);

      // Reset drop randomly or when it leaves screen
      if (y > canvas.height && Math.random() > 1 - density) {
        drops[i] = 0;
      }

      drops[i] += 0.5;
    }
  }

  function init(canvasId = 'matrix-rain') {
    // Repeated init calls must replace the old loop and its listeners.
    destroy();
    canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.warn('[MatrixRain] Canvas not found:', canvasId);
      return;
    }

    ctx = canvas.getContext('2d');
    if (!ctx) return;
    originalDisplay = canvas.style.display;
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    readConfig();
    resize();

    onResize = () => {
      readConfig();
      resize();
    };
    window.addEventListener('resize', onResize);
    onVisibility = syncAnimation;
    onMotion = syncAnimation;
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener('change', onMotion);
    syncAnimation();
  }

  function syncAnimation() {
    if (!ctx) return;
    canvas.style.display = motionQuery.matches ? 'none' : originalDisplay;
    if (document.hidden || motionQuery.matches) {
      if (animId !== null) cancelAnimationFrame(animId);
      animId = null;
      lastTime = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (animId === null) {
      lastTime = 0;
      animId = requestAnimationFrame(draw);
    }
  }

  function destroy() {
    if (animId !== null) cancelAnimationFrame(animId);
    animId = null;
    if (onResize) window.removeEventListener('resize', onResize);
    if (onVisibility) document.removeEventListener('visibilitychange', onVisibility);
    if (motionQuery && onMotion) motionQuery.removeEventListener('change', onMotion);
    onResize = null;
    onVisibility = null;
    onMotion = null;
    motionQuery = null;
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = originalDisplay;
    }
    canvas = null;
    ctx = null;
    lastTime = 0;
  }

  /** Change variant on the fly (primary accent for rain + glow). */
  function setVariant(variant) {
    const variants = {
      neon:           '#00ff41',
      'neon-blue':    '#00d4ff',
      'neon-amber':   '#ffb000',
      'neon-red':     '#ff3333',
      'neon-dracula': '#50fa7b',
    };
    const c = variants[variant];
    if (c) {
      document.documentElement.style.setProperty('--neon-primary', c);
      readConfig();
    }
  }

  return { init, destroy, setVariant };
})();

// Auto-init if DOM is already ready
if (typeof document !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MatrixRain.init());
} else if (typeof document !== 'undefined') {
  MatrixRain.init();
}

// Export for module environments
if (typeof module !== 'undefined') module.exports = MatrixRain;
if (typeof window !== 'undefined') window.MatrixRain = MatrixRain;
