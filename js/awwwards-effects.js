/* ═══════════════════════════════════════════════════════════════════════════
   AWWWARDS EDITION EFFECTS
   Glitch, Cinematic Loader, Cursor Trail, Magnetic Enhanced,
   Page Transitions, 3D Cards, Noise Canvas
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  var isMobile = 'ontouchstart' in window;
  var isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    initCinematicLoader();
    if (!isMobile && !isReduced) {
      initGlitchEffect();
      initCursorTrail();
      initMagneticEnhanced();
      initProjectCards3D();
      initNoiseCanvas();
    }
    initPageTransitionSweep();
  }

  /* ═══════════════════════════════════════════════════════════════════════
     CINEMATIC LOADER
     ═══════════════════════════════════════════════════════════════════════ */
  function initCinematicLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;

    // Upgrade the loader HTML
    var content = loader.querySelector('.loader__content');
    if (!content) return;

    content.innerHTML = [
      '<div class="loader__cinematic">',
      '  <div class="loader__logo-wrap">',
      '    <div class="loader__logo">{A}</div>',
      '    <div class="loader__logo-ring"></div>',
      '  </div>',
      '  <div class="loader__typing-line" id="loaderTyping">',
      '    <span id="loaderTypingText"></span>',
      '    <span class="loader__typing-cursor"></span>',
      '  </div>',
      '  <div class="loader__progress-enhanced">',
      '    <div class="loader__progress-fill" id="loaderFill"></div>',
      '  </div>',
      '  <div class="loader__percent" id="loaderPercent">0%</div>',
      '</div>'
    ].join('');

    var fill = document.getElementById('loaderFill');
    var typingEl = document.getElementById('loaderTypingText');
    var percentEl = document.getElementById('loaderPercent');

    // Type out text
    var sequence = [
      { text: 'INITIALIZING...', duration: 400 },
      { text: 'LOADING ASSETS...', duration: 500 },
      { text: 'PAZENT.FR', duration: 600 }
    ];

    var progress = 0;
    var startTime = performance.now();
    var totalDuration = 2200;

    // Progress animation
    function updateProgress() {
      var elapsed = performance.now() - startTime;
      progress = Math.min(100, (elapsed / totalDuration) * 100);
      if (fill) fill.style.width = progress + '%';
      if (percentEl) percentEl.textContent = Math.round(progress) + '%';
      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      }
    }
    requestAnimationFrame(updateProgress);

    // Type sequence
    var seqIdx = 0;
    function typeNext() {
      if (seqIdx >= sequence.length) return;
      var item = sequence[seqIdx++];
      typeText(typingEl, item.text, 60, function() {
        setTimeout(typeNext, item.duration);
      });
    }
    typeNext();

    // Exit
    setTimeout(function() {
      if (fill) fill.style.width = '100%';
      setTimeout(function() {
        loader.classList.add('exit');
        loader.addEventListener('animationend', function() {
          loader.classList.add('hidden');
        }, { once: true });
        // Fallback
        setTimeout(function() { loader.classList.add('hidden'); }, 1000);
      }, 200);
    }, totalDuration);
  }

  function typeText(el, text, speed, cb) {
    if (!el) { if (cb) cb(); return; }
    el.textContent = '';
    var i = 0;
    function step() {
      if (i <= text.length) {
        el.textContent = text.substring(0, i);
        i++;
        setTimeout(step, speed);
      } else if (cb) {
        cb();
      }
    }
    step();
  }

  /* ═══════════════════════════════════════════════════════════════════════
     GLITCH EFFECT on "Alessandro"
     ═══════════════════════════════════════════════════════════════════════ */
  function initGlitchEffect() {
    var nameEl = document.querySelector('.hero__title-name');
    if (!nameEl) return;

    // Store original text for data-text attr (CSS pseudo elements use it)
    function setDataText() {
      nameEl.setAttribute('data-text', nameEl.textContent.trim());
    }

    // Set it once name is revealed (chars appear via animation)
    setTimeout(setDataText, 2000);

    // Glitch chars used for scramble
    var glitchChars = '▓▒░█▄▀■□◘◙●◦@#$%&*!?/\\|';

    function triggerGlitch() {
      if (isReduced) return;
      nameEl.setAttribute('data-text', nameEl.textContent.trim());
      nameEl.classList.add('glitching');

      // Random char scramble on visible chars
      var spans = nameEl.querySelectorAll('.char');
      if (spans.length) {
        var iterations = 0;
        var maxIterations = 6;
        var original = Array.from(spans).map(function(s) { return s.textContent; });

        var interval = setInterval(function() {
          spans.forEach(function(span, i) {
            if (i < iterations * (spans.length / maxIterations)) {
              span.textContent = original[i];
            } else {
              span.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
          });
          iterations++;
          if (iterations > maxIterations) {
            clearInterval(interval);
            spans.forEach(function(span, i) { span.textContent = original[i]; });
          }
        }, 40);
      }

      setTimeout(function() {
        nameEl.classList.remove('glitching');
      }, 350);
    }

    // Auto-glitch every 5-7 seconds
    function scheduleAutoGlitch() {
      var delay = 5000 + Math.random() * 2000;
      setTimeout(function() {
        triggerGlitch();
        scheduleAutoGlitch();
      }, delay);
    }
    setTimeout(scheduleAutoGlitch, 3000); // First one after 3s

    // Hover glitch
    nameEl.addEventListener('mouseenter', triggerGlitch);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     CURSOR TRAIL
     ═══════════════════════════════════════════════════════════════════════ */
  function initCursorTrail() {
    var TRAIL_COUNT = 8;
    var trail = [];
    var positions = [];

    for (var i = 0; i < TRAIL_COUNT; i++) {
      var dot = document.createElement('div');
      dot.className = 'cursor-trail';
      dot.style.opacity = (1 - i / TRAIL_COUNT) * 0.6 + '';
      dot.style.width = (6 - i * 0.4) + 'px';
      dot.style.height = (6 - i * 0.4) + 'px';
      dot.style.zIndex = (99998 - i) + '';
      document.body.appendChild(dot);
      trail.push(dot);
      positions.push({ x: -100, y: -100 });
    }

    var mouse = { x: -100, y: -100 };

    window.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    var rafId = null;
    function animateTrail() {
      // Update trail positions with lag
      positions[0].x += (mouse.x - positions[0].x) * 0.5;
      positions[0].y += (mouse.y - positions[0].y) * 0.5;

      for (var i = 1; i < TRAIL_COUNT; i++) {
        positions[i].x += (positions[i - 1].x - positions[i].x) * (0.4 - i * 0.03);
        positions[i].y += (positions[i - 1].y - positions[i].y) * (0.4 - i * 0.03);
      }

      for (var j = 0; j < TRAIL_COUNT; j++) {
        trail[j].style.left = positions[j].x + 'px';
        trail[j].style.top  = positions[j].y + 'px';
      }

      rafId = requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Hide on cursor leave
    document.addEventListener('mouseleave', function() {
      trail.forEach(function(t) { t.style.opacity = '0'; });
    });
    document.addEventListener('mouseenter', function() {
      trail.forEach(function(t, i) {
        t.style.opacity = ((1 - i / TRAIL_COUNT) * 0.6) + '';
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     MAGNETIC EFFECT ENHANCED (0.4 strength + rotation)
     ═══════════════════════════════════════════════════════════════════════ */
  function initMagneticEnhanced() {
    // Override the existing magnetic buttons
    var selectors = '.magnetic, .navbar__link, .btn, .footer__social-link';
    var magnetics = document.querySelectorAll(selectors);

    magnetics.forEach(function(el) {
      var rafId = 0;
      var currentX = 0, currentY = 0, currentRot = 0;

      el.addEventListener('mousemove', function(e) {
        if (rafId) return;
        rafId = requestAnimationFrame(function() {
          var rect = el.getBoundingClientRect();
          var cx = rect.left + rect.width / 2;
          var cy = rect.top  + rect.height / 2;
          var dx = e.clientX - cx;
          var dy = e.clientY - cy;

          var strength = el.classList.contains('btn') ? 0.4 : 0.25;
          var targetX = dx * strength;
          var targetY = dy * strength;
          var targetRot = (dx / rect.width) * 8; // up to 8deg rotation

          currentX += (targetX - currentX) * 0.3;
          currentY += (targetY - currentY) * 0.3;
          currentRot += (targetRot - currentRot) * 0.3;

          el.style.transform = [
            'translate(' + currentX.toFixed(2) + 'px, ' + currentY.toFixed(2) + 'px)',
            'rotate(' + currentRot.toFixed(2) + 'deg)'
          ].join(' ');
          el.style.transition = 'none';
          rafId = 0;
        });
      });

      el.addEventListener('mouseleave', function() {
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        currentX = 0; currentY = 0; currentRot = 0;
        el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        el.style.transform = 'translate(0,0) rotate(0deg)';
        setTimeout(function() { el.style.transition = ''; }, 500);
      });
    });

    // Cursor state on project cards
    var projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(function(card) {
      card.addEventListener('mouseenter', function() {
        document.body.classList.add('cursor-view');
      });
      card.addEventListener('mouseleave', function() {
        document.body.classList.remove('cursor-view');
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE TRANSITION SWEEP (purple left-to-right)
     ═══════════════════════════════════════════════════════════════════════ */
  function initPageTransitionSweep() {
    // Create sweep overlay
    var sweep = document.createElement('div');
    sweep.className = 'page-transition__sweep';
    sweep.id = 'pageSweep';
    document.body.appendChild(sweep);

    // Intercept internal links
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href) return;

      // Only internal pages, not anchors or external
      if (href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('http') || link.target === '_blank') return;

      e.preventDefault();
      sweep.classList.add('active');
      setTimeout(function() {
        window.location.href = href;
      }, 500);
    });

    // Entry animation on page load
    sweep.classList.add('exit');
    setTimeout(function() {
      sweep.classList.remove('exit');
    }, 600);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     PROJECT CARDS 3D TILT + LIGHT REFLECTION + GLOW BORDER
     ═══════════════════════════════════════════════════════════════════════ */
  function initProjectCards3D() {
    var cards = document.querySelectorAll('.project-card');
    cards.forEach(function(card) {
      // Add light element
      var light = document.createElement('div');
      light.className = 'project-card__light';
      card.appendChild(light);

      var rafId = 0;

      card.addEventListener('mousemove', function(e) {
        if (rafId) return;
        rafId = requestAnimationFrame(function() {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          var cx = rect.width / 2;
          var cy = rect.height / 2;

          // Tilt
          var rotX = ((y - cy) / cy) * -8; // max 8deg
          var rotY = ((x - cx) / cx) *  8;

          // Light position
          var lx = (x / rect.width) * 100;
          var ly = (y / rect.height) * 100;

          // Glow border position
          var mx = lx;
          var my = ly;

          card.style.transform = [
            'perspective(1000px)',
            'rotateX(' + rotX.toFixed(2) + 'deg)',
            'rotateY(' + rotY.toFixed(2) + 'deg)',
            'translateY(-6px)',
            'scale(1.02)'
          ].join(' ');
          card.style.transition = 'none';
          card.style.setProperty('--lx', lx + '%');
          card.style.setProperty('--ly', ly + '%');
          card.style.setProperty('--mx', mx + '%');
          card.style.setProperty('--my', my + '%');

          rafId = 0;
        });
      });

      card.addEventListener('mouseleave', function() {
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        card.style.transform = '';
        setTimeout(function() { card.style.transition = ''; }, 600);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     ANIMATED NOISE CANVAS (subtle background texture)
     ═══════════════════════════════════════════════════════════════════════ */
  function initNoiseCanvas() {
    var canvas = document.createElement('canvas');
    canvas.id = 'noiseCanvas';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var W = 200, H = 200;
    canvas.width = W;
    canvas.height = H;

    var imageData = ctx.createImageData(W, H);
    var data = imageData.data;
    var frame = 0;

    function generateNoise() {
      frame++;
      // Simple pseudo-noise (shift seed per frame)
      var seed = frame * 1664525 + 1013904223;
      for (var i = 0; i < data.length; i += 4) {
        seed = (seed * 1664525 + 1013904223) & 0xffffffff;
        var v = (seed >> 16) & 0xff;
        data[i]     = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(generateNoise);
    }
    generateNoise();
  }

})();
