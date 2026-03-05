/**
 * Explosion burst and sparkle particle effects
 */

const SPARKLE_COLORS = ['#ffd700', '#ffa500', '#ff8c00', '#fff8dc', '#ffffff'];
const EXPLOSION_COLORS = ['#ff4500', '#ff6b00', '#ff8c00', '#ffd700', '#fff'];

export function initSparkles(container) {
  if (!container) return;

  const particles = [];
  const count = 30;
  let animationId;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
      alpha: Math.random(),
      twinkleSpeed: 0.02 + Math.random() * 0.03,
      twinklePhase: Math.random() * Math.PI * 2,
    });
  }

  function animate() {
    const elements = container.querySelectorAll('.sparkle');
    particles.forEach((p, i) => {
      p.twinklePhase += p.twinkleSpeed;
      const alpha = (Math.sin(p.twinklePhase) + 1) / 2 * 0.8 + 0.2;
      const el = elements[i];
      if (el) {
        el.style.left = p.x + '%';
        el.style.top = p.y + '%';
        el.style.opacity = alpha;
        el.style.background = p.color;
        el.style.width = el.style.height = p.size + 'px';
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
      box-shadow: 0 0 6px ${p.color};
    `;
    container.appendChild(el);
  });

  animate();

  return () => {
    cancelAnimationFrame(animationId);
    container.querySelectorAll('.sparkle').forEach((el) => el.remove());
  };
}

export function triggerExplosion(x, y, container = document.body) {
  const particleCount = 40;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + Math.random();
    const speed = 3 + Math.random() * 8;
    const el = document.createElement('div');
    el.className = 'explosion-particle';
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 6px;
      height: 6px;
      background: ${EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)]};
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 10px currentColor;
      --tx: ${Math.cos(angle) * speed * 50}px;
      --ty: ${Math.sin(angle) * speed * 50}px;
    `;
    container.appendChild(el);
    particles.push({ el, angle, speed });
  }

  requestAnimationFrame(() => {
    particles.forEach(({ el }) => {
      el.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
      el.style.transform = `translate(var(--tx), var(--ty))`;
      el.style.opacity = '0';
    });
  });

  setTimeout(() => {
    particles.forEach(({ el }) => el.remove());
  }, 700);
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
          triggerExplosion(x, y);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => observer.observe(section));
}
