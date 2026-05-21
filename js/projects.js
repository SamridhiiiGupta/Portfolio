/* ============================================
   PROJECTS PAGE JS
   Mouse-follow image preview on project cards
   ============================================ */

class ProjectImageFollow {
  constructor() {
    this.preview = document.getElementById('project-preview');
    this.previewImg = this.preview ? this.preview.querySelector('img') : null;
    this.cards = document.querySelectorAll('.project-full-card[data-image]');
    this.mouse = { x: 0, y: 0 };
    this.pos = { x: 0, y: 0 };
    this.isVisible = false;

    if (this.preview && this.cards.length) {
      this.init();
    }
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const imgSrc = card.getAttribute('data-image');
        if (imgSrc && this.previewImg) {
          this.previewImg.src = imgSrc;
          this.isVisible = true;
          this.preview.classList.add('visible');
        }
      });

      card.addEventListener('mouseleave', () => {
        this.isVisible = false;
        this.preview.classList.remove('visible');
      });
    });

    this.animate();
  }

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  animate() {
    this.pos.x = this.lerp(this.pos.x, this.mouse.x + 20, 0.12);
    this.pos.y = this.lerp(this.pos.y, this.mouse.y - 110, 0.12);

    if (this.preview) {
      this.preview.style.left = `${this.pos.x}px`;
      this.preview.style.top = `${this.pos.y}px`;
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => new ProjectImageFollow());
