# Project Screenshot Images — Phase 5

Drop your screenshots here with these exact filenames:

  mailforge.jpg    → MailForge screenshot
  recallio.jpg     → Recallio screenshot
  exohabitai.jpg   → ExoHabitAI screenshot
  snip.jpg         → Snip screenshot
  orbit.jpg        → Orbit screenshot

Recommended size: 1200×750px (16:9 ratio) or 800×500px minimum
Format: JPG or WebP (WebP preferred for performance)

After adding screenshots, update each project-card in index.html:
  BEFORE: <a href="..." class="project-card">
  AFTER:  <a href="..." class="project-card" data-preview="true">

Then add this inside the card (before closing </a>):
  <img class="project-preview-img" src="assets/images/projects/mailforge.jpg" alt="MailForge preview">

The hover preview system is already wired up in main.js (initProjectPreviews).
