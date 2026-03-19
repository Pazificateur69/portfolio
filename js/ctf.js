/* ═══════════════════════════════════════════════════════════════════════════
   CTF.JS — Tilt selectors + category filter
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var currentFilter = 'all';

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('ctfGrid');
    var filters = document.querySelectorAll('.ctf-filter');
    var cards = grid ? grid.querySelectorAll('.ctf-card') : [];

    /* ─── Filter logic ─── */
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        /* Update active state */
        filters.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');

        /* Show/hide cards */
        cards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          if (currentFilter === 'all' || category === currentFilter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });

    /* ─── Tilt selectors ─── */
    window.__tiltSelectors = window.__tiltSelectors || [];
    window.__tiltSelectors.push('.ctf-card');
  });
})();
