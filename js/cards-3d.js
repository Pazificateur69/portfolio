/**
 * Cards 3D Tilt — .project-card
 * rotateX/Y ±15deg + light reflection overlay
 * Mobile: disabled
 */
(function () {
  'use strict';

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  var MAX_TILT = 15; // degrees
  var PERSPECTIVE = 1000;

  // ── CSS ──────────────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '.project-card {',
    '  transform-style: preserve-3d;',
    '  transition: transform 0.08s ease-out, box-shadow 0.08s ease-out;',
    '  will-change: transform;',
    '}',
    '.project-card .card-shine {',
    '  position: absolute;',
    '  inset: 0;',
    '  border-radius: inherit;',
    '  pointer-events: none;',
    '  z-index: 10;',
    '  opacity: 0;',
    '  transition: opacity 0.15s ease;',
    '  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, transparent 65%);',
    '}',
    '.project-card:hover .card-shine {',
    '  opacity: 1;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // ── Init ─────────────────────────────────────────────────────────────────────
  function initCards() {
    var cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      // Ensure relative positioning for the shine
      var pos = getComputedStyle(card).position;
      if (pos === 'static') card.style.position = 'relative';

      // Inject shine overlay
      var shine = document.createElement('div');
      shine.className = 'card-shine';
      card.appendChild(shine);

      // Wrap in perspective container
      card.style.perspective = PERSPECTIVE + 'px';

      card.addEventListener('mousemove', function (e) {
        var rect   = card.getBoundingClientRect();
        var cx     = rect.left + rect.width  / 2;
        var cy     = rect.top  + rect.height / 2;
        var dx     = (e.clientX - cx) / (rect.width  / 2); // -1 → +1
        var dy     = (e.clientY - cy) / (rect.height / 2); // -1 → +1

        var rotX = -dy * MAX_TILT;
        var rotY =  dx * MAX_TILT;

        card.style.transform = [
          'perspective(' + PERSPECTIVE + 'px)',
          'rotateX(' + rotX + 'deg)',
          'rotateY(' + rotY + 'deg)',
          'scale3d(1.03, 1.03, 1.03)',
        ].join(' ');

        card.style.boxShadow = [
          '0 ' + (20 + dy * 10) + 'px ' + (40 + Math.abs(dy) * 20) + 'px rgba(110,0,255,0.25)',
          '0 ' + (8  + dy *  4) + 'px ' + (16 + Math.abs(dy) * 8)  + 'px rgba(0,0,0,0.4)',
        ].join(', ');

        // Shine follows mouse
        var shineX = ((e.clientX - rect.left) / rect.width)  * 100;
        var shineY = ((e.clientY - rect.top)  / rect.height) * 100;
        shine.style.background = [
          'radial-gradient(',
          'circle at ' + shineX + '% ' + shineY + '%,',
          'rgba(255,255,255,0.2) 0%,',
          'transparent 65%)',
        ].join(' ');
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform  = 'perspective(' + PERSPECTIVE + 'px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        card.style.boxShadow  = '';
        card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';

        setTimeout(function () {
          card.style.transition = 'transform 0.08s ease-out, box-shadow 0.08s ease-out';
        }, 500);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCards);
  } else {
    initCards();
  }
})();
