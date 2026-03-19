/**
 * Page Transition — gradient overlay slide in/out on navigation
 */
(function () {
  'use strict';

  var DURATION = 400; // ms

  // ── CSS ──────────────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '#page-transition-overlay {',
    '  position: fixed;',
    '  inset: 0;',
    '  z-index: 999997;',
    '  pointer-events: none;',
    '  background: linear-gradient(135deg, #6e00ff, #00d4ff);',
    '  transform: translateX(-100%);',
    '  transition: transform ' + DURATION + 'ms cubic-bezier(0.77,0,0.18,1);',
    '}',

    '#page-transition-overlay.slide-in {',
    '  transform: translateX(0%);',
    '}',

    '#page-transition-overlay.slide-out {',
    '  transform: translateX(100%);',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // ── Overlay ───────────────────────────────────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = 'page-transition-overlay';
  document.body.appendChild(overlay);

  function slideIn(cb) {
    overlay.style.transition = 'transform ' + DURATION + 'ms cubic-bezier(0.77,0,0.18,1)';
    overlay.classList.remove('slide-out');
    // Force reflow
    void overlay.offsetHeight;
    overlay.classList.add('slide-in');
    setTimeout(cb, DURATION);
  }

  function slideOut() {
    overlay.classList.remove('slide-in');
    overlay.classList.add('slide-out');
    setTimeout(function () {
      overlay.classList.remove('slide-out');
      overlay.style.transform = 'translateX(-100%)';
    }, DURATION);
  }

  // ── Link interception ─────────────────────────────────────────────────────────
  function isSameSite(href) {
    try {
      var url = new URL(href, window.location.href);
      return url.origin === window.location.origin;
    } catch (e) {
      return true; // relative URL
    }
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    // Skip anchors, mailto, tel, javascript
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('tel:') || href.startsWith('javascript:')) return;
    // Skip external links that open in new tab
    if (link.target === '_blank') return;

    e.preventDefault();
    slideIn(function () {
      window.location.href = href;
    });
  });

  // ── Slide out on page show (back/forward cache) ───────────────────────────────
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      slideOut();
    }
  });

  // Slide out on first load (after preloader, or directly)
  window.addEventListener('load', function () {
    slideOut();
  });
})();
