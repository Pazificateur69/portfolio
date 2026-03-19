/**
 * Cursor Trail — 10 lagging dots, hover fusion
 * Mobile: disabled
 */
(function () {
  'use strict';

  // No touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  var DOT_COUNT  = 10;
  var BASE_COLOR = '110, 0, 255';

  // ── CSS ──────────────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '.cursor-dot {',
    '  position: fixed;',
    '  top: 0; left: 0;',
    '  border-radius: 50%;',
    '  pointer-events: none;',
    '  z-index: 999998;',
    '  will-change: transform, width, height, opacity;',
    '  transition: width 0.25s ease, height 0.25s ease, background 0.25s ease, opacity 0.25s ease;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // ── Dots ─────────────────────────────────────────────────────────────────────
  var dots = [];
  var positions = [];

  for (var i = 0; i < DOT_COUNT; i++) {
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var fraction = 1 - i / DOT_COUNT; // 1 → near front, ~0.1 → tail
    var size = Math.round(8 * fraction) + 2; // 10px → 2px
    var alpha = (fraction * 0.6).toFixed(2);
    dot.style.width  = size + 'px';
    dot.style.height = size + 'px';
    dot.style.background = 'rgba(' + BASE_COLOR + ', ' + alpha + ')';
    dot.style.marginLeft = -(size / 2) + 'px';
    dot.style.marginTop  = -(size / 2) + 'px';
    document.body.appendChild(dot);
    dots.push(dot);
    positions.push({ x: -100, y: -100 });
  }

  var mouse = { x: -100, y: -100 };
  var isHover = false;

  // ── Mouse events ──────────────────────────────────────────────────────────────
  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseover', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'A' || t.tagName === 'BUTTON' || t.closest('a') || t.closest('button'))) {
      isHover = true;
      dots.forEach(function (dot) {
        dot.style.width  = '40px';
        dot.style.height = '40px';
        dot.style.marginLeft = '-20px';
        dot.style.marginTop  = '-20px';
        dot.style.background = 'rgba(' + BASE_COLOR + ', 0.15)';
        dot.style.border = '1.5px solid rgba(' + BASE_COLOR + ', 0.5)';
      });
    }
  });

  document.addEventListener('mouseout', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'A' || t.tagName === 'BUTTON' || t.closest('a') || t.closest('button'))) {
      isHover = false;
      dots.forEach(function (dot, i) {
        var fraction = 1 - i / DOT_COUNT;
        var size  = Math.round(8 * fraction) + 2;
        var alpha = (fraction * 0.6).toFixed(2);
        dot.style.width  = size + 'px';
        dot.style.height = size + 'px';
        dot.style.marginLeft = -(size / 2) + 'px';
        dot.style.marginTop  = -(size / 2) + 'px';
        dot.style.background = 'rgba(' + BASE_COLOR + ', ' + alpha + ')';
        dot.style.border = 'none';
      });
    }
  });

  // ── RAF loop ─────────────────────────────────────────────────────────────────
  var LERP_BASE = 0.35; // lead dot speed

  function lerp(a, b, t) { return a + (b - a) * t; }

  function loop() {
    // Lead dot follows mouse directly
    positions[0].x = lerp(positions[0].x, mouse.x, LERP_BASE);
    positions[0].y = lerp(positions[0].y, mouse.y, LERP_BASE);

    // Each subsequent dot follows the previous one, slower
    for (var i = 1; i < DOT_COUNT; i++) {
      var speed = LERP_BASE * Math.pow(0.82, i);
      positions[i].x = lerp(positions[i].x, positions[i - 1].x, speed);
      positions[i].y = lerp(positions[i].y, positions[i - 1].y, speed);
    }

    // Apply
    for (var j = 0; j < DOT_COUNT; j++) {
      dots[j].style.transform = 'translate(' + positions[j].x + 'px, ' + positions[j].y + 'px)';
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
