/* ============================================
   CUSTOM CURSOR — Works on every page
   Dot (snap) + outline (lerp) + VIEW label
   Glow via CSS box-shadow, no GSAP dependency
   ============================================ */

(function () {
  // Only on real pointer devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // ── Create elements ──────────────────────
  function el(cls) {
    const d = document.createElement('div');
    d.className = cls;
    document.body.appendChild(d);
    return d;
  }

  const dot     = el('cursor-dot');
  const outline = el('cursor-outline');
  const label   = el('cursor-label');
  label.textContent = 'VIEW →';

  // ── State ────────────────────────────────
  const mouse = { x: -300, y: -300 };
  const pos   = { x: -300, y: -300 };
  let visible = false;

  // ── Position helpers ─────────────────────
  function setPos(el, x, y) {
    el.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
  }

  // ── Mouse events ─────────────────────────
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Dot snaps instantly
    setPos(dot, e.clientX, e.clientY);

    if (!visible) {
      visible = true;
      dot.style.opacity     = '1';
      outline.style.opacity = '0.7';
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity     = '0';
    outline.style.opacity = '0';
    label.style.opacity   = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (visible) {
      dot.style.opacity     = '1';
      outline.style.opacity = '0.7';
    }
  });

  // ── Hover states — link/button ───────────
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button');
    if (target) {
      dot.style.transform     += ' scale(1.5)';
      outline.style.transform  = outline.style.transform.replace(/\s*scale\([^)]+\)/, '') + ' scale(1.6)';
      outline.style.opacity   = '0.25';
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button');
    if (target) {
      outline.style.opacity = '0.7';
    }
  });

  // ── Project card hover → VIEW label ──────
  function bindProjectCards() {
    document.querySelectorAll('.project-card, .project-full-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        dot.style.opacity     = '0';
        label.style.opacity   = '1';
        label.style.transform = `translate(calc(${pos.x}px - 50%), calc(${pos.y}px - 50%)) scale(1)`;
        outline.style.transform = outline.style.transform.replace(/\s*scale\([^)]+\)/, '') + ' scale(3.2)';
        outline.style.opacity = '0.12';
      });
      card.addEventListener('mouseleave', () => {
        dot.style.opacity     = '1';
        label.style.opacity   = '0';
        outline.style.opacity = '0.7';
      });
    });
  }

  // ── Magnetic elements ─────────────────────
  function bindMagnetic() {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const strength = parseFloat(el.dataset.magnetic) || 0.28;
      el.addEventListener('mousemove', (e) => {
        const r  = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) * strength;
        const dy = (e.clientY - (r.top  + r.height / 2)) * strength;
        if (window.gsap) {
          gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: 'power2.out' });
        }
      });
      el.addEventListener('mouseleave', () => {
        if (window.gsap) {
          gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
        }
      });
    });
  }

  // ── RAF loop — outline lerps toward mouse ─
  function loop() {
    pos.x += (mouse.x - pos.x) * 0.12;
    pos.y += (mouse.y - pos.y) * 0.12;
    setPos(outline, pos.x, pos.y);
    setPos(label,   pos.x, pos.y);
    requestAnimationFrame(loop);
  }

  // ── Init ─────────────────────────────────
  // Start invisible — appear on first mousemove
  dot.style.opacity     = '0';
  outline.style.opacity = '0';
  label.style.opacity   = '0';

  loop();

  document.addEventListener('DOMContentLoaded', () => {
    bindProjectCards();
    bindMagnetic();
  });

  // Also bind after a delay in case cards load late
  setTimeout(bindProjectCards, 500);

})();
