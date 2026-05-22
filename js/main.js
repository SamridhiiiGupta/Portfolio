/* ============================================
   MAIN JS — Lenis + GSAP powered
   Smooth scroll, scroll animations, magnetic
   elements, hero entrance, spotlight
   ============================================ */

// ─── 1. LENIS SMOOTH SCROLL ───────────────────
function initLenis() {
  if (typeof Lenis === 'undefined') return null;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });

  // Sync Lenis with GSAP ticker for ScrollTrigger compatibility
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback RAF loop if GSAP not available
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  return lenis;
}

// ─── 2. HERO ENTRANCE ANIMATION ──────────────
function initHeroAnimation() {
  if (typeof gsap === 'undefined') return;

  const words    = document.querySelectorAll('.hero-word');
  const role     = document.querySelector('.hero-role');
  const sep      = document.querySelector('.hero-separator');
  const tagline  = document.querySelector('.hero-tagline');
  const bottom   = document.querySelector('.hero-bottom');

  if (!words.length) return;

  const tl = gsap.timeline({
    delay: 0.15,
    defaults: { ease: 'power4.out' },
  });

  // 1. Role label fades down
  if (role) tl.from(role, { y: -16, opacity: 0, duration: 0.8 });

  // 2. Name words slide up from clip
  tl.to(words, {
    y: '0%',
    duration: 1.4,
    stagger: 0.13,
    ease: 'power4.out',
  }, '-=0.4');

  // 3. Separator expands from centre
  if (sep) tl.to(sep, { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5');

  // 4. Tagline fades up
  if (tagline) {
    tl.to(tagline, {
      y: 0, opacity: 1,
      duration: 0.9, ease: 'power3.out',
    }, '-=0.4');
  }

  // 5. Bottom strip
  if (bottom) tl.to(bottom, { opacity: 1, duration: 0.6 }, '-=0.4');
}

// ─── 3. GSAP SCROLL ANIMATIONS ───────────────
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Graceful degradation to CSS-based fallback
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Section labels — slide in
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      y: 28, opacity: 0, duration: 0.7, ease: 'power3.out',
    });
  });

  // Project cards — staggered fade up
  const grid = document.querySelector('.projects-grid');
  if (grid) {
    gsap.from('.project-card', {
      scrollTrigger: { trigger: grid, start: 'top 80%', once: true },
      y: 48, opacity: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out',
    });
  }

  // Tech categories
  gsap.utils.toArray('.tech-category').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 87%', once: true },
      y: 28, opacity: 0, duration: 0.65, delay: i * 0.05, ease: 'power3.out',
    });
  });

  // Timeline items — slide from left
  gsap.utils.toArray('.timeline-item').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 87%', once: true },
      x: -24, opacity: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out',
    });
  });

  // Cert cards
  gsap.utils.toArray('.cert-card').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      y: 20, opacity: 0, duration: 0.6, delay: i * 0.06, ease: 'power3.out',
    });
  });

  // Pre-footer text — subtle scale
  const preFooter = document.querySelector('.pre-footer-text');
  if (preFooter) {
    gsap.from(preFooter, {
      scrollTrigger: { trigger: preFooter, start: 'top 78%', once: true },
      scale: 0.94, opacity: 0, duration: 1.2, ease: 'power3.out',
    });
  }

  // Projects more link
  const moreLink = document.querySelector('.projects-more');
  if (moreLink) {
    gsap.from(moreLink, {
      scrollTrigger: { trigger: moreLink, start: 'top 88%', once: true },
      y: 16, opacity: 0, duration: 0.6, ease: 'power3.out',
    });
  }
}

// ─── 4. MAGNETIC ELEMENTS ────────────────────
function initMagnetic() {
  if (typeof gsap === 'undefined') return;

  document.querySelectorAll('[data-magnetic]').forEach(el => {
    const strength = parseFloat(el.dataset.magnetic) || 0.28;

    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * strength;
      const dy = (e.clientY - (r.top  + r.height / 2)) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: 'power2.out' });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

// ─── 5. HERO SPOTLIGHT ────────────────────────
function initSpotlight() {
  if (typeof gsap === 'undefined') return;
  const orb = document.querySelector('.hero-spotlight-orb');
  if (!orb) return;

  // Start orb at viewport center
  gsap.set(orb, { x: window.innerWidth / 2, y: window.innerHeight / 2 });

  document.addEventListener('mousemove', (e) => {
    gsap.to(orb, {
      x: e.clientX, y: e.clientY,
      duration: 1.0, ease: 'power2.out',
      overwrite: 'auto',
    });
  });
}

// ─── 6. NAVBAR SCROLL ────────────────────────
function initNavbar(lenis) {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handler = () => {
    const s = window.scrollY;
    navbar.classList.toggle('scrolled', s > 80);
  };

  if (lenis) {
    lenis.on('scroll', ({ scroll }) => {
      navbar.classList.toggle('scrolled', scroll > 80);
    });
  } else {
    window.addEventListener('scroll', handler, { passive: true });
  }
}

// ─── 7. ACTIVE NAV ───────────────────────────
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    if (
      path.endsWith(href) ||
      (href === 'index.html' && (path.endsWith('/') || path === '/'))
    ) {
      link.classList.add('active');
    }
  });
}

// ─── 8. CURSOR HOVER TARGETS ─────────────────
function initCursorTargets() {
  document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.querySelectorAll('.project-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-project'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-project'));
  });
}

// ─── 9. PROJECT IMAGE PREVIEW ─────────────────
function initProjectPreviews() {
  if (typeof gsap === 'undefined') return;

  // Home page compact cards only — projects page uses projects.js global preview
  document.querySelectorAll('.project-card[data-preview]').forEach(card => {
    const preview = card.querySelector('.project-preview-img');
    if (!preview) return;

    gsap.set(preview, { x: 0, y: 0, opacity: 0, scale: 0.88 });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = Math.max(0, Math.min(
        e.clientX - rect.left  - preview.offsetWidth  / 2,
        rect.width  - preview.offsetWidth
      ));
      const y = Math.max(0, Math.min(
        e.clientY - rect.top   - preview.offsetHeight / 2,
        rect.height - preview.offsetHeight
      ));
      gsap.to(preview, { x, y, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    });

    card.addEventListener('mouseenter', () => {
      gsap.to(preview, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(preview, { opacity: 0, scale: 0.88, duration: 0.25, ease: 'power2.in' });
    });
  });
}

// ─── INIT ALL ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const lenis = initLenis();

  initHeroAnimation();
  initScrollAnimations();
  initMagnetic();
  initSpotlight();
  initNavbar(lenis);
  setActiveNav();
  initProjectPreviews();

  setTimeout(initCursorTargets, 120);
});
