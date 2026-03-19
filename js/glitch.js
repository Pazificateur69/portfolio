/**
 * Glitch Effect — .hero__title-name
 * Chromatic aberration + clip-path tear, auto every 6s + hover
 */
(function () {
  'use strict';

  // ── CSS injection ────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    /* Make the element a positioning context */
    '.hero__title-name {',
    '  position: relative;',
    '  display: inline-block;',
    '}',

    /* Shared pseudo styles */
    '.hero__title-name::before,',
    '.hero__title-name::after {',
    '  content: attr(data-text);',
    '  position: absolute;',
    '  inset: 0;',
    '  opacity: 0;',
    '  pointer-events: none;',
    '}',

    /* Red channel — left offset */
    '.hero__title-name::before {',
    '  color: #ff003c;',
    '  z-index: 1;',
    '}',

    /* Cyan channel — right offset */
    '.hero__title-name::after {',
    '  color: #00d4ff;',
    '  z-index: 2;',
    '}',

    /* Active glitch state */
    '@keyframes glitchBefore {',
    '  0%   { opacity: 0; }',
    '  10%  { opacity: 0.8; transform: translate(-4px, 1px) skewX(-3deg);',
    '          clip-path: polygon(0 15%, 100% 15%, 100% 35%, 0 35%); }',
    '  20%  { transform: translate(-6px, -2px) skewX(2deg);',
    '          clip-path: polygon(0 55%, 100% 55%, 100% 70%, 0 70%); }',
    '  30%  { transform: translate(-2px, 3px) skewX(-1deg);',
    '          clip-path: polygon(0 5%, 100% 5%, 100% 20%, 0 20%); }',
    '  60%  { transform: translate(-3px, 0px); opacity: 0.6; }',
    '  80%  { opacity: 0.4; }',
    '  100% { opacity: 0; transform: translate(0,0); clip-path: none; }',
    '}',

    '@keyframes glitchAfter {',
    '  0%   { opacity: 0; }',
    '  10%  { opacity: 0.8; transform: translate(4px, -1px) skewX(3deg);',
    '          clip-path: polygon(0 40%, 100% 40%, 100% 60%, 0 60%); }',
    '  20%  { transform: translate(6px, 2px) skewX(-2deg);',
    '          clip-path: polygon(0 70%, 100% 70%, 100% 90%, 0 90%); }',
    '  30%  { transform: translate(2px, -3px) skewX(1deg);',
    '          clip-path: polygon(0 25%, 100% 25%, 100% 45%, 0 45%); }',
    '  60%  { transform: translate(3px, 0px); opacity: 0.6; }',
    '  80%  { opacity: 0.4; }',
    '  100% { opacity: 0; transform: translate(0,0); clip-path: none; }',
    '}',

    '@keyframes glitchMain {',
    '  0%,100% { transform: none; }',
    '  10%     { transform: translate(-2px, 1px) skewX(-1deg); }',
    '  20%     { transform: translate(2px, -1px) skewX(1deg); }',
    '  30%     { transform: translate(-1px, 2px); }',
    '  40%     { transform: translate(1px, -2px); }',
    '  50%     { transform: none; }',
    '}',

    '.hero__title-name.glitch-active::before {',
    '  animation: glitchBefore 0.3s steps(1) forwards;',
    '}',

    '.hero__title-name.glitch-active::after {',
    '  animation: glitchAfter 0.3s steps(1) forwards;',
    '}',

    '.hero__title-name.glitch-active {',
    '  animation: glitchMain 0.3s steps(1) forwards;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // ── Init ─────────────────────────────────────────────────────────────────────
  function initGlitch() {
    var el = document.querySelector('.hero__title-name');
    if (!el) return;

    // Mirror text into data-text for pseudo-elements
    el.setAttribute('data-text', el.textContent);

    var glitchTimeout = null;

    function triggerGlitch() {
      if (glitchTimeout) return; // Already running
      el.classList.add('glitch-active');
      glitchTimeout = setTimeout(function () {
        el.classList.remove('glitch-active');
        glitchTimeout = null;
      }, 320);
    }

    // Auto-trigger every 6 seconds
    setInterval(triggerGlitch, 6000);

    // Hover trigger
    el.addEventListener('mouseenter', triggerGlitch);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlitch);
  } else {
    initGlitch();
  }
})();
