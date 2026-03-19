/* ═══════════════════════════════════════════════════════════════════════════
   INFRASTRUCTURE & DEVOPS PAGE SCRIPTS
   Pipeline animation, git diagram, metrics, scroll reveals, loader
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  window.__tiltSelectors = ['.infra-release-card', '.rpc-card', '.monitoring-card', '.perf-card', '.pipeline__step', '.alert-channel'];

  initStatCountUp();
  initPipelineAnimation();
  initGitDiagramAnimation();
  initLighthouseScores();
  initUptimeBars();
  initSizeBarAnimation();
  initPerfCounters();
});

/* ═══════════════════════════════════════════════════════════════════════════
   STAT COUNT UP - Animate hero numbers
   ═══════════════════════════════════════════════════════════════════════════ */
function initStatCountUp() {
  var numbers = document.querySelectorAll('.infra-stat__number[data-count]');
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
   PIPELINE ANIMATION - Sequential step reveal
   ═══════════════════════════════════════════════════════════════════════════ */
function initPipelineAnimation() {
  var pipeline = document.getElementById('pipeline-viz');
  if (!pipeline) return;

  var steps = pipeline.querySelectorAll('.pipeline__step');
  var connectors = pipeline.querySelectorAll('.pipeline__connector');

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animatePipeline(steps, connectors);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(pipeline);
}

function animatePipeline(steps, connectors) {
  var delay = 0;
  var stepDuration = 400;
  var connectorDuration = 200;

  steps.forEach(function(step, index) {
    // Reveal step
    setTimeout(function() {
      step.classList.add('active');
      step.classList.add('running');

      // After a brief moment, mark as completed
      setTimeout(function() {
        step.classList.remove('running');
        step.classList.add('completed');

        // Activate the connector after this step
        if (connectors[index]) {
          connectors[index].classList.add('active');
        }
      }, stepDuration);
    }, delay);

    delay += stepDuration + connectorDuration;
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   GIT DIAGRAM ANIMATION - Draw branches and reveal commits
   ═══════════════════════════════════════════════════════════════════════════ */
function initGitDiagramAnimation() {
  var diagram = document.getElementById('gitDiagram');
  if (!diagram) return;

  var branches = diagram.querySelectorAll('.git-branch');
  var arrows = diagram.querySelectorAll('.git-arrow');

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateGitDiagram(branches, arrows);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(diagram);
}

function animateGitDiagram(branches, arrows) {
  var branchDelay = 0;

  branches.forEach(function(branch, branchIndex) {
    // Animate the branch line
    setTimeout(function() {
      branch.classList.add('animated');

      // Reveal commits one by one
      var commits = branch.querySelectorAll('.git-commit');
      commits.forEach(function(commit, commitIndex) {
        setTimeout(function() {
          commit.classList.add('visible');
        }, (commitIndex + 1) * 200);
      });
    }, branchDelay);

    branchDelay += 500;
  });

  // Show merge arrows after all branches are drawn
  setTimeout(function() {
    arrows.forEach(function(arrow, i) {
      setTimeout(function() {
        arrow.classList.add('visible');
      }, i * 300);
    });
  }, branchDelay + 200);
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIGHTHOUSE SCORES - Circular progress ring animation
   ═══════════════════════════════════════════════════════════════════════════ */
function initLighthouseScores() {
  var scores = document.querySelectorAll('.perf-score');
  if (!scores.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateScore(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  scores.forEach(function(score) { observer.observe(score); });
}

function animateScore(scoreEl) {
  var scoreValue = parseInt(scoreEl.getAttribute('data-score'), 10);
  var ringFill = scoreEl.querySelector('.perf-score__ring-fill');
  var valueEl = scoreEl.querySelector('.perf-score__value');

  if (!ringFill || !valueEl) return;

  // Circle circumference = 2 * PI * r = 2 * PI * 52 = ~326.73
  var circumference = 326.73;
  var targetOffset = circumference - (scoreValue / 100) * circumference;

  // Set color based on score
  var color;
  if (scoreValue >= 90) {
    color = 'var(--green)';
  } else if (scoreValue >= 50) {
    color = 'var(--gold)';
  } else {
    color = 'var(--red)';
  }

  ringFill.style.stroke = color;
  valueEl.style.color = color;

  // Animate the ring
  requestAnimationFrame(function() {
    ringFill.style.strokeDashoffset = targetOffset;
  });

  // Animate the number
  var duration = 1500;
  var start = performance.now();

  function animate(now) {
    var elapsed = now - start;
    var progress = Math.min(elapsed / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    valueEl.textContent = Math.round(eased * scoreValue);
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      valueEl.textContent = scoreValue;
    }
  }
  requestAnimationFrame(animate);
}

/* ═══════════════════════════════════════════════════════════════════════════
   UPTIME BARS - Color and height based on uptime data
   ═══════════════════════════════════════════════════════════════════════════ */
function initUptimeBars() {
  var bars = document.querySelectorAll('.uptime-bar');
  if (!bars.length) return;

  bars.forEach(function(bar) {
    var uptime = parseFloat(bar.getAttribute('data-uptime')) || 0;
    var height = Math.max(4, (uptime / 100) * 32);

    // Set color based on uptime
    if (uptime >= 99.9) {
      bar.style.background = 'var(--green)';
    } else if (uptime >= 99.5) {
      bar.style.background = 'var(--gold)';
    } else {
      bar.style.background = 'var(--red)';
    }

    bar.style.height = height + 'px';
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIZE BAR ANIMATION - Contract size fill
   ═══════════════════════════════════════════════════════════════════════════ */
function initSizeBarAnimation() {
  var fills = document.querySelectorAll('.perf-size-bar__fill');
  if (!fills.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var fill = entry.target;
        var width = fill.getAttribute('data-width');
        if (width) {
          fill.style.width = width + '%';
        }
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(function(fill) { observer.observe(fill); });
}

/* ═══════════════════════════════════════════════════════════════════════════
   PERFORMANCE COUNTERS - Animate decimal counters
   ═══════════════════════════════════════════════════════════════════════════ */
function initPerfCounters() {
  var counters = document.querySelectorAll('.perf-counter');
  if (!counters.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var duration = 1500;
        var start = performance.now();
        var hasDecimal = String(target).includes('.');

        function animate(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = eased * target;

          if (hasDecimal) {
            el.textContent = current.toFixed(1);
          } else {
            el.textContent = Math.round(current);
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = hasDecimal ? target.toFixed(1) : target;
          }
        }
        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(el) { observer.observe(el); });
}
