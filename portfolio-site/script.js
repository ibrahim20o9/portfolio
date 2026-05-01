// ===== SCROLL REVEAL (Intersection Observer) =====
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// ===== NAVBAR SCROLL (with passive listener) =====
const navbar = document.getElementById('navbar');
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

// ===== MOBILE MENU =====
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== CURSOR GLOW (desktop only, with rAF) =====
const cursorGlow = document.getElementById('cursorGlow');
const isMobile = !window.matchMedia('(pointer: fine)').matches || window.innerWidth <= 900;
if (!isMobile && cursorGlow) {
  let glowX = 0, glowY = 0, currentX = 0, currentY = 0;
  document.addEventListener('mousemove', (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
  }, { passive: true });
  function updateGlow() {
    currentX += (glowX - currentX) * 0.15;
    currentY += (glowY - currentY) * 0.15;
    cursorGlow.style.transform = `translate(${currentX - 250}px, ${currentY - 250}px)`;
    requestAnimationFrame(updateGlow);
  }
  requestAnimationFrame(updateGlow);
} else if (cursorGlow) {
  cursorGlow.style.display = 'none';
}

// ===== ANIMATED COUNTERS =====
function animateCounter(el, target) {
  const duration = 1500;
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current.toString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statCards = document.querySelectorAll('.stat-card');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      const numEl = entry.target.querySelector('.stat-number');
      if (numEl) animateCounter(numEl, parseInt(numEl.dataset.target));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
statCards.forEach(card => statsObserver.observe(card));

// ===== SMOOTH ANCHOR SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { threshold: 0.2 });
sections.forEach(s => sectionObserver.observe(s));

// ===== CLEAN UP will-change AFTER ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.reveal-up.visible, .reveal-left.visible, .reveal-right.visible, .reveal-scale.visible').forEach(el => {
      el.style.willChange = 'auto';
    });
  }, 3000);
});
