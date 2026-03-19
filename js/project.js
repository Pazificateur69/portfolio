/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT DETAIL PAGE SCRIPTS
   Enhanced with scroll progress, card tilt, and more interactions
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  window.__tiltSelectors = ['.stack-card', '.feature-item', '.process-step', '.project-nav__link'];
  initFeatureHover();
});

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURE ITEM HOVER - text scramble on title
   ═══════════════════════════════════════════════════════════════════════════ */
function initFeatureHover() {
  const chars = '!<>-_\\/[]{}—=+*^?#';

  document.querySelectorAll('.feature-item__title').forEach(title => {
    const original = title.textContent;
    let animating = false;

    title.closest('.feature-item').addEventListener('mouseenter', () => {
      if (animating) return;
      animating = true;
      let iteration = 0;

      const interval = setInterval(() => {
        title.textContent = original.split('')
          .map((char, i) => {
            if (i < iteration) return original[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        iteration += 1 / 2;
        if (iteration >= original.length) {
          title.textContent = original;
          clearInterval(interval);
          animating = false;
        }
      }, 30);
    });
  });
}
