/* ===============================================================================
   STATS.JS — Tilt selectors, count-up animation, progress bar animation
   =============================================================================== */
(function () {
  'use strict';

  /* --- Register tilt selectors --- */
  window.__tiltSelectors = window.__tiltSelectors || [];
  window.__tiltSelectors.push('.stats-card', '.stats-check');

  /* --- Count-up animation using IntersectionObserver --- */
  function animateCountUp(el, target, duration) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';

    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);           /* ease-out cubic */
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('fr-FR');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('fr-FR');
      }
    }

    requestAnimationFrame(step);
  }

  /* --- Progress bar animation --- */
  function animateBar(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    var percent = el.getAttribute('data-percent') || 0;
    el.style.width = percent + '%';
  }

  /* --- IntersectionObserver setup --- */
  function initObservers() {
    /* Count-up observer */
    var countEls = document.querySelectorAll('[data-count]');
    if (countEls.length) {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var target = parseInt(entry.target.getAttribute('data-count'), 10);
            var duration = target > 1000 ? 2000 : 1200;
            animateCountUp(entry.target, target, duration);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      countEls.forEach(function (el) {
        countObserver.observe(el);
      });
    }

    /* Progress bar observer */
    var barEls = document.querySelectorAll('.stats-bar__fill');
    if (barEls.length) {
      var barObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateBar(entry.target);
            barObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      barEls.forEach(function (el) {
        barObserver.observe(el);
      });
    }
  }

  /* --- Init on DOM ready --- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObservers);
  } else {
    initObservers();
  }
})();
