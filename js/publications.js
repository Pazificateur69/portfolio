/* ═══════════════════════════════════════════════════════════════════════════
   PUBLICATIONS PAGE SCRIPTS
   Card tilt + title hover effect (cards now link to blog articles)
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  window.__tiltSelectors = ['.pub-card'];
  initTitleHover();
});

/* ═══════════════════════════════════════════════════════════════════════════
   TITLE HOVER - Text scramble effect on article titles
   ═══════════════════════════════════════════════════════════════════════════ */
function initTitleHover() {
  var chars = '!<>-_\\/[]{}=+*^?#@';

  document.querySelectorAll('.pub-card__title').forEach(function(title) {
    var original = title.textContent;
    var animating = false;

    var parent = title.closest('.pub-card');
    if (!parent) return;

    parent.addEventListener('mouseenter', function() {
      if (animating) return;
      animating = true;
      var iteration = 0;

      var interval = setInterval(function() {
        title.textContent = original.split('').map(function(char, i) {
          if (i < iteration) return original[i];
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');

        iteration += 0.5;
        if (iteration >= original.length) {
          title.textContent = original;
          clearInterval(interval);
          animating = false;
        }
      }, 30);
    });
  });
}
