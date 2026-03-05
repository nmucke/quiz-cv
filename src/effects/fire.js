/**
 * Canvas-based fire effect - particles rising from bottom and sides with intense glow
 */

const COLORS = ['#ff4500', '#ff6b00', '#ff8c00', '#ffa500', '#ffd700', '#fff8dc', '#ff4500'];
const PARTICLE_COUNT = 180;
const PARTICLE_SIZE_MIN = 2;
const PARTICLE_SIZE_MAX = 10;
const RISE_SPEED = 2.5;
const DRIFT_RANGE = 4;

export function initFire(container) {
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'fire-canvas';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);
    initParticles();
  }

  function initParticles() {
    particles = [];
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const source = Math.random();
      let x, y;
      if (source < 0.7) {
        x = Math.random() * width;
        y = height + Math.random() * 150;
      } else if (source < 0.85) {
        x = Math.random() * 40;
        y = Math.random() * height;
      } else {
        x = width - Math.random() * 40;
        y = Math.random() * height;
      }
      particles.push({
        x,
        y,
        size: PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: Math.random(),
        speed: 0.8 + Math.random() * RISE_SPEED,
        drift: (Math.random() - 0.5) * DRIFT_RANGE,
      });
    }
  }

  function animate() {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift;
      p.life -= 0.006;

      if (p.life <= 0 || p.y < -30 || p.x < -20 || p.x > width + 20) {
        const source = Math.random();
        if (source < 0.7) {
          p.y = height + Math.random() * 80;
          p.x = Math.random() * width;
        } else if (source < 0.85) {
          p.x = Math.random() * 50;
          p.y = height * Math.random();
        } else {
          p.x = width - Math.random() * 50;
          p.y = height * Math.random();
        }
        p.life = 0.5 + Math.random() * 0.5;
        p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      const alpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.size * 3;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    animationId = requestAnimationFrame(animate);
  }

  resize();
  animate();

  window.addEventListener('resize', resize);

  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationId);
    canvas.remove();
  };
}
