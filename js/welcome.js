/* ============================================
   WELCOME ANIMATION
   On index.html  → play intro, stay on page
   On other pages → play intro, then go home
   ============================================ */

class WelcomeAnimation {
  constructor() {
    this.overlay  = document.getElementById('welcome-overlay');
    this.trigger  = document.getElementById('nav-brand-trigger');
    this.isAnimating = false;

    // Detect if we're already on the home page
    const path = window.location.pathname;
    this.isHome = path.endsWith('index.html') ||
                  path.endsWith('/') ||
                  path === '';

    if (this.trigger && this.overlay) {
      this.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.play();
      });
    }
  }

  play() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Show overlay instantly
    this.overlay.classList.add('active');

    // Stagger character reveal
    const chars = this.overlay.querySelectorAll('.welcome-name .char');
    chars.forEach((char, i) => {
      setTimeout(() => char.classList.add('visible'), 80 + i * 50);
    });

    // Tagline + line animation
    setTimeout(() => this.overlay.classList.add('animating'), 300);

    // After animation peak — fade out
    setTimeout(() => {
      this.overlay.style.transition = 'opacity 0.6s ease';
      this.overlay.style.opacity = '0';

      setTimeout(() => {
        if (this.isHome) {
          // On home page: just reset the overlay, stay put
          this.overlay.classList.remove('active', 'animating');
          this.overlay.style.opacity = '';
          this.overlay.style.transition = '';
          chars.forEach(c => c.classList.remove('visible'));
          this.isAnimating = false;
        } else {
          // On any other page: navigate to home after animation
          window.location.href = 'index.html';
        }
      }, 600);
    }, 2800);
  }
}

document.addEventListener('DOMContentLoaded', () => new WelcomeAnimation());
