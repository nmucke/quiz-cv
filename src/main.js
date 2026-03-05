import config from '../config.js';
import { initFire } from './effects/fire.js';
import {
  initSparkles,
  initGlitter,
  triggerExplosion,
  triggerConfettiBurst,
  initScrollExplosions,
} from './effects/particles.js';

const base = import.meta.env.BASE_URL;
const asset = (path) => base + path.replace(/^\//, '');

// Render content from config
function renderContent() {
  document.getElementById('hero-name').textContent = config.name;
  document.getElementById('hero-tagline').textContent = config.tagline;
  document.getElementById('bio-text').textContent = config.bio;

  // Gallery
  const galleryGrid = document.getElementById('gallery-grid');
  galleryGrid.innerHTML = '';
  config.images.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.animationDelay = `${i * 0.1}s`;
    const image = document.createElement('img');
    image.src = asset(img.src);
    image.alt = img.alt;
    image.loading = 'lazy';
    image.onerror = () => {
      image.src = asset('/images/placeholder.svg');
    };
    item.appendChild(image);
    galleryGrid.appendChild(item);
  });

  // Video
  const videoWrapper = document.getElementById('video-wrapper');
  if (config.video?.src) {
    const video = document.createElement('video');
    video.src = asset(config.video.src);
    video.poster = config.video.poster ? asset(config.video.poster) : '';
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.onerror = () => {
      videoWrapper.innerHTML = '<div class="video-placeholder">Add your video to public/video/</div>';
    };
    videoWrapper.appendChild(video);
  } else {
    videoWrapper.innerHTML = '<div class="video-placeholder">Add your video to public/video/</div>';
  }

  // Contact
  const contactLinks = document.getElementById('contact-links');
  contactLinks.innerHTML = '';
  const contactItems = [
    { key: 'email', href: (c) => `mailto:${c}`, text: (c) => c },
    { key: 'linkedin', href: (c) => c, text: () => 'LinkedIn' },
    { key: 'github', href: (c) => c, text: () => 'GitHub' },
  ];
  contactItems.forEach(({ key, href, text }, i) => {
    const val = config.contact?.[key];
    if (val) {
      const a = document.createElement('a');
      a.href = href(val);
      a.className = 'contact-link';
      a.textContent = text(val);
      a.style.animationDelay = `${i * 0.1}s`;
      if (key !== 'email') {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      contactLinks.appendChild(a);
    }
  });
}

// Initialize effects
function initEffects() {
  const fireContainer = document.getElementById('fire-canvas');
  const particlesContainer = document.getElementById('particles-container');

  initFire(fireContainer);
  initSparkles(particlesContainer);
  initGlitter(particlesContainer);
  initScrollExplosions();

  // Big explosion + confetti on load
  setTimeout(() => {
    triggerExplosion(window.innerWidth / 2, window.innerHeight / 2, { size: 1.5, particleCount: 80 });
  }, 300);
  setTimeout(() => {
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 3);
  }, 600);
  setTimeout(() => {
    triggerExplosion(window.innerWidth * 0.25, window.innerHeight / 2, { size: 0.8 });
    triggerExplosion(window.innerWidth * 0.75, window.innerHeight / 2, { size: 0.8 });
  }, 900);

  // Click anywhere to explode
  document.addEventListener('click', (e) => {
    triggerExplosion(e.clientX, e.clientY, { size: 0.6, particleCount: 40 });
  });
}

renderContent();
initEffects();
