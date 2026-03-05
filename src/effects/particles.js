/**
 * Explosion burst, sparkle, and glitter particle effects
 */

const SPARKLE_COLORS = ['#ffd700', '#ffa500', '#ff8c00', '#fff8dc', '#ffffff', '#ff69b4', '#00ffff'];
const EXPLOSION_COLORS = ['#ff4500', '#ff6b00', '#ff8c00', '#ffd700', '#fff', '#ff69b4'];
const GLITTER_COLORS = ['#ffd700', '#fff8dc', '#ffffff', '#ff69b4', '#00ffff', '#ffa500', '#ff6b6b'];

export function initSparkles(container) {
  if (!container) return;

  const particles = [];
  const count = 80;
  let animationId;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
      alpha: Math.random(),
      twinkleSpeed: 0.02 + Math.random() * 0.05,
      twinklePhase: Math.random() * Math.PI * 2,
    });
  }

  function animate() {
    const elements = container.querySelectorAll('.sparkle');
    particles.forEach((p, i) => {
      p.twinklePhase += p.twinkleSpeed;
      const alpha = (Math.sin(p.twinklePhase) + 1) / 2 * 0.9 + 0.1;
      const el = elements[i];
      if (el) {
        el.style.left = p.x + '%';
        el.style.top = p.y + '%';
        el.style.opacity = alpha;
        el.style.background = p.color;
        el.style.width = el.style.height = p.size + 'px';
        el.style.boxShadow = `0 0 ${p.size * 4}px ${p.color}`;
      }
    });
    animationId = requestAnimationFrame(animate);
  }

  particles.forEach((p) => {
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.style.cssText = `
      position: absolute;
      left: ${p.x}%;
      top: ${p.y}%;
      width: ${p.size}px;
      height: ${p.size}px;
      background: ${p.color};
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 ${p.size * 4}px ${p.color};
    `;
    container.appendChild(el);
  });

  animate();

  return () => {
    cancelAnimationFrame(animationId);
    container.querySelectorAll('.sparkle').forEach((el) => el.remove());
  };
}

export function initGlitter(container) {
  if (!container) return;

  const glitter = [];
  const count = 60;
  let animationId;

  for (let i = 0; i < count; i++) {
    glitter.push({
      x: Math.random() * 100,
      y: -Math.random() * 100,
      size: 3 + Math.random() * 5,
      color: GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)],
      speed: 0.3 + Math.random() * 0.8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
    });
  }

  function createGlitterEl(g) {
    const el = document.createElement('div');
    el.className = 'glitter-particle';
    el.style.cssText = `
      position: absolute;
      left: ${g.x}%;
      top: ${g.y}%;
      width: ${g.size}px;
      height: ${g.size}px;
      background: ${g.color};
      transform: rotate(${g.rotation}deg);
      pointer-events: none;
      box-shadow: 0 0 ${g.size * 2}px ${g.color};
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    `;
    container.appendChild(el);
    return el;
  }

  const elements = glitter.map(createGlitterEl);

  function animate() {
    const height = container.offsetHeight || window.innerHeight;
    glitter.forEach((g, i) => {
      g.y += g.speed * 0.05;
      g.rotation += g.rotationSpeed;
      if (g.y > 110) {
        g.y = -10;
        g.x = Math.random() * 100;
      }
      const el = elements[i];
      if (el) {
        el.style.left = g.x + '%';
        el.style.top = g.y + '%';
        el.style.transform = `rotate(${g.rotation}deg)`;
        el.style.opacity = 0.6 + Math.sin(g.rotation * 0.1) * 0.3;
      }
    });
    animationId = requestAnimationFrame(animate);
  }

  animate();

  return () => {
    cancelAnimationFrame(animationId);
    container.querySelectorAll('.glitter-particle').forEach((el) => el.remove());
  };
}

export function triggerExplosion(x, y, options = {}) {
  const { size = 1, particleCount = 60 } = options;
  const container = options.container || document.body;

  const particles = [];
  const count = Math.floor(particleCount * size);

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 2;
    const speed = (5 + Math.random() * 12) * size;
    const pSize = (4 + Math.random() * 8) * size;
    const el = document.createElement('div');
    el.className = 'explosion-particle';
    const color = EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)];
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${pSize}px;
      height: ${pSize}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 ${pSize * 3}px ${color};
      --tx: ${Math.cos(angle) * speed * 40}px;
      --ty: ${Math.sin(angle) * speed * 40}px;
      z-index: 99999;
    `;
    container.appendChild(el);
    particles.push({ el });
  }

  requestAnimationFrame(() => {
    particles.forEach(({ el }) => {
      el.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease-out';
      el.style.transform = `translate(var(--tx), var(--ty)) scale(0)`;
      el.style.opacity = '0';
    });
  });

  setTimeout(() => {
    particles.forEach(({ el }) => el.remove());
  }, 900);
}

export function triggerConfettiBurst(x, y) {
  const colors = ['#ffd700', '#ff6b00', '#ff69b4', '#00ffff', '#ff4500', '#fff'];
  const count = 50;
  const container = document.body;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 3;
    const speed = 8 + Math.random() * 15;
    const el = document.createElement('div');
    el.className = 'confetti-particle';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const w = 6 + Math.random() * 8;
    const h = 4 + Math.random() * 6;
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${w}px;
      height: ${h}px;
      background: ${color};
      pointer-events: none;
      --tx: ${Math.cos(angle) * speed * 25}px;
      --ty: ${Math.sin(angle) * speed * 25}px;
      --rot: ${(Math.random() - 0.5) * 720}deg;
      z-index: 99999;
    `;
    container.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transition = 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1s ease-out';
      el.style.transform = `translate(var(--tx), var(--ty)) rotate(var(--rot))`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), 1100);
  }
}

export function initScrollExplosions() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const rect = entry.target.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          triggerExplosion(x, y, { size: 1.2 });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((section) => observer.observe(section));
}
