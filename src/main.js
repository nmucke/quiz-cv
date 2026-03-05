import config from '../config.js';
import { initFire } from './effects/fire.js';
import { initSparkles, triggerExplosion, initScrollExplosions } from './effects/particles.js';

// Render content from config
function renderContent() {
  document.getElementById('hero-name').textContent = config.name;
  document.getElementById('hero-tagline').textContent = config.tagline;
  document.getElementById('bio-text').textContent = config.bio;

  // Gallery
  const galleryGrid = document.getElementById('gallery-grid');
  galleryGrid.innerHTML = '';
  config.images.forEach((img) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    const image = document.createElement('img');
    image.src = img.src;
    image.alt = img.alt;
    image.loading = 'lazy';
    image.onerror = () => {
      image.src = '/images/placeholder.svg';
    };
    item.appendChild(image);
    galleryGrid.appendChild(item);
  });

  // Video
  const videoWrapper = document.getElementById('video-wrapper');
  if (config.video?.src) {
    const video = document.createElement('video');
    video.src = config.video.src;
    video.poster = config.video.poster || '';
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
  if (config.contact?.email) {
    const a = document.createElement('a');
    a.href = `mailto:${config.contact.email}`;
    a.className = 'contact-link';
    a.textContent = config.contact.email;
    contactLinks.appendChild(a);
  }
  if (config.contact?.linkedin) {
    const a = document.createElement('a');
    a.href = config.contact.linkedin;
    a.className = 'contact-link';
    a.textContent = 'LinkedIn';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    contactLinks.appendChild(a);
  }
  if (config.contact?.github) {
    const a = document.createElement('a');
    a.href = config.contact.github;
    a.className = 'contact-link';
    a.textContent = 'GitHub';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    contactLinks.appendChild(a);
  }
}

// Initialize effects
function initEffects() {
  const fireContainer = document.getElementById('fire-canvas');
  const particlesContainer = document.getElementById('particles-container');

  initFire(fireContainer);
  initSparkles(particlesContainer);
  initScrollExplosions();

  // Initial explosion on load
  setTimeout(() => {
    triggerExplosion(window.innerWidth / 2, window.innerHeight / 2);
  }, 500);
}

renderContent();
initEffects();
