/* ═══════════════════════════════════════════════════════════════════════════
   WEB3 ENGINEERING PAGE SCRIPTS
   Network canvas, architecture popover, deep dive toggles, tokenomics
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  window.__tiltSelectors = ['.w3-project-card', '.w3-deepdive-card', '.w3-tokenomics__legend-item', '.w3-concept-tag'];

  initNetworkCanvas();
  initArchPopover();
  initDeepDiveToggles();
  initTokenomicsHover();
  initCountUp();
});

/* ═══════════════════════════════════════════════════════════════════════════
   NETWORK CANVAS — Blockchain node graph background
   ═══════════════════════════════════════════════════════════════════════════ */
function initNetworkCanvas() {
  var canvas = document.getElementById('networkCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var nodes = [];
  var nodeCount = Math.min(40, Math.floor(window.innerWidth / 30));

  for (var i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 1.5 + Math.random() * 1.5
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          var alpha = (1 - dist / 180) * 0.08;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = 'rgba(139, 92, 246, ' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (var k = 0; k < nodes.length; k++) {
      var n = nodes[k];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
      ctx.fill();

      // Move
      n.x += n.vx;
      n.y += n.vy;

      // Bounce
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHITECTURE POPOVER
   ═══════════════════════════════════════════════════════════════════════════ */
function initArchPopover() {
  var popover = document.getElementById('archPopover');
  var popoverContent = document.getElementById('archPopoverContent');
  var nodes = document.querySelectorAll('.w3-arch__node[data-info]');
  if (!popover || !popoverContent || !nodes.length) return;

  nodes.forEach(function(node) {
    node.addEventListener('click', function(e) {
      e.stopPropagation();
      var info = node.getAttribute('data-info');
      popoverContent.textContent = info;

      // Position near the clicked node
      var rect = node.getBoundingClientRect();
      var parentRect = node.closest('.w3-arch').getBoundingClientRect();
      var left = rect.left - parentRect.left + rect.width / 2;
      popover.style.left = left + 'px';

      popover.classList.toggle('visible');
    });

    node.addEventListener('mouseenter', function() {
      var info = node.getAttribute('data-info');
      popoverContent.textContent = info;

      var rect = node.getBoundingClientRect();
      var parentRect = node.closest('.w3-arch').getBoundingClientRect();
      var left = rect.left - parentRect.left + rect.width / 2;
      popover.style.left = left + 'px';

      popover.classList.add('visible');
    });

    node.addEventListener('mouseleave', function() {
      popover.classList.remove('visible');
    });
  });

  document.addEventListener('click', function() {
    popover.classList.remove('visible');
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   DEEP DIVE TOGGLES — Vulnerable/Secure switch
   ═══════════════════════════════════════════════════════════════════════════ */
function initDeepDiveToggles() {
  document.querySelectorAll('.w3-deepdive-card').forEach(function(card) {
    var btns = card.querySelectorAll('.w3-deepdive-toggle__btn');
    var vulnCode = card.querySelector('.w3-deepdive-code--vuln');
    var secureCode = card.querySelector('.w3-deepdive-code--secure');

    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var mode = btn.getAttribute('data-mode');

        // Update active button
        btns.forEach(function(b) { b.classList.remove('w3-deepdive-toggle__btn--active'); });
        btn.classList.add('w3-deepdive-toggle__btn--active');

        // Toggle code blocks
        if (mode === 'vuln') {
          if (vulnCode) vulnCode.classList.add('active');
          if (secureCode) secureCode.classList.remove('active');
        } else {
          if (vulnCode) vulnCode.classList.remove('active');
          if (secureCode) secureCode.classList.add('active');
        }

        // Re-trigger line animation for newly shown block
        var activeBlock = card.querySelector('.w3-deepdive-code.active .code-block__body');
        if (activeBlock) {
          activeBlock.querySelectorAll('.line').forEach(function(line, i) {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-10px)';
            setTimeout(function() {
              line.style.opacity = '1';
              line.style.transform = 'translateX(0)';
            }, i * 50);
          });
        }
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOKENOMICS HOVER — Interactive chart
   ═══════════════════════════════════════════════════════════════════════════ */
function initTokenomicsHover() {
  var segments = document.querySelectorAll('.w3-tokenomics__segment');
  var legendItems = document.querySelectorAll('.w3-tokenomics__legend-item');
  var centerLabel = document.getElementById('tokenLabel');
  var centerValue = document.getElementById('tokenValue');

  function highlight(segmentLabel) {
    segments.forEach(function(seg) {
      var label = seg.getAttribute('data-label');
      seg.style.opacity = (label === segmentLabel) ? '1' : '0.3';
    });
    legendItems.forEach(function(item) {
      var label = item.getAttribute('data-segment');
      item.style.opacity = (label === segmentLabel) ? '1' : '0.4';
    });
  }

  function reset() {
    segments.forEach(function(seg) { seg.style.opacity = '1'; });
    legendItems.forEach(function(item) { item.style.opacity = '1'; });
    if (centerLabel) centerLabel.textContent = 'AEDSC';
    if (centerValue) centerValue.textContent = '100%';
  }

  segments.forEach(function(seg) {
    seg.addEventListener('mouseenter', function() {
      var label = seg.getAttribute('data-label');
      var percent = seg.getAttribute('data-percent');
      highlight(label);
      if (centerLabel) centerLabel.textContent = label;
      if (centerValue) centerValue.textContent = percent + '%';
    });
    seg.addEventListener('mouseleave', reset);
  });

  legendItems.forEach(function(item) {
    item.addEventListener('mouseenter', function() {
      var label = item.getAttribute('data-segment');
      highlight(label);
      segments.forEach(function(seg) {
        if (seg.getAttribute('data-label') === label) {
          if (centerLabel) centerLabel.textContent = label;
          if (centerValue) centerValue.textContent = seg.getAttribute('data-percent') + '%';
        }
      });
    });
    item.addEventListener('mouseleave', reset);
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   COUNT UP — Animate stat numbers
   ═══════════════════════════════════════════════════════════════════════════ */
function initCountUp() {
  var numbers = document.querySelectorAll('[data-count]');
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
