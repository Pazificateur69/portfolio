/* ═══════════════════════════════════════════════════════════════════════════
   ENGINEERING PHILOSOPHY PAGE SCRIPTS
   SVG animations, STRIDE table reveal, scroll reveal, code highlight
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  // Engineering-specific tilt selectors (consumed by globals.js initCardTilt)
  window.__tiltSelectors = [
    '.eng-principle-card',
    '.eng-docs-card',
    '.eng-system-card',
    '.eng-layer-card',
    '.eng-solid-item'
  ];

  // Page-specific initialisations
  initFeatureHover();
  initStatCountUp();
  initStrideTableReveal();
  initSVGDiagrams();
});

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURE HOVER - text scramble on title
   ═══════════════════════════════════════════════════════════════════════════ */
function initFeatureHover() {
  var chars = '!<>-_\\/[]{}—=+*^?#';

  document.querySelectorAll('.eng-principle-card h4, .eng-docs-card h4, .eng-system-card__header h4').forEach(function(title) {
    var original = title.textContent;
    var animating = false;

    var parent = title.closest('.eng-principle-card') || title.closest('.eng-docs-card') || title.closest('.eng-system-card');
    if (!parent) return;

    parent.addEventListener('mouseenter', function() {
      if (animating) return;
      animating = true;
      var iteration = 0;

      var interval = setInterval(function() {
        title.textContent = original.split('').map(function(char, i) {
          if (i < iteration) return original[i];
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

/* ═══════════════════════════════════════════════════════════════════════════
   STAT COUNT UP - Animate numbers on scroll
   ═══════════════════════════════════════════════════════════════════════════ */
function initStatCountUp() {
  var numbers = document.querySelectorAll('.eng-stat__number[data-count]');
  if (!numbers.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 1500;
        var start = performance.now();

        function animate(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target;
          }
        }
        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  numbers.forEach(function(el) { observer.observe(el); });
}

/* ═══════════════════════════════════════════════════════════════════════════
   STRIDE TABLE - Row-by-row reveal on scroll
   ═══════════════════════════════════════════════════════════════════════════ */
function initStrideTableReveal() {
  var rows = document.querySelectorAll('.eng-stride-row');
  if (!rows.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Stagger the reveal of each row
        var row = entry.target;
        var allRows = document.querySelectorAll('.eng-stride-row');
        var rowIndex = Array.prototype.indexOf.call(allRows, row);
        setTimeout(function() {
          row.classList.add('active');
        }, rowIndex * 120);
        observer.unobserve(row);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  rows.forEach(function(row) { observer.observe(row); });
}

/* ═══════════════════════════════════════════════════════════════════════════
   SVG DIAGRAMS - Draw-in animation on scroll
   ═══════════════════════════════════════════════════════════════════════════ */
function initSVGDiagrams() {
  var diagrams = document.querySelectorAll('.eng-diagram');
  if (!diagrams.length) return;

  // Initialize SVG elements for draw animation
  diagrams.forEach(function(diagram) {
    var lines = diagram.querySelectorAll('line.svg-draw');
    lines.forEach(function(line) {
      var length = getLineLength(line);
      line.style.strokeDasharray = length;
      line.style.strokeDashoffset = length;
    });
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var diagram = entry.target;

        // Reveal circles/rects first
        var shapes = diagram.querySelectorAll('circle.svg-draw, rect.svg-draw');
        shapes.forEach(function(shape, i) {
          setTimeout(function() {
            shape.style.opacity = '1';
            shape.style.transform = 'scale(1)';
          }, i * 100);
        });

        // Then draw lines
        var lines = diagram.querySelectorAll('line.svg-draw');
        setTimeout(function() {
          lines.forEach(function(line, i) {
            setTimeout(function() {
              line.style.opacity = '1';
              line.style.strokeDashoffset = '0';
              line.style.transition = 'stroke-dashoffset 0.8s ease, opacity 0.4s ease';
            }, i * 150);
          });
        }, shapes.length * 80);

        // Reveal text
        var texts = diagram.querySelectorAll('text');
        setTimeout(function() {
          texts.forEach(function(text, i) {
            setTimeout(function() {
              text.style.opacity = '1';
            }, i * 50);
          });
        }, 300);

        diagram.classList.add('active');
        observer.unobserve(diagram);
      }
    });
  }, { threshold: 0.2 });

  diagrams.forEach(function(diagram) {
    // Hide texts initially
    diagram.querySelectorAll('text').forEach(function(text) {
      text.style.opacity = '0';
      text.style.transition = 'opacity 0.5s ease';
    });
    observer.observe(diagram);
  });
}

/**
 * Calculate the length of an SVG line element
 * @param {SVGLineElement} line
 * @returns {number}
 */
function getLineLength(line) {
  var x1 = parseFloat(line.getAttribute('x1') || 0);
  var y1 = parseFloat(line.getAttribute('y1') || 0);
  var x2 = parseFloat(line.getAttribute('x2') || 0);
  var y2 = parseFloat(line.getAttribute('y2') || 0);
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
