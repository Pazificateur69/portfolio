/**
 * Preloader cinématique — pazent.fr
 * Progress bar 0→100 en 1.8s, puis split reveal
 */
(function () {
  'use strict';

  // ── CSS injection ────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '#preloader {',
    '  position: fixed;',
    '  inset: 0;',
    '  z-index: 99999;',
    '  display: flex;',
    '  flex-direction: column;',
    '  align-items: center;',
    '  justify-content: center;',
    '  pointer-events: all;',
    '  overflow: hidden;',
    '}',

    '#preloader .pre-half {',
    '  position: absolute;',
    '  left: 0;',
    '  width: 100%;',
    '  height: 50%;',
    '  background: #0a0a0a;',
    '  transition: transform 0.6s cubic-bezier(0.77,0,0.18,1);',
    '  z-index: 0;',
    '}',

    '#preloader .pre-half--top { top: 0; }',
    '#preloader .pre-half--bottom { bottom: 0; }',

    '#preloader.split .pre-half--top  { transform: translateY(-100%); }',
    '#preloader.split .pre-half--bottom { transform: translateY(100%); }',

    '#preloader .pre-content {',
    '  position: relative;',
    '  z-index: 1;',
    '  display: flex;',
    '  flex-direction: column;',
    '  align-items: center;',
    '  gap: 28px;',
    '}',

    '@keyframes preLogoGlow {',
    '  0%,100% { text-shadow: 0 0 8px rgba(110,0,255,0.4), 0 0 24px rgba(110,0,255,0.2); opacity: 1; }',
    '  50%      { text-shadow: 0 0 24px rgba(110,0,255,0.9), 0 0 60px rgba(0,212,255,0.5); opacity: 0.85; }',
    '}',

    '.pre-logo {',
    '  font-family: "Space Grotesk", "Inter", sans-serif;',
    '  font-size: clamp(2rem, 6vw, 4rem);',
    '  font-weight: 700;',
    '  letter-spacing: 0.15em;',
    '  color: #fff;',
    '  animation: preLogoGlow 1.4s ease-in-out infinite;',
    '}',

    '.pre-logo span {',
    '  color: #6e00ff;',
    '}',

    '.pre-bar {',
    '  width: min(320px, 60vw);',
    '  height: 3px;',
    '  background: rgba(255,255,255,0.1);',
    '  border-radius: 99px;',
    '  overflow: hidden;',
    '}',

    '.pre-bar__fill {',
    '  height: 100%;',
    '  width: 0%;',
    '  background: linear-gradient(90deg, #6e00ff, #00d4ff);',
    '  border-radius: 99px;',
    '  transition: width 0.05s linear;',
    '  box-shadow: 0 0 12px rgba(110,0,255,0.7);',
    '}',

    '.pre-progress {',
    '  font-family: "Space Mono", monospace;',
    '  font-size: 0.75rem;',
    '  letter-spacing: 0.2em;',
    '  color: rgba(255,255,255,0.45);',
    '}',

    '#preloader.done {',
    '  pointer-events: none;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // ── HTML injection ───────────────────────────────────────────────────────────
  function buildPreloader() {
    var el = document.createElement('div');
    el.id = 'preloader';
    el.innerHTML = [
      '<div class="pre-half pre-half--top"></div>',
      '<div class="pre-half pre-half--bottom"></div>',
      '<div class="pre-content">',
      '  <div class="pre-logo">PAZENT<span>.FR</span></div>',
      '  <div class="pre-bar"><div class="pre-bar__fill"></div></div>',
      '  <div class="pre-progress">0%</div>',
      '</div>',
    ].join('');
    document.body.insertBefore(el, document.body.firstChild);
    return el;
  }

  // ── Animation ────────────────────────────────────────────────────────────────
  var DURATION = 1800; // ms

  function runPreloader() {
    var preloader = buildPreloader();
    var fill      = preloader.querySelector('.pre-bar__fill');
    var progress  = preloader.querySelector('.pre-progress');

    var start = null;

    function tick(ts) {
      if (!start) start = ts;
      var elapsed = ts - start;
      var pct = Math.min(100, Math.round((elapsed / DURATION) * 100));

      fill.style.width = pct + '%';
      progress.textContent = pct + '%';

      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        // Trigger split reveal
        setTimeout(function () {
          preloader.classList.add('split');
          preloader.classList.add('done');
          setTimeout(function () {
            preloader.style.display = 'none';
          }, 700);
        }, 150);
      }
    }

    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPreloader);
  } else {
    runPreloader();
  }
})();
